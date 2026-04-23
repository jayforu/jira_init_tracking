# Business Requirement Document & Business Case
# ClinRecall — AI-Powered Clinical Memory Assistant for Doctors

**Version:** 2.0
**Date:** April 23, 2026
**Author:** Product Management
**Status:** Draft for Review — Post Senior Architect + PM Review

**Revision History:**
- v1.0 (Apr 22, 2026) — Initial BRD
- v1.1 (Apr 22, 2026) — Added Technology Stack, Pricing, Go-to-Market
- v1.2 (Apr 22, 2026) — Added Future Product Opportunities (Surgical Consent)
- v1.3 (Apr 22, 2026) — Added Platform Architecture & Extensibility
- **v2.0 (Apr 23, 2026) — Comprehensive revision after Senior Architect + Senior PM review. Addresses FDA/SaMD, malpractice liability, two-party consent laws, realistic financials (CAC, churn, LTV), architectural hardening (RTO/RPO/uptime), MLOps framework, vendor risk, and 8 new operational sections.**

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
9. [User Stories](#9-user-stories)
10. [Compliance & Regulatory Requirements](#10-compliance--regulatory-requirements)
11. [Data Requirements](#11-data-requirements)
12. [Technology Stack Recommendations](#12-technology-stack-recommendations)
13. [Platform Architecture & Extensibility](#13-platform-architecture--extensibility)
14. [Pricing Strategy](#14-pricing-strategy)
15. [Go-to-Market Strategy](#15-go-to-market-strategy)
16. [Success Metrics](#16-success-metrics)
17. [Delivery Milestones](#17-delivery-milestones)
18. [Operational Excellence & Governance](#18-operational-excellence--governance)
    - 18.1 Support & Operations Plan
    - 18.2 Vendor Risk Management
    - 18.3 Security Framework & Certifications
    - 18.4 Model Governance & MLOps
    - 18.5 Business Continuity & Disaster Recovery
    - 18.6 Patient Rights & Data Governance
    - 18.7 Internationalization Roadmap
19. [Future Product Opportunities](#19-future-product-opportunities)
20. [Assumptions & Dependencies](#20-assumptions--dependencies)
21. [Open Questions](#21-open-questions)

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
| AWS HIPAA-compliant infrastructure setup | $8,000 |
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
| Claude Sonnet 4.6 via Bedrock (extraction) | ~180 avg sessions/year × 15K tokens avg | ~$40 |
| AWS infra (compute + storage + bandwidth) allocated per doctor | — | $24 |
| Email, Auth0, Stripe fees (2.9%) | — | $35 |
| **Total Variable Cost per Doctor/Year** | — | **~$130** |
| **Annual Revenue per Doctor** | $99/mo × 12 | $1,188 |
| **Gross Margin per Doctor** | — | **~89%** |

At 89% gross margin, the business model is sound *provided CAC is controlled*.

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
| **LLM provider uses inputs for training — NEW** | **Low** | **Very High** | Contractual confirmation in writing; AWS Bedrock default is no training use; annual vendor compliance review |
| HIPAA non-compliance penalty | Low | Very High | Invest in compliance from Day 1, get formal audit before launch |
| AI accuracy errors in clinical notes | Medium | High | Doctor review step mandatory before saving, no auto-filing, continuous evaluation framework (see Section 18.4) |
| Freed AI or competitor copies the pre-visit brief feature | High | Medium | 12-18 month execution lead; invest concurrently in dataset, EHR integration, specialty workflows (see Section 2.3 competitive moat analysis) |
| Low adoption — doctors don't change habits | Medium | High | Free 60-day pilot, white-glove onboarding for first 50 doctors, measured via D30/D90 retention |
| Data breach | Low | Very High | AWS HIPAA infra, penetration testing, cyber insurance, SOC 2 Type II by Month 12 |
| Difficulty finding first US customers from India | High | Medium | US medical advisor on 3% equity + retainer; 3 pilot LOIs before build begins |
| AI/LLM API cost spikes | Medium | Medium | Unit economics monitored monthly; evaluate open-source models; enterprise pricing negotiation at 1,000+ doctors |
| **Vendor lock-in on AssemblyAI or Anthropic — NEW** | Medium | High | Layer 2 and Layer 3 abstract vendor-specific APIs; maintain capability to swap vendors within 4 weeks |
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
| NFR-2.3 | Hosted on HIPAA-eligible AWS infrastructure (US-East-1 primary, US-West-2 warm-standby DR) |
| NFR-2.4 | Multi-tenant isolation via row-level security in PostgreSQL — each doctor accesses only their own data, enforced at database layer |
| NFR-2.5 | Audit logs written to AWS S3 with Object Lock (WORM compliance mode), 6-year retention, immutable even to root admin |
| NFR-2.6 | **Raw audio retained for 72 hours encrypted then hard-deleted** (revised from 1 hour — enables reprocessing on failure and short-window re-review) |
| NFR-2.7 | Penetration testing conducted before launch and annually thereafter |
| NFR-2.8 | BAA signed with AWS and all sub-processors handling PHI |
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

## 9. USER STORIES

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

## 10. COMPLIANCE & REGULATORY REQUIREMENTS

### 10.1 HIPAA (Health Insurance Portability and Accountability Act)

ClinRecall handles Protected Health Information (PHI) as defined by HIPAA. The following requirements are mandatory before any US physician can use the product:

| Requirement | Implementation |
|---|---|
| Business Associate Agreement (BAA) | Signed with every doctor at signup and with AWS |
| PHI Encryption at rest | AES-256 on all stored data |
| PHI Encryption in transit | TLS 1.2+ on all API calls |
| Minimum necessary access | Each doctor accesses only their own data |
| Audit controls | All PHI access logged with timestamp and user ID |
| Data disposal | Raw audio deleted within 1 hour; account data deleted 90 days post-cancellation |
| Breach notification | Process established to notify affected doctors within 60 days of discovery |

### 10.2 Informed Consent

While the product is doctor-facing, the underlying recordings involve patients. Requirements:

- Doctor must present and obtain verbal or written patient consent before recording
- Consent workflow guidance provided to doctor during onboarding
- Consent acknowledgement checkbox in session start flow
- Product does not manage patient consent directly — this remains the doctor's professional responsibility

### 10.3 Data Residency

- All PHI stored exclusively on AWS US-East (N. Virginia) and AWS US-West (Oregon) for redundancy
- No PHI transferred to servers outside the United States
- Development team in India accesses only anonymized or synthetic test data

### 10.4 State-Level Regulations — Expanded

**Two-party consent is a product-enforced workflow in V1, not a disclaimer.**

Eleven US states require all parties to a conversation to consent to its recording. These states are:
**California, Florida, Illinois, Maryland, Massachusetts, Montana, New Hampshire, Pennsylvania, Washington, Connecticut, Michigan.**

Product-level requirements (see FR-8.1 through FR-8.8 in Section 7):
- System detects the doctor's state based on clinic address
- In two-party states, the recording button is disabled until patient consent is explicitly confirmed
- Consent acknowledgement is stored with the session record for audit purposes
- Doctors in any state receive a standard consent script to use with patients

This is not optional and is not a doctor's burden to manage manually.

### 10.5 FDA / Software as a Medical Device (SaMD) — NEW in v2.0

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

### 10.6 Malpractice Liability Framework — NEW in v2.0

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

### 10.7 Additional Regulatory Considerations — NEW in v2.0

- **Section 1557 of ACA** — non-discrimination in healthcare software; UI must be accessible (WCAG 2.1 AA) and not exclude protected classes
- **State-level health tech regulations** — California (CCPA/CPRA, CMIA), New York (SHIELD Act) may impose stricter requirements
- **International data transfer** — India team access to any PHI (even in aggregated form) requires careful contractual and technical controls; default is zero access

---

## 11. DATA REQUIREMENTS

### 11.1 Data Entities

| Entity | Key Fields | Retention |
|---|---|---|
| Doctor Account | ID, name, email, specialty, clinic, subscription status | Duration of account + 90 days |
| Patient Profile | ID, first name, last name, DOB, gender, MRN (optional) | Duration of doctor account |
| Session | ID, patient ID, doctor ID, date, duration, status | Duration of doctor account |
| Clinical Note | ID, session ID, sections (concern, observation, assessment, plan, follow-up), version, timestamp | Duration of doctor account |
| Pre-Visit Brief | Generated at query time from notes — not stored separately | Not persisted |
| Audit Log | User ID, action, resource, timestamp, IP address | 6 years (HIPAA requirement) |

### 11.2 Data the Product Does NOT Store

- Raw audio after note generation is complete
- Full transcripts of patient speech
- Any patient-identifiable data beyond what the doctor explicitly enters in the profile

### 11.3 Data Ownership

- All patient data belongs to the doctor
- ClinRecall does not sell, share, or use patient data for any purpose other than delivering the service
- AI model training does not use any customer data without explicit, separate consent

---

## 12. TECHNOLOGY STACK RECOMMENDATIONS

Keeping the technology boring and proven is a deliberate choice. The competitive advantage of ClinRecall is the product experience and the clinical memory layer — not a novel tech stack. Every component below is selected for reliability, HIPAA eligibility, and speed of development from an India-based team.

### 12.1 AI & Machine Learning Layer

| Function | Recommended Vendor | Rationale |
|---|---|---|
| Speech-to-text + Speaker Diarization | **AssemblyAI** | Best-in-class medical diarization accuracy, dedicated healthcare tier, HIPAA BAA available, straightforward API |
| Note extraction & Pre-visit brief generation | **Claude API (claude-sonnet-4-6) via AWS Bedrock** | Superior structured output for medical terminology, HIPAA-eligible via Bedrock, strongest reasoning for clinical context, contractual no-training default |
| Semantic embeddings for search | **AWS Bedrock Titan Embeddings** | HIPAA-eligible, cost-effective, integrates with pgvector |
| Fallback / cost optimisation at scale | AWS Transcribe Medical | Native AWS HIPAA coverage, lower cost for high volume; evaluate after Month 12 |

**Vendor Contract Requirements (Non-Negotiable):**

Before any real PHI is processed:
1. **Signed BAA** with AssemblyAI (direct) and AWS (covering Bedrock/Anthropic inference)
2. **Written confirmation** that no inputs are used for model training, fine-tuning, retention beyond inference, or model improvement
3. **Data residency confirmation** that all inference occurs in US AWS regions
4. **Incident notification SLA** — vendor must notify of any security incident within 24 hours
5. **Right to audit** — contractual right to review vendor's security practices annually

**Abstraction Requirement (to prevent vendor lock-in):**

Layer 2 (Processing Engine) and Layer 3 (Intelligence Module) must abstract vendor-specific APIs behind an internal interface. A vendor swap must be achievable within 4 weeks — never longer.

### 12.2 Application Stack — Revised

| Layer | Technology | Rationale |
|---|---|---|
| Frontend | **React + PWA (Progressive Web App) with Service Workers** | Installable from browser, offline-capable reads, survives tab/network interruptions during recording; native iOS app planned Month 8 |
| Backend | **Python with FastAPI** (preferred) | Strong ML ecosystem, mature async support; Node.js acceptable if team strongly prefers |
| Database | **PostgreSQL on AWS RDS Multi-AZ with pgvector extension** | HIPAA-eligible; pgvector enables semantic + full-text hybrid search from Day 1 (no OpenSearch migration needed until 50K+ doctors) |
| Audio Storage (temporary) | **AWS S3 with server-side encryption + Object Lock** | HIPAA-eligible, 72-hour lifecycle rule, WORM-enforced for audit |
| Authentication | **Auth0** (preferred) | Built-in MFA, HIPAA-eligible, session management, faster than building in-house |
| Payments & Billing | **Stripe** | Only credible option; supports Indian companies billing US customers in USD |
| Search | **Hybrid: pgvector (semantic) + PostgreSQL full-text (keyword)** | Semantic search from Day 1 — a doctor typing "knee pain" finds notes about "patellar discomfort"; this is a key differentiator |
| Email / Notifications | **AWS SES** | HIPAA-eligible, low cost, reliable |
| **Event Bus (NEW)** | **AWS EventBridge** | Serverless, HIPAA-eligible, low operational burden; foundation for Layer 6 integrations from Day 1 |
| **Background Jobs (NEW)** | **AWS SQS + Lambda** | For audio upload processing, note generation pipeline, async operations |

### 12.3 Infrastructure — Revised

| Component | Choice | Rationale |
|---|---|---|
| Cloud Provider | **AWS (US-East-1 primary, US-West-2 warm-standby DR)** | HIPAA BAA available, most trusted by compliance auditors; clearly stated as active-passive DR, not active-active |
| Containerisation | **Docker + AWS ECS Fargate** | Serverless container orchestration; minimal ops overhead for small team |
| CI/CD | **GitHub Actions** | Free for small teams, integrates with all AWS services; every deploy requires passing security scan and tests |
| Monitoring | **AWS CloudWatch + Sentry + Datadog (Month 6+)** | CloudWatch for infra; Sentry for application errors; Datadog for distributed tracing once scale warrants |
| Observability | **OpenTelemetry tracing across all services (NEW)** | Critical for debugging multi-vendor AI pipeline; traces sensitive data must be scrubbed |
| Secret management | **AWS Secrets Manager** | Never store credentials in code or environment files |
| Infrastructure as Code | **Terraform** | All AWS resources defined as code; enables reproducible environments and audit trails |
| Network Security | **AWS VPC with private subnets, security groups, AWS WAF on public endpoints** | Defense in depth; no direct internet exposure of PHI-handling services |

### 12.4 Development Environment (India Team)

- All developers work with **synthetic / anonymised patient data only** — never real PHI
- Production access is restricted to authorised personnel via AWS IAM roles with MFA; all production access is logged and reviewed monthly
- All code reviewed before merge; no direct pushes to main branch; security linters enforced in CI
- Penetration testing by a third-party firm before public launch and annually
- Synthetic medical conversation dataset (500+ labelled samples) maintained for development and testing — built in collaboration with US medical advisor

### 12.5 MLOps & AI Quality Framework — NEW in v2.0

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
- When a new model version is introduced (e.g., Claude Sonnet 4.6 → 4.7), migration runs on the golden dataset first
- No auto-upgrade in production until regression testing confirms no quality loss
- Rollback capability to prior model version within 1 hour if issue detected

#### Prompt Template Governance
- All Intelligence Layer prompts stored in version-controlled configuration (not code)
- Every prompt change requires PM approval + QA evaluation pipeline pass
- Deployed with feature flag — can be reverted per doctor cohort without redeployment
- Monthly prompt review meeting: top 10 flagged notes + pattern analysis

---

## 13. PLATFORM ARCHITECTURE & EXTENSIBILITY

### 13.1 Platform Philosophy

ClinRecall V1 is a product. But the architecture underneath it must be a platform.

Every use case we will ever build — clinical notes, surgical consent documentation, sales coaching, interview transcription — shares the same underlying pipeline:

```
Record Audio → Separate Speakers → Understand Context → Extract Intelligence → Store Securely → Present Output
```

What changes between use cases is not the pipeline. What changes is who is in the room, what to extract, and how to present it. If those variable parts are designed as pluggable modules from Day 1, adding a new use case means configuring a module — not rebuilding the system.

This section defines the six-layer platform architecture, the rules for keeping layers decoupled, and the V1 decisions that must be made correctly now to prevent expensive rework later.

---

### 13.2 The Six Platform Layers

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

### 13.3 How Use Cases Plug In

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

### 13.4 Use Case Expansion Roadmap

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

### 13.5 V1 Architectural Decisions That Must Be Made Correctly Now

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

### 13.6 What This Architecture Enables Commercially

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

## 14. PRICING STRATEGY

### 14.1 Pricing Philosophy

Price signals quality. Independent practice physicians already pay $150-400/month for EHR tools, scheduling software, and dictation services. Pricing ClinRecall below $80/month signals that it is a commodity; pricing it above $150/month before brand trust is established creates friction for early adopters.

**The right price for V1 is $99/month.**

### 14.2 Pricing Structure

| Plan | Price | Who It's For | What's Included |
|---|---|---|---|
| Free Trial | $0 for 60 days | All new signups | Full product access, no credit card required |
| Solo Practitioner | **$99/month** | Single doctor | Unlimited sessions, unlimited patients, all features |
| Annual (Phase 2) | $79/month billed annually ($948/year) | Committed users | 20% discount for annual commitment — introduce at Month 9 |
| Clinic Pack (Phase 3) | $249/month | 2-5 doctors in same practice | Shared billing, separate data per doctor — introduce at Month 18 |

### 14.3 Pricing Rationale

- **No per-session or per-patient limits** — usage-based pricing creates anxiety during busy clinic days; doctors stop using the product when they feel they're "spending" per use
- **No credit card for trial** — reduces signup friction; doctors are busy; the barrier to trying must be near zero
- **Annual pricing deferred to Month 9** — only offer annual discounts once retention data confirms D90 > 55%; discounting before then locks in churners at a loss
- **No freemium tier** — a freemium model in a HIPAA-regulated product creates compliance complexity (free users still generate PHI) and trains doctors to expect the product for free

### 14.4 Competitive Pricing Context

| Competitor | Price | ClinRecall Advantage |
|---|---|---|
| Nuance DAX | ~$500+/month | 5x cheaper |
| DeepScribe | ~$300/month | 3x cheaper |
| Freed AI | $99-149/month | At parity — but with longitudinal memory they lack |
| Nabla | ~$149/month | Cheaper, US-focused |

At $99/month, ClinRecall is the most affordable serious solution in the market while remaining profitable given India-based operating costs.

---

## 15. GO-TO-MARKET STRATEGY

### 15.1 The Core Challenge

ClinRecall is built in India and sold to US physicians. The biggest risk is not the product — it is finding the first customers from 12,000 kilometres away in a market that runs on professional trust and word-of-mouth. Every element of the go-to-market strategy is designed to solve this specific constraint.

### 15.2 The Principle: Validate Before You Build

**Do not write production code until market signal is confirmed.**

Before engineering begins, build a landing page describing ClinRecall — what it does, who it's for, and a "Join the Waitlist at $99/month" call to action. This costs 1 week, not 6 months.

**Signal thresholds:**
- 100 unique physician visitors → 15+ waitlist signups = proceed with confidence
- 100 visitors → 0-5 signups = messaging problem, revisit positioning before building
- 100 visitors → 5-15 signups = borderline; conduct 10 doctor interviews before deciding

### 15.3 Phase 1 — Discovery & Validation (Days 1-30)

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

### 15.4 Phase 2 — Three Blocking Decisions (Days 30-60)

These decisions must be made before engineering starts. Getting them wrong mid-build is expensive.

| Decision | Recommendation | Action |
|---|---|---|
| AI Stack | AssemblyAI + Claude via AWS Bedrock | Sign BAAs with both; get sandbox API keys |
| US Legal Entity | Delaware LLC | Use Stripe Atlas or Firstbase; takes 2 weeks, costs ~$500 |
| US Medical Advisor | 1 physician with independent practice network | Offer 1-2% equity or $500-1,000/month retainer; recruit within 30 days |

**On the US Medical Advisor:** This is not optional. They provide:
- Credibility ("Dr. Smith from Boston uses this") that no marketing can replicate
- First pilot doctor recruits from their personal network
- Compliance sanity checks from a clinical perspective
- Ongoing feedback on whether the product actually fits physician workflow

### 15.5 Phase 3 — Concierge MVP & Pilot (Days 60-90)

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

### 15.6 Phase 4 — Paid Launch & Acquisition (Months 5-9)

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

### 15.7 The 90-Day Priority Order

| Priority | Action | Timeline | Owner |
|---|---|---|---|
| 1 | Build landing page + waitlist | Week 1 | Founder + Designer |
| 2 | Talk to 10 US doctors — listen, don't pitch | Weeks 2-4 | Founder |
| 3 | Form Delaware LLC | Week 2 | Founder |
| 4 | Find and onboard US medical advisor | Weeks 2-6 | Founder |
| 5 | Sign AssemblyAI BAA + AWS Bedrock BAA | Week 4 | Founder + Legal |
| 6 | Build concierge MVP | Months 2-3 | Engineering |
| 7 | Onboard 5 pilot doctors (free) | Month 3 | Founder + Medical Advisor |
| 8 | Collect weekly feedback, iterate | Month 4 | PM + Engineering |
| 9 | Open paid subscriptions at $99/month | Month 5-6 | Founder |

### 15.8 India-to-USA Operational Model

| Challenge | Solution |
|---|---|
| US sales without physical presence | US medical advisor on equity/retainer + commission sales rep |
| Trust and credibility | Doctor case studies, named advisors on website, HIPAA compliance badge prominent |
| Support across timezones | Async-first support (email/chat); doctors are busy during the day and prefer async |
| Payment collection | Stripe supports Indian companies charging US customers in USD |
| Legal contracts | Delaware LLC signs all US customer agreements; India entity handles employment |
| Data never leaves the US | AWS US infrastructure; India team uses VPN to access anonymised dev environment only |

---

## 16. SUCCESS METRICS

### 16.1 Acquisition Metrics — Revised to Realistic Targets

| Metric | Month 3 Target | Month 6 Target | Month 12 Target |
|---|---|---|---|
| Signups (free trial) | 50 | 250 | 800 |
| Trial-to-paid conversion rate | — | 10% | 12% |
| Paying doctors (net of churn) | 5 | 24 | 72 |
| Monthly Recurring Revenue | $495 | $2,376 | $7,128 |

> Targets revised from v1.x — conversion rate reduced from 25-30% (unrealistic) to 10-12% (industry benchmark).

### 16.2 Engagement Metrics (Product-Market Fit Signals)

| Metric | Target |
|---|---|
| Sessions recorded per doctor per week | >10 |
| Pre-visit brief viewed before session | >80% of sessions |
| Note review and save rate | >95% (doctor must review every note) |
| D30 retention (still active 30 days after signup) | >70% |
| D90 retention | >55% |

### 16.3 Quality Metrics

| Metric | Target |
|---|---|
| Doctor-reported note accuracy satisfaction | >90% |
| Average note generation time | <3 minutes |
| App uptime | >99.5% |
| Support tickets per 100 active doctors per month | <5 |

### 16.4 Business Health Metrics — NEW in v2.0

| Metric | Target | Trigger for Concern |
|---|---|---|
| Customer Acquisition Cost (CAC), blended | <$800 | >$1,000 |
| Monthly Churn Rate | <2.5% Months 1-12; <1.8% Months 13+ | >3% |
| LTV / CAC Ratio | >3.0 | <2.0 |
| CAC Payback Period | <12 months | >18 months |
| Gross Margin per Doctor | >85% | <75% |
| AI Unit Cost per Active Doctor per Year | <$140 | >$200 |
| Net Revenue Retention (Month 12+) | >100% | <90% |

### 16.5 North Star Metric

**Weekly Active Recording Doctors (WARD)** — the number of doctors who recorded at least one session in the past 7 days. This metric best captures whether the product has become a genuine part of clinical workflow.

---

## 17. DELIVERY MILESTONES

| Milestone | Target Date | Deliverables |
|---|---|---|
| **M-1 — Pre-Build Validation (NEW)** | Month 0 | Landing page live, 10+ doctor interviews complete, 3 pilot LOIs signed, FDA/SaMD assessment complete, BAAs signed |
| M0 — Project Kickoff | Month 1, Week 1 | Team assembled (9-10 people), tech stack decided, AWS HIPAA account set up, Terraform foundation |
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

## 18. OPERATIONAL EXCELLENCE & GOVERNANCE

This section was added in v2.0 to address gaps identified in senior review. It covers operational domains that are often deferred but are critical to a credible enterprise-grade healthcare product.

---

### 18.1 Support & Operations Plan

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

### 18.2 Vendor Risk Management

Critical dependencies and mitigations:

| Vendor | Risk | Mitigation |
|---|---|---|
| AssemblyAI | Pricing change, acquisition, outage, accuracy regression | Layer 2 vendor abstraction; evaluate Deepgram and AWS Transcribe Medical as backups; track monthly error rates |
| Anthropic / AWS Bedrock | Model deprecation, pricing spike, training data policy change | Layer 3 LLM abstraction; maintain readiness to swap to GPT-4 or Google Med-PaLM; contractual notice requirements |
| AWS | Service outage, region failure, pricing change | Multi-AZ deployment, documented DR plan, warm-standby in US-West-2 |
| Auth0 | Breach, acquisition, pricing | Documented migration path to AWS Cognito or Supabase Auth |
| Stripe | Account freeze, fraud issue | Backup payment processor (Adyen or Paddle) pre-evaluated |

**Quarterly Vendor Review:**
- Performance against SLA
- Invoice accuracy
- Compliance posture (BAA still active, SOC 2 report current)
- Pricing trends
- Roadmap alignment with ours

**Concentration Risk Rule:** No single vendor should represent >40% of variable cost without a documented alternative.

---

### 18.3 Security Framework & Certifications

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

### 18.4 Model Governance & MLOps

Extends Section 12.5 with governance-specific practices.

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

### 18.5 Business Continuity & Disaster Recovery

**Disaster Scenarios and Responses:**

| Scenario | Probability | Impact | Response |
|---|---|---|---|
| AWS US-East-1 region outage (>4 hours) | Low | High | Failover to US-West-2 warm-standby; RTO 1 hour |
| Founder unavailability (health, personal emergency) | Low | Very High | Documented runbooks; secondary authorised operator; 30-day operational handoff plan |
| India office loses power/internet for >48 hours | Medium | Medium | Remote work arrangements; AWS Cloud9 / Gitpod for development; no production access required from India |
| Key engineer departure | Medium | High | No single-person knowledge dependency; all critical systems documented; minimum 2 engineers per critical system |
| AssemblyAI 48+ hour outage | Low | High | Temporary fallback to AWS Transcribe Medical (lower quality but available); proactive doctor communication |
| Data corruption event | Very Low | Very High | Point-in-time recovery from continuous backups; forensic analysis; doctor communication |
| Cyberattack / ransomware | Low | Very High | Immutable WORM backups unaffected by ransomware; incident response plan; cyber insurance |

**BCP Testing:**
- Tabletop exercise twice yearly
- Actual DR failover test annually (in maintenance window)
- Post-exercise report with action items

---

### 18.6 Patient Rights & Data Governance

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
- Production PHI storage: US AWS regions only
- India development environment: synthetic data only, verified quarterly

---

### 18.7 Internationalization Roadmap

V1 is US-only. Future international expansion is planned but deliberately deferred until US market is validated.

| Phase | Target Geographies | Regulatory Framework | Timing |
|---|---|---|---|
| Phase 1 | USA | HIPAA | V1 |
| Phase 2 | Canada | PIPEDA + provincial health laws | Year 2-3 |
| Phase 3 | UK | GDPR + UK DPA + NHS IG | Year 3-4 |
| Phase 4 | Australia | Privacy Act 1988 + My Health Records Act | Year 3-4 |
| Phase 5 | EU | GDPR + MDR (Medical Device Regulation) | Year 4-5 |

**Architectural Implications (V1):**
- Storage Layer must support multiple data residency regions (implementable via AWS multi-region with region-based routing)
- Intelligence Module must support multilingual extraction (English, French, Spanish likely priority)
- Capture Layer must handle regional language/accent variations
- All regulatory framework handlers (HIPAA, GDPR, etc.) pluggable per region

These are architectural considerations for V1 design, not features. Getting them right now costs little; retrofitting costs significantly.

---

## 19. FUTURE PRODUCT OPPORTUNITIES

This section documents product opportunities that are validated and strategically relevant but deliberately deferred beyond V1. They are captured here so they are not lost, and to ensure V1 architectural decisions do not inadvertently block them.

---

### 17.1 Surgical Consent Documentation — Hospital Enterprise Product

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

## 20. ASSUMPTIONS & DEPENDENCIES

### Assumptions

- Independent practice physicians in the USA are willing to pay $99/month for measurable time savings
- AI speaker diarization accuracy is sufficient (>90%) for clinical use when limited to two speakers
- Doctors are comfortable with a browser-based mobile web app; a native app is not required for V1
- The development team in India can engage US pilot doctors remotely with the support of a US-based medical advisor
- AWS HIPAA-eligible services are sufficient for compliance requirements without additional on-premise infrastructure

### Dependencies

| Dependency | Owner | Risk if Delayed |
|---|---|---|
| AWS HIPAA BAA signing | Founders | Blocks all PHI data storage |
| AI/ML vendor selection (speech-to-text + diarization) | Engineering | Blocks Module 4 development |
| HIPAA compliance advisor engagement | Founders | Blocks launch clearance |
| US medical advisor / pilot doctor recruitment | Founders + GTM | Delays pilot and market feedback |
| Stripe account approval | Founders | Blocks subscription billing |
| US legal entity (Delaware LLC) formation | Founders | Blocks US contracts and billing |

---

## 21. OPEN QUESTIONS

| # | Question | Owner | Priority | Status |
|---|---|---|---|---|
| OQ-1 | Which AI/ML provider to use for speech-to-text and speaker diarization? | Engineering + PM | High | **RESOLVED** → AssemblyAI. Best medical diarization accuracy, HIPAA BAA available. See Section 12.1. |
| OQ-2 | Which LLM to use for note extraction and pre-visit brief generation? | Engineering + PM | High | **RESOLVED** → Claude Sonnet 4.6 via AWS Bedrock. Superior structured medical output, HIPAA-eligible. See Section 12.1. |
| OQ-3 | Do we need a HIPAA-compliant LLM provider agreement, or can we anonymize before sending to LLM? | Legal + Engineering | High | **RESOLVED** → Sign BAA with Anthropic via AWS Bedrock and with AssemblyAI directly. No anonymization required. See Section 12.1. |
| OQ-4 | What is the patient consent flow and how do we make it doctor-proof without adding friction? | PM + Legal | High | **RESOLVED (v2.0)** → State-aware workflow with mandatory checkbox and script. See Section 7 Module 8. |
| OQ-5 | Who is our first US medical advisor, and what is their compensation structure? | Founders | High | **Upgraded** → 3% equity vesting 2 years + $2,000/month retainer. See Section 2.4. |
| OQ-6 | Should we offer an annual pricing option ($79/month billed annually) at launch? | PM + Founders | Medium | **RESOLVED** → Defer annual pricing to Month 9. Only offer after D90 retention confirms >55%. See Section 14.2. |
| OQ-7 | What is our position on doctors exporting data to their EHR manually vs. waiting for integration? | PM | Medium | **RESOLVED (v2.0)** → V1: manual export (copy-paste + PDF). Epic integration planned V3. |
| OQ-8 | How do we handle multi-specialty? A cardiologist's note structure differs from a GP's. | PM | Medium | **RESOLVED (v2.0)** → V1 launches with Family Medicine and Internal Medicine only. One specialty template, well-tested. |
| **OQ-9 (NEW)** | **FDA/SaMD classification — is ClinRecall a medical device under FDA rules?** | **Regulatory + PM** | **CRITICAL** | **Open — Must be resolved before engineering kickoff. Engage FDA consultant in Week 1.** |
| **OQ-10 (NEW)** | **Which professional liability insurance carrier and coverage level?** | **Founders + Legal** | **CRITICAL** | **Open — $2M Professional + $2M Cyber minimum. Quote needed Week 2.** |
| **OQ-11 (NEW)** | **How do we acquire the first 200 signups if initial CAC is higher than projected?** | **PM + Founders** | **High** | **Open — Tie CAC threshold to go/no-go decision; pause acquisition if CAC >$1,000 until channel mix is fixed.** |
| **OQ-12 (NEW)** | **Synthetic medical conversation dataset — how do we build a realistic 500-sample test set without PHI?** | **Engineering + Clinical Reviewer** | **High** | **Open — Options: synthesis via LLM with clinical review, licensed datasets (MIMIC-III), simulated clinical scenarios.** |
| **OQ-13 (NEW)** | **Native mobile app: iOS first, Android first, or simultaneous?** | **PM + Engineering** | **Medium** | **Open — iOS first preferred; US physician device usage skews iPhone. Android by Month 10.** |
| **OQ-14 (NEW)** | **Seed funding strategy — bootstrap, angel round, or institutional seed?** | **Founders** | **High** | **Open — $750K-$1M target. Prefer angel round led by healthcare-experienced angels.** |
| **OQ-15 (NEW)** | **SOC 2 auditor selection and timeline — who do we engage?** | **Founders + Compliance** | **Medium** | **Open — Common choices: Vanta, Drata, Secureframe (compliance-as-a-service); target Type I by Month 12.** |
| **OQ-16 (NEW)** | **How do we handle a doctor using the product in multiple states (telehealth, traveling)?** | **PM + Legal** | **Medium** | **Open — Default to strictest applicable state's two-party consent; prompt doctor to confirm state at session start.** |

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
11. Sign BAAs with AssemblyAI and AWS (covering Bedrock) — resolves OQ-1/2/3
12. Obtain written confirmation of no-training-use from both vendors
13. Engage SOC 2 readiness partner (Vanta, Drata, or Secureframe) — resolves OQ-15

**Pre-Engineering Gate Check (Week 4 — go/no-go decision):**
- FDA classification clear? ✓
- Insurance quotes secured? ✓
- 3 pilot LOIs signed? ✓
- BAAs signed? ✓
- Team plan funded (9-10 roles)? ✓

**If all gate criteria met → Month 1 Engineering Kickoff with revised $582K Year 1 budget.**
**If any gate criterion fails → pause build; address root cause before proceeding.**

---

*ClinRecall BRD v2.0 — Confidential — April 23, 2026*
*This document reflects comprehensive senior Architect + PM review findings. Major revisions in v2.0 include: realistic financial model with CAC/churn/LTV, FDA/SaMD assessment requirement, malpractice liability framework, two-party consent enforcement, architectural hardening (RTO/RPO/uptime/DR), MLOps and model governance framework, SOC 2 roadmap, vendor risk management, business continuity plan, and patient rights workflows.*
