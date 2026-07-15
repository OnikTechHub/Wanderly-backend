# Wanderly Backend (Node.js + Express)

A standalone REST API for the Wanderly frontend, built with **Node.js + Express**.
Uses JWT auth (HTTP-only cookie) and a local JSON file as the data store (no external DB needed).

## Getting Started
```bash
npm install
cp .env.example .env   # already done — edit if needed
npm run dev            # nodemon, auto-restart
# or
npm start               # plain node
```
Runs on **http://localhost:5000** by default.

## Environment Variables (`.env`)
```
PORT=5000
JWT_SECRET=wanderly-dev-secret-change-me
CORS_ORIGIN=http://localhost:3000
```
`CORS_ORIGIN` must match wherever the Next.js frontend runs, and `credentials: true` CORS is enabled
so the browser can send/receive the auth cookie across the two ports.

## Endpoints
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | /api/auth/register | – | Create account, sets JWT cookie |
| POST | /api/auth/login | – | Verify credentials, sets JWT cookie |
| POST | /api/auth/logout | – | Clears the cookie |
| GET  | /api/auth/me | – | Returns current user from cookie (or null) |
| GET  | /api/tours | – | List all tours |
| GET  | /api/tours/:id | – | Get one tour |
| POST | /api/tours | ✅ | Create a tour |
| DELETE | /api/tours/:id | ✅ | Delete a tour |

## Demo Account
- Email: `demo@wanderly.com`
- Password: `demo1234`

## Project Structure
```
wanderly-backend/
├── server.js              # Express app entry point
├── routes/
│   ├── auth.js
│   └── tours.js
├── middleware/
│   └── requireAuth.js     # JWT cookie verification
├── utils/
│   ├── db.js               # JSON file read/write helpers
│   └── auth.js             # sign/verify JWT
└── data/
    ├── tours.json
    └── users.json
```
