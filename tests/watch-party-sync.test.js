const assert = require('assert');
const { test } = require('node:test');

const { createWatchPartyRoom, getWatchPartyInviteLink, syncWatchPartySession } = require('../js/watchParty.js');

test('watch party creates a shareable session and sync state', () => {
  const room = createWatchPartyRoom('Demo User', 'Now playing');
  const invite = getWatchPartyInviteLink(room.code);
  assert.match(invite, /watch-party/);
  const synced = syncWatchPartySession(room.code, { title: 'Orbit Decay', titleId: 2, startedAt: 1234 });
  assert.strictEqual(synced.title, 'Orbit Decay');
  assert.strictEqual(synced.titleId, 2);
  assert.strictEqual(synced.startedAt, 1234);
});
