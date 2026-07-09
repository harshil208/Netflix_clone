/* ============================================================
   StreamFlix  ·  js/player.js
   Simulated streaming player: real CC clips with canvas fallback.
   ============================================================ */

/* ================= PLAYER (simulated stream) ================= */
const INTRO_END=30;
const player={id:null,s:1,e:1,t:0,dur:0,playing:false,speed:1,vol:.8,muted:false,cc:false,timer:null,raf:null,nextTimer:null};
const SPEEDS=[0.5,0.75,1,1.25,1.5];

function playTitle(id){
if(!canSee(id)){showToast("That title isn't available on a Kids profile");return;}
const it=catalog[id],pr=S().progress[id];
if(it.type==="series"){
  const s=pr?pr.s:1,e=pr?pr.e:1;
  playEpisode(id,s,e,pr?pr.t:0);
}else{
  startPlayback(id,0,0,pr?pr.t:0,movieDur(it));
}
}
function playEpisode(id,s,e,resumeT){
const it=catalog[id];
const ep=it.seasons[s-1][e-1];
const pr=S().progress[id];
const t=resumeT!==undefined?resumeT:(pr&&pr.s===s&&pr.e===e?pr.t:0);
startPlayback(id,s,e,t,ep.dur);
}
function startPlayback(id,s,e,t,dur){
closeModal();stopHeroRotation();
Object.assign(player,{id,s,e,t,dur,playing:true,mode:"video"});
const it=catalog[id];
const room=normalizeWatchPartyState(loadWatchPartyState());
$("plTopTitle").innerHTML=it.type==="series"
  ?`<b>${it.title}</b> &nbsp;S${s}:E${e} \u201c${it.seasons[s-1][e-1].name}\u201d`
  :`<b>${it.title}</b>`;
$("plEpTitle").textContent=it.type==="series"?`S${s}:E${e} \u00b7 ${it.seasons[s-1][e-1].name}`:it.title;
$("nextBtn").style.display=it.type==="series"?"":"none";
$("player").classList.add("open");
document.body.style.overflow="hidden";
cancelNext();nextDismissed=false;
renderSpeedMenu();
startVideo(id,s,e,t);      // tries real video; falls back to simulation
updatePlayUI();wakeUI();
if(room.code){
  $("player").insertAdjacentHTML("beforeend", `<div class="watch-party-inline">${(room.participants||[]).map(name=>`<div class="watch-party-friend"><span class="dot"></span><span class="name">${name}</span></div>`).join('')}</div>`);
}
}

/* ---- real video pipeline (CC sample streams), simulation fallback ---- */
const vid=$("vid");
let simFellBack=false;
function startVideo(id,s,e,t){
simFellBack=false;
stopTicker();stopCanvas();
$("player").classList.add("video-mode");
vid.src=vidFor(id,s,e);
vid.poster="";
vid.playbackRate=player.speed;
vid.volume=player.vol;vid.muted=player.muted;
vid.currentTime=0;
const seekTo=t;
vid.onloadedmetadata=()=>{
  if(isFinite(vid.duration)&&vid.duration>0)player.dur=vid.duration;
  if(seekTo>0&&seekTo<player.dur-5)try{vid.currentTime=seekTo}catch(_){}
  updateTimeUI();
};
vid.onerror=()=>enterSim();
let p;
try{p=vid.play()}catch(_){enterSim();return;}
if(p&&p.catch)p.catch(()=>{
  // autoplay-with-sound may be blocked: retry muted, else simulate
  vid.muted=true;player.muted=true;syncVol();
  let q;try{q=vid.play()}catch(_){enterSim();return;}
  if(q&&q.catch)q.catch(()=>enterSim());
});
}
function enterSim(){
if(simFellBack||player.id===null)return;
simFellBack=true;
player.mode="sim";
$("player").classList.remove("video-mode");
try{vid.removeAttribute("src");vid.load&&vid.load()}catch(_){}
startTicker();startCanvas();
showToast("Stream unavailable \u2014 playing simulated preview");
}
vid.addEventListener("timeupdate",()=>{ if(player.mode==="video"){player.t=vid.currentTime;updateTimeUI();} });
vid.addEventListener("ended",()=>{ if(player.mode==="video"){player.t=player.dur;onEnded();} });
vid.addEventListener("play",()=>{ if(player.mode==="video"){player.playing=true;updatePlayUI();} });
vid.addEventListener("pause",()=>{ if(player.mode==="video"&&player.t<player.dur){player.playing=false;updatePlayUI();} });

