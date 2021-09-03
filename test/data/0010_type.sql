INSERT INTO
    type (
        project_id,
        treadwell_id,
        material,
        mint,
        mint_as_on_coin,
        nominal,
        procedure,
        year_of_mint,
        donativ,
        caliph,
        front_side_field_text,
        front_side_inner_inscript,
        front_side_intermediate_inscript,
        front_side_outer_inscript,
        front_side_misc,
        back_side_field_text,
        back_side_inner_inscript,
        back_side_intermediate_inscript,
        back_side_outer_inscript,
        back_side_misc,
        cursive_script,
        literature,
        specials,
        internal_notes,
        mint_uncertain,
        year_uncertain
    )
VALUES
    (
        'GER1989',
        'GD89',
        1,
        /*Gold*/
        1,
        /*Berlin*/
        'Börlin',
        2,
        /*1 Mark*/
        'pressed',
        1989,
        true,
        4,
        /* Karl der Große */
        '<div>Abbildung des deutschen Michels</div>',
        '<div>Danach lasst uns alle streben</div>',
        '<div>für das deutsche Vaterland!</div>',
        '<div>Einigkeit und Recht und Freiheit</div>',
        '<div>Michel ohne Mütze</div>',
        '<div>Abbildung eines Birnbaums</div>',
        '<div>Und kam die goldene Herbsteszeit,</div>',
        '<div>Ein Birnbaum in seinem Garten stand,</div>',
        '<div>Herr von Ribbeck auf Ribbeck im Havelland,</div>',
        '<div>Birnbaum ohne Früchte</div>',
        false,
        '<div style=" text - align: center;">Av: Nationalhymne</div><div style=" text - align: center;">Rev. Gedicht Fontane</div>',
        '<div style=" text - align: center;">Keine</div>',
        '<div style=" text - align: center;">Bitte nochmal neu!</div>',
        false,
        false
    ),
    (
        'FRévô1789',
        'FR1789',
        4,
        /*Silber*/
        2,
        /*Paris*/
        'Paris',
        3,
        /*1 Taler*/
        'cast',
        1789,
        true,
        11,
        /* Louis XVI */
        '<div>Abb. Französische Flagge</div>',
        '<div>Contre nous de la tyrannie</div>',
        '<div>Le jour de gloire est arrivé!</div>',
        '<div>Allons enfants de la Patrie,</div>',
        '<div>Flagge wehend</div>',
        '<div>Französischer Hahn</div>',
        '<div>Fraternité</div>',
        '<div>Égalité</div>',
        '<div>Liberté</div>',
        '<div>Hahn trägt Hose</div>',
        false,
        '<div style=" text - align: center;">Av: Nationalhymne</div><div style=" text - align: center;">Rev. revolutionärer Asusspruch</div>',
        '<div style=" text - align: center;">Revolutionsmünze mit König</div>',
        '<div style=" text - align: center;">Unfug</div>',
        true,
        true
    )