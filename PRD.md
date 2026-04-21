# Product Requirements Document
## Initiative Tracker — Jira Progress Dashboard

**Author:** Jayraj Vahadane  
**Date:** 2026-04-21  
**Status:** Draft  

---

## 1. Problem Statement

The team follows a structured delivery process: PRD → Initiative → Epic → Stories/Sub-tasks, with testers writing test cases (as Jira Test issue type) linked at the Epic level. Currently, no single view connects development progress and test health under a given Initiative. Jira's native Kanban shows epic stage but hides test status. The Timeline shows scheduling but not test coverage. This makes it impossible to answer _"Is this Initiative actually ready?"_ without manually cross-referencing multiple views.

---

## 2. Goal

Build a personal, locally-run web dashboard that provides:
- Configuration of which Jira projects to track
- A project-scoped view of pinned Initiatives
- A drilldown Initiative Detail view showing per-Epic dev progress and test status
- A rolled-up health indicator per Epic and per Initiative

---

## 3. Users

| User | Context |
|------|---------|
| Jayraj Vahadane | Primary (only) user. Personal local tool. Runs on localhost. |
| VP / Executive | Reads executive view during PI reviews or check-ins. No Jira access required. |

No authentication UI required. Jira credentials stored in a local `.env` file.

---

## 4. Jira Context

| Detail | Value |
|--------|-------|
| Jira instance | `lmsportal.atlassian.net` (Jira Cloud) |
| Issue hierarchy | Initiative → Epic → Story / Sub-task |
| Initiative type | Custom issue type in Jira (real hierarchy level) |
| Test management | X-ray Cloud — Test issues linked to Epics |
| Test data source | **Jira fallback**: query `issuetype = Test` linked to each Epic via Jira issue links. No X-ray API required. |

---

## 5. Tech Stack

### 5.1 Frontend
| Layer | Choice | Reason |
|-------|--------|--------|
| Framework | **React 18** | Component model fits multi-level hierarchy |
| Build tool | **Vite** | Fast local dev, minimal config |
| Routing | **React Router v6** | Navigates between Settings, Initiative List, Initiative Detail |
| Styling | **Plain CSS / CSS Modules** | No extra dependency |
| HTTP client | **Axios** | Clean API call interface |

### 5.2 Backend (Proxy Server)
| Layer | Choice | Reason |
|-------|--------|--------|
| Runtime | **Node.js** | Consistent with frontend JS |
| Framework | **Express** | Lightweight; handles CORS, keeps credentials server-side |
| Database | **SQLite via better-sqlite3** | Lightweight file-based DB; no server, no config, easy to inspect and back up |

### 5.3 Authentication
| Secret | Storage | Notes |
|--------|---------|-------|
| Jira email | `.env` | Used for Basic Auth |
| Jira API token | `.env` | Generated at id.atlassian.com |

Every Jira request uses:
```
Authorization: Basic base64("email:token")
```

### 5.4 External APIs
| API | Base URL | Auth |
|-----|----------|------|
| Jira Cloud REST API v3 | `https://lmsportal.atlassian.net/rest/api/3` | Basic Auth |

