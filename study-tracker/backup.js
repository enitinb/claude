const DB_NAME = 'study-tracker-fs';
const STORE = 'handles';
const KEY = 'backupDir';
const FILE_NAME = 'study-tracker.json';

function openDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function idbGet(key) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly');
    const req = tx.objectStore(STORE).get(key);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function idbSet(key, value) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).put(value, key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function idbDel(key) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).delete(key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function pickBackupFolder() {
  const handle = await window.showDirectoryPicker({ mode: 'readwrite' });
  await idbSet(KEY, handle);
  return handle.name;
}

export async function clearBackupFolder() {
  await idbDel(KEY);
}

export async function getBackupFolderName() {
  const handle = await idbGet(KEY);
  return handle ? handle.name : null;
}

async function verifyPermission(handle) {
  const opts = { mode: 'readwrite' };
  if ((await handle.queryPermission(opts)) === 'granted') return true;
  try {
    if ((await handle.requestPermission(opts)) === 'granted') return true;
  } catch {}
  return false;
}

export async function writeBackup(json) {
  const handle = await idbGet(KEY);
  if (!handle) throw new Error('No backup folder selected');
  if (!(await verifyPermission(handle))) throw new Error('Folder permission not granted');
  const fileHandle = await handle.getFileHandle(FILE_NAME, { create: true });
  const writable = await fileHandle.createWritable();
  await writable.write(JSON.stringify(json, null, 2));
  await writable.close();
}

export async function readBackup() {
  const handle = await idbGet(KEY);
  if (!handle) return null;
  if (!(await verifyPermission(handle))) throw new Error('Folder permission not granted');
  try {
    const fileHandle = await handle.getFileHandle(FILE_NAME);
    const file = await fileHandle.getFile();
    return JSON.parse(await file.text());
  } catch (e) {
    if (e.name === 'NotFoundError') return null;
    throw e;
  }
}
