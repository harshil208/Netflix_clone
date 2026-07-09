/* ============================================================
   StreamFlix  ·  js/utils.js
   DOM helper ($), toasts, time formatting and dropdown panels.
   ============================================================ */

/* ================= HELPERS ================= */
const $=id=>document.getElementById(id);
function showToast(msg){
const t=document.createElement("div");
t.className="toast";t.textContent=msg;
$("toasts").appendChild(t);
setTimeout(()=>t.classList.add("out"),2200);
setTimeout(()=>t.remove(),2600);
}
const fmtT=s=>{s=Math.max(0,Math.round(s));const h=Math.floor(s/3600),m=Math.floor(s%3600/60),sec=s%60;
return h?`${h}:${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}`:`${m}:${String(sec).padStart(2,"0")}`};

function togglePanel(id){
["notifPanel","profilePanel"].forEach(p=>{ if(p!==id)$(p).classList.remove("open"); });
const el=$(id);el.classList.toggle("open");
if(id==="notifPanel"&&el.classList.contains("open")){$("notifDot").style.display="none";}
}
document.addEventListener("click",e=>{
if(!e.target.closest(".nav-right"))["notifPanel","profilePanel"].forEach(p=>$(p).classList.remove("open"));
if(!e.target.closest(".speed-menu"))$("speedPop").classList.remove("open");
});
