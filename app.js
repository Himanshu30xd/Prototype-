const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

/* One entry per page. Each tab is a link to its own HTML file. */
const pages = {
  recruitment: { href: 'index.html',         name: 'Recruitment',     add: 'New role',            active: 'Open',     done: 'Closed', n1: 'Applicants', n2: 'Views' },
  trade:       { href: 'import-export.html', name: 'Import / Export', add: 'New shipment record', active: 'Pending',  done: 'Done',   n1: 'Files',      n2: 'Downloads' },
  event:       { href: 'event.html',         name: 'Event',           add: 'New event',           active: 'Upcoming', done: 'Past',   n1: 'Going',      n2: 'Views' }
};
const tab = document.body.dataset.page;
const c = pages[tab];

/* Data is saved in the browser, so it is shared between the three pages. */
let id = 0;
const mk = (t, d, s, n1, n2) => ({ id: ++id, t, d, s, n1, n2 });
const seed = () => ({
  recruitment: [
    mk('Frontend Developer', '2026-09-11', 'active', 4, 120),
    mk('', '2026-07-14', 'done', 0, 0),
    mk('Logistics Coordinator (Rotterdam)', '2026-06-26', 'done', 2, 85),
    mk('Customs Specialist', '2025-05-14', 'done', 7, 340),
    mk('Account Manager', '2025-05-14', 'done', 3, 217)
  ],
  trade: [
    mk('Shanghai to Rotterdam, HD-1042', '2026-10-02', 'active', 2, 14),
    mk('Hamburg to New York, HD-1043', '2026-09-20', 'active', 1, 6),
    mk('Singapore to Sydney, HD-1044', '2026-08-05', 'done', 3, 41)
  ],
  event: [
    mk('Annual meeting', '2026-11-05', 'active', 48, 190),
    mk('Customs law workshop', '2026-11-20', 'active', 15, 72),
    mk('Year-end party', '2026-12-18', 'active', 63, 250),
    mk('Summer offsite', '2026-07-14', 'done', 37, 301)
  ]
});
let db;
try { db = JSON.parse(localStorage.getItem('desk-db')); } catch (e) {}
if (!db || !db.recruitment) db = seed();
id = Math.max(0, ...Object.values(db).flat().map(x => x.id));
const save = () => { try { localStorage.setItem('desk-db', JSON.stringify(db)); } catch (e) {} };

const icons = {
  share: '<svg viewBox="0 0 24 24"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/></svg>',
  chat: '<svg viewBox="0 0 24 24"><path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1z"/></svg>',
  bars: '<svg viewBox="0 0 24 24"><path d="M5 9.2h3V19H5V9.2zM10.6 5h2.8v14h-2.8V5zm5.6 8H19v6h-2.8v-6z"/></svg>',
  dots: '<svg viewBox="0 0 24 24"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>'
};

/* Page shell */
$('app').className = 'app';
$('app').innerHTML = `
  <div class="bar">
    <button class="ib" aria-label="Menu"><svg viewBox="0 0 24 24"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg></button>
    <a class="logo" href="index.html" aria-label="Home">D</a>
    <div class="sp"></div>
    <button class="ib on" aria-label="Search"><svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg></button>
    <button class="ib" aria-label="Help"><svg viewBox="0 0 24 24"><path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z"/></svg></button>
    <div class="avatar" aria-hidden="true"></div>
  </div>
  <nav class="tabs">
    ${Object.entries(pages).map(([k, p]) => `<a class="tab" href="${p.href}"${k === tab ? ' aria-current="page"' : ''}>${p.name}</a>`).join('')}
  </nav>
  <div class="row">
    <select id="filter" aria-label="Filter"></select>
    <span style="flex:1"></span>
    <svg class="label-ic" viewBox="0 0 24 24"><path d="M17.63 5.84C17.27 5.33 16.67 5 16 5L5 5.01C3.9 5.01 3 5.9 3 7v10c0 1.1.9 1.99 2 1.99L16 19c.67 0 1.27-.33 1.63-.84L22 12l-4.37-6.16z"/></svg>
    <button class="manage" id="manage">MANAGE</button>
  </div>
  <div class="list" id="list"></div>
  <button class="fab" id="fab" aria-label="Add new"><svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg></button>
  <dialog id="dlg">
    <form method="dialog" id="form">
      <h3 id="dTitle"></h3>
      <label for="fT">Title</label><input id="fT" required maxlength="80">
      <label for="fD">Date</label><input id="fD" type="date" required>
      <div class="btns">
        <button type="button" id="cancel">CANCEL</button>
        <button class="pri" type="submit">SAVE</button>
      </div>
    </form>
  </dialog>`;

