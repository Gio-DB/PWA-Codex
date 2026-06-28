# Content Hub PWA

Statische PWA fuer GitHub Pages mit Home, Songs, Notes und Sonstiges.

## Seitenstruktur

### index.html vs. detail.html

Die App nutzt zwei HTML-Einstiegspunkte, die vom JavaScript gesteuert werden:

- **index.html** - Die Startseite (Hub). Zeigt die Kategorieübersicht (Home, Songs, Notes, Sonstiges) mit Karten, die `homeImage` und `homeTextFile` nutzen. Das `data-page="home"` Attribut teilt dem JavaScript mit, welcher Seitentyp geladen wird.

- **detail.html** - Die Detailseite für einzelne Items. Zeigt einen Content mit Medienframe (Audio/Video), Lyrics und PDF. Das `data-page="detail"` Attribut steuert die Detail-Ansicht. Diese Seite wird aufgerufen, wenn man auf ein Item klickt.

- **songs.html, notes.html, sonstiges.html** - Kategorieseiten für die einzelnen Sammlungen. Zeigen das Grid der Items einer Kategorie mit `image` und `text`/`textFile`.

- **player.html** - Mediaplayer-Interface für Audio- und Videoinhalte mit spezieller Steuerung.

## Inhalt pflegen

- Die Anzahl der Grids auf den Unterseiten steht in `data/content.json` unter `sections[].items`.
- Home-Karten nutzen `homeImage` und `homeTextFile`.
- Unterseiten-Karten nutzen `image`, `text` oder `textFile`.
- Detailseiten nutzen `media`, `lyricsFile` und `pdf`.
- Fuer YouTube-Videos `media.kind` auf `youtube` setzen und `media.src` als Embed-URL eintragen.
- Fuer interne Audios `media.kind` auf `internal-audio` setzen und `media.src` auf eine lokale Audiodatei zeigen lassen.

## Lokal testen

```bash
python3 -m http.server 4173
```

Dann im Browser `http://localhost:4173/` oeffnen.

## Projektstruktur

```
PWA-Codex/
├── index.html                    # Startseite (Hub) - zeigt Kategorieübersicht
├── detail.html                   # Detailseite für einzelne Items (Audio, Video, Lyrics, PDF)
├── songs.html                    # Kategorieseite für Songs
├── notes.html                    # Kategorieseite für Notes/Notizen
├── sonstiges.html                # Kategorieseite für Sonstiges
├── player.html                   # Media-Player Interface für Audio/Video
├── manifest.webmanifest          # PWA Manifest - App-Metadaten, Icons, Display-Modi
├── sw.js                         # Service Worker - Offline-Funktionalität und Caching
├── README.md                     # Diese Dokumentation
│
├── data/
│   └── content.json              # Zentrale Konfiguration aller Inhalte (Kategorien, Items, Medien)
│
└── assets/
    ├── css/
    │   └── styles.css            # Globale Styles für alle Seiten (Responsives Design, PWA)
    │
    ├── js/
    │   └── app.js                # Haupt-JavaScript - Router, DOM-Manipulation, Datenladung
    │
    ├── icons/
    │   ├── icon-*.png            # App-Icons in verschiedenen Größen (192x192, 512x512, etc.)
    │   └── ...
    │
    ├── images/
    │   ├── home-*.png            # Home-Kategoriebilder (home-songs.png, home-notes.png, etc.)
    │   ├── song-*.png            # Song-Kategoriebilder
    │   ├── note-*.png            # Notes-Kategoriebilder
    │   └── ...                   # Weitere Content-Bilder
    │
    ├── audio/
    │   ├── acoustic-loop.wav      # Beispiel-Audiodatei für interne Audio-Frames
    │   └── ...                   # Weitere Audiodateien
    │
    ├── pdfs/
    │   ├── song-sheet.pdf        # Lead-Sheets und Noten-PDFs
    │   └── ...                   # Weitere PDF-Dokumente
    │
    └── text/
        ├── home-*.txt            # Beschreibungstexte für Home-Kategorien
        ├── lyrics-*.txt          # Lyrics und Textinhalte für Items
        └── ...
```

### Funktionsweise

1. **app.js** liest `data/content.json` und rendert basierend auf der aktuellen Seite (`data-page`):
   - `home`: Zeigt Kategorien mit `homeImage` und Text aus `homeTextFile`
   - `songs`/`notes`/`sonstiges`: Zeigt Items mit Bildern und Text
   - `detail`: Zeigt einzelnes Item mit Media, Lyrics und PDF

2. **sw.js** (Service Worker) ermöglicht Offline-Nutzung durch Caching von Assets

3. **manifest.webmanifest** definiert PWA-Eigenschaften für Installation auf Homescreen

## Auf GitHub Pages veroeffentlichen

1. Neues GitHub-Repository erstellen.
2. Den Inhalt dieses Ordners in das Repository kopieren.
3. Committen und auf `main` pushen.
4. In GitHub unter `Settings > Pages > Build and deployment` die Quelle `GitHub Actions` auswaehlen.
5. Der Workflow `.github/workflows/pages.yml` veroeffentlicht die statische Seite automatisch.

GitHub Pages stellt die Seite danach unter `https://<user>.github.io/<repo>/` bereit.
