# Navigationserweiterung: Limit auf 3 Einträge mit Overflow-Menü

## Ziel

Das Ziel ist, die Hauptnavigation sowohl im Desktop- als auch im Mobilmodus auf maximal drei direkte Links zu begrenzen. Wenn es mehr als drei Navigationseinträge gibt, soll ein zusätzlicher Dropdown-Button (`Mehr`) die verbleibenden Links anzeigen.

## Warum

- Vermeidet zu viele Navigationselemente in der oberen Leiste bzw. in der fixierten mobilen Leiste.
- Verbessert die Übersichtlichkeit bei schmalen und breiten Bildschirmen.
- Erhält die gleiche Navigation für Desktop und Mobile durch eine gemeinsame Render-Logik.

## Was geändert werden soll

### 1. `assets/js/app.js`

- In `renderNav(data, activeKey)` die Navigation `navItems` in zwei Gruppen aufteilen:
  - `visibleItems` = erste 3 Einträge
  - `overflowItems` = restliche Einträge

- Die sichtbaren Einträge wie bisher rendern.

- Wenn `overflowItems.length > 0`, zusätzlich ein `Mehr`-Element hinzufügen:
  - Der Button sollte mit einer eindeutigen CSS-Klasse versehen sein, z. B. `nav-more-toggle`.
  - Dazu kommt ein versteckter Container für die übrigen Links, z. B. `nav-more-menu`.

- Den Rest der Links im Overflow-Menü als normale `nav-link`-Elemente rendern.

- Optional: Eine JavaScript-Toggle-Funktion hinzufügen, die das Overflow-Menü bei Klick öffnet und schließt.

### 2. `assets/css/styles.css`

- Neue Styles für das Overflow-Menü definieren:
  - `.nav-more` für den Button-Wrapper.
  - `.nav-more-toggle` für den `Mehr`-Button.
  - `.nav-more-menu` für den versteckten Menübereich.
  - `.nav-more-menu.open` oder `.nav-more-menu[data-open="true"]` zur Steuerung der Sichtbarkeit.

- Layout-Verhalten festlegen:
  - Desktop: Dropdown-Menü kann relativ zur Desktop-Navigation positioniert werden.
  - Mobile: Menü sollte über der fixierten `.mobile-nav` angezeigt werden, ohne die Leiste zu überlagern.

- Sicherstellen, dass die bestehenden Regeln für `.desktop-nav` und `.mobile-nav` intakt bleiben:
  - Desktop zeigt `display: flex` bei `@media (min-width: 760px)`
  - Mobile zeigt `position: fixed; bottom: 0;` und ist bei breiter Ansicht ausgeblendet

## Weitere Details

- Die eigentliche Navigationserzeugung bleibt zentral in `renderNav`.
- `desktop-nav` und `mobile-nav` erhalten denselben HTML-Inhalt aus `renderNav`, daher ist die Änderung konsistent für beide Ansichten.
- Wenn es nur drei oder weniger Links gibt, wird kein `Mehr`-Button benötigt.
- Der `Mehr`-Button soll für Barrierefreiheit `aria-expanded` verwenden und das Menü z. B. mit `aria-controls` verbinden.

## Vorschlag für die Implementierung

1. `renderNav` aufteilen:
   - `const visibleItems = navItems.slice(0, 3);`
   - `const overflowItems = navItems.slice(3);`

2. Markup generieren:
   - `const visibleMarkup = visibleItems.map(...).join("");`
   - `const overflowMarkup = overflowItems.map(...).join("");`
   - Den `desktop-nav` und `mobile-nav` beide befüllen.

3. Toggle-Mechanik:
   - Ein Event-Listener auf `document` oder direkt auf den `Mehr`-Button.
   - `menu.classList.toggle("open")`
   - Optional: bei Klick außerhalb schließen.

4. CSS-Beispiel (konzeptionell):
   - `.nav-more-menu { display: none; }`
   - `.nav-more-menu.open { display: block; }`

## Hinweis

Diese Dokumentation beschreibt die gewünschte Funktion, aber führt die Änderung nicht direkt aus. Sie ist als Arbeitsanweisung nutzbar, wenn die Implementierung später erfolgen soll.
