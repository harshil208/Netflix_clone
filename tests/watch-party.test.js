const assert = require('assert');
const { test } = require('node:test');

class MockStorage {
  constructor() { this.store = new Map(); }
  getItem(key) { return this.store.has(key) ? this.store.get(key) : null; }
  setItem(key, value) { this.store.set(key, String(value)); }
  removeItem(key) { this.store.delete(key); }
  clear() { this.store.clear(); }
}

global.localStorage = new MockStorage();

const { createWatchPartyRoom, joinWatchPartyRoom, leaveWatchPartyRoom, normalizeWatchPartyState, queueWatchPartyPlayback, consumePendingWatchPartyPlayback } = require('../js/watchParty.js');

test('watch party creates and joins rooms with participant tracking', () => {
  localStorage.clear();
  const host = createWatchPartyRoom('Demo User');
  assert.match(host.code, /^[A-Z0-9]{4,6}$/);
  assert.strictEqual(host.host, 'Demo User');
  assert.strictEqual(host.participants.length, 1);

  const joined = joinWatchPartyRoom(host.code, 'Friend');
  assert.strictEqual(joined.code, host.code);
  assert.strictEqual(joined.participants.length, 2);

  const left = leaveWatchPartyRoom(host.code, 'Friend');
  assert.strictEqual(left.participants.length, 1);
  assert.deepStrictEqual(normalizeWatchPartyState(left), left);
});

test('queued watch-party playback resumes after profile selection', () => {
  const queued = queueWatchPartyPlayback(7);
  assert.strictEqual(queued.targetId, 7);
  assert.strictEqual(consumePendingWatchPartyPlayback().targetId, 7);
  assert.strictEqual(consumePendingWatchPartyPlayback(), null);
});
