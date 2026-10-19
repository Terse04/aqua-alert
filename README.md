# AquaAlert — Smart Water Conservation & Leakage Reporting Platform

> **“Every Drop Matters.”**  
> Second Year Information Technology Engineering Community Engagement Project (CEP)  
> **Topic:** Water Scarcity  
> **Target Study Area:** Wagholi, Pune, Maharashtra, India

---

## 1. Project Overview

**AquaAlert** is an environmental technology platform engineered to tackle localized water wastage, delayed pipeline leakage detection, and acute water scarcity in the Wagholi corridor of Pune. Due to rapid suburban urbanization, local housing societies and residents depend extensively on private water tankers and deep borewell extraction. Overlooked roadside pipe fractures and building overhead tank overflows squander tens of thousands of litres of clean potable water every week.

AquaAlert empowers citizens to report water leakages without the barrier of account creation, calculates household water footprints against standard national benchmarks, and provides evidence-based community survey intelligence to mobilize maintenance teams.

---

## 2. Key Features

- **Zero-Barrier Leakage Reporting (`/report`):**
  - Report pipeline fractures, broken standpost taps, and overhead tank overflows in under 30 seconds.
  - Interactive Leaflet map with Wagholi coordinates (`18.5793° N, 73.9812° E`) and optional browser GPS detection.
  - Photo attachment (JPEG, PNG, WebP up to 5 MB) with local preview and removal.
  - Generates a unique, non-sequential Reference ID (e.g., `AQA-2024-WAG78`) and a private tracking secret (e.g., `TRK-8K2N-4X9L`).
  - Stores only a one-way cryptographic SHA-256 hash of the tracking secret to preserve citizen anonymity.

- **Cryptographic Complaint Tracking (`/track`):**
  - Dual-credential lookup: requires *both* Reference ID and private tracking secret code.
  - Constant-time secret verification prevents timing attacks and ID enumeration.
  - Displays sanitized public fields: current status, resolution milestone timeline, and generalized location. Contact numbers and coordinates are kept strictly private.

- **Household Water Consumption Calculator (`/calculator`):**
  - Dynamic consumption model evaluating bucket vs shower bathing, weekly laundry, dishwashing, toilet cistern types (dual vs standard single), and floor mopping.
  - Real-time comparison against the CPHEEO urban benchmark of 135 litres/person/day.
  - Interactive Recharts doughnut distribution and vertical category breakdown.
  - Ranked list of top consumption contributors with tailored conservation advice.

- **Water Conservation Awareness Hub (`/awareness`):**
  - Practical guides on rainwater harvesting (RWH) catchment and borewell recharge in Pune societies.
  - Eliminating overhead tank overflows using automatic float switches.
  - 20-minute water meter test and toilet cistern dye tests for silent leak detection.
  - Responsible reuse of Reverse Osmosis (RO) reject water for mopping and dish pre-rinsing.

- **Community Survey & Analytics (`/community`):**
  - 100% anonymous survey gathering data on water shortage frequencies, tanker reliance, and leakage observation.
  - Visualized as aggregate live charts computed directly from verified submissions.

- **Feedback & Suggestions (`/feedback`):**
  - 5-star rating control and categorized suggestions to improve the platform.

- **About Our Project (`/about`):**
  - Formal academic documentation of problem statements, objectives, and limitations.
  - Print-friendly summary layout and downloadable QR code poster for college stalls and society awareness drives.

- **Protected Administrator Dashboard (`/admin`):**
  - Database-backed live counters: Total, Pending, Under Review, In Progress, Resolved.
  - Search, filter by issue type and status.
  - Photograph inspection and historical audit trail for authorized organizers.
  - Authorized status update workflow.
  - Directory views for community surveys and feedback.

- **Seamless Persistent Demo Mode:**
  - Automatic activation when Supabase credentials are not provided.
  - Automatically seeds realistic Wagholi demo complaints, survey records, and feedback.
  - Persists all submissions, status changes, and survey inputs into `localStorage` across page refreshes.

---

## 3. Technology Stack & Rationale

| Layer | Technology | Rationale |
|---|---|---|
| **Frontend Framework** | React 19 + Vite 8 | Blazing fast build times, HMR, modern JSX runtime |
| **Language** | TypeScript (Strict) | Compile-time safety, strict data contracts |
| **Styling** | Tailwind CSS v4 | Curated environmental design tokens (`#103B54`, `#087EBC`, `#13B8A6`, `#E9F8F7`, `#65A878`) |
| **Routing** | React Router v7 | Seamless client-side routing with clean navigation and 404 handling |
| **Form Validation** | Zod | Robust schema validation for leak reports and surveys |
| **Visual Charts** | Recharts | Responsive, accessible SVG charts for consumption and survey metrics |
| **Mapping** | Leaflet + OpenStreetMap | Lightweight open-source interactive mapping without vendor API lock-in |
| **Icons** | Lucide React | Consistent, accessible iconography |
| **Testing** | Vitest | Fast automated unit and integration tests |
| **Backend & Storage** | Supabase (PostgreSQL + RLS) | Relational integrity, Row Level Security, private object storage, Edge Functions |

---

## 4. Getting Started Locally

### Prerequisites

