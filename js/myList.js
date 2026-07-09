/* ============================================================
   StreamFlix  ·  js/myList.js
   My List add/remove and thumbs-up/down ratings.
   ============================================================ */

/* ================= MY LIST / RATINGS ================= */
function toggleList(id){
const had=S().list.has(id);
had?S().list.delete(id):S().list.add(id);
showToast(had?`Removed "${catalog[id].title}" from My List`:`Added "${catalog[id].title}" to My List`);
render();renderVibeRow();
if(currentModal===id)syncModalButtons();
}
function toggleListFromModal(){toggleList(currentModal)}
function rate(v){
const r=S().ratings;
r[currentModal]=r[currentModal]===v?0:v;
showToast(r[currentModal]===1?"Rated: I like this — we'll recommend more like it":r[currentModal]===-1?"Rated: not for me — we'll show it less":"Rating removed");
syncModalButtons();
}
function removeProgress(id){
delete S().progress[id];
showToast(`Removed "${catalog[id].title}" from Continue Watching`);
render();
}
function syncModalButtons(){
const it=catalog[currentModal];
$("modalListBtn").textContent=S().list.has(currentModal)?"✓ In My List":"+ My List";
$("thumbUp").classList.toggle("rated",S().ratings[currentModal]===1);
$("thumbDown").classList.toggle("rated",S().ratings[currentModal]===-1);
const pr=S().progress[currentModal];
if(pr){
  $("modalPlayBtn").innerHTML="▶ Resume";
  $("modalResume").textContent=it.type==="series"
    ?`Resume S${pr.s}:E${pr.e} “${it.seasons[pr.s-1][pr.e-1].name}” at ${fmtT(pr.t)}`
    :`Resume at ${fmtT(pr.t)} of ${fmtT(pr.dur)}`;
}else{
  $("modalPlayBtn").innerHTML="▶ Play";
  $("modalResume").textContent="";
}
}
