/**
 * Gargi Sarkar — Academic Website Renderer
 * JSON → DOM | No templates | No frameworks
 */

document.addEventListener("DOMContentLoaded", () => {
  fetch("index.json")
    .then(res => res.json())
    .then(data => {
      renderHeader(data.about);
      renderNavigation(data.navigation);
      renderAnnouncements(data.publications);
      renderSections(data);
      activateScrollSpy();
    })
    .catch(err => console.error("Failed to load index.json", err));
});

/* =========================================================
   HEADER
   ========================================================= */

function renderHeader(about) {
  const header = document.getElementById("profile-header");

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

  navItems.forEach(id => {
    const link = document.createElement("a");
    link.href = `#${id}`;
    link.textContent = titleCase(id.replace(/_/g, " "));
    nav.appendChild(link);
  });
}

/* =========================================================
   ANNOUNCEMENTS (derived from publications)
   ========================================================= */

function renderAnnouncements(publications) {
  const ticker = document.getElementById("announcement-ticker");
  const all = [
    ...publications.journals,
    ...publications.conference_proceedings
  ];

  all
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
   SECTIONS
   ========================================================= */

function renderSections(data) {
  const container = document.getElementById("content");

  data.navigation.forEach(section => {
    const sectionEl = document.createElement("section");
    sectionEl.id = section;
    sectionEl.innerHTML = `<h2>${titleCase(section.replace(/_/g, " "))}</h2>`;

    if (section === "publications") {
      renderPublications(sectionEl, data.publications);
    } else if (Array.isArray(data[section])) {
      renderListSection(sectionEl, data[section]);
    } else if (typeof data[section] === "object") {
      renderObjectSection(sectionEl, data[section]);
    }

    container.appendChild(sectionEl);
  });
}

function renderListSection(parent, items) {
  items.forEach(item => {
    const block = document.createElement("div");
    block.className = "block";

    if (typeof item === "string") {
      block.textContent = item;
    } else {
      block.innerHTML = Object.entries(item)
        .map(([k, v]) => {
          if (Array.isArray(v)) return `<strong>${titleCase(k)}:</strong> ${v.join(", ")}`;
          return `<strong>${titleCase(k)}:</strong> ${v}`;
        })
        .join("<br>");
    }

    parent.appendChild(block);
  });
}

function renderObjectSection(parent, obj) {
  Object.entries(obj).forEach(([key, value]) => {
    if (key === "photo") return;

    const p = document.createElement("p");
    p.innerHTML = `<strong>${titleCase(key)}:</strong> ${
      Array.isArray(value) ? value.join(", ") : value
    }`;
    parent.appendChild(p);
  });
}

/* =========================================================
   PUBLICATIONS (DEDICATED RENDERER)
   ========================================================= */

function renderPublications(parent, publications) {

  if (publications.journals?.length) {
    parent.appendChild(makeSubheading("Journals"));

    publications.journals
      .sort(sortByYear)
      .forEach(pub => {
        parent.appendChild(formatPublication(pub));
      });
  }

  if (publications.conference_proceedings?.length) {
    parent.appendChild(makeSubheading("Conference Proceedings"));

    publications.conference_proceedings
      .sort(sortByYear)
      .forEach(pub => {
        parent.appendChild(formatPublication(pub));
      });
  }
}

function formatPublication(pub) {
  const p = document.createElement("p");
  p.innerHTML = `
    <strong>${pub.authors.join(", ")}</strong> (${pub.year}).<br>
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
      const top = section.offsetTop - 120;
      if (window.scrollY >= top) {
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
  return str.replace(/\b\w/g, char => char.toUpperCase());
}
