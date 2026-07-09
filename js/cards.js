/* ============================================================
   StreamFlix  ·  js/cards.js
   Card markup, row assembly, view switching and rendering.
   ============================================================ */

/* ================= CARDS & ROWS ================= */
function cardHTML(item,opts={}){
const inList=S().list.has(item.id);
const pr=S().progress[item.id];
const pct=pr?Math.min(100,Math.round(pr.t/pr.dur*100)):0;
if(opts.rank!==undefined){
  return `<div class="card ranked" tabindex="0" onclick="openModal(${item.id})" onkeydown="if(event.key==='Enter')openModal(${item.id})">
    <div class="rank-num">${opts.rank}</div>
    <div class="poster" style="background:${bgFor(item,item.id+'-poster',300,450)}">
      <div class="card-title">${item.title}</div>
    </div></div>`;
}
const timeLeft=pr?` · <span class="time-left">${fmtT(pr.dur-pr.t)} left</span>`:"";
return `<div class="card" tabindex="0" style="background:${bgFor(item)}" onclick="openModal(${item.id})" onkeydown="if(event.key==='Enter')openModal(${item.id})">
  ${item.year===2026?'<div class="badge-new">NEW</div>':""}
  ${opts.vibe!==undefined?`<div class="vibe-score">${opts.vibe}% vibe</div>`:""}
  <div class="card-title">${item.title}</div>
  ${opts.progress&&pr?`<div class="progress"><i style="width:${pct}%"></i></div>`:""}
  <div class="card-hover">
    <div class="mini-actions">
      <button class="mini-btn" aria-label="Play" onclick="event.stopPropagation();playTitle(${item.id})">▶</button>
      <button class="mini-btn ${inList?'in-list':''}" aria-label="Toggle My List" onclick="event.stopPropagation();toggleList(${item.id})">${inList?'✓':'+'}</button>
      ${opts.progress?`<button class="mini-btn" aria-label="Remove from Continue Watching" onclick="event.stopPropagation();removeProgress(${item.id})">🗑</button>`:""}
    </div>
    <span style="color:var(--green);font-weight:600">${item.match}% Match</span> · ${item.rating} · ${item.length}${timeLeft}<br>${item.tags}
  </div></div>`;
}


function rowsForView(){
const cw={name:`Continue watching for ${P().name}`,items:continueRow(),progress:true};
const vc=visibleCatalog();
const by=f=>vc.filter(f);
if(view==="series"||view==="movies"){
  const set=by(it=>view==="series"?it.type==="series":it.type==="movie");
  return [
    cw,
    {name:"Trending now",items:set.slice().sort((a,b)=>b.match-a.match)},
    {name:"Critically acclaimed",items:set.filter(it=>it.match>=90)},
    {name:"Because you liked techno-thrillers",items:set.filter(it=>/Thriller|Sci-Fi|Mystery/i.test(it.tags))},
    {name:"Feel-good picks",items:set.filter(it=>it.moods.includes("feelgood")||it.moods.includes("laugh"))}
  ];
}
if(view==="new"){
  return [
    {name:"New this year",items:by(it=>it.year===2026)},
    {name:"Top 10 in India today",items:vc.slice().sort((a,b)=>b.match-a.match).slice(0,10),ranked:true},
    {name:"Worth the wait — recent releases",items:by(it=>it.year>=2025)},
    cw
  ];
}
if(view==="mylist"){
  return [{name:"My List",items:[...S().list].filter(canSee).map(id=>catalog[id]),emptyMsg:"Titles you add appear here. Tap + on any card."},cw];
}
// home
const seen=id=>vc.some(it=>it.id===id);
const pick=ids=>ids.filter(seen).map(id=>catalog[id]);
return [
  cw,
  {name:"Trending now",items:pick([0,12,4,9,7,2,15,5])},
  {name:"Top 10 in India today",items:vc.slice().sort((a,b)=>b.match-a.match).slice(0,10),ranked:true},
  {name:"Because you built a Chrome extension",items:pick([4,12,9,7,2,8])},
  {name:"Critically acclaimed dramas",items:pick([1,5,6,11,14,10])},
  {name:"My List",items:[...S().list].filter(canSee).map(id=>catalog[id]),emptyMsg:"Titles you add appear here. Tap + on any card."},
  {name:"Comedies & feel-good",items:pick([3,9,12,15,7,1])},
  {name:"Thrillers & mysteries",items:pick([8,13,6,0,4,10])}
];
}

function render(){
const q=$("searchInput").value.trim().toLowerCase();
const main=$("rows");
if(q){
  const hits=visibleCatalog().filter(it=>it.title.toLowerCase().includes(q)||it.tags.toLowerCase().includes(q)||it.cast.toLowerCase().includes(q));
  main.innerHTML=`<div class="page-title" style="padding-top:20px">Results for "${q.replace(/</g,"&lt;")}"</div>`+
    (hits.length
      ?`<div class="grid">${hits.map(it=>cardHTML(it)).join("")}</div>`
      :`<div class="empty-state">No titles, genres or people match that. Try "thriller", "comedy" or a cast name.</div>`);
  return;
}
const heading={series:"TV Shows",movies:"Movies",new:"New & Popular",mylist:"My List"}[view];
main.innerHTML=(heading?`<div class="page-title">${heading}</div>`:"")+
  rowsForView().map(row=>{
    if(!row.items.length){
      if(row.emptyMsg)return `<section class="row"><h2>${row.name}</h2><p class="empty-state" style="padding-top:0">${row.emptyMsg}</p></section>`;
      return "";
    }
    const cards=row.items.map((it,i)=>cardHTML(it,{rank:row.ranked?i+1:undefined,progress:row.progress})).join("");
    return `<section class="row">
      <h2>${row.name}<span class="explore">Explore all ›</span></h2>
      <div class="row-outer">
        <button class="row-arrow left" onclick="scrollRow(this,-1)" aria-label="Scroll left">‹</button>
        <div class="row-scroll">${cards}</div>
        <button class="row-arrow right" onclick="scrollRow(this,1)" aria-label="Scroll right">›</button>
      </div></section>`;
  }).join("");
}
function scrollRow(btn,dir){
const sc=btn.parentElement.querySelector(".row-scroll");
sc.scrollBy({left:dir*sc.clientWidth*0.85,behavior:"smooth"});
}
function setView(v){
view=v;
document.querySelectorAll("#navLinks a[data-view]").forEach(a=>a.classList.toggle("active",a.dataset.view===v));
const home=v==="home";
$("hero").style.display=home?"flex":"none";
$("vibe").style.display=home?"block":"none";
$("searchInput").value="";$("searchBox").classList.remove("open");
render();
if(!home)scrollTo({top:0});
}
