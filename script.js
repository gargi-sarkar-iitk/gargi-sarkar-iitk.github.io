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
   RANK BADGE HELPER
   Reads the rank object from the JSON and returns an HTML badge.
   ========================================================= */
function renderRankBadge(rank) {
  if (!rank || !rank.label) return "";

  const label = rank.label;
  const type  = rank.type; // "journal" | "conference"

  // Choose colour class based on label value
  let cls = "rank-badge";
  if (label === "Q1")          cls += " rank-q1";
  else if (label === "CORE A") cls += " rank-core-a";
  else if (label === "CORE B") cls += " rank-core-b";
  else                          cls += " rank-under-review";   // "Under Review"

  // Tooltip: show the note if present
  const title = rank.note ? ` title="${rank.note}"` : "";

  return `<span class="${cls}"${title}>${label}</span>`;
}

/* =========================================================
   PUBLICATION HELPERS
   ========================================================= */

// DOI / arXiv access link
function getAccessLink(p) {
  if (p.url) return p.url;
  if (!p.identifier) return "";
  if (p.identifier.type === "doi")   return `https://doi.org/${p.identifier.value}`;
  if (p.identifier.type === "arxiv") return `https://arxiv.org/abs/${p.identifier.value}`;
  return "";
}

// BibTeX generator
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
  title         = {${p.title}},
  author        = {${authors}},
  year          = {${p.year}},
  eprint        = {${p.identifier.value}},
  archivePrefix = {arXiv}
}`;
  }

  return "";
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
  if (!c || !announcements?.length) return;

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
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric"
  });
}

/* =========================================================
   EXPERIENCE
   ========================================================= */
function renderExperience(arr = []) {
  const c = $("experience");
  if (!c) return;

  const header = c.querySelector("h2");
  c.innerHTML = "";
  if (header) c.appendChild(header);

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
  const c = $("education");
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
   PUBLICATIONS
   ========================================================= */
function renderPublications(pubs) {
  const container = $("publications");
  if (!container || !pubs) return;

  // Keep section header
  const header = container.querySelector("h2");
  container.innerHTML = "";
  if (header) container.appendChild(header);

  // Reverse-number counter across all entries in display order
  const journals        = pubs.journals || [];
  const proceedings     = pubs.conference_proceedings || [];
  const published       = journals.filter(p => p.status === "published");
  const preprints       = journals.filter(p => p.status === "preprint");
  const underReview     = journals.filter(p => p.status === "under_review");

  // Total count for reverse numbering across all sections
  const totalJournals     = journals.length;
  const totalProceedings  = proceedings.length;
  let   journalCounter    = totalJournals;      // counts DOWN
  let   procCounter       = totalProceedings;   // counts DOWN

  function buildPubItem(p, counter) {
    const accessLink = getAccessLink(p);
    const bibtex     = generateBibTeX(p);
    const citeId     = `bibtex-${counter}-${Math.random().toString(36).slice(2, 7)}`;
    const badge      = renderRankBadge(p.rank);

    const d = document.createElement("div");
    d.className = "pub-item";

    d.innerHTML = `
      <div class="pub-number">[${counter}]</div>
      <div class="pub-body">
        <div class="pub-title">
          ${p.title}
          ${badge}
        </div>
        <div class="pub-authors">${p.authors.join(", ")}</div>
        <div class="pub-venue">
          <em>${p.venue}</em> (${p.year})
          ${p.pages ? `, pp. ${p.pages}` : ""}
        </div>
        <div class="pub-links">
          ${accessLink ? `<a href="${accessLink}" target="_blank" class="pub-link">🔗 Access</a>` : ""}
          ${bibtex    ? `<a href="#" class="pub-link cite-btn">📋 Cite</a>` : ""}
        </div>
        ${bibtex ? `<pre id="${citeId}" class="bibtex" hidden>${bibtex}</pre>` : ""}
      </div>
    `;

    // Attach cite toggle
    if (bibtex) {
      const citeBtn = d.querySelector(".cite-btn");
      const bibEl   = d.querySelector(`#${citeId}`);
      citeBtn.addEventListener("click", e => {
        e.preventDefault();
        bibEl.hidden = !bibEl.hidden;
      });
    }

    return d;
  }

  function renderSection(title, items, useJournalCounter) {
    if (!items.length) return;

    const h = document.createElement("h3");
    h.className = "pub-section-title";
    h.textContent = title;
    container.appendChild(h);

    items.forEach(p => {
      const num = useJournalCounter ? journalCounter-- : procCounter--;
      container.appendChild(buildPubItem(p, num));
    });
  }

  renderSection("Journal Articles (Published)",        published,    true);
  renderSection("Conference Proceedings",              proceedings,  false);
  renderSection("Preprints / Archived Manuscripts",    preprints,    true);
  renderSection("Manuscripts Under Review",            underReview,  true);
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

    const titleHTML = p.url
      ? `<a href="${p.url}" target="_blank" class="project-link">${p.title}</a>`
      : p.title;

    d.innerHTML = `
      <strong>${titleHTML}</strong>
      ${p.sponsor ? `<div class="project-sponsor">Funded by: ${p.sponsor}</div>` : ""}
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

  if (obj.reviewer?.length) {
    const h = document.createElement("h3");
    h.textContent = "Reviewer";
    c.appendChild(h);
    const ul = document.createElement("ul");
    obj.reviewer.forEach(x => {
      const li = document.createElement("li");
      li.className = "item";
      li.textContent = x;
      ul.appendChild(li);
    });
    c.appendChild(ul);
  }

  if (obj.sub_reviewer?.length) {
    const h = document.createElement("h3");
    h.textContent = "Sub-Reviewer";
    c.appendChild(h);
    const ul = document.createElement("ul");
    obj.sub_reviewer.forEach(x => {
      const li = document.createElement("li");
      li.className = "item";
      li.textContent = x;
      ul.appendChild(li);
    });
    c.appendChild(ul);
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
      <a href="mailto:${r.email}">${r.email}</a>
      ${r.relation ? `<br><em>${r.relation}</em>` : ""}
    `;
    c.appendChild(d);
  });
}

/* =========================================================
   UI ENHANCEMENTS
   ========================================================= */
function enhanceUI() {
  scrollReveal();
}

function scrollReveal() {
  const els = document.querySelectorAll(".item, .pub-item, .announce-item, .skill, .ref");
  const obs = new IntersectionObserver(
    e => e.forEach(x => x.isIntersecting && x.target.classList.add("visible")),
    { threshold: 0.1 }
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
  d.style.cssText = "background:#fee2e2;padding:12px;margin:20px;border:1px solid #fca5a5;border-radius:6px;";
  d.textContent = "Site failed to load: " + msg;
  document.body.prepend(d);
}
