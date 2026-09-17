# TrustDonate — Hackathon Submission Summary

## Executive Summary
**TrustDonate** is a modern donation platform that lets donors continue following their contribution after they give.

### The Problem
Traditional donation portals treat giving like an e-commerce checkout that terminates at payment receipt. Donors have no visibility into how funds are utilized, leading to donor fatigue and skepticism.

### The Innovation
TrustDonate redesigns the giving experience:
1. **Donation First**: An intuitive, emotionally resonant platform to discover vetted causes and make contributions.
2. **Signature Impact Tracker**: Borrowing familiar parcel-tracking mental models, donors follow milestone stages:
   *Donation Received* → *Milestone Added* → *Funds Requested* → *Funds Released*.
3. **Cryptographic Verification**: Smart contracts on Ethereum Sepolia record fund release milestones to ensure tamper-proof accountability.

---

## Technical Highlights
- **Modern Web Architecture**: React 19, Tailwind CSS v4, Vite 8, React Router v7.
- **Design Language**: Restrained warm aesthetic (`#FAFAF7` background, `#18332B` forest green, `#2F7D5B` hopeful green accent, `#1D2925` typography).
- **Zero Mock Fabrications**: Clear distinctions between active prototype demonstration data and live on-chain milestones. No fake hashes or fake block numbers.
- **Multi-Account User Isolation**: 5 distinct hackathon evaluation accounts with isolated data environments in browser storage.
- **Comprehensive Donor Experience**: Executive dashboard, cause directory, interactive milestone tracker, contribution history, issue reporting, and profile management.
