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
function closeAccountModal(){
  $("accountModal").classList.remove("open");
  $("accountModal").setAttribute("aria-hidden","true");
}
function openAccountModal(mode){
  const u=currentUser();
  const modal=$("accountModal");
  const body=$("accountModalBody");
  togglePanel("profilePanel");
  if(mode==="help"){
    body.innerHTML=`
      <h3 class="account-modal-title">Help Centre</h3>
      <p class="account-modal-sub">Quick answers for the demo experience and how your account works.</p>
      <div class="help-list">
        <div class="help-item"><strong>How do I switch profiles?</strong>Use the profile picker from the “Who’s watching?” screen or the profile menu.</div>
        <div class="help-item"><strong>Where is my account saved?</strong>Demo accounts live only in this browser’s local storage.</div>
        <div class="help-item"><strong>Can I change my password?</strong>This demo does not include password change flow yet.</div>
      </div>
      <div class="account-actions">
        <button class="btn primary" onclick="window.location.href='mailto:support@streamflix.demo?subject=Streamflix%20help'">Contact support</button>
        <button class="btn secondary" onclick="closeAccountModal()">Close</button>
      </div>`;
  } else {
    const profile = activeProfile!=null?PROFILES[activeProfile]:null;
    body.innerHTML=`
      <h3 class="account-modal-title">Account</h3>
      <p class="account-modal-sub">${u?"Manage the current demo account and profile from here.":"Sign in to manage your account and profile preferences."}</p>
      <div class="account-kv">
        <div class="row"><span class="label">Signed in as</span><strong>${u?u.email:"Not signed in"}</strong></div>
        <div class="row"><span class="label">Display name</span><strong>${u?u.name:"—"}</strong></div>
        <div class="row"><span class="label">Current profile</span><strong>${profile?profile.name:"—"}</strong></div>
      </div>
      <div class="account-actions">
        ${u?`<button class="btn primary" onclick="closeAccountModal();showToast('Profile switching is available from the profile menu')">Switch profile</button>`:``}
        ${u?`<button class="btn secondary" onclick="closeAccountModal();logOutAccount()">Sign out</button>`:`<button class="btn primary" onclick="closeAccountModal();showAuth('signin')">Sign in</button>`}
      </div>`;
  }
  modal.classList.add("open");
  modal.setAttribute("aria-hidden","false");
}

$("accountModal").addEventListener("click",e=>{if(e.target===$("accountModal"))closeAccountModal();});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&$("accountModal").classList.contains("open"))closeAccountModal();});
function signOut(){
stopHeroRotation();closeModal();
activeProfile=null;
$("gate").style.display="flex";
["notifPanel","profilePanel"].forEach(p=>$(p).classList.remove("open"));
}
