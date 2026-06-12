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

const runReminderRecurrenceJob = async () => {
    const resultado = await gerarInstanciasMensais();
    logger.info(
        `🔁 Job lembretes recorrentes: ${resultado.criadas} instância(s) criada(s) (${resultado.templates} templates)`
    );
    return resultado;
};

module.exports = {
    runReminderRecurrenceJob,
    gerarInstanciasMensais,
};
