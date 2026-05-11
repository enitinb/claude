const ITEM_PREFIX = 'item:';

export async function putItem(item) {
  item.updatedAt = new Date().toISOString();
  await chrome.storage.local.set({
    [`${ITEM_PREFIX}${item.id}`]: item,
    'meta:dirty': true,
  });
}

export async function getItem(id) {
  const key = `${ITEM_PREFIX}${id}`;
  const res = await chrome.storage.local.get(key);
  return res[key];
}

export async function allItems() {
  const all = await chrome.storage.local.get(null);
  return Object.entries(all)
    .filter(([k]) => k.startsWith(ITEM_PREFIX))
    .map(([, v]) => v)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

function normalizeUrl(u) {
  try {
    const url = new URL(u);
    url.hash = '';
    for (const k of [...url.searchParams.keys()]) {
      if (/^(utm_|fbclid|gclid|ref|ref_src)/i.test(k)) url.searchParams.delete(k);
    }
    return url.toString().replace(/\/$/, '');
  } catch {
    return u;
  }
}

export async function findByUrl(url) {
  const target = normalizeUrl(url);
  const items = await allItems();
  return items.find((it) => normalizeUrl(it.url) === target) || null;
}

export async function deleteItem(id) {
  await chrome.storage.local.remove(`${ITEM_PREFIX}${id}`);
  await chrome.storage.local.set({ 'meta:dirty': true });
}

export async function isDirty() {
  const { 'meta:dirty': dirty } = await chrome.storage.local.get('meta:dirty');
  return !!dirty;
}

export async function clearDirty() {
  await chrome.storage.local.set({
    'meta:dirty': false,
    'meta:lastBackupAt': new Date().toISOString(),
  });
}

export async function lastBackupAt() {
  const { 'meta:lastBackupAt': v } = await chrome.storage.local.get('meta:lastBackupAt');
  return v || null;
}
