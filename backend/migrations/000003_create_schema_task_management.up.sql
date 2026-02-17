CREATE TYPE task_status AS ENUM (
    'PENDING',
    'IN_PROGRESS',
    'DONE'
    );

CREATE TABLE tasks
(
    id           BIGSERIAL PRIMARY KEY,
    public_id    UUID         NOT NULL UNIQUE,

    title        VARCHAR(150) NOT NULL,
    description  TEXT,

    manager_id   BIGINT       NOT NULL,
    zookeeper_id BIGINT       NOT NULL,
    animal_id    BIGINT,

    status       task_status  NOT NULL DEFAULT 'PENDING',
    due_date     DATE,

    created_at   TIMESTAMP    NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_task_manager
        FOREIGN KEY (manager_id)
            REFERENCES users (id)
            ON DELETE CASCADE,

    CONSTRAINT fk_task_zookeeper
        FOREIGN KEY (zookeeper_id)
            REFERENCES users (id)
            ON DELETE CASCADE,

    CONSTRAINT fk_task_animal
        FOREIGN KEY (animal_id)
            REFERENCES animals (id)
            ON DELETE SET NULL
);