### 5.5 Project Structure
```
jira-initiative-view/
├── jira-client/                   # Reusable Jira API package (loosely coupled)
│   ├── package.json               # name: "@local/jira-client"
│   ├── index.js                   # Exports JiraClient class
│   └── README.md                  # Documents public API for reuse in other apps
│
├── server/
│   ├── index.js                   # Express server (port 3001)
│   ├── db.js                      # LowDB JSON store (data/tracker.json)
│   ├── routes/
│   │   ├── projects.js            # CRUD routes for tracked projects
│   │   ├── pins.js                # CRUD routes for pinned initiatives
│   │   ├── jira.js                # Routes that proxy Jira data (initiatives, epics, tests)
│   │   ├── sync.js                # Background sync trigger and status
│   │   └── executive.js           # Aggregated initiative+epic metrics for VP view
│   └── services/
│       └── sync.js                # Sync logic — fetches from Jira and writes to DB
│
├── src/
│   ├── App.jsx
│   ├── pages/
│   │   ├── SettingsPage.jsx
│   │   ├── InitiativeListPage.jsx
│   │   ├── InitiativeDetailPage.jsx
│   │   └── ExecutiveDashboardPage.jsx  # VP-facing executive summary
│   ├── components/
│   │   ├── HealthChip.jsx
│   │   ├── ProgressBar.jsx (inline)
│   │   ├── SummaryBar.jsx
│   │   ├── Nav.jsx
│   │   └── AuthGuard.jsx
│   ├── hooks/
│   │   ├── useProjects.js              # Fetch/mutate projects via API
│   │   ├── usePins.js                  # Fetch/mutate pinned initiatives via API
│   │   ├── useInitiatives.js           # Fetch initiatives for a project
│   │   ├── useInitiativeDetail.js      # Fetch epics + test data for one initiative
│   │   ├── useSyncStatus.js            # Sync trigger and status polling
│   │   └── useExecutiveDashboard.js    # Fetch aggregated executive metrics
│   └── main.jsx
│
├── data/
│   └── tracker.json               # LowDB JSON store (gitignored)
│
├── .env                           # Credentials (gitignored)
├── .env.example
├── package.json
└── vite.config.js
```

---

## 6. Jira Client Module (Reusable Package)

### 6.1 Purpose
`jira-client/` is a **self-contained, loosely coupled** Jira API wrapper. It has zero knowledge of this application's business logic. Any future application can install it as a local npm dependency and use it to talk to any Jira Cloud instance.

### 6.2 Design Principles
- Config is **injected at instantiation** — no `.env` reads inside the module
- Methods return **raw Jira response data** — no transformation, no business logic
- All methods return **Promises** — caller decides how to handle async
- No Express, no SQLite, no React imports — pure HTTP client

### 6.3 Public API

```js
const { JiraClient } = require('@local/jira-client')

const jira = new JiraClient({
  host: 'lmsportal.atlassian.net',   // Jira Cloud hostname
  email: 'user@example.com',          // Atlassian account email
  token: 'your_api_token'             // Atlassian API token
})

// Search issues with JQL
await jira.searchJQL(jqlString, fields)

// Get a single issue by key
await jira.getIssue(issueKey, fields)

// Get all issue links for an issue
await jira.getIssueLinks(issueKey)

// Validate that a project exists
await jira.getProject(projectKey)

// Get all issue types for a project
await jira.getIssueTypes(projectKey)
```

### 6.4 Usage in Other Apps
Any future app that needs Jira data adds this to its `package.json`:
```json
{
  "dependencies": {
    "@local/jira-client": "file:../jira-client"
  }
}
```
Then instantiates it with its own credentials — no coupling to this app's config or DB.

---

## 7. Database Schema (SQLite)

### Table: `projects`
| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER PRIMARY KEY | Auto-increment |
| key | TEXT UNIQUE NOT NULL | Jira project key e.g. `SCHED` |
| name | TEXT NOT NULL | Display name e.g. `Scheduling` |
| created_at | TEXT | ISO timestamp |

### Table: `pinned_initiatives`
| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER PRIMARY KEY | Auto-increment |
| project_key | TEXT NOT NULL | Foreign ref to `projects.key` |
| initiative_key | TEXT NOT NULL | Jira issue key e.g. `SCHED-4548` |
| pinned_at | TEXT | ISO timestamp |
| UNIQUE | (project_key, initiative_key) | No duplicate pins |

Removing a project cascades to delete its pinned initiatives.

---

## 8. Application Flow & Navigation

