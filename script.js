/* =========================================================
   SAFE DOM QUERY
   ========================================================= */
const $ = (id) => document.getElementById(id);

/* =========================================================
   FETCH + INIT
   ========================================================= */
fetch("index.json")
  .then(res => {
    if (!res.ok) throw new Error("Cannot load index.json");
    return res.json();
  })
  .then(data => {
    renderAbout(data.about);
    renderSummary(data.summary);
    renderAnnouncements(data.announcements);
    renderExperience(data.experience);
    renderEducation(data.education);
    renderPublications(data.publications);
    renderResearch(data.research);
    renderProjects(data.projects);
    renderAcademicService(data.academic_service);
    renderTeaching(data.teaching);
    renderAchievements(data.achievements);
    renderTalks(data.talks_and_presentations);
    renderActivities(data.activities);
    renderSkills(data.technical_skills);
    renderReferences(data.references);
    enhanceUI();
  })
  .catch(err => showFatalError(err.message));

/* =========================================================
   RANK BADGE HELPER  ← only new addition
   Reads p.rank from JSON and returns a coloured badge span.
   ========================================================= */
function renderRankBadge(rank) {
  if (!rank || !rank.label) return "";

  const label = rank.label;
  let cls = "rank-badge";

  if      (label === "Q1")     cls += " rank-q1";
  else if (label === "CORE A") cls += " rank-core-a";
  else if (label === "CORE B") cls += " rank-core-b";
  else                          cls += " rank-under-review";

  const tooltip = rank.note ? ` title="${rank.note}"` : "";
  return `<span class="${cls}"${tooltip}>${label}</span>`;
}

/* =========================================================
   PUBLICATION HELPERS  (unchanged)
   ========================================================= */
function getAccessLink(p) {
  if (!p.identifier) return "";
  if (p.identifier.type === "doi")   return `https://doi.org/${p.identifier.value}`;
  if (p.identifier.type === "arxiv") return `https://arxiv.org/abs/${p.identifier.value}`;
  return "";
}

function generateBibTeX(p) {
  if (!p.identifier) return "";

  const key =
    p.authors[0].split(" ")[0].toLowerCase() +
    p.year +
    p.title.toLowerCase().replace(/[^a-z0-9]+/g, "").substring(0, 25);

  const authors = p.authors.join(" and ");

  if (p.identifier.type === "doi") {
    return `@article{${key},
  title   = {${p.title}},
  author  = {${authors}},
  journal = {${p.venue}},
  year    = {${p.year}},
  doi     = {${p.identifier.value}}
}`;
  }

  if (p.identifier.type === "arxiv") {
    return `@misc{${key},
  title        = {${p.title}},
  author       = {${authors}},
  year         = {${p.year}},
  eprint       = {${p.identifier.value}},
  archivePrefix= {arXiv}
}`;
  }

  return "";
}

function toggleBibTeX(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.display = el.style.display === "none" ? "block" : "none";
}

/* =========================================================
   ABOUT
   ========================================================= */
function renderAbout(a) {
  if (!a) return;

  $("name").textContent = a.name;
  $("photo").src = a.photo?.src || "";

  $("phd-line").innerHTML = `
    🎓 Ph.D. in Computer Science and Engineering<br>
    <strong>Indian Institute of Technology Kanpur</strong>
  `;

  $("current-line").innerHTML = `
    🏛️ Currently a Research Scientist at<br>
    <strong>${a.affiliation}</strong>
  `;
}

function renderSummary(summary) {
  if (!summary || !Array.isArray(summary.points)) return;
  const container = $("about-summary");
  if (!container) return;
  container.innerHTML = summary.points
    .map(point => `<p class="summary-point">${point}</p>`)
    .join("");
}

/* =========================================================
   ANNOUNCEMENTS – ROTATOR
   ========================================================= */
function renderAnnouncements(announcements) {
  const c = $("announcements");
  if (!c || !announcements || !announcements.length) return;

  const header = c.querySelector("h2");
  c.innerHTML = "";
  if (header) c.appendChild(header);

  const items = announcements
    .slice()
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const rotator = document.createElement("div");
  rotator.className = "announce-rotator";
  c.appendChild(rotator);

  const nodes = items.map((a, i) => {
    const el = document.createElement("div");
    el.className = "announce-item";
    if (i !== 0) el.classList.add("hidden");

    el.innerHTML = `
      <div class="announce-dot">
        <span class="announce-icon">📢</span>
      </div>
      <div class="announce-content announce-card">
        <small class="announce-date">${formatAnnouncementDate(a.date)}</small>
        <h4>${a.title}</h4>
        <p>${a.description}</p>
      </div>
    `;

    rotator.appendChild(el);
    return el;
  });

  let current = 0;
  setInterval(() => {
    nodes[current].classList.add("hidden");
    current = (current + 1) % nodes.length;
    nodes[current].classList.remove("hidden");
  }, 4500);
}

function formatAnnouncementDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric"
  });
}

