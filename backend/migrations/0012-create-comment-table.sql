CREATE TABLE notes (
    id SERIAL,
    text varchar(40) UNIQUE,
    property varchar(200),
    property_id int,
    time timestamp default NOW(),
    user_id int,
    PRIMARY KEY (id)
);