```
App
├── /settings                  → SettingsPage (configure projects)
├── /                          → InitiativeListPage (default: first configured project)
│    └── [project selector]    → switch between configured projects
├── /initiative/:key           → InitiativeDetailPage (drilldown for one initiative)
└── /executive                 → ExecutiveDashboardPage (VP-level program health summary)
     └── [project selector]    → switch between configured projects
```

---

## 9. UI — Screen by Screen

### 9.1 Settings Page (`/settings`)

**Purpose:** Configure which Jira projects the user wants to track.

**Layout:**
- Header: "Tracked Projects"
- Input form: `Project Key` (e.g. `SCHED`) + `Display Name` (e.g. `Scheduling`) + Add button
- Table of configured projects: Display Name, Project Key, Status, Remove button

**Behaviour:**
- On Add: call Jira API via proxy to validate project exists before saving to DB
- On Remove: deletes project from DB + cascades to remove its pinned initiatives

---

### 9.2 Initiative List Page (`/`)

**Purpose:** Show pinned Initiatives for the currently selected project. All initiatives are available but only pinned ones show by default.

**Layout:**

```
[ Nav: Initiative Tracker ]  [ Settings ⚙ ]
[ Project Tabs: Scheduling | PHP | ... ]   ← from DB
─────────────────────────────────────────
  Scheduling — Tracked Initiatives
  3 tracked · 12 total · Last synced 2 min ago

  [ Search initiatives... ]    [ 📌 Pinned only ▼ ]  [ Show Done ]

  ┌──────────────────────────────────────────────────────────────────────┐
  │ 📌  Initiative Name       Key         Epics  Dev %  Tests  Health   │
  ├──────────────────────────────────────────────────────────────────────┤
  │ 📌  PHP Upgrade 2025      SCHED-4548  5      60%    78%    At Risk ›│
  │ 📌  S3 Bucket Security    SCHED-4453  3      85%    92%    Good    ›│
  │ 📌  Self Scheduling Asgn  SCHED-2726  6      30%    10%    At Risk ›│
  │ ─── Show all (9 more) ──────────────────────────────────────────────│
  └──────────────────────────────────────────────────────────────────────┘

  [ Summary Bar: scoped to pinned initiatives only ]
```

**Behaviour:**

*Pinning:*
- Default view shows only pinned initiatives (read from DB)
- Each row has a 📌 pin icon; clicking toggles pinned/unpinned via API → DB
- "Show all (9 more)" expands to show unpinned initiatives below a divider, dimmed
- Unpinned initiatives show a faded pin; clicking pins them immediately

*Filters:*
- `Pinned only` toggle (default on) — hides unpinned rows
- `Show Done` toggle (default off) — includes Done initiatives
- Search filters visible rows by name client-side

*Navigation:*
- Clicking a project tab loads that project's pinned initiatives
- Clicking a row navigates to `/initiative/:key`
- Summary Bar scoped to pinned initiatives only

---

### 9.3 Initiative Detail Page (`/initiative/:key`)

**Purpose:** Drilldown — epics under one initiative with full dev + test detail.

**Layout:**

```
[ ← Back to Scheduling ]
PHP Upgrade 2025  ·  SCHED-4548  ·  At Risk       [ ↗ Open in Jira ]  [ ↺ Refresh ]
────────────────────────────────────────────────────────────────────────────────────
 Epic               Team          Dev Status      Subtasks    Test Cases  Pass/Fail  Health
────────────────────────────────────────────────────────────────────────────────────
 PHP Upgrade 2025   Code Titans   In Development  ██░ 12/20   ████ 18    14✓ 2✗     Good
 MySQL8 Load Test   Redline Eng   In Review       ███░  8/10  ██░   6     3✓ 2✗     At Risk
 MySql 8 Big Bang   ThunderClock  Ready for Exec  ░░   0/14   ░░    0     Not started Blocked
────────────────────────────────────────────────────────────────────────────────────
[ Summary Bar scoped to this initiative ]
```

