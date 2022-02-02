ALTER TABLE
    notes RENAME TO comment;

CREATE TABLE note(
    text text,
    property varchar(40),
    property_id int,
    UNIQUE(property, property_id)
);