/* ============================================================
   StreamFlix  ·  js/watchParty.js
   Lightweight watch-party room model and persistence.
   ============================================================ */

const WATCH_PARTY_KEY = 'streamflix_watch_party_v1';
let _watchPartyMem = null;

function createCode(length = 5) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < length; i += 1) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

function normalizeWatchPartyState(state) {
  if (!state || typeof state !== 'object') return { code: null, host: null, participants: [], title: null, startedAt: null, session: { title: 'Now playing', status: 'live', startedAt: null } };
  const code = typeof state.code === 'string' && state.code.trim() ? state.code.trim().toUpperCase() : null;
  const host = typeof state.host === 'string' && state.host.trim() ? state.host.trim() : null;
  const participants = Array.isArray(state.participants) ? state.participants.filter(Boolean) : [];
  const session = state.session && typeof state.session === 'object' ? state.session : {};
  const sessionTitle = typeof session.title === 'string' && session.title.trim() ? session.title.trim() : null;
  const title = sessionTitle || (typeof state.title === 'string' && state.title.trim() ? state.title.trim() : null);
  const startedAt = (typeof session.startedAt === 'number' ? session.startedAt : (typeof state.startedAt === 'number' ? state.startedAt : null));
  return {
    code,
    host,
    participants,
    title,
    startedAt,
    titleId: typeof state.titleId === 'number' ? state.titleId : (typeof session.titleId === 'number' ? session.titleId : null),
    session: {
      title: sessionTitle || title || 'Now playing',
      titleId: typeof session.titleId === 'number' ? session.titleId : (typeof state.titleId === 'number' ? state.titleId : null),
      status: session.status || 'live',
      startedAt: typeof session.startedAt === 'number' ? session.startedAt : startedAt
    }
  };
}

function loadWatchPartyState() {
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(WATCH_PARTY_KEY) : null;
    return normalizeWatchPartyState(raw ? JSON.parse(raw) : (_watchPartyMem ? _watchPartyMem : null));
  } catch (error) {
    return normalizeWatchPartyState(_watchPartyMem || null);
  }
}

function saveWatchPartyState(state) {
  const normalized = normalizeWatchPartyState(state);
  try {
    if (typeof localStorage !== 'undefined') localStorage.setItem(WATCH_PARTY_KEY, JSON.stringify(normalized));
    else _watchPartyMem = normalized;
  } catch (error) {
    _watchPartyMem = normalized;
  }
  return normalized;
}

function createWatchPartyRoom(hostName, title = null) {
  const state = loadWatchPartyState();
  const code = state.code || createCode();
  const room = { code, host: hostName, participants: [hostName], title, startedAt: Date.now(), session: { title: title || 'Now playing', startedAt: Date.now(), status: 'live' } };
  return saveWatchPartyState(room);
}

function joinWatchPartyRoom(code, participantName) {
  const room = loadWatchPartyState();
  const normalizedCode = typeof code === 'string' ? code.trim().toUpperCase() : '';
  if (!normalizedCode || !room.code || room.code !== normalizedCode) return null;
  if (!participantName || !participantName.trim()) return room;
  const name = participantName.trim();
  const participants = room.participants.includes(name) ? room.participants : [...room.participants, name];
  return saveWatchPartyState({ ...room, participants, session: { ...(room.session || {}), status: 'live' } });
}

function leaveWatchPartyRoom(code, participantName) {
  const room = loadWatchPartyState();
  const normalizedCode = typeof code === 'string' ? code.trim().toUpperCase() : '';
  if (!normalizedCode || !room.code || room.code !== normalizedCode) return room;
  const name = participantName ? participantName.trim() : null;
  const participants = name ? room.participants.filter(p => p !== name) : room.participants;
  return saveWatchPartyState({ ...room, participants });
}

function setWatchPartyTitle(title) {
  const room = loadWatchPartyState();
  const nextTitle = title && title.trim() ? title.trim() : null;
  return saveWatchPartyState({ ...room, title: nextTitle, session: { ...(room.session || {}), title: nextTitle || room.session?.title || 'Now playing' } });
}

function syncWatchPartySession(code, sessionData) {
  const room = loadWatchPartyState();
  const normalizedCode = typeof code === 'string' ? code.trim().toUpperCase() : '';
  const activeCode = normalizedCode || room.code;
  if (!activeCode) return room;
  return saveWatchPartyState({ ...room, code: activeCode, session: { ...(room.session || {}), ...(sessionData || {}), startedAt: sessionData?.startedAt ?? room.session?.startedAt ?? room.startedAt ?? Date.now(), status: 'live' } });
}

function getWatchPartyInviteLink(code) {
  const normalizedCode = typeof code === 'string' ? code.trim().toUpperCase() : '';
  return normalizedCode ? `http://127.0.0.1:8000/?watch-party=${normalizedCode}` : '';
}

function getWatchPartyStatusText(room) {
  const currentRoom = normalizeWatchPartyState(room);
  if (!currentRoom.code) return 'No active room';
  const title = currentRoom.session?.title || currentRoom.title || 'Now playing';
  const participants = currentRoom.participants.join(', ');
  return `${title} • ${currentRoom.participants.length} watching • ${participants}`;
}

let pendingWatchPartyPlayback = null;
function queueWatchPartyPlayback(targetId) {
  pendingWatchPartyPlayback = { targetId: Number.isInteger(targetId) ? targetId : null, queuedAt: Date.now() };
  return pendingWatchPartyPlayback;
}
function consumePendingWatchPartyPlayback() {
  const pending = pendingWatchPartyPlayback;
  pendingWatchPartyPlayback = null;
  return pending;
}

if (typeof window !== 'undefined') {
  window.WATCH_PARTY_KEY = WATCH_PARTY_KEY;
  window.createCode = createCode;
  window.normalizeWatchPartyState = normalizeWatchPartyState;
  window.loadWatchPartyState = loadWatchPartyState;
  window.saveWatchPartyState = saveWatchPartyState;
  window.createWatchPartyRoom = createWatchPartyRoom;
  window.joinWatchPartyRoom = joinWatchPartyRoom;
  window.leaveWatchPartyRoom = leaveWatchPartyRoom;
  window.setWatchPartyTitle = setWatchPartyTitle;
  window.syncWatchPartySession = syncWatchPartySession;
  window.getWatchPartyInviteLink = getWatchPartyInviteLink;
  window.getWatchPartyStatusText = getWatchPartyStatusText;
  window.queueWatchPartyPlayback = queueWatchPartyPlayback;
  window.consumePendingWatchPartyPlayback = consumePendingWatchPartyPlayback;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    WATCH_PARTY_KEY,
    createCode,
    normalizeWatchPartyState,
    loadWatchPartyState,
    saveWatchPartyState,
    createWatchPartyRoom,
    joinWatchPartyRoom,
    leaveWatchPartyRoom,
    setWatchPartyTitle,
    syncWatchPartySession,
    getWatchPartyInviteLink,
    getWatchPartyStatusText,
    queueWatchPartyPlayback,
    consumePendingWatchPartyPlayback
  };
}