**Behaviour:**
- Back link returns to Initiative List for the same project
- Data loads on mount; Refresh re-fetches from Jira
- Each epic key is a link that opens the epic in Jira (new tab)

---

### 9.4 Executive Dashboard Page (`/executive`)

**Purpose:** Give a VP or stakeholder a single-screen view of overall program health — no epic-level noise, no raw counts, just signal.

**Layout:**

```
[ Nav: Initiative Tracker | Initiatives | Executive View | ⚙ Settings ]
[ Project Tabs: Scheduling | PHP | ... ]
──────────────────────────────────────────────────────────────────────
  Scheduling — Executive View
  Program health summary · Synced 5 min ago       [ Show Done ] [ ⟳ Sync ]

  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
  │ 12           │ │  8           │ │  3           │ │  1           │
  │ Total        │ │  On Track    │ │  At Risk     │ │  Blocked     │
  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘

  Initiative Health                       Needs Attention
  ┌─────────────────────────────────┐     ┌──────────────────────────────┐
  │ ● Auth Overhaul        [Good]   │     │ BLOCKED                      │
  │   INIT-42 · Sarah · 4 epics     │     │ Payment Gateway              │
  │   Dev  ████████░░ 82%           │     │ INIT-55 · Mike T             │
  │   Test ███████░░░ 74%           │     │ · 2 epics blocked            │
  │                                 │     │                              │
  │ ● Payment Gateway    [Blocked]  │     │ AT RISK                      │
  │   INIT-55 · Mike · 3 epics      │     │ Mobile Redesign              │
  │   Dev  ████░░░░░░ 41%           │     │ INIT-17 · Alex K             │
  │   Test ██░░░░░░░░ 22%           │     │ · 1 at risk                  │
  │   2 blocked  1 at risk          │     │ · 22% test pass rate         │
  └─────────────────────────────────┘     └──────────────────────────────┘
```

**Behaviour:**

- **KPI Strip**: 4 counts — Total, On Track (Good/Done), At Risk, Blocked. Derived from aggregated epic health per initiative.
- **Initiative Cards**: Sorted by health severity (Blocked → At Risk → Good → N/A). Each card shows:
  - Initiative name, Jira key, assignee, epic count
  - Health badge (colour-coded)
  - Dev progress bar + % (average subtask completion across all epics)
  - Test pass rate bar + % (aggregate pass/total across all epics); shows "No tests" if zero
  - Blocked/at-risk epic count flags when present
  - Click navigates to existing Initiative Detail page
- **Needs Attention Panel**: Auto-populated exception list. Blocked initiatives first, then At Risk. Each item shows the reason (blocked epics, low test pass rate, low dev %). Empty state shows "All initiatives on track".
- **Show Done toggle**: Off by default. When on, includes Done-status initiatives in all counts and cards.
- **Sync button**: Same as initiative list — triggers background sync for current project.
- **Project tabs**: Switch between configured Jira projects.

**Data source:** `GET /api/executive?project=X` (see section 12). Aggregates from local DB — no live Jira calls. Instant load.

---

## 10. Data Fetching Strategy

All Jira data fetched live via the Express proxy using `JiraClient`. No Jira data cached in SQLite (only user config and pins are stored).

### 10.1 Initiative List Page
| Step | Call | Purpose |
|------|------|---------|
| 1 | `GET /api/pins?project=SCHED` | Load pinned initiative keys from DB |
| 2 | `GET /api/jira/initiatives?project=SCHED` | JQL: `project = SCHED AND issuetype = Initiative AND statusCategory != Done` |
| 3 | For each initiative: `GET /api/jira/epics?parent=SCHED-XXXX` | Epic count + summary stats only |

Summary stats are lightweight — no subtask detail loaded here.

