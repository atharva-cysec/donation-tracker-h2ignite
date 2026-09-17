# TrustDonate — Donation Transparency Platform

TrustDonate is a verified donation transparency platform built for donors who want complete confidence in their charitable contributions. Unlike traditional black-box donation portals, TrustDonate offers milestone-driven visibility into every rupee donated, linking charitable contributions directly to tangible impact stages.

---

## 🌟 Hackathon Demo Accounts

> [!NOTE]
> **PROTOTYPE-ONLY ACCOUNTS**
> These plaintext credentials exist exclusively for the hackathon evaluation and demonstration.
> Do not use this authentication approach in production.

The platform includes 5 pre-configured demo donor accounts with isolated data environments:

| # | Name | Email | Password | Role / Account State | Stable ID |
|---|------|-------|----------|----------------------|-----------|
| 1 | **Demo User** | `demo@trustdonate.test` | `Demo@123` | Default demo account (includes 3 pre-seeded donations) | `demo-user` |
| 2 | **Aarav Sharma** | `aarav@trustdonate.test` | `Aarav@123` | Fresh demo donor (starts with clean history) | `demo-aarav` |
| 3 | **Riya Mehta** | `riya@trustdonate.test` | `Riya@123` | Fresh demo donor (starts with clean history) | `demo-riya` |
| 4 | **Kabir Verma** | `kabir@trustdonate.test` | `Kabir@123` | Fresh demo donor (starts with clean history) | `demo-kabir` |
| 5 | **Meera Joshi** | `meera@trustdonate.test` | `Meera@123` | Fresh demo donor (starts with clean history) | `demo-meera` |

### Account Testing Notes
- **User Isolation**: Each demo account operates in its own isolated data partition in `localStorage`. Donations made by Aarav will never appear in Riya's or Kabir's dashboard.
- **Session Preservation**: Logging out clears only the active authenticated session. Contribution history remains safely stored in local browser state.
- **Normal Signup**: Users created via the regular Signup screen (`/signup`) continue to work normally with auto-generated UUIDs and cannot claim reserved demo emails.

---

## 🚀 Key Features

- **Executive Donor Dashboard** (`/dashboard`): Unified giving overview metrics, recent donation activity, and the signature interactive Impact Tracker.
- **Signature Donation Impact Tracker**: Parcel-tracking style visual lifecycle:
  1. *Donation Received* → 2. *Milestone Added* → 3. *Funds Requested* → 4. *Funds Released*.
- **Causes Directory** (`/causes`): Categorized initiatives (Healthcare, Education, Nutrition, Disaster Relief) with transparent milestone allocations.
- **Cause Details & Donation Flow** (`/causes/:id`): Preset amount selection (₹500, ₹1,000, ₹2,000, ₹5,000) or custom input, donation summary review modal, and simulated milestone allocation.
- **My Donations** (`/my-donations`): Comprehensive contribution ledger with status filtering (`All`, `In Progress`, `Completed`), search by cause/NGO, and direct tracker jumping.
- **Donation Details** (`/my-donations/:id`): Detailed breakdown with cryptographic verification badges and contextual support link.
- **Help & Support** (`/support`): Frequently Asked Questions (FAQ) accordion, Contact Us form, and per-user isolated issue reporting.
- **Settings & Profile** (`/settings`): Authenticated user details and session management.

---

## 🎨 Visual Identity & Design Tokens

TrustDonate uses an approved warm donation-oriented design language:
- **Background**: `#FAFAF7` (Warm cream neutral)
- **Surfaces & Cards**: `#FFFFFF` with subtle `#E4E8E5` borders and micro-shadows
- **Sidebar Navigation**: `#18332B` (Dark forest green)
- **Primary Brand Accent**: `#2F7D5B` (Hopeful forest green)
- **Hover State**: `#27684C`
- **Light Accent Tint**: `#EAF3EE`
- **Primary Text**: `#1D2925`
- **Secondary Text**: `#68746F`

---

## 🛠️ Tech Stack

- **Framework**: React 19 + Vite 8
- **Styling**: Tailwind CSS v4
- **Routing**: React Router v7 (`BrowserRouter`, `ProtectedRoute`)
- **Icons**: Lucide React
- **Verification Layer**: Ethereum Sepolia smart contract architecture (`DonationTracker.sol`)

---

## 💻 Getting Started

### Prerequisites
- Node.js 18+ (tested on Node v24)
- npm

### Installation & Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```
