CREATE TABLE province (
    id SERIAL,
    name varchar(40) UNIQUE,
    PRIMARY KEY (id)
);

ALTER TABLE
    mint
ADD
    province integer;

ALTER TABLE
    mint
ADD
    CONSTRAINT fk_province FOREIGN KEY (province) REFERENCES province (id);