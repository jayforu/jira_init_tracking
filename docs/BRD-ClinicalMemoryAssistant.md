# Business Requirement Document & Business Case
# ClinRecall — AI-Powered Clinical Memory Assistant for Doctors

**Version:** 1.1
**Date:** April 22, 2026
**Author:** Product Management
**Status:** Draft for Review

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
13. [Pricing Strategy](#13-pricing-strategy)
14. [Go-to-Market Strategy](#14-go-to-market-strategy)
15. [Success Metrics](#15-success-metrics)
16. [Delivery Milestones](#16-delivery-milestones)
17. [Assumptions & Dependencies](#17-assumptions--dependencies)
18. [Open Questions](#18-open-questions)

---

## 1. EXECUTIVE SUMMARY

ClinRecall is an AI-powered clinical memory assistant designed for independent practice physicians in the United States. The product records doctor-patient conversations, identifies the doctor's clinical observations, and builds a longitudinal memory layer that surfaces relevant patient context before every future visit.

Unlike existing solutions that focus on documentation and transcription, ClinRecall focuses on **physician recall and continuity of care** — solving the problem of a doctor walking into a visit without adequate context from prior consultations.

The product will be developed in India and sold to the US market, following the proven India-SaaS model. The target go-to-market segment is independent practice physicians — a largely underserved market ignored by enterprise-focused competitors.

**Target Launch:** 6 months from project initiation
**First Revenue Target:** Month 7
**Pricing:** $99/month per physician
**Break-even Target:** 18 months post-launch

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
| Freed AI | Early stage | Independent doctors | Simple note generation | No cross-visit intelligence | $99-149/mo |
| Nabla | European, expanding US | Clinics | Ambient notes | US market secondary focus | ~$149/mo |

#### Competitive Gap — The Opportunity

Every competitor is solving **today's note from today's visit.**

**Nobody is solving the doctor's memory across visits.**

ClinRecall's differentiation is the **pre-visit brief** — a synthesized, intelligent summary delivered to the doctor before each appointment, drawing from all previous visits with that patient. This transforms the product from a documentation tool into a **clinical intelligence layer**.

---

### 2.4 Financial Projections

#### Development Investment (India-Based Team)

| Role | Count | Monthly Cost (INR) | Monthly Cost (USD) |
|---|---|---|---|
| Backend Engineer | 2 | ₹2,40,000 | $2,880 |
| Frontend Engineer | 1 | ₹1,20,000 | $1,440 |
| AI/ML Engineer | 1 | ₹1,60,000 | $1,920 |
| Product Manager | 1 | ₹1,00,000 | $1,200 |
| UI/UX Designer | 1 | ₹80,000 | $960 |
| **Total Team** | **6** | **₹7,00,000** | **$8,400/mo** |

#### One-Time Costs (Year 1)

| Item | Estimated Cost (USD) |
|---|---|
| AWS HIPAA-compliant infrastructure setup | $8,000 |
| HIPAA compliance audit and legal | $12,000 |
| AI/ML model licensing or API costs (6 months) | $15,000 |
| US legal entity setup (Delaware LLC) | $3,000 |
| Design, branding, website | $5,000 |
| US sales advisor (commission-based) | $0 upfront |
| **Total One-Time** | **$43,000** |

#### Total Year 1 Investment

| Category | Cost (USD) |
|---|---|
| Team (12 months) | $100,800 |
| One-time setup costs | $43,000 |
| Ongoing infrastructure (monthly ~$2,000) | $24,000 |
| Marketing and pilot program | $20,000 |
| Contingency (15%) | $28,170 |
| **Total Year 1** | **~$216,000** |

#### Revenue Projections

| Period | Paying Doctors | MRR | ARR |
|---|---|---|---|
| Month 7 (launch) | 10 | $990 | — |
| Month 9 | 50 | $4,950 | — |
| Month 12 (Year 1 end) | 150 | $14,850 | $178,200 |
| Month 18 | 500 | $49,500 | $594,000 |
| Month 24 (Year 2 end) | 1,200 | $118,800 | $1,425,600 |
| Month 36 (Year 3 end) | 3,000 | $297,000 | $3,564,000 |

#### Break-Even Analysis
- Monthly operating cost at scale: ~$35,000 (team + infra + support)
- Break-even: ~354 paying doctors
- At $99/month: **Break-even at Month 16-18**

#### Return on Investment
- Total investment through Month 18: ~$280,000
- ARR at Month 18: $594,000
- **ROI positive by Month 18**
- **3-year cumulative ROI: ~1,200%**

---

### 2.5 Risk Analysis

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| HIPAA non-compliance penalty | Low | Very High | Invest in compliance from Day 1, get formal audit before launch |
| AI accuracy errors in clinical notes | Medium | High | Doctor review step mandatory before saving, no auto-filing |
| Freed AI or competitor copies the pre-visit brief feature | Medium | Medium | Build fast, establish brand loyalty, deepen the memory layer |
| Low adoption — doctors don't change habits | Medium | High | Free 60-day pilot, white-glove onboarding for first 50 doctors |
| Data breach | Low | Very High | AWS HIPAA infra, penetration testing, cyber insurance |
| Difficulty finding first US customers from India | High | Medium | Partner with a US-based medical advisor or angel with physician network |
| AI/LLM API cost spikes | Low | Medium | Evaluate open-source models, negotiate enterprise API pricing early |

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

- Mobile web application (iOS and Android browser-based, no native app)
- Patient profile creation and management
- Ambient audio recording during consultation
- Two-speaker identification (Doctor vs. Patient)
- AI-generated clinical note extraction from doctor's speech
- Doctor review and edit of generated notes
- Patient visit history storage
- Pre-visit brief generation before each appointment
- Keyword and natural language search across patient notes
- HIPAA-compliant data storage and access controls
- Doctor account creation, login, and subscription management
- Basic usage dashboard for the doctor

### 6.2 Out of Scope — Version 1

- Native iOS or Android application
- EHR / EMR integration (Epic, Cerner, AthenaHealth)
- Patient-facing features or portal
- Multi-speaker support beyond two parties (nurse, family member)
- Real-time suggestions during the consultation
- Automated billing or insurance code generation
- Team or clinic-level accounts (multi-doctor practice management)
- API access for third-party integrations
- Offline mode

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

### Module 8: Subscription & Billing

| ID | Requirement | Priority |
|---|---|---|
| FR-8.1 | Doctor can sign up for a 30-day free trial without credit card | Must Have |
| FR-8.2 | Doctor can subscribe at $99/month after trial | Must Have |
| FR-8.3 | Payment processed via Stripe | Must Have |
| FR-8.4 | Doctor can cancel subscription at any time | Must Have |
| FR-8.5 | Doctor receives invoice via email monthly | Must Have |
| FR-8.6 | Data retained for 90 days after cancellation, then deleted | Must Have |
| FR-8.7 | Doctor can download all their data before cancellation | Should Have |

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
| NFR-2.3 | Hosted on HIPAA-eligible AWS infrastructure (US East region) |
| NFR-2.4 | Role-based access control — each doctor sees only their own data |
| NFR-2.5 | Audit logs maintained for all data access events |
| NFR-2.6 | Raw audio deleted within 1 hour of note generation |
| NFR-2.7 | Penetration testing conducted before launch |
| NFR-2.8 | BAA signed with AWS and all sub-processors handling PHI |

### 8.3 Reliability & Availability

| ID | Requirement |
|---|---|
| NFR-3.1 | System uptime: 99.5% (planned maintenance excluded) |
| NFR-3.2 | Automated daily backups of all patient notes |
| NFR-3.3 | Disaster recovery plan with RTO < 4 hours, RPO < 24 hours |

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

### 10.4 State-Level Regulations

- Two-party consent recording laws vary by US state. Product documentation and onboarding must advise doctors to comply with their state's applicable laws.
- Compliance advisement provided; legal responsibility rests with the physician.

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
| Note extraction & Pre-visit brief generation | **Claude API (claude-sonnet-4-6, Anthropic)** | Superior structured output for medical terminology, HIPAA-eligible via AWS Bedrock, strongest reasoning for clinical context |
| Fallback / cost optimisation at scale | AWS Transcribe Medical | Native AWS HIPAA coverage, lower cost for high volume; evaluate after Month 12 |

**On the LLM + HIPAA question (resolves OQ-3):**
You do NOT need to anonymize audio before sending to the LLM if you have a signed Business Associate Agreement (BAA) with the provider. Anthropic offers a HIPAA BAA via AWS Bedrock. AssemblyAI offers a direct BAA. Both remove the architectural complexity of anonymization. Sign BAAs with both vendors before processing any real patient data.

### 12.2 Application Stack

| Layer | Technology | Rationale |
|---|---|---|
| Frontend | **React** (mobile-first, browser-based PWA) | No app store approval delays; works on iOS Safari and Android Chrome; team likely familiar |
| Backend | **Node.js with Express** or **Python with FastAPI** | Both well-known in India engineering market; FastAPI preferred if team has ML background |
| Database | **PostgreSQL on AWS RDS** | HIPAA-eligible, relational structure suits patient/session/note data model, easy to scale |
| Audio Storage (temporary) | **AWS S3 with server-side encryption** | HIPAA-eligible, auto-delete via lifecycle rules after note generation |
| Authentication | **Auth0** or **Supabase Auth** | Do not build authentication from scratch; both support MFA and are HIPAA-eligible |
| Payments & Billing | **Stripe** | Only credible option; supports Indian companies billing US customers |
| Search | **PostgreSQL full-text search (V1)**, migrate to **OpenSearch** at scale | Start simple; full-text search in Postgres is sufficient for first 5,000 doctors |
| Email / Notifications | **AWS SES** | HIPAA-eligible, low cost, reliable |

### 12.3 Infrastructure

| Component | Choice | Rationale |
|---|---|---|
| Cloud Provider | **AWS (US-East-1 primary, US-West-2 backup)** | HIPAA BAA available, most trusted by compliance auditors, widest ecosystem |
| Containerisation | **Docker + AWS ECS** or **AWS Elastic Beanstalk** | ECS for flexibility; Beanstalk if team wants simpler deployments to start |
| CI/CD | **GitHub Actions** | Free for small teams, integrates with all AWS services |
| Monitoring | **AWS CloudWatch + Sentry** | CloudWatch for infra; Sentry for application error tracking |
| Secret management | **AWS Secrets Manager** | Never store credentials in code or environment files |

### 12.4 Development Environment (India Team)

- All developers work with **synthetic / anonymised patient data only** — never real PHI
- Production access is restricted to authorised personnel via AWS IAM roles with MFA
- All code reviewed before merge; no direct pushes to main branch
- Penetration testing by a third-party firm before public launch

---

## 13. PRICING STRATEGY

### 13.1 Pricing Philosophy

Price signals quality. Independent practice physicians already pay $150-400/month for EHR tools, scheduling software, and dictation services. Pricing ClinRecall below $80/month signals that it is a commodity; pricing it above $150/month before brand trust is established creates friction for early adopters.

**The right price for V1 is $99/month.**

### 13.2 Pricing Structure

| Plan | Price | Who It's For | What's Included |
|---|---|---|---|
| Free Trial | $0 for 60 days | All new signups | Full product access, no credit card required |
| Solo Practitioner | **$99/month** | Single doctor | Unlimited sessions, unlimited patients, all features |
| Annual (Phase 2) | $79/month billed annually ($948/year) | Committed users | 20% discount for annual commitment — introduce at Month 9 |
| Clinic Pack (Phase 3) | $249/month | 2-5 doctors in same practice | Shared billing, separate data per doctor — introduce at Month 18 |

### 13.3 Pricing Rationale

- **No per-session or per-patient limits** — usage-based pricing creates anxiety during busy clinic days; doctors stop using the product when they feel they're "spending" per use
- **No credit card for trial** — reduces signup friction; doctors are busy; the barrier to trying must be near zero
- **Annual pricing deferred to Month 9** — only offer annual discounts once retention data confirms D90 > 55%; discounting before then locks in churners at a loss
- **No freemium tier** — a freemium model in a HIPAA-regulated product creates compliance complexity (free users still generate PHI) and trains doctors to expect the product for free

### 13.4 Competitive Pricing Context

| Competitor | Price | ClinRecall Advantage |
|---|---|---|
| Nuance DAX | ~$500+/month | 5x cheaper |
| DeepScribe | ~$300/month | 3x cheaper |
| Freed AI | $99-149/month | At parity — but with longitudinal memory they lack |
| Nabla | ~$149/month | Cheaper, US-focused |

At $99/month, ClinRecall is the most affordable serious solution in the market while remaining profitable given India-based operating costs.

---

## 14. GO-TO-MARKET STRATEGY

### 14.1 The Core Challenge

ClinRecall is built in India and sold to US physicians. The biggest risk is not the product — it is finding the first customers from 12,000 kilometres away in a market that runs on professional trust and word-of-mouth. Every element of the go-to-market strategy is designed to solve this specific constraint.

### 14.2 The Principle: Validate Before You Build

**Do not write production code until market signal is confirmed.**

Before engineering begins, build a landing page describing ClinRecall — what it does, who it's for, and a "Join the Waitlist at $99/month" call to action. This costs 1 week, not 6 months.

**Signal thresholds:**
- 100 unique physician visitors → 15+ waitlist signups = proceed with confidence
- 100 visitors → 0-5 signups = messaging problem, revisit positioning before building
- 100 visitors → 5-15 signups = borderline; conduct 10 doctor interviews before deciding

### 14.3 Phase 1 — Discovery & Validation (Days 1-30)

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

### 14.4 Phase 2 — Three Blocking Decisions (Days 30-60)

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

### 14.5 Phase 3 — Concierge MVP & Pilot (Days 60-90)

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

### 14.6 Phase 4 — Paid Launch & Acquisition (Months 5-9)

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

### 14.7 The 90-Day Priority Order

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

### 14.8 India-to-USA Operational Model

| Challenge | Solution |
|---|---|
| US sales without physical presence | US medical advisor on equity/retainer + commission sales rep |
| Trust and credibility | Doctor case studies, named advisors on website, HIPAA compliance badge prominent |
| Support across timezones | Async-first support (email/chat); doctors are busy during the day and prefer async |
| Payment collection | Stripe supports Indian companies charging US customers in USD |
| Legal contracts | Delaware LLC signs all US customer agreements; India entity handles employment |
| Data never leaves the US | AWS US infrastructure; India team uses VPN to access anonymised dev environment only |

---

## 15. SUCCESS METRICS

### 15.1 Acquisition Metrics

| Metric | Month 3 Target | Month 6 Target | Month 12 Target |
|---|---|---|---|
| Signups (free trial) | 100 | 500 | 2,000 |
| Trial-to-paid conversion rate | — | 25% | 30% |
| Paying doctors | 10 | 125 | 500 |
| Monthly Recurring Revenue | $990 | $12,375 | $49,500 |

### 15.2 Engagement Metrics (Product-Market Fit Signals)

| Metric | Target |
|---|---|
| Sessions recorded per doctor per week | >10 |
| Pre-visit brief viewed before session | >80% of sessions |
| Note review and save rate | >95% (doctor must review every note) |
| D30 retention (still active 30 days after signup) | >70% |
| D90 retention | >55% |

### 15.3 Quality Metrics

| Metric | Target |
|---|---|
| Doctor-reported note accuracy satisfaction | >90% |
| Average note generation time | <3 minutes |
| App uptime | >99.5% |
| Support tickets per 100 active doctors per month | <5 |

### 15.4 North Star Metric

**Weekly Active Recording Doctors (WARD)** — the number of doctors who recorded at least one session in the past 7 days. This metric best captures whether the product has become a genuine part of clinical workflow.

---

## 16. DELIVERY MILESTONES

| Milestone | Target Date | Deliverables |
|---|---|---|
| M0 — Project Kickoff | Month 1, Week 1 | Team assembled, tech stack decided, AWS account set up |
| M1 — Foundation | Month 1, Week 4 | Auth, patient profiles, basic UI shell |
| M2 — Recording MVP | Month 2, Week 4 | Working recording, audio upload, basic speaker separation |
| M3 — AI Note Generation | Month 3, Week 4 | Note extraction live, review and edit flow complete |
| M4 — Memory Layer | Month 4, Week 4 | Visit history, pre-visit brief, search |
| M5 — Compliance & Hardening | Month 5, Week 4 | HIPAA audit, penetration test, BAA flow, subscription billing |
| M6 — Pilot Launch | Month 6, Week 2 | 5 pilot doctors onboarded (free), feedback collected |
| M7 — Public Launch | Month 7, Week 1 | Product publicly available, paid subscriptions open |
| M8 — Iteration 1 | Month 8, Week 4 | Fixes and improvements based on first 50 doctor feedback |

---

## 17. ASSUMPTIONS & DEPENDENCIES

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

## 18. OPEN QUESTIONS

| # | Question | Owner | Priority | Status |
|---|---|---|---|---|
| OQ-1 | Which AI/ML provider to use for speech-to-text and speaker diarization? | Engineering + PM | High | **RESOLVED** → AssemblyAI. Best medical diarization accuracy, HIPAA BAA available. See Section 12.1. |
| OQ-2 | Which LLM to use for note extraction and pre-visit brief generation? | Engineering + PM | High | **RESOLVED** → Claude API (claude-sonnet-4-6) via AWS Bedrock. Superior structured medical output, HIPAA-eligible. See Section 12.1. |
| OQ-3 | Do we need a HIPAA-compliant LLM provider agreement, or can we anonymize before sending to LLM? | Legal + Engineering | High | **RESOLVED** → Sign BAA with Anthropic via AWS Bedrock and with AssemblyAI directly. No anonymization required. See Section 12.1. |
| OQ-4 | What is the patient consent flow and how do we make it doctor-proof without adding friction? | PM + Legal | High | Open |
| OQ-5 | Who is our first US medical advisor, and what is their compensation structure? | Founders | High | Open — Recommendation: 1-2% equity or $500-1,000/month retainer. Recruit within 30 days. See Section 14.4. |
| OQ-6 | Should we offer an annual pricing option ($79/month billed annually) at launch? | PM + Founders | Medium | **RESOLVED** → Defer annual pricing to Month 9. Only offer after D90 retention confirms >55%. See Section 13.2. |
| OQ-7 | What is our position on doctors exporting data to their EHR manually vs. waiting for integration? | PM | Medium | Open — V1 stance: doctors export manually (copy-paste). EHR integration is out of scope for V1. |
| OQ-8 | How do we handle multi-specialty? A cardiologist's note structure differs from a GP's. Do we customize for V1? | PM | Medium | Open — Recommendation: Launch with Family Medicine / Internal Medicine only. One specialty, done well. |

---

*Document End*

**Next Steps:**
1. Review and sign off on business case financials with founders
2. Build landing page + waitlist (Week 1) — validate market signal before engineering starts
3. Conduct 10 doctor interviews via Doximity / LinkedIn (Weeks 2-4) — listen, do not pitch
4. Form Delaware LLC via Stripe Atlas or Firstbase (Week 2)
5. Identify and recruit US medical advisor within 30 days — 1-2% equity or retainer
6. Sign BAAs with AssemblyAI and AWS Bedrock (Week 4) — resolves OQ-1, OQ-2, OQ-3
7. Resolve remaining open questions OQ-4, OQ-7, OQ-8 before engineering starts
8. Begin engineering only after pilot doctor interviews confirm product direction

---

*ClinRecall BRD v1.1 — Confidential — April 22, 2026*
