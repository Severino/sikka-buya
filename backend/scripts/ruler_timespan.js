//SELECT min(year_of_mint) AS from, max(year_of_mint)AS to FROM type t WHERE t.caliph=36 AND year_of_mint ~ '^([0-9]+)$' 

const { Database } = require('../src/utils/database');

let colors = ["#54c8b8",
    "#b451ba",
    "#83cd50",
    "#4c2973",
    "#509738",
    "#6d6bcd",
    "#d2b64e",
    "#6e98d4",
    "#d14a46",
    "#7dcc84",
    "#d571a5",
    "#396a35",
    "#802b40",
    "#848439",
    "#bc733e"]

async function main() {

    const rows = await Database.query(`
WITH rulers as((SELECT person, type, 'overlord' as is from overlord )
     UNION ALL
     (SELECT person, type, 'issuer' as is from issuer )
     UNION ALL
     (SELECT caliph as person, id AS type, 'caliph' as is from type)
UNION ALL
     (SELECT person, type, 'heir' as is from other_person LEFT JOIN person as pt ON person = pt.id LEFT JOIN person_role ON pt.role = person_role.id WHERE person_role.name='heir')
     	)
     	SELECT person, MIN(year_of_mint) AS from, MAX(year_of_mint) AS to, (MAX(year_of_mint)::int - MIN(year_of_mint)::int + 1) AS span  FROM rulers
     	LEFT JOIN type ON type.id = rulers.type 
     	WHERE person IS NOT NULL AND year_of_mint ~ '^([0-9]+)$' 
     	GROUP BY person
         ORDER BY MIN(year_of_mint) 
`)


    if (rows.length > 0) {
        let active = []


        let first = rows[0]
        const startYear = first.from
        let year = startYear
        let max = 0
        let maxYear = 0

        colors = colors.reverse()
        let activeColors = {}

        while (rows.length > 0) {


            while (rows.length > 0 && rows[0].from == year) {
                let item = rows.shift()
                active.push(item)
                active.sort((a, b) => a.to - b.to)
                let activeColor = colors.pop()
                activeColors[item.person] = activeColor

                await Database.query(`INSERT INTO person_color (person, color) VALUES ($[person], $[color]) ON CONFLICT (person) DO UPDATE SET color=$[color]`, { person: item.person, color: activeColor })
            }

            if (active.length > max) {
                max = active.length
                maxYear = year
            }

            while (active.length > 0 && active[0].to == year) {
                let item = active.shift()
                colors.unshift(activeColors[item.person])
                delete activeColors[item.person]
            }
            year++;

        }

        console.log(`Max of different colors is '${max}' in '${maxYear}'`)

    } else console.error("No results.")

}

main()