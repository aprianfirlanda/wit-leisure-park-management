# API SPECIFICATION

## 1. POST /auth/login
requests:
```json
{
  "username": "manager1",
  "password": "secret"
}
```

response:
```json
{
  "access_token": "...",
  "expires_in": 3600
}
```
