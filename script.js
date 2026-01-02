/* =====================
   HELPERS
===================== */
const $ = (q) => document.querySelector(q);
const $$ = (q) => document.querySelectorAll(q);

/* =====================
   LOAD DATA
===================== */
fetch("index.json")
  .then(res => res.json())
  .then(data => initSite(data))
  .catch(err => console.error("JSON load error:", err));

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

  setupScrollAnimations();
  setupNavHighlight();
}

/* =====================
   HERO
===================== */
function renderHero(a) {
  $("#name").textContent = a.name;
  $("#title").textContent = a.title;
  $("#affiliation").innerHTML = a.affiliation.join("<br>");
  $("#email").textContent = a.email;
  $("#email").href = `mailto:${a.email}`;
  $("#photo").src = a.photo.src;
}

/* =====================
   NAVIGATION
===================== */
function renderNavigation(nav) {
  const n = $("#top-nav");
  nav.forEach(id => {
    const a = document.createElement("a");
    a.href = `#${id}`;
    a.textContent = id.replace(/_/g, " ").toUpperCase();
    n.appendChild(a);
  });
}

/* =====================
   ANNOUNCEMENTS (AUTO)
===================== */
function renderAnnouncements(pubs) {
  const c = $("#announcements");
  const all = [...pubs.journals, ...pubs.conference_proceedings];

  all.slice(0, 5).forEach(p => {
    const div = document.createElement("div");
    div.className = "announce";
    div.setAttribute("data-animate", "");
    div.innerHTML = `
      <strong>${p.title}</strong><br>
      <small>${p.venue} (${p.year})</small>
    `;
    c.appendChild(div);
  });
}

/* =====================
   SECTIONS
===================== */
function card(container, html) {
  const d = document.createElement("div");
  d.className = "card";
  d.setAttribute("data-animate", "");
  d.innerHTML = html;
  container.appendChild(d);
}

function renderExperience(arr) {
  const c = $("#experience");
  arr.forEach(e => card(c,
    `<strong>${e.role}</strong><br>
     ${e.institution}, ${e.location}<br>
     <small>${e.period}</small>`
  ));
}

function renderEducation(arr) {
  const c = $("#education");
  arr.forEach(e => card(c,
    `<strong>${e.degree}</strong><br>
     ${e.institution}<br>
     <small>${e.period || e.year}</small>`
  ));
}

function renderPublications(p) {
  const c = $("#publications");
  p.journals.forEach(x => card(c,
    `<strong>${x.title}</strong><br>
     ${x.authors.join(", ")}<br>
     <em>${x.venue}</em> (${x.year})`
  ));
}

function renderResearch(arr) {
  const c = $("#research");
  arr.forEach(r => card(c,
    `<strong>${r.title}</strong>
     <ul>${r.details.map(d => `<li>${d}</li>`).join("")}</ul>`
  ));
}

function renderProjects(arr) {
  const c = $("#projects");
  arr.forEach(p => card(c,
    `<strong>${p.title}</strong>
     <ul>${p.details.map(d => `<li>${d}</li>`).join("")}</ul>`
  ));
}

function renderAcademicService(obj) {
  const c = $("#academic_service");
  Object.entries(obj).forEach(([k, v]) =>
    card(c, `<strong>${k.replace("_"," ")}</strong><ul>${v.map(i=>`<li>${i}</li>`).join("")}</ul>`)
  );
}

function renderList(id, arr) {
  const c = $("#" + id);
  arr.forEach(i => card(c, i));
}

function renderSkills(arr) {
  const c = $("#technical_skills");
  arr.forEach(s => {
    const span = document.createElement("span");
    span.className = "skill";
    span.setAttribute("data-animate", "");
    span.textContent = s;
    c.appendChild(span);
  });
}

function renderReferences(arr) {
  const c = $("#references");
  arr.forEach(r => card(c,
    `<strong>${r.name}</strong><br>
     ${r.designation}, ${r.institution}<br>
     ${r.email}`
  ));
}

/* =====================
   SCROLL REVEAL (PRO)
===================== */
function setupScrollAnimations() {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add("visible");
      });
    },
    { threshold: 0.15 }
  );

  $$("[data-animate]").forEach(el => observer.observe(el));
}

/* =====================
   NAV HIGHLIGHT
===================== */
function setupNavHighlight() {
  const sections = $$("section");
  const links = $$("#top-nav a");

  window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach(sec => {
      if (pageYOffset >= sec.offsetTop - 120) {
        current = sec.id;
      }
    });

    links.forEach(a => {
      a.classList.toggle("active", a.getAttribute("href") === `#${current}`);
    });
  });
}
