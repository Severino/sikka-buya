ALTER TABLE
    type
ADD
    "search_vectors" tsvector;

Create INDEX idx_search_vectors ON types USING gin(search_vectors);