### 10.2 Initiative Detail Page
| Step | Call | Purpose |
|------|------|---------|
| 1 | `GET /api/jira/epics?parent=SCHED-XXXX` | All epics under initiative |
| 2 | Per epic: `GET /api/jira/subtasks?parent=SCHED-YYYY` | Subtask done/total |
| 3 | Per epic: `GET /api/jira/tests?epicKey=SCHED-YYYY` | Test issues linked to epic → Pass/Fail/WIP/Not Run |

### 10.3 Test Status Mapping (Jira Fallback)
| Jira Status on Test issue | Mapped To |
|---------------------------|-----------|
| Passed, Done | Pass ✓ |
| Failed | Fail ✗ |
| In Progress, Executing | WIP |
| To Do, Open | Not Run |

---

## 11. Health Calculation Logic

Computed server-side in `server/services/healthCalc.js`.

### Epic Health
| Condition | Health |
|-----------|--------|
| All subtasks done AND test pass rate ≥ 90% | **Good** |
| Dev status Done AND no test cases written | **At Risk** |
| Any test failures AND dev not done | **At Risk** |
| Dev status = Blocked OR 0 tests AND dev past In Development | **Blocked** |
| Dev not started | **N/A** |
| Otherwise | **At Risk** |

### Initiative Health
| Condition | Health |
|-----------|--------|
| All epics Good | **Done** |
| All epics Good or N/A | **Good** |
| Any epic Blocked | **Blocked** |
| Any epic At Risk | **At Risk** |

---

## 12. API Routes (Express)

### Executive Dashboard
| Step | Call | Purpose |
|------|------|---------|
| 1 | `GET /api/executive?project=X` | Returns all initiatives enriched with aggregated epic metrics (dev%, test pass rate, epic counts, health) computed from local DB |

No live Jira calls — all data served from the synced DB snapshot.

---

### Config & Pins (reads/writes SQLite)
| Method | Route | Purpose |
|--------|-------|---------|
| GET | `/api/projects` | List all configured projects |
| POST | `/api/projects` | Add a project (validates with Jira first) |
| DELETE | `/api/projects/:key` | Remove project + cascade delete pins |
| GET | `/api/pins?project=SCHED` | Get pinned initiative keys for a project |
| POST | `/api/pins` | Pin an initiative |
| DELETE | `/api/pins/:projectKey/:initiativeKey` | Unpin an initiative |

### Jira Data (proxies to Jira via JiraClient)
| Method | Route | Purpose |
|--------|-------|---------|
| GET | `/api/jira/initiatives?project=` | Fetch initiatives via JQL |
| GET | `/api/jira/epics?parent=` | Fetch epics under an initiative |
| GET | `/api/jira/subtasks?parent=` | Fetch subtasks under an epic |
| GET | `/api/jira/tests?epicKey=` | Fetch Test issues linked to an epic |

### Executive Aggregation (reads from local DB)
| Method | Route | Purpose |
|--------|-------|---------|
| GET | `/api/executive?project=&includeDone=` | Initiatives with aggregated dev%, test pass rate, epic counts, and derived health. Sorted by severity (Blocked → At Risk → Good → N/A). |

---

## 13. Out of Scope (v1)

- Multi-user / hosted deployment
- Editing Jira issues from the dashboard
- Historical trend charts
- Notifications or alerts
- Mobile responsiveness
- Dark mode
- X-ray Cloud API integration (deferred; using Jira fallback)
- Executive view print/PDF export
- Shareable executive view URL (auth not implemented)

---

## 14. Open Questions

| # | Question | Status |
|---|----------|--------|
| 1 | Is "Initiative" the exact Jira issue type name in your projects? | Pending |
| 2 | Are Test issues linked to Epics via a standard Jira link type (e.g. "tests", "is tested by")? | Pending |
| 3 | Should the project selector be tabs (good for ≤5 projects) or a dropdown? | Pending |
| 4 | Should team name (Code Titans, etc.) be visible per Epic row on the detail page? | Pending |
| 5 | Should due dates appear on the Initiative List or Detail page? | Pending |
