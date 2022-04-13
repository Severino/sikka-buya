filepath="$(dirname "$0")/../migrations/schema.sql"

pg_dump --file $(filepath)  --schema-only --no-password coins