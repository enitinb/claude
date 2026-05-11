export const SCHEMA_VERSION = 1;

export function newItem({ url, title, type = 'web', source = 'web', thumbnail = '', tags = [], notes = '' }) {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    url,
    title,
    type,
    source,
    thumbnail,
    tags,
    status: 'queued',
    notes,
    timeSpentMin: 0,
    revisitCount: 0,
    revisitedAt: [],
    createdAt: now,
    updatedAt: now,
  };
}

export function buildExport(items) {
  return {
    schemaVersion: SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    items,
  };
}

export function parseImport(json) {
  if (!json || typeof json !== 'object') throw new Error('Invalid file');
  if (!Array.isArray(json.items)) throw new Error('Missing items array');
  if (json.schemaVersion !== SCHEMA_VERSION) {
    throw new Error(`Unsupported schemaVersion: ${json.schemaVersion}`);
  }
  return json.items;
}
