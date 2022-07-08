SELECT
    t.id,
    unnset(issuers, overlords) as rulers
FROM
    type t
    LEFT JOIN (
        SELECT
            o.type,
            COALESCE(array_agg(o.person)) as overlords
        FROM
            overlord o
        GROUP BY
            o.type
    ) overlord_query ON overlord_query.type = t.id
    LEFT JOIN (
        SELECT
            i.type,
            COALESCE(array_agg(i.person)) as issuers
        FROM
            issuer i
        GROUP BY
            i.type
    ) issuer_query ON issuer_query.type = t.id