# ClockTrack — Staff Attendance System

**Simple, reliable clock-in/out and reporting for teams.**

ClockTrack is a staff attendance and time-tracking system built for offices, branches, and remote teams. Staff clock in and out from a kiosk or any device; managers get a clear dashboard, editable logs, and professional PDF reports—all in one place.

---

## Why ClockTrack?

- **Fast for staff** — Search your name, tap Clock In or Clock Out. No forms, no fuss.
- **Clear for managers** — See who’s in today, review and correct clock records, manage staff.
- **Ready for payroll** — Download PDF reports by week or date range with gross hours, lunch deduction, and net hours (Mon–Sun) per person.
- **Built for the modern stack** — Hosted on **Cloudflare** for speed and reliability, with **Supabase** for secure, scalable data storage and optional authentication.

---

## Technology

| Layer        | Technology | Role |
|-------------|------------|------|
| **Hosting** | **Cloudflare Pages** | Global CDN, fast static hosting, and optional Workers for edge logic. |
| **Data & Auth** | **Supabase** | PostgreSQL database for staff and clock logs; optional JWT-based auth for admin and API. |
| **Frontend** | React 19 + Vite 7 | Single-page app with a responsive, accessible UI. |
| **Reports** | jsPDF | Client-side PDF generation for attendance reports. |

This combination gives you a fast, secure, and scalable system without managing servers.

---

## Features

### Kiosk (staff-facing)
- Live date and time
- Search by name to find yourself quickly
- One-tap **Clock In** / **Clock Out** with immediate confirmation
- Clear status: not clocked in, clocked in, or clocked out for the day

### Admin (manager-facing)
- **Dashboard** — Active staff count, who’s currently in, who’s clocked out today, net hours for the week
- **Clock logs** — View by date, edit clock-in/out times and notes, delete incorrect entries
- **Staff** — Add, edit, activate/deactivate staff (name, company, department, email)
- **Reports** — Single-week or custom date-range reports with:
  - Per-day breakdown: Date, Day, Clock In, Clock Out, Gross, Lunch (30 min), Net Hours, Notes
  - **Net hours (Mon–Sun)** total per person for the selected week
  - Download as a clean, print-ready PDF (A4 landscape)

### Report PDF
- Light, readable layout
- Column headers: Date, Day, Clock In, Clock Out, Gross, Lunch, Net Hours, Notes
- Optional 30 min/day deduction; net hours calculated per day and per week
- One section per staff member with a week total line

---

## Running the project

### Prerequisites
- Node.js 18+
- npm (or pnpm/yarn)

### Local development
```bash
cd /path/to/ClockTrack
npm install
npm run dev
```
Open the URL shown (e.g. `http://localhost:5173`).

### Build for production
```bash
npm run build
```
Output is in `dist/`, ready to deploy to **Cloudflare Pages** (or any static host).

### Deploying to Cloudflare Pages
- Connect your repo to Cloudflare Pages and set the build command to `npm run build` and publish directory to `dist`.
- Optionally add environment variables (e.g. Supabase URL and anon key) in the Pages dashboard.

---

## Data and backend (Supabase)

ClockTrack is designed to use **Supabase** for:
- **PostgreSQL** — Tables for staff and clock logs (and any future entities).
- **Auth (optional)** — Supabase Auth can provide JWT-based login for the admin area and secure API access.

The current codebase includes in-memory demo data so you can run and demo the app without a backend. To go live, replace that with Supabase client calls (and, if desired, Supabase Auth for admin).

---

## Security and compliance

- Admin area is protected by login (demo: `admin` / `admin123`; replace with Supabase Auth in production).
- All traffic can be served over HTTPS via Cloudflare.
- Supabase provides row-level security and JWT verification for API and database access when integrated.

---

## Licence and support

ClockTrack is provided as-is. For customisation, support, or integration (e.g. Supabase schema, Cloudflare Workers, SSO), contact the development team.

---

**ClockTrack** — Staff Attendance System · Hosted on Cloudflare · Powered by Supabase
