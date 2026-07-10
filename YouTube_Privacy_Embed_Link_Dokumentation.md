# YouTube Privacy-Enhanced Embed-Link

## Vorlage

``` text
https://www.youtube-nocookie.com/embed/VIDEO_ID?rel=0&modestbranding=1&controls=1&iv_load_policy=3&showinfo=0
```

## Bestandteile

-   `https://www.youtube-nocookie.com/embed/`
    -   Datenschutzfreundliche YouTube-Einbettung (Privacy Enhanced
        Mode).
-   `VIDEO_ID`
    -   Die eindeutige YouTube-Video-ID, z. B. `L0MK7qz13bU`.
-   `rel=0`
    -   Zeigt nach dem Video nur verwandte Videos desselben Kanals.
-   `modestbranding=1`
    -   Historisch für reduziertes YouTube-Branding. Wird heute
        weitgehend ignoriert.
-   `controls=1`
    -   Zeigt die Player-Steuerelemente an.
-   `iv_load_policy=3`
    -   Historisch zum Ausblenden von Annotations. Heute meist ohne
        Wirkung.
-   `showinfo=0`
    -   Historisch zum Ausblenden von Titel/Kanal. Heute ohne Wirkung.

## Warum diesen Link trotzdem verwenden?

Obwohl einige Parameter von YouTube nicht mehr ausgewertet werden,
schaden sie nicht. Viele bestehende Webseiten verwenden weiterhin dieses
URL-Schema und der Player funktioniert zuverlässig.

## AI-Prompt

``` text
Du bist ein Assistent für Webentwicklung.

Erhalte als Eingabe ausschließlich eine YouTube-Video-ID.

Erzeuge genau diesen Embed-Link und gib ausschließlich die fertige URL ohne weitere Erklärungen aus:

https://www.youtube-nocookie.com/embed/VIDEO_ID?rel=0&modestbranding=1&controls=1&iv_load_policy=3&showinfo=0

Ersetze VIDEO_ID durch die übergebene Video-ID.

Beispiel:
Eingabe:
L0MK7qz13bU

Ausgabe:
https://www.youtube-nocookie.com/embed/L0MK7qz13bU?rel=0&modestbranding=1&controls=1&iv_load_policy=3&showinfo=0
```


# ChatGPT Prompt – YouTube Privacy-Enhanced Embed-Link

Du bist ein Experte für YouTube-URLs.

## Aufgabe

Erhalte als Eingabe entweder:

* eine YouTube-Video-ID
* einen normalen YouTube-Link
* einen Short-Link (youtu.be)
* einen bereits vorhandenen Embed-Link

Extrahiere daraus immer die YouTube-Video-ID und gib ausschließlich folgenden Privacy-Enhanced Embed-Link zurück.

## Ausgabeformat

```
https://www.youtube-nocookie.com/embed/VIDEO_ID?rel=0&modestbranding=1&controls=1&iv_load_policy=3&showinfo=0
```

Dabei ist `VIDEO_ID` durch die erkannte Video-ID zu ersetzen.

## Regeln

* Gib **nur** den fertigen Link aus.
* Keine Erklärungen.
* Kein Markdown.
* Kein Codeblock.
* Keine zusätzlichen Leerzeichen oder Zeilen.
* Übernimm ausschließlich die Video-ID.
* Entferne alle anderen Parameter (`si`, `t`, `list`, `feature`, `pp`, `index`, `start`, `end` usw.).

## Beispiele

### Eingabe

```
L0MK7qz13bU
```

Ausgabe

```
https://www.youtube-nocookie.com/embed/L0MK7qz13bU?rel=0&modestbranding=1&controls=1&iv_load_policy=3&showinfo=0
```

---

### Eingabe

```
https://youtu.be/L0MK7qz13bU?si=abc123
```

Ausgabe

```
https://www.youtube-nocookie.com/embed/L0MK7qz13bU?rel=0&modestbranding=1&controls=1&iv_load_policy=3&showinfo=0
```

---

### Eingabe

```
https://www.youtube.com/watch?v=L0MK7qz13bU&t=75s
```

Ausgabe

```
https://www.youtube-nocookie.com/embed/L0MK7qz13bU?rel=0&modestbranding=1&controls=1&iv_load_policy=3&showinfo=0
```

---

### Eingabe

```
https://www.youtube-nocookie.com/embed/L0MK7qz13bU?si=xyz123
```

Ausgabe

```
https://www.youtube-nocookie.com/embed/L0MK7qz13bU?rel=0&modestbranding=1&controls=1&iv_load_policy=3&showinfo=0
```
