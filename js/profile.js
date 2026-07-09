/* ============================================================
   StreamFlix  ·  js/profile.js
   Profile list, per-profile session state and the profile gate.
   ============================================================ */

/* ================= PROFILES & STATE ================= */
const PROFILES=[
{name:"Harshil",grad:"linear-gradient(135deg,#7b2ff7,#f107a3)",kids:false},
{name:"Ananya",grad:"linear-gradient(135deg,#11998e,#38ef7d)",kids:false},
{name:"Guest",grad:"linear-gradient(135deg,#5433ff,#20bdff)",kids:false},
{name:"Kids",grad:"linear-gradient(135deg,#f7971e,#ffd452)",kids:true}
];
// per-profile in-memory state (session only)
const profileState=PROFILES.map((p,i)=>({
list:new Set(i===0?[4,12]:[]),
ratings:{},                       // id -> 1 | -1
progress:{},                      // id -> {s,e,t,dur,at}
}));
let activeProfile=null;
const S=()=>profileState[activeProfile];
const P=()=>PROFILES[activeProfile];
const KIDS_OK=["TV-PG","PG-13"];
const visibleCatalog=()=>P().kids?catalog.filter(it=>KIDS_OK.includes(it.rating)):catalog;
const canSee=id=>!P().kids||KIDS_OK.includes(catalog[id].rating);

let currentModal=null;
let view="home";

/* ================= PROFILE GATE ================= */
function renderGate(){
$("profileList").innerHTML=PROFILES.map((p,i)=>`
  <button class="profile" onclick="pickProfile(${i})">
    <span class="pfp" style="background:${p.grad}">${p.kids?"🧒":p.name[0]}</span>
    <span class="pname">${p.name}</span>
    ${p.kids?'<span class="kids-tag">KIDS</span>':""}
  </button>`).join("");
}
function pickProfile(i){
activeProfile=i;
$("gate").style.display="none";
$("avatarBtn").textContent=P().kids?"🧒":P().name[0];
$("avatarBtn").style.background=P().grad;
renderProfileMenu();renderNotifs();
setView("home");initHero();renderVibeControls();renderVibeRow();
showToast(`Watching as ${P().name}`);
scrollTo({top:0});
}
function renderProfileMenu(){
$("profileMenuList").innerHTML=PROFILES.map((p,i)=>i===activeProfile?"":`
  <button class="pmenu-item" onclick="pickProfile(${i});togglePanel('profilePanel')">
    <span class="pfp-s" style="background:${p.grad}">${p.kids?"🧒":p.name[0]}</span>${p.name}
  </button>`).join("");
const u=currentUser();
$("acctLine").textContent=u?`Signed in as ${u.email}`:"";
}
function signOut(){
stopHeroRotation();closeModal();
activeProfile=null;
$("gate").style.display="flex";
["notifPanel","profilePanel"].forEach(p=>$(p).classList.remove("open"));
}
