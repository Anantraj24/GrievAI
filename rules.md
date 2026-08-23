# GrievAI — Development Rules

Rules for any AI assistant (Claude, Antigravity, Cursor, etc.) or human contributor
working on this repository. These are constraints, not suggestions — violating the
architectural ones (§2) undermines the project's core thesis, not just its code style.

---

## 1. Working on the Repository

1. Inspect the existing repository before touching anything — never assume a file
   exists.
2. Read relevant existing code before modifying it.
3. Read the current phase in `Implementationplan.md` before implementing — don't
   jump ahead or build out of sequence.
4. Before coding, produce a concise implementation plan: what changes, which files,
   why.
5. Avoid rewriting unrelated code. Minimal, targeted diffs.
6. Don't introduce new infrastructure without justification (see §4).
7. Run tests after implementation. Verify actual behavior — don't infer it from
   reading the code.
8. Update documentation (`prd.md`/`techspec.md`/`Schema.md`/etc.) when behavior
   changes, in the same change, not as a follow-up someone forgets.
9. Never claim something is "done" or "tested" without having actually run it.
10. Keep commits logically separated by concern.
11. If scope expands significantly mid-task, stop and explain the impact before
    continuing — don't silently absorb scope creep.

## 2. Architectural Invariants (non-negotiable)

1. **AI recommends. Human decides. Backend rules execute.** No code path lets AI
   output become a final, consequential state change (severity, routing execution,
   permission change, sent response, record deletion) without an explicit human
   action in between.
2. Deterministic logic — permissions, SLA, escalation, final priority, workflow
   transitions, routing execution — lives in `backend/app/rules/`, is unit-tested in
   isolation, and never calls into the AI layer.
3. AI logic — extraction, classification, retrieval, drafting — lives in
   `backend/app/ai/`, has no database write access, and has no tool/action
   permissions beyond returning structured output to its caller.
4. Every consequential AI recommendation must be inspectable (show the reasoning /
   confidence, not just the output) and overridable in the UI.
5. AI failure must never break grievance submission or resolution — every AI call
   site needs a defined fallback (see `techspec.md` §9), and that fallback path must
   actually be tested, not assumed.
6. Complaint text is untrusted input. It is never concatenated into a system prompt
   as anything other than clearly-delimited user content, and its content is never
   treated as instructions to the model or the application, however it's phrased.

## 3. Code Quality

- Production-quality where reasonable for a solo student project — not gold-plated,
  but not throwaway either.
- Clear naming; strong typing/schema validation (Pydantic on the backend, TypeScript
  types on the frontend where used).
- Real error handling — no silently swallowed exceptions.
- No unnecessary abstractions. If there's only one implementation of something,
  don't build a plugin interface for it "in case."
- No placeholder logic disguised as complete functionality — a stub must look like
  a stub (raise `NotImplementedError`, TODO comment), never like a working feature.
- No fake/hardcoded AI responses where the feature is supposed to call the actual
  local model — mock only inside tests, clearly marked as mocks.
- No hardcoded business logic where a configuration table already exists for it
  (categories, routing rules, SLA rules, escalation rules — use them).
- Deterministic business rules stay separate from AI code, physically (different
  modules) and logically (no rule function takes a model client as a dependency).

## 4. Before Proposing Architectural Changes

Any suggestion to add infrastructure, a new service, a new major dependency, or to
deviate from `techspec.md`'s approved stack must explain, in order:

1. What is wrong with the current approach.
2. Why the change is necessary (not just nicer).
3. What complexity it adds.
4. Whether it is actually required for the MVP.
5. What simpler alternative exists and why it doesn't work.

Rejected by default unless this case is made: microservices, Kubernetes, Kafka, a
second vector database, Node/Express (no concrete requirement exists for it here),
multi-agent AI orchestration, fine-tuning, a general RAG chatbot layer.

## 5. Modifying Existing Code — Sequence

1. Inspect.
2. Understand.
3. Plan.
4. Modify minimally.
5. Test.
6. Verify.
7. Report exactly what changed — file by file, not "updated the backend."

## 6. Project Framing (keep this in view)

This is a **B.Tech student project at a tier-3 college with no placement support** —
ambitious, but a solo build with a finite timeline. It should be:

- Realistically developable by one person.
- Explainable in a viva.
- Demonstrable live, end to end.
- Evaluated quantitatively (see `techspec.md` §11).
- Portfolio-worthy on GitHub.
- Extensible into a research paper, if that path is actually pursued.

Technical depth comes from **AI quality + semantic retrieval + a deterministic
decision layer + human-in-the-loop + security + evaluation** — not from
infrastructure that exists to look impressive. A smaller, reliable system beats a
larger, incomplete one. Institutional issue detection is a stronger differentiator
than any additional chatbot-flavored feature — when in doubt about what to build
next, that's the tie-breaker.

## 7. Positioning (for consistency across docs, code comments, and the eventual
   README/demo)

- **Not:** "an AI chatbot for college complaints." **Not:** "an AI complaint
  management system."
- **Is:** "an AI-powered student grievance intelligence and resolution platform that
  transforms unstructured student complaints into categorized, prioritized,
  intelligently routed, trackable and measurable cases while keeping human
  authorities responsible for final decisions."
- **Short form:** "AI-powered grievance intelligence for smarter campus resolution."
- **Research form:** "A hybrid AI framework for multilingual student grievance
  triage, semantic issue detection, and human-in-the-loop institutional
  resolution."
