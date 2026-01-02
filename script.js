/**
 * Gargi Sarkar — Academic Website Renderer
 * Data-driven static site (JSON → DOM)
 * Author intent: clarity, maintainability, academic professionalism
 */

document.addEventListener("DOMContentLoaded", () => {
  fetch("index.json")
    .then(res => res.json())
    .then(data => {
      renderHeader(data.about);
      renderNavigation(data.navigation);
      renderSections(data);
      renderAnnouncements(data.publications);
      activateScrollSpy();
    })
    .catch(err => {
      console.error("Failed to load index.json", err);
    });
});

/* =========================
   HEADER
========================= */

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

/* =========================
   NAVIGATION
========================= */

function renderNavigation(navItems) {
  const nav = document.getElementById("top-nav");

  navItems.forEach(id => {
    const link = document.createElement("a");
    link.href = `#${id}`;
    link.textContent = capitalize(id);
    nav.appendChild(link);
  });
}

/* =========================
   SECTIONS
========================= */

function renderSections(data) {
  const container = document.getElementById("content");

  data.navigation.forEach(section => {
    const sectionEl = document.createElement("section");
    sectionEl.id = section;
    sectionEl.innerHTML = `<h2>${capitalize(section)}</h2>`;

    if (Array.isArray(data[section])) {
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
      block.innerHTML = Object.values(item)
        .map(v => Array.isArray(v) ? v.join(", ") : v)
        .join("<br>");
    }

    parent.appendChild(block);
  });
}

function renderObjectSection(parent, obj) {
  Object.entries(obj).forEach(([key, value]) => {
    const p = document.createElement("p");
    p.innerHTML = `<strong>${capitalize(key)}:</strong> ${
      Array.isArray(value) ? value.join(", ") : value
    }`;
    parent.appendChild(p);
  });
}

/* =========================
   ANNOUNCEMENTS
========================= */

function renderAnnouncements(publications) {
  const ticker = document.getElementById("announcement-ticker");

  const allPubs = [
    ...publications.journals,
    ...publications.conferences
  ];

  allPubs
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
  let index = 0;

  [...items].forEach((el, i) => {
    el.style.display = i === 0 ? "block" : "none";
  });

  setInterval(() => {
    items[index].style.display = "none";
    index = (index + 1) % items.length;
    items[index].style.display = "block";
  }, 3500);
}

/* =========================
   SCROLL SPY
========================= */

function activateScrollSpy() {
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll("#top-nav a");

  window.addEventListener("scroll", () => {
    let current = "";

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 80;
      if (pageYOffset >= sectionTop) {
        current = section.getAttribute("id");
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

/* =========================
   UTIL
========================= */

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
