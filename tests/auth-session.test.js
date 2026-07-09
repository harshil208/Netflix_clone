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
global.window = {};

const storage = require('../js/storage.js');

test('session helpers persist and clear the active account', () => {
  const store = storage.createAuthStore();
  assert.deepStrictEqual(store, { users: [], session: null });

  const persisted = storage.setAuthSession('demo@example.com');
  assert.strictEqual(persisted.session, 'demo@example.com');

  const restored = storage.getAuthSessionEmail();
  assert.strictEqual(restored, 'demo@example.com');

  storage.clearAuthSession();
  assert.strictEqual(storage.getAuthSessionEmail(), null);
});
