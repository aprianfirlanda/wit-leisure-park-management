# API SPECIFICATION

### Authentication

### 1. POST /auth/login

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

Use token in protected routes:
```text
Authorization: Bearer <access_token>
```

## Manage Zookeeper Manager Data
Access: MANAGER only

### 1. POST /api/managers

requests:
```json
{
  "username": "manager2",
  "password": "password123",
  "name": "Second Manager"
}
```

response:
```json
{
  "public_id": "018f3c6a-8b2f-7c2e-b123-...",
  "username": "manager2",
  "name": "Second Manager",
  "role": "MANAGER"
}
```

### 2. GET /api/managers

response:
```json
[
  {
    "public_id": "...",
    "username": "manager1",
    "name": "Main Manager"
  }
]
```

### 3. GET /api/managers/:public_id

response:
```json
{
  "public_id": "018f3c6a-...",
  "username": "manager1",
  "name": "Main Manager"
}
```

### 4. PUT /api/managers/:public_id

requests:
```json
{
  "name": "Updated Name"
}
```


### 5. DELETE /api/managers/:public_id


## Manage Zookeeper Data
Access: MANAGER only

### 1. POST /api/zookeepers

requests:
```json
{
  "username": "zookeeper2",
  "password": "password123",
  "name": "Zookeeper Two"
}
```

response:
```json
{
  "public_id": "018f3c6a-8b2f-7c2e-b123-...",
  "username": "zookeeper2",
  "name": "Zookeeper Two",
  "role": "ZOOKEEPER"
}
```

### 2. GET /api/zookeepers

response:
```json
[
  {
    "public_id": "018f3c6a-...",
    "username": "zookeeper1",
    "name": "Zookeeper One"
  }
]
```

### 3. GET /api/managers/:public_id

response:
```json
{
  "public_id": "018f3c6a-...",
  "username": "manager1",
  "name": "Main Manager"
}
```

### 4. PUT /api/zookeepers/:public_id

requests:
```json
{
  "name": "Updated Name"
}
```


### 5. DELETE /api/zookeepers/:public_id

