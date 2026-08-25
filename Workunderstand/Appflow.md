# GrievAI — App Flow

**Companion docs:** `Design.md` (visual design, already built in Stitch), `techspec.md`
(status machine rules), `Schema.md` (data backing each screen)

This document maps the **18 core screens** to the user journeys and state transitions
that connect them. Use it as the wiring diagram between what Stitch designed and what
gets built.

---

## 1. Screen Inventory

### Student (6)
1. Login
2. Student Dashboard
3. Submit Grievance
4. AI Processing / Submission Success
5. My Grievances
6. Grievance Details

### Authority (8)
7. Authority Dashboard
8. Grievance Queue
9. Grievance Intelligence Workspace *(most visually important screen — see §5)*
10. AI Analysis / Related Complaints
11. Duplicate Review
12. Assignment
13. Response Draft
14. Resolution / SLA

### Admin (3)
15. Admin Dashboard
16. Institutional Issues
17. Analytics

### Shared (1)
18. Notifications / Profile / Settings Hub

**Reusable states/components used across all screens:** loading, empty, error, AI
failure, confirmation dialogs, status badges, priority badges, timeline component, AI
recommendation card, confidence indicator.

---

## 2. Student Journey

```
Login
  ↓
Student Dashboard  (summary: open cases, recent activity, quick "submit" CTA)
  ↓
Submit Grievance   (free-text entry, optional category/location/date, evidence upload)
  ↓
AI Processing      (loading state while extraction/classification/embedding run)
  ↓
Submission Success (grievance ID shown, initial AI-derived summary shown as "here's
                     what we understood" — not final, pending authority review)
  ↓
My Grievances      (list, filterable by status)
  ↓
Grievance Details   (full timeline, current status, authority responses, ability to
                     reply to information requests, feedback form once resolved)
```

**Branch:** if the authority requests more information, the student sees a
`NEEDS_INFORMATION` state on Grievance Details with a response form — completing it
transitions the case back to `PENDING_REVIEW`.

**Branch:** once `RESOLVED`, Grievance Details shows a feedback prompt and, where
policy allows, a "reopen/appeal" action that transitions to `REOPENED`.

**AI failure branch:** if AI Processing fails or times out, Submission Success still
occurs — the grievance is stored — but the summary panel shows "AI analysis
unavailable — manual review required" instead of the extracted summary. The student
journey is never blocked by this.

---

## 3. Authority Journey

```
Authority Dashboard  (queue summary, SLA-at-risk count, assigned-to-me count)
  ↓
Grievance Queue       (filter/search, sorted by priority/SLA risk by default)
  ↓
Grievance Intelligence Workspace  (the case, opened)
  ├── AI Analysis / Related Complaints  (extraction + classification + confidence +
  │                                        priority reasons)
  ├── Duplicate Review                   (candidate matches, similarity %, merge/link/
  │                                        ignore decision)
  ├── Assignment                         (accept AI-recommended routing, or override
  │                                        and assign manually)
  ├── [investigation happens off-system]
  ├── Response Draft                     (generate AI draft → edit → approve/send)
  └── Resolution / SLA                   (mark resolved, attach resolution evidence;
                                           SLA countdown visible throughout)
```

**Override is a first-class path, not an edge case:** every AI-populated field in the
workspace (category, subcategory, priority, routing) has a visible "AI suggested /
override" control. Overrides are logged (feeds the human-override-rate research
metric).

**Escalation branch:** available from the workspace at any point in `ASSIGNED`,
`IN_PROGRESS`, or automatically on SLA breach — moves the case to `ESCALATED` and
notifies the next level per the escalation engine.

**AI failure branch:** if AI analysis isn't available for a case, the workspace still
renders fully — the AI Analysis panel shows the unavailable-state, and all manual
classification/routing/priority controls remain usable.

---

## 4. Admin Journey

```
Admin Dashboard        (institution-wide snapshot: volume, SLA compliance, workload)
  ↓
Institutional Issues    (emerging-issue cards: title, related-grievance count, first
                          reported, affected locations/departments, trend, status)
  ↓
Analytics                (category/priority distribution, department workload,
                          avg response/resolution time, SLA violations, escalation
                          rate, duplicate/related rate, satisfaction, AI accuracy,
                          human override rate)
```

Admin also reaches user/role/department/category/SLA-rule/escalation-rule
configuration screens (not separately numbered above — these are CRUD management
views off the Admin Dashboard, not part of the primary 18-screen flow).

**Institutional Issues → Analytics link:** an issue card links into filtered analytics
for that specific cluster (e.g. "show me all 37 hostel-water complaints' resolution
progress").

---

## 5. Grievance Intelligence Workspace — Composition

This is the single most important screen. It must combine, without feeling cluttered:

- Case information (student's original text, metadata, evidence)
- AI analysis panel (extraction fields + confidence)
- Priority + explainable reasons ("CRITICAL — safety signal detected...")
- Related/duplicate complaints panel (with similarity scores)
- Routing recommendation + override control
- Status timeline
- SLA countdown/status
- Communication thread (authority ↔ student)
- Action bar (assign, request info, resolve, escalate, generate response draft)

Design direction (per your Stitch design and `Design.md`): dense but not
cluttered — this screen earns its density because it's where the actual decision
happens; other screens should stay lighter.

---

## 6. Notification Triggers → Screens

| Event | Notifies | Lands on |
|---|---|---|
| Grievance submitted | Authority (queue) | Grievance Queue / Workspace |
| Grievance assigned | Authority | Workspace |
| Additional info requested | Student | Grievance Details |
| Authority response received | Student | Grievance Details |
| SLA approaching | Authority | Workspace / Dashboard |
| SLA violated | Authority + Admin | Workspace / Admin Dashboard |
| Escalated | Higher authority / Admin | Workspace / Admin Dashboard |
| Resolved | Student | Grievance Details (feedback prompt) |
| Closed | Student | Grievance Details |

MVP: in-app notifications only, surfaced via the shared Notifications hub (email is
explicitly deferred per `prd.md` §11).

---

## 7. Grievance Status Machine (reference)

See `techspec.md` §6 for the authoritative transition table. Every screen that
displays or changes status must render only the transitions valid from the case's
current state — invalid transitions should not even appear as options in the UI, not
just be rejected server-side.
