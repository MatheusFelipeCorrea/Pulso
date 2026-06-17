// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { DEFAULT_CATEGORIES } = require('../src/constants/defaultCategories');

const prisma = new PrismaClient();

const SEED_SENHA = 'Pulso@123';

/** Usuários demo — cobrem todos os modos de uso e estados de VT */
const SEED_USUARIOS = [
    {
        email: 'matheusfelipecorreasilva@hotmail.com',
        nome: 'Matheus Felipe (Estagiário)',
        modoUso: 'ESTAGIARIO',
        config: {
            valorVt: 220,
            diaVt: 5,
            valorPadraoPassagem: 4.8,
            vtHabilitado: null,
        },
        vtDemo: true,
        transacoesDemo: true,
        descricao: 'VT automático + demo completo (saldo 52)',
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
