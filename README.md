# Nexus GRC Backend

Node.js + Express + MongoDB backend for the Nexus GRC Platform.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your MongoDB Atlas URI and JWT secret.

3. **Seed database (optional):**
   ```bash
   npm run seed
   ```
   This creates sample data and a default admin user: `admin@nexusgrc.com` / `admin123` 

4. **Run development server:**
   ```bash
   npm run dev
   ```

5. **Frontend `.env` configuration:**
   Add to your frontend `.env`:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

## Deploy to Vercel

1. Push this backend folder to a separate GitHub repo
2. Import in Vercel
3. Add environment variables (MONGODB_URI, JWT_SECRET, CORS_ORIGIN)
4. Deploy!

## API Endpoints

| Module | Endpoints |
|--------|-----------|
| Auth | POST `/api/auth/register`, POST `/api/auth/login`, GET `/api/auth/me` |
| Assets | GET/POST `/api/assets`, PUT/DELETE `/api/assets/:id`, POST `/api/assets/sample-data` |
| Vendors | GET/POST `/api/vendors`, PUT/DELETE `/api/vendors/:id`, POST `/api/vendors/sample-data`, GET `/api/vendors/:id/report` |
| Risks | GET/POST `/api/risks`, PUT/DELETE `/api/risks/:id`, POST `/api/risks/sample-data` |
| KRIs | GET/POST `/api/kris`, PUT/DELETE `/api/kris/:id`, POST `/api/kris/sample-data` |
| Controls | GET/POST `/api/controls`, PUT/DELETE `/api/controls/:id`, POST `/api/controls/sample-data` |
| Treatments | GET/POST `/api/treatments`, PUT/DELETE `/api/treatments/:id`, POST `/api/treatments/sample-data` |
| Risk Appetite | GET/POST `/api/risk-appetite`, PUT/DELETE `/api/risk-appetite/:id`, POST `/api/risk-appetite/sample-data` |
| Reports | GET `/api/reports/risk-assessment`, GET `/api/reports/control-effectiveness`, GET `/api/reports/compliance-status`, GET `/api/reports/vendor-risk`, GET `/api/reports/executive-summary` |

All endpoints (except auth) require Bearer token in Authorization header.
