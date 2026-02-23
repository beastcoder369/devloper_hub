# Dev Hub — Backend README

This README explains the repository layout, dependencies, required environment variables, and how to run the project on Windows, macOS or Linux.

**Project overview:**
- Backend: Express + MongoDB API (authentication, profiles, connection requests, email notifications via AWS SES).
- Frontend: `dev-hub/` (Vite + React) — see `dev-hub/README.md` (frontend-specific instructions).

**Repository structure (important folders):**
- **backend/**: server code
	- `src/app.js` — application entry (loads env, registers routes)
	- `src/config/database.js` — MongoDB connection
	- `src/middlewares/` — auth middleware
	- `src/models/` — Mongoose models (`user.model.js`, `connectionRequest.js`)
	- `src/routes/` — Express routes (`auth.router.js`, `profile.router.js`, `request.router.js`, `user.router.js`)
	- `src/utils/` — helpers (`sesClients.js`, `sendemail.js`, `validation.js`, etc.)
	- `src/readme.md` — this file
- **dev-hub/**: frontend (Vite + React)

**Main dependencies**
- Backend (see `backend/package.json`): Node.js, Express, Mongoose, @aws-sdk/client-ses, dotenv, nodemon (dev), bcrypt, cors, cookie-parser, jsonwebtoken, validator.
- Frontend (see `dev-hub/package.json`): Vite, React, React DOM, axios, Tailwind/DaisyUI (if present), etc.

Environment variables (.env) — create `backend/.env` with these keys:
- `DB_CONNECT_SECRET` = MongoDB connection string (mongodb+srv URI or local URI)
- `PORT` = server port (default )
- `JWT_SECRET` = JWT signing secret
- `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` = AWS IAM credentials with SES permissions
- `AWS_SESSION_TOKEN` (optional) = temporary credentials token
- `FROM_EMAIL` = verified sender email for SES
- `TO_EMAIL` = recipient email to use for testing (or leave blank if you send per-user)

Notes on AWS SES:
- If your SES account is in sandbox mode, both sender and recipient must be verified in the AWS SES console for the region (`ap-south-1` by default).
- If you use temporary credentials, set `AWS_SESSION_TOKEN`.
- Permission required: `ses:SendEmail` (and related SES permissions) on the IAM identity.

Cross-platform run instructions

- Install dependencies (backend):

```bash
cd backend
npm install
```

- Start backend in development (auto-restarts on change):

Windows / macOS / Linux (same):
```bash
npx nodemon src/app.js
```

- Start frontend (dev-hub):
```bash
cd dev-hub
npm install
npm run dev
```

Testing and debugging
- Useful debug route: `GET /debug/aws` — returns booleans indicating whether AWS-related env vars are present (it does NOT reveal secrets).
- If you see `The security token included in the request is invalid` or `Resolved credential object is not valid`:
	- Verify `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` are correct and active.
	- If using temporary credentials include `AWS_SESSION_TOKEN`.
	- Run `aws sts get-caller-identity` (with same env vars) to validate the keys.
	- Ensure SES sender (`FROM_EMAIL`) is verified or the account is out of sandbox.

Quick troubleshooting commands
- Restart the backend:
```powershell
cd backend
npx nodemon src/app.js
```
- Check debug route (from another shell or browser):
```bash
curl http://localhost:3000/debug/aws
```
- Validate credentials with Node (no secrets printed):
```powershell
node -r dotenv/config -e "import('@aws-sdk/client-sts').then(({STSClient,GetCallerIdentityCommand})=>{const c=new STSClient({region:'ap-south-1',credentials:{accessKeyId:process.env.AWS_ACCESS_KEY_ID||process.env.AWS_ACCESS_KEY,secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY||process.env.AWS_SECRET_KEY,sessionToken:process.env.AWS_SESSION_TOKEN||process.env.AWS_TOKEN}});c.send(new GetCallerIdentityCommand({})).then(r=>console.log('STS OK')).catch(e=>console.error(e.message));})"
```

Additional notes
- Email sending is implemented in `src/utils/sendemail.js`. The current implementation logs errors and returns `null` on failure so the API endpoint still succeeds even if SES fails.
- If you want failed email delivery to block the request, change `sendemail.js` to re-throw errors (not recommended for production user flows).

If you want, I can also add a short helper script to validate env values or an admin endpoint to retry failed emails.

