DROP TABLE web_page CASCADE;

DROP TABLE web_page_image CASCADE;

DROP TABLE web_page_group CASCADE;

DROP TABLE web_page_block CASCADE;

CREATE TABLE web_page_image (
    id SERIAL PRIMARY KEY,
    url TEXT,
    uploaded TIMESTAMP
);

CREATE TABLE web_page_group (id SERIAL PRIMARY KEY, name TEXT);

CREATE TABLE web_page (
    id SERIAL PRIMARY KEY,
    title TEXT,
    subtitle TEXT,
    image INTEGER references web_page_image(id),
    summary TEXT,
    body TEXT,
    page_group INTEGER references web_page_group(id),
    created_timestamp TIMESTAMP NOT NULL,
    modified_timestamp TIMESTAMP NOT NULL,
    published_timestamp TIMESTAMP,
    author INTEGER references app_user(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE web_page_block (
    id SERIAL PRIMARY KEY,
    type TEXT NOT NULL,
    position INTEGER NOT NULL,
    text TEXT,
    image INTEGER references web_page_image(id),
    page INTEGER references web_page(id) ON DELETE CASCADE ON UPDATE CASCADE,
    parent INTEGER references web_page_block(id) ON DELETE CASCADE ON UPDATE CASCADE
);