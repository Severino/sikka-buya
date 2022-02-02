CREATE TABLE notes (
    id SERIAL,
    text varchar(200),
    property varchar(40),
    property_id int,
    time timestamp default NOW(),
    user_id int,
    PRIMARY KEY (id)
);