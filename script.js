/* ========= HELPERS ========= */
const $ = (q) => document.querySelector(q);

const sortByYearDesc = (arr) =>
  arr.slice().sort((a, b) => {
    const ya = typeof a.year === "number" ? a.year : 0;
    const yb = typeof b.year === "number" ? b.year : 0;
    return yb - ya;
  });

/* ========= LOAD JSON ========= */
fetch("index.json")
  .then(res => res.json())
  .then(data => initSite(data))
  .catch(err => console.error("Failed to load JSON:", err));

function initSite(data) {
  renderHero(data.about);
  renderNavigation(data.navigation);
  renderAnnouncements(data.publications);
  renderExperience(data.experience);
  renderEducation(data.education);
  renderPublications(data.publications);
  renderResearch(data.research);
  renderProjects(data.projects);
  renderAcademicService(data.academic_service);
  renderList("teaching", data.teaching);
  renderList("achievements", data.achievements);
  renderList("talks_and_presentations", data.talks_and_presentations);
  renderList("activities", data.activities);
  renderSkills(data.technical_skills);
  renderReferences(data.references);
}

/* ========= HERO ========= */
function renderHero(a) {
  $("#name").textContent = a.name;
  $("#title").textContent = a.title;
  $("#affiliation").innerHTML = a.affiliation.join("<br>");
  $("#email").textContent = a.email;
  $("#email").href = `mailto:${a.email}`;
  $("#photo").src = a.photo.src;
}

/* ========= NAV ========= */
function renderNavigation(nav) {
  const n = $("#top-nav");
  nav.forEach(id => {
    const a = document.createElement("a");
    a.href = `#${id}`;
    a.textContent = id.replace(/_/g, " ").toUpperCase();
    n.appendChild(a);
  });
}

/* ========= ANNOUNCEMENTS (AUTO FROM PUBLICATIONS) ========= */
function renderAnnouncements(pubs) {
  const c = $("#announcements");
  const all = [...pubs.journals, ...pubs.conference_proceedings];
  sortByYearDesc(all).slice(0, 5).forEach(p => {
    c.innerHTML += `
      <div class="announce">
        <strong>${p.title}</strong><br>
        <small>${p.venue} (${p.year})</small>
      </div>
    `;
  });
}

/* ========= EXPERIENCE ========= */
function renderExperience(arr) {
  const c = $("#experience");
  arr.forEach(e => {
    c.innerHTML += `
      <div class="card">
        <strong>${e.role}</strong><br>
        ${e.institution}, ${e.location}<br>
        <small>${e.period}</small>
      </div>
    `;
  });
}

/* ========= EDUCATION ========= */
function renderEducation(arr) {
  const c = $("#education");
  arr.forEach(e => {
    c.innerHTML += `
      <div class="card">
        <strong>${e.degree}</strong><br>
        ${e.institution}<br>
        <small>${e.period || e.year}</small>
      </div>
    `;
  });
}

/* ========= PUBLICATIONS ========= */
function renderPublications(p) {
  const c = $("#publications");
  c.innerHTML += "<h3>Journals</h3>";
  sortByYearDesc(p.journals).forEach(x => pubItem(c, x));
  c.innerHTML += "<h3>Conference Proceedings</h3>";
  p.conference_proceedings.forEach(x => pubItem(c, x));
}

function pubItem(c, p) {
  c.innerHTML += `
    <div class="card">
      <strong>${p.title}</strong><br>
      ${p.authors.join(", ")}<br>
      <em>${p.venue}</em> (${p.year})
    </div>
  `;
}

/* ========= GENERIC SECTIONS ========= */
function renderResearch(arr) {
  const c = $("#research");
  arr.forEach(r => {
    c.innerHTML += `<strong>${r.title}</strong><ul>${r.details.map(d => `<li>${d}</li>`).join("")}</ul>`;
  });
}

function renderProjects(arr) {
  const c = $("#projects");
  arr.forEach(p => {
    c.innerHTML += `<strong>${p.title}</strong><ul>${p.details.map(d => `<li>${d}</li>`).join("")}</ul>`;
  });
}

function renderAcademicService(obj) {
  const c = $("#academic_service");
  Object.entries(obj).forEach(([k, v]) => {
    c.innerHTML += `<strong>${k.replace("_", " ")}</strong><ul>${v.map(i => `<li>${i}</li>`).join("")}</ul>`;
  });
}

function renderList(id, arr) {
  const c = $("#" + id);
  c.innerHTML += `<ul>${arr.map(i => `<li>${i}</li>`).join("")}</ul>`;
}

function renderSkills(arr) {
  const c = $("#technical_skills");
  arr.forEach(s => {
    c.innerHTML += `<span class="skill">${s}</span>`;
  });
}

function renderReferences(arr) {
  const c = $("#references");
  arr.forEach(r => {
    c.innerHTML += `
      <p>
        <strong>${r.name}</strong><br>
        ${r.designation}, ${r.institution}<br>
        ${r.email}
      </p>
    `;
  });
}