- **Node.js**: v18.0.0 or higher (Tested on Node v25.9.0)
- **npm**: v9.0.0 or higher (Tested on npm 11.12.1)
- Modern web browser (Chrome, Edge, Firefox, Safari)

### Step 1: Open Project in VS Code
Open your terminal and navigate to the project directory:
```bash
code c:\Users\oters\Downloads\parshya
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Run the Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

### Step 4: Run Automated Tests
```bash
npm test
```
All unit tests for the calculator engine, cryptographic hashing, and local persistence service will execute and report results.

### Step 5: Test the Production Build
```bash
npm run build
```
Builds the optimized production bundle in the `dist/` directory.

---

## 5. Demo Mode vs Production Backend

AquaAlert includes an intelligent backend detection mechanism in `src/lib/storage.ts`:

- **Demo Mode (Default):**
  - If `.env` is blank or `VITE_SUPABASE_URL` is omitted, AquaAlert automatically operates in **Demo Mode**.
  - All complaint submissions, tracking lookups, calculator interactions, survey responses, and administrator status changes work out-of-the-box and persist in your browser's `localStorage`.
  - **Demo Admin Login:**
    - **Email:** `admin@aquaalert.org`
    - **Password:** `AquaAdmin#2024`
    - *(A 1-click "Autofill Demo Admin Credentials" button is provided on `/admin/login`)*
  - **Pre-seeded Demo Complaints for Instant Tracking:**
    - Reference: `AQA-2024-WAG01` / Secret: `TRK-WAG1-DEMO` (Status: In Progress)
    - Reference: `AQA-2024-BAIF2` / Secret: `TRK-BAIF-DEMO` (Status: Resolved)
    - Reference: `AQA-2024-OVR03` / Secret: `TRK-TANK-DEMO` (Status: Under Review)

- **Production Mode (Supabase):**
  - When valid Supabase credentials are provided in `.env`, the application automatically connects to PostgreSQL, applies Row Level Security, and uploads complaint photos to private Supabase Storage.

---

## 6. Supabase Backend Setup Guide

To connect AquaAlert to a real production Supabase project:

### 1. Create a Supabase Project
1. Visit [supabase.com](https://supabase.com) and create an account.
2. Click **New Project**, select an organization, and choose a region (e.g., `ap-south-1` Mumbai for Indian deployments).

### 2. Apply SQL Migrations
1. In the Supabase dashboard, open the **SQL Editor**.
2. Open the file `supabase/migrations/20240101000000_initial_schema.sql` from this repository.
3. Paste the contents into the SQL Editor and click **Run**.
4. This creates:
   - `complaints` table with status constraints and performance indexes.
   - `complaint_status_history` table for milestone logging.
   - `admin_users` table for secure role-based authorization.
   - `community_surveys` table for anonymous survey entries.
   - `feedback` table.
   - Secure RPC function `track_complaint_secure`.
   - Private Storage bucket `complaint-photos` with upload and admin-only view policies.
   - Row Level Security (RLS) policies on all tables.

### 3. Create the First Administrator
1. In the Supabase Dashboard, go to **Authentication -> Users** and click **Add User**.
2. Create an admin user with your email and password (e.g., `admin@aquaalert.org`).
3. Copy the newly created user's `User UID`.
4. Run the following SQL query in the Supabase SQL Editor:
   ```sql
   INSERT INTO public.admin_users (user_id, email, role)
   VALUES ('<PASTE-USER-UID-HERE>', 'admin@aquaalert.org', 'Lead CEP Coordinator');
   ```

### 4. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in your Supabase project credentials:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-actual-anon-publishable-key
```

### 5. Deploy Edge Functions (Optional)
If using Supabase CLI:
```bash
supabase functions deploy track-complaint
supabase functions deploy submit-complaint
```

---

## 7. Deployment Instructions (Vercel / Netlify)

### Deploying to Vercel
1. Push your repository to GitHub.
2. Log in to [Vercel](https://vercel.com) and click **Add New -> Project**.
3. Import your GitHub repository.
4. Set the Build Command: `npm run build`
5. Set the Output Directory: `dist`
6. Under **Environment Variables**, add:
   - `VITE_SUPABASE_URL` (optional for live Supabase; leave blank for Demo Mode)
   - `VITE_SUPABASE_ANON_KEY` (optional)
7. Click **Deploy**.

### Supabase Allowed Origins
If connecting to Supabase:
1. Go to your Supabase Dashboard -> **Authentication -> URL Configuration**.
2. Add your deployed production URL (e.g., `https://aquaalert.vercel.app`) to **Site URL** and **Redirect URLs**.

---

## 8. Community QR Code Usage

During college exhibitions, society visits, or awareness stalls in Wagholi:
1. Visit the `/about` page on your deployed site.
2. Scroll to the **QR Code Section**.
3. Click **Print Poster** to print a high-resolution QR poster or click **Save Image** to include it in presentations or society WhatsApp announcements.
4. Scanning the QR code takes residents directly to the home page with instant mobile-friendly access to the report form, water calculator, and survey.

---

## 9. Academic Disclaimer

> **Important Community Notice:** AquaAlert is a student-developed Community Engagement Project (CEP) intended to raise awareness about water scarcity and encourage water conservation. It is **not an official government or municipal complaint portal**. Submitting a report does not guarantee that a repair authority will receive or act on it. Physical outreach is managed by student volunteers and housing society maintenance committees.
