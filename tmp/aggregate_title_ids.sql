
SELECT type.*,
       COALESCE(type_titles.titles, '{}') as titles,
       COALESCE(type_honorifics.honorifics, '{}') as honorifics
FROM type
LEFT JOIN
    (SELECT o.type,
            COALESCE(ARRAY_AGG(title_id) FILTER (
                                                 WHERE title_id IS NOT NULL ), '{}') as titles
     FROM overlord o
     LEFT JOIN overlord_titles ot ON o.id = ot.overlord_id
     GROUP BY o.type) type_titles ON type_titles.type = type.id
LEFT JOIN
    (SELECT o.type,
            COALESCE(ARRAY_AGG(honorific_id) FILTER (
                                                     WHERE honorific_id IS NOT NULL ), '{}') as honorifics
     FROM overlord o
     LEFT JOIN overlord_honorifics ot ON o.id = ot.overlord_id
     GROUP BY o.type) type_honorifics ON type_honorifics.type = type.id