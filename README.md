# MaapSure

**Real-time field verification and public trust system for weighing/measuring instruments.**

Complements the government's eMaap platform by covering what happens *after* an instrument is verified and stamped — ensuring it stays accurate, tamper-free, and traceable in the field.

## Problem
Under the Legal Metrology Act, 2009, instruments must be periodically verified. eMaap digitizes registration and certification, but there's no way to check an instrument's real-time status after inspection — leaving a trust gap that can be exploited for months undetected.

## Solution
- **Digital Passport (QR Code)** — every verified instrument gets a unique ID + QR. Anyone can scan it, no login required, to see live status (valid/expired/flagged).
- **Field Officer App** — offline-capable, lets officers inspect/re-verify instruments anywhere, syncing when back online.
- **Retailer Dashboard** — tracks expiry dates and renewal alerts.
- **Risk Engine** — prioritizes inspections using expiry timelines, complaint history, and tamper patterns.

## Tech Stack
- Frontend: React (Vite) + Tailwind CSS
- Backend: Node.js + Express
- Database: MongoDB
- QR Codes: `qrcode` npm package

## Project Structure
See `/backend` and `/frontend` folders.

## Status
🚧 In development for internal hackathon.
