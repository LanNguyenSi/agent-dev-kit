# Task 004: README und Templates mit dem echten Scaffold abgleichen

## Prioritaet

Mittel

## Problem

README und `.ai`-Templates referenzieren aktuell Dateien und Komponenten, die der Generator nicht erzeugt.

## Ziel

Dokumentation und erzeugte Dateien sollen konsistent sein.

## Vorschlag

- entscheiden: entweder Generator auf die dokumentierte Struktur erweitern oder Dokumentation auf den realen Output reduzieren
- `ARCHITECTURE.md.hbs`, `AGENTS.md.hbs`, `DECISIONS.md.hbs` fuer JS-/TS-Unterschiede sauber machen
- generierte Projekt-README an echte Dateinamen koppeln

## Acceptance Criteria

- keine Doku referenziert mehr nicht existierende Dateien
- JS-Scaffolds behaupten nicht mehr TypeScript als Technologieentscheidung
- Snapshot- oder Inhalts-Tests pruefen die Konsistenz wichtiger Templates
