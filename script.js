/**
 * Gargi Sarkar — Academic Website Renderer
 * Robust JSON → DOM rendering
 * Explicit handling of nested objects (NO [object Object] bugs)
 */

document.addEventListener("DOMContentLoaded", () => {
  fetch("index.json")
    .then(res => res.json())
    .then(data => {
      renderHeader(data.about);
      renderNavigation(data.navigation);
      renderAnnouncements(data.publications);
      renderAllSections(data);
      activateScrollSpy();
    })
    .catch(err => console.error("Error loading index.json:", err));
});

/* =========================================================
   HEADER
   ========================================================= */

function renderHeader(about) {
  const header = document.getElementById("profile-header");
  if (!header || !about) return;

  header.innerHTML = `
    <div class="profile-header">
      <img src="${about.photo.src}" alt="${about.photo.alt}">
      <div class="profile-text">
        <h1>${about.name}</h1>
        <div class="title">${about.title}</div>
        <div class="affiliation">${about.affiliation.join("<br>")}</div>
        <div class="email">${about.email}</div>
      </div>
    </div>
  `;
}

/* =========================================================
   NAVIGATION
   ========================================================= */

function renderNavigation(navItems) {
  const nav = document.getElementById("top-nav");
  if (!nav || !Array.isArray(navItems)) return;

  nav.innerHTML = "";

  navItems.forEach(section => {
    const a = document.createElement("a");
    a.href = `#${section}`;
    a.textContent = titleCase(section.replace(/_/g, " "));
    nav.appendChild(a);
  });
}

/* =========================================================
   ANNOUNCEMENTS (DERIVED FROM PUBLICATIONS)
   ========================================================= */

function renderAnnouncements(publications) {
  const ticker = document.getElementById("announcement-ticker");
  if (!ticker || !publications) return;

  ticker.innerHTML = "";

  const allPubs = [
    ...(publications.journals || []),
    ...(publications.conference_proceedings || [])
  ];

  allPubs
    .filter(p => typeof p.year === "number")
    .sort((a, b) => b.year - a.year)
    .slice(0, 6)
    .forEach(pub => {
      const p = document.createElement("p");
      p.textContent = `📢 ${pub.year}: ${pub.title}`;
      ticker.appendChild(p);
    });

  rotateTicker(ticker);
}

function rotateTicker(container) {
  const items = container.children;
  if (!items.length) return;

  let index = 0;
  [...items].forEach((el, i) => el.style.display = i === 0 ? "block" : "none");

  setInterval(() => {
    items[index].style.display = "none";
    index = (index + 1) % items.length;
    items[index].style.display = "block";
  }, 3500);
}

/* =========================================================
   MAIN SECTION RENDERER (STRICT CONTROL FLOW)
   ========================================================= */

function renderAllSections(data) {
  const container = document.getElementById("content");
  if (!container || !Array.isArray(data.navigation)) return;

  container.innerHTML = "";

  data.navigation.forEach(sectionKey => {
    const sectionEl = document.createElement("section");
    sectionEl.id = sectionKey;

    const h2 = document.createElement("h2");
    h2.textContent = titleCase(sectionKey.replace(/_/g, " "));
    sectionEl.appendChild(h2);

    /* ---- PUBLICATIONS (SPECIAL CASE) ---- */
    if (sectionKey === "publications") {
      renderPublications(sectionEl, data.publications);
      container.appendChild(sectionEl);
      return; // ⛔ ABSOLUTELY STOP HERE
    }

    const sectionData = data[sectionKey];

    /* ---- ARRAY SECTIONS ---- */
    if (Array.isArray(sectionData)) {
      renderArraySection(sectionEl, sectionData);
      container.appendChild(sectionEl);
      return;
    }

    /* ---- OBJECT SECTIONS (SAFE) ---- */
    if (typeof sectionData === "object" && sectionData !== null) {
      renderFlatObjectSection(sectionEl, sectionData);
      container.appendChild(sectionEl);
      return;
    }

    container.appendChild(sectionEl);
  });
}

/* =========================================================
   ARRAY SECTION RENDERER
   ========================================================= */

function renderArraySection(parent, items) {
  items.forEach(item => {
    const block = document.createElement("div");
    block.className = "block";

    if (typeof item === "string") {
      block.textContent = item;
    } else if (typeof item === "object" && item !== null) {
      Object.entries(item).forEach(([k, v]) => {
        if (typeof v === "object") return; // ⛔ NEVER stringify objects
        const line = document.createElement("div");
        line.innerHTML = `<strong>${titleCase(k)}:</strong> ${v}`;
        block.appendChild(line);
      });
    }

    parent.appendChild(block);
  });
}

/* =========================================================
   FLAT OBJECT SECTION RENDERER (SAFE)
   ========================================================= */

function renderFlatObjectSection(parent, obj) {
  Object.entries(obj).forEach(([key, value]) => {
    if (key === "photo") return;
    if (typeof value === "object") return; // ⛔ HARD STOP

    const p = document.createElement("p");
    p.innerHTML = `<strong>${titleCase(key)}:</strong> ${value}`;
    parent.appendChild(p);
  });
}

/* =========================================================
   PUBLICATIONS RENDERER (DEDICATED)
   ========================================================= */

function renderPublications(parent, publications) {
  if (!publications) return;

  /* ---- Journals ---- */
  if (Array.isArray(publications.journals)) {
    parent.appendChild(makeSubheading("Journals"));

    publications.journals
      .sort(sortByYear)
      .forEach(pub => parent.appendChild(formatPublication(pub)));
  }

  /* ---- Conferences ---- */
  if (Array.isArray(publications.conference_proceedings)) {
    parent.appendChild(makeSubheading("Conference Proceedings"));

    publications.conference_proceedings
      .sort(sortByYear)
      .forEach(pub => parent.appendChild(formatPublication(pub)));
  }
}

function formatPublication(pub) {
  const p = document.createElement("p");

  p.innerHTML = `
    <strong>${pub.authors.join(", ")}</strong>
    (${pub.year}).<br>
    <em>${pub.title}</em>.<br>
    ${pub.venue}${pub.pages ? `, pp. ${pub.pages}` : ""}
    ${pub.status ? ` — ${formatStatus(pub.status)}` : ""}
  `;

  return p;
}

function makeSubheading(text) {
  const h3 = document.createElement("h3");
  h3.textContent = text;
  return h3;
}

function sortByYear(a, b) {
  if (typeof a.year === "number" && typeof b.year === "number") {
    return b.year - a.year;
  }
  return 0;
}

function formatStatus(status) {
  if (status === "preprint") return "Preprint";
  if (status === "under_review") return "Under review";
  if (status === "published") return "Published";
  return status;
}

/* =========================================================
   SCROLL SPY
   ========================================================= */

function activateScrollSpy() {
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll("#top-nav a");

  window.addEventListener("scroll", () => {
    let current = "";

    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - 120) {
        current = section.id;
      }
    });

    navLinks.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  });
}

/* =========================================================
   UTIL
   ========================================================= */

function titleCase(str) {
  return str.replace(/\b\w/g, c => c.toUpperCase());
}
