const prisma = require('../config/database');
const { parseVencimentoDate } = require('../utils/dateTimezone');
const logger = require('../utils/logger');

const diasNoMes = (year, month) => new Date(year, month, 0).getDate();

const gerarInstanciasMensais = async () => {
    const templates = await prisma.lembrete.findMany({
        where: {
            repetirMensal: true,
            lembreteTemplateId: null,
            pago: false,
        },
    });

    const hoje = new Date();
    const year = hoje.getFullYear();
    const month = hoje.getMonth() + 1;
    const ultimoDia = diasNoMes(year, month);
    let criadas = 0;

    for (const template of templates) {
        const dia = Math.min(template.diaRecorrencia ?? 1, ultimoDia);
        const mesStr = String(month).padStart(2, '0');
        const diaStr = String(dia).padStart(2, '0');
        const dataAlvo = parseVencimentoDate(`${year}-${mesStr}-${diaStr}T12:00:00.000Z`);
        const instanciaExistente = await prisma.lembrete.findFirst({
            where: {
                usuarioId: template.usuarioId,
                dataVencimento: dataAlvo,
                OR: [{ id: template.id }, { lembreteTemplateId: template.id }],
            },
        });

        if (instanciaExistente) continue;

        await prisma.lembrete.create({
            data: {
                usuarioId: template.usuarioId,
                titulo: template.titulo,
                valor: template.valor,
                dataVencimento: dataAlvo,
                antecedencia: template.antecedencia,
                categoria: template.categoria,
                repetirMensal: false,
                diaRecorrencia: null,
                lembreteTemplateId: template.id,
                sincronizado: false,
                googleEventId: null,
            },
        });
        criadas += 1;
    }

    return { criadas, templates: templates.length };
};

// Teto de segurança: mesmo com repetirCadaDias > 0 validado, um lembrete muito
// atrasado não deve gerar milhões de iterações síncronas dentro do job de cron.
const MAX_ITERACOES_AVANCO = 10_000;

/**
 * "Repetir a cada N dias até marcar como pago" — avança a data de vencimento
 * enquanto o lembrete estiver vencido e não pago, para que o job de alertas
 * (reminderAlertService, baseado em dataVencimento - antecedência) volte a notificar.
 */
const avancarRepeticaoPorDias = async () => {
    const hoje = new Date();
    const candidatos = await prisma.lembrete.findMany({
        where: {
            repetirCadaDias: { not: null },
            pago: false,
            dataVencimento: { lt: hoje },
        },
    });

    let avancados = 0;
    for (const lembrete of candidatos) {
        // repetirCadaDias <= 0 nunca deveria chegar ao banco (Zod + constraint de banco),
        // mas sem essa guarda um valor 0/negativo trava o loop abaixo indefinidamente,
        // bloqueando toda a rota de cron (que roda outros jobs na mesma chamada).
        if (!(lembrete.repetirCadaDias > 0)) {
            logger.info(
                `⚠️ Lembrete ${lembrete.id} com repetirCadaDias inválido (${lembrete.repetirCadaDias}) — ignorado`
            );
            continue;
        }

        let novaData = new Date(lembrete.dataVencimento);
        const passoMs = lembrete.repetirCadaDias * 24 * 60 * 60 * 1000;
        let iteracoes = 0;
        while (novaData.getTime() < hoje.getTime() && iteracoes < MAX_ITERACOES_AVANCO) {
            novaData = new Date(novaData.getTime() + passoMs);
            iteracoes += 1;
        }

        if (iteracoes >= MAX_ITERACOES_AVANCO) {
            logger.info(
                `⚠️ Lembrete ${lembrete.id} excedeu o teto de ${MAX_ITERACOES_AVANCO} iterações ao avançar repetição — ignorado nesta execução`
            );
            continue;
        }

        await prisma.lembrete.update({
            where: { id: lembrete.id },
            data: { dataVencimento: novaData },
        });
        avancados += 1;
    }

    return { avancados, candidatos: candidatos.length };
};

const runReminderRecurrenceJob = async () => {
    const resultado = await gerarInstanciasMensais();
    const repeticao = await avancarRepeticaoPorDias();
    logger.info(
        `🔁 Job lembretes recorrentes: ${resultado.criadas} instância(s) criada(s) (${resultado.templates} templates), ${repeticao.avancados} lembrete(s) com repetição por dias avançado(s)`
    );
    return { ...resultado, repeticaoPorDias: repeticao };
};

module.exports = {
    runReminderRecurrenceJob,
    gerarInstanciasMensais,
    avancarRepeticaoPorDias,
};
