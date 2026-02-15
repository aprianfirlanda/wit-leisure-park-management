CREATE TABLE cages
(
    id         BIGSERIAL PRIMARY KEY,
    public_id  UUID        NOT NULL UNIQUE,
    code       VARCHAR(50) NOT NULL UNIQUE,
    location   VARCHAR(255),
    created_at TIMESTAMP   NOT NULL DEFAULT NOW()
);
