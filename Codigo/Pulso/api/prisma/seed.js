// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { DEFAULT_CATEGORIES } = require('../src/constants/defaultCategories');
const notificationService = require('../src/services/notificationService');
const gamificationService = require('../src/services/gamificationService');

const prisma = new PrismaClient();

const SEED_SENHA = 'Pulso@123';
const MATHEUS_EMAIL = 'matheusfelipecorreasilva@hotmail.com';

/** Usuários demo — cobrem todos os modos de uso e estados de VT */
const SEED_USUARIOS = [
    {
        email: MATHEUS_EMAIL,
        nome: 'Matheus Felipe (Estagiário)',
        modoUso: 'ESTAGIARIO',
        config: {
            valorSalario: 1800,
            diaSalario: 5,
            valorVa: 400,
            diaVa: 5,
            valorVr: 550,
            diaVr: 5,
            valorVt: 220,
            diaVt: 5,
            valorPadraoPassagem: 4.8,
            vtHabilitado: null,
            limiteGastos: 1300,
            rendaMensalPlanejada: 2200,
        },
        vtDemo: true,
        // transações e todo o resto das funcionalidades são populadas por seedDadosCompletos() (mega-seed)
        transacoesDemo: false,
        descricao: 'VT automático + dados completos em todas as funcionalidades (saldo VT 52)',
    },
    {
        email: 'demo.clt@pulso.app',
        nome: 'Carla CLT',
        modoUso: 'CLT',
        config: {
            valorVt: 220,
            diaVt: 5,
            valorPadraoPassagem: 4.8,
            vtHabilitado: null,
        },
        vtDemo: true,
        transacoesDemo: true,
        descricao: 'VT automático + demo completo',
    },
    {
        email: 'demo.pj.vt@pulso.app',
        nome: 'Paulo PJ (com VT)',
        modoUso: 'PJ',
        config: {
            valorVt: 220,
            diaVt: 10,
            valorPadraoPassagem: 4.8,
            vtHabilitado: true,
        },
        vtDemo: true,
        transacoesDemo: false,
        descricao: 'PJ optou por VT — tela completa',
    },
    {
        email: 'demo.pj.optin@pulso.app',
        nome: 'Patricia PJ (opt-in)',
        modoUso: 'PJ',
        config: {
            valorVt: 0,
            vtHabilitado: null,
        },
        vtDemo: false,
        transacoesDemo: false,
        descricao: 'PJ sem resposta — pergunta "Você recebe VT?"',
    },
    {
        email: 'demo.pj.sem@pulso.app',
        nome: 'Pedro PJ (sem VT)',
        modoUso: 'PJ',
        config: {
            valorVt: 0,
            vtHabilitado: false,
        },
        vtDemo: false,
        transacoesDemo: false,
        descricao: 'PJ recusou VT — item oculto no menu',
    },
    {
        email: 'demo.pf@pulso.app',
        nome: 'Priscila Pessoa Física',
        modoUso: 'PESSOA_FISICA',
        config: {
            valorVt: 0,
            vtHabilitado: null,
        },
        vtDemo: false,
        transacoesDemo: true,
        descricao: 'PF — VT oculto, redireciona do /transport-voucher',
    },
];

async function seedCategorias(usuarioId) {
    const count = await prisma.categoria.count({ where: { usuarioId } });
    if (count > 0) return prisma.categoria.findMany({ where: { usuarioId } });

    await prisma.categoria.createMany({
        data: DEFAULT_CATEGORIES.map((c) => ({ ...c, padrao: true, usuarioId })),
        skipDuplicates: true,
    });

    return prisma.categoria.findMany({ where: { usuarioId } });
}

function periodoAtual() {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    return `${y}-${m}`;
}

function dataNoMes(dia, offsetMes = 0) {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + offsetMes, dia, 12, 0, 0, 0);
}

/** Data relativa a hoje (para dívidas/lembretes com prazo, não presa ao calendário do mês) */
function emDias(offsetDias) {
    const d = new Date();
    d.setHours(12, 0, 0, 0);
    d.setDate(d.getDate() + offsetDias);
    return d;
}

