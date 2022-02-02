ALTER TABLE
    type
ADD
    "search_vectors" tsvector;

Create INDEX idx_search_vectors ON type USING gin(search_vectors);