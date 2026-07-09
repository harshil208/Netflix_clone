/* ============================================================
   StreamFlix  ·  js/continueWatching.js
   Builds the 'Continue watching' resume row from progress.
   ============================================================ */

function continueRow(){
const entries=Object.entries(S().progress)
  .filter(([id])=>canSee(+id))
  .sort((a,b)=>b[1].at-a[1].at)
  .map(([id])=>catalog[+id]);
return entries;
}
