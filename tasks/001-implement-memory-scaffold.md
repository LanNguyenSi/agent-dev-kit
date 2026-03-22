# Task 001: Memory Scaffold umsetzen

## Prioritaet

Hoch

## Problem

Das Feature `memory` wird in der CLI angeboten, erzeugt aktuell aber keine echte Memory-Integration, keine Verzeichnisstruktur und keine Minimalimplementierung.

## Ziel

Ein Agent mit `--features=memory` soll ein nachvollziehbares, lauffaehiges Grundgeruest fuer Memory enthalten.

## Vorschlag

- `src/memory/` mit Minimalstruktur erzeugen
- einfache Memory-Schnittstelle und lokale Stub-Implementierung anlegen
- `.env.example` und README des generierten Projekts passend erweitern
- falls notwendig optionale Dependencies fuer den Scaffold definieren

## Acceptance Criteria

- `agent-dev create my-agent --features=memory --no-git --no-install` erzeugt `src/memory/`
- generierter Code baut ohne manuelle Nacharbeit
- generierte README erklaert die Memory-Komponente korrekt
- Tests decken den neuen Scaffold-Pfad ab
