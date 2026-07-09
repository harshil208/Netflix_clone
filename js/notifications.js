/* ============================================================
   StreamFlix  ·  js/notifications.js
   Notifications dropdown feed.
   ============================================================ */

/* ================= NOTIFICATIONS ================= */
function renderNotifs(){
const picks=visibleCatalog();
const n=[
  {t:"New arrival",s:`${picks[0].title} is now streaming in 4K HDR.`,id:picks[0].id,time:"2h ago"},
  {t:"Continue watching",s:"Pick up right where you left off.",id:(picks[1]||picks[0]).id,time:"Yesterday"},
  {t:"Top 10",s:`${(picks[2]||picks[0]).title} just entered the Top 10 in India.`,id:(picks[2]||picks[0]).id,time:"3d ago"}
];
$("notifList").innerHTML=n.map(x=>`
  <div class="notif" style="cursor:pointer" onclick="togglePanel('notifPanel');openModal(${x.id})">
    <div class="thumb" style="background:${bgFor(catalog[x.id],x.id+'-n',132,74)}"></div>
    <div><div class="n-title">${x.t}</div><div class="n-sub">${x.s}</div><div class="n-time">${x.time}</div></div>
  </div>`).join("");
$("notifDot").style.display="block";
}
