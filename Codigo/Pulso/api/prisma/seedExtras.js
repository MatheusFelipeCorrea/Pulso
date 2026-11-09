/**
 * Seeds extras para cobrir módulos que o mega-seed base ainda não preenchia:
 * divisão, chatbot, insights (snapshot + histórico), refinamentos de
 * orçamento/viagem/notificação e grupo demo rico (usado pelo reseed-tester).
 */
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const SEED_SENHA = 'Pulso@123';

function dataNoMes(dia, offsetMes = 0) {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + offsetMes, dia, 12, 0, 0, 0);
}

const BONITO_DESTINO_META = {
    catalogId: 'BR-CGR-bonito',
    iata: 'CGR',
    label: 'Bonito',
    region: 'Mato Grosso do Sul',
    countryCode: 'BR',
    countryName: 'Brasil',
    moedaSugerida: 'BRL',
    domestic: true,
};

const PARIS_DESTINO_META = {
    catalogId: 'FR-CDG-paris',
    iata: 'CDG',
    label: 'Paris',
    region: 'Île-de-France',
    countryCode: 'FR',
    countryName: 'França',
    moedaSugerida: 'EUR',
    domestic: false,
};

const MACAE_DESTINO_META = {
    catalogId: 'BR-GIG-macae',
    iata: 'GIG',
    label: 'Macaé',
    region: 'Rio de Janeiro',
    countryCode: 'BR',
    countryName: 'Brasil',
    moedaSugerida: 'BRL',
    domestic: true,
};

function periodoAtual() {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    return `${y}-${m}`;
}

