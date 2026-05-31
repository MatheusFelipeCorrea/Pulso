// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Iniciando seed...');

    const email = 'matheusfelipecorreasilva@hotmail.com';
    const senhaHash = await bcrypt.hash('Pulso@123', 12);

    const usuario = await prisma.usuario.upsert({
        where: { email },
        update: {
            senhaHash,
            verificado: true,
            tokenResetSenha: null,
            tokenResetExpira: null,
        },
        create: {
            nome: 'Matheus Felipe',
            email,
            senhaHash,
            provedorAuth: 'EMAIL',
            verificado: true,
            configuracoes: {
                create: {
                    tema: 'CLARO',
                    gamificacaoAtiva: true,
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

    console.log(`✅ Usuário criado: ${usuario.email}`);
    console.log(`🔑 Senha: Pulso@123`);
}

main()
    .catch((e) => {
        console.error('❌ Erro no seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });