# Task 002: Skills Scaffold umsetzen

## Prioritaet

Hoch

## Problem

Das Feature `skills` wird dokumentiert, erzeugt aber derzeit weder Verzeichnisse noch Loader oder Templates.

## Ziel

Ein Agent mit `--features=skills` soll eine brauchbare Skills-Grundstruktur bekommen.

## Vorschlag

- `src/skills/` mit Loader und Beispielskill anlegen
- `SKILL.md`- oder aehnliche Template-Datei erzeugen
- generierte README und `.ai`-Dokumentation an den echten Output anpassen

## Acceptance Criteria

- `agent-dev create my-agent --features=skills --no-git --no-install` erzeugt `src/skills/`
- der generierte Agent referenziert die Skills-Struktur konsistent
- README und Templates nennen nur Dateien, die wirklich existieren
- Tests decken den Skills-Scaffold ab
