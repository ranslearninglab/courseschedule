/* ---------------- Syllabus data (from data/syllabus.ts) ---------------- */

const modules = [
  {
    id: 1,
    title: 'Introducing Learning Analytics',
    weeks: 'Weeks 1 & 2',
    items: [
      { label: 'Selected readings', type: 'reading' },
      { label: 'Discussion: Investigating big data', type: 'discussion' },
      { label: 'Task 1: Explore Canvas data', type: 'task' },
    ],
  },
  {
    id: 2,
    title: 'Exploring Institutional & Educational Data',
    weeks: 'Weeks 3 & 4',
    items: [
      { label: 'Selected readings', type: 'reading' },
      { label: 'Task 2A: Analytics in your own teaching or learning context', type: 'task' },
      { label: 'Task 2B: Get your hands dirty — explore some real data', type: 'task' },
    ],
  },
  {
    id: 3,
    title: 'Learning Analytics Methods & Tools',
    weeks: 'Weeks 5 & 6',
    items: [
      { label: 'Selected readings', type: 'reading' },
      { label: 'Task 3: Investigate analytic methods', type: 'task' },
      { label: 'Discussion: Which LA tools are missing?', type: 'discussion' },
    ],
  },
  {
    id: 4,
    title: 'Ethical Issues in Learning Analytics',
    weeks: 'Week 7',
    items: [
      { label: 'Selected readings', type: 'reading' },
      { label: 'Work on your choice of Task 4A, 4B, or 4C', type: 'task' },
    ],
  },
  {
    id: 5,
    title: 'Where to Begin? Planning for Learning Analytics',
    weeks: 'Week 8',
    items: [
      { label: 'Selected readings', type: 'reading' },
      { label: 'Discussion: Visions of learning analytics around the world', type: 'discussion' },
      { label: 'Task 4A: Pedagogy-driven analytics questions for your local context', type: 'task' },
      { label: 'Task 4B: An institutional policy on ethical use of student data', type: 'task' },
      { label: 'Task 4C: You advise on institutional LA implementation', type: 'task' },
    ],
  },
  {
    id: 6,
    title: 'Evaluating Learning Analytics Tools',
    weeks: 'Week 9',
    items: [
      { label: 'Selected readings', type: 'reading' },
      { label: 'Discussion: Smoke and mirrors? LA tool vendor videos & promo materials', type: 'discussion' },
      { label: 'Assignment 1: Evaluating a learning analytics tool', type: 'assignment' },
    ],
  },
  {
    id: 7,
    title: 'Choose Your Own Learning Analytics Adventure',
    weeks: 'Weeks 10 – 13',
    items: [
      { label: 'Choose your learning analytics adventure!', type: 'task' },
      { label: 'Assignment 2a: Submit your adventure proposal (not graded)', type: 'assignment' },
      { label: 'Assignment 2b: A report on your LA adventure', type: 'assignment' },
      { label: 'Task 5: Share a video tour summary of your LA adventure', type: 'task' },
    ],
  },
];

/* ---------------- Type metadata ---------------- */

const typeMeta = {
  reading: { label: 'Reading' },
  discussion: { label: 'Discussion' },
  task: { label: 'Task' },
  assignment: { label: 'Assignment' },
};

const filterOrder = ['reading', 'discussion', 'task', 'assignment'];
const scheduleTypes = ['task', 'assignment'];

/* ---------------- Small inline icon set (no external deps) ---------------- */

const icons = {
  reading:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M4 5c2.5-1 5-1 8 0v14c-3-1-5.5-1-8 0V5Z"/><path d="M20 5c-2.5-1-5-1-8 0v14c3-1 5.5-1 8 0V5Z"/></svg>',
  discussion:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z"/></svg>',
  task:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="m3 7 3 3 5-5"/><path d="M13 6h8"/><path d="m3 17 3 3 5-5"/><path d="M13 18h8"/></svg>',
  assignment:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/><path d="M9 13h6M9 17h6"/></svg>',
  module:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M22 10 12 5 2 10l10 5 10-5Z"/><path d="M6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5"/></svg>',
};

/* ---------------- State ---------------- */

let selectedTypes = new Set(); // empty = "view all"
let viewMode = 'modules'; // 'modules' | 'tasks'

/* ---------------- Helpers ---------------- */

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/* ---------------- Rendering: filter chips ---------------- */

function renderFilterChips() {
  const row = document.getElementById('filterRow');
  // remove any previously injected type chips (keep the label + "View All" button)
  row.querySelectorAll('[data-type]').forEach((el) => el.remove());

  filterOrder.forEach((type) => {
    const meta = typeMeta[type];
    const btn = document.createElement('button');
    btn.className = 'filter-chip';
    btn.dataset.type = type;
    btn.setAttribute('aria-pressed', selectedTypes.has(type) ? 'true' : 'false');
    if (selectedTypes.has(type)) btn.classList.add('is-active');
    btn.innerHTML = `${icons[type].replace('<svg ', '<svg class="icon-sm" ')}${meta.label}`;
    btn.addEventListener('click', () => toggleFilter(type));
    row.appendChild(btn);
  });
}

