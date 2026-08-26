// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { DEFAULT_CATEGORIES } = require('../src/constants/defaultCategories');
const notificationService = require('../src/services/notificationService');

const prisma = new PrismaClient();

const SEED_SENHA = 'Pulso@123';
const MATHEUS_EMAIL = 'matheusfelipecorreasilva@hotmail.com';

/** Vers�o do mega-seed de transa��es � incrementar para for�ar re-popula��o em dev */
const SEED_TX_MEGA_VERSION = 2;
const SEED_TX_MEGA_MARKER = `__PULSO_SEED_MEGA_V${SEED_TX_MEGA_VERSION}__`;
const MESES_HISTORICO_TX = 12;
const TX_BATCH_SIZE = 400;

/** Usu�rios demo TI5 � Free vs Premium */
const SEED_USUARIOS = [
    {
        email: MATHEUS_EMAIL,
        nome: 'Matheus Felipe (Estagi�rio)',
        modoUso: 'ESTAGIARIO',
        config: {
            valorSalario: 1800,
            diaSalario: 5,
            valorVa: 400,
            diaVa: 5,
            valorVr: 550,
            diaVr: 5,
            valorVt: 0,
            diaVt: 5,
            valorPadraoPassagem: null,
            vtHabilitado: null,
            limiteGastos: 1300,
            rendaMensalPlanejada: 2200,
            plano: 'PREMIUM',
        },
        transacoesDemo: false,
        descricao: 'Plano PREMIUM + dados completos (mega-seed)',
    },
    {
        email: 'demo.clt@pulso.app',
        nome: 'Carla CLT',
        modoUso: 'CLT',
        config: {
            valorVt: 0,
            plano: 'PREMIUM',
        },
        transacoesDemo: true,
        descricao: 'Plano PREMIUM + demo completo',
    },
    {
        email: 'demo.pf@pulso.app',
        nome: 'Priscila Pessoa F�sica',
        modoUso: 'PESSOA_FISICA',
        config: {
            valorVt: 0,
            plano: 'FREE',
        },
        transacoesDemo: true,
        descricao: 'Plano FREE � core financeiro',
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

/** Data relativa a hoje (para d�vidas/lembretes com prazo, n�o presa ao calend�rio do m�s) */
function emDias(offsetDias) {
    const d = new Date();
    d.setHours(12, 0, 0, 0);
    d.setDate(d.getDate() + offsetDias);
    return d;
}

/** PRNG determin�stico � mesmos dados a cada execu��o do seed */
function criarRng(seed) {
    let s = seed >>> 0;
    return () => {
        s = (s + 0x6d2b79f5) | 0;
        let t = Math.imul(s ^ (s >>> 15), 1 | s);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

function valorEntre(rng, min, max) {
    return Math.round((min + rng() * (max - min)) * 100) / 100;
}

function escolher(rng, arr) {
    return arr[Math.floor(rng() * arr.length)];
}

function diasNoMes(offsetMes) {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + offsetMes + 1, 0).getDate();
}

function diaValidoNoMes(dia, offsetMes) {
    return Math.min(Math.max(1, dia), diasNoMes(offsetMes));
}

async function inserirTransacoesEmLotes(registros) {
    for (let i = 0; i < registros.length; i += TX_BATCH_SIZE) {
        await prisma.transacao.createMany({
            data: registros.slice(i, i + TX_BATCH_SIZE),
        });
    }
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
                      categoriaId: byName('Sal�rio', 'RECEITA').id,
                      tipo: 'RECEITA',
                      recurso: 'DINHEIRO',
                      valor: modoUso === 'PJ' ? 8500 : 3850,
                      descricao: modoUso === 'PJ' ? 'Honor�rios mensais' : 'Sal�rio mensal',
                      data: new Date(year, month, 5),
                  },
              ];

    await prisma.transacao.createMany({
        data: [
            ...receitas,
            {
                usuarioId,
                categoriaId: byName('Alimenta��o', 'DESPESA').id,
                tipo: 'DESPESA',
                recurso: modoUso === 'PESSOA_FISICA' ? 'DINHEIRO' : 'VR',
                valor: 25,
                descricao: modoUso === 'PESSOA_FISICA' ? 'Almo�o' : 'Almo�o no RU',
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

// ==========================================
// SEED COMPLETO � matheusfelipecorreasilva@hotmail.com
// Cobre toda funcionalidade j� desenvolvida no Pulso (m�dulos entregues no
// Documentacao/01-Produto/Requisitos/Readme.md). Cada sub-seed � idempotente (verifica
// contagem antes de criar) para permitir rodar o script mais de uma vez.
// ==========================================

async function seedCategoriaPersonalizada(usuarioId) {
    const existente = await prisma.categoria.findFirst({
        where: { usuarioId, nome: 'Curso de Ingl�s', tipo: 'DESPESA' },
    });
    if (existente) return existente;

    const categoria = await prisma.categoria.create({
        data: {
            usuarioId,
            nome: 'Curso de Ingl�s',
            icone: 'GraduationCap',
            cor: '#0EA5E9',
            tipo: 'DESPESA',
            padrao: false,
        },
    });

    console.log('   ? Categoria personalizada: Curso de Ingl�s (RF-018)');
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

    console.log(`   ? ${tags.length} tags`);
    return Object.fromEntries(tags.map((t) => [t.nome, t]));
}

/** Cria uma transa��o e (opcionalmente) vincula tags � usado quando precisamos do id de volta */
async function criarTx(data, tagIds = []) {
    const transacao = await prisma.transacao.create({ data });
    if (tagIds.length) {
        await prisma.transacaoTag.createMany({
            data: tagIds.map((tagId) => ({ transacaoId: transacao.id, tagId })),
        });
    }
    return transacao;
}

/** RF-015 a RF-025, RF-140 (transfer�ncia) e RF-141 (hist�rico p/ sugest�o de categoria) */
async function seedTransacoesDemoCuradas(usuarioId, byName, tagsPorNome) {
    const jaRodou = await prisma.transacao.findFirst({
        where: { usuarioId, descricao: 'Bolsa est�gio' },
    });
    if (jaRodou) return false;

    const base = (tipo, extra) => ({ usuarioId, tipo, recorrente: false, regraRecorrencia: null, ...extra });

    // Receitas (RF-015) � sal�rio dos �ltimos 3 meses + extras no m�s atual
    for (const offsetMes of [-2, -1, 0]) {
        await criarTx(base('RECEITA', {
            categoriaId: byName('Sal�rio', 'RECEITA').id,
            recurso: 'DINHEIRO',
            valor: 1800,
            descricao: 'Bolsa est�gio',
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

    // Despesas (RF-016/RF-017/RF-025 recurso x categoria) � 3 meses de hist�rico
    const despesasPorMes = {
        '-2': [
            { categoriaId: byName('Alimenta��o', 'DESPESA').id, recurso: 'VR', valor: 24.9, descricao: 'Almo�o no RU', dia: 3 },
            { categoriaId: byName('Alimenta��o', 'DESPESA').id, recurso: 'VR', valor: 22.5, descricao: 'Almo�o no RU', dia: 16 },
            { categoriaId: byName('Alimenta��o', 'DESPESA').id, recurso: 'DINHEIRO', valor: 68, descricao: 'Jantar com amigos', dia: 18 },
            { categoriaId: byName('Transporte', 'DESPESA').id, recurso: 'DINHEIRO', valor: 28.8, descricao: 'Passagens da semana', dia: 6 },
            { categoriaId: byName('Transporte', 'DESPESA').id, recurso: 'DINHEIRO', valor: 32, descricao: 'Uber pro trampo', dia: 14 },
            { categoriaId: byName('Compras', 'DESPESA').id, recurso: 'VA', valor: 95.4, descricao: 'Mercado', dia: 9 },
            { categoriaId: byName('Lazer', 'DESPESA').id, recurso: 'DINHEIRO', valor: 45, descricao: 'Cinema', dia: 21 },
            { categoriaId: byName('Sa�de', 'DESPESA').id, recurso: 'DINHEIRO', valor: 38, descricao: 'Farm�cia', dia: 25 },
        ],
        '-1': [
            { categoriaId: byName('Alimenta��o', 'DESPESA').id, recurso: 'VR', valor: 26, descricao: 'Almo�o no RU', dia: 3 },
            { categoriaId: byName('Alimenta��o', 'DESPESA').id, recurso: 'VR', valor: 23.9, descricao: 'Almo�o no RU', dia: 16 },
            { categoriaId: byName('Alimenta��o', 'DESPESA').id, recurso: 'DINHEIRO', valor: 74, descricao: 'Jantar com amigos', dia: 18 },
            { categoriaId: byName('Transporte', 'DESPESA').id, recurso: 'DINHEIRO', valor: 28.8, descricao: 'Passagens da semana', dia: 6 },
            { categoriaId: byName('Transporte', 'DESPESA').id, recurso: 'DINHEIRO', valor: 30, descricao: 'Uber pro trampo', dia: 14 },
            { categoriaId: byName('Compras', 'DESPESA').id, recurso: 'VA', valor: 102.1, descricao: 'Mercado', dia: 9 },
            { categoriaId: byName('Educa��o', 'DESPESA').id, recurso: 'DINHEIRO', valor: 120, descricao: 'Mensalidade curso de ingl�s', dia: 20, tags: ['Faculdade'] },
            { categoriaId: byName('Compras', 'DESPESA').id, recurso: 'DINHEIRO', valor: 189.9, descricao: 'T�nis novo', dia: 22, tags: ['Impulsivo'] },
            { categoriaId: byName('Lazer', 'DESPESA').id, recurso: 'DINHEIRO', valor: 50, descricao: 'Cinema', dia: 21 },
            { categoriaId: byName('Sa�de', 'DESPESA').id, recurso: 'DINHEIRO', valor: 41, descricao: 'Farm�cia', dia: 25 },
        ],
        0: [
            { categoriaId: byName('Alimenta��o', 'DESPESA').id, recurso: 'VR', valor: 25.5, descricao: 'Almo�o no RU', dia: 3 },
            { categoriaId: byName('Alimenta��o', 'DESPESA').id, recurso: 'VR', valor: 24, descricao: 'Almo�o no RU', dia: 7 },
            { categoriaId: byName('Alimenta��o', 'DESPESA').id, recurso: 'DINHEIRO', valor: 62, descricao: 'Jantar com amigos', dia: 8 },
            { categoriaId: byName('Transporte', 'DESPESA').id, recurso: 'DINHEIRO', valor: 28.8, descricao: 'Passagens da semana', dia: 6 },
            { categoriaId: byName('Transporte', 'DESPESA').id, recurso: 'DINHEIRO', valor: 18, descricao: 'Uber pro trampo', dia: 4 },
            { categoriaId: byName('Compras', 'DESPESA').id, recurso: 'VA', valor: 88, descricao: 'Mercado', dia: 2 },
            { categoriaId: byName('Educa��o', 'DESPESA').id, recurso: 'DINHEIRO', valor: 120, descricao: 'Mensalidade curso de ingl�s', dia: 8, tags: ['Faculdade'] },
            { categoriaId: byName('Lazer', 'DESPESA').id, recurso: 'DINHEIRO', valor: 40, descricao: 'Cinema', dia: 1 },
            { categoriaId: byName('Sa�de', 'DESPESA').id, recurso: 'DINHEIRO', valor: 35, descricao: 'Farm�cia', dia: 7 },
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

    // RF-140 � transfer�ncia entre recursos (Dinheiro ? Poupan�a), fora dos totais de receita/despesa
    await criarTx(base('TRANSFERENCIA', {
        categoriaId: null,
        recurso: 'DINHEIRO',
        recursoDestino: 'POUPANCA',
        valor: 300,
        descricao: 'Guardando pra reserva',
        data: dataNoMes(6, 0),
    }));

    // RF-020/RF-021 � transa��o recorrente (m�e) j� com "filhas" geradas nos meses seguintes
    const categoriaAssinaturas = byName('Servi�os e Assinaturas', 'DESPESA').id;
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

    console.log('   ? Transa��es curadas (3 meses, transfer�ncia, recorrente, tags)');
    return true;
}

/**
 * Gera ~1.200+ transa��es em 12 meses � receitas de benef�cios, despesas di�rias variadas,
 * assinaturas, transfer�ncias e hist�rico denso para dashboard / listagens / gr�ficos.
 */
async function seedTransacoesMegaVolume(usuarioId, byName) {
    const markerExistente = await prisma.transacao.findFirst({
        where: { usuarioId, descricao: SEED_TX_MEGA_MARKER },
    });
    if (markerExistente) return false;

    const rng = criarRng(42_026);
    const base = (tipo, extra) => ({ usuarioId, tipo, recorrente: false, regraRecorrencia: null, ...extra });
    const registros = [];

    const cat = (nome, tipo) => byName(nome, tipo).id;
    const mesesComBolsaDemo = new Set([-2, -1, 0]);

    const templatesDespesa = [
        { categoria: 'Alimenta��o', recurso: 'VR', descricoes: ['Almo�o no RU', 'Lanche cantina', 'Marmita RU'], min: 21, max: 29 },
        { categoria: 'Alimenta��o', recurso: 'DINHEIRO', descricoes: ['Jantar delivery', 'A�a�', 'Padaria', 'Hamburguer'], min: 28, max: 95 },
        { categoria: 'Transporte', recurso: 'DINHEIRO', descricoes: ['Passagens da semana', 'Metrô + ônibus', 'Ônibus ida/volta'], min: 19.2, max: 38.4 },
        { categoria: 'Transporte', recurso: 'DINHEIRO', descricoes: ['Uber pro trampo', '99 pra faculdade', 'Estacionamento'], min: 12, max: 45 },
        { categoria: 'Compras', recurso: 'VA', descricoes: ['Mercado', 'Feira', 'Produtos de limpeza'], min: 45, max: 180 },
        { categoria: 'Compras', recurso: 'DINHEIRO', descricoes: ['Amazon', 'Shopee', 'Presente'], min: 35, max: 220 },
        { categoria: 'Lazer', recurso: 'DINHEIRO', descricoes: ['Cinema', 'Bar com amigos', 'Show', 'Streaming avulso'], min: 25, max: 120 },
        { categoria: 'Sa�de', recurso: 'DINHEIRO', descricoes: ['Farm�cia', 'Consulta', 'Exame'], min: 25, max: 180 },
        { categoria: 'Educa��o', recurso: 'DINHEIRO', descricoes: ['Material escolar', 'Livro t�cnico', 'Curso online'], min: 35, max: 150 },
        { categoria: 'Vestu�rio', recurso: 'DINHEIRO', descricoes: ['Camiseta', 'Cal�a jeans', 'T�nis'], min: 49, max: 280 },
        { categoria: 'Beleza', recurso: 'DINHEIRO', descricoes: ['Barbearia', 'Produtos skincare'], min: 35, max: 90 },
        { categoria: 'Tecnologia', recurso: 'DINHEIRO', descricoes: ['Cabo USB-C', 'Mouse', 'Capinha'], min: 25, max: 350 },
        { categoria: 'Pet', recurso: 'DINHEIRO', descricoes: ['Ra��o', 'Veterin�rio'], min: 45, max: 160 },
        { categoria: 'Presentes', recurso: 'DINHEIRO', descricoes: ['Anivers�rio', 'Dia das m�es'], min: 50, max: 200 },
        { categoria: 'Fam�lia', recurso: 'DINHEIRO', descricoes: ['Ajuda em casa', 'Visita'], min: 80, max: 250 },
    ];

    const assinaturas = [
        { descricao: 'Netflix', valor: 39.9, dia: 12 },
        { descricao: 'iCloud 50GB', valor: 12.9, dia: 18 },
        { descricao: 'Academia Smart Fit', valor: 89.9, dia: 5 },
        { descricao: 'Spotify Fam�lia', valor: 34.9, dia: 10 },
        { descricao: 'Google One', valor: 11.99, dia: 22 },
    ];

    for (let offsetMes = -(MESES_HISTORICO_TX - 1); offsetMes <= 0; offsetMes++) {
        // Receitas fixas mensais
        if (!mesesComBolsaDemo.has(offsetMes)) {
            registros.push(base('RECEITA', {
                categoriaId: cat('Sal�rio', 'RECEITA'),
                recurso: 'DINHEIRO',
                valor: 1800,
                descricao: 'Bolsa est�gio',
                data: dataNoMes(5, offsetMes),
            }));
        }

        registros.push(
            base('RECEITA', {
                categoriaId: cat('Outros', 'RECEITA'),
                recurso: 'VA',
                valor: 400,
                descricao: 'Vale Alimenta��o mensal',
                data: dataNoMes(5, offsetMes),
            }),
            base('RECEITA', {
                categoriaId: cat('Outros', 'RECEITA'),
                recurso: 'VR',
                valor: 550,
                descricao: 'Vale Refei��o mensal',
                data: dataNoMes(5, offsetMes),
            })
        );

        // Freelance espor�dico (~40% dos meses)
        if (rng() > 0.6) {
            registros.push(base('RECEITA', {
                categoriaId: cat('Freelance', 'RECEITA'),
                recurso: 'DINHEIRO',
                valor: valorEntre(rng, 180, 650),
                descricao: escolher(rng, ['Freela design', 'Landing page cliente', 'Identidade visual', 'Social media']),
                data: dataNoMes(diaValidoNoMes(8 + Math.floor(rng() * 18), offsetMes), offsetMes),
            }));
        }

        // Rendimentos (~25% dos meses)
        if (rng() > 0.75) {
            registros.push(base('RECEITA', {
                categoriaId: cat('Investimentos', 'RECEITA'),
                recurso: 'DINHEIRO',
                valor: valorEntre(rng, 12, 85),
                descricao: escolher(rng, ['Rendimento CDB', 'Dividendos FIIs', 'Juros poupan�a']),
                data: dataNoMes(diaValidoNoMes(1 + Math.floor(rng() * 5), offsetMes), offsetMes),
            }));
        }

        // Moradia + transfer�ncia mensal
        registros.push(
            base('DESPESA', {
                categoriaId: cat('Moradia', 'DESPESA'),
                recurso: 'DINHEIRO',
                valor: 650,
                descricao: 'Aluguel do quarto',
                data: dataNoMes(6, offsetMes),
            }),
            base('TRANSFERENCIA', {
                categoriaId: null,
                recurso: 'DINHEIRO',
                recursoDestino: 'POUPANCA',
                valor: valorEntre(rng, 150, 450),
                descricao: escolher(rng, ['Guardando pra reserva', 'Aporte meta', 'Reserva emerg�ncia']),
                data: dataNoMes(diaValidoNoMes(7 + Math.floor(rng() * 10), offsetMes), offsetMes),
            })
        );

        // Assinaturas
        for (const ass of assinaturas) {
            registros.push(base('DESPESA', {
                categoriaId: cat('Servi�os e Assinaturas', 'DESPESA'),
                recurso: 'DINHEIRO',
                valor: ass.valor,
                descricao: ass.descricao,
                data: dataNoMes(diaValidoNoMes(ass.dia, offsetMes), offsetMes),
            }));
        }

        // Despesas do dia a dia � densidade alta (~60�75 por m�s)
        const qtdDespesas = 60 + Math.floor(rng() * 16);
        for (let i = 0; i < qtdDespesas; i++) {
            const tpl = escolher(rng, templatesDespesa);
            registros.push(base('DESPESA', {
                categoriaId: cat(tpl.categoria, 'DESPESA'),
                recurso: tpl.recurso,
                valor: valorEntre(rng, tpl.min, tpl.max),
                descricao: escolher(rng, tpl.descricoes),
                data: dataNoMes(diaValidoNoMes(1 + Math.floor(rng() * 28), offsetMes), offsetMes),
            }));
        }

        // Picos sazonais (IPVA, presentes natal, viagem)
        if (offsetMes === -2) {
            registros.push(base('DESPESA', {
                categoriaId: cat('Ve�culos', 'DESPESA'),
                recurso: 'DINHEIRO',
                valor: 450,
                descricao: 'IPVA parcela',
                data: dataNoMes(15, offsetMes),
            }));
        }
        if (offsetMes === -1) {
            registros.push(base('DESPESA', {
                categoriaId: cat('Viagem', 'DESPESA'),
                recurso: 'DINHEIRO',
                valor: 890,
                descricao: 'Passagem fim de semana prolongado',
                data: dataNoMes(20, offsetMes),
            }));
        }
        if (offsetMes === 0 && rng() > 0.3) {
            registros.push(base('DESPESA', {
                categoriaId: cat('Finan�as', 'DESPESA'),
                recurso: 'DINHEIRO',
                valor: valorEntre(rng, 35, 120),
                descricao: 'Taxa banc�ria / IOF',
                data: dataNoMes(28, offsetMes),
            }));
        }
    }

    // Marker invis�vel na UI (valor simb�lico) � controle de idempot�ncia
    registros.push(base('RECEITA', {
        categoriaId: cat('Outros', 'RECEITA'),
        recurso: 'DINHEIRO',
        valor: 0.01,
        descricao: SEED_TX_MEGA_MARKER,
        data: dataNoMes(1, -(MESES_HISTORICO_TX - 1)),
    }));

    await inserirTransacoesEmLotes(registros);

    const total = await prisma.transacao.count({ where: { usuarioId } });
    console.log(`   ? Mega-volume: +${registros.length} transa��es (${MESES_HISTORICO_TX} meses) | total usu�rio: ${total}`);
    return true;
}

async function seedTransacoesCompletas(usuarioId, byName, tagsPorNome) {
    await seedTransacoesDemoCuradas(usuarioId, byName, tagsPorNome);
    return seedTransacoesMegaVolume(usuarioId, byName);
}

/** RF-026 a RF-031, RF-043 (v�nculo viagem), RF-137 (v�nculo planejamento de compra) */
async function seedMetasCompletas(usuarioId) {
    const count = await prisma.meta.count({ where: { usuarioId } });
    if (count > 0) return null;

    const reserva = await prisma.meta.create({
        data: {
            usuarioId,
            nome: 'Reserva de Emerg�ncia',
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
            nome: 'Curso de ingl�s',
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

    console.log('   ? 5 metas pessoais (ativa, pausada, conclu�da, v�nculo compra e viagem)');
    return { reserva, notebook, bonito };
}

/** RF-133 a RF-138 */
async function seedPlanejamentoCompraCompleto(usuarioId, categorias, metaNotebookId) {
    const count = await prisma.itemPlanejamentoCompra.count({ where: { usuarioId } });
    if (count > 0) return false;

    const categoriaTecnologia = categorias.find((c) => c.nome === 'Tecnologia' && c.tipo === 'DESPESA');

    // RF-138 � item comprado gera automaticamente a transa��o vinculada
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
            { usuarioId, nome: 'Sof� novo', valorEstimado: 2200, prioridade: 'MEDIA', categoria: 'CASA_ELETRODOMESTICOS', simularParcelas: true, parcelas: 6 },
            { usuarioId, nome: 'T�nis de corrida', valorEstimado: 450, prioridade: 'BAIXA', categoria: 'VESTUARIO', simularParcelas: true, parcelas: 3 },
        ],
    });

    console.log('   ? 4 itens de planejamento de compra (1 comprado com transa��o vinculada)');
    return true;
}

/** RF-033 a RF-043 � viagens pessoais, despesas por categoria, observa��es e moedas favoritas */
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
                    { categoria: 'TRANSPORTE', descricao: 'Passagem a�rea', valorEstimado: 850 },
                    { categoria: 'HOSPEDAGEM', descricao: 'Pousada 5 noites', valorEstimado: 1200 },
                    { categoria: 'PASSEIOS', descricao: 'Gruta do Lago Azul + flutua��o', valorEstimado: 600 },
                    { categoria: 'ALIMENTACAO', descricao: 'Restaurantes', valorEstimado: 400 },
                ],
            },
            observacoes: {
                create: [
                    {
                        titulo: 'Checklist de viagem',
                        tipo: 'CHECKLIST',
                        checklist: [
                            { item: 'Reservar passeios com anteced�ncia', feito: true },
                            { item: 'Levar protetor solar biodegrad�vel', feito: false },
                            { item: 'Confirmar pousada', feito: false },
                        ],
                    },
                    {
                        titulo: 'Dica de amigo',
                        tipo: 'DICA',
                        conteudo: 'Vale muito a pena reservar a Gruta do Lago Azul com 2 meses de anteced�ncia!',
                    },
                ],
            },
        },
    });

    await prisma.viagem.create({
        data: {
            usuarioId,
            destino: 'Paris - Fran�a',
            moeda: 'EUR',
            dataPrevista: dataNoMes(1, 8),
            despesas: {
                create: [
                    { categoria: 'TRANSPORTE', descricao: 'Passagem a�rea internacional', valorEstimado: 4200 },
                    { categoria: 'HOSPEDAGEM', descricao: 'Hostel 6 noites', valorEstimado: 1500 },
                    { categoria: 'DOCUMENTACAO', descricao: 'Seguro viagem', valorEstimado: 250 },
                    { categoria: 'PASSEIOS', descricao: 'Museus e passeios', valorEstimado: 500 },
                ],
            },
            observacoes: {
                create: [
                    {
                        titulo: 'Documentos necess�rios',
                        tipo: 'DOCUMENTOS',
                        conteudo: 'Passaporte v�lido, seguro viagem, reserva de hotel',
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

    console.log('   ? 2 viagens pessoais (Bonito vinculada a meta, Paris internacional) + 3 moedas favoritas');
    return true;
}

/** RF-054 a RF-058, RF-121 a RF-125 */
async function seedLembretesCompletos(usuarioId) {
    const count = await prisma.lembrete.count({ where: { usuarioId } });
    if (count > 0) return false;

    await prisma.lembrete.createMany({
        data: [
            { usuarioId, titulo: 'Fatura do cart�o', categoria: 'FATURA_CARTAO', valor: 890, dataVencimento: dataNoMes(15, 0), antecedencia: 'TRES_DIAS', pago: false },
            { usuarioId, titulo: 'Internet', categoria: 'INTERNET', valor: 99.9, dataVencimento: dataNoMes(20, 0), antecedencia: 'UM_DIA', pago: true, repetirMensal: true, diaRecorrencia: 20 },
            { usuarioId, titulo: 'Assinatura Spotify', categoria: 'STREAMING', valor: 21.9, dataVencimento: dataNoMes(10, 0), antecedencia: 'NO_DIA', pago: true, repetirMensal: true, diaRecorrencia: 10 },
            { usuarioId, titulo: 'Academia', categoria: 'ACADEMIA', valor: 89.9, dataVencimento: dataNoMes(5, 0), antecedencia: 'UM_DIA', pago: true, repetirMensal: true, diaRecorrencia: 5 },
            { usuarioId, titulo: 'IPVA', categoria: 'IPVA', valor: 450, dataVencimento: emDias(20), antecedencia: 'CINCO_DIAS', pago: false },
            { usuarioId, titulo: 'Anivers�rio da m�e', categoria: 'ANIVERSARIO', dataVencimento: emDias(10), antecedencia: 'UMA_SEMANA', pago: false },
            { usuarioId, titulo: 'Plano de sa�de', categoria: 'PLANO_SAUDE', valor: 210, dataVencimento: emDias(-3), antecedencia: 'TRES_DIAS', pago: false },
        ],
    });

    console.log('   ? 7 lembretes (pagos, pendentes, recorrentes e 1 atrasado)');
    return true;
}

/** RF-109 a RF-114 � or�amento em v�rios meses para stress-test de alertas */
async function seedOrcamentoCompleto(usuarioId, byName) {
    const marker = await prisma.orcamento.findFirst({
        where: {
            usuarioId,
            mesReferencia: dataNoMes(1, -(MESES_HISTORICO_TX - 1)),
        },
    });
    if (marker) return false;

    const limites = [
        { nome: 'Alimenta��o', limite: 500 },
        { nome: 'Transporte', limite: 150 },
        { nome: 'Lazer', limite: 100 },
        { nome: 'Compras', limite: 300 },
        { nome: 'Sa�de', limite: 150 },
        { nome: 'Moradia', limite: 700 },
        { nome: 'Educa��o', limite: 200 },
    ];

    const registros = [];
    for (let offsetMes = -(MESES_HISTORICO_TX - 1); offsetMes <= 0; offsetMes++) {
        for (const { nome, limite } of limites) {
            registros.push({
                usuarioId,
                categoriaId: byName(nome, 'DESPESA').id,
                mesReferencia: dataNoMes(1, offsetMes),
                limiteValor: limite,
            });
        }
    }

    await prisma.orcamento.createMany({ data: registros, skipDuplicates: true });

    console.log(`   ? Or�amento em ${limites.length} categorias � ${MESES_HISTORICO_TX} meses (${registros.length} registros)`);
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
            nomePessoa: 'Jo�o Silva',
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
            nomePessoa: 'Maria (cart�o emprestado)',
            valor: 200,
            dataEmprestimo: dataNoMes(2, 0),
            prazoDevolucao: emDias(30),
            quitada: false,
            pagamentos: { create: [{ valor: 80, dataPagamento: dataNoMes(4, 0) }] },
        },
    });

    console.log('   ? 4 d�vidas (2 a receber � 1 vencendo, 1 atrasada; 2 a pagar � 1 quitada, 1 parcial)');
    return true;
}

/** Amostra de notifica��es de v�rios tipos (lidas e n�o lidas) */
async function seedNotificacoesCompletas(usuarioId, categorias) {
    const count = await prisma.notificacao.count({ where: { usuarioId } });
    if (count > 0) return false;

    const alimentacao = categorias.find((c) => c.nome === 'Alimenta��o' && c.tipo === 'DESPESA');

    await notificationService.criarNotificacao(usuarioId, {
        tipo: 'RECEITA_REGISTRADA',
        titulo: 'Receita registrada',
        mensagem: 'Bolsa est�gio: +R$ 1.800,00',
        linkAcao: '/transactions',
    });
    await notificationService.criarNotificacao(usuarioId, {
        tipo: 'TRANSFERENCIA_REGISTRADA',
        titulo: 'Transfer�ncia registrada',
        mensagem: 'Guardando pra reserva: R$ 300,00',
        linkAcao: '/transactions',
    });
    await notificationService.criarNotificacao(usuarioId, {
        tipo: 'ALERTA_ORCAMENTO',
        titulo: 'Alerta or�amento (80%)',
        mensagem: 'Voc� j� usou 82% do or�amento de Alimenta��o este m�s',
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
        titulo: 'D�vida/cobran�a',
        mensagem: 'Jo�o Silva: d�vida vence em 3 dias',
        linkAcao: '/debts',
    });
    await notificationService.criarNotificacao(usuarioId, {
        tipo: 'GRUPO_ATIVIDADE',
        titulo: 'Grupo (atividade)',
        mensagem: 'Maria adicionou uma nova pretens�o na Viagem Maca� 2026',
        linkAcao: '/groups',
    });
    await notificationService.criarNotificacao(usuarioId, {
        tipo: 'INSIGHT_IA',
        titulo: 'Insight IA',
        mensagem: 'Seus gastos com Alimenta��o aumentaram 12% em rela��o ao m�s passado',
        linkAcao: '/dashboard',
    });

    console.log('   ? 7 notifica��es de exemplo (v�rios tipos)');
    return true;
}

/** Orquestra todo o mega-seed de Matheus, na ordem de depend�ncia entre os m�dulos */
async function seedDadosCompletos(usuario, categoriasIniciais) {
    console.log('\n   ?? Populando dados completos de todas as funcionalidades...');

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
}

const MACAE_DESTINO_META = {
    catalogId: 'BR-GIG-macae',
    iata: 'GIG',
    label: 'Maca�',
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
        console.log('??  Seed de grupos ignorado � usu�rios demo incompletos');
        return;
    }

    const demos = [
        {
            codigo: 'PULSO-MC26',
            nome: 'Viagem Maca� 2026',
            descricao: 'Planejamento da viagem em grupo para Maca� � demo completa',
            destino: 'Maca� - RJ',
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
                { usuarioId: maria.id, categoria: 'ALIMENTACAO', descricao: 'Compras e refei��es', valorEstimado: 300 },
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
                    conteudo: 'J� reservei o airbnb, dividimos em 3!',
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
            nome: 'F�rias Nordeste 2026',
            descricao: 'Grupo maior para testar scroll de membros e pretens�es',
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
                { usuarioId: matheus.id, categoria: 'TRANSPORTE', descricao: 'Passagem a�rea', valorEstimado: 890 },
                { usuarioId: matheus.id, categoria: 'HOSPEDAGEM', descricao: 'Hotel 4 noites', valorEstimado: 1200 },
                { usuarioId: maria.id, categoria: 'TRANSPORTE', descricao: 'Passagem a�rea', valorEstimado: 920 },
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
                    conteudo: 'Algu�m j� olhou passagem pra dezembro?',
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

    console.log('\n?? Grupos demo');

    for (const demo of demos) {
        const existente = await prisma.grupo.findUnique({
            where: { codigoConvite: demo.codigo },
        });

        if (existente) {
            console.log(`   ??  ${demo.nome} (${demo.codigo}) j� existe`);
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
            `   ? ${demo.nome} (${demo.codigo}) � ${demo.membros.length} membros, ${demo.despesas.length} pretens�es`
        );
    }
}

async function main() {
    console.log('?? Iniciando seed...\n');

    const senhaHash = await bcrypt.hash(SEED_SENHA, 12);
    const usuariosPorEmail = {};

    for (const perfil of SEED_USUARIOS) {
        console.log(`?? ${perfil.nome}`);
        console.log(`   ${perfil.email} | ${perfil.modoUso}`);

        const usuario = await upsertSeedUsuario(perfil, senhaHash);
        usuariosPorEmail[perfil.email] = usuario;
        const categorias = await seedCategorias(usuario.id);
        const byName = (nome, tipo) =>
            categorias.find((c) => c.nome === nome && c.tipo === tipo);

        if (perfil.transacoesDemo) {
            const criou = await seedTransacoesBase(usuario.id, byName, perfil.modoUso);
            if (criou) console.log('   ? Transa��es base');
        }

        if (perfil.email === MATHEUS_EMAIL) {
            await seedDadosCompletos(usuario, categorias);
        }

        console.log(`   ? ${perfil.descricao}\n`);
    }

    await seedGruposDemo(usuariosPorEmail);

    console.log('-----------------------------------------------------------');
    console.log(`?? Senha de todos os usu�rios: ${SEED_SENHA}`);
    console.log('');
    console.log('Contas para testar:');
    for (const p of SEED_USUARIOS) {
        console.log(`  � ${p.email}`);
        console.log(`    ${p.modoUso} — ${p.descricao}`);
    }
    console.log('');
    console.log('Grupos demo (login como matheusfelipecorreasilva@hotmail.com):');
    console.log('  � Viagem Maca� 2026 � c�digo PULSO-MC26');
    console.log('  � F�rias Nordeste 2026 � c�digo PULSO-NE26 (5 membros)');
}

main()
    .catch((e) => {
        console.error('? Erro no seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
