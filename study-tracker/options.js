import {
  allItems, deleteItem, putItem,
  isDirty, clearDirty, lastBackupAt,
} from './storage.js';
import { buildExport, parseImport } from './schema.js';
import {
  pickBackupFolder, writeBackup, readBackup, getBackupFolderName,
} from './backup.js';

const $ = (id) => document.getElementById(id);
const PAGE_SIZE = 50;

let cache = [];
let filteredCache = [];
let renderedCount = 0;
let sentinelObserver = null;

function parseQuery(raw) {
  const tokens = (raw || '').toLowerCase().trim().split(/\s+/).filter(Boolean);
  const terms = [];
  const filters = { tag: [], status: [], url: [], is: [] };
  for (const t of tokens) {
    const m = t.match(/^(tag|status|url|is):(.+)$/);
    if (m && filters[m[1]]) filters[m[1]].push(m[2]);
    else terms.push(t);
  }
  return { terms, filters };
}

function matchesItem(item, parsed) {
  const { terms, filters } = parsed;
  for (const tag of filters.tag) {
    if (!item.tags.some((t) => t.toLowerCase().includes(tag))) return false;
  }
  for (const s of filters.status) {
    if (item.status !== s) return false;
  }
  for (const u of filters.url) {
    if (!(item.url || '').toLowerCase().includes(u)) return false;
  }
  for (const i of filters.is) {
    if (i === 'revisited' && !(item.revisitCount > 0)) return false;
    if (i === 'youtube' && item.source !== 'youtube') return false;
    if (i === 'web' && item.source !== 'web') return false;
    if (i === 'done' && item.status !== 'done') return false;
  }
  if (terms.length === 0) return true;
  const hay = `${item.title} ${item.url} ${item.notes} ${item.tags.join(' ')}`.toLowerCase();
  return terms.every((t) => hay.includes(t));
}

async function render() {
  cache = await allItems();
  applyFilter();
  await updateStatusBar();
}

function applyFilter() {
  const parsed = parseQuery($('search').value);
  const status = $('filter-status').value;
  filteredCache = cache.filter((it) => {
    if (status && it.status !== status) return false;
    return matchesItem(it, parsed);
  });
  renderedCount = 0;
  $('items').innerHTML = '';
  $('count').textContent = `${filteredCache.length} ${filteredCache.length === 1 ? 'item' : 'items'}`;
  if (filteredCache.length === 0) {
    $('items').innerHTML = '<div class="empty"><span class="empty-title">Nothing matches</span>Try clearing the search or filter.</div>';
    if (cache.length === 0) {
      $('items').innerHTML = '<div class="empty"><span class="empty-title">Nothing here yet</span>Click the Study Tracker icon on any page to save it.</div>';
    }
    return;
  }
  renderNextPage();
}

function renderNextPage() {
  const root = $('items');
  const slice = filteredCache.slice(renderedCount, renderedCount + PAGE_SIZE);
  for (const it of slice) root.appendChild(buildCard(it));
  renderedCount += slice.length;

  const old = document.getElementById('scroll-sentinel');
  if (old) old.remove();

  if (renderedCount < filteredCache.length) {
    const sentinel = document.createElement('div');
    sentinel.id = 'scroll-sentinel';
    sentinel.textContent = `${filteredCache.length - renderedCount} more…`;
    root.appendChild(sentinel);
    if (!sentinelObserver) {
      sentinelObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) renderNextPage();
      }, { rootMargin: '300px' });
    }
    sentinelObserver.observe(sentinel);
  }
}

function buildCard(it) {
  const card = document.createElement('div');
  card.className = 'card';

  if (it.thumbnail) {
    const img = document.createElement('img');
    img.className = 'thumb';
    img.loading = 'lazy';
    img.src = it.thumbnail;
    img.alt = '';
    card.appendChild(img);
  }

  const body = document.createElement('div');
  body.className = 'body';

  const a = document.createElement('a');
  a.className = 'title';
  a.href = it.url;
  a.target = '_blank';
  a.rel = 'noopener';
  a.textContent = it.title || it.url;
  body.appendChild(a);

  const meta = document.createElement('div');
  meta.className = 'meta';
  const badge = document.createElement('span');
  badge.className = `badge ${it.source}`;
  badge.textContent = it.source;
  meta.appendChild(badge);

  const sel = document.createElement('select');
  sel.className = 'status';
  sel.dataset.status = it.status;
  for (const s of ['queued', 'studying', 'done']) {
    const o = document.createElement('option');
    o.value = s; o.textContent = s;
    if (it.status === s) o.selected = true;
    sel.appendChild(o);
  }
  sel.addEventListener('change', async () => {
    it.status = sel.value;
    sel.dataset.status = sel.value;
    await putItem(it);
    autoBackup();
  });
  meta.appendChild(sel);

  const date = document.createElement('span');
  date.textContent = new Date(it.createdAt).toLocaleDateString();
  meta.appendChild(date);

  const count = it.revisitCount || 0;
  if (count > 0) {
    const pop = document.createElement('span');
    pop.className = 'popularity';
    if (count >= 5) pop.classList.add('hot');
    else if (count >= 2) pop.classList.add('warm');
    const last = (it.revisitedAt && it.revisitedAt.length)
      ? it.revisitedAt[it.revisitedAt.length - 1]
      : null;
    pop.textContent = `↻ ${count}× revisited`;
    if (last) pop.title = `Last revisited ${new Date(last).toLocaleString()}`;
    meta.appendChild(pop);
  }

  body.appendChild(meta);

  if (it.tags.length) {
    const tags = document.createElement('div');
    tags.className = 'tags';
    for (const t of it.tags) {
      const chip = document.createElement('span');
      chip.className = 'tag';
      chip.textContent = `#${t}`;
      tags.appendChild(chip);
    }
    body.appendChild(tags);
  }

  if (it.notes) {
    const notes = document.createElement('div');
    notes.className = 'notes';
    notes.textContent = it.notes;
    body.appendChild(notes);
  }

  const del = document.createElement('button');
  del.className = 'delete';
  del.textContent = 'Delete';
  del.addEventListener('click', async () => {
    if (!confirm('Delete this item?')) return;
    await deleteItem(it.id);
    await render();
    autoBackup();
  });
  body.appendChild(del);

  card.appendChild(body);
  return card;
}