async function upsertSeedUsuario({ email, nome, modoUso, config }, senhaHash) {
    const configData = {
        modoUso,
        tema: 'CLARO',
        gamificacaoAtiva: true,
        ...config,
    };

    return prisma.usuario.upsert({
        where: { email },
        update: {
            nome,
            senhaHash,
            verificado: true,
            tokenResetSenha: null,
            tokenResetExpira: null,
            configuracoes: {
                update: configData,
            },
        },
        create: {
            nome,
            email,
            senhaHash,
            provedorAuth: 'EMAIL',
            verificado: true,
            configuracoes: {
                create: configData,
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
}

async function seedReceitaVtMensal(usuarioId, byName, valorVt = 220, label = '') {
    const now = new Date();
    const inicio = new Date(now.getFullYear(), now.getMonth(), 1);
    const fim = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    const existente = await prisma.transacao.findFirst({
        where: {
            usuarioId,
            tipo: 'RECEITA',
            recurso: 'VT',
            data: { gte: inicio, lte: fim },
        },
    });

    if (existente) return false;

    const categoriaOutros = byName('Outros', 'RECEITA');
    if (!categoriaOutros) {
        throw new Error('Categoria "Outros" (RECEITA) não encontrada');
    }

    await prisma.transacao.create({
        data: {
            usuarioId,
            categoriaId: categoriaOutros.id,
            tipo: 'RECEITA',
            recurso: 'VT',
            valor: valorVt,
            descricao: 'Vale Transporte mensal',
            data: new Date(now.getFullYear(), now.getMonth(), 5, 12, 0, 0, 0),
        },
    });

    console.log(`   ✅ Receita VT R$ ${valorVt.toFixed(2)}${label ? ` (${label})` : ''}`);
    return true;
}

async function seedTransacoesBase(usuarioId, byName, modoUso) {
    const txCount = await prisma.transacao.count({ where: { usuarioId } });
    if (txCount > 0) return false;

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    const receitas =
        modoUso === 'PESSOA_FISICA'
            ? [
                  {
                      usuarioId,
                      categoriaId: byName('Outros', 'RECEITA').id,
                      tipo: 'RECEITA',
                      recurso: 'DINHEIRO',
                      valor: 5200,
                      descricao: 'Freela design',
                      data: new Date(year, month, 8),
                  },
              ]
            : [
                  {
                      usuarioId,
                      categoriaId: byName('Salário', 'RECEITA').id,
                      tipo: 'RECEITA',
                      recurso: 'DINHEIRO',
                      valor: modoUso === 'PJ' ? 8500 : 3850,
                      descricao: modoUso === 'PJ' ? 'Honorários mensais' : 'Salário mensal',
                      data: new Date(year, month, 5),
                  },
              ];

    await prisma.transacao.createMany({
        data: [
            ...receitas,
            {
                usuarioId,
                categoriaId: byName('Alimentação', 'DESPESA').id,
                tipo: 'DESPESA',
                recurso: modoUso === 'PESSOA_FISICA' ? 'DINHEIRO' : 'VR',
                valor: 25,
                descricao: modoUso === 'PESSOA_FISICA' ? 'Almoço' : 'Almoço no RU',
                data: new Date(year, month, 15),
            },
            {
                usuarioId,
                categoriaId: byName('Compras', 'DESPESA').id,
                tipo: 'DESPESA',
                recurso: 'DINHEIRO',
                valor: 156.8,
                descricao: 'Supermercado',
                data: new Date(year, month, 23),
            },
        ],
    });

    return true;
}

async function seedValeTransporte(usuarioId, byName) {
    const [vendasCount, usosCount] = await Promise.all([
        prisma.vendaVt.count({ where: { usuarioId } }),
        prisma.usoVt.count({ where: { usuarioId } }),
    ]);

    if (vendasCount > 0 && usosCount > 0) return false;

    const categoriaOutros = byName('Outros', 'RECEITA');
    if (!categoriaOutros) {
        throw new Error('Categoria "Outros" (RECEITA) não encontrada');
    }

    const vendasDemo = [
        {
            nomeComprador: 'João',
            dataVenda: dataNoMes(8),
            valorNominal: 22,
            valorRecebido: 20,
        },
        {
            nomeComprador: 'Maria',
            dataVenda: dataNoMes(12),
            valorNominal: 44,
            valorRecebido: 44,
        },
        {
            nomeComprador: 'Pedro',
            dataVenda: dataNoMes(18),
            valorNominal: 22,
            valorRecebido: 23,
        },
        {
            nomeComprador: 'Ana',
            dataVenda: dataNoMes(22),
            valorNominal: 32,
            valorRecebido: 30,
        },
    ];

    const usosDemo = [
        { quantidade: 6, valorPorPassagem: 4.8, data: dataNoMes(6) },
        { quantidade: 4, valorPorPassagem: 4.8, data: dataNoMes(14) },
    ];

    if (vendasCount === 0) {
        for (const venda of vendasDemo) {
            await prisma.$transaction(async (tx) => {
                await tx.vendaVt.create({
                    data: {
                        usuarioId,
                        nomeComprador: venda.nomeComprador,
                        dataVenda: venda.dataVenda,
                        valorNominal: venda.valorNominal,
                        valorRecebido: venda.valorRecebido,
                    },
                });
                await tx.transacao.create({
                    data: {
                        usuarioId,
                        categoriaId: categoriaOutros.id,
                        tipo: 'RECEITA',
                        recurso: 'DINHEIRO',
                        valor: venda.valorRecebido,
                        descricao: `Venda de VT para ${venda.nomeComprador}`,
                        data: venda.dataVenda,
                        recorrente: false,
                    },
                });
            });
        }
        console.log(`   ✅ ${vendasDemo.length} vendas VT`);
    }

    if (usosCount === 0) {
        await prisma.usoVt.createMany({
            data: usosDemo.map((u) => ({ usuarioId, ...u })),
        });
        console.log(`   ✅ ${usosDemo.length} usos VT (10 passagens, R$ 48,00)`);
    }

    return true;
}

// ==========================================
// SEED COMPLETO — matheusfelipecorreasilva@hotmail.com
// Cobre toda funcionalidade já desenvolvida no Pulso (módulos entregues no
// Documentacao/Requisitos/Readme.md). Cada sub-seed é idempotente (verifica
// contagem antes de criar) para permitir rodar o script mais de uma vez.
// ==========================================

async function seedCategoriaPersonalizada(usuarioId) {
    const existente = await prisma.categoria.findFirst({
        where: { usuarioId, nome: 'Curso de Inglês', tipo: 'DESPESA' },
    });
    if (existente) return existente;

    const categoria = await prisma.categoria.create({
        data: {
            usuarioId,
            nome: 'Curso de Inglês',
            icone: 'GraduationCap',
            cor: '#0EA5E9',
            tipo: 'DESPESA',
            padrao: false,
        },
    });

    console.log('   ✅ Categoria personalizada: Curso de Inglês (RF-018)');
    return categoria;
}

async function seedTagsDemo(usuarioId) {
    const existentes = await prisma.tag.findMany({ where: { usuarioId } });
    if (existentes.length > 0) return Object.fromEntries(existentes.map((t) => [t.nome, t]));

    const definicoes = [
        { nome: 'Essencial', icone: 'CheckCircle', cor: '#10B981' },
        { nome: 'Trabalho', icone: 'Briefcase', cor: '#3B82F6' },
        { nome: 'Impulsivo', icone: 'Flame', cor: '#EF4444' },
        { nome: 'Faculdade', icone: 'GraduationCap', cor: '#6366F1' },
    ];

    const tags = await Promise.all(
        definicoes.map((t) => prisma.tag.create({ data: { ...t, usuarioId } }))
    );

    console.log(`   ✅ ${tags.length} tags`);
    return Object.fromEntries(tags.map((t) => [t.nome, t]));
}

/** Cria uma transação e (opcionalmente) vincula tags — usado quando precisamos do id de volta */
async function criarTx(data, tagIds = []) {
    const transacao = await prisma.transacao.create({ data });
    if (tagIds.length) {
        await prisma.transacaoTag.createMany({
            data: tagIds.map((tagId) => ({ transacaoId: transacao.id, tagId })),
        });
    }
    return transacao;
}

/** RF-015 a RF-025, RF-140 (transferência) e RF-141 (histórico p/ sugestão de categoria) */
async function seedTransacoesCompletas(usuarioId, byName, tagsPorNome) {
    // Guard específico (não pelo count total) — RF-059/RF-061 (VT) já criam algumas
    // transações de receita antes desta função rodar, então count>0 sempre seria verdadeiro.
    const jaRodou = await prisma.transacao.findFirst({
        where: { usuarioId, descricao: 'Bolsa estágio' },
    });
    if (jaRodou) return false;

    const base = (tipo, extra) => ({ usuarioId, tipo, recorrente: false, regraRecorrencia: null, ...extra });

    // Receitas (RF-015) — salário dos últimos 3 meses + extras no mês atual
    for (const offsetMes of [-2, -1, 0]) {
        await criarTx(base('RECEITA', {
            categoriaId: byName('Salário', 'RECEITA').id,
            recurso: 'DINHEIRO',
            valor: 1800,
            descricao: 'Bolsa estágio',
            data: dataNoMes(5, offsetMes),
        }));
    }
    await criarTx(
        base('RECEITA', {
            categoriaId: byName('Freelance', 'RECEITA').id,
            recurso: 'DINHEIRO',
            valor: 350,
            descricao: 'Freela de design',
            data: dataNoMes(6, 0),
        }),
        [tagsPorNome.Trabalho.id]
    );
    await criarTx(base('RECEITA', {
        categoriaId: byName('Investimentos', 'RECEITA').id,
        recurso: 'DINHEIRO',
        valor: 45.32,
        descricao: 'Rendimento CDB',
        data: dataNoMes(2, 0),
    }));

    // Despesas (RF-016/RF-017/RF-025 recurso x categoria) — 3 meses de histórico
    const despesasPorMes = {
        '-2': [
            { categoriaId: byName('Alimentação', 'DESPESA').id, recurso: 'VR', valor: 24.9, descricao: 'Almoço no RU', dia: 3 },
            { categoriaId: byName('Alimentação', 'DESPESA').id, recurso: 'VR', valor: 22.5, descricao: 'Almoço no RU', dia: 16 },
            { categoriaId: byName('Alimentação', 'DESPESA').id, recurso: 'DINHEIRO', valor: 68, descricao: 'Jantar com amigos', dia: 18 },
            { categoriaId: byName('Transporte', 'DESPESA').id, recurso: 'VT', valor: 28.8, descricao: 'Passagens da semana', dia: 6 },
            { categoriaId: byName('Transporte', 'DESPESA').id, recurso: 'DINHEIRO', valor: 32, descricao: 'Uber pro trampo', dia: 14 },
            { categoriaId: byName('Compras', 'DESPESA').id, recurso: 'VA', valor: 95.4, descricao: 'Mercado', dia: 9 },
            { categoriaId: byName('Lazer', 'DESPESA').id, recurso: 'DINHEIRO', valor: 45, descricao: 'Cinema', dia: 21 },
            { categoriaId: byName('Saúde', 'DESPESA').id, recurso: 'DINHEIRO', valor: 38, descricao: 'Farmácia', dia: 25 },
        ],
        '-1': [
            { categoriaId: byName('Alimentação', 'DESPESA').id, recurso: 'VR', valor: 26, descricao: 'Almoço no RU', dia: 3 },
            { categoriaId: byName('Alimentação', 'DESPESA').id, recurso: 'VR', valor: 23.9, descricao: 'Almoço no RU', dia: 16 },
            { categoriaId: byName('Alimentação', 'DESPESA').id, recurso: 'DINHEIRO', valor: 74, descricao: 'Jantar com amigos', dia: 18 },
            { categoriaId: byName('Transporte', 'DESPESA').id, recurso: 'VT', valor: 28.8, descricao: 'Passagens da semana', dia: 6 },
            { categoriaId: byName('Transporte', 'DESPESA').id, recurso: 'DINHEIRO', valor: 30, descricao: 'Uber pro trampo', dia: 14 },
            { categoriaId: byName('Compras', 'DESPESA').id, recurso: 'VA', valor: 102.1, descricao: 'Mercado', dia: 9 },
            { categoriaId: byName('Educação', 'DESPESA').id, recurso: 'DINHEIRO', valor: 120, descricao: 'Mensalidade curso de inglês', dia: 20, tags: ['Faculdade'] },
            { categoriaId: byName('Compras', 'DESPESA').id, recurso: 'DINHEIRO', valor: 189.9, descricao: 'Tênis novo', dia: 22, tags: ['Impulsivo'] },
            { categoriaId: byName('Lazer', 'DESPESA').id, recurso: 'DINHEIRO', valor: 50, descricao: 'Cinema', dia: 21 },
            { categoriaId: byName('Saúde', 'DESPESA').id, recurso: 'DINHEIRO', valor: 41, descricao: 'Farmácia', dia: 25 },
        ],
        0: [
            { categoriaId: byName('Alimentação', 'DESPESA').id, recurso: 'VR', valor: 25.5, descricao: 'Almoço no RU', dia: 3 },
            { categoriaId: byName('Alimentação', 'DESPESA').id, recurso: 'VR', valor: 24, descricao: 'Almoço no RU', dia: 7 },
            { categoriaId: byName('Alimentação', 'DESPESA').id, recurso: 'DINHEIRO', valor: 62, descricao: 'Jantar com amigos', dia: 8 },
            { categoriaId: byName('Transporte', 'DESPESA').id, recurso: 'VT', valor: 28.8, descricao: 'Passagens da semana', dia: 6 },
            { categoriaId: byName('Transporte', 'DESPESA').id, recurso: 'DINHEIRO', valor: 18, descricao: 'Uber pro trampo', dia: 4 },
            { categoriaId: byName('Compras', 'DESPESA').id, recurso: 'VA', valor: 88, descricao: 'Mercado', dia: 2 },
            { categoriaId: byName('Educação', 'DESPESA').id, recurso: 'DINHEIRO', valor: 120, descricao: 'Mensalidade curso de inglês', dia: 8, tags: ['Faculdade'] },
            { categoriaId: byName('Lazer', 'DESPESA').id, recurso: 'DINHEIRO', valor: 40, descricao: 'Cinema', dia: 1 },
            { categoriaId: byName('Saúde', 'DESPESA').id, recurso: 'DINHEIRO', valor: 35, descricao: 'Farmácia', dia: 7 },
        ],
    };

    for (const [offsetMes, itens] of Object.entries(despesasPorMes)) {
        for (const item of itens) {
            const { dia, tags = [], ...resto } = item;
            await criarTx(
                base('DESPESA', { ...resto, data: dataNoMes(dia, Number(offsetMes)) }),
                tags.map((nome) => tagsPorNome[nome].id)
            );
        }
    }

    // Contas essenciais (tag "Essencial")
    await criarTx(
        base('DESPESA', {
            categoriaId: byName('Moradia', 'DESPESA').id,
            recurso: 'DINHEIRO',
            valor: 650,
            descricao: 'Aluguel do quarto',
            data: dataNoMes(6, 0),
        }),
        [tagsPorNome.Essencial.id]
    );

    // RF-140 — transferência entre recursos (Dinheiro → Poupança), fora dos totais de receita/despesa
    await criarTx(base('TRANSFERENCIA', {
        categoriaId: null,
        recurso: 'DINHEIRO',
        recursoDestino: 'POUPANCA',
        valor: 300,
        descricao: 'Guardando pra reserva',
        data: dataNoMes(6, 0),
    }));

    // RF-020/RF-021 — transação recorrente (mãe) já com "filhas" geradas nos meses seguintes
    const categoriaAssinaturas = byName('Serviços e Assinaturas', 'DESPESA').id;
    const mae = await criarTx(base('DESPESA', {
        categoriaId: categoriaAssinaturas,
        recurso: 'DINHEIRO',
        valor: 21.9,
        descricao: 'Assinatura Spotify',
        data: dataNoMes(10, -2),
        recorrente: true,
        regraRecorrencia: 'FREQ=MONTHLY;INTERVAL=1',
    }));
    await prisma.transacao.create({
        data: base('DESPESA', {
            categoriaId: categoriaAssinaturas,
            recurso: 'DINHEIRO',
            valor: 21.9,
            descricao: 'Assinatura Spotify',
            data: dataNoMes(10, -1),
            paiId: mae.id,
        }),
    });
    await prisma.transacao.create({
        data: base('DESPESA', {
            categoriaId: categoriaAssinaturas,
            recurso: 'DINHEIRO',
            valor: 21.9,
            descricao: 'Assinatura Spotify',
            data: dataNoMes(5, 0),
            paiId: mae.id,
        }),
    });

    console.log('   ✅ ~30 transações em 3 meses (receitas, despesas, 1 transferência, 1 recorrente com filhas, tags)');
    return true;
}

/** RF-026 a RF-031, RF-043 (vínculo viagem), RF-137 (vínculo planejamento de compra) */
async function seedMetasCompletas(usuarioId) {
    const count = await prisma.meta.count({ where: { usuarioId } });
    if (count > 0) return null;

    const reserva = await prisma.meta.create({
        data: {
            usuarioId,
            nome: 'Reserva de Emergência',
            tipo: 'CURTO_PRAZO',
            status: 'ATIVA',
            prioridade: 'ALTA',
            valorAlvo: 3000,
            valorAtual: 1200,
            prazo: dataNoMes(1, 6),
            descricao: 'Guardar o equivalente a alguns meses de gasto',
            aportes: {
                create: [
                    { valor: 400, data: dataNoMes(10, -2) },
                    { valor: 400, data: dataNoMes(10, -1) },
                    { valor: 400, data: dataNoMes(6, 0) },
                ],
            },
        },
    });

    await prisma.meta.create({
        data: {
            usuarioId,
            nome: 'Trocar de carro',
            tipo: 'LONGO_PRAZO',
            status: 'PAUSADA',
            prioridade: 'BAIXA',
            valorAlvo: 25000,
            valorAtual: 2000,
            prazo: dataNoMes(1, 36),
            aportes: { create: [{ valor: 2000, data: dataNoMes(15, -2) }] },
        },
    });

    const notebook = await prisma.meta.create({
        data: {
            usuarioId,
            nome: 'Notebook novo',
            tipo: 'CURTO_PRAZO',
            status: 'CONCLUIDA',
            prioridade: 'MEDIA',
            valorAlvo: 4500,
            valorAtual: 4500,
            prazo: dataNoMes(28, -1),
            concluidaEm: dataNoMes(20, -1),
            aportes: {
                create: [
                    { valor: 2000, data: dataNoMes(5, -2) },
                    { valor: 2500, data: dataNoMes(20, -1) },
                ],
            },
        },
    });

    await prisma.meta.create({
        data: {
            usuarioId,
            nome: 'Curso de inglês',
            tipo: 'CURTO_PRAZO',
            status: 'ATIVA',
            prioridade: 'MEDIA',
            valorAlvo: 1200,
            valorAtual: 300,
            prazo: dataNoMes(1, 4),
            aportes: { create: [{ valor: 300, data: dataNoMes(8, 0) }] },
        },
    });

    const bonito = await prisma.meta.create({
        data: {
            usuarioId,
            nome: 'Viagem para Bonito',
            tipo: 'CURTO_PRAZO',
            status: 'ATIVA',
            prioridade: 'MEDIA',
            valorAlvo: 2500,
            valorAtual: 800,
            prazo: dataNoMes(1, 5),
            aportes: {
                create: [
                    { valor: 400, data: dataNoMes(12, -1) },
                    { valor: 400, data: dataNoMes(4, 0) },
                ],
            },
        },
    });

    console.log('   ✅ 5 metas pessoais (ativa, pausada, concluída, vínculo compra e viagem)');
    return { reserva, notebook, bonito };
}

/** RF-133 a RF-138 */
async function seedPlanejamentoCompraCompleto(usuarioId, categorias, metaNotebookId) {
    const count = await prisma.itemPlanejamentoCompra.count({ where: { usuarioId } });
    if (count > 0) return false;

    const categoriaTecnologia = categorias.find((c) => c.nome === 'Tecnologia' && c.tipo === 'DESPESA');

    // RF-138 — item comprado gera automaticamente a transação vinculada
    const transacaoNotebook = await prisma.transacao.create({
        data: {
            usuarioId,
            tipo: 'DESPESA',
            recurso: 'DINHEIRO',
            categoriaId: categoriaTecnologia.id,
            valor: 4500,
            descricao: 'Compra: Notebook Dell Inspiron',
            data: dataNoMes(20, -1),
            recorrente: false,
            regraRecorrencia: null,
        },
    });

    await prisma.itemPlanejamentoCompra.create({
        data: {
            usuarioId,
            nome: 'Notebook Dell Inspiron',
            valorEstimado: 4500,
            prioridade: 'MEDIA',
            categoria: 'ELETRONICOS',
            simularParcelas: true,
            parcelas: 10,
            metaId: metaNotebookId,
            status: 'COMPRADO',
            compradoEm: dataNoMes(20, -1),
            transacaoId: transacaoNotebook.id,
        },
    });

    await prisma.itemPlanejamentoCompra.createMany({
        data: [
            { usuarioId, nome: 'iPhone 15', valorEstimado: 5500, prioridade: 'ALTA', categoria: 'ELETRONICOS', simularParcelas: true, parcelas: 10 },
            { usuarioId, nome: 'Sofá novo', valorEstimado: 2200, prioridade: 'MEDIA', categoria: 'CASA_ELETRODOMESTICOS', simularParcelas: true, parcelas: 6 },
            { usuarioId, nome: 'Tênis de corrida', valorEstimado: 450, prioridade: 'BAIXA', categoria: 'VESTUARIO', simularParcelas: true, parcelas: 3 },
        ],
    });

    console.log('   ✅ 4 itens de planejamento de compra (1 comprado com transação vinculada)');
    return true;
}

/** RF-033 a RF-043 — viagens pessoais, despesas por categoria, observações e moedas favoritas */
async function seedViagensPessoaisCompletas(usuarioId, metaBonitoId) {
    const count = await prisma.viagem.count({ where: { usuarioId } });
    if (count > 0) return false;

    await prisma.viagem.create({
        data: {
            usuarioId,
            destino: 'Bonito - MS',
            moeda: 'BRL',
            dataPrevista: dataNoMes(10, 5),
            metaId: metaBonitoId,
            despesas: {
                create: [
                    { categoria: 'TRANSPORTE', descricao: 'Passagem aérea', valorEstimado: 850 },
                    { categoria: 'HOSPEDAGEM', descricao: 'Pousada 5 noites', valorEstimado: 1200 },
                    { categoria: 'PASSEIOS', descricao: 'Gruta do Lago Azul + flutuação', valorEstimado: 600 },
                    { categoria: 'ALIMENTACAO', descricao: 'Restaurantes', valorEstimado: 400 },
                ],
            },
            observacoes: {
                create: [
                    {
                        titulo: 'Checklist de viagem',
                        tipo: 'CHECKLIST',
                        checklist: [
                            { item: 'Reservar passeios com antecedência', feito: true },
                            { item: 'Levar protetor solar biodegradável', feito: false },
                            { item: 'Confirmar pousada', feito: false },
                        ],
                    },
                    {
                        titulo: 'Dica de amigo',
                        tipo: 'DICA',
                        conteudo: 'Vale muito a pena reservar a Gruta do Lago Azul com 2 meses de antecedência!',
                    },
                ],
            },
        },
    });

    await prisma.viagem.create({
        data: {
            usuarioId,
            destino: 'Paris - França',
            moeda: 'EUR',
            dataPrevista: dataNoMes(1, 8),
            despesas: {
                create: [
                    { categoria: 'TRANSPORTE', descricao: 'Passagem aérea internacional', valorEstimado: 4200 },
                    { categoria: 'HOSPEDAGEM', descricao: 'Hostel 6 noites', valorEstimado: 1500 },
                    { categoria: 'DOCUMENTACAO', descricao: 'Seguro viagem', valorEstimado: 250 },
                    { categoria: 'PASSEIOS', descricao: 'Museus e passeios', valorEstimado: 500 },
                ],
            },
            observacoes: {
                create: [
                    {
                        titulo: 'Documentos necessários',
                        tipo: 'DOCUMENTOS',
                        conteudo: 'Passaporte válido, seguro viagem, reserva de hotel',
                    },
                ],
            },
        },
    });

    await prisma.moedaFavorita.createMany({
        data: [
            { usuarioId, codigo: 'USD' },
            { usuarioId, codigo: 'EUR' },
            { usuarioId, codigo: 'ARS' },
        ],
    });

    console.log('   ✅ 2 viagens pessoais (Bonito vinculada a meta, Paris internacional) + 3 moedas favoritas');
    return true;
}

/** RF-054 a RF-058, RF-121 a RF-125 */
async function seedLembretesCompletos(usuarioId) {
    const count = await prisma.lembrete.count({ where: { usuarioId } });
    if (count > 0) return false;

    await prisma.lembrete.createMany({
        data: [
            { usuarioId, titulo: 'Fatura do cartão', categoria: 'FATURA_CARTAO', valor: 890, dataVencimento: dataNoMes(15, 0), antecedencia: 'TRES_DIAS', pago: false },
            { usuarioId, titulo: 'Internet', categoria: 'INTERNET', valor: 99.9, dataVencimento: dataNoMes(20, 0), antecedencia: 'UM_DIA', pago: true, repetirMensal: true, diaRecorrencia: 20 },
            { usuarioId, titulo: 'Assinatura Spotify', categoria: 'STREAMING', valor: 21.9, dataVencimento: dataNoMes(10, 0), antecedencia: 'NO_DIA', pago: true, repetirMensal: true, diaRecorrencia: 10 },
            { usuarioId, titulo: 'Academia', categoria: 'ACADEMIA', valor: 89.9, dataVencimento: dataNoMes(5, 0), antecedencia: 'UM_DIA', pago: true, repetirMensal: true, diaRecorrencia: 5 },
            { usuarioId, titulo: 'IPVA', categoria: 'IPVA', valor: 450, dataVencimento: emDias(20), antecedencia: 'CINCO_DIAS', pago: false },
            { usuarioId, titulo: 'Aniversário da mãe', categoria: 'ANIVERSARIO', dataVencimento: emDias(10), antecedencia: 'UMA_SEMANA', pago: false },
            { usuarioId, titulo: 'Plano de saúde', categoria: 'PLANO_SAUDE', valor: 210, dataVencimento: emDias(-3), antecedencia: 'TRES_DIAS', pago: false },
        ],
    });

    console.log('   ✅ 7 lembretes (pagos, pendentes, recorrentes e 1 atrasado)');
    return true;
}

/** RF-109 a RF-114 */
async function seedOrcamentoCompleto(usuarioId, byName) {
    const count = await prisma.orcamento.count({ where: { usuarioId } });
    if (count > 0) return false;

    const limites = [
        { nome: 'Alimentação', limite: 500 },
        { nome: 'Transporte', limite: 150 },
        { nome: 'Lazer', limite: 100 },
        { nome: 'Compras', limite: 300 },
        { nome: 'Saúde', limite: 150 },
    ];

    await prisma.orcamento.createMany({
        data: limites.flatMap(({ nome, limite }) => [
            { usuarioId, categoriaId: byName(nome, 'DESPESA').id, mesReferencia: dataNoMes(1, 0), limiteValor: limite },
            { usuarioId, categoriaId: byName(nome, 'DESPESA').id, mesReferencia: dataNoMes(1, -1), limiteValor: limite },
        ]),
    });

    console.log('   ✅ Orçamento em 5 categorias (mês atual e anterior)');
    return true;
}

/** RF-126 a RF-132 */
async function seedDividasCompletas(usuarioId) {
    const count = await prisma.divida.count({ where: { usuarioId } });
    if (count > 0) return false;

    await prisma.divida.create({
        data: {
            usuarioId,
            direcao: 'ME_DEVEM',
            nomePessoa: 'João Silva',
            valor: 300,
            dataEmprestimo: dataNoMes(5, -1),
            prazoDevolucao: emDias(10),
            quitada: false,
            observacao: 'Emprestei pra ele pagar a faculdade',
        },
    });

    await prisma.divida.create({
        data: {
            usuarioId,
            direcao: 'ME_DEVEM',
            nomePessoa: 'Ana Costa',
            valor: 150,
            dataEmprestimo: dataNoMes(8, -2),
            prazoDevolucao: dataNoMes(8, -1),
            quitada: false,
        },
    });

    await prisma.divida.create({
        data: {
            usuarioId,
            direcao: 'EU_DEVO',
            nomePessoa: 'Pedro Lima',
            valor: 500,
            dataEmprestimo: dataNoMes(3, -2),
            prazoDevolucao: dataNoMes(3, 0),
            quitada: true,
            dataQuitacao: dataNoMes(3, 0),
            pagamentos: { create: [{ valor: 500, dataPagamento: dataNoMes(3, 0) }] },
        },
    });

    await prisma.divida.create({
        data: {
            usuarioId,
            direcao: 'EU_DEVO',
            nomePessoa: 'Maria (cartão emprestado)',
            valor: 200,
            dataEmprestimo: dataNoMes(2, 0),
            prazoDevolucao: emDias(30),
            quitada: false,
            pagamentos: { create: [{ valor: 80, dataPagamento: dataNoMes(4, 0) }] },
        },
    });

    console.log('   ✅ 4 dívidas (2 a receber — 1 vencendo, 1 atrasada; 2 a pagar — 1 quitada, 1 parcial)');
    return true;
}

/** Amostra de notificações de vários tipos (lidas e não lidas) */
async function seedNotificacoesCompletas(usuarioId, categorias) {
    const count = await prisma.notificacao.count({ where: { usuarioId } });
    if (count > 0) return false;

    const alimentacao = categorias.find((c) => c.nome === 'Alimentação' && c.tipo === 'DESPESA');

    await notificationService.criarNotificacao(usuarioId, {
        tipo: 'RECEITA_REGISTRADA',
        titulo: 'Receita registrada',
        mensagem: 'Bolsa estágio: +R$ 1.800,00',
        linkAcao: '/transactions',
    });
    await notificationService.criarNotificacao(usuarioId, {
        tipo: 'TRANSFERENCIA_REGISTRADA',
        titulo: 'Transferência registrada',
        mensagem: 'Guardando pra reserva: R$ 300,00',
        linkAcao: '/transactions',
    });
    await notificationService.criarNotificacao(usuarioId, {
        tipo: 'ALERTA_ORCAMENTO',
        titulo: 'Alerta orçamento (80%)',
        mensagem: 'Você já usou 82% do orçamento de Alimentação este mês',
        linkAcao: '/budget',
        metadados: { categoriaId: alimentacao.id, mesReferencia: periodoAtual() },
    });
    await notificationService.criarNotificacao(usuarioId, {
        tipo: 'LEMBRETE_VENCIMENTO',
        titulo: 'Lembrete/vencimento',
        mensagem: 'IPVA vence em 5 dias',
        linkAcao: '/calendar',
    });
    await notificationService.criarNotificacao(usuarioId, {
        tipo: 'DIVIDA_COBRANCA',
        titulo: 'Dívida/cobrança',
        mensagem: 'João Silva: dívida vence em 3 dias',
        linkAcao: '/debts',
    });
    await notificationService.criarNotificacao(usuarioId, {
        tipo: 'GRUPO_ATIVIDADE',
        titulo: 'Grupo (atividade)',
        mensagem: 'Maria adicionou uma nova pretensão na Viagem Macaé 2026',
        linkAcao: '/groups',
    });
    await notificationService.criarNotificacao(usuarioId, {
        tipo: 'INSIGHT_IA',
        titulo: 'Insight IA',
        mensagem: 'Seus gastos com Alimentação aumentaram 12% em relação ao mês passado',
        linkAcao: '/dashboard',
    });

    console.log('   ✅ 7 notificações de exemplo (vários tipos)');
    return true;
}

/** RF-079, RF-080, RF-081 — streak, xp e conquistas (via gamificationService, mesma lógica do app) */
async function seedGamificacaoCompleta(usuarioId) {
    await prisma.sequencia.update({
        where: { usuarioId },
        data: { sequenciaAtual: 12, maiorSequencia: 21, nivel: 'CONSCIENTE', ultimaAtividade: new Date() },
    });

    for (const codigo of ['PRIMEIRA_TRANSACAO', 'STREAK_7', 'PRIMEIRA_META']) {
        await gamificationService.desbloquearConquista(usuarioId, codigo);
    }

    console.log('   ✅ Streak (12 dias, recorde 21) + 3 conquistas desbloqueadas');
}

/** Orquestra todo o mega-seed de Matheus, na ordem de dependência entre os módulos */
async function seedDadosCompletos(usuario, categoriasIniciais) {
    console.log('\n   🚀 Populando dados completos de todas as funcionalidades...');

    const categoriaPersonalizada = await seedCategoriaPersonalizada(usuario.id);
    const categorias = [...categoriasIniciais, categoriaPersonalizada];
    const byName = (nome, tipo) => categorias.find((c) => c.nome === nome && c.tipo === tipo);

    const tagsPorNome = await seedTagsDemo(usuario.id);
    const metas = await seedMetasCompletas(usuario.id);
    await seedTransacoesCompletas(usuario.id, byName, tagsPorNome);
    await seedPlanejamentoCompraCompleto(usuario.id, categorias, metas?.notebook?.id ?? null);
    await seedViagensPessoaisCompletas(usuario.id, metas?.bonito?.id ?? null);
    await seedLembretesCompletos(usuario.id);
    await seedOrcamentoCompleto(usuario.id, byName);
    await seedDividasCompletas(usuario.id);
    await seedNotificacoesCompletas(usuario.id, categorias);
    await seedGamificacaoCompleta(usuario.id);
}

function vtStatusLabel(modoUso, vtHabilitado) {
    if (modoUso === 'PESSOA_FISICA') return 'oculto';
    if (modoUso === 'ESTAGIARIO' || modoUso === 'CLT') return 'automático';
    if (vtHabilitado === true) return 'habilitado';
    if (vtHabilitado === false) return 'desabilitado';
    return 'opt-in pendente';
}

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

async function seedGruposDemo(usuariosPorEmail) {
    const matheus = usuariosPorEmail['matheusfelipecorreasilva@hotmail.com'];
    const maria = usuariosPorEmail['demo.clt@pulso.app'];
    const pedro = usuariosPorEmail['demo.pf@pulso.app'];
    const paulo = usuariosPorEmail['demo.pj.vt@pulso.app'];
    const patricia = usuariosPorEmail['demo.pj.optin@pulso.app'];

    if (!matheus || !maria || !pedro) {
        console.log('⚠️  Seed de grupos ignorado — usuários demo incompletos');
        return;
    }

    const demos = [
        {
            codigo: 'PULSO-MC26',
            nome: 'Viagem Macaé 2026',
            descricao: 'Planejamento da viagem em grupo para Macaé — demo completa',
            destino: 'Macaé - RJ',
            destinoMeta: MACAE_DESTINO_META,
            dataViagem: new Date(2026, 7, 15, 12, 0, 0),
            membros: [
                { usuarioId: matheus.id, papel: 'ADMIN' },
                { usuarioId: maria.id, papel: 'MEMBRO' },
                { usuarioId: pedro.id, papel: 'MEMBRO' },
            ],
            despesas: [
                { usuarioId: matheus.id, categoria: 'TRANSPORTE', descricao: 'Vai dirigir', valorEstimado: 200 },
                { usuarioId: matheus.id, categoria: 'HOSPEDAGEM', descricao: '1/3 do airbnb', valorEstimado: 250 },
                { usuarioId: maria.id, categoria: 'HOSPEDAGEM', descricao: '1/3 do airbnb', valorEstimado: 250 },
                { usuarioId: maria.id, categoria: 'ALIMENTACAO', descricao: 'Compras e refeições', valorEstimado: 300 },
                { usuarioId: pedro.id, categoria: 'HOSPEDAGEM', descricao: '1/3 do airbnb', valorEstimado: 250 },
                { usuarioId: pedro.id, categoria: 'PASSEIOS', descricao: 'Ingressos', valorEstimado: 400 },
            ],
            meta: {
                nome: 'Juntar R$ 1.650 pra viagem',
                valorAlvo: 1650,
                valorAtual: 1020,
                prazo: new Date(2026, 7, 1, 12, 0, 0),
                aportes: [
                    { usuarioId: matheus.id, valor: 300, data: new Date(2026, 5, 10, 10, 0, 0) },
                    { usuarioId: maria.id, valor: 320, data: new Date(2026, 5, 12, 14, 30, 0) },
                    { usuarioId: pedro.id, valor: 400, data: new Date(2026, 5, 15, 9, 15, 0) },
                ],
            },
            mensagens: [
                {
                    usuarioId: maria.id,
                    conteudo: 'Já reservei o airbnb, dividimos em 3!',
                    criadoEm: new Date(2026, 5, 8, 9, 42, 0),
                },
                {
                    usuarioId: pedro.id,
                    conteudo: 'Show! Eu cuido dos passeios.',
                    criadoEm: new Date(2026, 5, 8, 12, 0, 0),
                },
                {
                    usuarioId: matheus.id,
                    conteudo: 'Fechado, coloquei o carro de transporte na planilha.',
                    criadoEm: new Date(2026, 5, 8, 21, 27, 0),
                },
            ],
        },
    ];

    if (paulo && patricia) {
        demos.push({
            codigo: 'PULSO-NE26',
            nome: 'Férias Nordeste 2026',
            descricao: 'Grupo maior para testar scroll de membros e pretensões',
            destino: 'Salvador - BA',
            destinoMeta: {
                catalogId: 'BR-SSA-salvador',
                iata: 'SSA',
                label: 'Salvador',
                region: 'Bahia',
                countryCode: 'BR',
                countryName: 'Brasil',
                moedaSugerida: 'BRL',
                domestic: true,
            },
            dataViagem: new Date(2026, 11, 20, 12, 0, 0),
            membros: [
                { usuarioId: matheus.id, papel: 'ADMIN' },
                { usuarioId: maria.id, papel: 'MEMBRO' },
                { usuarioId: pedro.id, papel: 'MEMBRO' },
                { usuarioId: paulo.id, papel: 'MEMBRO' },
                { usuarioId: patricia.id, papel: 'MEMBRO' },
            ],
            despesas: [
                { usuarioId: matheus.id, categoria: 'TRANSPORTE', descricao: 'Passagem aérea', valorEstimado: 890 },
                { usuarioId: matheus.id, categoria: 'HOSPEDAGEM', descricao: 'Hotel 4 noites', valorEstimado: 1200 },
                { usuarioId: maria.id, categoria: 'TRANSPORTE', descricao: 'Passagem aérea', valorEstimado: 920 },
                { usuarioId: maria.id, categoria: 'ALIMENTACAO', descricao: 'Restaurantes', valorEstimado: 450 },
                { usuarioId: pedro.id, categoria: 'HOSPEDAGEM', descricao: 'Hotel 4 noites', valorEstimado: 1200 },
                { usuarioId: pedro.id, categoria: 'PASSEIOS', descricao: 'Pelourinho + praia', valorEstimado: 380 },
                { usuarioId: paulo.id, categoria: 'TRANSPORTE', descricao: 'Uber aeroporto', valorEstimado: 120 },
                { usuarioId: paulo.id, categoria: 'COMPRAS', descricao: 'Souvenirs', valorEstimado: 200 },
                { usuarioId: patricia.id, categoria: 'HOSPEDAGEM', descricao: 'Hotel 4 noites', valorEstimado: 1200 },
                { usuarioId: patricia.id, categoria: 'ENTRETENIMENTO', descricao: 'Shows', valorEstimado: 350 },
            ],
            meta: {
                nome: 'Caixinha da viagem',
                valorAlvo: 8000,
                valorAtual: 2450,
                prazo: new Date(2026, 11, 1, 12, 0, 0),
                aportes: [
                    { usuarioId: matheus.id, valor: 500, data: new Date(2026, 4, 5, 11, 0, 0) },
                    { usuarioId: maria.id, valor: 450, data: new Date(2026, 4, 8, 16, 0, 0) },
                    { usuarioId: pedro.id, valor: 600, data: new Date(2026, 4, 10, 9, 0, 0) },
                    { usuarioId: paulo.id, valor: 400, data: new Date(2026, 4, 12, 13, 0, 0) },
                    { usuarioId: patricia.id, valor: 500, data: new Date(2026, 4, 14, 18, 0, 0) },
                ],
            },
            mensagens: [
                {
                    usuarioId: paulo.id,
                    conteudo: 'Alguém já olhou passagem pra dezembro?',
                    criadoEm: new Date(2026, 4, 20, 8, 15, 0),
                },
                {
                    usuarioId: matheus.id,
                    conteudo: 'Bora fechar hotel essa semana!',
                    criadoEm: new Date(2026, 4, 20, 10, 30, 0),
                },
            ],
        });
    }

    console.log('\n👥 Grupos demo');

    for (const demo of demos) {
        const existente = await prisma.grupo.findUnique({
            where: { codigoConvite: demo.codigo },
        });

        if (existente) {
            console.log(`   ⏭️  ${demo.nome} (${demo.codigo}) já existe`);
            continue;
        }

        await prisma.grupo.create({
            data: {
                nome: demo.nome,
                descricao: demo.descricao,
                codigoConvite: demo.codigo,
                criadorId: matheus.id,
                membros: {
                    create: demo.membros,
                },
                viagens: {
                    create: {
                        destino: demo.destino,
                        destinoMeta: demo.destinoMeta,
                        moeda: 'BRL',
                        dataPrevista: demo.dataViagem,
                        despesas: {
                            create: demo.despesas.map((item) => ({
                                adicionadoPorId: item.usuarioId,
                                categoria: item.categoria,
                                descricao: item.descricao,
                                valorEstimado: item.valorEstimado,
                            })),
                        },
                    },
                },
                metas: {
                    create: {
                        nome: demo.meta.nome,
                        valorAlvo: demo.meta.valorAlvo,
                        valorAtual: demo.meta.valorAtual,
                        prazo: demo.meta.prazo,
                        status: 'ATIVA',
                        aportes: {
                            create: demo.meta.aportes,
                        },
                    },
                },
                mensagens: {
                    create: demo.mensagens,
                },
            },
        });

        console.log(
            `   ✅ ${demo.nome} (${demo.codigo}) — ${demo.membros.length} membros, ${demo.despesas.length} pretensões`
        );
    }
}

async function main() {
    console.log('🌱 Iniciando seed...\n');

    const senhaHash = await bcrypt.hash(SEED_SENHA, 12);
    const usuariosPorEmail = {};

    for (const perfil of SEED_USUARIOS) {
        console.log(`👤 ${perfil.nome}`);
        console.log(`   ${perfil.email} | ${perfil.modoUso} | VT: ${vtStatusLabel(perfil.modoUso, perfil.config.vtHabilitado)}`);

        const usuario = await upsertSeedUsuario(perfil, senhaHash);
        usuariosPorEmail[perfil.email] = usuario;
        const categorias = await seedCategorias(usuario.id);
        const byName = (nome, tipo) =>
            categorias.find((c) => c.nome === nome && c.tipo === tipo);

        if (perfil.transacoesDemo) {
            const criou = await seedTransacoesBase(usuario.id, byName, perfil.modoUso);
            if (criou) console.log('   ✅ Transações base');
        }

        if (perfil.vtDemo) {
            const valorVt = perfil.config.valorVt ?? 220;
            await seedReceitaVtMensal(usuario.id, byName, valorVt);
            await seedValeTransporte(usuario.id, byName);
            console.log('   📊 Saldo VT esperado: Recebido 220 | Usado 48 | Vendido 120 | Saldo 52');
        }

        if (perfil.email === MATHEUS_EMAIL) {
            await seedDadosCompletos(usuario, categorias);
        }

        console.log(`   → ${perfil.descricao}\n`);
    }

    await seedGruposDemo(usuariosPorEmail);

    console.log('═══════════════════════════════════════════════════════════');
    console.log(`🔑 Senha de todos os usuários: ${SEED_SENHA}`);
    console.log(`📅 Período VT demo: ${periodoAtual()}`);
    console.log('');
    console.log('Contas para testar:');
    for (const p of SEED_USUARIOS) {
        console.log(`  • ${p.email}`);
        console.log(`    ${p.modoUso} | VT ${vtStatusLabel(p.modoUso, p.config.vtHabilitado)} — ${p.descricao}`);
    }
    console.log('');
    console.log('Grupos demo (login como matheusfelipecorreasilva@hotmail.com):');
    console.log('  • Viagem Macaé 2026 — código PULSO-MC26');
    console.log('  • Férias Nordeste 2026 — código PULSO-NE26 (5 membros)');
}

main()
    .catch((e) => {
        console.error('❌ Erro no seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
