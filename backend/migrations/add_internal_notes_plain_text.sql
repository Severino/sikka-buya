CREATE TABLE internal_notes_plain_text (
	text TEXT,
	type INTEGER unique references type(id) ON DELETE CASCADE ON UPDATE CASCADE
)