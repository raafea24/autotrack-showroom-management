# AutoTrack Showroom Management

AutoTrack is a web-based vehicle showroom prototype designed to centralize customer access, staff workflows, and administrative views for inventory, bookings, users, feedback, reports, and support requests.

## Current implementation

- Responsive public landing, vehicle catalogue, contact, login, and registration pages
- Role-based admin, staff, and customer dashboards
- Express REST endpoints for account registration and login
- MySQL-backed user records with bcrypt password hashing
- One-hour JSON Web Tokens containing username and role claims
- Client-side dashboard tools for searching and managing demonstration data

The authentication flow is connected to MySQL. Dashboard vehicle, booking, user, feedback, report, and support data is currently held in browser-side JavaScript and is not persisted by backend APIs.

## Technology

- HTML5, CSS3, JavaScript, and Bootstrap
- Node.js and Express 5
- MySQL through `mysql2`
- `bcrypt` for password hashing
- `jsonwebtoken` for login tokens
- EmailJS integration point for the contact form

## Project structure

```text
autotrack-backend/
  db.js                 MySQL connection configuration
  index.js              Registration and login API
  package.json          Backend dependencies and scripts
frontend/
  index.html            Public landing page
  login.html            Registration/login interface
  *-dashboard.html      Role-oriented dashboards
  vehicles.html         Vehicle catalogue
  contact.html          Contact form and map
  images/               Interface and vehicle imagery
database_schema.sql     MySQL user-table schema
.env.example            Required runtime configuration template
```

## Setup

Requires Node.js 18 or newer and MySQL 8 or a compatible server.

### 1. Install backend dependencies

```powershell
cd autotrack-backend
npm ci
```

### 2. Configure MySQL

Create the database and apply the schema:

```powershell
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS autotrack_showroom_management_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -u root -p autotrack_showroom_management_system < ..\database_schema.sql
```

Set runtime values in the terminal. Do not commit real credentials.

```powershell
$env:PORT = "3000"
$env:JWT_SECRET = "replace-with-a-long-random-secret"
$env:DB_HOST = "localhost"
$env:DB_PORT = "3306"
$env:DB_USER = "root"
$env:DB_PASSWORD = "your-local-password"
$env:DB_NAME = "autotrack_showroom_management_system"
```

### 3. Start the API

```powershell
npm start
```

### 4. Serve the frontend

From the repository root, use any static HTTP server. For example:

```powershell
python -m http.server 5500 --directory frontend
```

Open `http://localhost:5500`. The login page expects the API at `http://localhost:3000`.

## Contact form

The repository does not contain account-specific EmailJS identifiers. To enable the contact form, replace the three `YOUR_EMAILJS_*` constants near the end of `frontend/contact.html` with identifiers from your own EmailJS account.

## Validation

```powershell
cd autotrack-backend
npm test
```

This performs syntax validation for the backend entry points. Full authentication testing additionally requires a configured MySQL instance.

## Security notes

- Keep `JWT_SECRET` and database credentials outside source control.
- Passwords are stored as bcrypt hashes, not plaintext.
- The present dashboards do not validate JWTs or call protected CRUD APIs; production deployment requires authorization middleware and server-side persistence for those workflows.
- Review image and third-party service licensing before commercial deployment.

## Provenance

The supplied project snapshot did not include Git history or author metadata. This publication does not infer or reassign authorship.
