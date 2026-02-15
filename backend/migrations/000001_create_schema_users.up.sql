-- 1. Create ENUM for roles
CREATE TYPE user_role AS ENUM (
    'MANAGER',
    'ZOOKEEPER'
    );

-- 2. Users table
CREATE TABLE users
(
    id            BIGSERIAL PRIMARY KEY,
    public_id     UUID               NOT NULL UNIQUE,
    username      VARCHAR(50) UNIQUE NOT NULL,
    password_hash TEXT               NOT NULL,
    role          user_role          NOT NULL,
    created_at    TIMESTAMP          NOT NULL DEFAULT NOW()
);

-- 3. Zookeeper Managers table
CREATE TABLE zookeeper_managers
(
    id         BIGSERIAL PRIMARY KEY,
    public_id  UUID         NOT NULL UNIQUE,
    user_id    BIGINT       NOT NULL UNIQUE,
    name       VARCHAR(100) NOT NULL,
    created_at TIMESTAMP    NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_manager_user
        FOREIGN KEY (user_id)
            REFERENCES users (id)
            ON DELETE CASCADE
);

-- 4. Zookeepers table
CREATE TABLE zookeepers
(
    id         BIGSERIAL PRIMARY KEY,
    public_id  UUID         NOT NULL UNIQUE,
    user_id    BIGINT       NOT NULL UNIQUE,
    manager_id BIGINT       NOT NULL,
    name       VARCHAR(100) NOT NULL,
    created_at TIMESTAMP    NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_zookeeper_user
        FOREIGN KEY (user_id)
            REFERENCES users (id)
            ON DELETE CASCADE,
    CONSTRAINT fk_zookeeper_manager
        FOREIGN KEY (manager_id)
            REFERENCES zookeeper_managers (id)
            ON DELETE RESTRICT
);