/* =========================================================
   EXPERIENCE
   ========================================================= */
function renderExperience(arr = []) {
  const c = document.getElementById("experience");
  if (!c) return;

  const header = c.querySelector("h2");
  c.innerHTML = "";
  if (header) c.appendChild(header);

  if (!arr.length) return;

  arr.forEach(e => {
    const d = document.createElement("div");
    d.className = "item";

    const responsibilitiesHTML = (e.responsibilities || [])
      .map(r => `<li>${r}</li>`)
      .join("");

    d.innerHTML = `
      <strong>${e.role}</strong>, ${e.institution}<br>
      <em>${e.period}</em>
      ${responsibilitiesHTML ? `<ul class="experience-points">${responsibilitiesHTML}</ul>` : ""}
      ${e.note ? `<div class="experience-note">${e.note}</div>` : ""}
    `;

    c.appendChild(d);
  });
}

/* =========================================================
   EDUCATION
   ========================================================= */
function renderEducation(arr = []) {
  const c = document.getElementById("education");
  if (!c || !arr.length) return;

  const header = c.querySelector("h2");
  c.innerHTML = "";
  if (header) c.appendChild(header);

  arr.forEach(e => {
    const d = document.createElement("div");
    d.className = "item education-item";
    d.innerHTML = `
      <div class="edu-header">
        <span class="edu-degree">${e.degree}</span>
        <span class="edu-period">${e.period || e.year || ""}</span>
      </div>
      <div class="edu-institution">${e.institution}</div>
    `;
    c.appendChild(d);
  });
}

/* =========================================================
   PUBLICATIONS  ← badge injected after title, nothing else changed
   ========================================================= */
function renderPublications(pubs) {
  const publications = $("publications");
  if (!publications || !pubs) return;

  const sections = {
    published:    "Journal Articles (Published)",
    preprint:     "Preprints / Archived Manuscripts",
    under_review: "Manuscripts Under Review",
    conference:   "Conference Proceedings"
  };

  function renderSection(title, items) {
    if (!items.length) return;

    const h = document.createElement("h3");
    h.textContent = title;
    publications.appendChild(h);

    items.forEach((p, idx) => {
      const d = document.createElement("div");
      d.className = "pub-item";

      const accessLink = getAccessLink(p);
      const bibtex     = generateBibTeX(p);
      const citeId     = `bibtex-${Date.now()}-${idx}`;
      const badge      = renderRankBadge(p.rank);   // ← only new line

      d.innerHTML = `
        <strong>${p.title}</strong>${badge}<br>
        ${p.authors.join(", ")}<br>
        <em>${p.venue} (${p.year})</em>
        <div class="pub-links">
          ${accessLink ? `<a href="${accessLink}" target="_blank">Access</a>` : ""}
          ${bibtex     ? `<a href="#" class="cite-btn">Cite</a>` : ""}
        </div>
        ${bibtex ? `<pre id="${citeId}" class="bibtex" hidden>${bibtex}</pre>` : ""}
      `;

      publications.appendChild(d);

      if (bibtex) {
        const citeBtn = d.querySelector(".cite-btn");
        const bibEl   = d.querySelector(`#${citeId}`);
        citeBtn.addEventListener("click", (e) => {
          e.preventDefault();
          bibEl.hidden = !bibEl.hidden;
        });
      }
    });
  }

  const journals = pubs.journals || [];

  renderSection(sections.published,    journals.filter(p => p.status === "published"));
  renderSection(sections.conference,   pubs.conference_proceedings || []);
  renderSection(sections.preprint,     journals.filter(p => p.status === "preprint"));
  renderSection(sections.under_review, journals.filter(p => p.status === "under_review"));
}

/* =========================================================
   RESEARCH
   ========================================================= */
function renderResearch(arr = []) {
  const c = $("research");
  if (!c) return;
  arr.forEach(r => {
    const d = document.createElement("div");
    d.className = "item";
    d.innerHTML = `
      <strong>${r.title}</strong>
      <ul>${r.details.map(x => `<li>${x}</li>`).join("")}</ul>
    `;
    c.appendChild(d);
  });
}

/* =========================================================
   PROJECTS
   ========================================================= */
function renderProjects(arr = []) {
  const c = $("projects");
  if (!c) return;
  arr.forEach(p => {
    const d = document.createElement("div");
    d.className = "item";
    d.innerHTML = `
      <strong>${p.title}</strong>
      <ul>${p.details.map(x => `<li>${x}</li>`).join("")}</ul>
    `;
    c.appendChild(d);
  });
}

/* =========================================================
   ACADEMIC SERVICE
   ========================================================= */
