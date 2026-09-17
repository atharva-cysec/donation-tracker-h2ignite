# TrustDonate — Hackathon Presentation Guide

> **Core Value Proposition**:
> *"TrustDonate is a donation platform that lets donors continue following their contribution after they give."*

---

## 🎯 The Core Problem
Traditional charitable giving is a black box:
1. Donors contribute money.
2. A receipt email arrives.
3. Communication ends forever.
Donors are left wondering: *Did my money reach the low-income children? Was the medical equipment actually purchased?*

---

## 💡 The Solution: Donation-First with Milestone Tracking

### Product Hierarchy
```
┌──────────────────────────────────────────────┐
│ 1. DONATE TO CAUSES                          │  <- The Core Product (Emotional context, clear CTAs)
├──────────────────────────────────────────────┤
│ 2. SEE THE IMPACT OF YOUR GIVING             │  <- Executive Giving Dashboard & personal stats
├──────────────────────────────────────────────┤
│ 3. TRACK PROGRESS / TRANSPARENCY             │  <- Signature Parcel-Tracking Style Milestone Tracker
├──────────────────────────────────────────────┤
│ 4. BLOCKCHAIN VERIFICATION                   │  <- Supporting Cryptographic Verification Layer
└──────────────────────────────────────────────┘
```

---

## 🎬 3-Minute Demo Walkthrough Script

### 1. Discovery (45s) — "I can discover causes and donate here"
- **Login**: Use `demo@trustdonate.test` / `Demo@123` (or fresh demo user `aarav@trustdonate.test` / `Aarav@123`).
- **Dashboard**: Point out the personal giving space: Total Donated, Causes Supported, Active & Completed milestones.
- **Explore Causes**: Browse campaigns across Healthcare, Education, Nutrition, and Disaster Relief.
- **Cause Details**: Emphasize cause imagery, human narrative, and fundraising progress bar before donation.

### 2. The Giving Action (45s) — Simple, Familiar, Seamless
- Select preset (₹500, ₹1,000, ₹2,000, ₹5,000) or custom amount.
- Click **Donate ₹2,000**.
- Confirm in the summary modal.

### 3. The Differentiator (60s) — "Your donation doesn't disappear"
- **Post-Donation Reveal**: The success state introduces the differentiator:
  > *"Thank you for supporting this cause. Your contribution doesn't disappear after you donate. Follow its progress through your Impact Tracker."*
- Click **Track Donation** → smoothly scrolls to the **Signature Impact Tracker**:
  1. *Donation Received*
  2. *Milestone Added*
  3. *Funds Requested*
  4. *Funds Released*
- View **Donation Details** at `/my-donations/:id`:
  - 1. Donation Overview (Amount, Cause, NGO, Date)
  - 2. Impact Tracker (Milestone progress)
  - 3. Independent Verification (Ethereum Sepolia smart contract audit trail)

### 4. Technical Architecture (30s)
- **Frontend**: React 19, Tailwind CSS v4, Vite 8, React Router v7.
- **Data Isolation**: Multi-account partitioned storage in `localStorage` ensuring zero cross-contamination.
- **Smart Contract Layer**: Solidity contract `DonationTracker.sol` providing verifiable milestone disbursement logic.

---

## 👥 Hackathon Evaluation Credentials
| Name | Email | Password | Scope |
|------|-------|----------|-------|
| **Demo User** | `demo@trustdonate.test` | `Demo@123` | Default (3 seeded records) |
| **Aarav Sharma** | `aarav@trustdonate.test` | `Aarav@123` | Fresh donor account (0 records) |
| **Riya Mehta** | `riya@trustdonate.test` | `Riya@123` | Fresh donor account (0 records) |
| **Kabir Verma** | `kabir@trustdonate.test` | `Kabir@123` | Fresh donor account (0 records) |
| **Meera Joshi** | `meera@trustdonate.test` | `Meera@123` | Fresh donor account (0 records) |
