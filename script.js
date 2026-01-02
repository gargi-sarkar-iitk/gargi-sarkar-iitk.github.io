/* =========================================================
   SAFE QUERY HELPER
   ========================================================= */
const el = (s) => document.querySelector(s);

/* =========================================================
   FETCH + INIT
   ========================================================= */
fetch("index.json")
  .then(res => res.json())
  .then(data => {
    /* ---- CORE RENDERING (YOUR WORKING LOGIC) ---- */
    renderAbout(data.about);

    // Announcements are NOT in JSON → derive safely
    renderAnnouncementsFromPublications(data.publications);

    renderPublications(data.publications);
    renderList("experience", data.experience);
    renderList("education", data.education);
    renderList("research", data.research);
    renderList("projects", data.projects);
    renderSkills(data.technical_skills);
    renderList("teaching", data.teaching);
    renderList("achievements", data.achievements);
    renderList("talks_and_presentations", data.talks_and_presentations);
    renderList("activities", data.activities);
    renderReferences(data.references);

    /* ---- ENHANCEMENTS (SAFE, OPTIONAL) ---- */
    enhanceUI();
  })
  .catch(err => console.error("JS failed:", err));

/* =========================================================
   ABOUT / HERO
   ========================================================= */
function renderAbout(a) {
  if (!a) return;
  el("#name").textContent = a.name;
  el("#title").textContent = a.title;
  el("#photo").src = a.photo?.src || "";
  el("#email").textContent = a.email;
  el("#email").href = `mailto:${a.email}`;
}


function renderList(section, arr = []) {
  const container = el("#" + section);
  if (!container || !Array.isArray(arr)) return;

  arr.forEach(item => {
    const d = document.createElement("div");
    d.className = "item";

    /* CASE 1: plain string (teaching, achievements, activities) */
    if (typeof item === "string") {
      d.textContent = "• " + item;
      container.appendChild(d);
      return;
    }

    /* CASE 2: research / projects (title + details[]) */
    if (item.title && Array.isArray(item.details)) {
      d.innerHTML = `
        <strong>${item.title}</strong>
        <ul>
          ${item.details.map(x => `<li>${x}</li>`).join("")}
        </ul>
      `;
      container.appendChild(d);
      return;
    }

    /* CASE 3: education / experience */
    const heading =
      item.degree ||
      item.role ||
      item.institution ||
      "";

    let body = "";

    if (Array.isArray(item.details)) {
      body = item.details.join("<br>");
    } else if (typeof item.details === "string") {
      body = item.details;
    } else if (item.period) {
      body = item.period;
    }

    d.innerHTML = `
      <strong>${heading}</strong><br>
      ${body}
    `;
    container.appendChild(d);
  });
}


/* =========================================================
   ANNOUNCEMENTS (DERIVED SAFELY)
   ========================================================= */
function renderAnnouncementsFromPublications(pubs) {
  const container = el("#announcements");
  if (!container || !pubs) return;

  const all = [
    ...(pubs.journals || []),
    ...(pubs.conference_proceedings || [])
  ];

  if (!all.length) return;

  all
    .filter(p => typeof p.year === "number")
    .sort((a, b) => b.year - a.year)
    .slice(0, 5)
    .forEach(p => {
      const d = document.createElement("div");
      d.className = "announce";
      d.innerHTML = `
        <h3>${p.title}</h3>
        <small>${p.venue} (${p.year})</small>
      `;
      container.appendChild(d);
    });
}

/* =========================================================
   PUBLICATIONS
   ========================================================= */
function renderPublications(pubs) {
  const container = el("#publications");
  if (!container || !pubs) return;

  ["journals", "conference_proceedings"].forEach(cat => {
    (pubs[cat] || []).forEach(pub => {
      const d = document.createElement("div");
      d.className = "pub-item";
      d.innerHTML = `
        <strong>${pub.title}</strong><br>
        ${pub.authors.join(", ")}<br>
        <em>${pub.venue} (${pub.year})</em>
      `;
      container.appendChild(d);
    });
  });
}

/* =========================================================
   GENERIC LIST RENDERER
   ========================================================= */
function renderList(section, arr = []) {
  const container = el("#" + section);
  if (!container || !Array.isArray(arr)) return;

  arr.forEach(item => {
    const d = document.createElement("div");
    d.className = "item";

    if (typeof item === "string") {
      d.textContent = "• " + item;
    } else {
      d.innerHTML = `
        <strong>${item.title || item.institution}</strong><br>
        ${item.details ? item.details.join("<br>") : item.period || ""}
      `;
    }
    container.appendChild(d);
  });
}

/* =========================================================
   SKILLS
   ========================================================= */
function renderSkills(arr = []) {
  const container = el("#technical_skills") || el("#skills");
  if (!container) return;

  arr.forEach(skill => {
    const s = document.createElement("span");
    s.className = "skill";
    s.textContent = skill;
    container.appendChild(s);
  });
}

/* =========================================================
   REFERENCES
   ========================================================= */
function renderReferences(arr = []) {
  const c = el("#references");
  if (!c) return;

  arr.forEach(r => {
    const d = document.createElement("div");
    d.className = "ref";
    d.innerHTML = `
      <strong>${r.name}</strong>, ${r.designation}, ${r.institution}<br>
      ${r.email}
    `;
    c.appendChild(d);
  });
}

/* =========================================================
   ENHANCEMENTS (BEAUTIFUL BUT SAFE)
   ========================================================= */
function enhanceUI() {
  announcementCarousel();
  scrollReveal();
}

/* ---- Announcement flashing / rotation ---- */
function announcementCarousel() {
  const items = document.querySelectorAll(".announce");
  if (!items.length) return;

  let index = 0;
  items.forEach((el, i) => el.style.display = i === 0 ? "block" : "none");

  setInterval(() => {
    items[index].style.display = "none";
    index = (index + 1) % items.length;
    items[index].style.display = "block";
  }, 4000);
}

/* ---- Scroll reveal animation ---- */
function scrollReveal() {
  const targets = document.querySelectorAll(
    ".announce, .pub-item, .item, .skill, .ref"
  );
  if (!targets.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.12 }
  );

  targets.forEach(el => {
    el.classList.add("reveal");
    observer.observe(el);
  });
}