function saveProgress(){
if(player.id===null)return;
if(player.t>15&&player.t<player.dur-8){
  S().progress[player.id]={s:player.s,e:player.e,t:Math.floor(player.t),dur:player.dur,at:Date.now()};
}else if(player.t>=player.dur-8){
  delete S().progress[player.id]; // finished
}
}
function closePlayer(){
saveProgress();
player.playing=false;stopTicker();stopCanvas();cancelNext();
try{vid.pause&&vid.pause()}catch(_){}
try{vid.removeAttribute("src");vid.load&&vid.load()}catch(_){}
$("player").classList.remove("video-mode");
if(document.fullscreenElement)document.exitFullscreen().catch(()=>{});
$("player").classList.remove("open");
document.body.style.overflow="";
player.id=null;
render();startHeroRotation();
}

/* ticking clock \u2014 simulation mode only */
function startTicker(){
stopTicker();
player.timer=setInterval(()=>{
  if(!player.playing||player.mode!=="sim")return;
  player.t+=0.25*player.speed;
  if(player.t>=player.dur){player.t=player.dur;onEnded();}
  updateTimeUI();
},250);
}
function stopTicker(){if(player.timer)clearInterval(player.timer);player.timer=null;}
function togglePlay(){
if(player.mode==="video"){
  let p;
  if(vid.paused){try{p=vid.play()}catch(_){enterSim()} if(p&&p.catch)p.catch(()=>enterSim()); player.playing=true;}
  else{try{vid.pause&&vid.pause()}catch(_){} player.playing=false;}
}else{
  player.playing=!player.playing;
}
updatePlayUI();burst(player.playing?"\u25b6":"\u23f8");
}
function updatePlayUI(){$("ppBtn").textContent=player.playing?"\u23f8":"\u25b6";updateTimeUI();}
function burst(icon){
const b=$("plBurst");b.textContent=icon;
b.classList.remove("pop");void b.offsetWidth;b.classList.add("pop");
setTimeout(()=>b.classList.remove("pop"),450);
}
function seekTo(t){
player.t=Math.min(player.dur,Math.max(0,t));
if(player.mode==="video"){try{vid.currentTime=player.t}catch(_){}}
updateTimeUI();
}
function skip(d){seekTo(player.t+d);burst(d>0?"\u27f3":"\u27f2");}
function updateTimeUI(){
const pct=player.dur?player.t/player.dur*100:0;
const seek=$("seek");
seek.value=Math.round(pct*10);
seek.style.background=`linear-gradient(to right,var(--red) 0%,var(--red) ${pct}%,rgba(255,255,255,.3) ${pct}%)`;
$("tLeft").textContent=fmtT(player.dur-player.t);
// skip intro window
$("skipIntro").classList.toggle("show",player.t>3&&player.t<INTRO_END&&player.dur>120);
// next episode overlay
const it=player.id!==null?catalog[player.id]:null;
if(it&&it.type==="series"&&player.dur-player.t<=12&&!$("nextEp").classList.contains("show")&&!nextDismissed){
  offerNext();
}
updateCaptions();
}
$("seek").addEventListener("input",e=>seekTo(e.target.value/1000*player.dur));
function skipIntro(){seekTo(INTRO_END);showToast("Intro skipped");}

/* volume / mute */
$("vol").addEventListener("input",e=>{player.vol=e.target.value/100;player.muted=player.vol===0;syncVol();});
function toggleMute(){player.muted=!player.muted;syncVol();}
function syncVol(){
vid.volume=player.vol;vid.muted=player.muted;
$("muteBtn").textContent=player.muted||player.vol===0?"\ud83d\udd07":player.vol<.5?"\ud83d\udd09":"\ud83d\udd0a";
$("vol").value=player.vol*100;
}

/* speed */
function renderSpeedMenu(){
$("speedPop").innerHTML=SPEEDS.map(s=>`<button class="${s===player.speed?'on':''}" onclick="setSpeed(${s})">${s}x</button>`).join("");
$("speedBtn").textContent=player.speed+"x";
}
function setSpeed(s){
player.speed=s;vid.playbackRate=s;
renderSpeedMenu();$("speedPop").classList.remove("open");
showToast(`Playback speed: ${s}x`);
}

/* captions */
const CC_LINES=["[rain on corrugated steel]","\u2014 You weren't supposed to see that shipment.","\u2014 Then stop shipping memories, and I'll stop looking.","[distant foghorn]","\u2014 Whatever's in that crate\u2026 it knows my name.","[tense synth swells]"];
function toggleCC(){player.cc=!player.cc;$("ccBtn").classList.toggle("on",player.cc);$("captions").classList.toggle("show",player.cc);updateCaptions();}
function updateCaptions(){
if(!player.cc)return;
$("captions").textContent=CC_LINES[Math.floor(player.t/6)%CC_LINES.length];
}

