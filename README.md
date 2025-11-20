# Villa Check-In / Check-Out Desktop App

Electron + React + Express application for managing up to five villas offline. Includes booking dashboard, history with PDF invoices, and pricing controls.

## Project layout

```
app/
  frontend/   # Vite + React + Tailwind UI
  backend/    # Express + Prisma + PDF generation
  database/   # SQLite file (created on first run)
  invoices/   # Generated PDF invoices
electron/     # Main process scripts
```

## Getting started

```bash
npm install                 # installs root + workspaces
npm run prisma:generate     # generate Prisma Client
npm run seed                # seed 5 villas
npm run dev                 # start backend, frontend, and Electron shell
```

The dev command opens the Electron shell loading the Vite dev server while Express serves data on `http://localhost:3001`.

## Production builds

```bash
npm run build               # build frontend + backend
npm run build:mac           # creates macOS artifact via electron-builder
npm run build:win           # creates Windows artifact
```

## Key features

- Dashboard with statuses, booking details, and quick check-in/out actions
- Booking creation form with validation and automatic price calculation
- One-click checkout that generates PDF invoices inside `app/invoices`
- Booking history table with filters + invoice access
- Settings page to adjust nightly prices and prep for future add-ons

## Environment

The backend defaults to:

- `PORT=3001`
- `DATABASE_URL=file:../database/app.db`
- `INVOICE_OUTPUT_DIR=../invoices`

Override by exporting env vars before running backend scripts.

## PDF output

Invoices are created through PDFKit with guest, stay, totals, signature space, and “Proof of Stay” note. Files are timestamped to avoid duplicates (e.g., `invoice_12_20241120_142233.pdf`).

