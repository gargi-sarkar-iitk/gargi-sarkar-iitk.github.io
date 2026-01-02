/* ===== GLOBAL HELPERS ===== */
const el = (selector) => document.querySelector(selector);

const formatDate = (str) => {
  const d = new Date(str);
  return isNaN(d) ? str : d.toLocaleDateString(undefined, { year: 'numeric', month: 'short' });
};

const sortRecentOld = (arr, key = 'date') =>
  arr.sort((a, b) => new Date(b[key]) - new Date(a[key]));

/* ===== FETCH JSON & INIT ===== */
fetch('index.json')
  .then(res => res.json())
  .then(data => {
    renderProfile(data.profile);
    renderAnnouncements(data.announcements);
    renderPublications(sortRecentOld(data.publications, 'year'));
    renderExperience(data.experience);
    renderEducation(data.education);
    renderSkills(data.skills);
    setupNavigation();
  })
  .catch(err => console.error("JSON load failed:", err));

/* ===== RENDER FUNCTIONS ===== */
function renderProfile(p) {
  el('#name').textContent = p.name;
  el('#title').textContent = p.title;
  if (p.photo) el('#photo').src = p.photo;
  if (p.contact) {
    el('#email').href = `mailto:${p.contact.email}`;
    el('#linkedin').href = p.contact.linkedin;
    el('#github').href = p.contact.github;
  }
}

function renderAnnouncements(arr) {
  if (!arr || !arr.length) return;
  sortRecentOld(arr, 'date');
  const container = el('#announcements');
  container.innerHTML = '';
  arr.forEach(item => {
    const div = document.createElement('div');
    div.classList.add('announce');
    div.innerHTML = `
      <h4>${item.title}</h4>
      <small>${formatDate(item.date)}</small>
      <p>${item.text}</p>
    `;
    container.appendChild(div);
  });
  startAnnouncementCarousel();
}

function startAnnouncementCarousel() {
  let current = 0;
  const items = document.querySelectorAll('.announce');
  if (!items.length) return;
  items.forEach((el, i) => {
    el.style.display = i === 0 ? 'block' : 'none';
  });
  setInterval(() => {
    items[current].style.display = 'none';
    current = (current + 1) % items.length;
    items[current].style.display = 'block';
  }, 5000);
}

function renderPublications(arr) {
  const container = el('#publications');
  container.innerHTML = '';
  arr.forEach(pub => {
    const div = document.createElement('div');
    div.classList.add('pub-item');
    div.innerHTML = `
      <h5>${pub.title}</h5>
      <p><em>${pub.venue || ''} (${pub.year})</em></p>
      <p>${pub.authors.join(', ')}</p>
    `;
    container.appendChild(div);
  });
}

function renderExperience(arr) {
  const container = el('#experience');
  container.innerHTML = '';
  arr.forEach(exp => {
    const div = document.createElement('div');
    div.classList.add('exp-item');
    div.innerHTML = `
      <h5>${exp.role} @ ${exp.org}</h5>
      <small>${formatDate(exp.start)} – ${formatDate(exp.end)}</small>
      <p>${exp.description}</p>
    `;
    container.appendChild(div);
  });
}

function renderEducation(arr) {
  const container = el('#education');
  container.innerHTML = '';
  arr.forEach(ed => {
    const div = document.createElement('div');
    div.classList.add('edu-item');
    div.innerHTML = `
      <h5>${ed.degree}, ${ed.institution}</h5>
      <small>${formatDate(ed.start)} – ${formatDate(ed.end)}</small>
    `;
    container.appendChild(div);
  });
}

function renderSkills(arr) {
  const container = el('#skills');
  container.innerHTML = '';
  arr.forEach(skill => {
    const span = document.createElement('span');
    span.classList.add('skill');
    span.textContent = skill;
    container.appendChild(span);
  });
}

/* ===== NAVIGATION ===== */
function setupNavigation() {
  document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = e.target.getAttribute('href').replace('#','');
      document.getElementById(target).scrollIntoView({ behavior: 'smooth' });
    });
  });
}

/* ===== RESPONSIVE MENU ===== */
el('#menuToggle').addEventListener('click', () => {
  el('nav ul').classList.toggle('open');
});

/* ===== FIX LAYOUT CENTERING ===== */
window.addEventListener('DOMContentLoaded', () => {
  document.body.classList.remove('left-align');
});
