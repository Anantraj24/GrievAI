# GrievAI — Product Requirements Document (PRD)

**Version:** 1.0 (MVP baseline)
**Owner:** Anant (solo developer)
**Status:** Draft — ready for P0 sign-off

---

## 1. Product Summary

GrievAI is an AI-powered student grievance management and institutional-issue-intelligence
platform for colleges. It converts unstructured, natural-language complaints — including
Hindi/Hinglish/informal English — into structured, prioritized, routed, trackable cases,
while keeping human authorities accountable for every consequential decision.

**Positioning:** "AI-powered grievance intelligence for smarter campus resolution."

**Research framing:** A hybrid AI framework for multilingual student grievance triage,
semantic issue detection, and human-in-the-loop institutional resolution.

GrievAI is **not** a chatbot and **not** a CRUD complaint form. Its differentiator is
turning many individually-worded complaints into a visible **institutional issue**
("37 complaints = one hostel water outage, 4 hostels affected") and enforcing an
**AI-recommends → human-decides → backend-executes** architecture end to end.

---

## 2. Problem Statement

Traditional college grievance handling is manual, slow, and blind to patterns:

- Complaints are classified and routed by hand, often to the wrong department.
- The same underlying problem is reported many times in different words and treated
  as unrelated tickets.
- Students must know the institution's internal taxonomy to file correctly.
- Hindi/Hinglish/informal complaints are handled inconsistently.
- There is no SLA enforcement or systematic escalation.
- Evidence handling is ad hoc and often insecure.
- Administrators have no visibility into *recurring* institutional problems — only
  a pile of individual tickets.

A basic CRUD portal does not solve this. The problem is triage, pattern-detection, and
accountability — not data entry.

---

## 3. Goals

| # | Goal |
|---|---|
| G1 | A student can describe a problem in their own words (English/Hindi/Hinglish) with zero knowledge of departmental taxonomy, and have it correctly triaged. |
| G2 | Duplicate/related complaints are surfaced so authorities see patterns, not noise. |
| G3 | Clusters of related complaints are detected and shown as emerging institutional issues. |
| G4 | Every AI recommendation is inspectable, explainable, and overridable — nothing consequential is silently automated. |
| G5 | SLA is tracked and escalation fires on deterministic rules, never on AI judgment. |
| G6 | The system is demonstrable in a viva, portfolio-worthy on GitHub, and extensible into a research paper — without being over-engineered for a solo build. |

### Non-Goals
- Not an autonomous decision-making system. AI never finalizes severity, routing execution, or sends consequential responses without human approval.
- Not a general-purpose campus chatbot.
- Not built for multi-tenant/enterprise scale — this is a single-institution prototype.

---

## 4. Personas

### Student
A user with a real problem and no interest in institutional bureaucracy. Wants to
describe the issue naturally, know it reached the right people, and track it without
having to re-explain or re-escalate manually. May write in Hindi, Hinglish, or informal
English.

### Authority / Faculty
A staff member responsible for a department's queue. Needs to quickly understand what a
complaint is really about, see if it's part of a larger pattern, trust (but verify) the
AI's classification/priority/routing, and act — assign, request info, resolve, escalate —
without the tool getting in the way or making decisions for them.

### Administrator
Owns system configuration (departments, categories, SLA/escalation rules, permissions)
and needs institution-level visibility: what's broken repeatedly, where the backlog is,
how well AI recommendations are holding up, and where humans are overriding them.

---

## 5. Functional Requirements

### 5.1 Student
| ID | Requirement |
|---|---|
| FR-S1 | Register and authenticate |
| FR-S2 | Submit a grievance in natural language, optionally tagging category/location/date |
| FR-S3 | Attach evidence (images, PDFs, documents) |
| FR-S4 | View grievance status and full status timeline |
| FR-S5 | Receive notifications on status-relevant events |
| FR-S6 | Respond to authority requests for more information |
| FR-S7 | View authority responses and resolution |
| FR-S8 | Submit satisfaction feedback on resolution |
| FR-S9 | Reopen/appeal a resolved case where policy permits |

### 5.2 Authority / Faculty
| ID | Requirement |
|---|---|
| FR-A1 | View assigned grievances and department queue, with filter/search |
| FR-A2 | View AI analysis (extraction, category, priority reasons, confidence) for a case |
| FR-A3 | View related/possible-duplicate complaints with similarity score |
| FR-A4 | Accept, modify, or override any AI recommendation (classification, priority, routing) |
| FR-A5 | Request additional information from the student |
| FR-A6 | Communicate with the student on the case thread |
| FR-A7 | Assign/reassign within permission scope |
| FR-A8 | Update grievance status per the defined state machine |
| FR-A9 | Add resolution and upload resolution evidence |
| FR-A10 | Generate an AI response draft, edit it, and approve/send |
| FR-A11 | Escalate a grievance |

### 5.3 Administrator
| ID | Requirement |
|---|---|
| FR-D1 | Manage users, roles, departments, authorities |
| FR-D2 | Manage grievance categories/subcategories |
| FR-D3 | Configure SLA rules and escalation rules |
| FR-D4 | View analytics (volume, distribution, SLA compliance, override rate, AI accuracy) |
| FR-D5 | View the institutional issues dashboard |
| FR-D6 | View audit logs |
| FR-D7 | Manage permissions and system configuration |

---

## 6. Core End-to-End Workflow

