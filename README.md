# Content Hub PWA

Statische PWA fuer GitHub Pages mit Home, Songs, Notes und Sonstiges.

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

## Auf GitHub Pages veroeffentlichen

1. Neues GitHub-Repository erstellen.
2. Den Inhalt dieses Ordners in das Repository kopieren.
3. Committen und auf `main` pushen.
4. In GitHub unter `Settings > Pages > Build and deployment` die Quelle `GitHub Actions` auswaehlen.
5. Der Workflow `.github/workflows/pages.yml` veroeffentlicht die statische Seite automatisch.

GitHub Pages stellt die Seite danach unter `https://<user>.github.io/<repo>/` bereit.
