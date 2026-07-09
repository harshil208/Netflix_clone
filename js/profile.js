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
const pendingPlayback = consumePendingWatchPartyPlayback();
if(pendingPlayback?.targetId != null){
  startWatchPartyPlayback(pendingPlayback.targetId);
}
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

function closeWatchPartyModal(){
  $("watchPartyModal").classList.remove("open");
  $("watchPartyModal").setAttribute("aria-hidden","true");
}
function openWatchPartyModal(){
  const modal=$("watchPartyModal");
  const body=$("watchPartyModalBody");
  const room=normalizeWatchPartyState(loadWatchPartyState());
  const currentUserName=currentUser()?.name||"Guest";
  const inviteLink=getWatchPartyInviteLink(room.code);
  body.innerHTML=`
    <h3 class="account-modal-title">Watch Party</h3>
    <p class="account-modal-sub">Create a room for a shared viewing session or join an existing one with a code.</p>
    <div class="watch-party-grid">
      <div class="watch-party-box">
        <strong>Create room</strong>
        <p class="account-modal-sub">Host a room for ${currentUserName} and invite friends.</p>
        <div class="account-actions">
          <button class="btn primary" onclick="createAndShowWatchParty()">Create room</button>
        </div>
      </div>
      <div class="watch-party-box">
        <strong>Join room</strong>
        <input id="watchPartyCodeInput" placeholder="Enter 5-letter code" maxlength="8">
        <div class="account-actions">
          <button class="btn secondary" onclick="joinWatchPartyFromInput()">Join room</button>
        </div>
      </div>
    </div>
    ${room.code?`<div class="watch-party-box">
      <strong>Current room</strong>
      <div class="watch-party-pill">Share code: ${room.code}</div>
      <p class="account-modal-sub">Hosting: ${room.host || 'Guest'} • Participants: ${room.participants.join(", ")}</p>
      <p class="account-modal-sub">Now watching: ${room.session?.title || room.title || 'Now playing'}</p>
      <div class="watch-party-friends">
        ${(room.participants||[]).map(name=>`<div class="watch-party-friend"><span class="dot"></span><span class="name">${name}</span></div>`).join('')}
      </div>
      ${inviteLink?`<div class="account-actions"><button class="btn secondary" onclick="copyWatchPartyInvite()">Copy invite link</button></div>`:""}
    </div>`:""}
  `;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden","false");
}
function startWatchPartyPlayback(targetId){
  if(typeof playTitle === 'function' && Number.isInteger(targetId)){
    setTimeout(()=>playTitle(targetId), 250);
  }
}
function createAndShowWatchParty(){
  const currentUserName=currentUser()?.name||"Guest";
  const defaultTitleId = 2;
  const room=createWatchPartyRoom(currentUserName, catalog[defaultTitleId]?.title || 'Orbit Decay');
  syncWatchPartySession(room.code, { title: catalog[defaultTitleId]?.title || 'Orbit Decay', titleId: defaultTitleId, startedAt: Date.now() });
  showToast(`Watch party room created — code ${room.code}`);
  openWatchPartyModal();
  if(activeProfile===null){
    closeWatchPartyModal();
    queueWatchPartyPlayback(defaultTitleId);
    $("gate").style.display="flex";
    showToast("Choose a profile to start the watch party");
    return;
  }
  startWatchPartyPlayback(defaultTitleId);
}
function joinWatchPartyFromInput(){
  const code=$("watchPartyCodeInput").value.trim().toUpperCase();
  const currentUserName=currentUser()?.name||"Guest";
  if(!code){showToast("Enter a room code first");return;}
  const room=joinWatchPartyRoom(code,currentUserName);
  if(room){
    const targetId = room.session?.titleId ?? room.titleId ?? 2;
    showToast(`Joined watch party ${room.code}`);
    openWatchPartyModal();
    if(activeProfile===null){
      closeWatchPartyModal();
      queueWatchPartyPlayback(targetId);
      $("gate").style.display="flex";
      showToast("Choose a profile to start the watch party");
      return;
    }
    startWatchPartyPlayback(targetId);
  }
  else{showToast("That room code was not found");}
}
function copyWatchPartyInvite(){
  const room=normalizeWatchPartyState(loadWatchPartyState());
  const link=getWatchPartyInviteLink(room.code);
  if(!link){showToast("No room to share yet");return;}
  if(navigator.clipboard?.writeText){
    navigator.clipboard.writeText(link).then(()=>showToast("Invite link copied")).catch(()=>showToast("Invite link ready to copy"));
  } else {
    showToast("Invite link ready to copy");
  }
}

$("watchPartyModal").addEventListener("click",e=>{if(e.target===$("watchPartyModal"))closeWatchPartyModal();});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&$("watchPartyModal").classList.contains("open"))closeWatchPartyModal();});
function signOut(){
stopHeroRotation();closeModal();
activeProfile=null;
$("gate").style.display="flex";
["notifPanel","profilePanel"].forEach(p=>$(p).classList.remove("open"));
}
