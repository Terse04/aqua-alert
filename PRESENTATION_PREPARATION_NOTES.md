# AquaAlert CEP Presentation — Quick Preparation Notes & Cheat Sheet

> **Second Year IT Engineering Community Engagement Project (CEP)**  
> **Topic:** Water Scarcity | **Study Area:** Wagholi, Pune  
> **Companion Document:** `AquaAlert_CEP_Project_Presentation_Script.docx`

---

## 1. Quick Launch Instructions (Before Stepping on Stage)

```bash
# 1. Start development server (already running in background, or run:)
npm run dev

# 2. Open browser at:
http://localhost:5173

# 3. Verify automated tests (optional to show evaluators):
npm test
```

---

## 2. Pre-Seeded Demo Shortcuts for Fast Demonstration

AquaAlert comes equipped with an offline, persistent **Demo Mode** stored in `localStorage`. You do not need to type long codes or register accounts during your live presentation.

### A. Instant Complaint Tracking Lookups (`/track`)
On the Tracking page, click the pre-filled demo chips at the bottom:
- **Demo Report 1:** Reference: `AQA-2024-WAG01` | Secret: `TRK-WAG1-DEMO`  
  *(Status: In Progress — Nagar Road underground leak)*
- **Demo Report 2:** Reference: `AQA-2024-BAIF2` | Secret: `TRK-BAIF-DEMO`  
  *(Status: Resolved — Broken tap fixed near primary school)*
- **Demo Report 3:** Reference: `AQA-2024-OVR03` | Secret: `TRK-TANK-DEMO`  
  *(Status: Under Review — Commercial tank overflow on Domkhel Road)*

### B. Administrator Login (`/admin/login`)
- **Email:** `admin@aquaalert.org`
- **Password:** `AquaAdmin#2024`
- **Shortcut:** Click the blue button **“Autofill Demo Admin Credentials”** on the screen.

---

## 3. Recommended 12-Minute Presentation Timing Breakdown

| Time Elapsed | Section & Action | Key Speaking Goal |
|---|---|---|
| **0:00 – 1:00** | **Opening & Greetings** (Slide / Home) | Introduce yourself, SY IT CEP topic *Water Scarcity*, and Wagholi context. |
| **1:00 – 2:30** | **The Real-World Problem** (Home) | Highlight tanker costs in Wagholi, unseen leaks, and tank overflows. |
| **2:30 – 3:30** | **Objectives & Solution** (Home) | Explain zero-barrier reporting and community stewardship. |
| **3:30 – 5:00** | **Tech Stack & Architecture** (Slides / Code) | Mention React 19, TypeScript, Tailwind v4, Leaflet, and Supabase RLS. |
| **5:00 – 9:00** | **Live Website Demo** (Browser) | 1. Report a leak → 2. Track with code → 3. Calculator → 4. Awareness → 5. Admin status update. |
| **9:00 – 10:00** | **Data Workflow & Security** (About / Tracking) | Explain SHA-256 hash storage and constant-time equality check. |
| **10:00 – 11:00** | **Limitations & Future Scope** | Be honest: academic CEP initiative, not an official municipal dispatch. |
| **11:00 – 12:00** | **Conclusion & Q&A Transition** | Thank teachers and invite viva questions. |

---

## 4. Top 3 Golden Rules for Your Viva Defense

1. **Be Honest About Municipal Integration:**  
   If a teacher asks: *“Does this automatically notify PMC or the Wagholi Gram Panchayat?”*  
   **Say:** *“No, respected sir/madam. AquaAlert is an academic Community Engagement Project. Submitting a report alerts our student field team and housing society maintenance committees, but we do not claim automated government dispatch.”* Evaluators give high marks for honesty!

2. **Explain Cryptographic Privacy Clearly:**  
   If a teacher asks: *“How is a citizen’s report private without a login?”*  
   **Say:** *“We generate an unguessable private tracking secret code and store only its one-way SHA-256 hash in the database. When the citizen checks /track, we compare the hashes in constant time. No phone numbers or private coordinates are ever returned to the public screen.”*

3. **Master the Calculator Arithmetic:**  
   Remember: **Bathing is 18 L for a bucket bath vs 9.5 L/minute for a shower**.  
   CPHEEO Indian urban standard is **135 litres per person per day**.

---

## 5. Location of Presentation Materials

- **Complete DOCX Script:** [AquaAlert_CEP_Project_Presentation_Script.docx](file:///c:/Users/oters/Downloads/parshya/AquaAlert_CEP_Project_Presentation_Script.docx)
- **Documentation Copy:** [documentation/AquaAlert_CEP_Project_Presentation_Script.docx](file:///c:/Users/oters/Downloads/parshya/documentation/AquaAlert_CEP_Project_Presentation_Script.docx)
- **Web App Codebase:** [c:\Users\oters\Downloads\parshya](file:///c:/Users/oters/Downloads/parshya)
