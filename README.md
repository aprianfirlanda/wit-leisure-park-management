# WIT Leisure Park Management System

Fullstack application for managing WIT Leisure Park operations.

## Tech Stack

### Backend
- Go 1.25.5
- Cobra CLI
- Fiber
- PostgreSQL 14
- pgx (raw SQL driver)

---

# Backend Setup

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

## 3. Clone Repository

```bash
git clone https://github.com/aprianfirlanda/wit-leisure-park-management.git
cd wit-leisure-park-management/backend
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

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=wit_db
```

---

## 6. Run HTTP Server

```bash
go run main.go http
```
or
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
