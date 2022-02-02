CREATE TABLE person_explorer_custom_sorting (
    position int,
    person int unique,
    FOREIGN KEY (person) REFERENCES person(id)
);