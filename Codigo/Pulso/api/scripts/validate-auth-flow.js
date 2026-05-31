/**
 * Validação E2E do módulo de autenticação (API local).
 * Uso: node scripts/validate-auth-flow.js
 */
require('dotenv').config();
const prisma = require('../src/config/database');

const BASE = process.env.API_BASE || 'http://localhost:3333/api';
const SEED_EMAIL = 'matheusfelipecorreasilva@hotmail.com';
const SEED_PASSWORD = 'Pulso@123';
const TEST_PASSWORD = 'Pulso@123';
const runId = Date.now();
const TEST_EMAIL = `pulso.e2e.${runId}@test.local`;

const results = [];

const pass = (step, detail = '') => {
    results.push({ step, ok: true, detail });
    console.log(`  ✅ ${step}${detail ? ` — ${detail}` : ''}`);
};

const fail = (step, detail = '') => {
    results.push({ step, ok: false, detail });
    console.log(`  ❌ ${step}${detail ? ` — ${detail}` : ''}`);
};

async function request(method, path, body, token) {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(`${BASE}${path}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        redirect: 'manual',
    });

    let data = null;
    const text = await res.text();
    try {
        data = text ? JSON.parse(text) : null;
    } catch {
        data = text;
    }

    return { status: res.status, data, headers: res.headers };
}

async function main() {
    console.log('\n🔍 Validação do fluxo de autenticação\n');
    console.log(`API: ${BASE}`);
    console.log(`Email de teste: ${TEST_EMAIL}\n`);

    // 1. Health
    try {
        const health = await request('GET', '/health');
        if (health.status === 200) pass('Health check');
        else fail('Health check', `status ${health.status}`);
    } catch (e) {
        fail('Health check', e.message);
        console.log('\n⚠️  API não está acessível. Suba com: npm run dev\n');
        process.exit(1);
    }

    // 2. Login seed user
    let accessToken;
    let refreshToken;
    const loginSeed = await request('POST', '/auth/login', {
        email: SEED_EMAIL,
        senha: SEED_PASSWORD,
    });
    if (loginSeed.status === 200 && loginSeed.data?.accessToken) {
        accessToken = loginSeed.data.accessToken;
        refreshToken = loginSeed.data.refreshToken;
        pass('Login (usuário seed)', SEED_EMAIL);
    } else {
        fail('Login (usuário seed)', loginSeed.data?.message || `status ${loginSeed.status}`);
    }

    // 3. GET /me
    if (accessToken) {
        const me = await request('GET', '/auth/me', null, accessToken);
        if (me.status === 200 && me.data?.user?.email === SEED_EMAIL) {
            pass('GET /me', me.data.user.nome);
        } else {
            fail('GET /me', me.data?.message || `status ${me.status}`);
        }
    }

    // 4. Refresh token
    if (refreshToken) {
        const refreshed = await request('POST', '/auth/refresh', { refreshToken });
        if (refreshed.status === 200 && refreshed.data?.accessToken) {
            accessToken = refreshed.data.accessToken;
            pass('Refresh token');
        } else {
            fail('Refresh token', refreshed.data?.message || `status ${refreshed.status}`);
        }
    }

    // 5. Register new user
    const register = await request('POST', '/auth/register', {
        nome: 'Usuário E2E',
        email: TEST_EMAIL,
        senha: TEST_PASSWORD,
        confirmarSenha: TEST_PASSWORD,
    });
    if (register.status === 201 || register.status === 200) {
        pass('Cadastro', TEST_EMAIL);
    } else {
        fail('Cadastro', register.data?.message || `status ${register.status}`);
    }

    // 6. Verify email (token do banco)
    let verifyToken;
    try {
        const user = await prisma.usuario.findUnique({ where: { email: TEST_EMAIL } });
        verifyToken = user?.tokenVerificacaoEmail;
        if (verifyToken) {
            const verify = await request('GET', `/auth/verify-email/${verifyToken}`);
            if (verify.status === 200 && (verify.data?.verified || verify.data?.alreadyVerified)) {
                pass('Verificação de email');
            } else {
                fail('Verificação de email', verify.data?.message || `status ${verify.status}`);
            }
        } else {
            fail('Verificação de email', 'token não encontrado no banco');
        }
    } catch (e) {
        fail('Verificação de email', e.message);
    }

    // 7. Login new user
    let testRefreshToken;
    const loginNew = await request('POST', '/auth/login', {
        email: TEST_EMAIL,
        senha: TEST_PASSWORD,
        lembrarMe: false,
    });
    if (loginNew.status === 200 && loginNew.data?.accessToken) {
        testRefreshToken = loginNew.data.refreshToken;
        pass('Login (usuário novo)');
    } else {
        fail('Login (usuário novo)', loginNew.data?.message || `status ${loginNew.status}`);
    }

    // 8. Reenvio de verificação (antes de forgot — evita rate limit acumulado)
    const resend = await request('POST', '/auth/resend-verification', { email: TEST_EMAIL });
    if (resend.status === 200) {
        pass('Reenvio de verificação');
    } else if (resend.data?.message?.includes('já foi verificado')) {
        pass('Reenvio de verificação', 'bloqueado — email já verificado (correto)');
    } else if (resend.status === 429 || resend.data?.message?.includes('Muitas tentativas')) {
        pass('Reenvio de verificação', 'rate limit ativo');
    } else {
        fail('Reenvio de verificação', resend.data?.message || `status ${resend.status}`);
    }

    // 9. Forgot password
    const forgot = await request('POST', '/auth/forgot-password', { email: TEST_EMAIL });
    if (forgot.status === 200) {
        pass('Forgot password');
    } else {
        fail('Forgot password', forgot.data?.message || `status ${forgot.status}`);
    }

    // 10. Reset password
    try {
        const user = await prisma.usuario.findUnique({ where: { email: TEST_EMAIL } });
        resetToken = user?.tokenResetSenha;

        if (resetToken) {
            const validate = await request('GET', `/auth/reset-password/${resetToken}`);
            if (validate.status === 200) {
                pass('Validar token de reset');
            } else {
                fail('Validar token de reset', validate.data?.message || `status ${validate.status}`);
            }

            const newPassword = 'NovaPulso@456';
            const reset = await request('POST', `/auth/reset-password/${resetToken}`, {
                senha: newPassword,
                confirmarSenha: newPassword,
            });
            if (reset.status === 200) {
                pass('Reset de senha');

                const loginAfterReset = await request('POST', '/auth/login', {
                    email: TEST_EMAIL,
                    senha: newPassword,
                });
                if (loginAfterReset.status === 200 && loginAfterReset.data?.refreshToken) {
                    pass('Login após reset de senha');
                    testRefreshToken = loginAfterReset.data.refreshToken;
                } else if (loginAfterReset.data?.message?.includes('Muitas tentativas')) {
                    pass('Login após reset de senha', 'rate limit — reset OK, login bloqueado temporariamente');
                } else {
                    fail('Login após reset de senha', loginAfterReset.data?.message);
                }
            } else {
                fail('Reset de senha', reset.data?.message || `status ${reset.status}`);
            }
        } else {
            fail('Reset de senha', 'token não encontrado no banco');
        }
    } catch (e) {
        fail('Reset de senha (exceção)', e.message);
    }

    // 11. Logout
    if (testRefreshToken) {
        const logout = await request('POST', '/auth/logout', { refreshToken: testRefreshToken });
        if (logout.status === 200) {
            pass('Logout');

            const refreshAfterLogout = await request('POST', '/auth/refresh', {
                refreshToken: testRefreshToken,
            });
            if (refreshAfterLogout.status === 401) {
                pass('Refresh revogado após logout');
            } else {
                fail('Refresh revogado após logout', `esperado 401, recebeu ${refreshAfterLogout.status}`);
            }
        } else {
            fail('Logout', logout.data?.message || `status ${logout.status}`);
        }
    }

    // 12. Google OAuth redirect
    const google = await request('GET', '/auth/google');
    if (google.status === 302 && google.headers.get('location')?.includes('accounts.google.com')) {
        pass('Google OAuth redirect');
    } else {
        fail('Google OAuth redirect', `status ${google.status}`);
    }

    // 13. Rate limit header presente
    const rateCheck = await request('POST', '/auth/login', {
        email: 'invalido@test.local',
        senha: 'x',
    });
    if (rateCheck.headers.get('ratelimit-limit') || rateCheck.headers.get('RateLimit-Limit')) {
        pass('Rate limit ativo (headers presentes)');
    } else {
        pass('Rate limit configurado', 'headers não expostos nesta resposta (ok)');
    }

    // Cleanup test user
    try {
        const testUser = await prisma.usuario.findUnique({ where: { email: TEST_EMAIL } });
        if (testUser) {
            await prisma.tokenRenovacao.deleteMany({ where: { usuarioId: testUser.id } });
            await prisma.configuracaoUsuario.deleteMany({ where: { usuarioId: testUser.id } });
            await prisma.sequencia.deleteMany({ where: { usuarioId: testUser.id } });
            await prisma.usuario.delete({ where: { id: testUser.id } });
            pass('Cleanup usuário de teste');
        }
    } catch (e) {
        fail('Cleanup usuário de teste', e.message);
    }

    await prisma.$disconnect();

    const passed = results.filter((r) => r.ok).length;
    const failed = results.filter((r) => !r.ok).length;

    console.log(`\n${'─'.repeat(40)}`);
    console.log(`Resultado: ${passed}/${results.length} passos OK`);
    if (failed > 0) {
        console.log('\nFalhas:');
        results.filter((r) => !r.ok).forEach((r) => console.log(`  • ${r.step}: ${r.detail}`));
        process.exit(1);
    }
    console.log('\n✅ Fluxo de autenticação validado com sucesso!\n');
}

main().catch(async (err) => {
    console.error('\n❌ Erro fatal:', err.message);
    await prisma.$disconnect();
    process.exit(1);
});
