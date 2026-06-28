const DATA_URL = "data/content.json";

const ICONS = {
  home: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="m3 10.8 9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6"/></svg>`,
  songs: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`,
  notes: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M6 3h9l3 3v15H6z"/><path d="M14 3v4h4"/><path d="M9 12h6"/><path d="M9 16h6"/></svg>`,
  sonstiges: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>`,
  arrowLeft: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>`,
  file: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M6 3h9l3 3v15H6z"/><path d="M14 3v4h4"/></svg>`
};

document.addEventListener("DOMContentLoaded", () => {
  init().catch((error) => {
    console.error(error);
    renderError("Die Website konnte nicht geladen werden.", "Bitte pruefe data/content.json und die verlinkten Dateien.");
  });
});

async function init() {
  registerServiceWorker();
  const data = await getJson(DATA_URL);
  const page = document.body.dataset.page || "home";
  const activeKey = page === "detail" ? findDetailSectionKey(data) : page;

  renderNav(data, activeKey || "home");

  if (page === "home") {
    await renderHome(data);
    return;
  }

  if (page === "detail") {
    await renderDetail(data);
    return;
  }

  await renderSection(data, page);
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch((error) => {
      console.warn("Service Worker konnte nicht registriert werden.", error);
    });
  });
}

async function getJson(url) {
  const response = await fetch(url, { cache: "no-cache" });
  if (!response.ok) {
    throw new Error(`JSON nicht gefunden: ${url}`);
  }
  return response.json();
}

async function getText(url) {
  if (!url) {
    return "";
  }

  const response = await fetch(url);
  if (!response.ok) {
    return "";
  }
  return response.text();
}

function renderNav(data, activeKey) {
  const navItems = [
    { key: "home", label: "Home", href: "index.html" },
    ...data.sections.map((section) => ({
      key: section.key,
      label: section.label,
      href: section.page
    }))
  ];

  const navMarkup = navItems.map((item) => navLink(item, activeKey)).join("");
  document.getElementById("desktop-nav").innerHTML = navMarkup;
  document.getElementById("mobile-nav").innerHTML = navMarkup;
}

function navLink(item, activeKey) {
  const isActive = item.key === activeKey;
  const icon = ICONS[item.key] || ICONS.file;
  return `
    <a class="nav-link" href="${escapeAttr(item.href)}" ${isActive ? 'aria-current="page"' : ""}>
      ${icon}
      <span class="nav-label">${escapeHtml(item.label)}</span>
    </a>
  `;
}

async function renderHome(data) {
  document.title = `${data.site.name}`;
  const cards = await Promise.all(data.sections.map(async (section) => {
    const text = await getText(section.homeTextFile);
    return `
      <a class="content-card" href="${escapeAttr(section.page)}">
        <span class="card-media">
          <img src="${escapeAttr(section.homeImage)}" alt="${escapeAttr(section.homeImageAlt)}" loading="lazy">
        </span>
        <span class="card-body">
          <span class="card-eyebrow">${escapeHtml(section.label)}</span>
          <span class="home-card-text">${escapeHtml(text.trim())}</span>
        </span>
      </a>
    `;
  }));

  getApp().innerHTML = `<section class="home-grid" aria-label="Bereiche">${cards.join("")}</section>`;
}

async function renderSection(data, key) {
  const section = data.sections.find((entry) => entry.key === key);
  if (!section) {
    renderMissing("Bereich nicht gefunden", "Die angeforderte Unterseite ist nicht in data/content.json angelegt.");
    return;
  }

  document.title = `${section.label} | ${data.site.name}`;
  const cards = await Promise.all(section.items.map(async (item) => {
    const text = item.textFile ? await getText(item.textFile) : item.text || "";
    return itemCard(item, section, text);
  }));

  getApp().innerHTML = `
    <section class="page-heading" aria-labelledby="page-title">
      <h1 id="page-title">${escapeHtml(section.label)}</h1>
      <p>${escapeHtml(section.description)}</p>
    </section>
    <section class="content-grid" aria-label="${escapeAttr(section.label)} Eintraege">
      ${cards.join("")}
    </section>
  `;
}

