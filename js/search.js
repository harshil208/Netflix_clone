/* ============================================================
   StreamFlix  ·  js/search.js
   Search box toggle and live input filtering.
   ============================================================ */

/* ================= SEARCH & NAV CHROME ================= */
function toggleSearch(){
const box=$("searchBox");
box.classList.toggle("open");
if(box.classList.contains("open"))$("searchInput").focus();
}
$("searchInput").addEventListener("input",render);