```
Student writes complaint (any supported language/register)
        ↓
AI Understanding (extraction: category, entities, duration, urgency signals, confidence)
        ↓
Automatic Classification (category + subcategory + confidence)
        ↓
Priority Signal Extraction (AI) → Deterministic Priority Calculation (backend rules)
        ↓
Embedding generation → Semantic related/duplicate search (pgvector)
        ↓
Routing Recommendation (AI suggestion → deterministic routing table resolves department)
        ↓
Human Authority Review (accept / modify / override)
        ↓
Assignment → Investigation
        ↓
AI Response Draft → Human Edit/Approval → Sent to Student
        ↓
Resolution → Student Feedback
        ↓
SLA breach? → Escalation (deterministic)
        ↓
Institutional Analytics (including cross-complaint issue detection)
```

---

## 7. AI Capabilities Summary

| Module | What it does | What it must never do | Fallback if unavailable |
|---|---|---|---|
| NLU / Extraction | Structured extraction (category, entities, duration, urgency signals) with confidence, `null` for missing facts | Invent facts not present in the complaint | Grievance stored as-is; "AI analysis unavailable — manual review required" |
| Classification | Category + subcategory + confidence | Silently reclassify without showing confidence | Manual category selection by authority |
| Priority signals | Extract safety/urgency/scope signals | Decide final severity itself | Deterministic engine defaults to a conservative priority pending manual review |
| Semantic retrieval | Find related/duplicate complaints via embeddings + pgvector | Auto-merge complaints | Related search unavailable; case still fully functional |
| Institutional issue detection | Group related complaints into a named emerging issue | Auto-close or auto-resolve grouped complaints | Complaints remain individually visible |
| Routing | Recommend department/authority | Directly change operational ownership | Manual routing by authority |
| Response drafting | Draft a reply from trusted case data | Invent policies, deadlines, decisions, or compensation | Authority writes response manually |

Full technical contracts for each module are in `techspec.md`.

---

## 8. Grievance Lifecycle

`SUBMITTED → PENDING_REVIEW → ASSIGNED → IN_PROGRESS → RESOLVED → CLOSED`, with
`NEEDS_INFORMATION`, `REJECTED`, `ESCALATED`, and `REOPENED` as branch states. Every
transition is logged with actor, timestamp, previous/new state, and reason where
required. Full state machine and allowed transitions are in `Appflow.md`.

---

## 9. Non-Functional Requirements

- **Security:** RBAC enforced server-side and at object level; private evidence storage
  with authorized download endpoints; audit logs on every state-changing action.
- **Reliability:** AI failure must never block grievance submission or resolution.
  Retry-once-then-manual-review for malformed AI output.
- **Explainability:** Every priority and routing decision must show its reasons, not
  just its output.
- **Human-in-the-loop as an invariant:** not a togglable feature — no code path lets
  AI output become a final, consequential state change without a human action.
- **Localization tolerance:** must handle English, Hindi, and Hinglish input, including
  informal spelling and short/ambiguous complaints.
- **Measurability:** every module must produce numbers a viva panel or paper can cite
  (see `techspec.md` §Research Metrics).

---

## 10. Definition of Done (MVP)

A student submits: *"Hostel mein 3 din se paani nahi aa raha aur warden ko complain
karne ke baad bhi kuch nahi hua."* The system must, without manual intervention beyond
the specified human review points:

1. Store the grievance with a unique ID.
2. Extract structured information via AI.
3. Predict category/subcategory.
4. Generate priority signals → deterministic priority.
5. Generate an embedding and retrieve related complaints.
6. Show a routing recommendation.
7. Let the authority review, override if needed, and assign.
8. Let the authority generate, edit, and approve an AI response draft.
9. Deliver the response to the student.
10. Track SLA against the assigned priority.
11. Let the authority resolve the case.
12. Let the student give feedback.
13. Surface the case in admin analytics.
14. Contribute the case to an institutional issue if related complaints cross threshold.
15. Log every step in the audit trail.
16. Block unauthorized access to the case and its evidence.
17. Continue functioning end-to-end even if the AI layer is down.

---

## 11. MVP Scope vs. Deferred

**MVP (must-have):** Auth + RBAC · submission · tracking · authority queue · AI
extraction/classification/priority-signals · deterministic priority · embeddings ·
related-complaint retrieval · routing recommendation · human review/override · AI
response draft + human approval · resolution workflow · SLA · basic escalation ·
feedback · basic admin dashboard.

**Deferred (explicitly out of MVP):** advanced clustering algorithms, complex
analytics, email notifications, mobile app, voice complaints, multi-agent AI systems,
fine-tuning, complex RAG chatbot, predictive forecasting, microservices, Kubernetes,
Kafka.

---

## 12. Risks & Assumptions

| Risk / Assumption | Notes |
|---|---|
| Solo developer, finite timeline | Phase discipline (see `Implementationplan.md`) is what keeps this achievable — resist scope creep toward "AI-powered" features that don't serve triage or issue-detection. |
| Local LLM quality on consumer hardware varies | Your machine (RTX 5060, 8GB VRAM) constrains model size/quantization — calibrated recommendation is in `techspec.md`. Low-confidence output must degrade to manual review, not silently ship. |
| Classification/duplicate datasets must be built by hand or synthetically | No real student grievance data without authorization and anonymization. Quality over volume (500–1,500 classification examples; 500–1,000 labelled pairs). |
| Single-institution scope | Multi-tenant support is explicitly out of scope; don't design the schema to require it, but don't actively block it either (see `Schema.md` notes). |

---

## 13. Open Questions (need a decision before P2/P3)

- Which real (or simulated) institution's department structure will seed `departments`/`categories`? This affects routing-table content, not the schema.
- Target number of departments/categories for the demo dataset — affects how convincing the "institutional issue" demo is.
- Will evidence storage be local disk or an S3-compatible store (e.g. MinIO) for the prototype? Either fits the architecture; pick one before P3 to avoid rework.
- Is a research paper submission actually planned, or is the research framing purely for viva/portfolio value? Affects how much rigor to put into the experiments in P9.
