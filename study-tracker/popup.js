import { putItem, allItems, clearDirty, findByUrl } from './storage.js';
import { newItem, buildExport } from './schema.js';
import { writeBackup, getBackupFolderName } from './backup.js';

const $ = (id) => document.getElementById(id);

function relativeTime(iso) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  const d = Math.floor(diff / 86400);
  if (d < 30) return `${d}d ago`;
  return new Date(iso).toLocaleDateString();
}

async function init() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const url = tab.url || '';
  $('url').value = url;
  $('title').value = tab.title || '';

  const isYouTube = /youtube\.com\/watch|youtu\.be\//.test(url);
  let thumbnail = '';
  let source = 'web';
  let type = 'web';

  if (isYouTube) {
    source = 'youtube';
    type = 'video';
    try {
      const r = await fetch(
        `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`
      );
      if (r.ok) {
        const data = await r.json();
        if (data.thumbnail_url) thumbnail = data.thumbnail_url;
        if (data.title) $('title').value = data.title;
      }
    } catch {}
  }

  const existing = await findByUrl(url);
  if (existing) {
    $('subtitle').textContent = 'Already saved — update it';
    $('existing-notice').hidden = false;
    const count = existing.revisitCount || 0;
    const countTxt = count > 0 ? ` · revisited ${count}×` : '';
    $('existing-notice').textContent = `Saved ${relativeTime(existing.createdAt)}${countTxt}`;
    $('title').value = existing.title;
    $('tags').value = existing.tags.join(', ');
    $('notes').value = existing.notes;
    $('status').value = existing.status;
    $('submit-btn').textContent = 'Update';
    thumbnail = existing.thumbnail || thumbnail;
    source = existing.source || source;
    type = existing.type || type;
  }

  $('save-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    let item;
    if (existing) {
      const now = new Date().toISOString();
      item = {
        ...existing,
        title: $('title').value,
        tags: $('tags').value.split(',').map((s) => s.trim()).filter(Boolean),
        notes: $('notes').value,
        status: $('status').value,
        thumbnail,
        source,
        type,
        revisitCount: (existing.revisitCount || 0) + 1,
        revisitedAt: [...(existing.revisitedAt || []), now],
      };
    } else {
      item = newItem({
        url: $('url').value,
        title: $('title').value,
        type,
        source,
        thumbnail,
        tags: $('tags').value.split(',').map((s) => s.trim()).filter(Boolean),
        notes: $('notes').value,
      });
      item.status = $('status').value;
    }
    await putItem(item);
    $('msg').textContent = existing ? 'Updated.' : 'Saved.';

    try {
      const folder = await getBackupFolderName();
      if (folder) {
        await writeBackup(buildExport(await allItems()));
        await clearDirty();
        $('msg').textContent += ' Backed up.';
      }
    } catch (err) {
      $('msg').textContent += ' (backup pending — open dashboard)';
      console.warn('popup backup failed', err);
    }

    setTimeout(() => window.close(), 800);
  });

  $('open-dashboard').addEventListener('click', (e) => {
    e.preventDefault();
    chrome.runtime.openOptionsPage();
  });
}

init();
