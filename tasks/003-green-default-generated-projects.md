# Task 003: Generierte Projekte standardmaessig gruen machen

## Prioritaet

Hoch

## Problem

Neu generierte Projekte starten aktuell mit einem absichtlich fehlschlagenden `npm test`.

## Ziel

Ein frisch generiertes Projekt soll direkt einen vernuenftigen Ausgangszustand fuer lokale Entwicklung und CI haben.

## Vorschlag

- minimales Test-Setup im Scaffold erzeugen
- `test`-Script auf eine funktionierende Standardausfuehrung setzen
- optional `format` oder `lint`-Grundlagen mit erzeugen
- eine kleine Beispieltestdatei mitliefern

## Acceptance Criteria

- ein frisch generiertes Projekt kann nach `npm install` erfolgreich `npm test` ausfuehren
- TypeScript- und JavaScript-Scaffolds haben sinnvolle Testdefaults
- Tests fuer den Generator pruefen den gruenden Startzustand
