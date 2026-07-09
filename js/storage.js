/* ============================================================
   StreamFlix  ·  js/storage.js
   localStorage persistence layer (with in-memory fallback).
   ============================================================ */

const AUTH_KEY="streamflix_auth_v1";
let _mem=null; // in-memory fallback if browser storage is blocked (e.g. sandboxed preview)

function createAuthStore(){return {users:[],session:null};}
function normalizeAuthStore(d){
  const base=createAuthStore();
  if(!d||typeof d!=="object")return base;
  const users=Array.isArray(d.users)?d.users.filter(Boolean):[];
  const session=typeof d.session==="string"&&d.session.trim()?d.session.trim().toLowerCase():null;
  return {users,session};
}
function _load(){
  try{
    const r=typeof localStorage!=="undefined"?localStorage.getItem(AUTH_KEY):null;
    return normalizeAuthStore(r?JSON.parse(r):null);
  }
  catch(e){
    return _mem||(_mem=createAuthStore());
  }
}
function _save(d){
  const state=normalizeAuthStore(d);
  try{typeof localStorage!=="undefined"&&localStorage.setItem(AUTH_KEY,JSON.stringify(state));}
  catch(e){_mem=state;}
  return state;
}
function getAuthState(){return _load();}
function getAuthSessionEmail(){const state=getAuthState();return state.session||null;}
function setAuthSession(email){
  const value=typeof email==="string"?email.trim().toLowerCase():"";
  const state=_load();
  state.session=value||null;
  return _save(state);
}
function clearAuthSession(){
  const state=_load();
  state.session=null;
  return _save(state);
}
function updateAuthState(updater){
  const state=_load();
  const next=updater(state);
  return _save(next);
}

if(typeof module!=="undefined"&&module.exports){
  module.exports={
    AUTH_KEY,
    createAuthStore,
    normalizeAuthStore,
    _load,
    _save,
    getAuthState,
    getAuthSessionEmail,
    setAuthSession,
    clearAuthSession,
    updateAuthState
  };
}