let filter = 'all';
function fmt(iso) {
  const d = new Date(iso + 'T00:00:00');
  const s = d.toLocaleString('en', { month: 'short', day: 'numeric' });
  return d.getFullYear() === new Date().getFullYear() ? s : s + ', ' + d.getFullYear();
}
function render() {
  const all = db[tab];
  $('filter').innerHTML =
    `<option value="all">All (${all.length})</option>` +
    `<option value="active">${c.active} (${all.filter(x => x.s === 'active').length})</option>` +
    `<option value="done">${c.done} (${all.filter(x => x.s === 'done').length})</option>`;
  $('filter').value = filter;
  const items = all.filter(x => filter === 'all' || x.s === filter).sort((a, b) => b.d.localeCompare(a.d));
  $('list').innerHTML = items.length ? items.map(x => {
    const title = x.t || '(Untitled)';
    const letter = esc(title.replace(/[^\p{L}\p{N}]/gu, '').charAt(0).toUpperCase() || '?');
    const g = x.s === 'active' && x.n2 > 100 ? ' g' + (x.id % 3) : '';
    return `<article class="card ${x.s === 'done' ? 'done' : ''}">
      <div class="thumb${g}" aria-hidden="true">${letter}</div>
      <div class="info">
        <div class="title">${esc(title)}</div>
        <div class="meta">
          <span class="date">${fmt(x.d)}</span>
          <button class="share" data-share="${x.id}" aria-label="Share">${icons.share}</button>
          <span class="stat" title="${c.n1}">${x.n1}${icons.chat}</span>
          <span class="stat" title="${c.n2}">${x.n2}${icons.bars}</span>
        </div>
      </div>
      <button class="ib dots" data-menu="${x.id}" aria-label="More options">${icons.dots}</button>
    </article>`;
  }).join('') : '<p class="none">Nothing here yet. Tap + to add one.</p>';
}

$('filter').onchange = e => { filter = e.target.value; render(); };
$('manage').onclick = () => { filter = 'all'; render(); };

function closeMenu() { document.querySelectorAll('.menu').forEach(m => m.remove()); }
document.addEventListener('click', e => {
  const m = e.target.closest('[data-menu]');
  const s = e.target.closest('[data-share]');
  const a = e.target.closest('[data-act]');
  if (a) {
    const x = db[tab].find(i => i.id === +a.dataset.id);
    if (a.dataset.act === 'toggle') x.s = x.s === 'done' ? 'active' : 'done';
    else db[tab] = db[tab].filter(i => i !== x);
    save(); closeMenu(); render(); return;
  }
  closeMenu();
  if (m) {
    e.stopPropagation();
    const x = db[tab].find(i => i.id === +m.dataset.menu);
    const box = document.createElement('div');
    box.className = 'menu';
    box.innerHTML = `<button data-act="toggle" data-id="${x.id}">Mark ${(x.s === 'done' ? c.active : c.done).toLowerCase()}</button>
                     <button data-act="del" data-id="${x.id}">Delete</button>`;
    m.parentElement.appendChild(box);
  }
  if (s) {
    const x = db[tab].find(i => i.id === +s.dataset.share);
    const text = x.t || '(Untitled)';
    if (navigator.share) navigator.share({ title: text, text }).catch(() => {});
    else if (navigator.clipboard) navigator.clipboard.writeText(text);
  }
});

$('fab').onclick = () => {
  $('dTitle').textContent = c.add;
  $('fT').value = '';
  $('fD').value = new Date().toISOString().slice(0, 10);
  $('dlg').showModal();
  $('fT').focus();
};
$('cancel').onclick = () => $('dlg').close();
$('form').onsubmit = () => {
  db[tab].push(mk($('fT').value.trim(), $('fD').value, 'active', 0, 0));
  save(); render();
};

render();
