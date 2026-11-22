# AGENTS.md — Smart Campus Room Availability Checker

Instructions for any coding agent working in this project. Read this file before you change
anything, and follow it over any general habit of yours.

## Project

A React + TypeScript page (Vite) that checks availability in one fictional room. The booking rule lives in `src/booking.ts` (`canBook`); the page is `src/App.tsx`;
the tests are in `src/booking.test.ts`.

Use fictional room names and bookings only; never use real schedules or the KBTU portal.

## Acceptance contract

- AC1 Reject start ≥ end and requests in the past.
- AC2 Enforce the maximum allowed duration (120 minutes).
- AC3 Reject a blocked room.
- AC4 Reject overlaps. A request that touches a booking at an endpoint is allowed.
- AC5 Return Available / Unavailable without changing booking data.
- AC6 Preserve clear UI feedback on desktop and mobile.

## Commands

- Install: `npm install`
- Dev server: `npm run dev`
- Tests: `npm test`
- Build: `npm run build`

## You may

- Edit only files relevant to the requested task.
- Do not add dependencies unless the task explicitly requires them.
- Do not add persistence, a database, a login, or an external service.
- Never add secrets, passwords, tokens, API keys or `.env` files.

## Before you finish

- Make sure the page still loads.
- Never deploy or publish externally. Run `npm test` and `npm run build` before proposing acceptance.