function mesOffset(offset) {
    const now = new Date();
    const d = new Date(now.getFullYear(), now.getMonth() + offset, 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

/** RF-105+ — divisão igual (ativa) + personalizada (quitada) */
async function seedDivisoesCompletas(usuarioId) {
    const count = await prisma.divisao.count({ where: { usuarioId } });
    if (count > 0) return false;

    await prisma.divisao.create({
        data: {
            usuarioId,
            titulo: 'Churrasco do fim de semana',
            valorTotal: 240,
            tipo: 'IGUAL',
            status: 'ATIVA',
            data: dataNoMes(12, 0),
            icone: 'Flame',
            cor: '#F97316',
            observacao: 'Rateio igual entre 3 amigos',
            participantes: {
                create: [
                    {
                        nome: 'Eu (organizador)',
                        valor: 80,
                        ehOrganizador: true,
                        pagouAConta: true,
                        status: 'PAGO',
                        dataPagamento: dataNoMes(12, 0),
                    },
                    { nome: 'Lucas', valor: 80, status: 'PENDENTE' },
                    { nome: 'Bianca', valor: 80, status: 'PENDENTE' },
                ],
            },
        },
    });

    await prisma.divisao.create({
        data: {
            usuarioId,
            titulo: 'Uber compartilhado',
            valorTotal: 90,
            tipo: 'PERSONALIZADA',
            status: 'QUITADA',
            data: dataNoMes(3, -1),
            quitadaEm: dataNoMes(5, -1),
            icone: 'Car',
            cor: '#3B82F6',
            observacao: 'Já acertado',
            participantes: {
                create: [
                    {
                        nome: 'Eu (organizador)',
                        valor: 45,
                        ehOrganizador: true,
                        pagouAConta: true,
                        status: 'PAGO',
                        dataPagamento: dataNoMes(3, -1),
                    },
                    {
                        nome: 'Rafa',
                        valor: 45,
                        status: 'PAGO',
                        dataPagamento: dataNoMes(5, -1),
                    },
                ],
            },
        },
    });

    console.log('   ✓ 2 divisões (1 ativa IGUAL + 1 quitada PERSONALIZADA)');
    return true;
}

/** RF-057–061 — histórico de conversas do chatbot */
async function seedChatbotDemo(usuarioId) {
    const count = await prisma.conversaChat.count({ where: { usuarioId } });
    if (count > 0) return false;

    const conversa = await prisma.conversaChat.create({
        data: {
            usuarioId,
            titulo: 'Resumo do mês e economia',
            mensagens: {
                create: [
                    {
                        usuarioId,
                        papel: 'user',
                        conteudo: 'Como estão meus gastos com alimentação este mês?',
                        criadoEm: dataNoMes(2, 0),
                    },
                    {
                        usuarioId,
                        papel: 'assistant',
                        conteudo:
                            'Você está dentro do orçamento de Alimentação, mas delivery subiu ~12% vs o mês passado. Dá para economizar trocando 2 jantares por marmita do RU.',
                        criadoEm: dataNoMes(2, 0),
                    },
                    {
                        usuarioId,
                        papel: 'user',
                        conteudo: 'Lança uma despesa de R$ 28 no VR: almoço no RU',
                        criadoEm: dataNoMes(3, 0),
                    },
                    {
                        usuarioId,
                        papel: 'assistant',
                        conteudo:
                            'Posso lançar essa despesa.\n<!--PROPOSTA_TX:{"tipo":"DESPESA","valor":28,"descricao":"Almoço no RU","recurso":"VR","categoriaNome":"Alimentação"}-->',
                        criadoEm: dataNoMes(3, 0),
                    },
                ],
            },
        },
    });

    await prisma.conversaChat.create({
        data: {
            usuarioId,
            titulo: 'Metas e reserva',
            mensagens: {
                create: [
                    {
                        usuarioId,
                        papel: 'user',
                        conteudo: 'Quanto falta pra meta da viagem a Bonito?',
                    },
                    {
                        usuarioId,
                        papel: 'assistant',
                        conteudo:
                            'A meta "Viagem para Bonito" está com R$ 800 de R$ 2.500 (32%). Mantendo aportes de R$ 400/mês, você chega perto do prazo.',
                    },
                ],
            },
        },
    });

    console.log(`   ✓ Chatbot: 2 conversas (incl. proposta de tx) · id ${conversa.id.slice(0, 8)}…`);
    return true;
}

/** RF-048–055 — snapshot + histórico de score para a tela Insights abrir populada */
async function seedInsightsDemo(usuarioId) {
    const mes = periodoAtual();
    const existente = await prisma.insightSnapshot.findUnique({
        where: { usuarioId_mesReferencia: { usuarioId, mesReferencia: mes } },
    });
    if (existente) return false;

    const payload = {
        mesReferencia: mes,
        resumoMensal:
            'Seu mês está no azul: as receitas cobrem as despesas e sobra margem para a reserva. Alimentação e transporte estão sob controle; o ponto de atenção é manter o ritmo de aportes nas metas ativas.',
        variacaoCategorias: [
            {
                categoria: 'Alimentação',
                percentual: 8,
                atual: 420,
                anterior: 389,
                comentario: 'Leve alta em delivery — ainda dentro do orçamento.',
            },
            {
                categoria: 'Transporte',
                percentual: -5,
                atual: 110,
                anterior: 116,
                comentario: 'Menos Uber esta semana; bom sinal.',
            },
            {
                categoria: 'Lazer',
                percentual: 15,
                atual: 95,
                anterior: 82,
                comentario: 'Cinema e bar puxaram um pouco o limite.',
            },
        ],
        score: {
            valor: 78,
            label: 'Bom',
            checklist: [
                {
                    id: 'fluxo',
                    ok: true,
                    texto: 'Receitas cobrem as despesas do mês',
                },
                {
                    id: 'orcamento',
                    ok: true,
                    texto: 'Nenhuma categoria de orçamento estourou o limite',
                },
                {
                    id: 'metas',
                    ok: true,
                    texto: 'Há progresso nas metas ativas',
                },
                {
                    id: 'registro',
                    ok: true,
                    texto: 'Há lançamentos registrados no mês',
                },
            ],
            fatores: { saldoPositivo: true, estourados: 0, progressoMedio: 40 },
        },
        projecoes: [
            {
                id: 'otimista',
                label: 'Otimista',
                descricao: 'Se você economizar 15% a mais nas despesas',
                saldoMensalEstimado: 2800,
                acumulado: { '3': 8400, '6': 16800, '12': 33600 },
            },
            {
                id: 'atual',
                label: 'Atual',
                descricao: 'Mantendo o ritmo atual',
                saldoMensalEstimado: 2400,
                acumulado: { '3': 7200, '6': 14400, '12': 28800 },
            },
            {
                id: 'pessimista',
                label: 'Pessimista',
                descricao: 'Se os gastos subirem 10%',
                saldoMensalEstimado: 1800,
                acumulado: { '3': 5400, '6': 10800, '12': 21600 },
            },
        ],
        diasAteNegativo: null,
        sugestoes: [
            {
                id: 's1',
                titulo: 'Troque 2 deliveries por RU',
                descricao: 'Economia estimada de ~R$ 80/mês sem perder praticidade no campus.',
                impactoEstimado: 'R$ 80/mês',
                acaoPath: '/budget',
            },
            {
                id: 's2',
                titulo: 'Aporte automático na meta Bonito',
                descricao: 'Reserve R$ 400 no dia 5, junto com a bolsa, para não esquecer.',
                impactoEstimado: 'R$ 400/mês',
                acaoPath: '/goals',
            },
        ],
        alertas: [
            {
                tipo: 'cobertura_va',
                severidade: 'info',
                mensagem: 'No ritmo atual, o Vale Alimentação dura até o fim do mês.',
            },
        ],
        educacao: [
            {
                tipo: 'artigo',
                titulo: 'Como montar uma reserva de emergência',
                url: 'https://www.bcb.gov.br/cidadaniafinanceira',
                motivo: 'Você já guarda na poupança — vale reforçar o hábito.',
                verificarUrl: false,
            },
        ],
        fluxo: { receitas: 5600, despesas: 3200, saldo: 2400 },
        geradoEm: new Date().toISOString(),
    };

    await prisma.insightSnapshot.create({
        data: {
            usuarioId,
            mesReferencia: mes,
            payload,
            geradoPor: 'seed',
            regeneracoes: 0,
        },
    });

    const historico = [
        { offset: -5, score: 62, label: 'Regular' },
        { offset: -4, score: 68, label: 'Bom' },
        { offset: -3, score: 71, label: 'Bom' },
        { offset: -2, score: 74, label: 'Bom' },
        { offset: -1, score: 76, label: 'Bom' },
        { offset: 0, score: 78, label: 'Bom' },
    ];

    for (const h of historico) {
        await prisma.historicoScore.create({
            data: {
                usuarioId,
                score: h.score,
                detalhes: { label: h.label, mesReferencia: mesOffset(h.offset), origem: 'seed' },
                criadoEm: dataNoMes(28, h.offset),
            },
        });
    }

    console.log('   ✓ Insights: 1 snapshot do mês + 6 históricos de score');
    return true;
}

/** Rollover ativo no mês atual (Alimentação) + destinoMeta nas viagens */
async function seedRefinosViagemOrcamento(usuarioId) {
    const alimentacao = await prisma.categoria.findFirst({
        where: { usuarioId, nome: 'Alimentação', tipo: 'DESPESA' },
    });
    if (alimentacao) {
        await prisma.orcamento.updateMany({
            where: {
                usuarioId,
                categoriaId: alimentacao.id,
                mesReferencia: dataNoMes(1, 0),
            },
            data: { rolloverAtivo: true, valorRollover: 45.5 },
        });
    }

    await prisma.viagem.updateMany({
        where: { usuarioId, destino: 'Bonito - MS' },
        data: { destinoMeta: BONITO_DESTINO_META },
    });
    await prisma.viagem.updateMany({
        where: { usuarioId, destino: { contains: 'Paris' } },
        data: { destinoMeta: PARIS_DESTINO_META },
    });

    console.log('   ✓ Orçamento com rollover + destinoMeta nas viagens');
    return true;
}

/** Marca parte das notificações como lidas e alinha mensagem de grupo ao PULSO-TEST */
async function seedNotificacoesRefino(usuarioId) {
    const todas = await prisma.notificacao.findMany({
        where: { usuarioId },
        orderBy: { criadoEm: 'asc' },
    });
    if (todas.length === 0) return false;

    const paraLer = todas.slice(0, Math.min(3, todas.length));
    await prisma.notificacao.updateMany({
        where: { id: { in: paraLer.map((n) => n.id) } },
        data: { lida: true },
    });

    await prisma.notificacao.updateMany({
        where: { usuarioId, tipo: 'GRUPO_ATIVIDADE' },
        data: {
            mensagem: 'Novo aporte na meta "Juntar pra Macaé" do grupo demo PULSO-TEST',
            linkAcao: '/groups',
        },
    });

    await prisma.notificacao.updateMany({
        where: { usuarioId, tipo: 'INSIGHT_IA' },
        data: { linkAcao: '/insights' },
    });

    console.log('   ✓ Notificações: 3 lidas + textos alinhados ao tester');
    return true;
}

/**
 * Grupo demo rico para o tester: 2 membros, viagem com destinoMeta,
 * despesas de viagem, meta com aporte e chat.
 */
async function seedGrupoTesterCompleto(usuarioId) {
    const existente = await prisma.grupo.findFirst({
        where: { codigoConvite: 'PULSO-TEST' },
    });
    if (existente) {
        await prisma.membroGrupo.deleteMany({ where: { grupoId: existente.id } });
        await prisma.grupo.delete({ where: { id: existente.id } });
    }

    const senhaHash = await bcrypt.hash(SEED_SENHA, 12);
    const amigo = await prisma.usuario.upsert({
        where: { email: 'amigo.tester@pulso.app' },
        update: {
            nome: 'Amigo Tester',
            senhaHash,
            verificado: true,
            configuracoes: {
                update: {
                    modoUso: 'CLT',
                    valorSalario: 3500,
                    diaSalario: 5,
                    plano: 'PREMIUM',
                    tema: 'CLARO',
                },
            },
        },
        create: {
            email: 'amigo.tester@pulso.app',
            nome: 'Amigo Tester',
            senhaHash,
            provedorAuth: 'EMAIL',
            verificado: true,
            configuracoes: {
                create: {
                    modoUso: 'CLT',
                    valorSalario: 3500,
                    diaSalario: 5,
                    plano: 'PREMIUM',
                    tema: 'CLARO',
                },
            },
            sequencia: {
                create: {
                    sequenciaAtual: 0,
                    maiorSequencia: 0,
                    xp: 0,
                    nivel: 'INICIANTE',
                },
            },
        },
    });

    const grupo = await prisma.grupo.create({
        data: {
            nome: 'Grupo Demo Tester',
            descricao: 'Grupo com 2 membros, viagem e meta — cobre UI de grupos no tester',
            codigoConvite: 'PULSO-TEST',
            modoDivisao: 'PRETENSAO',
            criadorId: usuarioId,
            membros: {
                create: [
                    { usuarioId, papel: 'ADMIN' },
                    { usuarioId: amigo.id, papel: 'MEMBRO' },
                ],
            },
            metas: {
                create: [
                    {
                        nome: 'Juntar pra Macaé',
                        valorAlvo: 1650,
                        valorAtual: 620,
                        prazo: new Date(2026, 7, 1, 12, 0, 0),
                        status: 'ATIVA',
                        descricao: 'Meta do grupo demo',
                    },
                ],
            },
            viagens: {
                create: {
                    destino: 'Macaé - RJ',
                    destinoMeta: MACAE_DESTINO_META,
                    moeda: 'BRL',
                    dataPrevista: new Date(2026, 7, 15, 12, 0, 0),
                    despesas: {
                        create: [
                            {
                                categoria: 'TRANSPORTE',
                                descricao: 'Passagem ônibus',
                                valorEstimado: 180,
                                adicionadoPorId: usuarioId,
                            },
                            {
                                categoria: 'HOSPEDAGEM',
                                descricao: 'Airbnb 3 noites',
                                valorEstimado: 720,
                                adicionadoPorId: amigo.id,
                            },
                            {
                                categoria: 'ALIMENTACAO',
                                descricao: 'Restaurantes',
                                valorEstimado: 350,
                                adicionadoPorId: usuarioId,
                            },
                        ],
                    },
                },
            },
        },
        include: { metas: true },
    });

    if (grupo.metas[0]) {
        await prisma.aporteMetaGrupo.createMany({
            data: [
                {
                    metaGrupoId: grupo.metas[0].id,
                    usuarioId,
                    valor: 420,
                    data: new Date(),
                },
                {
                    metaGrupoId: grupo.metas[0].id,
                    usuarioId: amigo.id,
                    valor: 200,
                    data: dataNoMes(10, -1),
                },
            ],
        });
    }

    await prisma.mensagemChatGrupo.createMany({
        data: [
            {
                grupoId: grupo.id,
                usuarioId,
                conteudo: 'Grupo seedado pro tester — bora planejar Macaé!',
            },
            {
                grupoId: grupo.id,
                usuarioId: amigo.id,
                conteudo: 'Fechei o Airbnb, já lancei a pretensão de hospedagem.',
            },
            {
                grupoId: grupo.id,
                usuarioId,
                conteudo: 'Perfeito. Eu cuido das passagens e da comida.',
            },
        ],
    });

    // Segundo grupo no modo IGUAL (só o tester) para exercitar outro modoDivisao
    const igualExistente = await prisma.grupo.findFirst({
        where: { codigoConvite: 'PULSO-IGUAL' },
    });
    if (igualExistente) {
        await prisma.membroGrupo.deleteMany({ where: { grupoId: igualExistente.id } });
        await prisma.grupo.delete({ where: { id: igualExistente.id } });
    }

    await prisma.grupo.create({
        data: {
            nome: 'Contas da República',
            descricao: 'Grupo no modo divisão igual',
            codigoConvite: 'PULSO-IGUAL',
            modoDivisao: 'IGUAL',
            criadorId: usuarioId,
            membros: { create: [{ usuarioId, papel: 'ADMIN' }] },
        },
    });

    console.log('   ✓ Grupos: PULSO-TEST (2 membros + viagem) e PULSO-IGUAL');
    return true;
}

/** Orquestra extras depois do mega-seed pessoal */
async function seedExtrasCompletos(usuarioId) {
    await seedDivisoesCompletas(usuarioId);
    await seedChatbotDemo(usuarioId);
    await seedInsightsDemo(usuarioId);
    await seedRefinosViagemOrcamento(usuarioId);
    await seedNotificacoesRefino(usuarioId);
}

module.exports = {
    seedExtrasCompletos,
    seedGrupoTesterCompleto,
    seedDivisoesCompletas,
    seedChatbotDemo,
    seedInsightsDemo,
};
