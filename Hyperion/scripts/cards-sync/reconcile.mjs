/**
 * Bidirectional card reconcile: decide forward vs reverse vs field merge.
 * Git wins spec fields; the board wins status/sprint.
 * Same-field edits still follow that ownership (logged as conflict).
 * First run without snapshot does not reverse board fields unless the issue
 * is newer than the local file — otherwise git is the bootstrap ancestor.
 */

export const BOARD_FIELDS = ["status", "sprint"];
export const GIT_FIELDS = ["title", "type", "priority", "storyPoints", "reporter", "parent", "dueDate"];
export const MERGE_FIELDS = [...BOARD_FIELDS, ...GIT_FIELDS];

export function normalizeSyncScalar(value) {
  if (value === undefined || value === null || value === "" || value === "null") return null;
  return String(value);
}

export function scalarsEqual(left, right) {
  return normalizeSyncScalar(left) === normalizeSyncScalar(right);
}

export function isOpenIssueState(state) {
  const normalized = String(state || "").toUpperCase();
  return normalized === "OPEN" || normalized === "OPENED";
}

export function isRemoteNewer(local = {}, remote = {}) {
  const localMs = Date.parse(local.updatedAt || "");
  const remoteMs = Date.parse(remote.updatedAt || "");
  if (!Number.isFinite(localMs) || !Number.isFinite(remoteMs)) return false;
  return remoteMs > localMs;
}

/** Open issue first, then lowest number. Group must already be the same CARD_ID. */
export function pickCanonicalIssueFromGroup(issues = []) {
  const matches = (issues || []).filter((issue) => Number.isFinite(Number(issue?.number)));
  if (!matches.length) return null;
  return [...matches].sort((a, b) => {
    const openDelta = Number(isOpenIssueState(a.state)) - Number(isOpenIssueState(b.state));
    if (openDelta) return -openDelta;
    return Number(a.number) - Number(b.number);
  })[0];
}

export function snapshotFromCard(card = {}) {
  const snap = {};
  for (const field of MERGE_FIELDS) snap[field] = normalizeSyncScalar(card[field]);
  if (card.issueNumber != null) snap.issueNumber = Number(card.issueNumber);
  if (card.sourceFile) snap.sourceFile = String(card.sourceFile).replace(/\\/g, "/");
  return snap;
}

/**
 * @returns {{ field: string, gitChanged: boolean, boardChanged: boolean, local, remote, snapshot }[]}
 */
export function diffFields({ local = {}, remote = {}, snapshot = null } = {}) {
  const remoteNewer = isRemoteNewer(local, remote);
  return MERGE_FIELDS.map((field) => {
    const loc = local[field];
    const rem = remote[field];
    const snap = snapshot ? snapshot[field] : undefined;
    let gitChanged;
    let boardChanged;
    if (snapshot) {
      gitChanged = !scalarsEqual(loc, snap);
      boardChanged = !scalarsEqual(rem, snap);
    } else if (!scalarsEqual(loc, rem)) {
      gitChanged = GIT_FIELDS.includes(field);
      // Without an ancestor, do not assume the board moved. Only reverse
      // status/sprint if the issue is strictly newer than the markdown file.
      boardChanged = BOARD_FIELDS.includes(field) && remoteNewer;
    } else {
      gitChanged = false;
      boardChanged = false;
    }
    return { field, gitChanged, boardChanged, local: loc, remote: rem, snapshot: snap };
  });
}

/**
 * @returns {'skip'|'forward'|'reverse'|'reverse_create'|'merge'}
 */
export function classifyCard({ local = null, remote = null, snapshot = null } = {}) {
  if (!local && remote) return "reverse_create";
  if (local && !remote) return "forward";
  if (!local && !remote) return "skip";

  const diffs = diffFields({ local, remote, snapshot });
  const gitChanged = diffs.filter((d) => d.gitChanged);
  const boardChanged = diffs.filter((d) => d.boardChanged);
  if (!gitChanged.length && !boardChanged.length) return "skip";
  if (gitChanged.length && boardChanged.length) return "merge";
  if (boardChanged.length) return "reverse";
  return "forward";
}

function ownerValue(field, loc, rem) {
  return BOARD_FIELDS.includes(field) ? rem : loc;
}

/**
 * Merge one card. Dual edits on the same field follow ownership
 * (board = status/sprint, git = the rest) instead of reverting both.
 */
export function mergeCardFields({ local = {}, remote = {}, snapshot = null } = {}) {
  const next = { ...local };
  const conflicts = [];
  const applied = [];
  const diffs = diffFields({ local, remote, snapshot });

  for (const diff of diffs) {
    const { field, gitChanged, boardChanged, local: loc, remote: rem } = diff;
    if (gitChanged && boardChanged && !scalarsEqual(loc, rem)) {
      const kept = ownerValue(field, loc, rem);
      next[field] = kept;
      conflicts.push({
        field,
        local: loc,
        remote: rem,
        kept,
        winner: BOARD_FIELDS.includes(field) ? "board" : "git",
      });
      applied.push({
        field,
        from: BOARD_FIELDS.includes(field) ? "board" : "git",
        value: kept,
      });
      continue;
    }
    if (boardChanged && !gitChanged) {
      next[field] = rem;
      applied.push({ field, from: "board", value: rem });
      continue;
    }
    if (gitChanged && !boardChanged) {
      next[field] = loc;
      applied.push({ field, from: "git", value: loc });
    }
  }

  return { next, conflicts, applied };
}

