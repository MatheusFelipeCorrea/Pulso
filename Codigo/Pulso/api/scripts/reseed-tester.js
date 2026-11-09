/**
 * Apaga e recria dados da conta tester@mail.com (senha Pulso@123),
 * com mega-volume incluindo mês atual e próximo (nov/dez relativos a hoje).
 */
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const { DEFAULT_CATEGORIES } = require('../src/constants/defaultCategories')

const prisma = new PrismaClient()

const EMAIL = 'tester@mail.com'
const SENHA = 'Pulso@123'
const NOME = 'Tester Pulso'
const MESES_PASSADO = 11 // 11 anteriores + atual + próximo = 13
const FUTURO = 1
const TX_BATCH = 400
const MARKER = '__PULSO_TESTER_MEGA_V3__'

function rng(seed) {
    let s = seed >>> 0
    return () => {
        s = (s + 0x6d2b79f5) | 0
        let t = Math.imul(s ^ (s >>> 15), 1 | s)
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
}

function valorEntre(r, min, max) {
    return Math.round((min + r() * (max - min)) * 100) / 100
}

function escolher(r, arr) {
    return arr[Math.floor(r() * arr.length)]
}

function dataNoMes(dia, offsetMes = 0) {
    const now = new Date()
    const last = new Date(now.getFullYear(), now.getMonth() + offsetMes + 1, 0).getDate()
    const d = Math.min(Math.max(1, dia), last)
    return new Date(now.getFullYear(), now.getMonth() + offsetMes, d, 12, 0, 0, 0)
}

function mesRefDate(offsetMes = 0) {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth() + offsetMes, 1)
}

async function wipeUser(usuarioId) {
    // Cascades cobrem a maior parte; limpeza explícita de pivôs comuns
    await prisma.insightSnapshot.deleteMany({ where: { usuarioId } }).catch(() => {})
    await prisma.historicoScore.deleteMany({ where: { usuarioId } }).catch(() => {})
    await prisma.usuario.delete({ where: { id: usuarioId } })
}