function renderAcademicService(obj) {
  const c = $("academic_service");
  if (!c || !obj) return;

  if (obj.sub_reviewer?.length) {
    const h = document.createElement("h3");
    h.textContent = "Sub-Reviewer";
    c.appendChild(h);
    obj.sub_reviewer.forEach(x => {
      const d = document.createElement("div");
      d.className = "item";
      d.textContent = x;
      c.appendChild(d);
    });
  }

  if (obj.reviewer?.length) {
    const h = document.createElement("h3");
    h.textContent = "Reviewer";
    c.appendChild(h);
    obj.reviewer.forEach(x => {
      const d = document.createElement("div");
      d.className = "item";
      d.textContent = x;
      c.appendChild(d);
    });
  }
}

/* =========================================================
   TEACHING
   ========================================================= */
function renderTeaching(arr = []) {
  const c = $("teaching");
  if (!c) return;

  arr.forEach(t => {
    const block = document.createElement("div");
    block.className = "item teaching-item";

    block.innerHTML = `
      <div class="teaching-header">
        <strong>${t.role}</strong>, ${t.institution}
      </div>
    `;

    if (Array.isArray(t.courses) && t.courses.length) {
      const ul = document.createElement("ul");
      t.courses.forEach(course => {
        const li = document.createElement("li");
        li.innerHTML = `
          ${course.code ? `<strong>${course.code}</strong>: ` : ""}
          ${course.title}
          ${course.duration ? ` <em>(${course.duration})</em>` : ""}
        `;
        ul.appendChild(li);
      });
      block.appendChild(ul);
    }

    c.appendChild(block);
  });
}

/* =========================================================
   ACHIEVEMENTS
   ========================================================= */
function renderAchievements(arr = []) {
  const c = $("achievements");
  if (!c || !arr.length) return;

  arr.forEach(a => {
    const d = document.createElement("div");
    d.className = "item";
    const split = a.split(/\s[–-]\s/);
    d.append("• ");
    if (split.length > 1) {
      const strong = document.createElement("strong");
      strong.textContent = split[0];
      const rest = document.createTextNode(" – " + split.slice(1).join(" – "));
      d.appendChild(strong);
      d.appendChild(rest);
    } else {
      d.appendChild(document.createTextNode(a));
    }
    c.appendChild(d);
  });
}

/* =========================================================
   TALKS
   ========================================================= */
function renderTalks(arr = []) {
  const c = $("talks_and_presentations");
  if (!c) return;
  arr.forEach(t => {
    const d = document.createElement("div");
    d.className = "item";
    d.textContent = "• " + t;
    c.appendChild(d);
  });
}

/* =========================================================
   ACTIVITIES
   ========================================================= */
function renderActivities(arr = []) {
  const c = $("activities");
  if (!c) return;
  arr.forEach(a => {
    const d = document.createElement("div");
    d.className = "item";
    d.textContent = "• " + a;
    c.appendChild(d);
  });
}

/* =========================================================
   SKILLS
   ========================================================= */
function renderSkills(skills = {}) {
  const c = $("technical_skills");
  if (!c || typeof skills !== "object") return;

  Object.entries(skills).forEach(([category, items]) => {
    const block = document.createElement("div");
    block.className = "item";
    const h = document.createElement("strong");
    h.textContent = category;
    block.appendChild(h);
    const ul = document.createElement("ul");
    ul.className = "skills-grid";
    items.forEach(skill => {
      const li = document.createElement("li");
      li.textContent = skill;
      ul.appendChild(li);
    });
    block.appendChild(ul);
    c.appendChild(block);
  });
}

/* =========================================================
   REFERENCES
   ========================================================= */
function renderReferences(arr = []) {
  const c = $("references");
  if (!c) return;
  arr.forEach(r => {
    const d = document.createElement("div");
    d.className = "ref";
    d.innerHTML = `
      <strong>${r.name}</strong>, ${r.designation}<br>
      ${r.institution}<br>
      ${r.email}
    `;
    c.appendChild(d);
  });
}

/* =========================================================
   UI ENHANCEMENTS
   ========================================================= */
function enhanceUI() {
  announcementCarousel();
  scrollReveal();
}

function announcementCarousel() {
  const items = document.querySelectorAll(".announce");
  if (!items.length) return;
  let i = 0;
  items.forEach((x, idx) => x.style.display = idx === 0 ? "block" : "none");
  setInterval(() => {
    items[i].style.display = "none";
    i = (i + 1) % items.length;
    items[i].style.display = "block";
  }, 4000);
}

function scrollReveal() {
  const els = document.querySelectorAll(".item, .pub-item, .announce, .skill, .ref");
  const obs = new IntersectionObserver(
    e => e.forEach(x => x.isIntersecting && x.target.classList.add("visible")),
    { threshold: 0.15 }
  );
  els.forEach(el => {
    el.classList.add("reveal");
    obs.observe(el);
  });
}

/* =========================================================
   FATAL ERROR UI
   ========================================================= */
function showFatalError(msg) {
  const d = document.createElement("div");
  d.style.background = "#fee2e2";
  d.style.padding = "12px";
  d.style.margin = "20px";
  d.style.border = "1px solid #fca5a5";
  d.textContent = "Site failed to load: " + msg;
  document.body.prepend(d);
}
