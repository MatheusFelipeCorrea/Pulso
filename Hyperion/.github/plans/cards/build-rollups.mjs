import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cardsRoot = path.resolve(__dirname, '../../cards');

/** Index card_id → absolute path (nested-by-parent layout). */
function indexCardsById(dir = cardsRoot, map = new Map()) {
  if (!fs.existsSync(dir)) return map;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === '_examples') continue;
      indexCardsById(full, map);
      continue;
    }
    if (!entry.name.endsWith('.md') || entry.name === 'CARD.template.md') continue;
    const text = fs.readFileSync(full, 'utf8');
    const id = text.match(/^card_id:\s*(.+)$/m)?.[1]?.trim();
    if (id) map.set(id, full);
  }
  return map;
}

const byId = indexCardsById();

/** Resolve a legacy flat relative path or a card_id to an absolute file. */
function resolveCardFile(relOrId) {
  const id = path.basename(relOrId, '.md');
  const abs = byId.get(id);
  if (!abs) throw new Error(`Card not found for ${id} (from ${relOrId})`);
  return abs;
}

const EPICS = {
  Autenticacao: {
    outfile: '[EPIC] Autenticacao.md',
    title: 'Autenticação',
    hierarchy: `| Epic | PULSO-EPIC-001 | Autenticação |
| Feature | PULSO-FEAT-001–005 | Cadastro, sessão, OAuth, reset, segurança |
| Task | PULSO-TASK-001–012 | DB, backend, frontend, QA |`,
    files: [
      'epics/PULSO-EPIC-001.md',
      ...['001', '002', '003', '004', '005'].map((n) => `features/PULSO-FEAT-${n}.md`),
      ...Array.from({ length: 12 }, (_, i) => `tasks/PULSO-TASK-${String(i + 1).padStart(3, '0')}.md`),
    ],
  },
  Dashboard: {
    outfile: '[EPIC] Dashboard.md',
    title: 'Dashboard Principal',
    hierarchy: `| Epic | PULSO-EPIC-002 | Dashboard Principal |
| Feature | PULSO-FEAT-006 | Backend — agregação GET /dashboard |
| Feature | PULSO-FEAT-007 | Página dashboard, saldos e recursos |
| Feature | PULSO-FEAT-008 | Gráficos receitas/despesas e categorias |
| Feature | PULSO-FEAT-009 | Widgets resumo e saúde financeira |
| Feature | PULSO-FEAT-010 | Importação de extratos via dashboard |
| Feature | PULSO-FEAT-011 | Quick-add via chatbot (RF-139) |
| Task | PULSO-TASK-013–024 | Backend, frontend, import, QA |`,
    files: [
      'epics/PULSO-EPIC-002.md',
      ...['006', '007', '008', '009', '010', '011'].map((n) => `features/PULSO-FEAT-${n}.md`),
      ...Array.from({ length: 12 }, (_, i) => `tasks/PULSO-TASK-${String(i + 13).padStart(3, '0')}.md`),
    ],
  },
  Transacoes: {
    outfile: '[EPIC] Gerenciamento de Transacoes.md',
    title: 'Gerenciamento de Transações',
    hierarchy: `| Epic | PULSO-EPIC-003 | Gerenciamento de Transações |
| Feature | PULSO-FEAT-012 | Backend — API de transações |
| Feature | PULSO-FEAT-013 | Categorias, tags e sugestão automática |
| Feature | PULSO-FEAT-014 | Transferências entre recursos |
| Feature | PULSO-FEAT-015 | Recorrência e geração automática |
| Feature | PULSO-FEAT-016 | Frontend — página de transações |
| Feature | PULSO-FEAT-017 | QA — testes de transações |
| Task | PULSO-TASK-025–036 | DB, backend, recorrência, frontend, QA |`,
    files: [
      'epics/PULSO-EPIC-003.md',
      ...['012', '013', '014', '015', '016', '017'].map((n) => `features/PULSO-FEAT-${n}.md`),
      ...Array.from({ length: 12 }, (_, i) => `tasks/PULSO-TASK-${String(i + 25).padStart(3, '0')}.md`),
    ],
  },
  Metas: {
    outfile: '[EPIC] Metas Financeiras.md',
    title: 'Metas Financeiras',
    hierarchy: `| Epic | PULSO-EPIC-004 | Metas Financeiras |
| Feature | PULSO-FEAT-018 | Backend — API de metas |
| Feature | PULSO-FEAT-019 | Cálculos, progresso e reserva de emergência |
| Feature | PULSO-FEAT-020 | Aportes e ciclo de vida da meta |
| Feature | PULSO-FEAT-021 | Frontend — página de metas |
| Feature | PULSO-FEAT-022 | QA — testes de metas |
| Task | PULSO-TASK-037–048 | DB, backend, aportes, frontend, QA |`,
    files: [
      'epics/PULSO-EPIC-004.md',
      ...['018', '019', '020', '021', '022'].map((n) => `features/PULSO-FEAT-${n}.md`),
      ...Array.from({ length: 12 }, (_, i) => `tasks/PULSO-TASK-${String(i + 37).padStart(3, '0')}.md`),
    ],
  },
  Viagens: {
    outfile: '[EPIC] Viagens e Moedas.md',
    title: 'Viagens e Moedas',
    hierarchy: `| Epic | PULSO-EPIC-005 | Viagens e Moedas |
| Feature | PULSO-FEAT-023 | Backend — API de moedas |
| Feature | PULSO-FEAT-024 | Backend — API de viagens |
| Feature | PULSO-FEAT-025 | Pretensões e observações de viagem |
| Feature | PULSO-FEAT-026 | Destinos, capas e estimativa de passagem |
| Feature | PULSO-FEAT-027 | Frontend — página viagens e moedas |
| Feature | PULSO-FEAT-028 | Frontend — detalhe da viagem |
| Feature | PULSO-FEAT-029 | QA — testes de viagens e moedas |
| Task | PULSO-TASK-049–060 | DB, moedas, viagens, frontend, QA |`,
    files: [
      'epics/PULSO-EPIC-005.md',
      ...['023', '024', '025', '026', '027', '028', '029'].map((n) => `features/PULSO-FEAT-${n}.md`),
      ...Array.from({ length: 12 }, (_, i) => `tasks/PULSO-TASK-${String(i + 49).padStart(3, '0')}.md`),
    ],
  },
  Lembretes: {
    outfile: '[EPIC] Lembretes e Google Agenda.md',
    title: 'Lembretes e Google Agenda',
    hierarchy: `| Epic | PULSO-EPIC-006 | Lembretes e Google Agenda |
| Feature | PULSO-FEAT-030 | Backend — API de lembretes |
| Feature | PULSO-FEAT-031 | Google Calendar — OAuth e sincronização |
| Feature | PULSO-FEAT-032 | Calendário financeiro — visão mês e dia |
| Feature | PULSO-FEAT-033 | Jobs — alertas e recorrência |
| Feature | PULSO-FEAT-034 | Frontend — calendário e lembretes |
| Feature | PULSO-FEAT-035 | QA — testes de lembretes |
| Task | PULSO-TASK-061–072 | DB, lembretes, Google, calendário, QA |`,
    files: [
      'epics/PULSO-EPIC-006.md',
      ...['030', '031', '032', '033', '034', '035'].map((n) => `features/PULSO-FEAT-${n}.md`),
      ...Array.from({ length: 12 }, (_, i) => `tasks/PULSO-TASK-${String(i + 61).padStart(3, '0')}.md`),
    ],
  },
  Homepage: {
    outfile: '[EPIC] Homepage Publica.md',
    title: 'Homepage Pública',
    hierarchy: `| Epic | PULSO-EPIC-007 | Homepage Pública |
| Feature | PULSO-FEAT-036 | Shell e roteamento público |
| Feature | PULSO-FEAT-037 | Seções de marketing e módulos |
| Feature | PULSO-FEAT-038 | Header, footer, mobile e estilos |
| Feature | PULSO-FEAT-039 | QA — testes da homepage |
| Task | PULSO-TASK-073–080 | Landing, seções, chrome, CSS, legal, QA |`,
    files: [
      'epics/PULSO-EPIC-007.md',
      ...['036', '037', '038', '039'].map((n) => `features/PULSO-FEAT-${n}.md`),
      ...Array.from({ length: 8 }, (_, i) => `tasks/PULSO-TASK-${String(i + 73).padStart(3, '0')}.md`),
    ],
  },
  Grupos: {
    outfile: '[EPIC] Grupos.md',
    title: 'Grupos',
    hierarchy: `| Epic | PULSO-EPIC-008 | Grupos |
| Feature | PULSO-FEAT-040 | Backend — API core de grupos |
| Feature | PULSO-FEAT-041 | Viagem compartilhada e divisão RF-095 |
| Feature | PULSO-FEAT-042 | Metas compartilhadas e aportes |
| Feature | PULSO-FEAT-043 | Chat e notificações de grupo |
| Feature | PULSO-FEAT-044 | Frontend — grupos lista e detalhe |
| Feature | PULSO-FEAT-045 | QA — testes de grupos |
| Task | PULSO-TASK-081–092 | DB, core, viagem, metas, chat, frontend, QA |`,
    files: [
      'epics/PULSO-EPIC-008.md',
      ...['040', '041', '042', '043', '044', '045'].map((n) => `features/PULSO-FEAT-${n}.md`),
      ...Array.from({ length: 12 }, (_, i) => `tasks/PULSO-TASK-${String(i + 81).padStart(3, '0')}.md`),
    ],
  },
  Orcamento: {
    outfile: '[EPIC] Orcamento Mensal.md',
    title: 'Orçamento Mensal',
    hierarchy: `| Epic | PULSO-EPIC-009 | Orçamento Mensal |
| Feature | PULSO-FEAT-046 | Backend — API de orçamentos |
| Feature | PULSO-FEAT-047 | Rollover e status por categoria |
| Feature | PULSO-FEAT-048 | Alertas 80%/100% e jobs |
| Feature | PULSO-FEAT-049 | Frontend — BudgetPage e resumo |
| Feature | PULSO-FEAT-050 | Frontend — edição de limites e estilos |
| Feature | PULSO-FEAT-051 | QA — testes de orçamento mensal |
| Task | PULSO-TASK-093–104 | DB, API, rollover, alertas, frontend, QA |`,
    files: [
      'epics/PULSO-EPIC-009.md',
      ...['046', '047', '048', '049', '050', '051'].map((n) => `features/PULSO-FEAT-${n}.md`),
      ...Array.from({ length: 12 }, (_, i) => `tasks/PULSO-TASK-${String(i + 93).padStart(3, '0')}.md`),
    ],
  },
  PlanejamentoCompra: {
    outfile: '[EPIC] Planejamento de Compra.md',
    title: 'Planejamento de Compra',
    hierarchy: `| Epic | PULSO-EPIC-010 | Planejamento de Compra |
| Feature | PULSO-FEAT-052 | Backend — API e painel de planejamento |
| Feature | PULSO-FEAT-053 | Cálculos — sobra, tempo e parcelas |
| Feature | PULSO-FEAT-054 | Vincular meta e marcar comprado |
| Feature | PULSO-FEAT-055 | Imagens do item de compra |
| Feature | PULSO-FEAT-056 | Frontend — página e componentes |
| Feature | PULSO-FEAT-057 | QA — testes de planejamento de compra |
| Task | PULSO-TASK-105–116 | DB, API, cálculos, meta, imagem, frontend, QA |`,
    files: [
      'epics/PULSO-EPIC-010.md',
      ...['052', '053', '054', '055', '056', '057'].map((n) => `features/PULSO-FEAT-${n}.md`),
      ...Array.from({ length: 12 }, (_, i) => `tasks/PULSO-TASK-${String(i + 105).padStart(3, '0')}.md`),
    ],
  },
  DivisaoDespesas: {
    outfile: '[EPIC] Divisao de Despesas.md',
    title: 'Divisão de Despesas',
    hierarchy: `| Epic | PULSO-EPIC-011 | Divisão de Despesas |
| Feature | PULSO-FEAT-058 | Backend — API core de divisões |
| Feature | PULSO-FEAT-059 | Rateio igual e personalizado |
| Feature | PULSO-FEAT-060 | Pagamentos, quitação e saldo |
| Feature | PULSO-FEAT-061 | Lembrete de cobrança e limpeza |
| Feature | PULSO-FEAT-062 | Frontend — página e componentes |
| Feature | PULSO-FEAT-063 | QA — testes de divisão de despesas |
| Task | PULSO-TASK-117–128 | DB, rateio, pagamentos, lembrete, frontend, QA |`,
    files: [
      'epics/PULSO-EPIC-011.md',
      ...['058', '059', '060', '061', '062', '063'].map((n) => `features/PULSO-FEAT-${n}.md`),
      ...Array.from({ length: 12 }, (_, i) => `tasks/PULSO-TASK-${String(i + 117).padStart(3, '0')}.md`),
    ],
  },
  Dividas: {
    outfile: '[EPIC] Dividas Pessoais.md',
    title: 'Dívidas Pessoais',
    hierarchy: `| Epic | PULSO-EPIC-012 | Dívidas Pessoais |
| Feature | PULSO-FEAT-064 | Backend — API core de dívidas |
| Feature | PULSO-FEAT-065 | Pagamentos parciais, quitar e reabrir |
| Feature | PULSO-FEAT-066 | Saldo consolidado e contadores |
| Feature | PULSO-FEAT-067 | Alertas de vencimento e limpeza |
| Feature | PULSO-FEAT-068 | Frontend — página e componentes |
| Feature | PULSO-FEAT-069 | QA — testes de dívidas |
| Task | PULSO-TASK-129–140 | DB, pagamentos, resumo, alertas, frontend, QA |`,
    files: [
      'epics/PULSO-EPIC-012.md',
      ...['064', '065', '066', '067', '068', '069'].map((n) => `features/PULSO-FEAT-${n}.md`),
      ...Array.from({ length: 12 }, (_, i) => `tasks/PULSO-TASK-${String(i + 129).padStart(3, '0')}.md`),
    ],
  },
  Insights: {
    outfile: '[EPIC] Insights Inteligentes.md',
    title: 'Insights Inteligentes',
    hierarchy: `| Epic | PULSO-EPIC-013 | Insights Inteligentes |
| Feature | PULSO-FEAT-070 | Provider Gemini Insights e configuração |
| Feature | PULSO-FEAT-071 | Agregação de contexto financeiro do usuário |
| Feature | PULSO-FEAT-072 | Score, projeções e alertas preditivos |
| Feature | PULSO-FEAT-073 | Geração LLM — resumo, sugestões e educação |
| Feature | PULSO-FEAT-074 | API, cache, job e regenerar |
| Feature | PULSO-FEAT-075 | Frontend — página Insights |
| Feature | PULSO-FEAT-076 | QA — testes de insights inteligentes |
| Task | PULSO-TASK-141–152 | Provider, contexto, score, LLM, API, frontend, QA |`,
    files: [
      'epics/PULSO-EPIC-013.md',
      ...['070', '071', '072', '073', '074', '075', '076'].map((n) => `features/PULSO-FEAT-${n}.md`),
      ...Array.from({ length: 12 }, (_, i) => `tasks/PULSO-TASK-${String(i + 141).padStart(3, '0')}.md`),
    ],
  },
};

function buildEpic(config) {
  const hierarchy = config.hierarchy;

  const header = `# [EPIC] ${config.title} — rollup Hyperion

> **Formato:** cards em \`Hyperion/.github/cards/\` (layout nested-by-parent) · este arquivo é leitura humana.
> **Propósito:** spec de implementação — cards em \`Backlog\` alinhados à arquitetura alvo do Pulso.

## Hierarquia

| Nível | ID | Título |
|-------|-----|--------|
${hierarchy}

---

`;

  const body = config.files
    .map((rel) => fs.readFileSync(resolveCardFile(rel), 'utf8') + '\n---\n')
    .join('');

  const out = path.join(__dirname, config.outfile);
  fs.writeFileSync(out, header + body, 'utf8');
  console.log('OK:', out);
}

console.log(`[build-rollups] indexed ${byId.size} cards`);
for (const config of Object.values(EPICS)) {
  buildEpic(config);
}
