# WIT Leisure Park Management System

Fullstack application for managing WIT Leisure Park operations.

This project consists of:
- Backend API (Go + Fiber + PostgreSQL)
- Frontend Web App (Next.js + Tailwind + Headless UI)

---

## Architecture Overview
- Backend: REST API with JWT authentication
- Frontend: Next.js App Router
- Authentication: JWT stored in HTTP-only cookie
- Authorization: Role-based access (MANAGER, ZOOKEEPER)
- Database: PostgreSQL 14
- Clean Architecture / Hexagonal pattern (Backend)

---


## Tech Stack

### Backend
- Go 1.25.5
- Cobra CLI
- Fiber
- PostgreSQL 14
- pgx (raw SQL driver)

### Frontend
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Headless UI
- Heroicons
- HTTP-only cookie authentication
- Next.js Proxy Route for backend communication

---

## Project Structure

```text
wit-leisure-park-management/
│
├── backend/
│   ├── cmd/
│   ├── internal/
│   ├── migrations/
│   └── main.go
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── middleware.ts
│   └── next.config.ts
│
└── docker-compose.yml
```

---

# Backend Setup (Go)

## 1. Install Go

Make sure you are using:
```text
go version go1.25.5
```

If not installed, download from:
https://go.dev/dl/

---

## 2. Start PostgreSQL (Docker)
From the root directory:
```shell
docker compose up -d
```

This will start:
•	PostgreSQL 14
•	Exposed on port 5432

To stop:
```shell
docker compose stop
```

## 3. Navigate to Backend

```bash
cd ./backend
```

---

## 4. Install Dependencies

```bash
go mod tidy
```

---

## 5. Environment Configuration
Copy the example environment file:
```bash
cp .env.example .env
```

Then adjust the values inside .env as needed:
```bash
APP_PORT=8080

JWT_SECRET=supersecretkey

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=wit_db
```

---

### 6. Database Migration

This project uses SQL migration files located in:
```text
./migrations
```

#### Run Migration (Up)

Apply all migrations:
```shell
go run . migrate up
```

#### Rollback Migration (Down)

Rollback last migration:
```shell
go run . migrate down
```

---

### 7. Seed Initial Data

To insert default users:
```shell
go run . seed
```

This will create:

| Role      | Username   | Password    |
|-----------|------------|-------------|
| MANAGER   | manager1   | password123 |
| ZOOKEEPER | zookeeper1 | password123 |

---

## 6. Run HTTP Server

```bash
go run . http
```

Server will run at:
```
http://localhost:8080
```

Health check endpoint:
```text
GET /health
```

---

# Frontend Setup (Next.js)

## 1. Navigate to Frontend
```shell
cd ./frontend
```

---

## 2. Install Dependencies
```shell
npm install
```

---

## 3. Environment Configuration

Copy the example environment file:
```bash
cp example.env.local .env.local
```

Then adjust the values inside .env as needed:
```text
NEXT_PUBLIC_APP_NAME=WIT Leisure Park
BACKEND_URL=http://localhost:8080
```

---

## 4. Run Frontend

```shell
npm run dev
```

Frontend runs at:
```text
http://localhost:3000
```

# API Testing with Postman

This project includes a ready-to-use Postman collection and environment.

## Included Files

Located in the project root:
- WIT - Leisure Park.postman_collection.json  ￼
- WIT - Leisure Park Environment.postman_environment.json  ￼

## Import to Postman

### 1. Import Collection

1.	Open Postman
2.	Click Import
3.	Select:
```text
WIT - Leisure Park.postman_collection.json
```

### 2. Import Environment

1.	Click Import
2.	Select:
```text
WIT - Leisure Park Environment.postman_environment.json
```
