/* ============================================================
   StreamFlix  ·  js/modal.js
   Title modal: open/close and episode rendering.
   ============================================================ */

/* ================= MODAL ================= */
let modalSeason=1;
function openModal(id){
if(!canSee(id)){showToast("That title isn't available on a Kids profile");return;}
const it=catalog[id];currentModal=id;modalSeason=(S().progress[id]?.s)||1;
$("modalHero").style.background=`linear-gradient(to top,rgba(11,11,15,.25),transparent 40%), ${bgFor(it,it.id+"-hero",860,430)}`;
$("modalTitle").textContent=it.title;
$("modalPlayBtn").onclick=()=>playTitle(id);
$("modalMeta").innerHTML=
  `<span class="match">${it.match}% Match</span><span>${it.year}</span><span class="badge">${it.rating}</span><span>${it.length}</span><span class="badge">4K</span><span class="badge">HDR</span><span class="badge">5.1</span>`;
$("modalDesc").textContent=it.desc;
$("modalTags").innerHTML=`Cast: <b>${it.cast}</b><br>Genres: <b>${it.tags}</b><br>This title is: <b>Bingeworthy, Atmospheric</b>`;
renderEpisodes();
const similar=visibleCatalog().filter(o=>o.id!==id&&(o.moods.some(m=>it.moods.includes(m)))).slice(0,6);
$("modalSimilar").innerHTML=similar.map(o=>cardHTML(o)).join("");
syncModalButtons();
$("modalBackdrop").classList.add("open");
document.body.style.overflow="hidden";
}
function renderEpisodes(){
const it=catalog[currentModal];
const box=$("modalEpisodes");
if(it.type!=="series"){box.innerHTML="";return;}
const pr=S().progress[it.id];
const eps=it.seasons[modalSeason-1];
box.innerHTML=`
  <div class="ep-head">
    <h4>Episodes</h4>
    ${it.seasons.length>1?`<select class="season-sel" onchange="modalSeason=+this.value;renderEpisodes()">
      ${it.seasons.map((_,i)=>`<option value="${i+1}" ${i+1===modalSeason?"selected":""}>Season ${i+1}</option>`).join("")}
    </select>`:`<span style="color:var(--text-dim);font-size:13px">Limited series</span>`}
  </div>`+
  eps.map(ep=>{
    const now=pr&&pr.s===ep.s&&pr.e===ep.e;
    const pct=now?Math.round(pr.t/pr.dur*100):0;
    return `<div class="episode ${now?"now":""}" onclick="playEpisode(${it.id},${ep.s},${ep.e})">
      <div class="ep-num">${ep.e}</div>
      <div class="ep-thumb" style="background:${bgFor(it,`${it.id}-s${ep.s}e${ep.e}`,236,132)}">
        <div class="pp">▶</div>
        ${now?`<div class="progress" style="left:6px;right:6px;bottom:4px"><i style="width:${pct}%"></i></div>`:""}
      </div>
      <div class="ep-body">
        <div class="ep-row1"><span>${ep.e}. ${ep.name}${now?" · watching":""}</span><span class="dur">${Math.round(ep.dur/60)}m</span></div>
        <div class="ep-desc">${ep.desc}</div>
      </div>
    </div>`;
  }).join("");
}
function closeModal(){
$("modalBackdrop").classList.remove("open");
document.body.style.overflow="";currentModal=null;
}
document.addEventListener("keydown",e=>{
if(e.key==="Escape"){ if($("player").classList.contains("open"))closePlayer(); else closeModal(); }
});
