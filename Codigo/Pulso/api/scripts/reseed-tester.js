/**
 * Apaga e recria tester@mail.com com o mega-seed completo do Pulso
 * (txs, metas, orçamento, dívidas, lembretes, viagens/moedas, planejamento
 * de compra, tags, notificações, divisão, chatbot, insights + grupos).
 *
 * Login: tester@mail.com
 * Senha: Pulso@123
 */
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const {
    SEED_SENHA,
    upsertSeedUsuario,
    seedCategorias,
    seedDadosCompletos,
} = require('../prisma/seed');
const { seedGrupoTesterCompleto } = require('../prisma/seedExtras');

const prisma = new PrismaClient();

const EMAIL = 'tester@mail.com';
const NOME = 'Tester Pulso';

async function wipeUser(usuarioId) {
    await prisma.membroGrupo.deleteMany({ where: { usuarioId } }).catch(() => {});
    await prisma.insightSnapshot.deleteMany({ where: { usuarioId } }).catch(() => {});
    await prisma.historicoScore.deleteMany({ where: { usuarioId } }).catch(() => {});
    await prisma.conversaChat.deleteMany({ where: { usuarioId } }).catch(() => {});
    await prisma.divisao.deleteMany({ where: { usuarioId } }).catch(() => {});
    await prisma.usuario.delete({ where: { id: usuarioId } });
}

async function main() {
    console.log(`\n🔄 Reseed completo ${EMAIL} ...`);

    const existente = await prisma.usuario.findUnique({ where: { email: EMAIL } });
    if (existente) {
        console.log(`   Apagando usuário ${existente.id} e dados...`);
        await wipeUser(existente.id);
    }

    const senhaHash = await bcrypt.hash(SEED_SENHA, 12);
    const usuario = await upsertSeedUsuario(
        {
            email: EMAIL,
            nome: NOME,
            modoUso: 'ESTAGIARIO',
            config: {
                valorSalario: 4200,
                diaSalario: 5,
                valorVa: 600,
                diaVa: 5,
                valorVr: 800,
                diaVr: 5,
                valorVt: 0,
                diaVt: 5,
                valorPadraoPassagem: null,
                vtHabilitado: null,
                limiteGastos: 3200,
                rendaMensalPlanejada: 5600,
                plano: 'PREMIUM',
                tema: 'ESCURO',
                gamificacaoAtiva: true,
            },
        },
        senhaHash
    );

    const categorias = await seedCategorias(usuario.id);
    await seedDadosCompletos(usuario, categorias);
    await seedGrupoTesterCompleto(usuario.id);

    const totalTx = await prisma.transacao.count({ where: { usuarioId: usuario.id } });
    const totalMetas = await prisma.meta.count({ where: { usuarioId: usuario.id } });
    const totalOrc = await prisma.orcamento.count({ where: { usuarioId: usuario.id } });
    const totalViagens = await prisma.viagem.count({ where: { usuarioId: usuario.id } });
    const totalMoedas = await prisma.moedaFavorita.count({ where: { usuarioId: usuario.id } });
    const totalCompra = await prisma.itemPlanejamentoCompra.count({
        where: { usuarioId: usuario.id },
    });
    const totalDividas = await prisma.divida.count({ where: { usuarioId: usuario.id } });
    const totalLembretes = await prisma.lembrete.count({ where: { usuarioId: usuario.id } });
    const totalDivisoes = await prisma.divisao.count({ where: { usuarioId: usuario.id } });
    const totalConversas = await prisma.conversaChat.count({ where: { usuarioId: usuario.id } });
    const totalInsights = await prisma.insightSnapshot.count({ where: { usuarioId: usuario.id } });
    const totalScores = await prisma.historicoScore.count({ where: { usuarioId: usuario.id } });
    const totalGrupos = await prisma.membroGrupo.count({ where: { usuarioId: usuario.id } });

    console.log(`\n✅ ${EMAIL} recriado (senha: ${SEED_SENHA})`);
    console.log(`   plano: PREMIUM | modo: ESTAGIARIO`);
    console.log(`   transações: ${totalTx}`);
    console.log(`   metas: ${totalMetas} | orçamentos: ${totalOrc}`);
    console.log(`   viagens: ${totalViagens} | moedas favoritas: ${totalMoedas}`);
    console.log(`   compras: ${totalCompra} | dívidas: ${totalDividas} | lembretes: ${totalLembretes}`);
    console.log(`   divisões: ${totalDivisoes} | chatbot: ${totalConversas} conversas`);
    console.log(`   insights: ${totalInsights} snapshot | scores: ${totalScores}`);
    console.log(`   grupos (memberships): ${totalGrupos} · códigos PULSO-TEST + PULSO-IGUAL`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
