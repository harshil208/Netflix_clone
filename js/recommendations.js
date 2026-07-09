/* ============================================================
   StreamFlix  ·  js/recommendations.js
   Vibe Match engine — scores titles by selected moods/time.
   ============================================================ */

/* ================= VIBE MATCH (USP) ================= */
const MOODS=[["cozy","☕ Cozy"],["laugh","😂 Make me laugh"],["mind","🌀 Mind-bending"],["adrenaline","⚡ Adrenaline"],["heartfelt","💛 Heartfelt"],["feelgood","🌤 Feel-good"]];
const TIMES=[["quick","Under 45 min",45],["evening","1–2 hours",120],["binge","Binge mode",9999]];
const vibe={moods:new Set(),time:null};

function chip(label,on,handler){
return `<button class="chip ${on?'on':''}" onclick="${handler}">${label}</button>`;
}
function renderVibeControls(){
$("moodChips").innerHTML=MOODS.map(([k,l])=>chip(l,vibe.moods.has(k),`toggleMood('${k}')`)).join("");
$("timeChips").innerHTML=TIMES.map(([k,l])=>chip(l,vibe.time===k,`setTime('${k}')`)).join("");
}
function toggleMood(k){vibe.moods.has(k)?vibe.moods.delete(k):vibe.moods.add(k);renderVibeControls();renderVibeRow();}
function setTime(k){vibe.time=(vibe.time===k?null:k);renderVibeControls();renderVibeRow();}

function vibeScore(item){
let s=0;
if(vibe.moods.size){
  const hits=item.moods.filter(m=>vibe.moods.has(m)).length;
  if(!hits)return 0;                       // hard filter: must match at least one mood
  s+=55*(hits/vibe.moods.size)+15*(hits/item.moods.length);
}else s+=40;
if(vibe.time){
  const cap=TIMES.find(t=>t[0]===vibe.time)[2];
  if(item.mins<=cap)s+=25;
  else if(item.mins<=cap*1.15)s+=10;       // slight overrun tolerated
  else return 0;                            // hard filter: doesn't fit the time
}else s+=15;
s+=(item.match-84)*1.2;                     // quality prior from base match score
if(S().ratings[item.id]===1)s+=6;           // learn from thumbs
if(S().ratings[item.id]===-1)s-=20;
return Math.min(99,Math.round(Math.max(0,s)));
}
function renderVibeRow(){
const box=$("vibeRow");
if(!vibe.moods.size&&!vibe.time){box.innerHTML="";return;}
const picks=visibleCatalog().map(it=>({it,score:vibeScore(it)}))
  .filter(p=>p.score>0).sort((a,b)=>b.score-a.score).slice(0,6);
if(!picks.length){
  box.innerHTML=`<p class="vibe-empty">Nothing fits that exact combo — try loosening the time limit or picking one more mood.</p>`;
  return;
}
const cards=picks.map(({it,score})=>cardHTML(it,{vibe:score})).join("");
box.innerHTML=`<section class="row" style="margin:8px -26px 0;padding-bottom:0">
  <h2 style="padding:0 26px">Your picks right now <span class="vibe-count">${picks.length} matches</span></h2>
  <div class="row-outer">
    <button class="row-arrow left" onclick="scrollRow(this,-1)" aria-label="Scroll left">‹</button>
    <div class="row-scroll" style="padding:6px 26px 12px">${cards}</div>
    <button class="row-arrow right" onclick="scrollRow(this,1)" aria-label="Scroll right">›</button>
  </div></section>`;
}
