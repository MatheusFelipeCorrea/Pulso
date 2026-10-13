import test from "node:test";
import assert from "node:assert/strict";
import {
  classifyCard,
  mergeCardFields,
  detectDuplicateIssues,
  parseLastSyncWhen,
  buildReconcilePlan,
  composeSnapshotCards,
  pickCanonicalIssueFromGroup,
  snapshotFromCard,
} from "./reconcile.mjs";

test("classify: local-only is forward, remote-only creates the markdown", () => {
  assert.equal(classifyCard({ local: { title: "A" }, remote: null }), "forward");
  assert.equal(classifyCard({ local: null, remote: { title: "A" } }), "reverse_create");
  assert.equal(classifyCard({ local: null, remote: null }), "skip");
});

test("without snapshot, status drift is skipped so git is the ancestor", () => {
  const local = { title: "Spec", status: "Backlog", sprint: null };
  assert.equal(
    classifyCard({ local, remote: { ...local, status: "In Progress" } }),
    "skip"
  );
  assert.equal(
    classifyCard({
      local: { ...local, title: "New spec" },
      remote: { ...local, title: "Spec" },
    }),
    "forward"
  );
  assert.equal(
    classifyCard({
      local: { ...local, title: "New spec" },
      remote: { ...local, status: "Done" },
    }),
    "forward"
  );
});

test("without snapshot, board status reverses only when the issue is newer", () => {
  const local = {
    title: "Spec",
    status: "Backlog",
    updatedAt: "2026-10-01T10:00:00.000Z",
  };
  const remote = {
    title: "Spec",
    status: "Done",
    updatedAt: "2026-10-08T10:00:00.000Z",
  };
  assert.equal(classifyCard({ local, remote }), "reverse");
});

test("merge: board wins status even if git also changed it", () => {
  const snapshot = { title: "Old", status: "Backlog", sprint: "Sprint-3" };
  const local = { title: "Git title", status: "In Progress", sprint: "Sprint-3" };
  const remote = { title: "Old", status: "Done", sprint: "Sprint-4" };

  const { next, conflicts, applied } = mergeCardFields({ local, remote, snapshot });

  assert.equal(next.title, "Git title");
  assert.equal(next.status, "Done");
  assert.equal(next.sprint, "Sprint-4");
  assert.equal(conflicts.some((c) => c.field === "status" && c.winner === "board"), true);
  assert.equal(applied.some((a) => a.field === "sprint" && a.from === "board"), true);
  assert.equal(applied.some((a) => a.field === "title" && a.from === "git"), true);
});

test("detectDuplicateIssues keeps the open original, not a closed lower number", () => {
  const grouped = new Map([
    [
      "PULSO-FEAT-001",
      [
        { number: 14, state: "CLOSED", id: "C" },
        { number: 40, state: "OPEN", id: "O" },
        { number: 99, state: "OPEN", id: "X" },
      ],
    ],
    ["PULSO-FEAT-002", [{ number: 15, state: "OPEN" }]],
  ]);
  const dupes = detectDuplicateIssues(grouped);
  assert.equal(dupes.length, 1);
  assert.equal(dupes[0].keep, 40);
  assert.deepEqual(dupes[0].extras, [14, 99]);
});

test("pickCanonicalIssueFromGroup prefers open then lowest number", () => {
  const canonical = pickCanonicalIssueFromGroup([
    { number: 118, state: "CLOSED" },
    { number: 27, state: "OPEN" },
    { number: 40, state: "OPEN" },
  ]);
  assert.equal(canonical.number, 27);
});

test("composeSnapshotCards keeps the previous snapshot for failed forwards", () => {
  const previous = {
    cards: { A: snapshotFromCard({ title: "Old", status: "Backlog" }) },
  };
  const current = [{ cardId: "A", title: "New", status: "Backlog" }];
  const cards = composeSnapshotCards(current, previous, ["A"]);
  assert.equal(cards.A.title, "Old");
  const ok = composeSnapshotCards(current, previous, []);
  assert.equal(ok.A.title, "New");
});

test("parseLastSyncWhen reads the ISO clock from last-sync.md", () => {
  const md = "# Last\n\n- **When:** 2026-09-30T15:00:53.629Z\n";
  assert.equal(parseLastSyncWhen(md), "2026-09-30T15:00:53.629Z");
  assert.equal(parseLastSyncWhen(""), null);
});

test("buildReconcilePlan splits forward, reverse_create and skip", () => {
  const plan = buildReconcilePlan({
    localCards: [{ cardId: "A", title: "Local", status: "Backlog" }],
    remotes: new Map([
      ["A", { title: "Local", status: "Backlog" }],
      ["B", { title: "Board only", status: "Todo" }],
    ]),
    snapshot: { cards: { A: { title: "Local", status: "Backlog" } } },
  });
  const byId = Object.fromEntries(plan.items.map((item) => [item.cardId, item.action]));
  assert.equal(byId.A, "skip");
  assert.equal(byId.B, "reverse_create");
  assert.equal(plan.counts.skip, 1);
  assert.equal(plan.counts.reverse_create, 1);
});
