/* ============================================================
   StreamFlix  ·  js/navbar.js
   Navbar scroll state and the quick 'play something' action.
   ============================================================ */

window.addEventListener("scroll",()=>$("nav").classList.toggle("scrolled",window.scrollY>40));
function playSomething(){
const vc=visibleCatalog();
playTitle(vc[Math.floor(Math.random()*vc.length)].id);
showToast("Playing something you might like");
}
