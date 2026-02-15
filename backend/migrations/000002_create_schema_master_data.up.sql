CREATE TABLE cages
(
    id         BIGSERIAL PRIMARY KEY,
    public_id  UUID        NOT NULL UNIQUE,
    code       VARCHAR(50) NOT NULL UNIQUE,
    location   VARCHAR(255),
    created_at TIMESTAMP   NOT NULL DEFAULT NOW()
);

CREATE TABLE animals
(
    id            BIGSERIAL PRIMARY KEY,
    public_id     UUID         NOT NULL UNIQUE,
    name          VARCHAR(100) NOT NULL,
    species       VARCHAR(100) NOT NULL,
    cage_id       BIGINT       NOT NULL REFERENCES cages (id) ON DELETE RESTRICT,
    date_of_birth DATE,
    created_at    TIMESTAMP    NOT NULL DEFAULT NOW()
);
