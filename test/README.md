# Sikka Tests

Um die Funktionsfähigkeit neuer Versionen zu gewährleisten,
sodass keine fehlerhaften Versionen, die mitunter zu Datenverlust führen könnten,
hochgeladen werden, müssen die Tests gepflegt und vor jedem neuen Release
durchgeführt werden.

Dieses Dokument gibt die entsprechenden Informationen, wie die Tests gehandhabt werden und gepflegt
werden können.

## Datenbankschema

Wenn sich die Datenbank ändert muss auch das Schema im Testordner angepasst werden.
Hierfür wird eine 'nur-Schema' export mit pg_dump durchgeführt.

```
pg_dump.exe -U postgres -d coins --data-only -f coins_schema.sql
```