function itemCard(item, section, text) {
  const detailUrl = `detail.html?id=${encodeURIComponent(item.id)}`;
  const media = item.image
    ? `<span class="card-media"><img src="${escapeAttr(item.image)}" alt="${escapeAttr(item.imageAlt || item.title)}" loading="lazy"></span>`
    : `<span class="text-only-media" aria-hidden="true">${ICONS.file}</span>`;

  return `
    <a class="content-card" href="${detailUrl}">
      ${media}
      <span class="card-body">
        <!-- <span class="card-eyebrow">${escapeHtml(section.label)}</span> -->
        <span class="card-title">${escapeHtml(item.title)}</span>
        ${text ? `<span class="card-text">${escapeHtml(text.trim())}</span>` : ""}
      </span>
    </a>
  `;
}

async function renderDetail(data) {
  const id = new URLSearchParams(window.location.search).get("id");
  const match = findItem(data, id);

  if (!match) {
    renderMissing("Eintrag nicht gefunden", "Der Link passt zu keinem Eintrag in data/content.json.");
    return;
  }

  const { section, item } = match;
  const lyrics = item.lyricsFile ? await getText(item.lyricsFile) : item.lyrics || "";
  const media = renderMedia(item);
  const pdf = renderPdf(item);

  document.title = `${item.title} | ${data.site.name}`;

  getApp().innerHTML = `
    <article class="detail-layout">
      <div class="back-row">
        <a class="button-link" href="${escapeAttr(section.page)}">${ICONS.arrowLeft}<span>Zurueck zu ${escapeHtml(section.label)}</span></a>
      </div>
      <header class="page-heading">
        <h1>${escapeHtml(item.title)}</h1>
        <p>${escapeHtml(item.summary || section.description)}</p>
      </header>
      <section class="detail-section" aria-labelledby="media-title">
        <h2 id="media-title">Medien</h2>
        ${media}
      </section>
      <section class="detail-section" aria-labelledby="lyrics-title">
        <h2 id="lyrics-title">Lyrics / Text</h2>
        <pre class="lyrics">${escapeHtml(lyrics.trim() || "Kein Text hinterlegt.")}</pre>
      </section>
      <section class="detail-section" aria-labelledby="pdf-title">
        <h2 id="pdf-title">PDF</h2>
        ${pdf}
      </section>
    </article>
  `;
}

function renderMedia(item) {
  if (!item.media) {
    return `<div class="empty-state"><p>Kein Medienframe hinterlegt.</p></div>`;
  }

  if (item.media.kind === "youtube") {
    return `
      <iframe
        class="media-frame"
        src="${escapeAttr(item.media.src)}"
        title="${escapeAttr(item.media.title || item.title)}"
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen></iframe>
    `;
  }

  if (item.media.kind === "internal-audio") {
    const params = new URLSearchParams({
      audio: item.media.src,
      title: item.media.title || item.title
    });
    return `
      <iframe
        class="media-frame"
        src="player.html?${params.toString()}"
        title="${escapeAttr(item.media.title || item.title)}"
        loading="lazy"></iframe>
    `;
  }

  return `<div class="empty-state"><p>Medientyp nicht unterstuetzt.</p></div>`;
}

function renderPdf(item) {
  if (!item.pdf) {
    return `<div class="empty-state"><p>Keine PDF-Datei hinterlegt.</p></div>`;
  }

  return `
    <iframe class="pdf-frame" src="${escapeAttr(item.pdf)}#view=FitH" title="PDF: ${escapeAttr(item.title)}"></iframe>
    <div class="pdf-actions">
      <a class="button-link" href="${escapeAttr(item.pdf)}" target="_blank" rel="noopener">${ICONS.file}<span>PDF oeffnen</span></a>
    </div>
  `;
}

function findDetailSectionKey(data) {
  const id = new URLSearchParams(window.location.search).get("id");
  return findItem(data, id)?.section.key;
}

function findItem(data, id) {
  if (!id) {
    return null;
  }

  for (const section of data.sections) {
    const item = section.items.find((entry) => entry.id === id);
    if (item) {
      return { section, item };
    }
  }

  return null;
}

function renderMissing(title, message) {
  getApp().innerHTML = `
    <section class="empty-state">
      <h1>${escapeHtml(title)}</h1>
      <p>${escapeHtml(message)}</p>
      <a class="button-link" href="index.html">${ICONS.arrowLeft}<span>Zur Startseite</span></a>
    </section>
  `;
}

function renderError(title, message) {
  getApp().innerHTML = `
    <section class="empty-state">
      <h1>${escapeHtml(title)}</h1>
      <p>${escapeHtml(message)}</p>
    </section>
  `;
}

function getApp() {
  return document.getElementById("app");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttr(value) {
  return escapeHtml(value);
}