function toggleFilter(type) {
  if (selectedTypes.has(type)) {
    selectedTypes.delete(type);
  } else {
    selectedTypes.add(type);
  }
  syncFilterUI();
  renderContent();
}

function setViewAll() {
  selectedTypes = new Set();
  syncFilterUI();
  renderContent();
}

function syncFilterUI() {
  const viewAllBtn = document.getElementById('viewAllBtn');
  const isAll = selectedTypes.size === 0;
  viewAllBtn.classList.toggle('is-active', isAll);
  viewAllBtn.setAttribute('aria-pressed', isAll ? 'true' : 'false');

  document.querySelectorAll('.filter-chip[data-type]').forEach((btn) => {
    const active = selectedTypes.has(btn.dataset.type);
    btn.classList.toggle('is-active', active);
    btn.setAttribute('aria-pressed', active ? 'true' : 'false');
  });
}

/* ---------------- Rendering: module timeline ---------------- */

function renderModuleCard(module) {
  const activeFilter = selectedTypes.size > 0 ? selectedTypes : null;
  const visibleItems = activeFilter ? module.items.filter((i) => activeFilter.has(i.type)) : module.items;
  const hasVisible = visibleItems.length > 0;

  const itemsHtml = hasVisible
    ? `<ul class="module-items">
        ${visibleItems
          .map(
            (item) => `
          <li class="module-item" data-type="${item.type}">
            <span class="module-item-icon">${icons[item.type]}</span>
            <div class="module-item-body">
              <p class="module-item-label">${escapeHtml(item.label)}</p>
              <span class="module-item-type">${typeMeta[item.type].label}</span>
            </div>
          </li>`,
          )
          .join('')}
      </ul>`
    : `<p class="module-empty">No items match the selected filters.</p>`;

  return `
    <div class="timeline-row">
      <div class="timeline-badge">${module.id}</div>
      <article class="module-card ${hasVisible ? 'is-highlighted' : 'is-dimmed'}">
        <div class="module-card-stripe"></div>
        <div class="module-card-head">
          <div class="module-icon">${icons.module}</div>
          <div class="module-meta">
            <div class="module-meta-row">
              <span class="module-badge">Module ${module.id}</span>
              <span class="module-weeks">${module.weeks}</span>
            </div>
            <h3 class="module-title">${escapeHtml(module.title)}</h3>
          </div>
        </div>
        ${itemsHtml}
      </article>
    </div>`;
}

function renderModulesView() {
  return `
    <div class="timeline">
      <div class="timeline-line"></div>
      <div class="timeline-items">
        ${modules.map(renderModuleCard).join('')}
      </div>
    </div>`;
}

/* ---------------- Rendering: tasks & assignments table ---------------- */

function renderTasksView() {
  const rows = [];
  modules.forEach((m) => {
    m.items
      .filter((i) => scheduleTypes.includes(i.type))
      .forEach((item) => rows.push({ module: m, item }));
  });

  return `
    <div class="tasks-wrap">
      <div class="tasks-grid">
        ${rows
          .map(
            (row) => `
          <span class="task-num">${row.module.id}</span>
          <p class="task-label">${escapeHtml(row.item.label)}</p>
          <span class="task-chip" data-type="${row.item.type}">
            ${icons[row.item.type].replace('<svg ', '<svg class="icon-sm" ')}
            ${typeMeta[row.item.type].label}
          </span>
          <span class="task-weeks">${row.module.weeks}</span>`,
          )
          .join('')}
      </div>
    </div>`;
}

/* ---------------- Main render ---------------- */

function renderContent() {
  const content = document.getElementById('content');
  content.innerHTML = viewMode === 'tasks' ? renderTasksView() : renderModulesView();
}

function renderSummary() {
  document.getElementById('summaryText').textContent =
    `${modules.length} modules · 13 weeks · 4 graded & choice-based tasks`;
}

function setViewMode(mode) {
  viewMode = mode;
  document.getElementById('viewModulesBtn').classList.toggle('is-active', mode === 'modules');
  document.getElementById('viewModulesBtn').setAttribute('aria-pressed', mode === 'modules' ? 'true' : 'false');
  document.getElementById('viewTasksBtn').classList.toggle('is-active', mode === 'tasks');
  document.getElementById('viewTasksBtn').setAttribute('aria-pressed', mode === 'tasks' ? 'true' : 'false');
  renderContent();
}

/* ---------------- Init ---------------- */

document.addEventListener('DOMContentLoaded', () => {
  renderSummary();
  renderFilterChips();
  renderContent();

  document.getElementById('viewAllBtn').addEventListener('click', setViewAll);
  document.getElementById('viewModulesBtn').addEventListener('click', () => setViewMode('modules'));
  document.getElementById('viewTasksBtn').addEventListener('click', () => setViewMode('tasks'));
});
