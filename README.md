# FOCA Connect

A full-stack church management starter system for Friends of Christ Assembly (FOCA) Kyanja.

## Stack
- Frontend: React + Vite + React Router + plain CSS
- Backend: Node.js + Express + MongoDB + Mongoose
- Auth: JWT + bcrypt

## Features included
- Public church website pages
- Secure login/register
- Role-based dashboards
- Protected routes
- CRUD modules for members, visitors, events, sermons, announcements, prayer requests, counseling, finance
- Automatic report center backed by live DB summaries
- Seeded demo users and demo church data
- FOCA logo branding included

## Run backend
```bash
cd backend
cp .env.example .env
npm install
npm run seed
npm run dev
```

## Run frontend
```bash
cd frontend
npm install
npm run dev
```

## Demo users
- admin@foca.com / Foca123!
- pastor@foca.com / Foca123!
- finance@foca.com / Foca123!
- media@foca.com / Foca123!
- member@foca.com / Foca123!
- followup@foca.com / Foca123!
- adminoffice@foca.com / Foca123!
- leader@foca.com / Foca123!
