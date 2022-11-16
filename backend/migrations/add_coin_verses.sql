CREATE TABLE coin_verse (
    id serial primary key,
    name TEXT
);

CREATE TABLE type_coin_verse (
    type INT REFERENCES type ON UPDATE CASCADE ON DELETE CASCADE,
    coin_verse INT REFERENCES coin_verse ON UPDATE CASCADE ON DELETE RESTRICT
);

