# Task 006: Feature-Flags strikt validieren

## Prioritaet

Mittel

## Problem

Die aktuelle Feature-Erkennung basiert auf `includes()` auf dem Rohstring und ist dadurch zu permissiv und fehleranfaellig.

## Ziel

Feature-Flags sollen eindeutig, validiert und fehlertolerant verarbeitet werden.

## Vorschlag

- CSV-Wert sauber splitten und trimmen
- erlaubte Features zentral definieren
- unbekannte Feature-Namen mit klarer Fehlermeldung ablehnen
- Tests fuer Grenzfaelle wie Leerzeichen, Duplikate und unbekannte Werte ergaenzen

## Acceptance Criteria

- nur bekannte Features werden akzeptiert
- Eingaben wie `memory, skills` funktionieren korrekt
- unbekannte Features liefern eine klare CLI-Fehlermeldung
- Tests decken Parsing und Validation ab
