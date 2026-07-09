/* ============================================================
   StreamFlix  ·  js/storage.js
   localStorage persistence layer (with in-memory fallback).
   ============================================================ */

const AUTH_KEY="streamflix_auth_v1";
let _mem=null; // in-memory fallback if browser storage is blocked (e.g. sandboxed preview)
function _load(){
try{const r=localStorage.getItem(AUTH_KEY);return r?JSON.parse(r):{users:[],session:null};}
catch(e){return _mem||(_mem={users:[],session:null});}
}
function _save(d){
try{localStorage.setItem(AUTH_KEY,JSON.stringify(d));}catch(e){_mem=d;}
}
