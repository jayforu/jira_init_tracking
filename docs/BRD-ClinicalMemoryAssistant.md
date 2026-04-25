# Business Requirement Document & Business Case
# ClinRecall — AI-Powered Clinical Memory Assistant for Doctors

**Version:** 2.6
**Date:** April 25, 2026
**Author:** Product Management
**Status:** Draft for Review — Post Senior Architect + PM Review

**Revision History:**
- v1.0 (Apr 22, 2026) — Initial BRD
- v1.1 (Apr 22, 2026) — Added Technology Stack, Pricing, Go-to-Market
- v1.2 (Apr 22, 2026) — Added Future Product Opportunities (Surgical Consent)
- v1.3 (Apr 22, 2026) — Added Platform Architecture & Extensibility
- **v2.0 (Apr 23, 2026) — Comprehensive revision after Senior Architect + Senior PM review. Addresses FDA/SaMD, malpractice liability, two-party consent laws, realistic financials (CAC, churn, LTV), architectural hardening (RTO/RPO/uptime), MLOps framework, vendor risk, and 8 new operational sections.**
- **v2.1 (Apr 25, 2026) — Native mobile framework decision finalised: React Native with custom native audio modules. Selected for Windows-team friendliness, single codebase, and strong LLM training data for AI-assisted development. Detailed module list and development environment guidance added.**
- **v2.2 (Apr 25, 2026) — Backend API design added (Section 12.8): full REST endpoint surface (~40 endpoints across 9 modules), async AI processing pattern, presigned-URL audio upload flow, authentication model, error handling, rate limiting, and OpenAPI documentation strategy.**
- **v2.3 (Apr 25, 2026) — Cloud platform switched from AWS to Azure based on team familiarity. LLM switched from Claude (AWS Bedrock) to GPT-4o (Azure OpenAI Service) — HIPAA-eligible and ~40% cheaper for our workload. Full service stack mapped to Azure equivalents (Container Apps, PostgreSQL Flexible Server, Blob Storage with Immutability, Service Bus, Functions, Event Grid, Key Vault, Monitor + App Insights). Unit economics updated: AI cost per doctor reduced from $71/year to $42/year; gross margin improved from 89% to ~92%. Pre-engineering checklist updated with Azure OpenAI access application (1-2 week approval).**
- **v2.4 (Apr 25, 2026) — Comprehensive Security & Performance Engineering review added (Section 18.8 in v2.4, renumbered 19.8 in v2.5). Addresses 23 findings across application security testing, AI/LLM-specific controls (prompt injection, output validation), mobile security (certificate pinning, jailbreak detection), insider threat controls, audit/SIEM, performance SLOs per endpoint, load testing, database performance engineering, tiered LLM strategy (~30% AI cost savings), caching strategy, auto-scaling rules, cost anomaly detection. 4 CRITICAL and 7 HIGH severity items must be resolved before engineering kickoff.**
- **v2.5 (Apr 25, 2026) — User Experience Design section added (new Section 9). Defines 3 core UX principles, 3 critical user journeys, visual design system, key screen designs (recording, pre-visit brief, note review), accessibility requirements (WCAG 2.1 AA), empty/error/loading states, design tooling (Claude Design instead of Figma), usability testing methodology, and UX success metrics. All subsequent sections renumbered (10 through 22).**
- **v2.6 (Apr 25, 2026) — Phased Implementation Strategy added as Section 23. Defines 9 sequential phases from Phase 0 (Pre-Development Prerequisites) through Phase 9 (Year 1 Optimization). Each phase specifies pre-requisites, workstream-by-workstream deliverables (Infrastructure/Backend/Frontend/AI/Mobile/Design/QA/Compliance/Product), exit criteria, key risks, and team focus. Includes phase gate discipline: no phase starts until previous phase exits cleanly.**

---

## TABLE OF CONTENTS