async function updateStatusBar() {
  const folder = await getBackupFolderName();
  const last = await lastBackupAt();
  const dirty = await isDirty();
  const folderTxt = folder ? `📁 ${folder}` : 'No backup folder set';
  const lastTxt = last ? `last backup ${new Date(last).toLocaleString()}` : 'never backed up';
  const dirtyTxt = dirty ? ' · pending changes' : '';
  $('status-bar').textContent = `${folderTxt} · ${lastTxt}${dirtyTxt}`;
}

async function autoBackup() {
  const folder = await getBackupFolderName();
  if (!folder) { await updateStatusBar(); return; }
  try {
    await writeBackup(buildExport(await allItems()));
    await clearDirty();
  } catch (e) {
    console.warn('auto backup failed', e);
  }
  await updateStatusBar();
}

$('pick-folder').addEventListener('click', async () => {
  try {
    const name = await pickBackupFolder();
    await autoBackup();
    alert(`Backup folder set: ${name}`);
  } catch (e) {
    if (e.name !== 'AbortError') alert(`Failed: ${e.message}`);
  }
});

$('backup-now').addEventListener('click', async () => {
  const folder = await getBackupFolderName();
  if (!folder) { alert('Pick a backup folder first.'); return; }
  try {
    await writeBackup(buildExport(await allItems()));
    await clearDirty();
    await updateStatusBar();
    alert('Backup written.');
  } catch (e) {
    alert(`Failed: ${e.message}`);
  }
});

$('restore').addEventListener('click', async () => {
  const folder = await getBackupFolderName();
  if (!folder) { alert('Pick a backup folder first.'); return; }
  try {
    const data = await readBackup();
    if (!data) { alert('No backup file found in that folder.'); return; }
    const items = parseImport(data);
    if (!confirm(`Restore ${items.length} items? Items with matching IDs will be overwritten.`)) return;
    for (const it of items) await putItem(it);
    await render();
    alert(`Restored ${items.length} items.`);
  } catch (e) {
    alert(`Failed: ${e.message}`);
  }
});

function buildQueueMarkdown(items) {
  const date = new Date().toLocaleDateString(undefined, {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
  const lines = [`# Study queue · ${items.length} item${items.length === 1 ? '' : 's'}`, `_${date}_`, ''];
  for (const it of items) {
    const title = (it.title || it.url).replace(/\n/g, ' ').trim();
    lines.push(`- [${title}](${it.url})`);
    if (it.tags.length) lines.push(`  - tags: ${it.tags.map((t) => `#${t}`).join(' ')}`);
    if (it.notes) {
      const note = it.notes.replace(/\n+/g, ' ').trim();
      lines.push(`  - ${note}`);
    }
    if (it.revisitCount > 0) lines.push(`  - revisited ${it.revisitCount}×`);
  }
  return lines.join('\n');
}

$('copy-queue').addEventListener('click', async () => {
  const queued = cache.filter((it) => it.status === 'queued');
  if (queued.length === 0) { alert('Nothing in the queue.'); return; }
  const md = buildQueueMarkdown(queued);
  try {
    await navigator.clipboard.writeText(md);
    alert(`Copied ${queued.length} queued item${queued.length === 1 ? '' : 's'} to clipboard.\nPaste into Notes, Messages, email — wherever.`);
  } catch (e) {
    alert(`Couldn't copy: ${e.message}`);
  }
});

$('export').addEventListener('click', async () => {
  const blob = new Blob(
    [JSON.stringify(buildExport(await allItems()), null, 2)],
    { type: 'application/json' }
  );
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `study-tracker-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
});

$('import').addEventListener('click', () => $('import-file').click());
$('import-file').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const items = parseImport(JSON.parse(await file.text()));
    if (!confirm(`Import ${items.length} items?`)) return;
    for (const it of items) await putItem(it);
    await render();
    alert(`Imported ${items.length} items.`);
  } catch (err) {
    alert(`Failed: ${err.message}`);
  }
  e.target.value = '';
});

let searchTimer = null;
$('search').addEventListener('input', () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(applyFilter, 120);
});
$('filter-status').addEventListener('change', applyFilter);

let storageChangeTimer = null;
chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== 'local') return;
  const itemChanged = Object.keys(changes).some((k) => k.startsWith('item:'));
  if (!itemChanged) return;
  clearTimeout(storageChangeTimer);
  storageChangeTimer = setTimeout(async () => {
    const scrollY = window.scrollY;
    await render();
    window.scrollTo(0, scrollY);
  }, 60);
});

(async () => {
  await render();
  if (await isDirty()) autoBackup();
})();
