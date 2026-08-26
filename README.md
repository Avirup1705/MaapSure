# MaapSure

**A real-time field verification and public trust system for weighing and measuring instruments.**

MaapSure complements the Government of India's eMaap platform by solving the problem of what happens *after* an instrument is officially verified and stamped — giving every instrument a living, checkable digital identity instead of a one-time paper certificate.

---

## Table of Contents

- [Problem Statement](#problem-statement)
- [Our Solution](#our-solution)
- [Key Features by Role](#key-features-by-role)
- [System Architecture](#system-architecture)
- [Data Model](#data-model)
- [Tech Stack](#tech-stack)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
- [User Flow Diagram](#user-flow-diagram)
- [Current Status](#current-status)
- [Known Limitations & Roadmap](#known-limitations--roadmap)
- [Relevance to Government Initiatives](#relevance-to-government-initiatives)

---

## Problem Statement

Under the **Legal Metrology Act, 2009**, weighing and measuring instruments used in shops, petrol pumps, and weighbridges must be periodically verified and stamped to protect consumers from fraud.

The government's **eMaap platform** (live since February 2025) digitizes registration, license applications, payments, and certificate issuance — but it stops there. It does not address what happens **after** an instrument passes inspection. This leaves a critical trust gap: an instrument tampered with even a day after verification can go undetected for months, silently cheating consumers, because there is no mechanism to check its real-time status in the field.

## Our Solution

MaapSure builds the missing **trust and field-verification layer** that sits alongside eMaap:

- Every verified instrument receives a **unique digital ID and QR code** — effectively a "digital passport" carrying owner details and full verification history.
- **Any consumer** can scan this QR code, without logging in, to instantly see whether the instrument is valid, expired, or flagged.
- **Field officers** verify instruments against a structured compliance checklist and log results permanently.
- **Retailers** can self-register new instruments and track upcoming renewals, receiving alerts before expiry.
- The system is designed to eventually support **risk-based inspection prioritization** — replacing random inspection cycles with data-driven enforcement (planned, not yet built).

---

## Key Features by Role

### 🔍 Consumer
- Dual input: scan the QR code using an **in-browser camera scanner**, or manually type the Instrument ID
- Instantly view: current status (Valid / Pending / Expired / Flagged / Tampered), instrument type, owner/retailer name, location, last verification date, and full verification history
- Submit **feedback or a complaint** about the instrument directly from the detail page — no login required

### 🧑‍🔧 Field Officer
- Lightweight identity check — enters **name and officer ID** before accessing any instrument records
- Searches for an instrument by ID
- Runs the instrument through a **5-point compliance checklist**:
  1. Seal intact
  2. Calibration accurate
  3. Display functional
  4. No physical damage
  5. Location matches registration
- Leaves a **comment** (mandatory if any condition fails)
- Sets the **next verification expiry date**
- Submitting automatically updates the instrument's status: all conditions pass → `valid`; any condition fails → `flagged`
- Every submission is permanently logged in the instrument's verification history with officer name, officer ID, timestamp, and checklist results — building an accountability trail

### 🏪 Retailer
- **New Instrument**: register a new instrument (type, owner details, location), set a password, and specify an **expected officer verification date**. The instrument goes live immediately as a scannable QR-passport with status `pending`, awaiting an officer's first visit.
- **Existing Instrument**: log in using **phone number + Instrument ID + password** to view:
  - Current status and full details
  - Last verification date and expiry date
  - An **alert banner** when renewal is due within 30 days or has already lapsed
  - A **"Book Officer Verification"** button to request the next re-inspection visit

---

## System Architecture


## Data Model

Everything centers on a single **Instrument** document per physical device — the real-world entity being tracked — rather than splitting data across many relational tables. This lets the app fetch an instrument's entire trust history in a single query, which matters for the instant-scan use case.


## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React (Vite) | Component-based UI, fast dev server |
| Styling | Tailwind CSS | Utility-first styling, rapid iteration |
| Routing | React Router | Client-side navigation across role sections |
| HTTP Client | Axios | Frontend ↔ backend API calls |
| QR Scanning | html5-qrcode | In-browser camera-based QR scanning |
| Backend | Node.js + Express | REST API server |
| Database | MongoDB Atlas | Cloud-hosted, flexible schema fits nested history/feedback arrays |
| ODM | Mongoose | Schema validation + modeling on top of MongoDB |
| QR Generation | qrcode (npm) | Generates each instrument's digital passport QR |
| Password Hashing | bcryptjs | Retailer passwords never stored in plain text |
| Environment Config | dotenv | Keeps DB credentials out of source control |

## API Endpoints

### Instruments
| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/instruments` | Officer-created instrument (legacy direct-creation flow) |
| `GET` | `/api/instruments` | List all instruments |
| `GET` | `/api/instruments/:instrumentId` | Fetch one instrument (public scan endpoint) |
| `POST` | `/api/instruments/:instrumentId/feedback` | Consumer submits feedback/complaint |
| `POST` | `/api/instruments/:instrumentId/verify` | Officer submits checklist + comment + new expiry date |

### Retailer
| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/retailer/register` | Retailer registers a new instrument (status → `pending`) |
| `POST` | `/api/retailer/login` | Existing retailer looks up their instrument |
| `POST` | `/api/retailer/:instrumentId/book-verification` | Retailer books the next officer visit |

### System
| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/health` | Confirms server + database connection status |

## Project Structure


## Setup & Installation

### Prerequisites
- Node.js and npm installed
- A MongoDB Atlas account (free tier is sufficient)

### Backend
```bash
cd backend
npm install
# Create a .env file with:
#   PORT=5000
#   MONGO_URI=<your MongoDB Atlas connection string>
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173` to access the app. The home page lets you choose between Consumer, Field Officer, and Retailer sections.

## User Flow Diagram


## Current Status

✅ **Fully functional prototype** — all three user roles work end-to-end against a live MongoDB Atlas database, deployed and tested locally.

Completed:
- Home/landing page with role selection and platform description
- Consumer flow: in-browser QR camera scanning, manual ID lookup, full instrument detail view, feedback/complaint submission
- Officer flow: identity capture, instrument search, 5-point compliance checklist, automatic status determination, permanent audit trail via verification history
- Retailer flow: new instrument self-registration with password protection, existing instrument login, expiry alert banner, book-verification request
- QR code generation and digital passport concept fully working
- Backend REST API with input validation and error handling
- Password security via bcrypt hashing

## Known Limitations & Roadmap

Being transparent about what's not yet built:

- **No offline mode** for the Field Officer app in low-connectivity areas (was part of the original concept, not yet implemented)
- **No formal session/token authentication** (JWT) — officer and retailer identity checks are lightweight verification, not enforced secure sessions
- **Risk-based inspection prioritization engine** — a rule-based scoring system (using expiry proximity, complaint count, tamper flags) was designed but paused mid-build during a requirements pivot; planned as a next addition
- **QR payload is not cryptographically signed** — currently just an ID-encoding URL; a signed/tamper-evident QR format would be a stronger production safeguard
- **No automated notifications** (SMS/email) for expiry alerts — currently only visible when a retailer manually logs in

## Relevance to Government Initiatives

This prototype's problem space overlaps with **official Smart India Hackathon (SIH) problem statements** sponsored by the Ministry of Consumer Affairs, Food and Public Distribution — specifically SIH25058 ("Detection and Prevention of Tampering in Weighing and Measuring Instruments") and a related statement on developing an online verification system for weighing and measuring instruments — confirming this is a live, recognized gap in India's legal metrology enforcement infrastructure, not a hypothetical problem.

---

🚧 Built as an internal hackathon prototype. Not affiliated with or endorsed by the Department of Consumer Affairs or the eMaap platform.
