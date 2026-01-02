const el = (s) => document.querySelector(s);

fetch("index.json")
  .then(res => res.json())
  .then(data => {
    renderAbout(data.about);
    renderAnnouncements(data.announcements);
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
  });

function renderAbout(a) {
  el("#name").textContent = a.name;
  el("#title").textContent = a.title;
  el("#photo").src = a.photo.src;
  el("#email").textContent = a.email;
  el("#email").href = `mailto:${a.email}`;
  el("#linkedin").href = a.linkedin;
  el("#github").href = a.github;
}

function renderAnnouncements(arr) {
  const container = el("#announcements");
  arr.forEach(x => {
    const d = document.createElement("div");
    d.className = "announce";
    d.innerHTML = `<h3>${x.title}</h3><small>${x.date}</small><p>${x.text}</p>`;
    container.appendChild(d);
  });
}

function renderPublications(pubs) {
  const container = el("#publications");
  ["journals", "conference_proceedings"].forEach(cat => {
    pubs[cat].forEach(pub => {
      const d = document.createElement("div");
      d.className = "pub-item";
      d.innerHTML = `<strong>${pub.title}</strong><br>${pub.authors.join(", ")}<br><em>${pub.venue} (${pub.year})</em>`;
      container.appendChild(d);
    });
  });
}

function renderList(section, arr) {
  const container = el("#" + section);
  arr.forEach(item => {
    const d = document.createElement("div");
    d.className = "item";
    if (typeof item === "string") {
      d.textContent = "• " + item;
    } else {
      d.innerHTML = `<strong>${item.title || item.institution}</strong><br>${item.details ? item.details.join("<br>") : item.period}`;
    }
    container.appendChild(d);
  });
}

function renderSkills(arr) {
  const container = el("#skills");
  arr.forEach(skill => {
    const s = document.createElement("span");
    s.className = "skill";
    s.textContent = skill;
    container.appendChild(s);
  });
}

function renderReferences(arr) {
  const c = el("#references");
  arr.forEach(r => {
    const d = document.createElement("div");
    d.className = "ref";
    d.innerHTML = `<strong>${r.name}</strong>, ${r.designation}, ${r.institution}<br>${r.email}`;
    c.appendChild(d);
  });
}