async function main() {
    console.log(`\n🔄 Reseed ${EMAIL} ...`)
    const existente = await prisma.usuario.findUnique({ where: { email: EMAIL } })
    if (existente) {
        console.log(`   Apagando usuário ${existente.id} e dados relacionados...`)
        await wipeUser(existente.id)
    }

    const senhaHash = await bcrypt.hash(SENHA, 12)
    const usuario = await prisma.usuario.create({
        data: {
            nome: NOME,
            email: EMAIL,
            senhaHash,
            provedorAuth: 'EMAIL',
            verificado: true,
            configuracoes: {
                create: {
                    modoUso: 'ESTAGIARIO',
                    tema: 'ESCURO',
                    gamificacaoAtiva: true,
                    valorSalario: 2200,
                    diaSalario: 5,
                    valorVa: 500,
                    diaVa: 5,
                    valorVr: 650,
                    diaVr: 5,
                    valorVt: 0,
                    diaVt: 5,
                    limiteGastos: 1800,
                    rendaMensalPlanejada: 2800,
                    plano: 'PREMIUM',
                },
            },
            sequencia: {
                create: {
                    sequenciaAtual: 3,
                    maiorSequencia: 12,
                    xp: 420,
                    nivel: 'INICIANTE',
                },
            },
        },
    })

    await prisma.categoria.createMany({
        data: DEFAULT_CATEGORIES.map((c) => ({ ...c, padrao: true, usuarioId: usuario.id })),
        skipDuplicates: true,
    })
    const categorias = await prisma.categoria.findMany({ where: { usuarioId: usuario.id } })
    const cat = (nome, tipo) => {
        const hit = categorias.find((c) => c.nome === nome && c.tipo === tipo)
        if (!hit) throw new Error(`Categoria ausente: ${nome}/${tipo}`)
        return hit.id
    }

    const r = rng(202611)
    const registros = []
    const base = (tipo, extra) => ({
        usuarioId: usuario.id,
        tipo,
        recorrente: false,
        regraRecorrencia: null,
        ...extra,
    })

    const templates = [
        {
            categoria: 'Alimentação',
            recurso: 'VR',
            descricoes: ['Almoço no RU', 'Lanche cantina', 'Marmita'],
            min: 18,
            max: 32,
        },
        {
            categoria: 'Alimentação',
            recurso: 'DINHEIRO',
            descricoes: ['Delivery iFood', 'Padaria', 'Açaí', 'Hambúrguer'],
            min: 28,
            max: 110,
        },
        {
            categoria: 'Transporte',
            recurso: 'DINHEIRO',
            descricoes: ['Uber', '99', 'Metrô', 'Ônibus'],
            min: 8,
            max: 48,
        },
        {
            categoria: 'Compras',
            recurso: 'VA',
            descricoes: ['Mercado', 'Feira', 'Atacado'],
            min: 40,
            max: 220,
        },
        {
            categoria: 'Lazer',
            recurso: 'DINHEIRO',
            descricoes: ['Cinema', 'Bar', 'Show', 'Streaming'],
            min: 25,
            max: 160,
        },
        {
            categoria: 'Educação',
            recurso: 'DINHEIRO',
            descricoes: ['Livro', 'Curso online', 'Material'],
            min: 35,
            max: 180,
        },
        {
            categoria: 'Saúde',
            recurso: 'DINHEIRO',
            descricoes: ['Farmácia', 'Consulta'],
            min: 20,
            max: 200,
        },
        {
            categoria: 'Moradia',
            recurso: 'DINHEIRO',
            descricoes: ['Conta luz', 'Internet', 'Condomínio'],
            min: 40,
            max: 280,
        },
        {
            categoria: 'Serviços e Assinaturas',
            recurso: 'DINHEIRO',
            descricoes: ['Netflix', 'Spotify', 'iCloud'],
            min: 12,
            max: 55,
        },
    ]

    for (let offset = -MESES_PASSADO; offset <= FUTURO; offset += 1) {
        // boost alimentação em novembro (0) vs outubro (-1) para variação MoM
        const fatorAlim = offset === 0 ? 1.18 : offset === 1 ? 1.08 : 1

        registros.push(
            base('RECEITA', {
                categoriaId: cat('Salário', 'RECEITA'),
                recurso: 'DINHEIRO',
                valor: 2200,
                descricao: 'Bolsa estágio',
                data: dataNoMes(5, offset),
            }),
            base('RECEITA', {
                categoriaId: cat('Outros', 'RECEITA'),
                recurso: 'VA',
                valor: 500,
                descricao: 'Vale Alimentação',
                data: dataNoMes(5, offset),
            }),
            base('RECEITA', {
                categoriaId: cat('Outros', 'RECEITA'),
                recurso: 'VR',
                valor: 650,
                descricao: 'Vale Refeição',
                data: dataNoMes(5, offset),
            }),
            base('DESPESA', {
                categoriaId: cat('Moradia', 'DESPESA'),
                recurso: 'DINHEIRO',
                valor: 700,
                descricao: 'Aluguel do quarto',
                data: dataNoMes(6, offset),
            })
        )

        if (r() > 0.55) {
            registros.push(
                base('RECEITA', {
                    categoriaId: cat('Freelance', 'RECEITA'),
                    recurso: 'DINHEIRO',
                    valor: valorEntre(r, 200, 700),
                    descricao: escolher(r, ['Freela design', 'Landing page', 'Social media']),
                    data: dataNoMes(12 + Math.floor(r() * 10), offset),
                })
            )
        }

        const qtd = offset >= 0 ? 78 : 62 + Math.floor(r() * 14)
        for (let i = 0; i < qtd; i += 1) {
            const tpl = escolher(r, templates)
            const boost = tpl.categoria === 'Alimentação' ? fatorAlim : 1
            registros.push(
                base('DESPESA', {
                    categoriaId: cat(tpl.categoria, 'DESPESA'),
                    recurso: tpl.recurso,
                    valor: Math.round(valorEntre(r, tpl.min, tpl.max) * boost * 100) / 100,
                    descricao:
                        offset === 1
                            ? `[Planejado] ${escolher(r, tpl.descricoes)}`
                            : escolher(r, tpl.descricoes),
                    data: dataNoMes(1 + Math.floor(r() * 27), offset),
                })
            )
        }

        // dezembro: picos de fim de ano
        if (offset === 1) {
            registros.push(
                base('DESPESA', {
                    categoriaId: cat('Presentes', 'DESPESA'),
                    recurso: 'DINHEIRO',
                    valor: 320,
                    descricao: '[Planejado] Presentes de Natal',
                    data: dataNoMes(18, offset),
                }),
                base('DESPESA', {
                    categoriaId: cat('Viagem', 'DESPESA'),
                    recurso: 'DINHEIRO',
                    valor: 980,
                    descricao: '[Planejado] Passagem fim de ano',
                    data: dataNoMes(22, offset),
                }),
                base('DESPESA', {
                    categoriaId: cat('Lazer', 'DESPESA'),
                    recurso: 'DINHEIRO',
                    valor: 260,
                    descricao: '[Planejado] Réveillon com amigos',
                    data: dataNoMes(31, offset),
                })
            )
        }
    }

    registros.push(
        base('RECEITA', {
            categoriaId: cat('Outros', 'RECEITA'),
            recurso: 'DINHEIRO',
            valor: 0.01,
            descricao: MARKER,
            data: dataNoMes(1, -MESES_PASSADO),
        })
    )

    for (let i = 0; i < registros.length; i += TX_BATCH) {
        await prisma.transacao.createMany({ data: registros.slice(i, i + TX_BATCH) })
    }

    // Metas
    const metaViagem = await prisma.meta.create({
        data: {
            usuarioId: usuario.id,
            nome: 'Viagem Macaé',
            valorAlvo: 3500,
            valorAtual: 1680,
            prazo: dataNoMes(15, 8),
            tipo: 'LONGO_PRAZO',
            status: 'ATIVA',
            descricao: 'Reserva para viagem com a galera',
        },
    })
    await prisma.meta.create({
        data: {
            usuarioId: usuario.id,
            nome: 'Notebook novo',
            valorAlvo: 5200,
            valorAtual: 2100,
            prazo: dataNoMes(1, 6),
            tipo: 'LONGO_PRAZO',
            status: 'ATIVA',
        },
    })
    await prisma.aporteMeta.create({
        data: {
            metaId: metaViagem.id,
            valor: 200,
            data: dataNoMes(8, 0),
        },
    })

    // Orçamento mês atual + próximo
    for (const offset of [0, 1]) {
        const mes = mesRefDate(offset)
        const itens = [
            ['Alimentação', 650],
            ['Transporte', 280],
            ['Lazer', 200],
            ['Compras', 400],
            ['Educação', 150],
            ['Moradia', 750],
        ]
        for (const [nome, limite] of itens) {
            await prisma.orcamento.create({
                data: {
                    usuarioId: usuario.id,
                    categoriaId: cat(nome, 'DESPESA'),
                    mesReferencia: mes,
                    limiteValor: limite,
                    rolloverAtivo: false,
                },
            })
        }
    }

    const totalTx = await prisma.transacao.count({ where: { usuarioId: usuario.id } })
    console.log(`✅ ${EMAIL} recriado`)
    console.log(`   senha: ${SENHA}`)
    console.log(`   plano: PREMIUM`)
    console.log(`   transações: ${totalTx} (histórico + nov + dez)`)
    console.log(`   metas: 2 | orçamentos: mês atual e próximo`)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
