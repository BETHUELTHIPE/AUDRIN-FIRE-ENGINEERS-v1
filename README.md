# AUDRIN-FIRE-ENGINEERS-v1

**AUDRIN FIRE ENGINEERS (PTY) LTD**
*Commercial & Non-Domestic Fire-Detection and Alarm Service Management Platform Aligned with SANS 10139 & SANS 10400-T*

---

## 🚒 Executive Overview

**Audrin Fire Engineers v1** is an enterprise fire engineering and statutory compliance platform designed for registered SAQCC Fire Commissioners, Lead Engineers, and Facility Risk Managers. The platform digitizes compliance workflows under **SANS 10139:2021** (*Fire detection and alarm systems for buildings — System design, installation and servicing*) and **SANS 10400-T:2011** (*National Building Regulations — Fire protection*).

---

## 🌟 Key Platform Features

- **Centralized Statutory Notification Center**:
  - Live alerts for **Pending SANS 10139 COC Approvals** awaiting SAQCC Commissioner sign-off.
  - Tracking of **Missed Statutory Milestones** (Quarterly 90-day inspections, Municipal Regulation A19 certificates, weekly MCP rotational key tests).
  - Monitoring and triage of **Urgent System Impairments** (secondary battery standby failure, Class A addressable loop breaks, detector spacing violations).
  - Diagnostic impairment simulation and executive compliance briefing exports.

- **Automated SANS 10139 Certificate of Compliance (COC) Engine**:
  - 9-point statutory eligibility gate.
  - Multi-category classification (L1, L2, L3, L4, L5, P1, P2, M).
  - Power supply autonomy verification (≥ 24h quiescent + 30 min full evacuation alarm).
  - Acoustical sounder bedhead pressure calculation (≥ 65 dB(A) / 75 dB(A)).
  - Digital SAQCC Commissioner electronic signature with immutable verification hash.

- **Dynamic Server-Side Watermarking Utility**:
  - Automatically renders statutory `'DRAFT - NOT ISSUABLE'` or `'OFFICIALLY ISSUED'` watermarks across generated compliance PDFs based on database status.

- **SANS 10139 Digital Compliance Logbook**:
  - Clause 13 tamper-evident log for daily, weekly, quarterly, and annual inspection logs.
  - False alarm rate and fault tracking with non-repudiation audit trails.

- **Safety File Dossier Governance & POPIA Audit Trail**:
  - Append-only compliance records conforming to South Africa's POPIA Act 4 of 2013.
  - Milestone schedule, document registers, and approval matrices.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide Icons, Vite
- **Backend / API**: Express, Node.js (bundled with esbuild / tsx)
- **PDF & Watermarking Engine**: PDF-Lib, Canvas API
- **State & Storage**: Durable local storage service + server-side REST API proxy

---

## 🚀 Quick Start

### 1. Installation
```bash
npm install
```

### 2. Development Mode
```bash
npm run dev
```
Starts the full-stack server on `http://localhost:3000`.

### 3. Production Build
```bash
npm run build
npm start
```

---

## 📋 Standards & Statutory References
- **SANS 10139:2021**: *Code of practice for system design, installation, commissioning and maintenance of fire detection and alarm systems in non-domestic premises.*
- **SANS 10400-T:2011**: *Application of the National Building Regulations Part T: Fire Protection.*
- **OHS Act 85 of 1993**: *Construction Regulations (2014) Reg 7(1)(b) Safety File governance.*
- **POPIA Act 4 of 2013**: *Protection of Personal Information Act statutory records control.*

---

## 👤 Author & Governance
- **Lead Fire Engineer**: Bethuel Moukangwe
- **Organization**: Audrin Fire Engineers (Pty) Ltd
- **SAQCC Commissioner Desk**: Pretoria West / Menlyn Central Hub