export function detectDuplicateIssues(grouped = new Map()) {
  const duplicates = [];
  for (const [cardId, issues] of grouped) {
    if (!Array.isArray(issues) || issues.length < 2) continue;
    const canonical = pickCanonicalIssueFromGroup(issues);
    const keep = Number(canonical?.number);
    const extras = issues
      .map((issue) => Number(issue.number))
      .filter((n) => Number.isFinite(n) && n !== keep)
      .sort((a, b) => a - b);
    const extraIssues = issues
      .filter((issue) => Number(issue.number) !== keep)
      .map((issue) => ({
        number: Number(issue.number),
        id: issue.id || null,
        state: issue.state || null,
      }));
    duplicates.push({
      cardId,
      keep,
      extras,
      extraIssues,
      numbers: issues
        .map((issue) => Number(issue.number))
        .filter((n) => Number.isFinite(n))
        .sort((a, b) => a - b),
    });
  }
  return duplicates;
}

export function parseLastSyncWhen(markdown) {
  const match = String(markdown || "").match(/\*\*When:\*\*\s*(\S+)/);
  if (!match) return null;
  const ms = Date.parse(match[1]);
  return Number.isNaN(ms) ? null : match[1];
}

export function composeSnapshotCards(currentCards = [], previousSnapshot = null, failedIds = []) {
  const prev = previousSnapshot?.cards || {};
  const failed = new Set(failedIds);
  const cards = {};
  for (const card of currentCards) {
    if (!card?.cardId) continue;
    if (failed.has(card.cardId) && prev[card.cardId]) {
      cards[card.cardId] = prev[card.cardId];
    } else if (!failed.has(card.cardId)) {
      cards[card.cardId] = snapshotFromCard(card);
    }
  }
  return cards;
}

export function buildReconcilePlan({ localCards = [], remotes = new Map(), snapshot = null } = {}) {
  const snapCards = snapshot?.cards || {};
  const localById = new Map(localCards.map((card) => [card.cardId, card]));
  const ids = new Set([...localById.keys(), ...remotes.keys()]);
  const items = [];

  for (const cardId of ids) {
    const local = localById.get(cardId) || null;
    const remote = remotes.get(cardId) || null;
    const previous = snapCards[cardId] || null;
    const action = classifyCard({ local, remote, snapshot: previous });
    const merge =
      action === "merge" || action === "reverse" || action === "reverse_create"
        ? mergeCardFields({ local: local || {}, remote: remote || {}, snapshot: previous })
        : { next: local, conflicts: [], applied: [] };

    items.push({
      cardId,
      action,
      local,
      remote,
      merge,
    });
  }

  return {
    items,
    counts: items.reduce((acc, item) => {
      acc[item.action] = (acc[item.action] || 0) + 1;
      return acc;
    }, {}),
  };
}

export function renderReconcileReport({
  when,
  counts = {},
  duplicates = [],
  conflicts = [],
  orphans = [],
  failedCardIds = [],
  tokenWarning = null,
} = {}) {
  const lines = [
    "# Last card reconcile",
    "",
    `- **When:** ${when || new Date().toISOString()}`,
    `- **Plan:** ${Object.entries(counts)
      .map(([key, value]) => `${key}=${value}`)
      .join(" ") || "empty"}`,
    "",
  ];
  if (tokenWarning) {
    lines.push(`- **Token:** ${tokenWarning}`, "");
  }
  lines.push("## Duplicates", "");
  if (!duplicates.length) lines.push("None.", "");
  else {
    for (const dupe of duplicates) {
      lines.push(
        `- \`${dupe.cardId}\` canonical #${dupe.keep}; extras ${dupe.extras.map((n) => `#${n}`).join(", ")}`
      );
    }
    lines.push("");
  }
  lines.push("## Conflicts (owner applied)", "");
  if (!conflicts.length) lines.push("None.", "");
  else {
    for (const row of conflicts) {
      lines.push(
        `- \`${row.cardId}\`.${row.field}: git=\`${row.local}\` board=\`${row.remote}\` kept=\`${row.kept}\` (${row.winner || "owner"})`
      );
    }
    lines.push("");
  }
  lines.push("## Forward failures", "");
  if (!failedCardIds.length) lines.push("None.", "");
  else {
    lines.push(failedCardIds.map((id) => `- \`${id}\``).join("\n"), "");
  }
  lines.push("## Issues without CARD_ID (open)", "");
  if (!orphans.length) lines.push("None.", "");
  else {
    for (const issue of orphans.slice(0, 100)) {
      lines.push(`- #${issue.number} ${issue.title || ""}`.trim());
    }
    if (orphans.length > 100) lines.push(`- … ${orphans.length - 100} more`);
    lines.push("");
  }
  return `${lines.join("\n").trimEnd()}\n`;
}