1. [Executive Summary](#1-executive-summary)
2. [Business Case](#2-business-case)
   - 2.1 Problem Statement
   - 2.2 Market Opportunity
   - 2.3 Competitive Landscape
   - 2.4 Financial Projections
   - 2.5 Risk Analysis
3. [Product Vision](#3-product-vision)
4. [Stakeholders](#4-stakeholders)
5. [Business Objectives](#5-business-objectives)
6. [Scope](#6-scope)
7. [Functional Requirements](#7-functional-requirements)
8. [Non-Functional Requirements](#8-non-functional-requirements)
9. [User Experience Design](#9-user-experience-design)
10. [User Stories](#10-user-stories)
11. [Compliance & Regulatory Requirements](#11-compliance--regulatory-requirements)
12. [Data Requirements](#12-data-requirements)
13. [Technology Stack Recommendations](#13-technology-stack-recommendations)
14. [Platform Architecture & Extensibility](#14-platform-architecture--extensibility)
15. [Pricing Strategy](#15-pricing-strategy)
16. [Go-to-Market Strategy](#16-go-to-market-strategy)
17. [Success Metrics](#17-success-metrics)
18. [Delivery Milestones](#18-delivery-milestones)
19. [Operational Excellence & Governance](#19-operational-excellence--governance)
    - 19.1 Support & Operations Plan
    - 19.2 Vendor Risk Management
    - 19.3 Security Framework & Certifications
    - 19.4 Model Governance & MLOps
    - 19.5 Business Continuity & Disaster Recovery
    - 19.6 Patient Rights & Data Governance
    - 19.7 Internationalization Roadmap
    - 19.8 Security & Performance Engineering
20. [Future Product Opportunities](#20-future-product-opportunities)
21. [Assumptions & Dependencies](#21-assumptions--dependencies)
22. [Open Questions](#22-open-questions)
23. [Phased Implementation Strategy](#23-phased-implementation-strategy)

---

## 1. EXECUTIVE SUMMARY

ClinRecall is an AI-powered clinical memory assistant designed for independent practice physicians in the United States. The product records doctor-patient conversations, identifies the doctor's clinical observations, and builds a longitudinal memory layer that surfaces relevant patient context before every future visit.

Unlike existing solutions that focus on documentation and transcription, ClinRecall focuses on **physician recall and continuity of care** — solving the problem of a doctor walking into a visit without adequate context from prior consultations.

The product will be developed in India and sold to the US market, following the proven India-SaaS model. The target go-to-market segment is independent practice physicians — a largely underserved market ignored by enterprise-focused competitors.

**Target Launch:** 7 months from project initiation (pilot at Month 6, public launch at Month 7)
**First Revenue Target:** Month 8
**Pricing:** $99/month per physician
**Break-even Target:** 24-30 months post-launch (revised from 18 months to reflect realistic CAC and churn)

**Critical Prerequisites Before Engineering Kickoff (v2.0 update):**
1. FDA / SaMD classification assessment completed
2. Malpractice liability framework and insurance in place
3. 3 US pilot doctor Letters of Intent secured
4. Two-party consent state handling designed into V1
5. LLM training data exclusion agreements signed

---

## 2. BUSINESS CASE

### 2.1 Problem Statement

Physician burnout in the United States has reached crisis levels. According to the American Medical Association, over **63% of physicians report symptoms of burnout**, with administrative burden identified as the primary driver. Doctors spend an estimated **30-40% of their working hours on documentation and administrative tasks** — time taken away from patient care.

The specific pain points this product addresses:

**Pain Point 1 — Note-taking during visits**
Doctors either type during the consultation (reducing eye contact and patient rapport) or rely on memory after the fact (leading to incomplete notes). Neither approach is satisfactory.

**Pain Point 2 — Loss of context between visits**
Patients often visit 8-12 times per year for chronic conditions. Before each visit, a doctor must manually re-read scattered notes from prior visits. This takes 3-5 minutes per patient and is prone to oversight.

**Pain Point 3 — Follow-up gaps**
Doctors make verbal commitments during consultations ("let's check this again in 6 weeks") that are not systematically tracked. These fall through the cracks, affecting care quality and patient satisfaction.

**Pain Point 4 — Cognitive overload**
An average independent practice physician sees 20-25 patients per day. Retaining meaningful context across all of them without a reliable system is cognitively unsustainable.

**The Net Result:** Reduced quality of care, physician dissatisfaction, and patient frustration — all stemming from a solvable information management problem.

---

### 2.2 Market Opportunity

#### Total Addressable Market (TAM)
- Active licensed physicians in the USA: **~1,000,000**
- Average willingness to pay for productivity tools: $100-200/month
- TAM: **~$1.2 billion/year**

#### Serviceable Addressable Market (SAM)
- Independent practice and small clinic physicians (1-10 doctor practices): **~220,000**
- These physicians make their own purchasing decisions without hospital procurement processes
- SAM: **~$264 million/year**

#### Serviceable Obtainable Market (SOM) — 3-Year Target
- Year 1: 500 physicians → **$594,000 ARR**
- Year 2: 2,500 physicians → **$2.97M ARR**
- Year 3: 6,000 physicians → **$7.12M ARR**

#### Why Independent Physicians Specifically
- No hospital IT procurement process — doctor decides and pays same day
- High pain, low current solution coverage
- Word-of-mouth spreads rapidly within medical communities and specialty groups
- Willingness to pay is established — they already pay for EMR tools, dictation software, and scheduling platforms

#### Market Timing
AI voice accuracy (specifically speaker diarization and medical terminology recognition) has crossed the reliability threshold in 2024-2025. Two years ago this product could not be built accurately enough to trust in a clinical setting. The window to enter is now open and will not stay open long.

---

### 2.3 Competitive Landscape

| Competitor | Backing | Target Market | Core Feature | Key Weakness | Pricing |
|---|---|---|---|---|---|
| Nuance DAX | Microsoft ($19.7B acquisition) | Large hospital systems | Ambient documentation | Enterprise only, complex setup | Not public (~$500+/mo) |
| Suki AI | $165M raised | Mid-size clinics | Voice EHR assistant | Not for solo doctors, expensive | Not public |
| Abridge | Google + UPMC backed | Hospital systems | Conversation summary | No longitudinal memory | Enterprise |
| DeepScribe | $30M raised | Clinics | Auto SOAP notes | Documentation only, no memory layer | ~$300/mo |
| **Freed AI** | Early stage | **Independent doctors** | Simple note generation | No cross-visit intelligence | $99-149/mo |
| Nabla | European, expanding US | Clinics | Ambient notes | US market secondary focus | ~$149/mo |
| **Heidi Health** | Australian, US-expanding | Solo docs and small clinics | Ambient scribe + templates | Still documentation-centric | ~$99-129/mo |
| **Sunoh.ai** | Epic-backed | Clinics using Epic | EHR-integrated scribe | Locked to Epic customers | ~$99-199/mo |
| **Playback Health** | US | Independent physicians | Ambient scribe | Limited memory features | ~$99/mo |
| **Tali AI** | Canadian, moving US | Solo docs | Voice commands + scribe | Canadian compliance focus | ~$79-99/mo |
| **Scribeberry** | Canadian, US-growing | Independent doctors | SOAP note generation | Minimal platform extensibility | ~$79-99/mo |

#### Competitive Gap — The Opportunity (Honest Assessment)

Every competitor is solving **today's note from today's visit.** None provide a structured pre-visit intelligence brief synthesised across a patient's full history.

**The Moat Reality:**

This differentiation is real, but it is an **execution lead-time moat, not a structural moat**. Any competitor with existing note data can build a pre-visit brief feature in 8-12 weeks. Our defensibility depends on:

| Moat Type | Strength | Timeline to Compete Away |
|---|---|---|
| Pre-visit brief feature | Weak (replicable) | 2-3 months for a well-funded competitor |
| Execution speed and product depth | Medium | 6-12 months |
| Medical conversation dataset + proprietary fine-tuning | Strong | 18+ months once accumulated |
| Deep EHR integration (Epic, Cerner) | Strong | 12-24 months per EHR |
| Multi-specialty clinical workflows | Strong | 12+ months per specialty |
| Independent doctor brand trust + word-of-mouth | Medium-Strong | Compounds over time |

**Strategic implication:** The pre-visit brief is the wedge that wins the first 500 customers. It is NOT the moat that sustains us at 50,000 customers. We must concurrently invest in deeper moats (dataset, EHR integration, specialty-specific workflows) from Month 6 onwards.

**The Market Is More Crowded Than It Appears:**

At the independent-doctor price point ($79-149/month), at least 8 serious competitors now operate. The rate of new entrants is accelerating — AI scribes have become the second wave of healthcare SaaS after EHRs. Our window to establish brand and dataset advantage is 12-18 months, not 2-3 years.

---

### 2.4 Financial Projections

> **v2.0 REVISION NOTE:** The v1.x financial model did not account for Customer Acquisition Cost (CAC), churn, or realistic conversion rates. The v2.0 model below is the realistic base case. It is materially less optimistic but investor-credible. A separate "optimistic" scenario is provided for comparison.

#### Development Investment (India-Based Team) — Revised to 9-10 Roles

| Role | Count | Monthly Cost (INR) | Monthly Cost (USD) |
|---|---|---|---|
| Backend Engineer | 2 | ₹2,40,000 | $2,880 |
| Frontend Engineer | 1 | ₹1,20,000 | $1,440 |
| AI/ML Engineer | 1 | ₹1,60,000 | $1,920 |
| DevOps / SRE Engineer (NEW) | 1 | ₹1,50,000 | $1,800 |
| QA Engineer (NEW) | 1 | ₹90,000 | $1,080 |
| Product Manager | 1 | ₹1,00,000 | $1,200 |
| UI/UX Designer | 1 | ₹80,000 | $960 |
| Customer Success Manager (NEW, US-based, part-time Month 6+) | 0.5 | N/A | $2,500 |
| Clinical Content Reviewer (NEW, part-time) | 0.5 | ₹75,000 | $900 |
| **Total Team Cost** | **9 FTE + 1 part-time** | — | **~$14,680/mo** |

**Rationale for team expansion (addresses senior review):** HIPAA-compliant infrastructure, two AI vendors, clinical-grade quality, and doctor-facing trust require engineering disciplines and clinical review that a 6-person team cannot deliver credibly.

#### One-Time Costs (Year 1) — Revised

| Item | Estimated Cost (USD) |
|---|---|
| Azure HIPAA-compliant infrastructure setup | $8,000 |
| HIPAA compliance audit and legal | $12,000 |
| **FDA / SaMD regulatory assessment (NEW)** | $15,000 |
| **Penetration testing + security audit (NEW)** | $10,000 |
| **SOC 2 Type I readiness (NEW)** | $20,000 |
| AI/ML model licensing or API costs (6 months) | $15,000 |
| US legal entity setup (Delaware LLC) | $3,000 |
| Design, branding, website | $5,000 |
| **Professional liability + cyber insurance (NEW)** | $12,000 |
| **US medical advisor (3% equity vesting 2 yrs, $2K/mo retainer)** | $24,000 |
| **Total One-Time + Year 1 Setup** | **$124,000** |

#### Variable Costs (Unit Economics per Doctor)

| Cost Driver | Assumption | Annual Cost per Active Doctor |
|---|---|---|
| AssemblyAI (speech-to-text + diarization) | 260 hours/year @ $0.12/hr | $31 |
| GPT-4o via Azure OpenAI (extraction) | ~180 sessions/year × ~13.5K tokens avg | ~$9 |
| Embeddings via Azure OpenAI text-embedding-3-large | Patient note embeddings, refresh on edit | ~$2 |
| Azure infra (compute + storage + bandwidth) allocated per doctor | — | $24 |
| Email, Auth0, Stripe fees (2.9%) | — | $35 |
| **Total Variable Cost per Doctor/Year** | — | **~$101** |
| **Annual Revenue per Doctor** | $99/mo × 12 | $1,188 |
| **Gross Margin per Doctor** | — | **~92%** |

At 92% gross margin, the business model is sound *provided CAC is controlled*. (Improved from 89% in v2.0 — switching to Azure + GPT-4o reduced AI cost by ~$30/doctor/year.)

#### Customer Acquisition Cost (CAC) Modeling

Industry benchmarks for B2B healthcare SaaS selling to independent practitioners: CAC ranges $400-1,500 per customer depending on channel mix.

| Channel | Expected CAC | Share of Acquisition |
|---|---|---|
| Word of mouth / referral | $150 | 30% |
| Medical advisor / pilot network | $200 | 15% |
| Content marketing + SEO | $600 | 20% |
| Paid search + Doximity ads | $1,200 | 25% |
| Medical association partnerships | $400 | 10% |
| **Blended CAC (base case)** | — | **~$650 per doctor** |

#### Churn Modeling

| Timeframe | Monthly Churn | Annual Churn | Notes |
|---|---|---|---|
| Months 1-12 (early adopters, high touch) | 2.5% | 26% | Normal for early SaaS |
| Months 13-24 (steady state) | 1.8% | 20% | Achievable if product-market fit is strong |
| Months 25+ (mature) | 1.2% | 14% | Target steady state |

**Implication:** At 20% annual churn and 500 active paying doctors, we need ~10 new doctors per month just to maintain — more to grow.

#### LTV and Payback Period

- Average Revenue per Doctor per Year: $1,188
- Gross Margin: 89% → Gross Profit per Doctor per Year: $1,058
- Average Customer Lifetime (at 20% annual churn): 5 years
- **Customer Lifetime Value (LTV): ~$5,290**
- **LTV / CAC Ratio: 8.1** (well above SaaS threshold of 3.0)
- **CAC Payback Period: 7.4 months** (healthy; target <12 months)

#### Revenue Projections — Realistic Base Case

Trial-to-paid conversion revised from 25-30% (unrealistic) to 10-12% (industry benchmark for self-serve SaaS with concierge onboarding).

| Period | New Signups (cumulative) | Trial-to-Paid (10%) | Active Paying (after churn) | MRR | ARR |
|---|---|---|---|---|---|
| Month 7 (pilot launch) | 50 (pilot) | 5 pilot converts | 5 | $495 | — |
| Month 9 | 250 | 25 | 24 | $2,376 | — |
| Month 12 (Year 1 end) | 800 | 80 | 72 | $7,128 | $85,536 |
| Month 18 | 2,400 | 240 | 195 | $19,305 | $231,660 |
| Month 24 (Year 2 end) | 5,500 | 550 | 420 | $41,580 | $498,960 |
| Month 36 (Year 3 end) | 12,000 | 1,200 | 850 | $84,150 | $1,009,800 |

#### Total Year 1 Investment — Revised

| Category | Cost (USD) |
|---|---|
| Team (12 months, expanded) | $176,160 |
| One-time setup costs (expanded) | $124,000 |
| Ongoing infrastructure (monthly ~$3,000) | $36,000 |
| Marketing and pilot program | $40,000 |
| **CAC spend (NEW — 200 acquired doctors × $650)** | $130,000 |
| Contingency (15%) | $75,924 |
| **Total Year 1 Investment (Realistic)** | **~$582,000** |

> The v1.x budget of $216K was dangerously optimistic. The realistic budget is ~$580K. This materially changes the funding ask for Seed round.

#### Break-Even Analysis — Revised

- Monthly operating cost at scale (Month 24): ~$45,000 (team + infra + support + CAC)
- Break-even at: ~450 paying doctors with CAC spend normalised
- **Realistic break-even: Month 24-30**
- ROI positive by Month 30

#### Funding Recommendation

Based on the revised model:
- **Seed round target: $750K-$1M** (12-15 month runway with buffer)
- Series A at Month 18-24 when ARR crosses $300K and retention data is proven
- Bootstrapping is feasible only if founders contribute $400K+ upfront

#### Optimistic vs. Realistic vs. Conservative Scenarios

| Scenario | Year 3 ARR | Assumption |
|---|---|---|
| Conservative | $600K | 6% conversion, 25% churn, $900 CAC |
| **Realistic (Base)** | **$1.0M** | 10% conversion, 20% churn, $650 CAC |
| Optimistic | $2.1M | 15% conversion, 12% churn, $400 CAC |

Plan for Realistic. Budget for Conservative. Celebrate Optimistic.

---

### 2.5 Risk Analysis

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| **FDA classification as Software as a Medical Device (SaMD) — NEW** | **Medium** | **Very High** | Engage FDA regulatory consultant before build. Position strictly as documentation tool. Intelligence Layer prompts must not generate clinical recommendations. |
| **Malpractice claim from AI-generated error — NEW** | **Medium** | **Very High** | Mandatory doctor review; disclaimer on every unsigned note; $2M+ professional liability + cyber insurance; clear indemnification in ToS |
| **Two-party consent state violation — NEW** | **Medium** | **High** | Product-enforced consent workflow in 11 two-party states; clinic address drives state detection; patient consent acknowledgement cannot be bypassed |
| **LLM provider uses inputs for training — NEW** | **Low** | **Very High** | Contractual confirmation in writing; Azure OpenAI default is no training use; annual vendor compliance review |
| HIPAA non-compliance penalty | Low | Very High | Invest in compliance from Day 1, get formal audit before launch |
| AI accuracy errors in clinical notes | Medium | High | Doctor review step mandatory before saving, no auto-filing, continuous evaluation framework (see Section 19.4) |
| Freed AI or competitor copies the pre-visit brief feature | High | Medium | 12-18 month execution lead; invest concurrently in dataset, EHR integration, specialty workflows (see Section 2.3 competitive moat analysis) |
| Low adoption — doctors don't change habits | Medium | High | Free 60-day pilot, white-glove onboarding for first 50 doctors, measured via D30/D90 retention |
| Data breach | Low | Very High | Azure HIPAA infra, penetration testing, cyber insurance, SOC 2 Type II by Month 18 |
| Difficulty finding first US customers from India | High | Medium | US medical advisor on 3% equity + retainer; 3 pilot LOIs before build begins |
| AI/LLM API cost spikes | Medium | Medium | Unit economics monitored monthly; evaluate open-source models; enterprise pricing negotiation at 1,000+ doctors |
| **Vendor lock-in on AssemblyAI or Azure OpenAI — NEW** | Medium | High | Layer 2 and Layer 3 abstract vendor-specific APIs; maintain capability to swap vendors within 4 weeks |
| **Browser audio capture failures (iOS/Android background throttling) — NEW** | High | Medium | PWA from Day 1; native iOS app by Month 8; fallback upload if live stream fails |
| **Team scaling or key-person dependency — NEW** | Medium | High | Document all critical knowledge; minimum 2 engineers on every critical system; founder succession plan for health/unavailability |
| **Unrealistic CAC or churn assumptions in financial model — NEW** | Medium | High | Monitor CAC and churn from Month 1; adjust spend if CAC > $900 or monthly churn > 3% |

---

## 3. PRODUCT VISION

**Product Name:** ClinRecall

**Tagline:** *Your memory, between every visit.*

**Vision Statement:**
ClinRecall will become the default clinical memory layer for independent practice physicians in the United States — the tool that ensures no patient context is ever lost between visits, and no doctor ever walks into a room unprepared.

**Product Positioning:**
ClinRecall is not an EHR. It is not a transcription tool. It is a doctor's personal clinical assistant that listens, remembers, and prepares — so the doctor can focus entirely on the patient.

---

## 4. STAKEHOLDERS

| Stakeholder | Role | Involvement |
|---|---|---|
| Independent Practice Physician | Primary User | Uses product daily; key feedback source |
| Product Manager | Owner | Defines requirements, prioritizes backlog |
| Engineering Team | Builders | Backend, frontend, AI/ML development |
| UI/UX Designer | Experience | Patient-zero for usability testing |
| Legal / Compliance Advisor | Risk | Ensures HIPAA adherence |
| US Medical Advisor | GTM | Physician network, pilot recruitment, credibility |
| Investors / Founders | Funders | Business viability and ROI |

---

## 5. BUSINESS OBJECTIVES

| # | Objective | Measure | Target |
|---|---|---|---|
| BO-1 | Reduce doctor's post-visit documentation time | Minutes spent per note | Reduce from 8 min to under 2 min |
| BO-2 | Improve doctor recall of prior visit context | % of visits with pre-brief viewed | >80% of sessions |
| BO-3 | Achieve product-market fit | NPS score from pilot doctors | NPS > 50 |
| BO-4 | Reach revenue sustainability | Monthly Recurring Revenue | $50,000 MRR by Month 18 |
| BO-5 | Build trust in AI accuracy | Doctor-reported accuracy of note summaries | >90% accuracy satisfaction |

---

## 6. SCOPE

### 6.1 In Scope — Version 1

- Progressive Web App (PWA) — installable from browser, works offline for read-only views
- Patient profile creation and management
- Ambient audio recording during consultation (with failure-resistant capture via PWA Service Worker)
- Two-speaker identification (Doctor vs. Patient)
- AI-generated clinical note extraction from doctor's speech
- Doctor review, edit, and mandatory confirmation of generated notes
- Visible disclaimer on every unsigned note ("AI-generated, pending physician review")
- Patient visit history storage
- Pre-visit brief generation before each appointment
- Semantic + keyword hybrid search across patient notes (via pgvector)
- HIPAA-compliant data storage and access controls
- Doctor account creation, login (MFA required), and subscription management
- Basic usage dashboard for the doctor
- **State-aware two-party consent workflow (NEW)** — product detects clinic state and enforces all-party consent acknowledgement in 11 two-party states
- **Doctor-side patient consent capture (NEW)** — explicit workflow for capturing patient consent before recording begins
- **Note signature workflow (NEW)** — doctor must sign off on each note; signed notes are immutable
- **Data export (NEW)** — doctor can export all their data on demand (doctor/patient portability)
- **Patient data deletion workflow (NEW)** — doctor can action a patient deletion request within 30 days

### 6.2 Out of Scope — Version 1

- Native iOS or Android application (planned for Month 8, not V1)
- EHR / EMR integration (Epic, Cerner, AthenaHealth) — planned for V3
- Patient-facing features or portal
- Multi-speaker support beyond two parties (nurse, family member) — consent documentation use case in V2
- Real-time suggestions during the consultation (regulatory risk — potentially SaMD)
- Automated billing or insurance code generation
- Team or clinic-level accounts (multi-doctor practice management)
- API access for third-party integrations
- Real-time collaborative editing of notes
- Multi-language support (English only for V1)

---

## 7. FUNCTIONAL REQUIREMENTS

### Module 1: Authentication & Account Management

| ID | Requirement | Priority |
|---|---|---|
| FR-1.1 | Doctor can register with email and password | Must Have |
| FR-1.2 | Email verification required on signup | Must Have |
| FR-1.3 | Doctor can log in securely via email/password | Must Have |
| FR-1.4 | Password reset via email | Must Have |
| FR-1.5 | Doctor must accept BAA (Business Associate Agreement) during signup | Must Have |
| FR-1.6 | Doctor can update profile (name, specialty, clinic name) | Should Have |
| FR-1.7 | Session timeout after 30 minutes of inactivity | Must Have |

---

### Module 2: Patient Profile Management

| ID | Requirement | Priority |
|---|---|---|
| FR-2.1 | Doctor can create a new patient profile | Must Have |
| FR-2.2 | Patient profile fields: First name, Last name, Date of birth, Gender, Medical record number (optional) | Must Have |
| FR-2.3 | Doctor can search for patients by name or medical record number | Must Have |
| FR-2.4 | Doctor can view list of all patients sorted by last visit date | Must Have |
| FR-2.5 | Doctor can archive a patient (soft delete, data retained) | Should Have |
| FR-2.6 | Doctor can edit patient profile details | Must Have |

---

### Module 3: Session Recording

| ID | Requirement | Priority |
|---|---|---|
| FR-3.1 | Doctor selects a patient and starts a new session with one tap | Must Have |
| FR-3.2 | App records ambient audio via device microphone | Must Have |
| FR-3.3 | Recording indicator visible on screen at all times during session | Must Have |
| FR-3.4 | Doctor can pause and resume recording during session | Should Have |
| FR-3.5 | Doctor can end session with one tap | Must Have |
| FR-3.6 | App confirms session end before stopping recording | Must Have |
| FR-3.7 | Session date, time, and duration automatically captured | Must Have |
| FR-3.8 | Raw audio is encrypted in transit and deleted after note generation | Must Have |
| FR-3.9 | Doctor is notified if microphone access is denied | Must Have |

---

### Module 4: AI Processing & Note Generation

| ID | Requirement | Priority |
|---|---|---|
| FR-4.1 | System performs speaker diarization to identify two speakers (Doctor and Patient) | Must Have |
| FR-4.2 | System extracts the following from the doctor's speech: observations, working diagnosis, medications mentioned, instructions given, follow-up commitments | Must Have |
| FR-4.3 | Extracted notes presented as structured, editable summary (not raw transcript) | Must Have |
| FR-4.4 | Note sections: Chief Concern, Doctor's Observations, Assessment, Plan, Follow-up | Must Have |
| FR-4.5 | Processing completes within 3 minutes of session end | Must Have |
| FR-4.6 | Doctor is notified (in-app and/or email) when note is ready for review | Should Have |
| FR-4.7 | If processing fails, doctor is notified and offered manual note entry | Must Have |
| FR-4.8 | System confidence score displayed alongside each note section | Nice to Have |

---

### Module 5: Note Review & Editing

| ID | Requirement | Priority |
|---|---|---|
| FR-5.1 | Doctor can review AI-generated note before saving | Must Have |
| FR-5.2 | Doctor can edit any section of the note inline | Must Have |
| FR-5.3 | Doctor can add free-text notes to any section | Must Have |
| FR-5.4 | Doctor must explicitly confirm/save the note — no auto-save without review | Must Have |
| FR-5.5 | Doctor can discard and re-generate note (limited to 2 attempts) | Should Have |
| FR-5.6 | Doctor can flag a note as inaccurate for product team review | Should Have |
| FR-5.7 | Saved notes are immutable — edits create a new version with timestamp | Should Have |

---

### Module 6: Pre-Visit Brief

| ID | Requirement | Priority |
|---|---|---|
| FR-6.1 | When doctor opens a patient profile, a pre-visit brief is shown at the top | Must Have |
| FR-6.2 | Pre-visit brief contains: last visit date and summary, unresolved follow-ups, recurring symptoms across visits, last prescribed medications | Must Have |
| FR-6.3 | Pre-visit brief is limited to 5-7 key points — concise by design | Must Have |
| FR-6.4 | Doctor can expand brief to view full history | Must Have |
| FR-6.5 | System highlights follow-up items that are overdue (past agreed date) | Should Have |
| FR-6.6 | System surfaces patterns (e.g., "Patient has mentioned fatigue in 3 of last 4 visits") | Nice to Have |
| FR-6.7 | Doctor can dismiss or snooze a follow-up reminder | Should Have |

---

### Module 7: Patient Visit History & Search

| ID | Requirement | Priority |
|---|---|---|
| FR-7.1 | Doctor can view chronological list of all sessions for a patient | Must Have |
| FR-7.2 | Doctor can open and read any past session note | Must Have |
| FR-7.3 | Doctor can search within a patient's history using keywords | Must Have |
| FR-7.4 | Doctor can search across all patients (e.g., "which patients are on metformin") | Should Have |
| FR-7.5 | Search results highlight matching terms in context | Should Have |
| FR-7.6 | Doctor can filter sessions by date range | Should Have |

---

### Module 8: State-Aware Consent & Recording Compliance (NEW in v2.0)

| ID | Requirement | Priority |
|---|---|---|
| FR-8.1 | System detects the US state from the doctor's clinic address at signup | Must Have |
| FR-8.2 | In two-party consent states (CA, FL, IL, MD, MA, MT, NH, PA, WA, CT, MI), the system enforces explicit all-party consent acknowledgement before recording can start | Must Have |
| FR-8.3 | Doctor must confirm verbal or written patient consent via a mandatory checkbox at session start | Must Have |
| FR-8.4 | System provides a standard patient consent script in the doctor's interface | Must Have |
| FR-8.5 | If patient/relatives consent is not confirmed, recording button is disabled | Must Have |
| FR-8.6 | State detection and consent status are stored in the session record (audit trail) | Must Have |
| FR-8.7 | When a doctor changes clinic location, consent rules are re-evaluated | Should Have |
| FR-8.8 | Doctor can view compliance status dashboard (state-specific reminders) | Nice to Have |

---

### Module 9: Note Signature & Liability Protection (NEW in v2.0)

| ID | Requirement | Priority |
|---|---|---|
| FR-9.1 | Every AI-generated note displays a visible disclaimer until signed: "AI-generated; pending physician review" | Must Have |
| FR-9.2 | Doctor must sign the note (electronic signature via password re-authentication) to mark it complete | Must Have |
| FR-9.3 | Signed notes are immutable; edits create a new versioned entry with timestamp and reason | Must Have |
| FR-9.4 | Signed notes record: signing timestamp, doctor ID, IP, and a hash of content (integrity proof) | Must Have |
| FR-9.5 | Unsigned notes older than 7 days trigger a reminder to the doctor | Should Have |
| FR-9.6 | Export of a signed note includes the integrity hash and signature metadata | Should Have |

---

### Module 10: Patient Rights & Data Governance (NEW in v2.0)

| ID | Requirement | Priority |
|---|---|---|
| FR-10.1 | Doctor can action a patient data access request (all notes for that patient exportable as PDF) within 30 days | Must Have |
| FR-10.2 | Doctor can action a patient data correction request (add amendment to specific note, preserving original) | Must Have |
| FR-10.3 | Doctor can action a patient data deletion request (hard delete after required retention period) | Must Have |
| FR-10.4 | All patient rights requests are logged with timestamp and action taken | Must Have |
| FR-10.5 | Doctor receives a reminder 25 days after a request is logged if not yet actioned | Should Have |

---

### Module 11: Subscription & Billing

| ID | Requirement | Priority |
|---|---|---|
| FR-11.1 | Doctor can sign up for a 60-day free trial without credit card | Must Have |
| FR-11.2 | Doctor can subscribe at $99/month after trial | Must Have |
| FR-11.3 | Payment processed via Stripe | Must Have |
| FR-11.4 | Doctor can cancel subscription at any time | Must Have |
| FR-11.5 | Doctor receives invoice via email monthly | Must Have |
| FR-11.6 | Data retained for 90 days after cancellation, then deleted | Must Have |
| FR-11.7 | Doctor can download all their data before cancellation | Should Have |
| FR-11.8 | `use_case_type` is a dimension of the subscription record (supports future multi-product billing) | Must Have |

---

## 8. NON-FUNCTIONAL REQUIREMENTS

### 8.1 Performance

| ID | Requirement |
|---|---|
| NFR-1.1 | App loads within 2 seconds on a standard mobile connection |
| NFR-1.2 | Note generation completes within 3 minutes of session end |
| NFR-1.3 | Search results return within 1 second |
| NFR-1.4 | System supports up to 5,000 concurrent users at launch |

### 8.2 Security & Compliance

| ID | Requirement |
|---|---|
| NFR-2.1 | All data encrypted at rest (AES-256) |
| NFR-2.2 | All data encrypted in transit (TLS 1.2+) |
| NFR-2.3 | Hosted on HIPAA-eligible Azure infrastructure (East US 2 primary, West US 2 warm-standby DR) |
| NFR-2.4 | Multi-tenant isolation via row-level security in PostgreSQL — each doctor accesses only their own data, enforced at database layer |
| NFR-2.5 | Audit logs written to Azure Blob Storage with Immutability Policies (WORM compliance mode), 6-year retention, immutable even to admin |
| NFR-2.6 | **Raw audio retained for 72 hours encrypted then hard-deleted** (revised from 1 hour — enables reprocessing on failure and short-window re-review) |
| NFR-2.7 | Penetration testing conducted before launch and annually thereafter |
| NFR-2.8 | BAA signed with Microsoft (Azure + Azure OpenAI) and all sub-processors handling PHI |
| NFR-2.9 | **SOC 2 Type I by Month 12, Type II by Month 18 (NEW)** |
| NFR-2.10 | **MFA required for all doctor accounts (no opt-out) (NEW)** |
| NFR-2.11 | **LLM provider contracts prohibit use of inputs for model training (NEW)** |
| NFR-2.12 | **Zero-trust network model — no VPN access to production PHI; break-glass access logged and reviewed monthly (NEW)** |

### 8.3 Reliability & Availability — Revised per senior review

| ID | Requirement |
|---|---|
| NFR-3.1 | **System uptime: 99.9% (max ~43 min/month downtime) — revised from 99.5%** |
| NFR-3.2 | Automated continuous backups of clinical notes (point-in-time recovery) |
| NFR-3.3 | **Disaster recovery plan with RTO < 1 hour, RPO < 15 minutes — revised from 4h/24h** |
| NFR-3.4 | **Multi-AZ deployment in primary region (active-passive); warm-standby in secondary region (NEW)** |
| NFR-3.5 | **Capture layer must survive network interruption — audio buffered locally and uploaded on reconnection (NEW)** |
| NFR-3.6 | **Error budget and SLO framework (NEW) — engineering maintains quarterly SLO review** |

### 8.4 Usability

| ID | Requirement |
|---|---|
| NFR-4.1 | New doctor onboarding (signup to first recording) completable in under 10 minutes |
| NFR-4.2 | Core workflow (start session → stop → review note → save) requires no training |
| NFR-4.3 | App works on iOS Safari and Android Chrome without installation |
| NFR-4.4 | Font size and contrast meet WCAG 2.1 AA accessibility standards |

### 8.5 Scalability

| ID | Requirement |
|---|---|
| NFR-5.1 | Architecture supports horizontal scaling to 50,000 doctors without redesign |
| NFR-5.2 | Data storage architecture supports 5 years of session data per doctor |

---

## 9. USER EXPERIENCE DESIGN

### 9.1 UX Philosophy

For a doctor-facing clinical tool, **UX is the product**. A doctor sees ~20 patients per day with 12-18 minutes each. Friction kills adoption regardless of how good the underlying AI is.

ClinRecall's UX must do something paradoxical:
- **Invisible during the consultation** — zero cognitive overhead while the doctor is with a patient
- **Deeply useful between consultations** — surfaces critical context in seconds, not minutes

Every design decision is judged against this dual requirement.

---

### 9.2 Three Core UX Principles

#### Principle 1 — One-Tap to Critical Actions

The two most consequential moments in a doctor's day are:
- **Starting a recording** (when the patient walks in)
- **Reviewing a generated note** (in 30-second gaps between visits)

Both must be reachable in **one tap from the home screen**. Every additional tap is a defection point. This principle overrides aesthetic preferences.

#### Principle 2 — Information Density Without Clutter

Doctors scan, they don't read. UX must surface the right 5 facts, not all 50.

A pre-visit brief that says *"Patient mentioned knee pain in last 3 visits, no follow-up scheduled"* in one sentence is dramatically more useful than a 200-word summary.

Discipline: every screen must answer "what does the doctor need in the next 10 seconds?" — not "what data could we display?"

#### Principle 3 — Trust Through Transparency

Doctors will not trust AI-generated content unless they can see exactly what came from where.

Every claim in a generated note must be traceable to a moment in the source conversation. If a doctor cannot quickly verify the AI's output, they will not sign it. If they cannot sign confidently, they churn.

---

### 9.3 Core User Journeys

#### Journey 1 — Daily Clinic Day (the 80% use case)

```
8:30 AM  ─ Doctor opens app on phone before clinic starts
         ─ HOME SCREEN shows today's appointments
         ─ Each appointment card shows pre-visit brief preview
         ─ One tap on first patient → expanded brief

8:45 AM  ─ Patient arrives in exam room
         ─ Doctor taps "Start Session" (1 tap; patient pre-linked from schedule)
         ─ Recording indicator visible; everything else minimal

9:05 AM  ─ Consultation ends, doctor taps "End Session"
         ─ App says: "Note ready in ~90 seconds. We'll notify you."
         ─ Doctor moves to next patient

9:20 AM  ─ Push notification: "Note ready for John Smith"
         ─ Doctor reviews during gap between patients
         ─ Biometric sign (Face ID / Touch ID) — 1 second to commit

         ↺ Repeat 18 times throughout the day
```

**UX requirement:** Total interaction time per patient on the happy path **under 60 seconds**.

#### Journey 2 — Pre-Visit Preparation (the differentiator)

The doctor opens a patient profile. The pre-visit brief is the first thing seen.

```
┌──────────────────────────────────────────────────┐
│ John Smith — 47M — Last visit: 18 days ago       │
│                                                   │
│ ⚠ FOLLOW-UPS DUE                                  │
│ • Knee MRI — you said "let's do this if pain     │
│   persists past 3 weeks" (3 weeks ago)           │
│                                                   │
│ KEY CONTEXT                                       │
│ • Reported lower back pain in 3 of last 4 visits │
│ • Currently on Lisinopril 10mg (since Jan)       │
│ • Mentioned work stress as contributing factor    │
│                                                   │
│ LAST VISIT SUMMARY                                │
│ • [Tap to expand 3-line summary of last visit]   │
│                                                   │
│ [Start Session]    [View full history]            │
└──────────────────────────────────────────────────┘
```

**Performance:** This screen must load in **under 1 second**. Doctors decide whether to keep using the product based on this screen alone.

#### Journey 3 — Note Review and Signing (the trust moment)

```
┌──────────────────────────────────────────────────┐
│ ⚠ AI-GENERATED — PENDING YOUR REVIEW              │
│                                                   │
│ CHIEF CONCERN                                     │
│ Lower back pain, worsening over 2 weeks          │
│                                  [edit] [source] │
│                                                   │
│ OBSERVATIONS                                      │
│ Patient reports pain radiating to left thigh.    │
│ Range of motion limited on forward bend.         │
│                                  [edit] [source] │
│                                                   │
│ ASSESSMENT                                        │
│ Likely lumbar strain; rule out disc involvement  │
│                                  [edit] [source] │
│                                                   │
│ PLAN                                              │
│ • Physical therapy 2x/week, 4 weeks              │
│ • Ibuprofen 400mg as needed                      │
│ • Return if no improvement in 3 weeks            │
│                                  [edit] [source] │
│                                                   │
│ ─────────────────────────────────────────────    │
│       [Sign & Save Note]    [Discard]            │
└──────────────────────────────────────────────────┘
```

**Critical UX features:**
- The `[source]` button shows the exact moment in the audio where this claim came from (transparency = trust)
- Inline editing — no modal popups; click to edit in place
- Single dominant CTA: "Sign & Save"
- Signing requires biometric (FR-9.2) — Face ID or fingerprint, 1 second
- Visible disclaimer until signed (FR-9.1)

---

### 9.4 Visual Design System

#### Tone

**Clinical but warm.** Not sterile medical-device, not consumer-app-friendly.

Visual reference points:
- **Linear** — productivity feel, restraint, density
- **Notion** — content density, quiet UI
- **Apple Health** — medical credibility without aggression

Avoid the "every healthcare app uses blue" trap. Differentiate visually through palette and typography.

#### Color Palette

| Use | Color | Hex | Why |
|---|---|---|---|
| Primary brand | Deep teal | `#0E5E6F` | Medical-credible, calm, distinct from cliché blues |
| Critical actions | Coral | `#E6735C` | Warm urgency without alarming red |
| Success | Sage green | `#5A8A6B` | Confirmed actions, completed states |
| Warning | Amber | `#D4A04C` | Attention without alarm |
| Background | Warm white | `#FAF8F5` | Easier on eyes than pure white during long shifts |
| Surface (cards) | Pure white | `#FFFFFF` | Subtle contrast against background |
| Text primary | Deep charcoal | `#1A1A1A` | High contrast, accessible |
| Text secondary | Mid-grey | `#6B6B6B` | Hierarchy without harsh contrast |

Full dark mode required (evening clinic hours, eye fatigue).

#### Typography

- **Inter** — modern, clean, excellent at small sizes (mobile critical)
- Headings: 18-22pt
- Body: 14-16pt
- Captions: 12pt
- Generous line-height (1.5+) for readability
- Respects iOS/Android system font scaling

#### Iconography

- **Phosphor Icons** or **Lucide** (both have medical-relevant icons)
- Avoid Material Design (too generic) and SF Symbols (cross-platform inconsistency)

#### Motion & Animation

- Subtle micro-interactions only
- Standard durations: 150ms (instant feel), 250ms (transitions), 400ms (page changes)
- Respects system "reduce motion" preference (accessibility)
- No bouncy/playful animations — clinical context

---

### 9.5 Critical Screen Specifications

#### 9.5.1 Recording Screen — Highest UX Priority

Single dominant action. Live waveform proves recording works. Nothing distracting.

```
┌──────────────────────────────────────────────────┐
│ ◀ John Smith                                      │
│                                                   │
│         ┌─────────────────────┐                  │
│         │      Recording      │                   │
│         │      00:14:23       │                  │
│         │                     │                   │
│         │   ▁▂▄▆▇█▇▆▄▂▁       │                   │
│         │   (live waveform)   │                  │
│         └─────────────────────┘                  │
│                                                   │
│              [End Session]                        │
│                                                   │
│ ⓘ Patient consent acknowledged at 14:08          │
└──────────────────────────────────────────────────┘
```

**Anti-patterns explicitly forbidden during recording:**
- Multiple buttons (pause, settings, etc. — only End Session is allowed)
- Pop-ups, notifications, alerts of any kind
- Anything requiring reading
- Background sync indicators that imply problems

#### 9.5.2 Pre-Visit Brief Card — Differentiator

See Journey 2 design above. Implementation requirements:
- Loads in <1 second (cache aggressively)
- Maximum 5 bullet points across all sections
- Follow-ups due always shown first if any exist
- Tap-to-expand for full history (lazy loaded)

#### 9.5.3 Note Review Screen — Trust Moment

See Journey 3 design above. Implementation requirements:
- Inline editing (no modals)
- `[source]` link plays audio from the relevant moment
- Cannot be signed until doctor has scrolled through entire note
- Signing requires biometric — provides legal weight

#### 9.5.4 Search Screen — Demonstrates Semantic Power

```
┌──────────────────────────────────────────────────┐
│ Search across all patients                        │
│ ┌──────────────────────────────────────────────┐│
│ │ when did I last discuss back pain?           ││
│ └──────────────────────────────────────────────┘│
│                                                   │
│ John Smith — 18 days ago                          │
│ "Patient reports lower back pain..."              │
│ [Open]                                            │
│                                                   │
│ Sarah Chen — 2 months ago                         │
│ "Discussed exercise modifications..."             │
│ [Open]                                            │
└──────────────────────────────────────────────────┘
```

Showcases that "back pain" finds notes about "lumbar strain" or "patellar discomfort" via semantic search (pgvector). This is a wow moment for first-time users.

---

### 9.6 Empty States, Error States, Loading States

These are often forgotten and always matter.

| State | Approach |
|---|---|
| **Empty patient list** (new doctor) | Friendly illustration + "Add your first patient" CTA + 30-second video tutorial |
| **No sessions yet** for a patient | "Start your first session with John Smith" — large CTA |
| **Note generation failed** | Clear explanation of why; retry button; offer manual entry; no blame on doctor |
| **Recording failed (network)** | "Audio saved locally. Will upload when connection returns." — never lose data |
| **Loading note** | Skeleton screen showing structure; estimated time remaining |
| **No search results** | Suggest reformulation; show recent patients as fallback |
| **Account locked** | Clear next steps; no security-theater language |
| **Subscription lapsed** | Read-only access preserved (legal compliance); upgrade CTA prominent |

**Design rule:** Error states must never blame the doctor or expose technical jargon. They should tell the doctor what to do next, not what went wrong internally.

---

### 9.7 Performance UX Requirements

UX-specific performance targets (subset of Section 19.8 SLOs):

| Interaction | Target |
|---|---|
| App launch (cold) | <2s |
| App launch (warm) | <500ms |
| Patient profile open | <1s |
| Pre-visit brief render | <1s |
| Search results appear | <800ms |
| Recording start (after tap) | <500ms |
| Note generation status update | Real-time push, no polling |

These are perceived-performance targets — they bind UX, not just engineering.

---

### 9.8 Accessibility Requirements

Many physicians have visual fatigue, color blindness, or use accessibility tools. Section 1557 of the ACA requires accessibility in healthcare software.

| Requirement | Standard |
|---|---|
| Color contrast | WCAG 2.1 AA (4.5:1 text, 3:1 UI components) |
| Touch targets | Minimum 44×44pt (iOS) / 48×48dp (Android) |
| Font scaling | Respects iOS/Android system font size up to 200% |
| Screen reader | Every interactive element has accessibility label; semantic HTML on web |
| Voice control | Critical actions usable via Voice Control / Voice Access |
| Reduced motion | Respects system "reduce motion" preference |
| Keyboard navigation | All interactions reachable via keyboard (web) |
| Dark mode | Full dark mode for evening clinic hours, automatic with system setting |
| Color blindness | Never use color alone to convey information (always pair with icon or label) |
| Focus indicators | Visible focus indicators on all interactive elements |

Accessibility audit by third party before public launch (Month 6).

---

### 9.9 Design Tooling & Workflow

**Primary design tool: Claude Design** (replaces Figma in this project)

- All design files versioned in Claude Design workspace
- Design system + component library maintained in Claude Design
- Engineering pulls design tokens (colors, spacing, typography) directly from Claude Design exports
- Design reviews conducted asynchronously via Claude Design comments
- Prototyping for usability testing performed in Claude Design

**Component library:** **Tamagui** for React Native (cross-platform native look) + custom design system on top, exported from Claude Design as design tokens.

**Storybook** maintained for the React PWA + React Native app — every reusable component documented with states, variants, and accessibility notes.

**Workflow:**
```
1. Designer creates flow in Claude Design
2. Engineering reviews via Claude Design comments
3. Approved designs become source of truth
4. Component built in Storybook with full state coverage
5. Component used in app, design tokens kept in sync
```

---

### 9.10 Designer Hire — Critical Recommendation

**Hire a senior product designer with healthcare experience as one of your first three hires.** Not a generalist. Not a UI specialist. A product designer who has shipped clinical software before.

They will know:
- Why doctors hate certain interaction patterns (modal popups, multi-step forms during consults)
- What clinical workflows actually feel like
- The unwritten rules of clinical software (never interrupt a doctor mid-thought)
- How to test with doctors who don't have time for usability sessions

**Compensation:** Senior product designer in India ~$3,500-5,000/month, OR contractor with US healthcare experience for 6 months at $80-120/hour.

Add this role to the team plan in Section 2.4 (replace the UI/UX Designer role with this Senior Product Designer role).

---

### 9.11 Usability Testing Methodology

Doctors don't have time for traditional usability sessions. Adapt accordingly.

| Method | Frequency | Format |
|---|---|---|
| Async video walkthrough | Weekly with 2-3 pilot doctors | Doctor records 5-min screen-share narration in their own time |
| Live 15-min session | Bi-weekly with 1 pilot doctor | Specific task evaluation; never longer than 15 min |
| In-app feedback prompts | Continuous | Trigger after specific events (first note signed, search used, etc.); NPS-style + free text |
| Cohort analysis | Monthly | Funnel analytics: where do users drop off? |
| Error pattern review | Weekly | Sentry events analyzed for UX-vs-bug differentiation |

Pilot doctors compensated $50/session for live sessions; async walkthroughs unpaid (light burden).

---

### 9.12 UX Success Metrics

| Metric | Target | Measurement |
|---|---|---|
| Time from app open to recording start | <10 seconds | Application Insights instrumentation |
| Time from recording end to signed note | <5 minutes (median) | Database timestamp delta |
| Note edit rate | <30% (doctors edit fewer than 30% of generated notes) | Tracks AI quality + UX trust |
| Pre-visit brief view rate | >80% of sessions | Doctors actually use the differentiator |
| Search usage per active doctor | >5 searches/week | Adoption of semantic search |
| In-app NPS | >50 by Month 12 | Post-session prompts |
| Task completion rate (new doctor onboarding) | >85% | Funnel analytics |
| Accessibility audit score | WCAG 2.1 AA pass | Third-party audit Month 6, annually thereafter |

---

## 10. USER STORIES

### Epic 1: Onboarding

> **US-001:** As a doctor, I want to sign up and try the product in under 10 minutes, so I can evaluate it without a sales call.

> **US-002:** As a doctor, I want to understand what data is collected and how it's protected, so I feel confident using it with real patients.

> **US-003:** As a doctor, I want to complete a guided walkthrough of the product on first login, so I don't need to read a manual.

---

### Epic 2: Patient Management

> **US-004:** As a doctor, I want to create a patient profile in under 30 seconds, so it doesn't slow down my workflow before a busy clinic day.

> **US-005:** As a doctor, I want to find a patient by typing their name, so I can quickly start a session when they arrive.

---

### Epic 3: Recording a Visit

> **US-006:** As a doctor, I want to start recording with one tap after selecting a patient, so there's no friction at the start of the consultation.

> **US-007:** As a doctor, I want the recording to run silently in the background, so it doesn't interfere with my focus on the patient.

> **US-008:** As a doctor, I want to be clearly warned before a session ends, so I don't accidentally cut off an important part of the conversation.

---

### Epic 4: Reviewing Notes

> **US-009:** As a doctor, I want to receive a structured note after each visit, so I don't have to write it myself.

> **US-010:** As a doctor, I want to quickly edit any part of the note that's inaccurate, so I maintain full clinical responsibility for the content.

> **US-011:** As a doctor, I want to confirm a note is correct before it's saved permanently, so I never have an unreviewed AI-generated note in a patient's record.

---

### Epic 5: Pre-Visit Intelligence

> **US-012:** As a doctor, I want to see a brief summary of a patient's last visit before I walk into the room, so I don't have to spend time re-reading old notes.

> **US-013:** As a doctor, I want to see follow-up items I committed to in previous visits, so I don't let anything fall through the cracks.

> **US-014:** As a doctor, I want to see recurring symptoms across visits highlighted, so I can spot patterns I might otherwise miss.

---

### Epic 6: Search & History

> **US-015:** As a doctor, I want to search for when I last discussed a specific symptom with a patient, so I can reference it quickly during a consultation.

> **US-016:** As a doctor, I want to see a patient's full visit history in reverse chronological order, so I can review their journey over time.

---

## 11. COMPLIANCE & REGULATORY REQUIREMENTS

### 11.1 HIPAA (Health Insurance Portability and Accountability Act)

ClinRecall handles Protected Health Information (PHI) as defined by HIPAA. The following requirements are mandatory before any US physician can use the product:

| Requirement | Implementation |
|---|---|
| Business Associate Agreement (BAA) | Signed with every doctor at signup and with Microsoft (Azure + Azure OpenAI) |
| PHI Encryption at rest | AES-256 on all stored data |
| PHI Encryption in transit | TLS 1.2+ on all API calls |
| Minimum necessary access | Each doctor accesses only their own data |
| Audit controls | All PHI access logged with timestamp and user ID |
| Data disposal | Raw audio deleted within 1 hour; account data deleted 90 days post-cancellation |
| Breach notification | Process established to notify affected doctors within 60 days of discovery |

### 11.2 Informed Consent

While the product is doctor-facing, the underlying recordings involve patients. Requirements:

- Doctor must present and obtain verbal or written patient consent before recording
- Consent workflow guidance provided to doctor during onboarding
- Consent acknowledgement checkbox in session start flow
- Product does not manage patient consent directly — this remains the doctor's professional responsibility

### 11.3 Data Residency

- All PHI stored exclusively on Azure East US 2 (Virginia) and Azure West US 2 (Washington) for redundancy
- No PHI transferred to servers outside the United States
- Development team in India accesses only anonymized or synthetic test data

### 11.4 State-Level Regulations — Expanded

**Two-party consent is a product-enforced workflow in V1, not a disclaimer.**

Eleven US states require all parties to a conversation to consent to its recording. These states are:
**California, Florida, Illinois, Maryland, Massachusetts, Montana, New Hampshire, Pennsylvania, Washington, Connecticut, Michigan.**

Product-level requirements (see FR-8.1 through FR-8.8 in Section 7):
- System detects the doctor's state based on clinic address
- In two-party states, the recording button is disabled until patient consent is explicitly confirmed
- Consent acknowledgement is stored with the session record for audit purposes
- Doctors in any state receive a standard consent script to use with patients

This is not optional and is not a doctor's burden to manage manually.

### 11.5 FDA / Software as a Medical Device (SaMD) — NEW in v2.0

**Classification assessment is a prerequisite to engineering kickoff.**

Under 21 CFR 820 and FDA SaMD guidance, software that supports clinical decision-making may qualify as a medical device. The following ClinRecall features create classification risk:
- Pattern detection across patient visits ("symptom mentioned 3 of last 4 visits")
- Recurring symptom highlights in pre-visit brief
- Any implication of diagnostic inference

**V1 Position:** ClinRecall is a **documentation assistance tool**, not a clinical decision support system.

**Enforced through product constraints:**
- Intelligence Layer prompts explicitly prohibit generating diagnostic suggestions, medication recommendations, or clinical advice
- All extracted content is descriptive ("doctor noted X") not prescriptive ("doctor should do Y")
- Pre-visit brief surfaces facts from prior visits; it does not generate hypotheses
- Every output carries disclaimer until signed by doctor
- Mandatory doctor review before save — no auto-filing

**Action required before engineering kickoff:**
1. Engage an FDA regulatory consultant (budgeted in Year 1 one-time costs)
2. Obtain written classification assessment
3. If any feature is flagged SaMD-adjacent, scope out or add FDA pre-submission (Q-Sub) process

### 11.6 Malpractice Liability Framework — NEW in v2.0

ClinRecall processes protected clinical information and generates content that can affect patient care. Liability must be allocated explicitly.

**Liability Allocation:**

| Scenario | Primary Liability | Our Mitigation |
|---|---|---|
| AI generates inaccurate content, doctor reviews and corrects | None | Working as designed |
| AI generates inaccurate content, doctor signs without review | Doctor (ToS) | Mandatory review UX; disclaimer; signature audit trail |
| System outage causes doctor to miss recording | Shared | Uptime SLA; capture layer resilience; incident response |
| Data breach exposing PHI | Shared | HIPAA compliance; breach notification; cyber insurance |
| AI generates defamatory content about patient | Provider | Prompt engineering; content review; insurance |

**Required Protections:**
- Terms of Service explicitly require doctor review; doctor is the clinical author of record
- Visible disclaimer on every unsigned note
- Signed notes carry integrity hash and signature metadata
- Company carries $2M Professional Liability + $2M Cyber Liability insurance
- Annual review of ToS with healthcare-specialised legal counsel

### 11.7 Additional Regulatory Considerations — NEW in v2.0

- **Section 1557 of ACA** — non-discrimination in healthcare software; UI must be accessible (WCAG 2.1 AA) and not exclude protected classes
- **State-level health tech regulations** — California (CCPA/CPRA, CMIA), New York (SHIELD Act) may impose stricter requirements
- **International data transfer** — India team access to any PHI (even in aggregated form) requires careful contractual and technical controls; default is zero access

---

## 12. DATA REQUIREMENTS

### 12.1 Data Entities

| Entity | Key Fields | Retention |
|---|---|---|
| Doctor Account | ID, name, email, specialty, clinic, subscription status | Duration of account + 90 days |
| Patient Profile | ID, first name, last name, DOB, gender, MRN (optional) | Duration of doctor account |
| Session | ID, patient ID, doctor ID, date, duration, status | Duration of doctor account |
| Clinical Note | ID, session ID, sections (concern, observation, assessment, plan, follow-up), version, timestamp | Duration of doctor account |
| Pre-Visit Brief | Generated at query time from notes — not stored separately | Not persisted |
| Audit Log | User ID, action, resource, timestamp, IP address | 6 years (HIPAA requirement) |

### 12.2 Data the Product Does NOT Store

- Raw audio after note generation is complete
- Full transcripts of patient speech
- Any patient-identifiable data beyond what the doctor explicitly enters in the profile

### 12.3 Data Ownership

- All patient data belongs to the doctor
- ClinRecall does not sell, share, or use patient data for any purpose other than delivering the service
- AI model training does not use any customer data without explicit, separate consent

---

## 13. TECHNOLOGY STACK RECOMMENDATIONS

Keeping the technology boring and proven is a deliberate choice. The competitive advantage of ClinRecall is the product experience and the clinical memory layer — not a novel tech stack. Every component below is selected for reliability, HIPAA eligibility, and speed of development from an India-based team.

### 13.1 AI & Machine Learning Layer (v2.3 — Azure-based)

| Function | Recommended Vendor | Rationale |
|---|---|---|
| Speech-to-text + Speaker Diarization | **AssemblyAI** | Best-in-class medical diarization accuracy, dedicated healthcare tier, HIPAA BAA available, cloud-agnostic so works on Azure |
| Note extraction & Pre-visit brief generation | **GPT-4o via Azure OpenAI Service** | HIPAA-eligible via Microsoft BAA, strong medical conversation extraction, ~40% cheaper than alternatives, native Azure integration |
| Semantic embeddings for search | **text-embedding-3-large via Azure OpenAI** | HIPAA-eligible, cost-effective, integrates with pgvector |
| Fallback / cost optimisation at scale | Azure Speech Services or AssemblyAI volume tier | Re-evaluate after Month 12 once usage patterns are clear |

**Pre-Build Action Required:** Azure OpenAI Service access is **gated for healthcare/regulated industries**. Application must be submitted to Microsoft in Week 1 — typical approval is 1-2 weeks. Approval includes signed Microsoft BAA covering Azure OpenAI usage with PHI.

**Token Quota Increase Requests:**
At 500 doctors, default quotas are insufficient. File quota increase requests in Week 4:
- TPM (Tokens Per Minute): from default ~30K → 200K+
- RPM (Requests Per Minute): from default ~180 → 600+

Microsoft typically approves within 3-5 business days.

**Vendor Contract Requirements (Non-Negotiable):**

Before any real PHI is processed:
1. **Signed BAA** with AssemblyAI (direct) and Microsoft (covering Azure OpenAI Service)
2. **Written confirmation** that no inputs are used for model training, fine-tuning, retention beyond inference, or model improvement (Azure OpenAI default policy is no training use, but confirm in writing)
3. **Data residency confirmation** that all inference occurs in US Azure regions (East US 2 primary, West US 2 backup)
4. **Incident notification SLA** — vendor must notify of any security incident within 24 hours
5. **Right to audit** — contractual right to review vendor's security practices annually

**Abstraction Requirement (to prevent vendor lock-in):**

Layer 2 (Processing Engine) and Layer 3 (Intelligence Module) must abstract vendor-specific APIs behind an internal interface. A model swap (e.g., GPT-4o → GPT-5 or to Llama 3 on Azure ML) must be achievable within 4 weeks — never longer.

### 13.2 Application Stack — Revised v2.3 (Azure)

| Layer | Technology | Rationale |
|---|---|---|
| Web Frontend (V1) | **React + PWA (Progressive Web App) with Service Workers** | Fastest path to launch; installable from browser; works on iOS Safari and Android Chrome |
| **Native Mobile (V2 — Month 8+)** | **React Native + custom native audio modules (Swift + Kotlin)** | Single TypeScript codebase, ~95% Windows-friendly development, strong LLM training data for AI-assisted coding, native-grade audio reliability where it matters. See Section 13.6. |
| Backend | **Python with FastAPI** (preferred) | Strong ML ecosystem, mature async support; cloud-agnostic |
| Database | **Azure Database for PostgreSQL — Flexible Server with pgvector extension** | HIPAA-eligible; Multi-AZ HA; pgvector enables semantic + full-text hybrid search from Day 1 |
| Audio Storage (temporary) | **Azure Blob Storage with Immutability Policies** | HIPAA-eligible, 72-hour lifecycle rule, WORM-enforced for audit (immutable blob policy) |
| Authentication | **Auth0** (cloud-agnostic) | Built-in MFA, HIPAA-eligible, session management, faster than building in-house. Alternative: Azure AD B2C if going Microsoft-native in Phase 2 |
| Payments & Billing | **Stripe** | Only credible option; supports Indian companies billing US customers in USD |
| Search | **Hybrid: pgvector (semantic) + PostgreSQL full-text (keyword)** | Semantic search from Day 1 — a doctor typing "knee pain" finds notes about "patellar discomfort" |
| Email / Notifications | **Azure Communication Services** (or SendGrid, Microsoft-owned) | HIPAA-eligible, integrated with Azure Monitor |
| Event Bus | **Azure Event Grid** | Serverless, HIPAA-eligible; foundation for Layer 6 integrations from Day 1 |
| Background Jobs | **Azure Service Bus + Azure Functions** | For audio upload processing, note generation pipeline, async operations |

### 13.3 Infrastructure — Revised v2.3 (Azure)

| Component | Choice | Rationale |
|---|---|---|
| Cloud Provider | **Azure (East US 2 primary, West US 2 warm-standby DR)** | HIPAA BAA available; team has strong Azure familiarity; integrated Microsoft healthcare ecosystem; better hospital procurement fit for Phase 2 |
| Containerisation | **Azure Container Apps** | Serverless container orchestration on Kubernetes; minimal ops overhead; native Azure integration |
| CI/CD | **GitHub Actions** | Cloud-agnostic; integrates with all Azure services; every deploy requires passing security scan and tests |
| Monitoring | **Azure Monitor + Application Insights + Sentry** | App Insights for distributed tracing and APM; Sentry for application error tracking; native Azure integration |
| Observability | **OpenTelemetry tracing via Application Insights** | Native OTLP support in App Insights; PHI data scrubbed from traces |
| Secret management | **Azure Key Vault** | Never store credentials in code or environment files; integrates with Container Apps managed identity |
| Infrastructure as Code | **Terraform** (Azure provider) | All Azure resources defined as code; enables reproducible environments and audit trails |
| Network Security | **Azure VNet with private endpoints, NSGs, Azure WAF on Front Door** | Defense in depth; no direct internet exposure of PHI-handling services |
| CDN / Edge | **Azure Front Door** | WAF + CDN + global routing for the React PWA frontend |
| DDoS Protection | **Azure DDoS Protection Standard** | Required for HIPAA defence-in-depth posture |
| Backup & Geo-Redundancy | **Azure Backup + GRS (Geo-Redundant Storage) for Blob and PostgreSQL** | Continuous backups; cross-region replication for disaster recovery |

### 13.4 Development Environment (India Team)

- All developers work with **synthetic / anonymised patient data only** — never real PHI
- Production access is restricted to authorised personnel via Azure RBAC + Azure AD with MFA; all production access is logged and reviewed monthly
- All code reviewed before merge; no direct pushes to main branch; security linters enforced in CI
- Penetration testing by a third-party firm before public launch and annually
- Synthetic medical conversation dataset (500+ labelled samples) maintained for development and testing — built in collaboration with US medical advisor

### 13.5 MLOps & AI Quality Framework — NEW in v2.0

AI quality is not a one-time decision — it is a continuous discipline. Without MLOps practices from Day 1, note quality will silently drift as the Intelligence Layer evolves or the underlying LLM is upgraded.

#### Golden Evaluation Dataset
- **Target:** 200-500 labelled real (anonymised) clinical conversations by Month 6, growing to 2,000+ by Month 18
- **Labels:** Gold-standard extractions created by clinical content reviewer
- **Coverage:** Multiple specialties, edge cases (poor audio, multiple speakers, accents)
- **Source:** Pilot doctors who consent to anonymised conversation donation

#### Automated Evaluation Pipeline
- Every Intelligence Layer template change runs against the golden dataset before deployment
- Key metrics: extraction accuracy (precision/recall per field), hallucination rate, structural compliance
- Regression threshold: no more than 2% degradation on any metric; block merge if exceeded
- Weekly automated evaluation reports to engineering and PM

#### Continuous Quality Monitoring
- Doctor-reported inaccuracy flags (FR-5.6) route into a correction feedback system
- Random sample of 1% of production notes reviewed weekly by clinical content reviewer
- Quality dashboard tracks: accuracy by specialty, hallucination incidents, doctor-reported errors

#### Model Version Management
- Every note is tagged with the LLM model version and prompt template version that generated it
- When a new model version is introduced (e.g., GPT-4o → GPT-5), migration runs on the golden dataset first
- No auto-upgrade in production until regression testing confirms no quality loss
- Rollback capability to prior model version within 1 hour if issue detected

#### Prompt Template Governance
- All Intelligence Layer prompts stored in version-controlled configuration (not code)
- Every prompt change requires PM approval + QA evaluation pipeline pass
- Deployed with feature flag — can be reverted per doctor cohort without redeployment
- Monthly prompt review meeting: top 10 flagged notes + pattern analysis

---

### 13.6 Native Mobile Framework — React Native (NEW in v2.1)

#### Why React Native (resolves OQ-13)

After evaluating native Swift/Kotlin, Kotlin Multiplatform, Flutter, and React Native against the constraints of (a) Windows-based India team, (b) avoiding double development, (c) AI-assisted coding via Claude/Codex, and (d) audio recording reliability — **React Native with custom native audio modules** is the chosen path.

| Constraint | Why React Native Wins |
|---|---|
| Windows team development | ~95% of work happens on Windows; only iOS builds need macOS |
| Avoid building twice | One TypeScript codebase serves both iOS and Android |
| Claude/Codex AI coding | Largest LLM training data among cross-platform frameworks; minimal hallucination risk |
| Audio recording reliability | Solved via thin native modules (~500-800 LOC total) for the recording engine only |
| Healthcare-grade UX | Proven in production by Heidi Health, Doximity, and similar healthcare apps |
| Hiring market in India | Abundant React Native talent; TypeScript universally known |

#### Architecture: 95% Shared, 5% Native

```
┌──────────────────────────────────────────────────┐
│       React Native Application (~95%)            │
│  TypeScript: All UI, navigation, state, API,     │
│  authentication, file handling, note review,     │
│  search, billing, notifications                  │
└──────────────────────────────────────────────────┘
                       │
               React Native Bridge
                       │
            ┌──────────┴──────────┐
            ▼                     ▼
    ┌───────────────┐     ┌───────────────┐
    │ iOS Native    │     │ Android Native│
    │ Audio Module  │     │ Audio Module  │
    │ (Swift, ~500 LOC)│  │ (Kotlin, ~500 LOC)│
    │ AVAudioSession│     │ MediaRecorder +│
    │ Background mode│    │ Foreground svc │
    └───────────────┘     └───────────────┘
```

**Total native code in the entire app: 1,000-1,500 lines.** Everything else is React Native.

#### Required React Native Modules — Off-The-Shelf

| Capability | Module | Purpose | Custom Work |
|---|---|---|---|
| **Audio recording (base)** | `react-native-audio-recorder-player` or `react-native-audio-record` | Foundation library; foreground recording | Used as base, extended via custom native module for background reliability |
| **Authentication** | `react-native-auth0` | Auth0 SDK with MFA support | None |
| **Secure storage** | `react-native-keychain` | iOS Keychain / Android Keystore for tokens | None |
| **Encrypted local storage** | `react-native-mmkv` | Fast key-value storage with encryption | None |
| **Biometric auth** | `react-native-biometrics` | Face ID / Touch ID / fingerprint for note signing | None |
| **File upload** | `react-native-blob-util` | HTTP file streaming, chunked upload base | Wrap with resumable upload logic (~200 LOC TS) |
| **Background upload** | `react-native-background-upload` | Continues uploads when app is backgrounded | None |
| **Push notifications** | `@react-native-firebase/messaging` | FCM (Android) + APNs (iOS) push | None |
| **Local notifications** | `notifee` | "Note ready for review" notifications | None |
| **Permissions** | `react-native-permissions` | Microphone, notifications — handles iOS/Android quirks | None |
| **Network detection** | `@react-native-community/netinfo` | Online/offline status, connection quality | None |
| **Navigation** | `@react-navigation/native` | Standard navigation (de facto choice) | None |
| **UI components** | `react-native-paper` (Material) or `tamagui` | UI component library | None |
| **State management** | `zustand` | Lightweight state management | None |
| **HTTP client** | `axios` | API calls to FastAPI backend | None |
| **Forms** | `react-hook-form` | Form handling and validation | None |
| **Icons** | `react-native-svg` + `react-native-vector-icons` | Iconography | None |
| **Date/time** | `date-fns` | Date manipulation (lighter than moment.js) | None |
| **Splash screen** | `react-native-bootsplash` | Branded launch screen | None |

#### Custom Native Module — Audio Recording Engine

The one place we write native code. Two thin modules, one purpose.

**iOS Audio Module (Swift, ~500 LOC):**
- AVAudioSession configuration for ambient capture
- Background audio mode (Info.plist + session category management)
- AVAudioRecorder lifecycle with proper interruption handling (calls, notifications)
- Audio format optimised for AssemblyAI diarization (16kHz, 16-bit PCM, mono)
- Local encrypted buffering for offline scenarios
- Bridge to React Native via Swift `@objc` exposure

**Android Audio Module (Kotlin, ~500 LOC):**
- MediaRecorder configuration
- Foreground service to survive battery optimization (Android 12+ requirements)
- Doze mode and App Standby exemption requests
- Audio format matching iOS (16kHz, 16-bit PCM, mono)
- Local encrypted buffering
- Bridge to React Native via `ReactContextBaseJavaModule`

**Estimated effort:** 2-3 weeks for an experienced native engineer with Claude/Codex assistance.

#### Module Risk Assessment

| Module | Maintenance Risk | Mitigation |
|---|---|---|
| `react-native-audio-recorder-player` | Sole maintainer | Forking ready; we have native modules covering critical paths anyway |
| `react-native-auth0` | Auth0 (corporate) | Low risk; backed by Okta |
| `react-native-firebase` | Active OSS community | Very low risk |
| Other listed modules | Multiple maintainers, mature | Low risk |

**Concentration Rule:** No more than 30% of the app should depend on a single non-corporate-maintained module. Our list complies.

---

### 13.7 Development Environment — Windows-Friendly Workflow (NEW in v2.1)

The India team works primarily on Windows machines. The development workflow is designed to maximise Windows compatibility.

#### What Runs on Windows (95% of development)

- All TypeScript / React Native development
- Backend (Python / FastAPI)
- Android builds and emulator (Android Studio runs natively on Windows)
- Database, infrastructure, CI/CD configuration
- AI-assisted coding with Claude / Codex
- Code review, version control, documentation

#### What Requires macOS (5% of development)

- iOS builds (Xcode is macOS-only — Apple licensing constraint)
- iOS Simulator
- App Store submission and TestFlight uploads
- Native iOS module debugging in Xcode

#### macOS Access Strategy

| Option | Cost | Best For |
|---|---|---|
| **Cloud Mac (MacInCloud or MacStadium)** | $30-80/month per dev | Recommended — flexible, no hardware |
| **Office Mac Mini M2 (1-2 units)** | ~$700 each one-time | Recommended for core team — shared via screen sharing |
| **GitHub Actions macOS runners** | $0.08/min | Recommended for CI/CD iOS builds — no manual Mac access needed |
| **Designated iOS engineer with MacBook** | ~$1,500 one-time | If hiring a full-time iOS specialist |

**Recommended setup for our team:**
1. **CI/CD does production iOS builds via GitHub Actions macOS runners** — no developer needs Mac for releases
2. **One office Mac Mini for active iOS native module debugging** — shared by 2-3 engineers as needed
3. **Cloud Mac subscription as backup** — for occasional remote iOS work

**Estimated additional infrastructure cost: ~$50-150/month** — trivial in context of project budget.

#### Development Workflow Per Engineer

```
Windows Machine                          Cloud / Office Mac (when needed)
├── VS Code / IntelliJ                   ├── Xcode (iOS builds)
├── React Native Metro bundler           ├── iOS Simulator
├── Android Studio + Emulator            └── App Store Connect
├── Python FastAPI dev server
├── Docker containers
├── PostgreSQL (local)
├── Claude / Codex
└── Git, GitHub
```

For 95% of work, the engineer never connects to a Mac. iOS-specific tasks (native audio module changes, App Store submission) are batched and handled in dedicated Mac sessions.

#### CI/CD Pipeline (Mac-Free for Daily Development)

```
Developer pushes to feature branch (on Windows)
    ↓
GitHub Actions runs tests on Linux + Android builds
    ↓
On merge to main:
    ↓
GitHub Actions Linux runner: Backend tests, Android APK build
GitHub Actions macOS runner: iOS build, sign, upload to TestFlight
    ↓
Both APK and iOS build available for QA
```

Engineers never touch a Mac for normal feature work — only when debugging iOS-specific native code.

---

### 13.8 Backend API Design (NEW in v2.2)

#### 12.8.1 API Design Principles

| Principle | Decision | Rationale |
|---|---|---|
| Architectural style | **REST** (not GraphQL) | Better HIPAA audit trail; simpler caching; dramatically stronger Claude/Codex support; well-defined resources fit our domain |
| Versioning | **URL prefix `/v1/` from Day 1** | Future-proof; never have to break clients; standard practice |
| Authentication | **JWT access tokens (Auth0-issued)** | 15-minute access tokens + refresh tokens; no session state in backend |
| Async pattern | **`202 Accepted` + job ID + push/poll** | Long-running AI work doesn't block clients; resilient to network drops |
| File uploads | **Azure Blob Storage SAS URLs** | Audio bytes never traverse the API server; saves bandwidth and reduces failure surface |
| API documentation | **OpenAPI 3.1 (auto-generated by FastAPI)** | Single source of truth; auto-generates React Native TypeScript client |
| Error format | **RFC 7807 Problem Details** | Standardised, machine-parseable, well-supported across clients |
| Idempotency | **`Idempotency-Key` header on writes** | Mobile network retries won't duplicate sessions, notes, or charges |

#### 12.8.2 API Surface — by Module

**Module 1: Authentication & Account**

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/v1/auth/signup` | Create doctor account; returns email verification flow |
| POST | `/v1/auth/login` | Email + password → JWT (Auth0 brokered) |
| POST | `/v1/auth/mfa/challenge` | Trigger MFA |
| POST | `/v1/auth/mfa/verify` | Verify MFA code |
| POST | `/v1/auth/refresh` | Refresh expired access token |
| POST | `/v1/auth/logout` | Revoke refresh token |
| POST | `/v1/auth/forgot-password` | Initiate reset |
| POST | `/v1/auth/reset-password` | Complete reset |
| GET | `/v1/me` | Get current doctor profile |
| PATCH | `/v1/me` | Update doctor profile (name, specialty, clinic) |
| POST | `/v1/me/baa/accept` | Accept Business Associate Agreement |

**Module 2: Patient Profiles**

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/v1/patients?q=&page=&limit=` | List/search patients |
| POST | `/v1/patients` | Create patient profile |
| GET | `/v1/patients/{patient_id}` | Get patient details |
| PATCH | `/v1/patients/{patient_id}` | Update patient |
| DELETE | `/v1/patients/{patient_id}` | Soft archive (data retained) |
| GET | `/v1/patients/{patient_id}/sessions` | List sessions for patient |
| GET | `/v1/patients/{patient_id}/pre-visit-brief` | Get the synthesised pre-visit brief |

**Module 3: Recording Sessions** (most complex module — AI pipeline orchestration)

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/v1/sessions` | Start new session — returns `session_id` and Azure Blob SAS URLs for audio chunks |
| POST | `/v1/sessions/{session_id}/consent` | Record patient consent acknowledgement (state-aware) |
| POST | `/v1/sessions/{session_id}/chunks` | Register an uploaded audio chunk (metadata only) |
| POST | `/v1/sessions/{session_id}/complete` | Mark recording complete → triggers async processing pipeline |
| GET | `/v1/sessions/{session_id}` | Get session status (recording, processing, ready, signed) |
| GET | `/v1/sessions/{session_id}/note` | Get the AI-generated note (when status=ready) |
| PATCH | `/v1/sessions/{session_id}/note` | Doctor edits note before signing |
| POST | `/v1/sessions/{session_id}/note/regenerate` | Discard and re-generate note (max 2 attempts) |
| POST | `/v1/sessions/{session_id}/note/sign` | Doctor signs note (immutable thereafter) |
| POST | `/v1/sessions/{session_id}/note/flag` | Flag inaccuracy for clinical review |
| POST | `/v1/sessions/{session_id}/note/amend` | Add amendment to a signed note |
| GET | `/v1/sessions/{session_id}/note/export` | Export signed note as PDF (with integrity hash) |

**Module 4: Search**

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/v1/search?q=` | Hybrid search across all patients (semantic + keyword via pgvector) |
| GET | `/v1/patients/{patient_id}/search?q=` | Search within a patient's history |

**Module 5: Compliance & State Rules**

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/v1/compliance/state-rules?state=CA` | Returns consent rules for a US state (one-party vs two-party) |
| GET | `/v1/compliance/consent-script?state=CA&language=en` | Standard consent script for doctor to read to patient |

**Module 6: Patient Rights (HIPAA)**

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/v1/patients/{patient_id}/data-access-request` | Generate full data export (PDF) for patient |
| POST | `/v1/patients/{patient_id}/data-deletion-request` | Action a deletion request |
| POST | `/v1/patients/{patient_id}/correction-request` | Add correction amendment |
| GET | `/v1/patients/{patient_id}/disclosure-accounting` | List who accessed this patient's data |

**Module 7: Subscription & Billing**

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/v1/subscription/start-trial` | Start 60-day free trial |
| POST | `/v1/subscription/subscribe` | Begin paid subscription |
| GET | `/v1/subscription/me` | Current subscription status |
| POST | `/v1/subscription/cancel` | Cancel subscription |
| GET | `/v1/subscription/invoices` | List invoices |
| GET | `/v1/subscription/invoices/{invoice_id}` | Get invoice PDF |

**Module 8: Webhooks (Inbound)**

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/v1/webhooks/stripe` | Stripe billing events |
| POST | `/v1/webhooks/assemblyai` | Transcription complete callback |
| POST | `/v1/webhooks/auth0` | Account events (optional) |

**Module 9: Operations & Admin**

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/v1/healthz` | Liveness probe (returns 200 if alive) |
| GET | `/v1/readyz` | Readiness probe (checks DB, Blob Storage, Azure OpenAI connectivity) |
| GET | `/v1/version` | Build/deploy version (for support troubleshooting) |
| POST | `/v1/admin/templates` | Manage Intelligence Layer templates (admin scope only) |
| GET | `/v1/admin/templates/{id}/evaluate` | Run template against golden dataset |
| GET | `/v1/admin/audit-log` | Query audit logs (admin scope only, immutable WORM read) |

**Total V1 endpoint count: ~40 endpoints across 9 modules.**

#### 12.8.3 Critical Design Pattern — Audio Upload Flow

Audio bytes never go through the API server. This is essential for performance and reliability.

```
1. Mobile app → POST /v1/sessions
   Response: {
     session_id: "abc123",
     upload_urls: [sas_url_1, sas_url_2, ...]   // Azure Blob SAS URLs
   }

2. Mobile app → PUT directly to Azure Blob Storage (each audio chunk, ~1MB each)
   Bytes stream from device to Blob Storage — API server has zero involvement

3. Mobile app → POST /v1/sessions/abc123/chunks
   Sends metadata only: { chunk_id, sequence_number, sha256, size_bytes }

4. Mobile app → POST /v1/sessions/abc123/complete
   API validates all chunks present + checksums match → enqueues processing
```

**Why this matters:** A 30-minute recording is ~50MB. Streaming through the API server would consume bandwidth, memory, and create a single point of failure. Azure Blob Storage handles this natively via Block Blob upload, plus enables resumable uploads on flaky clinic WiFi.

#### 12.8.4 Critical Design Pattern — Async AI Processing

```
1. POST /v1/sessions/{id}/complete returns 202 Accepted
   { status: "processing", estimated_seconds: 90, poll_url: "/v1/sessions/abc123" }

2. Backend enqueues job → Azure Service Bus → Azure Function processes:
   a. Stitch audio chunks from Blob Storage into single file
   b. Submit to AssemblyAI for transcription + diarization
   c. AssemblyAI webhook → POST /v1/webhooks/assemblyai
   d. Function submits transcript to GPT-4o (Azure OpenAI) for note extraction
   e. Result written to PostgreSQL (extracted_output table)
   f. Event Grid event: NoteReadyForReview
   g. Push notification sent to doctor's device

3. Mobile app polls GET /v1/sessions/{id} OR receives push
   When status="ready", fetches /v1/sessions/{id}/note for review
```

This pattern keeps the API responsive even when AI processing takes 60-180 seconds.

#### 12.8.5 Authentication & Authorization Model

```
┌──────────────┐                            ┌──────────────┐
│ Mobile/Web   │   1. Login (email/pwd)     │   Auth0      │
│   Client     │──────────────────────────▶ │  (Identity)  │
└──────────────┘                            └──────────────┘
       │                                           │
       │   2. Receive: access_token (15min),       │
       │      refresh_token (30 days)              │
       │◀──────────────────────────────────────────┘
       │
       │   3. API call with Bearer access_token
       ▼
┌──────────────────────────────────────────────────────────┐
│              FastAPI Backend                              │
│  - Verifies JWT signature (Auth0 public keys, cached)    │
│  - Extracts: doctor_id, scopes                            │
│  - Enforces row-level security (doctor sees only own data)│
│  - Logs every PHI access to WORM audit log                │
└──────────────────────────────────────────────────────────┘
```

**Authorization rules:**
- Every query scoped by `doctor_id` from JWT (enforced at PostgreSQL row-level security layer)
- Admin endpoints require additional `admin` scope (separate Auth0 role)
- All PHI access logged to immutable audit log (Azure Blob Storage Immutability Policy, 6-year retention)

#### 12.8.6 Error Format — RFC 7807 Problem Details

```json
{
  "type": "https://api.clinrecall.com/errors/consent-required",
  "title": "Patient consent not recorded",
  "status": 422,
  "detail": "Recording cannot start in California without explicit patient consent acknowledgement",
  "instance": "/v1/sessions/abc123/start"
}
```

Standard, machine-parseable, easy for clients to handle uniformly.

#### 12.8.7 Pagination Standard

```json
GET /v1/patients?page=2&limit=50

{
  "data": [...],
  "meta": {
    "page": 2,
    "limit": 50,
    "total": 327,
    "has_next": true
  }
}
```

#### 12.8.8 Rate Limiting

| Endpoint Class | Limit |
|---|---|
| Auth endpoints | 10 requests / minute / IP |
| Read endpoints | 100 requests / minute / doctor |
| Write endpoints | 30 requests / minute / doctor |
| AI-triggering endpoints (`/complete`, `/regenerate`) | 10 requests / hour / doctor |
| Search endpoints | 60 requests / minute / doctor |

Rate limits enforced via Redis-backed sliding window counter.

#### 12.8.9 API Documentation Strategy

- **FastAPI auto-generates OpenAPI 3.1 spec** at runtime
- `/docs` serves Swagger UI for interactive testing
- `/redoc` serves ReDoc for cleaner reading
- OpenAPI spec versioned in Git
- **TypeScript client auto-generated** for the React Native app via `openapi-typescript-codegen`
- Postman collection generated from spec for QA and partner debugging

**Critical benefit:** The mobile app's API client is auto-generated. Adding a new backend endpoint automatically gives the mobile team a typed client method — no hand-coding, no drift between backend and clients.

#### 12.8.10 Backend Technology Choices

| Concern | Choice | Rationale |
|---|---|---|
| Web framework | **FastAPI** (Python 3.12+) | Auto OpenAPI, async, Pydantic validation, strong LLM training data |
| ORM | **SQLAlchemy 2.0** with async support | Mature, type-safe, async-native |
| Migrations | **Alembic** | Standard for SQLAlchemy |
| Validation | **Pydantic v2** | Built into FastAPI, fastest Python validation library |
| Background jobs | **Azure Service Bus + Azure Functions** (V1) | Serverless, no Celery ops burden initially |
| Cache | **Azure Cache for Redis** | Standard; rate limiting, session cache |
| API tests | **pytest + pytest-asyncio + httpx** | Standard FastAPI testing stack |
| Type checking | **mypy** strict mode + **ruff** for linting | Catch errors at CI time |
| Local dev | **Docker Compose** with Postgres, Redis, Azurite (Azure Blob/Queue emulator) | Reproducible local environment |

#### 12.8.11 Estimated Codebase Size

For V1 with the endpoints above:

| Component | Estimated LOC |
|---|---|
| API route handlers (~40 endpoints) | 3,000-5,000 |
| Pydantic schemas (request/response) | 2,000 |
| Business logic / service layer | 3,000 |
| Database models + migrations | 2,000 |
| Tests (target 80% coverage) | 4,000 |
| **Total backend codebase** | **~14,000-16,000 lines** |

Well within Claude/Codex productive zone. FastAPI patterns are extremely well-represented in LLM training data.

---

## 14. PLATFORM ARCHITECTURE & EXTENSIBILITY

### 14.1 Platform Philosophy

ClinRecall V1 is a product. But the architecture underneath it must be a platform.

Every use case we will ever build — clinical notes, surgical consent documentation, sales coaching, interview transcription — shares the same underlying pipeline:

```
Record Audio → Separate Speakers → Understand Context → Extract Intelligence → Store Securely → Present Output
```

What changes between use cases is not the pipeline. What changes is who is in the room, what to extract, and how to present it. If those variable parts are designed as pluggable modules from Day 1, adding a new use case means configuring a module — not rebuilding the system.

This section defines the six-layer platform architecture, the rules for keeping layers decoupled, and the V1 decisions that must be made correctly now to prevent expensive rework later.

---

### 14.2 The Six Platform Layers

```
┌─────────────────────────────────────────────────────┐
│              LAYER 6 — INTEGRATION                  │
│         EHR / Legal Records / CRM / CMS             │
├─────────────────────────────────────────────────────┤
│              LAYER 5 — OUTPUT MODULE                │
│     Use-case specific rendering & document format   │
├─────────────────────────────────────────────────────┤
│           LAYER 4 — STORAGE LAYER                   │
│      Uniform HIPAA-compliant structured storage     │
├─────────────────────────────────────────────────────┤
│          LAYER 3 — INTELLIGENCE MODULE              │
│     Pluggable AI extraction templates per use case  │
├─────────────────────────────────────────────────────┤
│          LAYER 2 — PROCESSING ENGINE                │
│    Diarization + Transcription (shared, never changes)│
├─────────────────────────────────────────────────────┤
│            LAYER 1 — CAPTURE LAYER                  │
│    Mobile browser / Room device / Web / Phone call  │
└─────────────────────────────────────────────────────┘
```

---

#### Layer 1 — Capture Layer
*How audio enters the system*

This layer is responsible for receiving audio from any source and delivering it to the Processing Engine in a standard format. The rest of the platform never needs to know or care how audio was captured.

| Capture Adapter | Use Case | V1 / Future |
|---|---|---|
| Mobile browser microphone | Doctor in clinic, patient on phone | V1 |
| Room-mounted tablet / device | Hospital consultation room, consent recording | V2 |
| Web browser desktop | Journalist, researcher, remote interview | V3 |
| Phone call integration (PSTN) | Sales coaching, customer support | Future |

**Design rule:** Every capture adapter outputs the same audio format and metadata envelope to Layer 2. No adapter-specific logic leaks into Layer 2 or beyond.

---

#### Layer 2 — Processing Engine
*The shared core — identical across all use cases*

This is the platform's competitive moat. It receives raw audio and returns a speaker-separated, time-stamped transcript. Every product on the platform benefits every time this engine improves.

Responsibilities:
- Speaker diarization — who said what, when
- Speech-to-text transcription with timestamps
- Language detection per speaker (for multilingual sessions)
- Audio quality validation and error handling

**Design rule:** This layer has zero knowledge of use cases. It does not know if it is processing a clinical visit or a legal consent session. It only produces a labelled transcript. All use case intelligence lives in Layer 3.

---

#### Layer 3 — Intelligence Module
*What to extract — fully pluggable per use case*

This layer receives the labelled transcript from Layer 2 and applies an AI extraction template to produce structured output. Each use case defines its own template. Adding a new use case means adding a new template — no platform code changes.

A template defines:
- Which speaker roles to focus on (e.g. focus on Doctor speech only, or all speakers equally)
- What information to extract (e.g. diagnosis, follow-ups, or risks explained, patient questions)
- What output schema to populate (e.g. SOAP note fields, or consent summary fields)
- What patterns to detect across sessions (e.g. recurring symptoms, or unresolved follow-ups)

| Use Case | Focus | Extract | Output Schema |
|---|---|---|---|
| ClinRecall — Clinical Notes | Doctor speech | Observations, diagnosis, plan, follow-ups | SOAP note |
| ClinRecall — Pre-visit Brief | All sessions for patient | Recurring symptoms, open follow-ups, last medications | 5-line summary |
| ConsentDoc — Surgical Consent | Doctor speech + patient questions | Risks explained, alternatives, patient verbal acknowledgement | Legal consent summary |
| Future — Sales Coaching | Sales rep speech | Objection handling, commitments made, next steps | Call scorecard |
| Future — Interview Transcription | All speakers | Quotes, topics, attributions | Annotated transcript |

**Design rule:** Templates are configuration, not code. They are stored as versioned records in the database or a config file — not hardcoded into the application. A new template can be deployed without a code release.

---

#### Layer 4 — Storage Layer
*Uniform, secure, structured storage shared across all use cases*

All use cases write to the same storage infrastructure using a common session data model. The `use_case_type` field on every session record tells the system which intelligence template was applied and which output schema to expect.

**Core data model (shared across all use cases):**

| Entity | Fields | Notes |
|---|---|---|
| Session | id, use_case_type, account_id, subject_id, started_at, ended_at, duration, status | subject_id is patient in clinical use case, matter_id in legal use case |
| Participant | id, session_id, role_label, speaker_index | Role labels are use-case specific (Doctor/Patient vs. Surgeon/Relative) |
| Transcript | id, session_id, speaker_index, text, start_time, end_time | Raw output from Layer 2 |
| Extracted Output | id, session_id, use_case_type, schema_version, data (JSON) | Flexible JSON — schema validated per use_case_type |
| Rendered Document | id, session_id, template_version, content | Final human-readable output from Layer 5 |
| Audit Log | id, account_id, action, resource_type, resource_id, timestamp, ip | 6-year retention per HIPAA |

**Design rule:** The core schema never changes for new use cases. New use cases only add entries to the `use_case_type` enum and define their JSON schema for the `Extracted Output.data` field. No new tables, no schema migrations.

**Schema Versioning Strategy (NEW in v2.0):**

Every extracted output record has a `schema_version` field. When a use case's schema evolves (e.g. ClinRecall SOAP v1 → v2 adds a new field for "patient stated symptoms duration"):

- New records are written with the new schema version
- Old records remain in their original schema version
- A **migration adapter** (code, not data) converts v1 records to v2 on read when needed
- Migration adapters are never destructive — original data is always recoverable
- Multiple schema versions coexist indefinitely; there is never a "big migration" event

This discipline ensures that 3 years of patient notes in an old schema do not block schema evolution or force risky migrations.

---

#### Layer 5 — Output Module
*How results are presented — pluggable per use case*

This layer receives structured JSON from Layer 3 and renders it into the right format for that use case's user. Each use case defines its own output template.

| Use Case | Output Format | Interaction Model |
|---|---|---|
| ClinRecall — Clinical Notes | Editable SOAP note | Doctor reviews, edits, confirms before saving |
| ClinRecall — Pre-visit Brief | 5-line summary card | Read-only; shown on patient profile open |
| ConsentDoc — Consent Record | Legal summary + full transcript | Doctor signs off; PDF generated for legal file |
| Future — Sales Coaching | Call scorecard with clips | Manager reviews rep performance |
| Future — Interview | Annotated transcript with quotes | Journalist edits and exports |

**Design rule:** Output templates are rendering logic only — they receive data, they do not compute it. All intelligence lives in Layer 3. A new output template can be built and deployed by a frontend engineer with no backend changes.

---

#### Layer 6 — Integration Layer
*How data flows out — optional, pluggable connectors*

Every integration is a separate, independently deployable connector. The platform exposes a standard internal event stream; connectors subscribe to relevant events and push data to external systems.

| Connector | Use Case | Trigger Event | Destination |
|---|---|---|---|
| EHR Push (Epic, Cerner) | ClinRecall | Note confirmed by doctor | Patient record in EHR |
| Legal Records Export | ConsentDoc | Consent record signed | Hospital legal records system |
| PDF Export | All use cases | Document finalised | Download / email |
| Salesforce Push | Sales Coaching (future) | Call scored | Salesforce activity record |

**Design rule:** V1 ships with no active integrations. The integration layer exists as empty infrastructure — event stream in place, no connectors deployed. Connectors are added use-case by use-case on customer demand. Never build a connector speculatively.

---

### 14.3 How Use Cases Plug In

Adding a new use case to the platform requires exactly four things — no core platform changes:

| Step | What Gets Built | Who Builds It | Estimated Effort |
|---|---|---|---|
| 1 | New capture adapter (if capture method is new) | Backend engineer | 1-3 weeks |
| 2 | New intelligence template (extraction prompts + output schema) | AI engineer + PM | 1-2 weeks |
| 3 | New output template (UI rendering for the use case) | Frontend engineer | 1-2 weeks |
| 4 | New integration connector (if external system needed) | Backend engineer | 2-4 weeks |

**Total to add a new use case on a mature platform: 4-8 weeks.**
Without this architecture, adding a new use case would require 4-6 months of platform rework.

---

### 14.4 Use Case Expansion Roadmap

```
Phase 1 — V1 (Months 1-7)
└── ClinRecall: Clinical Notes + Pre-visit Brief
    └── Capture: Mobile browser
    └── Speakers: 2 (Doctor, Patient)
    └── Buyer: Independent practice doctor

Phase 2 — V2 (Months 12-18)
└── ConsentDoc: Surgical Consent Documentation
    └── Capture: Room-mounted tablet (NEW adapter)
    └── Speakers: 3-6 (Doctor, Patient, Relatives)
    └── Buyer: Hospital risk management (enterprise)
└── ClinRecall: Multilingual support added to Layer 2

Phase 3 — V3 (Months 18-30)
└── ClinRecall: EHR integration connector (Epic first)
└── CoachCall: Sales call coaching
    └── Capture: Phone call integration (NEW adapter)
    └── Speakers: 2 (Sales rep, Prospect)
    └── Buyer: Sales operations / revenue teams
└── ScribeDesk: Journalist / researcher transcription
    └── Capture: Desktop web browser (NEW adapter)
    └── Buyer: Media organisations, research institutions

Phase 4 — Platform (Month 30+)
└── Open API for enterprise customers to build custom use cases
└── Marketplace of intelligence templates
└── White-label licensing to healthcare technology companies
```

---

### 14.5 V1 Architectural Decisions That Must Be Made Correctly Now

These are the decisions where getting it wrong in V1 creates expensive rework when Phase 2 begins. They cost almost nothing to get right now.

| Decision | Correct V1 Approach | Wrong Approach (avoid) |
|---|---|---|
| Use case identity | Every session has a `use_case_type` field from creation | No use case field; ClinRecall logic baked into core |
| Intelligence templates | Extraction prompts stored as versioned config in database | Prompts hardcoded in application code |
| Output schema | Flexible JSON with schema validation per use case type | Fixed database columns matching only SOAP note fields |
| Speaker roles | Generic role labels (Speaker A, Speaker B) mapped to use case roles in config | Hardcoding "Doctor" and "Patient" as the only roles in the data model |
| Capture interface | Abstract audio input interface that accepts any audio source | Building capture logic only for mobile browser microphone |
| Billing | `use_case_type` as a dimension in subscription model from Day 1 | Flat subscription with no use case dimension — needs rearchitecting for enterprise |
| Integration events | Internal event stream in place from Day 1 (even with no consumers) | No event stream; integrations built as point-to-point hacks when needed |

---

### 14.6 What This Architecture Enables Commercially

| Without Platform Architecture | With Platform Architecture |
|---|---|
| Adding ConsentDoc requires 80% of a rebuild | Adding ConsentDoc requires 4-8 weeks of configuration |
| Each new use case competes with core product for engineering time | Each new use case builds on shared platform investment |
| Valued at exit as a single-product tool | Valued at exit as a healthcare conversation intelligence platform |
| Enterprise hospital asks for customisation → panic | Enterprise hospital asks for customisation → 2-week template build |
| Each use case needs separate HIPAA compliance work | One compliance framework covers all use cases |
| Engineering team context-switches between incompatible codebases | One codebase, one deployment pipeline, multiple products |

A single-product company at 3,000 doctors might achieve a 5-6x ARR valuation multiple. A platform with three validated use cases, an open expansion roadmap, and enterprise contracts typically achieves 10-15x ARR. The architectural decisions made in V1 directly determine which outcome is possible.

---

## 15. PRICING STRATEGY

### 15.1 Pricing Philosophy

Price signals quality. Independent practice physicians already pay $150-400/month for EHR tools, scheduling software, and dictation services. Pricing ClinRecall below $80/month signals that it is a commodity; pricing it above $150/month before brand trust is established creates friction for early adopters.

**The right price for V1 is $99/month.**

### 15.2 Pricing Structure

| Plan | Price | Who It's For | What's Included |
|---|---|---|---|
| Free Trial | $0 for 60 days | All new signups | Full product access, no credit card required |
| Solo Practitioner | **$99/month** | Single doctor | Unlimited sessions, unlimited patients, all features |
| Annual (Phase 2) | $79/month billed annually ($948/year) | Committed users | 20% discount for annual commitment — introduce at Month 9 |
| Clinic Pack (Phase 3) | $249/month | 2-5 doctors in same practice | Shared billing, separate data per doctor — introduce at Month 18 |

### 15.3 Pricing Rationale

- **No per-session or per-patient limits** — usage-based pricing creates anxiety during busy clinic days; doctors stop using the product when they feel they're "spending" per use
- **No credit card for trial** — reduces signup friction; doctors are busy; the barrier to trying must be near zero
- **Annual pricing deferred to Month 9** — only offer annual discounts once retention data confirms D90 > 55%; discounting before then locks in churners at a loss
- **No freemium tier** — a freemium model in a HIPAA-regulated product creates compliance complexity (free users still generate PHI) and trains doctors to expect the product for free

### 15.4 Competitive Pricing Context

| Competitor | Price | ClinRecall Advantage |
|---|---|---|
| Nuance DAX | ~$500+/month | 5x cheaper |
| DeepScribe | ~$300/month | 3x cheaper |
| Freed AI | $99-149/month | At parity — but with longitudinal memory they lack |
| Nabla | ~$149/month | Cheaper, US-focused |

At $99/month, ClinRecall is the most affordable serious solution in the market while remaining profitable given India-based operating costs.

---

## 16. GO-TO-MARKET STRATEGY

### 16.1 The Core Challenge

ClinRecall is built in India and sold to US physicians. The biggest risk is not the product — it is finding the first customers from 12,000 kilometres away in a market that runs on professional trust and word-of-mouth. Every element of the go-to-market strategy is designed to solve this specific constraint.

### 16.2 The Principle: Validate Before You Build

**Do not write production code until market signal is confirmed.**

Before engineering begins, build a landing page describing ClinRecall — what it does, who it's for, and a "Join the Waitlist at $99/month" call to action. This costs 1 week, not 6 months.

**Signal thresholds:**
- 100 unique physician visitors → 15+ waitlist signups = proceed with confidence
- 100 visitors → 0-5 signups = messaging problem, revisit positioning before building
- 100 visitors → 5-15 signups = borderline; conduct 10 doctor interviews before deciding

### 16.3 Phase 1 — Discovery & Validation (Days 1-30)

**Goal:** Talk to 10 US independent practice physicians. Not to pitch. To learn.

**Questions to ask every doctor:**
- Walk me through how you handle notes today — what's your exact workflow?
- What happens between a patient's visits — how do you prepare for the next one?
- Have you ever missed something from a prior visit that mattered?
- What would make you replace a tool you already use?
- If something like this existed, what would make you trust it enough to use it with real patients?

**Where to find doctors to interview:**
- **Doximity** — the professional network for US physicians; 80%+ of US doctors have a profile
- **LinkedIn** — filter by "Physician", "Family Medicine", "Internal Medicine", location: USA
- **Reddit** — r/medicine, r/physicianassistant, r/medicalschool (for residents who will be tomorrow's independent doctors)
- **US Medical Advisor** — your single most valuable asset; one person with a physician network opens 20 conversations immediately

**Outreach message template for Doximity/LinkedIn:**
> "Hi Dr. [Name] — I'm building a tool to help independent practice doctors reduce the time they spend on notes and preparing for return visits. I'm not pitching anything — I'd love 20 minutes to understand how you currently work. Happy to share what I'm learning with you in return. Would you be open to a quick call?"

### 16.4 Phase 2 — Three Blocking Decisions (Days 30-60)

These decisions must be made before engineering starts. Getting them wrong mid-build is expensive.

| Decision | Recommendation | Action |
|---|---|---|
| AI Stack | AssemblyAI + GPT-4o via Azure OpenAI Service | Apply for Azure OpenAI access (1-2 wk approval); sign BAAs with both; get sandbox API keys |
| US Legal Entity | Delaware LLC | Use Stripe Atlas or Firstbase; takes 2 weeks, costs ~$500 |
| US Medical Advisor | 1 physician with independent practice network | Offer 1-2% equity or $500-1,000/month retainer; recruit within 30 days |

**On the US Medical Advisor:** This is not optional. They provide:
- Credibility ("Dr. Smith from Boston uses this") that no marketing can replicate
- First pilot doctor recruits from their personal network
- Compliance sanity checks from a clinical perspective
- Ongoing feedback on whether the product actually fits physician workflow

### 16.5 Phase 3 — Concierge MVP & Pilot (Days 60-90)

**Do not build the full product for the pilot.**

Build only the minimum needed to prove the core value:
- One-tap recording on mobile browser
- Basic speaker separation (Doctor vs. Patient)
- AI-generated note returned within 5 minutes (human review of AI output is acceptable initially)
- Simple patient profile page

Give this to **5 pilot doctors at no charge** in exchange for:
- 30 minutes of feedback per week
- Permission to use their anonymised feedback as case studies
- Referrals to 2-3 colleagues if they find it valuable

**The signal you're looking for:** A doctor says *"I don't want to go back to how I worked before."* That sentence — not revenue, not conversion rate — is the sign that you have product-market fit.

### 16.6 Phase 4 — Paid Launch & Acquisition (Months 5-9)

**Channel 1 — Word of Mouth (Primary)**
Physicians trust other physicians more than any marketing. One doctor who loves the product and tells 3 colleagues is worth $50,000 in advertising. Invest in making the first 50 doctors so happy they become unpaid advocates.

**Channel 2 — Doximity & LinkedIn Content**
Post weekly content about physician burnout, documentation burden, and clinical workflow — not product pitches. Build authority in the space. Doctors who find the content valuable will investigate the product.

**Channel 3 — Medical Community Partnerships**
Partner with state medical associations, specialty societies (American Academy of Family Physicians, American College of Physicians), and independent practice advocacy groups. They have direct access to thousands of independent doctors.

**Channel 4 — US-Based Commission Sales**
Hire a US-based healthcare sales advisor on pure commission (15-20% of first-year subscription). No salary, no upfront cost. They work their existing physician relationships. This is how India-based SaaS companies build US pipelines without hiring full-time US staff.

**Channel 5 — Targeted Digital Advertising (Month 9+)**
Only after organic channels are validated and customer acquisition cost (CAC) is understood. Google Search ads targeting "medical scribe app", "doctor note taking app", "HIPAA voice recorder for doctors." Budget: $5,000/month initially.

### 16.7 The 90-Day Priority Order

| Priority | Action | Timeline | Owner |
|---|---|---|---|
| 1 | Build landing page + waitlist | Week 1 | Founder + Designer |
| 2 | Talk to 10 US doctors — listen, don't pitch | Weeks 2-4 | Founder |
| 3 | Form Delaware LLC | Week 2 | Founder |
| 4 | Find and onboard US medical advisor | Weeks 2-6 | Founder |
| 5 | Sign AssemblyAI BAA + Microsoft BAA (Azure + Azure OpenAI); apply for Azure OpenAI access | Week 1-4 | Founder + Legal |
| 6 | Build concierge MVP | Months 2-3 | Engineering |
| 7 | Onboard 5 pilot doctors (free) | Month 3 | Founder + Medical Advisor |
| 8 | Collect weekly feedback, iterate | Month 4 | PM + Engineering |
| 9 | Open paid subscriptions at $99/month | Month 5-6 | Founder |

### 16.8 India-to-USA Operational Model

| Challenge | Solution |
|---|---|
| US sales without physical presence | US medical advisor on equity/retainer + commission sales rep |
| Trust and credibility | Doctor case studies, named advisors on website, HIPAA compliance badge prominent |
| Support across timezones | Async-first support (email/chat); doctors are busy during the day and prefer async |
| Payment collection | Stripe supports Indian companies charging US customers in USD |
| Legal contracts | Delaware LLC signs all US customer agreements; India entity handles employment |
| Data never leaves the US | Azure US infrastructure; India team uses VPN to access anonymised dev environment only |

---

## 17. SUCCESS METRICS

### 17.1 Acquisition Metrics — Revised to Realistic Targets

| Metric | Month 3 Target | Month 6 Target | Month 12 Target |
|---|---|---|---|
| Signups (free trial) | 50 | 250 | 800 |
| Trial-to-paid conversion rate | — | 10% | 12% |
| Paying doctors (net of churn) | 5 | 24 | 72 |
| Monthly Recurring Revenue | $495 | $2,376 | $7,128 |

> Targets revised from v1.x — conversion rate reduced from 25-30% (unrealistic) to 10-12% (industry benchmark).

### 17.2 Engagement Metrics (Product-Market Fit Signals)

| Metric | Target |
|---|---|
| Sessions recorded per doctor per week | >10 |
| Pre-visit brief viewed before session | >80% of sessions |
| Note review and save rate | >95% (doctor must review every note) |
| D30 retention (still active 30 days after signup) | >70% |
| D90 retention | >55% |

### 17.3 Quality Metrics

| Metric | Target |
|---|---|
| Doctor-reported note accuracy satisfaction | >90% |
| Average note generation time | <3 minutes |
| App uptime | >99.5% |
| Support tickets per 100 active doctors per month | <5 |

### 17.4 Business Health Metrics — NEW in v2.0

| Metric | Target | Trigger for Concern |
|---|---|---|
| Customer Acquisition Cost (CAC), blended | <$800 | >$1,000 |
| Monthly Churn Rate | <2.5% Months 1-12; <1.8% Months 13+ | >3% |
| LTV / CAC Ratio | >3.0 | <2.0 |
| CAC Payback Period | <12 months | >18 months |
| Gross Margin per Doctor | >85% | <75% |
| AI Unit Cost per Active Doctor per Year | <$140 | >$200 |
| Net Revenue Retention (Month 12+) | >100% | <90% |

### 17.5 North Star Metric

**Weekly Active Recording Doctors (WARD)** — the number of doctors who recorded at least one session in the past 7 days. This metric best captures whether the product has become a genuine part of clinical workflow.

---

## 18. DELIVERY MILESTONES

| Milestone | Target Date | Deliverables |
|---|---|---|
| **M-1 — Pre-Build Validation (NEW)** | Month 0 | Landing page live, 10+ doctor interviews complete, 3 pilot LOIs signed, FDA/SaMD assessment complete, BAAs signed |
| M0 — Project Kickoff | Month 1, Week 1 | Team assembled (9-10 people), tech stack decided, Azure HIPAA subscription set up, Azure OpenAI access approved, Terraform foundation |
| M1 — Foundation | Month 2, Week 2 | Auth (MFA), patient profiles, basic UI shell, consent workflow scaffolding |
| M2 — Recording MVP | Month 3, Week 2 | PWA recording, failure-resistant capture, audio upload, speaker diarization integration |
| M3 — AI Note Generation + MLOps | Month 4, Week 2 | Note extraction, review/edit/sign flow, golden dataset v1, evaluation pipeline |
| M4 — Memory Layer | Month 5, Week 2 | Visit history, pre-visit brief, pgvector semantic search, note signature workflow |
| M5 — Compliance & Hardening | Month 6, Week 2 | HIPAA audit, penetration test, SOC 2 Type I prep, subscription billing, two-party consent enforcement |
| **M6 — Closed Pilot** | Month 6, Week 4 | 5 pilot doctors onboarded (free), structured feedback system active |
| **M7 — Extended Pilot + Iteration** | Month 7, Week 4 | 15 additional doctors invited, fixes from closed pilot feedback deployed |
| **M8 — Public Launch (Paid)** | Month 8, Week 2 | Product publicly available, paid subscriptions open, support ops active |
| M9 — Iteration 1 | Month 10 | Native iOS app beta, quality improvements from 50+ doctor feedback |
| M12 — Year 1 Close | Month 12 | SOC 2 Type I achieved, 72+ paying doctors, ready for Series Seed close |

---

## 19. OPERATIONAL EXCELLENCE & GOVERNANCE

This section was added in v2.0 to address gaps identified in senior review. It covers operational domains that are often deferred but are critical to a credible enterprise-grade healthcare product.

---

### 19.1 Support & Operations Plan

**Support Tiers:**

| Tier | Scope | Response SLA | Hours |
|---|---|---|---|
| Self-Service | Help docs, video tutorials, in-app FAQ | Immediate | 24/7 |
| Email Support | Functional questions, bug reports | <4 business hours | Business hours US |
| Priority Support | Clinical workflow disruption, data access issues | <1 business hour | Business hours US |
| Emergency (Production Down) | System-wide outage affecting multiple doctors | <30 minutes | 24/7 on-call |

**Support Staffing:**
- Month 1-6: Founder + PM handle all support (learn from customer feedback directly)
- Month 6-12: US-based Customer Success Manager (part-time, 20 hrs/week)
- Month 12+: Full-time US-based CS Manager + India-based tier 1 support

**Operational Runbooks (build by Month 5):**
- Incident response procedure
- Data breach notification workflow
- Audio pipeline failure recovery
- LLM provider outage fallback
- Doctor account recovery
- Patient data request handling

**Communication Channels:**
- Status page: status.clinrecall.com (powered by Statuspage.io or self-hosted)
- Monthly customer update email
- Quarterly physician advisory council call

---

### 19.2 Vendor Risk Management

Critical dependencies and mitigations:

| Vendor | Risk | Mitigation |
|---|---|---|
| AssemblyAI | Pricing change, acquisition, outage, accuracy regression | Layer 2 vendor abstraction; evaluate Deepgram and Azure Speech Services as backups; track monthly error rates |
| Microsoft / Azure OpenAI | Model deprecation, pricing spike, training data policy change | Layer 3 LLM abstraction; maintain readiness to swap to Llama 3 (Azure ML) or other models; contractual notice requirements |
| Microsoft / Azure | Service outage, region failure, pricing change | Multi-AZ deployment, documented DR plan, warm-standby in West US 2 |
| Auth0 | Breach, acquisition, pricing | Documented migration path to Azure AD B2C |
| Stripe | Account freeze, fraud issue | Backup payment processor (Adyen or Paddle) pre-evaluated |

**Quarterly Vendor Review:**
- Performance against SLA
- Invoice accuracy
- Compliance posture (BAA still active, SOC 2 report current)
- Pricing trends
- Roadmap alignment with ours

**Concentration Risk Rule:** No single vendor should represent >40% of variable cost without a documented alternative.

---

### 19.3 Security Framework & Certifications

| Framework | Target | Why |
|---|---|---|
| HIPAA compliance | Day 1 | Legal requirement to handle PHI |
| SOC 2 Type I | Month 12 | Entry requirement for hospital procurement |
| SOC 2 Type II | Month 18-24 | Required for enterprise deals; proves operational effectiveness |
| HITRUST (optional) | Month 36+ | Required for large hospital systems; expensive but high-trust signal |
| NIST Cybersecurity Framework alignment | Month 6 | Best practice; evidence of mature security posture |

**Annual Security Activities:**
- External penetration testing (Month 6, then annually)
- Vulnerability scanning (monthly automated)
- Phishing simulations (quarterly)
- Employee security training (annual + new hire)
- Access control review (quarterly)
- Vendor security re-assessment (annual)

**Security Incident Response:**
- Incident Response Plan documented and tested (tabletop exercise twice yearly)
- Security lead designated (initially founder; dedicated hire at Month 18)
- Breach notification processes tested
- Cyber insurance policy reviewed annually

---

### 19.4 Model Governance & MLOps

Extends Section 13.5 with governance-specific practices.

**Model Change Control Board (Month 6+):**
- Membership: PM, AI/ML Engineer, Clinical Content Reviewer
- Approves: new prompt templates, model version upgrades, Intelligence Layer changes
- Cadence: biweekly
- Outputs: versioned approval records stored with every deployed template

**Model Transparency Log:**
- Every note in every patient record includes: model ID, model version, prompt template version, generation timestamp
- Doctors can view this metadata (supports legal defensibility)
- Historical notes are not retroactively regenerated when models change

**Hallucination Response Protocol:**
When a doctor flags a hallucinated fact (FR-5.6):
1. Note is quarantined and reviewed by Clinical Content Reviewer within 48 hours
2. Pattern detection: is this a systemic issue or a one-off?
3. If systemic: rollback prompt template, notify affected doctors if necessary
4. All hallucination incidents logged; monthly report to PM

**Bias and Fairness Monitoring:**
- Quarterly audit: does extraction accuracy vary by patient demographics, accent, or speech patterns?
- Remediation plan if significant bias detected
- Align with emerging AI bill-of-rights and healthcare AI fairness standards

---

### 19.5 Business Continuity & Disaster Recovery

**Disaster Scenarios and Responses:**

| Scenario | Probability | Impact | Response |
|---|---|---|---|
| Azure East US 2 region outage (>4 hours) | Low | High | Failover to West US 2 warm-standby; RTO 1 hour |
| Founder unavailability (health, personal emergency) | Low | Very High | Documented runbooks; secondary authorised operator; 30-day operational handoff plan |
| India office loses power/internet for >48 hours | Medium | Medium | Remote work arrangements; GitHub Codespaces / Gitpod for development; no production access required from India |
| Key engineer departure | Medium | High | No single-person knowledge dependency; all critical systems documented; minimum 2 engineers per critical system |
| AssemblyAI 48+ hour outage | Low | High | Temporary fallback to Azure Speech Services (lower quality but available); proactive doctor communication |
| Data corruption event | Very Low | Very High | Point-in-time recovery from continuous backups; forensic analysis; doctor communication |
| Cyberattack / ransomware | Low | Very High | Immutable WORM backups unaffected by ransomware; incident response plan; cyber insurance |

**BCP Testing:**
- Tabletop exercise twice yearly
- Actual DR failover test annually (in maintenance window)
- Post-exercise report with action items

---

### 19.6 Patient Rights & Data Governance

**Rights Supported (via Module 10 functional requirements):**

| Right | Timeline | Implementation |
|---|---|---|
| Right of Access | Within 30 days | Doctor exports all notes for a patient as PDF |
| Right of Correction | Within 60 days | Doctor adds amendment; original preserved |
| Right of Deletion | Within 30 days (post-retention period) | Hard delete after applicable retention |
| Right to Accounting of Disclosures | Within 60 days | Audit log query filtered by patient |
| Right to Restrict Uses | As requested | Flag patient record; restrict processing |

**Retention Policy:**

| Data Type | Minimum Retention | Maximum Retention |
|---|---|---|
| Clinical Notes | 7 years post-last-visit (varies by state) | Until doctor deletion request |
| Audit Logs | 6 years (HIPAA) | 6 years |
| Raw Audio | 72 hours | 72 hours |
| Doctor Account Data | Duration of subscription + 90 days | 90 days post-cancellation |
| Billing Records | 7 years | 7 years (IRS requirement) |

**Cross-Border Data Handling:**
- No PHI ever accessible to India-based employees without documented business-critical need and signed BAA-equivalent contractual protection
- Production PHI storage: US Azure regions only (East US 2 + West US 2)
- India development environment: synthetic data only, verified quarterly

---

### 19.7 Internationalization Roadmap

V1 is US-only. Future international expansion is planned but deliberately deferred until US market is validated.

| Phase | Target Geographies | Regulatory Framework | Timing |
|---|---|---|---|
| Phase 1 | USA | HIPAA | V1 |
| Phase 2 | Canada | PIPEDA + provincial health laws | Year 2-3 |
| Phase 3 | UK | GDPR + UK DPA + NHS IG | Year 3-4 |
| Phase 4 | Australia | Privacy Act 1988 + My Health Records Act | Year 3-4 |
| Phase 5 | EU | GDPR + MDR (Medical Device Regulation) | Year 4-5 |

**Architectural Implications (V1):**
- Storage Layer must support multiple data residency regions (implementable via Azure multi-region with region-based routing via Front Door)
- Intelligence Module must support multilingual extraction (English, French, Spanish likely priority)
- Capture Layer must handle regional language/accent variations
- All regulatory framework handlers (HIPAA, GDPR, etc.) pluggable per region

These are architectural considerations for V1 design, not features. Getting them right now costs little; retrofitting costs significantly.

---

### 19.8 Security & Performance Engineering (NEW in v2.4)

This section consolidates findings from the v2.4 Senior Security Architect + Performance Engineer review. 23 findings were identified across security and performance domains. The 4 CRITICAL and 7 HIGH severity items must be addressed before or during early engineering. The remainder are tracked as ongoing engineering discipline.

---

#### 19.8.1 Application Security Testing (CRITICAL)

The CI/CD pipeline must enforce automated security testing on every commit. No code reaches production without passing these gates.

| Test Type | Tool | Trigger | Block Deploy On |
|---|---|---|---|
| **SAST** (static analysis) | GitHub Advanced Security or Snyk Code | Every PR | Critical or High severity findings |
| **SCA** (dependency scanning) | Dependabot + Snyk Open Source | Daily + every PR | Known CVE in production dependency |
| **Container scanning** | Microsoft Defender for Containers or Trivy | Every image build | Critical/High CVEs in base image or layers |
| **DAST** (dynamic) | OWASP ZAP automated scan | Nightly on staging | New OWASP Top 10 finding |
| **Secret scanning** | GitHub Secret Scanning + TruffleHog | Every PR | Any secret committed |
| **IaC scanning** | Checkov on Terraform | Every PR | Misconfigured Azure resource |

**Penetration testing:** Third-party manual penetration test before public launch (Month 6) and annually thereafter. Bug bounty program launches at Month 12 (post SOC 2 Type I).

---

#### 19.8.2 AI / LLM-Specific Security Controls (CRITICAL)

LLMs introduce attack vectors not present in traditional applications. The following controls are mandatory.

| Control | Implementation |
|---|---|
| **Prompt injection mitigation** | Transcripts sanitized before LLM call: strip instruction-like patterns ("ignore previous instructions"), use structured input format with clear delimiters, system prompt explicitly instructs model to ignore embedded instructions in user content |
| **Output schema validation** | Every LLM response is validated against a strict JSON schema; non-conforming output triggers regeneration (max 2 attempts) then human review |
| **Output content filtering** | Azure AI Content Safety filters applied to all LLM outputs; flag harmful content, profanity, or unexpected medical claims |
| **Prompt template integrity** | All prompt templates hashed; runtime verifies template hash matches signed expected hash; tampering triggers alert |
| **PHI minimization in prompts** | Only the minimum necessary context sent to the LLM; patient names redacted to placeholders before LLM call |
| **Hard guardrails** | Intelligence Layer prompts explicitly forbid: generating diagnoses, recommending specific medications/dosages, providing clinical advice. System reminds in every prompt. |
| **Hallucination flagging** | Doctor flags via FR-5.6 trigger automated review; pattern detection identifies systemic issues |
| **Adversarial testing** | Quarterly red-team exercise: deliberately attempt prompt injection, jailbreaking, PHI extraction via the LLM |

---

#### 19.8.3 Mobile Application Security (HIGH)

| ID | Requirement |
|---|---|
| MS-1 | **Certificate pinning** for all API connections (prevents MITM on hostile WiFi) |
| MS-2 | **Jailbreak / root detection** — app refuses to run on compromised devices, with user notification |
| MS-3 | **App integrity verification** — Apple App Attest (iOS), Play Integrity API (Android) |
| MS-4 | **On-device PHI encryption** — any cached patient data encrypted with device-bound key (Secure Enclave / Keystore) |
| MS-5 | **Screen recording / screenshot prevention** during note review and patient profile screens |
| MS-6 | **Biometric re-auth on app resume** — Face ID / Touch ID required if app backgrounded > 5 minutes |
| MS-7 | **Local data wipe on uninstall and on N failed biometric attempts** |
| MS-8 | **Code obfuscation** — production builds use ProGuard (Android) and Swift compile-time obfuscation |
| MS-9 | **No PHI in mobile logs** — production builds strip debug logging entirely |
| MS-10 | **Disable copy/paste** for note content (prevents PHI leakage to other apps) |

---

#### 19.8.4 Production Access & Insider Threat Controls (HIGH)

The India-based team requires structural safeguards beyond "use synthetic data."

| Control | Implementation |
|---|---|
| **2-person code review** | Every PR requires 2 approvals; for changes touching auth, PHI handling, or audit logs, one reviewer must be designated security reviewer |
| **2-person production deployment** | Deployment to production requires 2-person approval (one engineer requests, another approves); logged in audit trail |
| **Code signing** | All production builds signed with Sigstore / cosign; runtime verifies signature before execution |
| **Privileged Access Management (PAM)** | Production PHI access requires break-glass workflow: time-limited, justification logged, all session activity recorded, post-access review |
| **Separation of duties** | Developers cannot directly deploy; deployers cannot edit code; security cannot bypass code review; documented role matrix |
| **Background checks** | Any team member with potential production access undergoes background check before access granted |
| **No production access from India** | India team has zero direct production access; all production operations via CI/CD or US-based on-call |
| **Immutable audit trail** | All privileged actions logged to WORM storage; 6-year retention; SIEM alerting on anomalies |

---

#### 19.8.5 Audit Logging & SIEM Integration (HIGH)

Beyond HIPAA basics, the following events must be logged immutably:

| Event Type | Detail |
|---|---|
| Authentication | All logins (success/fail), MFA challenges, password changes, account lockouts |
| Authorization | Permission denials, RBAC role changes, scope escalations |
| PHI Access | Every read/write of patient data with doctor_id, patient_id, action, timestamp, IP |
| Bulk Operations | Any operation accessing >50 patients in single request (potential data exfiltration) |
| Admin Operations | Template changes, user impersonation, configuration changes |
| Cryptographic Operations | Key Vault secret access, certificate rotations, signing key usage |
| Database | Schema migrations, manual queries against production, replication events |

**SIEM:** Microsoft Sentinel (native Azure integration) ingests all logs. Detection rules:
- 5+ failed logins from one IP in 5 minutes → alert
- Doctor accessing >100 patient records in 1 hour → alert
- API call from new geographic region for a doctor → alert
- Configuration change outside business hours → alert
- Key Vault access from non-approved service principal → critical alert

---

#### 19.8.6 Authentication Hardening (HIGH)

Auth0 features to be configured (not defaults):

| Feature | Configuration |
|---|---|
| Anomaly Detection | Enabled — block sign-ins from suspicious IPs |
| Brute Force Protection | Enabled — 10 failed attempts triggers 15-minute lockout |
| Suspicious IP Throttling | Enabled — known TOR exit nodes and proxy IPs throttled |
| Compromised Credentials | HIBP integration — password matched against known breaches blocks signup/reset |
| Geo-velocity Detection | Login from US then Asia within 1 hour → MFA challenge |
| Device Trust | Track trusted devices per doctor; new device → MFA challenge |
| Session Management | Access token 15 min, refresh token 30 days, idle timeout 30 min |
| Logout Enforcement | Refresh tokens revoked across all devices on suspicious activity |

---

#### 19.8.7 PHI Protection in Logs and Errors (MEDIUM)

| Control | Implementation |
|---|---|
| Structured logging | All logs use JSON with explicit field marking; PHI fields marked and never logged |
| Log scrubbing middleware | Backend redacts emails, phone numbers, names, MRNs, SSN-like patterns from any log output |
| Error sanitization | Sentry breadcrumbs scrubbed before transmission; no request bodies, no headers with auth |
| Log retention | Application logs 90 days, audit logs 6 years (HIPAA), error logs 30 days |
| Log access | Engineering can view logs in non-production; production logs require break-glass workflow |
| Quarterly log audit | Security team samples production logs quarterly to verify no PHI leakage |

---

#### 19.8.8 Web Application Security Headers (MEDIUM)

| Header | Value |
|---|---|
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` |
| `Content-Security-Policy` | Strict policy: only own origin + Auth0 + Azure CDN |
| `X-Frame-Options` | `DENY` (no embedding) |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | Disable all unused features (camera, geolocation, etc.) |
| `CORS` | Allowlist only known origins (web app domain, mobile app schemes) |

Subresource Integrity (SRI) hashes for any externally loaded JS; sensitive operations (note signing, deletion) require additional API request signing with HMAC.

---

#### 19.8.9 Secret Rotation Policy (MEDIUM)

| Secret | Rotation Cadence | Mechanism |
|---|---|---|
| AssemblyAI API key | 90 days | Azure Key Vault rotation policy + manual notification |
| Azure OpenAI API key | 90 days | Azure Key Vault rotation policy |
| Database master credentials | 90 days | Azure Database for PostgreSQL automatic rotation |
| JWT signing keys | 30 days (auto by Auth0) | Auth0 standard |
| Service principal secrets | 90 days | Azure managed identity preferred where possible |
| Stripe API key | 180 days | Stripe rotation + manual update |
| Auth0 management API token | 90 days | Auth0 standard |
| Encryption keys (envelope encryption) | Annual | Azure Key Vault with key versioning; old keys retained for decryption |

Compromised key rotation: <4 hours from detection to full rotation.

---

#### 19.8.10 Cross-Tenant Isolation Testing (MEDIUM)

Row-level security in PostgreSQL is the primary control; testing must verify it never fails.

| Test | Frequency |
|---|---|
| Automated cross-tenant access tests in CI | Every commit |
| Doctor A attempting to read Doctor B's data via every API endpoint | Every commit |
| Penetration test specifically targeting cross-tenant access | Quarterly |
| Manual code review of any RLS policy change | Every PR |

A single cross-tenant data leak is a HIPAA breach. The discipline is non-negotiable.

---

#### 19.8.11 Bug Bounty Program (MEDIUM)

- Private bug bounty launched Month 12 (post SOC 2 Type I)
- HackerOne or Bugcrowd platform
- Initial scope: production web app + API (mobile added Month 18)
- Rewards: $500 (low) → $5,000 (critical)
- Public bug bounty considered Year 2

---

#### 19.8.12 Performance SLOs — Per Endpoint (CRITICAL)

| Endpoint Class | p50 | p95 | p99 |
|---|---|---|---|
| Auth (`/v1/auth/*`) | 100ms | 300ms | 500ms |
| Read (list, get) | 100ms | 250ms | 500ms |
| Write (create, update) | 200ms | 500ms | 1s |
| Search (semantic + keyword) | 300ms | 800ms | 1.5s |
| Session start | 200ms | 500ms | 1s |
| Note generation (async, end-to-end) | 60s | 90s | 180s |
| Pre-visit brief generation | 5s | 15s | 30s |

SLOs measured continuously via Application Insights; weekly SLO review meeting; quarterly SLO refresh based on user feedback.

Error budget: 99.9% uptime = 43 min/month. SLO violations consume error budget; budget exhausted = freeze on non-critical changes until SLO recovers.

---

#### 19.8.13 Load Testing Strategy (CRITICAL)

| Test | Frequency | Tool |
|---|---|---|
| Baseline load test | Pre-release | Azure Load Testing or k6 |
| Stress test (find breaking point) | Quarterly | k6 |
| Soak test (24 hour sustained load) | Pre-major-release | k6 |
| Spike test (sudden traffic surge) | Quarterly | k6 |
| Chaos engineering (random failures) | Month 12+ | Azure Chaos Studio |

**Test scenarios:**
- Peak clinic hours (9am-5pm ET): 500 concurrent doctors recording sessions
- Batch note generation: 100 sessions complete simultaneously
- Search-heavy patterns: 100 doctors searching concurrently
- Cold start scenarios: scaling from 0 → 100 instances

Dedicated load test environment: separate Azure subscription, synthetic data, isolated from production.

---

#### 19.8.14 AI Pipeline Performance Targets (HIGH)

End-to-end note generation pipeline budget breakdown:

| Step | Target p95 | Concern Threshold |
|---|---|---|
| Audio chunk stitching from Blob Storage | 5s | >10s |
| AssemblyAI processing (20 min audio) | 60s | >90s |
| GPT-4o note extraction | 15s | >30s |
| Pre-visit brief context fetch + GPT-4o-mini | 10s | >20s |
| Database write + push notification | 2s | >5s |
| **Total p95 end-to-end** | **90s** | **>120s** |

Monitoring and alerts on every stage. If any stage exceeds threshold for >5% of sessions in 1 hour, alert on-call.

Optimization tactics:
- Prompt engineering for token efficiency (less input = faster + cheaper)
- Parallelize independent steps (pre-visit brief while transcription runs)
- Streaming GPT-4o output where it improves perceived performance
- Pre-warm Azure Functions with health-check schedule

---

#### 19.8.15 Database Performance Engineering (HIGH)

| Concern | Implementation |
|---|---|
| Connection pooling | **PgBouncer in transaction mode** from Day 1; sized for 3x peak concurrent connections |
| Query timeouts | Statement timeout 30 seconds default; longer queries explicitly approved |
| Indexing strategy | Documented in `schema.sql`; mandatory `EXPLAIN ANALYZE` review for new queries |
| N+1 query prevention | SQLAlchemy lazy loading explicitly disabled; eager loading required; PR review checks |
| Slow query log | All queries >1s logged; daily review by on-call |
| Read replicas | Add read replica at Month 12 if read load >70% of capacity; use for search queries first |
| Connection limits | Per-tenant connection cap: 10; prevents one runaway doctor from starving the pool |
| Vacuum strategy | Auto-vacuum tuned for high-write workload; manual vacuum during maintenance windows |
| pgvector index | HNSW index on embeddings; `ef_construction=200`, `m=16` defaults; tune at scale |
| Partitioning | Sessions table partitioned by month at >10M sessions |

---

#### 19.8.16 Mobile Performance Targets (HIGH)

| Metric | Target |
|---|---|
| First Contentful Paint (PWA, 4G) | <1.5s |
| First Contentful Paint (PWA, 3G) | <2.5s |
| Time to Interactive (PWA) | <3s |
| Initial JS bundle (gzipped) | <300KB |
| Largest screen JS bundle (gzipped) | <100KB |
| Native app launch time | <2s cold, <500ms warm |
| API call retry strategy | Exponential backoff: 1s, 3s, 9s; max 3 attempts |
| Offline reads | Last 50 patient profiles + 20 most recent notes cached via Service Worker |
| Crash-free rate | >99.5% sessions |

Mobile performance monitored via Application Insights mobile SDK + Firebase Performance.

---

#### 19.8.17 Tiered LLM Model Strategy (MEDIUM — saves ~30% AI cost)

Not every AI task needs GPT-4o. Documented model selection:

| Task | Model | Rationale |
|---|---|---|
| Note extraction | **GPT-4o** | High stakes — doctor signs the result; quality matters |
| Pre-visit brief | **GPT-4o-mini** | Lower stakes; doctor reviews; 17x cheaper, 3x faster, sufficient quality |
| Search query understanding | **GPT-4o-mini** | Quick, low-stakes interpretation |
| Embedding generation | **text-embedding-3-large** | Quality matters for retrieval accuracy |
| Document summarization (admin) | **GPT-4o-mini** | Internal use; non-clinical |

Estimated savings: ~30% of LLM cost without quality impact on critical path.

Model selection encoded in Intelligence Layer template; can be tuned per use case via configuration without code changes.

---

#### 19.8.18 Caching Strategy (MEDIUM)

| Data | Cache Layer | TTL | Invalidation |
|---|---|---|---|
| Doctor profile | Redis | 5 min | On profile update |
| Patient list | Redis | 1 min | On patient create/edit/archive |
| Pre-visit brief | Redis | 60 min | On new session for that patient |
| Search results | Redis | 30 sec | Time-based only |
| Auth0 JWKS (public keys) | In-memory | 24 hours | Standard rotation |
| Static assets (CSS, JS, images) | Azure Front Door CDN | 1 year (with versioned filenames) | Cache bust on deploy |
| API GET responses (read-only) | Front Door CDN | Variable | Per-resource invalidation |

Cache poisoning protection: cache keys include doctor_id where relevant; never cache cross-tenant data.

---

#### 19.8.19 Auto-Scaling Configuration (MEDIUM)

**Backend API (Azure Container Apps):**
- Min replicas: 2 (HA)
- Max replicas: 20 (cost cap)
- Scale up: CPU >70% sustained 1 min OR concurrent requests >50/replica
- Scale down: CPU <30% sustained 10 min
- Cooldown: 5 min between scale events

**Background Functions (Audio Processing):**
- Plan: **Azure Functions Premium Plan** (avoids cold start latency)
- Min instances: 1 always-warm
- Max instances: 50
- Scale on: queue depth in Service Bus > 5 messages

**Database:**
- Vertical scale only (Multi-AZ HA);no read replicas in V1
- Storage auto-grow enabled
- Manual review at 70% capacity threshold

---

#### 19.8.20 Cost Anomaly Detection (LOW)

Daily Azure Cost Management alerts. Triggers:
- Day-over-day cost increase >25% on any service
- Week-over-week increase >20% overall
- Single doctor's AI cost >$0.50/day (10x normal)
- Total monthly burn rate trending >$X (configured per stage)

Cost dashboards visible to engineering; weekly cost review meeting starting Month 6.

---

#### 19.8.21 Findings Summary

| Severity | Security | Performance | Total |
|---|---|---|---|
| CRITICAL | 2 (18.8.1, 18.8.2) | 2 (18.8.12, 18.8.13) | 4 |
| HIGH | 4 (18.8.3, 18.8.4, 18.8.5, 18.8.6) | 3 (18.8.14, 18.8.15, 18.8.16) | 7 |
| MEDIUM | 5 (18.8.7-18.8.11) | 5 (18.8.17-18.8.20, plus search at scale) | 10 |
| LOW | 1 (DDoS quantification) | 1 (18.8.20) | 2 |
| **Total** | **12** | **11** | **23** |

**Pre-engineering kickoff requirement:** All 4 CRITICAL items must have committed implementation plan and budget. HIGH items must have target dates within Month 6.

---

## 20. FUTURE PRODUCT OPPORTUNITIES

This section documents product opportunities that are validated and strategically relevant but deliberately deferred beyond V1. They are captured here so they are not lost, and to ensure V1 architectural decisions do not inadvertently block them.

---

### 20.1 Surgical Consent Documentation — Hospital Enterprise Product

**Source:** Direct input from practicing hospital physician, April 2026.

#### The Use Case

In large hospital settings, a surgeon or specialist conducts a pre-surgery consultation with the patient and their family members in a dedicated consultation room. During this conversation the doctor:

- Explains the nature of the procedure in detail
- Describes the risks, complications, and alternatives
- Answers questions from the patient and relatives
- Receives verbal agreement before a consent form is signed

This conversation is one of the most legally sensitive interactions in medicine. Currently, the actual spoken content of this consultation is almost never documented beyond a standard consent form signature. If a dispute arises post-surgery, the hospital has no record of what was actually explained — creating significant medicolegal exposure.

#### The Problem Being Solved

| Stakeholder | Current Pain | Impact |
|---|---|---|
| Hospital legal / risk management | No verbatim or summarised record of what was explained pre-surgery | Malpractice vulnerability; "doctor said, patient said" disputes |
| Surgeon / specialist | No proof that risks were fully communicated | Personal professional liability |
| Patient and family | Cannot recall what was explained after leaving the room | Confusion, distrust, post-surgery anxiety |
| Hospital administration | Consent disputes lead to settlements averaging $300,000-$1M+ | Direct financial and reputational cost |

#### Why This Is a Strong Opportunity

- **Legal protection has a clear dollar value.** Hospitals spend millions annually on malpractice insurance and legal settlements. A documented consent record is a direct risk mitigation investment with a measurable ROI — far easier to sell than a productivity tool.
- **The budget exists.** Hospital risk management and legal departments have dedicated procurement budgets for compliance and liability reduction tools. This is not a discretionary purchase.
- **No good solution exists today.** No established product specifically addresses surgical consent conversation documentation. The space is entirely unserved.
- **One contract equals major revenue.** A single hospital system with 10 consultation rooms signing a $100,000/year enterprise contract equals the revenue of 84 individual doctor subscriptions.

#### How This Differs From ClinRecall V1

| Dimension | ClinRecall V1 | Consent Documentation Product |
|---|---|---|
| Setting | Independent practice clinic | Hospital consultation room |
| Speaker count | 2 (Doctor + Patient) | 3-6 (Doctor + Patient + multiple relatives) |
| Primary purpose | Clinical memory across repeat visits | Legal record of a single pre-surgery conversation |
| Output | Doctor's structured notes | Consent summary + timestamped record of what was explained |
| Buyer | Individual doctor ($99/month self-serve) | Hospital risk management / legal (enterprise contract $50K-$200K/year) |
| Sales cycle | Days (doctor decides immediately) | 6-18 months (procurement committee, IT security review, legal vetting) |
| Compliance bar | HIPAA | HIPAA + potential court-admissible evidence standards |
| Language requirement | English | Multilingual (patients and relatives may not speak English) |
| Integration needed | None for V1 | Hospital EHR, legal records management system |

#### Target Specialties (Highest Priority)

Consent disputes are most common and most costly in high-risk surgical specialties. These are the highest-value entry points:

1. **Oncology** — cancer surgery conversations are complex, emotionally charged, and frequently disputed
2. **Cardiac surgery** — high-risk procedures where informed consent is critically important
3. **Neurosurgery** — outcomes are unpredictable; family disputes post-surgery are common
4. **Orthopaedic surgery** — high volume, elective procedures where patients sometimes claim risks were not communicated

#### Proposed Product Output

The consent documentation product produces two outputs per consultation:

**Output 1 — Consent Summary (structured)**
- Procedure explained: [name and description]
- Risks communicated: [list]
- Alternatives discussed: [list]
- Patient questions asked: [list]
- Patient/family verbal acknowledgement: [yes/no + quote]
- Duration of consultation: [minutes]
- Participants identified: [roles, not names of relatives]

**Output 2 — Timestamped Conversation Record**
- Full speaker-separated transcript available for legal review
- Stored securely, accessible only to authorised hospital personnel
- Retained for the duration required by state law (typically 7-10 years)
- Exportable as a PDF for inclusion in the patient's legal file

#### Multilingual Requirement

A significant proportion of US hospital patients are non-English speakers or have family members who are. This product must support:

- Real-time identification of language spoken per speaker
- Post-consultation translation of the summary into the patient's language
- The original-language recording retained as the legal record

This is a V2 feature of the consent product but must be accounted for in the architecture from the start.

#### Pricing Model (Enterprise)

| Package | Price | What's Included |
|---|---|---|
| Department Pilot | $15,000/year | 1 department, up to 3 consultation rooms, 500 sessions/year |
| Hospital Standard | $60,000/year | Up to 5 departments, unlimited consultation rooms, unlimited sessions |
| Hospital Enterprise | $120,000-$200,000/year | Full hospital system, multilingual support, EHR integration, dedicated support |

#### Prerequisite Conditions Before Pursuing

This opportunity should only be pursued after the following conditions are met:

1. ClinRecall V1 has at least **500 paying independent practice doctors** — establishing product credibility and clinical market trust
2. At least **3 published case studies** from V1 demonstrating accuracy and HIPAA compliance
3. A **US-based enterprise sales hire** or a healthcare enterprise sales partner is in place — hospital procurement cannot be managed remotely from India without a trusted US face
4. **Multilingual diarization** has been validated in a pilot setting
5. A **legal records management advisor** has reviewed the court-admissibility requirements for audio and transcript records in at least 3 US states

#### Strategic Recommendation

**Do not build this in parallel with V1. Build it as a separate product line in Year 2.**

The two products share infrastructure (HIPAA-compliant audio processing, speaker diarization, AI note extraction) and brand trust. V1 is the fastest path to establishing that trust. Once established, the consent documentation product can be introduced to hospital risk management teams with credibility already behind it.

The doctor friend who surfaced this use case is a valuable potential advisor for the consent product. Engage them as an informal advisor now — understand the specific workflow, the key decision-makers in their hospital, and the existing tools (if any) their hospital uses for consent documentation.

---

## 21. ASSUMPTIONS & DEPENDENCIES

### Assumptions

- Independent practice physicians in the USA are willing to pay $99/month for measurable time savings
- AI speaker diarization accuracy is sufficient (>90%) for clinical use when limited to two speakers
- Doctors are comfortable with a browser-based mobile web app; a native app is not required for V1
- The development team in India can engage US pilot doctors remotely with the support of a US-based medical advisor
- Azure HIPAA-eligible services are sufficient for compliance requirements without additional on-premise infrastructure

### Dependencies

| Dependency | Owner | Risk if Delayed |
|---|---|---|
| Microsoft (Azure + Azure OpenAI) BAA signing + Azure OpenAI access approval | Founders | Blocks all PHI data storage and AI processing |
| AI/ML vendor selection (speech-to-text + diarization) | Engineering | Blocks Module 4 development |
| HIPAA compliance advisor engagement | Founders | Blocks launch clearance |
| US medical advisor / pilot doctor recruitment | Founders + GTM | Delays pilot and market feedback |
| Stripe account approval | Founders | Blocks subscription billing |
| US legal entity (Delaware LLC) formation | Founders | Blocks US contracts and billing |

---

## 22. OPEN QUESTIONS

| # | Question | Owner | Priority | Status |
|---|---|---|---|---|
| OQ-1 | Which AI/ML provider to use for speech-to-text and speaker diarization? | Engineering + PM | High | **RESOLVED** → AssemblyAI. Best medical diarization accuracy, HIPAA BAA available. See Section 13.1. |
| OQ-2 | Which LLM to use for note extraction and pre-visit brief generation? | Engineering + PM | High | **RE-RESOLVED (v2.3)** → GPT-4o via Azure OpenAI Service. HIPAA-eligible, ~40% cheaper than alternatives, native Azure integration. See Section 13.1. |
| OQ-3 | Do we need a HIPAA-compliant LLM provider agreement, or can we anonymize before sending to LLM? | Legal + Engineering | High | **RE-RESOLVED (v2.3)** → Sign BAA with Microsoft (covers Azure + Azure OpenAI) and with AssemblyAI directly. Apply for Azure OpenAI access in Week 1 (1-2 week approval). No anonymization required. See Section 13.1. |
| OQ-4 | What is the patient consent flow and how do we make it doctor-proof without adding friction? | PM + Legal | High | **RESOLVED (v2.0)** → State-aware workflow with mandatory checkbox and script. See Section 7 Module 8. |
| OQ-5 | Who is our first US medical advisor, and what is their compensation structure? | Founders | High | **Upgraded** → 3% equity vesting 2 years + $2,000/month retainer. See Section 2.4. |
| OQ-6 | Should we offer an annual pricing option ($79/month billed annually) at launch? | PM + Founders | Medium | **RESOLVED** → Defer annual pricing to Month 9. Only offer after D90 retention confirms >55%. See Section 15.2. |
| OQ-7 | What is our position on doctors exporting data to their EHR manually vs. waiting for integration? | PM | Medium | **RESOLVED (v2.0)** → V1: manual export (copy-paste + PDF). Epic integration planned V3. |
| OQ-8 | How do we handle multi-specialty? A cardiologist's note structure differs from a GP's. | PM | Medium | **RESOLVED (v2.0)** → V1 launches with Family Medicine and Internal Medicine only. One specialty template, well-tested. |
| **OQ-9 (NEW)** | **FDA/SaMD classification — is ClinRecall a medical device under FDA rules?** | **Regulatory + PM** | **CRITICAL** | **Open — Must be resolved before engineering kickoff. Engage FDA consultant in Week 1.** |
| **OQ-10 (NEW)** | **Which professional liability insurance carrier and coverage level?** | **Founders + Legal** | **CRITICAL** | **Open — $2M Professional + $2M Cyber minimum. Quote needed Week 2.** |
| **OQ-11 (NEW)** | **How do we acquire the first 200 signups if initial CAC is higher than projected?** | **PM + Founders** | **High** | **Open — Tie CAC threshold to go/no-go decision; pause acquisition if CAC >$1,000 until channel mix is fixed.** |
| **OQ-12 (NEW)** | **Synthetic medical conversation dataset — how do we build a realistic 500-sample test set without PHI?** | **Engineering + Clinical Reviewer** | **High** | **Open — Options: synthesis via LLM with clinical review, licensed datasets (MIMIC-III), simulated clinical scenarios.** |
| **OQ-13** | **Native mobile app: iOS first, Android first, or simultaneous?** | **PM + Engineering** | **Medium** | **RESOLVED (v2.1)** → React Native single codebase; iOS first to TestFlight at Month 8, Android via same codebase at Month 9-10. See Section 13.6. |
| **OQ-14 (NEW)** | **Seed funding strategy — bootstrap, angel round, or institutional seed?** | **Founders** | **High** | **Open — $750K-$1M target. Prefer angel round led by healthcare-experienced angels.** |
| **OQ-15 (NEW)** | **SOC 2 auditor selection and timeline — who do we engage?** | **Founders + Compliance** | **Medium** | **Open — Common choices: Vanta, Drata, Secureframe (compliance-as-a-service); target Type I by Month 12.** |
| **OQ-16 (NEW)** | **How do we handle a doctor using the product in multiple states (telehealth, traveling)?** | **PM + Legal** | **Medium** | **Open — Default to strictest applicable state's two-party consent; prompt doctor to confirm state at session start.** |
| **OQ-17 (NEW v2.3)** | **Azure OpenAI Service access application — when do we apply and which subscription tier?** | **Founders + Engineering** | **CRITICAL** | **Open — Must apply Week 1 of project. Healthcare/regulated industry track. 1-2 week approval. Without approval, AI pipeline cannot be built.** |
| **OQ-18 (NEW v2.3)** | **TPM/RPM quota strategy — when do we request increases and to what level?** | **Engineering** | **High** | **Open — Default ~30K TPM is insufficient at 500 doctors. File quota increase request Week 4 for 200K+ TPM, 600+ RPM. Re-evaluate at 2,500 doctors.** |

---

*Document End*

**Next Steps (v2.0 — Revised Priority Order):**

**Week 1 — Regulatory & Financial Foundation (Critical):**
1. Engage FDA regulatory consultant for SaMD classification assessment (OQ-9)
2. Engage healthcare specialised legal counsel for ToS + malpractice framework
3. Obtain quotes for $2M Professional Liability + $2M Cyber Liability insurance (OQ-10)
4. Review revised financial model with founders — confirm $750K-$1M funding target

**Weeks 1-2 — Validation Before Commitment:**
5. Build landing page + waitlist
6. Form Delaware LLC via Stripe Atlas or Firstbase
7. Begin US medical advisor search — target 3% equity + retainer (OQ-5)

**Weeks 2-4 — Market Signal:**
8. Conduct 10 doctor interviews via Doximity / LinkedIn — listen, do not pitch
9. Secure 3 pilot doctor Letters of Intent before engineering commitment
10. Draft and test standard patient consent script with pilot doctors

**Weeks 3-4 — Vendor & Compliance:**
11. **Apply for Azure OpenAI Service access (healthcare/regulated industry track) — critical path; 1-2 week approval (OQ-17)**
12. Sign BAAs with AssemblyAI and Microsoft (covering Azure + Azure OpenAI) — resolves OQ-1/2/3
12. Obtain written confirmation of no-training-use from both vendors
13. Engage SOC 2 readiness partner (Vanta, Drata, or Secureframe) — resolves OQ-15

**Pre-Engineering Gate Check (Week 4 — go/no-go decision):**
- FDA classification clear? ✓
- Insurance quotes secured? ✓
- 3 pilot LOIs signed? ✓
- BAAs signed (AssemblyAI + Microsoft)? ✓
- Azure OpenAI Service access approved? ✓
- Team plan funded (9-10 roles)? ✓
- **Section 19.8 CRITICAL items have implementation plan and budget? (SAST/DAST/SCA pipeline, AI security controls, performance SLOs defined, load testing strategy)? ✓**

**If all gate criteria met → Month 1 Engineering Kickoff with revised $582K Year 1 budget.**
**If any gate criterion fails → pause build; address root cause before proceeding.**

---

## 23. PHASED IMPLEMENTATION STRATEGY

This section defines the engineering execution plan: 9 sequential phases from pre-development through Year 1 optimization. Each phase has explicit goals, workstream deliverables, exit criteria, and risk gates.

**Phase Gate Discipline:**
- A phase only completes when every workstream's exit criteria are met
- The next phase does not start until the previous phase exits cleanly
- Exit criteria are demoable, measurable, or verifiable — not opinions

This discipline prevents "we'll fix it later" drift that destroys early-stage products.

---

### 23.1 Implementation Timeline Overview

```
PHASE 0  ─ Pre-Development Prerequisites      Weeks -4 to 0   No code; gates
PHASE 1  ─ Foundation Sprint                  Month 1         Infra, auth shell
PHASE 2  ─ Recording MVP                      Month 2         Capture working
PHASE 3  ─ AI Note Generation                 Month 3         Core value live
PHASE 4  ─ Memory Layer                       Month 4         Differentiator
PHASE 5  ─ Compliance & Hardening             Month 5         Audit-ready
PHASE 6  ─ Closed Pilot                       Month 6         5 doctors, real PHI
PHASE 7  ─ Extended Pilot & Polish            Month 7         15-20 doctors
PHASE 8  ─ Public Launch + Native iOS         Month 8         Paid subscriptions
PHASE 9  ─ Year 1 Optimization                Months 9-12     Native Android, SOC 2, scale
```

---

### 23.2 PHASE 0 — Pre-Development Prerequisites (Weeks -4 to 0)

**Goal:** Resolve every blocker that would halt or invalidate engineering work. No code is written in this phase.

**Pre-requisites:** None (this is the start).

**Workstream Deliverables:**

| Workstream | Deliverable |
|---|---|
| Regulatory | FDA SaMD classification assessment complete; written opinion from regulatory consultant |
| Legal | Delaware LLC formed; ToS drafted with malpractice clauses; Microsoft + AssemblyAI BAAs signed |
| Insurance | $2M Professional Liability + $2M Cyber Liability quotes secured; policies bound |
| Customer | 3 US pilot doctor Letters of Intent signed |
| Vendor Setup | Azure OpenAI Service access application submitted (1-2 wk approval); Auth0 account provisioned; Stripe account created |
| Hiring | 9-10 person team committed (offers signed): 2 Backend, 1 Frontend, 1 AI/ML, 1 DevOps, 1 QA, 1 PM, 1 Senior Product Designer, 1 Clinical Reviewer (PT), 1 CSM (PT, Month 6 start) |
| Tools | GitHub organization, Claude Design workspace, Azure subscription, Datadog/Sentry trial accounts |
| Advisor | US Medical Advisor onboarded (3% equity + retainer) |

**Exit Criteria (Gate to Phase 1):**
- ✅ FDA classification clear or risk acknowledged with mitigation plan
- ✅ Both BAAs signed (Microsoft, AssemblyAI)
- ✅ Insurance bound
- ✅ 3 pilot LOIs signed
- ✅ Azure OpenAI access approved
- ✅ Team committed (signed offers)
- ✅ Funding secured ($750K-$1M seed or founder commitment)

**Key Risks:** FDA classification could disallow planned features → must be resolved before any build. Azure OpenAI approval could be delayed → cannot delay BAA signing while awaiting access decision.

**Team Focus:** Founders + Legal + Regulatory consultant. Engineering team finalizing offers but not yet productive.

---

### 23.3 PHASE 1 — Foundation Sprint (Month 1)

**Goal:** Working infrastructure, CI/CD, authentication, and project skeleton — no user-facing features yet, but a doctor could log in and see an empty dashboard.

**Pre-requisites:** Phase 0 exit criteria met.

**Workstream Deliverables:**

| Workstream | Deliverable |
|---|---|
| Infrastructure | Azure subscription configured; Terraform monorepo structure; East US 2 environment provisioned (VNet, Container Apps, PostgreSQL Flexible Server with pgvector, Blob Storage, Key Vault, Service Bus, Event Grid, Front Door) |
| DevOps | GitHub Actions CI/CD pipeline live; SAST/SCA/secret scanning gates active; Terraform plan/apply automation; Azurite local emulator setup |
| Backend | FastAPI skeleton; SQLAlchemy + Alembic migrations; Pydantic schemas; row-level security policies; auth middleware; `/healthz`/`/readyz` endpoints; OpenAPI auto-gen |
| Authentication | Auth0 integrated; signup/login/MFA flows working; JWT validation; refresh token rotation |
| Database | Initial schema: doctors, patients, sessions, transcripts, extracted_outputs, audit_log; row-level security policies enforced |
| Frontend | React PWA shell with React Router; Auth0 login flow; protected routes; design system foundations from Claude Design (color tokens, typography, components stubs); Storybook setup |
| Design | Claude Design workspace populated with design system; recording screen, pre-visit brief, note review wireframes ratified by US Medical Advisor |
| QA | Test infrastructure: pytest + httpx for backend; Vitest + React Testing Library for frontend; CI runs all tests |
| Compliance | Audit log writes from auth events; WORM Blob policy configured |

**Exit Criteria (Gate to Phase 2):**
- ✅ A doctor can sign up, verify email, complete MFA, log in, see empty dashboard
- ✅ All API endpoints behind authentication; row-level security verified by automated tests
- ✅ Production deploy via PR merge works end-to-end
- ✅ SAST/SCA gates blocking insecure code
- ✅ Audit log capturing all auth events to WORM storage

**Key Risks:** Team unfamiliar with Azure-specific quirks → mitigate with senior DevOps engineer. Auth0 + RLS integration complexity → spike early in Week 1.

**Team Focus:** All-hands on infrastructure and shell. No product features yet.

---

### 23.4 PHASE 2 — Recording MVP (Month 2)

**Goal:** A doctor can create a patient, start a recording session, and have the audio stored securely. No AI yet — just the capture pipeline working end-to-end.

**Pre-requisites:** Phase 1 exit criteria met.

**Workstream Deliverables:**

| Workstream | Deliverable |
|---|---|
| Backend | Patient CRUD endpoints (Module 2); Session start/chunks/complete endpoints (Module 3 partial); SAS URL generation for Blob uploads; consent recording endpoint |
| Frontend (PWA) | Patient list + patient profile screens; "Add Patient" flow; recording screen with live waveform; one-tap session start; consent acknowledgement workflow (state-aware for two-party states) |
| Audio Capture | Browser MediaRecorder integration; chunk-based upload via Service Worker; offline buffering on network drop; resumable upload on reconnect |
| AI Pipeline | AssemblyAI integration tested with synthetic conversation; transcription webhook → backend ingestion; speaker diarization output validated |
| Compliance | Two-party consent rules engine; clinic state detection from doctor profile; consent audit logged |
| QA | Synthetic medical conversation dataset v1 (50 samples) created with Clinical Reviewer; integration tests for full upload pipeline |
| Design | Recording screen polished per design system; live waveform animation; success/error states designed |

**Exit Criteria (Gate to Phase 3):**
- ✅ Doctor records a 20-minute synthetic conversation end-to-end without losing data
- ✅ Audio chunks uploaded directly to Blob Storage via SAS URLs (never through API server)
- ✅ Recording survives network interruption (Service Worker buffers, resumes upload)
- ✅ AssemblyAI returns speaker-diarized transcript within target latency
- ✅ Consent workflow enforced in two-party states (CA, FL, IL, etc.)
- ✅ All recording metadata in audit log

**Key Risks:** Browser audio capture flakiness on iOS Safari → tested early in Week 1; PWA limitations may force native iOS sooner than planned. AssemblyAI webhook delivery in private VNet → use public endpoint with signature verification.

**Team Focus:** Backend + Frontend on recording pipeline; AI/ML on AssemblyAI integration; QA building golden dataset.

---

### 23.5 PHASE 3 — AI Note Generation (Month 3)

**Goal:** A doctor records a session, and within 90 seconds receives an AI-generated structured note that they can review, edit, and sign.

**Pre-requisites:** Phase 2 exit criteria met.

**Workstream Deliverables:**

| Workstream | Deliverable |
|---|---|
| AI Pipeline | Azure OpenAI integration (GPT-4o for note extraction, GPT-4o-mini for lower-stakes); prompt template stored as versioned config; Intelligence Layer abstraction |
| Backend | Async note generation pipeline (Service Bus → Azure Functions → AssemblyAI → Azure OpenAI → DB); note CRUD with versioning; note signing workflow with biometric placeholder; flag-as-inaccurate endpoint |
| Frontend (PWA) | Note review screen with section-by-section structure; inline editing; "source" link to audio timestamp; visible disclaimer until signed; sign-and-save flow |
| MLOps | Golden dataset v2 (200 samples); automated evaluation pipeline; output schema validation; hallucination detection heuristics |
| Compliance | Note signature audit (timestamp + IP + content hash); immutable signed notes; Azure AI Content Safety integration |
| Design | Note review screen polished; trust-through-transparency interactions (source highlighting); error states for generation failure |
| QA | End-to-end test: synthetic conversation → note generated → doctor edits → signs → immutable; regression tests against golden dataset |

**Exit Criteria (Gate to Phase 4):**
- ✅ End-to-end p95 note generation latency ≤90s
- ✅ Generated notes pass schema validation 99%+ of the time
- ✅ Doctor can review, edit, and sign notes via mobile browser without friction
- ✅ Signed notes are immutable; subsequent edits create new versions
- ✅ Output validation rejects content outside schema; max 2 regeneration attempts honored
- ✅ All generated content carries disclaimer until signed

**Key Risks:** GPT-4o latency variability → tested with Premium plan to avoid Function cold starts. Output schema drift across model versions → strict validation + golden dataset regression. Prompt injection from patient speech → sanitization at transcript ingestion.

**Team Focus:** AI/ML lead drives Intelligence Layer; Frontend on note review UX (the trust moment); QA expanding golden dataset.

---

### 23.6 PHASE 4 — Memory Layer (Month 4)

**Goal:** The product's differentiator — pre-visit briefs, semantic search, and longitudinal patient context — works at quality.

**Pre-requisites:** Phase 3 exit criteria met.

**Workstream Deliverables:**

| Workstream | Deliverable |
|---|---|
| AI Pipeline | Pre-visit brief generation pipeline (cross-session context aggregation + GPT-4o-mini); embedding generation for all notes (text-embedding-3-large); pgvector index optimization (HNSW) |
| Backend | `/v1/patients/{id}/pre-visit-brief` endpoint; search endpoints (hybrid pgvector + full-text); patient history endpoints with pagination; follow-up tracking schema |
| Frontend (PWA) | Pre-visit brief card on patient profile (loads <1s); search screen with semantic+keyword results; full patient history view; follow-up indicators |
| Caching | Redis caching for pre-visit briefs (60-min TTL); patient list cache (1-min TTL); cache invalidation on note updates |
| Performance | API SLOs verified for read endpoints (p95 250ms, search p95 800ms); database query plans reviewed; PgBouncer in transaction mode |
| Design | Pre-visit brief design polished — the differentiator; search results presentation (semantic match highlighting) |

**Exit Criteria (Gate to Phase 5):**
- ✅ Pre-visit brief generated for any patient with ≥1 prior session, p95 <1s render
- ✅ Semantic search finds notes about "lumbar strain" when querying "back pain"
- ✅ Cross-session pattern detection working (e.g., "knee pain mentioned in 3 of last 4 visits")
- ✅ All performance SLOs met under simulated load
- ✅ Pre-visit brief content evaluated against golden dataset >90% accuracy

**Key Risks:** pgvector performance at scale unknown — load test with 100K embeddings. Pre-visit brief quality drops if past notes are sparse — handle gracefully ("Limited prior context available").

**Team Focus:** AI/ML on the differentiator; Backend on search performance; Designer ensures pre-visit brief screen wow-factor.

---

### 23.7 PHASE 5 — Compliance & Hardening (Month 5)

**Goal:** The product is audit-ready, secure, billable, and supports the full regulatory and operational scope. Ready to handle real PHI.

**Pre-requisites:** Phase 4 exit criteria met.

**Workstream Deliverables:**

| Workstream | Deliverable |
|---|---|
| Compliance | HIPAA self-audit complete; SOC 2 Type I gap assessment via Vanta/Drata; data retention policies enforced; patient rights workflows (Module 10) |
| Security | Third-party penetration test; remediation of Critical/High findings; cross-tenant isolation tests in CI; secret rotation policies; PHI log scrubbing middleware |
| Subscription/Billing | Stripe integration end-to-end; 60-day trial; subscription lifecycle; webhook handling; invoice generation; cancellation + 90-day data retention |
| Operations | Status page (status.clinrecall.com); incident response runbook; on-call rotation set up; Sentry + Application Insights alerting tuned |
| AI Safety | Guardrails verified — no diagnoses, no medication dosages without doctor verification; prompt template integrity verification; quarterly red-team exercise plan |
| Backend | Subscription endpoints (Module 7); patient rights endpoints (Module 6); admin endpoints with separate scope |
| Frontend | Subscription management screen; trial countdown; payment method update; data export download |

**Exit Criteria (Gate to Phase 6):**
- ✅ Penetration test report shows no Critical/High open findings
- ✅ HIPAA self-audit checklist 100% complete
- ✅ Subscription billing tested end-to-end (signup, charge, cancel, refund)
- ✅ Patient rights workflows demonstrable (export, deletion, correction)
- ✅ Status page live; incident runbooks documented; on-call rotation active
- ✅ Cross-tenant isolation tests passing in CI for every endpoint

**Key Risks:** Penetration test reveals architectural issues → buffer 2 weeks for remediation. SOC 2 readiness assessment may surface gaps requiring back-fill into earlier phases.

**Team Focus:** All hands on hardening; QA expands automation; Security lead drives pen test remediation.

---

### 23.8 PHASE 6 — Closed Pilot (Month 6)

**Goal:** 5 pilot doctors using the product with real patients, generating real PHI, providing weekly feedback. The first time the system handles real production workload.

**Pre-requisites:** Phase 5 exit criteria met. Pilot doctors onboarded with patient consent processes ready.

**Workstream Deliverables:**

| Workstream | Deliverable |
|---|---|
| Customer | 5 pilot doctors fully onboarded (signed, trained, recorded first session); weekly 30-min feedback calls scheduled |
| Operations | 24/7 monitoring active; bug triage process running; daily ops standup; doctor-reported issues tracked in dedicated queue |
| Engineering | Bug fixes from real usage (priority over new features); performance tuning based on production telemetry; AI quality improvements based on flagged notes |
| MLOps | Real production conversations evaluated weekly; prompt template adjustments deployed via feature flags; hallucination rate tracked |
| Design | Usability sessions with all 5 pilot doctors (15-min, biweekly); friction points documented; UX adjustments prioritized |
| Compliance | Real audit logs reviewed weekly for anomalies; first quarterly access review |

**Exit Criteria (Gate to Phase 7):**
- ✅ All 5 pilot doctors actively using product (≥10 sessions/week each)
- ✅ Note quality satisfaction >85% (doctor-reported)
- ✅ No CRITICAL bugs open >24 hours
- ✅ Pilot doctor NPS >40
- ✅ At least 2 pilot doctors say "I don't want to go back to how I worked before"
- ✅ Production stability: 99.9% uptime sustained for 4 consecutive weeks

**Key Risks:** Real PHI surfaces edge cases not covered by synthetic data. Pilot doctors may churn early if onboarding is rough → invest in white-glove onboarding. AI accuracy regression in real-world conditions → tighten MLOps loop.

**Team Focus:** Customer Success + Engineering on stabilization; PM on feedback synthesis; minimal new feature work.

---

### 23.9 PHASE 7 — Extended Pilot & Polish (Month 7)

**Goal:** 15-20 additional doctors onboarded; product polished based on Phase 6 feedback; marketing site live; ready for paid public launch.

**Pre-requisites:** Phase 6 exit criteria met.

**Workstream Deliverables:**

| Workstream | Deliverable |
|---|---|
| Customer | 15-20 additional doctors onboarded (mix of family medicine + internal medicine specialties); cohort retention tracking begun |
| Engineering | Top 10 friction points from Phase 6 resolved; performance optimization at higher concurrency; specialty-specific note templates if Phase 6 surfaces clear specialty differences |
| Marketing | Marketing site live (clinrecall.com); content: how-it-works, security/HIPAA explainer, doctor case studies from Phase 6, pricing page |
| Sales | Outbound to physician communities (Doximity, LinkedIn); referral program design; case study videos with willing pilot doctors |
| Compliance | SOC 2 Type I audit kicked off; bug bounty program private launch (HackerOne) |
| Operations | Customer Success Manager (US-based, part-time) onboarded; support tier 1 process active; help docs published |

**Exit Criteria (Gate to Phase 8):**
- ✅ 20+ doctors active on product
- ✅ Trial-to-paid conversion intent measurable (waitlist of paying customers)
- ✅ All Phase 6 friction points resolved
- ✅ Marketing site complete with 3+ doctor case studies
- ✅ Stripe billing tested at scale (10+ live subscriptions in trial)
- ✅ Native iOS app feature-complete in TestFlight

**Key Risks:** Specialty-specific UX issues (e.g., cardiologist needs differ from family medicine) — V1 stays focused on family medicine + internal medicine, defer others. Marketing claims must be reviewed by legal — no FDA-violating language.

**Team Focus:** Engineering finishing polish; Customer Success scaling onboarding; Founders on marketing and sales pipeline.

---

### 23.10 PHASE 8 — Public Launch + Native iOS (Month 8)

**Goal:** Paid subscriptions open to public; native iOS app live in App Store; product can scale beyond pilot cohort.

**Pre-requisites:** Phase 7 exit criteria met.

**Workstream Deliverables:**

| Workstream | Deliverable |
|---|---|
| Mobile | Native iOS app via React Native + custom Swift audio module submitted to App Store; TestFlight → App Store transition; production-grade audio reliability |
| Marketing | Public launch announcement; press outreach (HIT News, KevinMD, etc.); paid acquisition channels live (Google Search, Doximity ads); referral program live |
| Customer | Self-serve signup flow polished; trial-to-paid funnel measured; cohort retention dashboards live |
| Operations | Customer Success Manager full-time; on-call expanded; SLA monitoring per doctor cohort |
| Compliance | SOC 2 Type I audit in progress (~3 months); bug bounty private program with 5+ active researchers |
| AI/ML | Weekly evaluation cycles institutionalized; doctor feedback loop integrated into prompt iteration |

**Exit Criteria (Gate to Phase 9):**
- ✅ Native iOS app live in App Store with 4+ star rating from initial reviews
- ✅ 50+ paying doctors
- ✅ MRR >$5,000
- ✅ p95 SLOs holding under public traffic
- ✅ Customer-reported critical bugs <2/week
- ✅ Trial-to-paid conversion ≥10% (industry benchmark)

**Key Risks:** App Store review may surface compliance issues (microphone usage, health claims) — submit to TestFlight early in Phase 7 to surface issues. Public traffic exposes scaling issues invisible at pilot scale.

**Team Focus:** Mobile + Marketing dominate; Engineering on scale operations; Customer Success on conversion optimization.

---

### 23.11 PHASE 9 — Year 1 Optimization (Months 9-12)

**Goal:** Scale to 500 paying doctors; achieve SOC 2 Type I; open native Android; close Year 1 with proven unit economics and Series Seed-ready metrics.

**Pre-requisites:** Phase 8 exit criteria met.

**Workstream Deliverables:**

| Workstream | Deliverable |
|---|---|
| Compliance | SOC 2 Type I report achieved; SOC 2 Type II preparation begun |
| Mobile | Native Android app live in Play Store (Month 10) |
| Engineering | Database optimizations (read replicas if needed); auto-scaling tuned; cost-per-doctor monitored monthly; performance regression alerts |
| AI/ML | Multi-specialty prompt templates (initially family medicine; cardiology and orthopedics evaluated based on demand) |
| Customer | Onboarding fully self-serve; in-app help and FAQs; tier 1 support metrics tracked; churn analysis at cohort level |
| Marketing | Content marketing engine running; SEO traction; partnership conversations with state medical associations and specialty societies |
| Funding | Series Seed close ($750K-$1M) with 18+ months runway extended; investor metrics deck up to date |

**Exit Criteria (Year 1 Close):**
- ✅ 500+ paying doctors (or revised target with explanation)
- ✅ MRR >$50,000; ARR >$500K run-rate
- ✅ SOC 2 Type I report received
- ✅ Native iOS + Android both live
- ✅ Doctor NPS >50
- ✅ Monthly churn <2.5%
- ✅ AI cost per doctor <$50/year (under budget)
- ✅ Path to break-even visible (Month 18-24 forecast)

**Key Risks:** CAC may exceed projections — pause aggressive acquisition if CAC >$1,000 until channels optimized. Churn may surface from edge specialties — focus retention work on validated segments.

**Team Focus:** Operational excellence; preparing for Series Seed close; building Year 2 plan.

---

### 23.12 Phase Effort & Team Allocation Summary

| Phase | Duration | Primary Team Focus | Estimated Effort (Person-Weeks) |
|---|---|---|---|
| Phase 0 | 4 weeks | Founders + Legal + Regulatory | 24 (mostly external advisors) |
| Phase 1 | 4 weeks | All-hands infrastructure | 36 (9 FTE × 4 weeks) |
| Phase 2 | 4 weeks | Backend + Frontend + AI/ML | 36 |
| Phase 3 | 4 weeks | AI/ML + Frontend (note review) | 36 |
| Phase 4 | 4 weeks | AI/ML + Backend (search) | 36 |
| Phase 5 | 4 weeks | Compliance + Security + QA | 36 |
| Phase 6 | 4 weeks | Customer Success + Engineering ops | 36 |
| Phase 7 | 4 weeks | Mobile + Marketing + Engineering | 40 (CSM joins) |
| Phase 8 | 4 weeks | Mobile + Marketing + Operations | 40 |
| Phase 9 | 16 weeks | Scale operations + Compliance | 160 |
| **Total Year 1** | **52 weeks** | — | **~480 person-weeks** |

---

### 23.13 Cross-Cutting Engineering Practices (All Phases)

These practices begin in Phase 1 and continue throughout:

| Practice | Cadence |
|---|---|
| Sprint cadence | 2-week sprints, with Phase boundaries aligning to sprint endings |
| Sprint review | End of each sprint, demo to PM + Founders + advisors |
| Code review | Every PR, 2 approvals (1 security reviewer for sensitive areas) |
| Production deploy | Continuous (multiple times daily); requires 2-person approval for production environment |
| Security review | Every PR via SAST/SCA; manual security review for Auth/PHI/Audit changes |
| AI evaluation | Weekly automated golden dataset run; alert on regression |
| Cost review | Weekly engineering cost review starting Phase 6 |
| Customer feedback synthesis | Weekly during pilot phases; biweekly thereafter |
| Retrospective | End of each phase; documented learnings; improvements applied to next phase |

---

### 23.14 Definition of "Done" (Applies to Every Feature)

A feature is not "done" until ALL the following are true:

| Criterion | Requirement |
|---|---|
| Code | Merged to main, code review approved by 2 |
| Tests | Unit tests passing; integration tests passing; relevant E2E test added |
| Security | SAST/SCA passed; sensitive areas have security review |
| Documentation | API documented in OpenAPI; user-facing changes have help doc updated |
| Accessibility | WCAG 2.1 AA verified for any UI changes |
| Performance | No SLO regression in load test |
| Deployment | Deployed to staging, smoke tested; deployed to production with on-call awareness |
| Telemetry | Application Insights events instrumented; dashboard updated if relevant |
| Audit | If touches PHI: audit log entry verified |

This definition exists because "done" is the most over-claimed status in software. Without explicit criteria, work appears finished but isn't.

---

### 23.15 Risk-Driven Phase Adjustments

Phases may need adjustment based on real-world findings. The decision framework:

| Trigger | Response |
|---|---|
| Phase exit criteria slip by >2 weeks | Stop work; root-cause analysis; PM + founders decide whether to descope, extend, or restructure |
| Critical bug in production for >24 hours | All non-critical work stops; 100% on stabilization |
| AI quality drops below 85% | Phase paused for prompt + dataset improvement |
| Pilot doctor churn signals product-market fit issue | Halt scaling; refocus on the smallest unit that works |
| Compliance/regulatory finding | Top priority; can pause feature work for up to 4 weeks if needed |
| Cost per doctor exceeds $200/year | Pause acquisition until unit economics restored |

The goal is not to follow the plan — it's to ship a product doctors love, profitably and compliantly. The plan is a hypothesis to be tested, not a contract to be honored at any cost.

---

### 23.16 What Comes After Phase 9 (Year 2 Outlook)

Year 2 priorities derived from Year 1 phase outcomes — not pre-committed but anticipated:

- **EHR integration** (Epic, Cerner connectors) — Phase 10-11
- **ConsentDoc Phase 2 product** for hospital surgical consent (Section 20.1)
- **SOC 2 Type II** completion
- **Multi-specialty templates** beyond family medicine
- **HITRUST certification** preparation for hospital sales
- **International expansion** (Canada first per Section 19.7)
- **Series A funding** based on validated metrics

These items move into discrete phases as Year 1 data informs prioritization.

---

*This phased strategy is the engineering execution arm of the BRD. Sections 1-22 define the what and why. Section 23 defines the how and when.*

---

*ClinRecall BRD v2.6 — Confidential — April 25, 2026*
*v2.0 — Senior Architect + PM review. v2.1 — React Native + native audio modules. v2.2 — Backend API design. v2.3 — Azure + GPT-4o; 92% gross margin. v2.4 — Section 19.8 Security & Performance Engineering (23 findings). v2.5 — New Section 9 User Experience Design; sections renumbered. v2.6 — New Section 23 Phased Implementation Strategy: 9 sequential phases (Phase 0 Pre-Dev through Phase 9 Year 1 Optimization), workstream deliverables, exit criteria, risk gates, definition-of-done. Engineering execution plan complete.*
