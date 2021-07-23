\c coins;

ALTER TABLE mint RENAME COLUMN geometry TO location;

ALTER TABLE mint ADD uncertain_area geometry;