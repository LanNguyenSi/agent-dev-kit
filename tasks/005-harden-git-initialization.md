# Task 005: Git-Initialisierung robuster machen

## Prioritaet

Mittel

## Problem

`agent-dev create` fuehrt standardmaessig einen Commit aus. Das scheitert auf Maschinen ohne gesetzte Git-Identity.

## Ziel

Der Default-Flow soll robust sein und bei fehlender Git-Konfiguration nicht mit einem schwer verstaendlichen Fehler enden.

## Vorschlag

- vor `git commit` `user.name` und `user.email` pruefen
- bei fehlender Konfiguration klaren Hinweis ausgeben und Commit ueberspringen oder sauber abbrechen
- optional `--git-init-only` oder aehnlichen Fallback erwaegen

## Acceptance Criteria

- fehlende Git-Identity wird explizit erkannt
- CLI-Ausgabe erklaert den naechsten Schritt fuer Nutzer klar
- Tests decken den Fehler- oder Fallbackpfad ab
