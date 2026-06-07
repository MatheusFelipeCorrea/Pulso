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

async function main() {
    console.log('🌱 Iniciando seed...\n');

    const senhaHash = await bcrypt.hash(SEED_SENHA, 12);

    for (const perfil of SEED_USUARIOS) {
        console.log(`👤 ${perfil.nome}`);
        console.log(`   ${perfil.email} | ${perfil.modoUso} | VT: ${vtStatusLabel(perfil.modoUso, perfil.config.vtHabilitado)}`);

        const usuario = await upsertSeedUsuario(perfil, senhaHash);
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

    console.log('═══════════════════════════════════════════════════════════');
    console.log(`🔑 Senha de todos os usuários: ${SEED_SENHA}`);
    console.log(`📅 Período VT demo: ${periodoAtual()}`);
    console.log('');
    console.log('Contas para testar:');
    for (const p of SEED_USUARIOS) {
        console.log(`  • ${p.email}`);
        console.log(`    ${p.modoUso} | VT ${vtStatusLabel(p.modoUso, p.config.vtHabilitado)} — ${p.descricao}`);
    }
}

main()
    .catch((e) => {
        console.error('❌ Erro no seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