/* next episode / autoplay */
let nextDismissed=false;
function nextEpisodeOf(){
const it=catalog[player.id];
if(it.type!=="series")return null;
const eps=it.seasons[player.s-1];
if(player.e<eps.length)return{s:player.s,e:player.e+1};
if(player.s<it.seasons.length)return{s:player.s+1,e:1};
return null;
}
function offerNext(){
const nx=nextEpisodeOf();
if(!nx)return;
const it=catalog[player.id];
$("neTitle").textContent=`S${nx.s}:E${nx.e} \u201c${it.seasons[nx.s-1][nx.e-1].name}\u201d`;
$("nextEp").classList.add("show");
let n=10;$("neCount").textContent=n;
player.nextTimer=setInterval(()=>{
  n--;$("neCount").textContent=n;
  if(n<=0)playNextNow();
},1000);
}
function cancelNext(){
nextDismissed=$("nextEp").classList.contains("show");
if(player.nextTimer)clearInterval(player.nextTimer);
player.nextTimer=null;
$("nextEp").classList.remove("show");
}
function playNextNow(){
const nx=nextEpisodeOf();
cancelNext();nextDismissed=false;
if(!nx){showToast("You've reached the last episode");return;}
delete S().progress[player.id];
playEpisode(player.id,nx.s,nx.e,0);
}
function onEnded(){
player.playing=false;updatePlayUI();
const nx=nextEpisodeOf();
if(nx){ if(!$("nextEp").classList.contains("show")&&!nextDismissed)offerNext(); }
else{ saveProgress(); burst("\u21bb"); showToast("Finished \u2014 nice pick. Back to browse with \u2190"); }
}

/* fullscreen */
function toggleFullscreen(){
const el=$("player");
if(document.fullscreenElement)document.exitFullscreen().catch(()=>{});
else el.requestFullscreen?.().catch(()=>showToast("Fullscreen isn't available in this window"));
}

/* auto-hide controls */
let uiTimer=null;
function wakeUI(){
$("player").classList.remove("hide-ui");
if(uiTimer)clearTimeout(uiTimer);
uiTimer=setTimeout(()=>{if(player.playing)$("player").classList.add("hide-ui")},3200);
}
$("player").addEventListener("mousemove",wakeUI);
$("player").addEventListener("click",e=>{
if(e.target.id==="playerCanvas"||e.target.id==="vid"||e.target.classList.contains("captions"))togglePlay();
wakeUI();
});

/* keyboard shortcuts (player only) */
document.addEventListener("keydown",e=>{
if(!$("player").classList.contains("open"))return;
if(["INPUT","SELECT","TEXTAREA"].includes(document.activeElement.tagName)&&document.activeElement.id!=="seek")return;
const k=e.key.toLowerCase();
if(k===" "||k==="k"){e.preventDefault();togglePlay();}
else if(e.key==="ArrowRight")skip(10);
else if(e.key==="ArrowLeft")skip(-10);
else if(e.key==="ArrowUp"){e.preventDefault();player.vol=Math.min(1,player.vol+.1);player.muted=false;syncVol();}
else if(e.key==="ArrowDown"){e.preventDefault();player.vol=Math.max(0,player.vol-.1);syncVol();}
else if(k==="m")toggleMute();
else if(k==="f")toggleFullscreen();
else if(k==="c")toggleCC();
wakeUI();
});

/* simulated video fallback: drifting gradient field on canvas */
let cvRaf=null;
function startCanvas(){
const cv=$("playerCanvas"),ctx=cv.getContext("2d");
const [c1,c2]=palettes[player.id%palettes.length];
function size(){cv.width=cv.clientWidth;cv.height=cv.clientHeight;}
size();window.addEventListener("resize",size);
const blobs=Array.from({length:6},(_,i)=>({
  x:Math.random(),y:Math.random(),r:.25+Math.random()*.3,
  dx:(Math.random()-.5)*.0012,dy:(Math.random()-.5)*.0012,
  c:i%2?c1:c2
}));
function frame(){
  if(!$("player").classList.contains("open")||player.mode!=="sim"){cvRaf=null;return;}
  const w=cv.width,h=cv.height;
  ctx.fillStyle="#050507";ctx.fillRect(0,0,w,h);
  const drift=player.playing?1:0.15;
  blobs.forEach(b=>{
    b.x+=b.dx*drift;b.y+=b.dy*drift;
    if(b.x<-.2||b.x>1.2)b.dx*=-1;
    if(b.y<-.2||b.y>1.2)b.dy*=-1;
    const g=ctx.createRadialGradient(b.x*w,b.y*h,0,b.x*w,b.y*h,b.r*Math.max(w,h));
    g.addColorStop(0,b.c+"66");g.addColorStop(1,"transparent");
    ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
  });
  ctx.fillStyle="rgba(255,255,255,.015)";
  for(let i=0;i<40;i++)ctx.fillRect(Math.random()*w,Math.random()*h,1.5,1.5);
  cvRaf=requestAnimationFrame(frame);
}
if(!cvRaf)cvRaf=requestAnimationFrame(frame);
}
function stopCanvas(){if(cvRaf)cancelAnimationFrame(cvRaf);cvRaf=null;}
