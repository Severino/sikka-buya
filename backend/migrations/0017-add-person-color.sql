CREATE TABLE person_color (
    person int unique NOT NULL,
    color character(7),
    FOREIGN KEY (person) REFERENCES person(id) ON UPDATE CASCADE ON DELETE CASCADE
);