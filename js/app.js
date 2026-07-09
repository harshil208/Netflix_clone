/* ============================================================
   StreamFlix  ·  js/app.js
   Hero billboard rotation and the application boot sequence.
   ============================================================ */

/* ================= HERO (rotating billboard) ================= */
let heroIds=[],heroIdx=0,heroTimer=null;
function initHero(){
heroIds=visibleCatalog().filter(it=>it.year===2026).slice(0,3).map(it=>it.id);
if(!heroIds.length)heroIds=visibleCatalog().slice(0,3).map(it=>it.id);
heroIdx=0;renderHero();startHeroRotation();
}
function startHeroRotation(){stopHeroRotation();heroTimer=setInterval(()=>{heroIdx=(heroIdx+1)%heroIds.length;renderHero()},9000);}
function stopHeroRotation(){if(heroTimer)clearInterval(heroTimer);heroTimer=null;}
function setHero(i){heroIdx=i;renderHero();startHeroRotation();}
function renderHero(){
const it=catalog[heroIds[heroIdx]];
const [a,b]=palettes[it.id%palettes.length];
$("heroBg").style.background=`linear-gradient(to right,rgba(11,11,15,.92) 22%,rgba(11,11,15,.35) 60%,rgba(11,11,15,.15)),radial-gradient(ellipse 80% 70% at 75% 30%,${a}40,transparent 60%),url('${art(it.id+"-hero",1280,720)}') center/cover no-repeat,linear-gradient(160deg,#151021 0%,#0b0b0f 70%)`;
const c=$("heroContent");
c.classList.remove("swap");void c.offsetWidth;c.classList.add("swap");
const two=it.title.split(" ");
const titleHTML=two.length>1?two.slice(0,Math.ceil(two.length/2)).join(" ")+"<br>"+two.slice(Math.ceil(two.length/2)).join(" "):it.title;
c.innerHTML=`
  <div class="hero-tag">Streamflix ${it.type==="series"?"Original Series":"Film"}</div>
  <h1 class="hero-title">${titleHTML}</h1>
  <div class="hero-meta">
    <span class="match">${it.match}% Match</span><span>${it.year}</span>
    <span class="badge">${it.rating}</span><span>${it.length}</span>
    <span class="badge">4K HDR</span>
  </div>
  <p class="hero-desc">${it.desc}</p>
  <div class="hero-actions">
    <button class="btn btn-play" onclick="playTitle(${it.id})">▶ Play</button>
    <button class="btn btn-info" onclick="openModal(${it.id})">ⓘ More Info</button>
  </div>`;
$("heroDots").innerHTML=heroIds.map((_,i)=>`<span class="${i===heroIdx?'on':''}" onclick="setHero(${i})"></span>`).join("");
}

/* ================= BOOT ================= */
buildCollage($("collageL"));buildCollage($("collageA"));
["auName","auEmail","auPass"].forEach(id=>$(id).addEventListener("keydown",e=>{if(e.key==="Enter")submitAuth();}));
$("landingEmail").addEventListener("keydown",e=>{if(e.key==="Enter")landingStart();});
document.addEventListener("keydown",e=>{ // Esc closes the auth form back to landing
if(e.key==="Escape"&&$("auth").classList.contains("show"))showLanding();
});
if(currentUser())onAuthenticated(); // returning session -> straight to profile gate
else showLanding();
