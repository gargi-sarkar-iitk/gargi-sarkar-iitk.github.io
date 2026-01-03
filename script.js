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
    renderAnnouncements(data.publications);
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
   ANNOUNCEMENTS (derived from publications)
   ========================================================= */
function renderAnnouncements(pubs) {
  const c = $("announcements");
  if (!c || !pubs) return;

  const all = [
    ...(pubs.journals || []),
    ...(pubs.conference_proceedings || [])
  ];

  all
    .filter(p => typeof p.year === "number")
    .sort((a, b) => b.year - a.year)
    .slice(0, 5)
    .forEach(p => {
      const d = document.createElement("div");
      d.className = "announce";
      d.innerHTML = `<h3>${p.title}</h3><small>${p.venue} (${p.year})</small>`;
      c.appendChild(d);
    });
}
/* =========================================================
   EXPERIENCE
   ========================================================= */
function renderExperience(arr = []) {
  const c = $("experience");
  if (!c) return;

  arr.forEach(e => {
    const d = document.createElement("div");
    d.className = "item";
    d.innerHTML = `
      <strong>${e.role}</strong>, ${e.institution}<br>
      <em>${e.period}</em><br>
      ${(e.responsibilities || []).join("<br>")}
    `;
    c.appendChild(d);
  });
}

/* =========================================================
   EDUCATION
   ========================================================= */
function renderEducation(arr = []) {
  const c = $("education");
  if (!c) return;

  arr.forEach(e => {
    const d = document.createElement("div");
    d.className = "item";
    d.innerHTML = `
      <strong>${e.degree}</strong>, ${e.institution}<br>
      <em>${e.period || e.year}</em><br>
     ${e.location ? `<span>${e.location}</span>` : ""}
    `;
    c.appendChild(d);
  });
}

/* =========================================================
   PUBLICATIONS
   ========================================================= */
function renderPublications(pubs) {
  const c = $("publications");
  if (!c || !pubs) return;

  ["journals", "conference_proceedings"].forEach(type => {
    (pubs[type] || []).forEach(p => {
      const d = document.createElement("div");
      d.className = "pub-item";
      d.innerHTML = `
        <strong>${p.title}</strong><br>
        ${p.authors.join(", ")}<br>
        <em>${p.venue} (${p.year})</em>
      `;
      c.appendChild(d);
    });
  });
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
    block.className = "item";

    // Header: Role + Institution
    block.innerHTML = `
      <strong>${t.role}</strong>, ${t.institution}
    `;

    // Courses list
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
  if (!c) return;

  arr.forEach(a => {
    const d = document.createElement("div");
    d.className = "item";
    d.textContent = "• " + a;
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


function renderSkills(skills = {}) {
  const c = $("technical_skills");
  if (!c || typeof skills !== "object") return;

  Object.entries(skills).forEach(([category, items]) => {
    const block = document.createElement("div");
    block.className = "item";

    block.innerHTML = `<strong>${category}</strong>`;

    const ul = document.createElement("ul");

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
   UI ENHANCEMENTS (SAFE)
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
  const obs = new IntersectionObserver(e =>
    e.forEach(x => x.isIntersecting && x.target.classList.add("visible")),
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
