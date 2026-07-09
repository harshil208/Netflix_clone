/* ============================================================
   StreamFlix  ·  js/data.js
   Fictional catalog, seeded artwork and Creative-Commons video sources.
   ============================================================ */

/* ================= DATA ================= */
const palettes=[
["#8e2de2","#ff6a00"],["#0f2027","#2c5364"],["#e50914","#31000a"],
["#11998e","#38ef7d"],["#3a1c71","#ffaf7b"],["#232526","#5c6b73"],
["#5433ff","#20bdff"],["#c31432","#240b36"],["#f7971e","#7a3b00"],
["#41295a","#2f0743"],["#00c6ff","#003a70"],["#780206","#061161"],
["#ff512f","#dd2476"],["#136a8a","#267871"],["#544a7d","#ffd452"],
["#1f4037","#99f2c8"]
];
// [name, desc, tags, rating, length, match, moods[], mins-per-sitting, year, seasons, cast]
const titles=[
["Neon Harbour","A dockside detective uncovers memory smuggling in a rain-soaked megacity.","Crime · Sci-Fi · Noir","TV-MA","2 Seasons",97,["mind","adrenaline"],52,2026,2,"Priya Nair, Tom Okafor, Lena Voss"],
["The Last Chai Stall","Three generations fight to keep Bengaluru's oldest tea stall alive as the city changes overnight.","Drama · Family","TV-14","1 Season",94,["heartfelt","cozy"],42,2025,1,"Ravi Shastri Rao, Meera Kulkarni"],
["Orbit Decay","Stranded engineers must rebuild a failing space station before its orbit collapses.","Sci-Fi · Thriller","PG-13","2h 14m",91,["adrenaline","mind"],134,2026,0,"Dana Reyes, Yuki Tanaka"],
["Masala Panic","A chaotic cooking competition where the secret ingredient is revealed mid-dish.","Reality · Comedy","TV-PG","3 Seasons",88,["laugh","feelgood"],35,2024,3,"Host: Chef Ayaan Kapoor"],
["Kernel","A rookie security researcher finds a backdoor in the world's most popular browser.","Techno-thriller","TV-MA","1 Season",95,["adrenaline","mind"],48,2026,1,"Sana Iqbal, Devon Marsh"],
["Monsoon Express","Strangers on a delayed overnight train swap stories that turn out to be connected.","Anthology · Drama","TV-14","1 Season",90,["heartfelt","cozy"],44,2025,1,"Ensemble cast"],
["Glasshouse","An architecture firm's dream project hides a decades-old disappearance.","Mystery","TV-MA","6 Episodes",89,["mind"],50,2024,1,"Ingrid Halvorsen, Marc Duval"],
["Bytes & Biryani","A food-delivery startup's rise, told by the riders who powered it.","Docuseries","TV-PG","4 Episodes",92,["feelgood","heartfelt"],38,2025,1,"Documentary"],
["Static","Radio signals from 1987 start answering back.","Horror · Mystery","TV-MA","1h 48m",86,["adrenaline","mind"],108,2024,0,"Colm Byrne, Ada Nwosu"],
["Full Stack","Four flatmates bet their savings on a 48-hour hackathon.","Comedy · Drama","TV-14","2 Seasons",93,["laugh","feelgood"],30,2026,2,"Arjun Menon, Zoya Khan, Nikhil D'Souza"],
["The Cartographer","A mapmaker discovers streets that exist only at night.","Fantasy","PG-13","2h 2m",90,["mind","cozy"],122,2025,0,"Elif Demir, Hugo Charpentier"],
["Deadline","A newsroom's final 24 hours before it goes to print for the last time.","Drama","TV-14","1h 39m",87,["heartfelt"],99,2024,0,"Grace Ellison, Farhan Ali"],
["Ctrl+Z","A programmer wakes up able to undo the last ten seconds of reality.","Sci-Fi · Comedy","TV-14","1 Season",96,["laugh","mind"],32,2026,1,"Kavya Prasad, Ben Whitaker"],
["Shutter Island Lane","A wedding photographer keeps capturing a guest who isn't there.","Thriller","TV-MA","1h 51m",84,["adrenaline"],111,2025,0,"Noor Rahman, Silas Grant"],
["Raga Renegades","Classical musicians go underground to battle an AI music label.","Musical · Drama","TV-PG","1 Season",89,["heartfelt","feelgood"],46,2026,1,"Shreya Iyer, Vikram Bhat"],
["Cold Brew","A barista solves neighbourhood mysteries between orders.","Cozy Mystery","TV-PG","3 Seasons",91,["cozy","laugh"],28,2024,3,"Maya Chen, Oscar Lindqvist"]
];
const EP_WORDS=["Signal","Undertow","Static","Half-Life","The Long Night","Cold Open","Checksum","Backdraft","High Tide","Afterimage","Blueprint","Fault Line","The Handoff","Blackout","Second Draft","Homecoming"];
const catalog=titles.map((t,i)=>{
const seasons=t[9];
const item={
  id:i,title:t[0],desc:t[1],tags:t[2],rating:t[3],length:t[4],match:t[5],
  moods:t[6],mins:t[7],year:t[8],cast:t[10],
  type:seasons>0?"series":"movie",
  grad:`linear-gradient(135deg,${palettes[i%palettes.length][0]},${palettes[i%palettes.length][1]})`,
  seasons:[]
};
if(item.type==="series"){
  const epTotal=t[4].includes("Episodes")?parseInt(t[4]):0;
  for(let s=1;s<=seasons;s++){
    const count=epTotal||(6+((i+s)%3)*2); // 6, 8 or 10 eps
    const eps=[];
    for(let e=1;e<=count;e++){
      eps.push({
        s,e,
        name:EP_WORDS[(i*3+s*5+e*7)%EP_WORDS.length],
        dur:(item.mins+((i+e)%3)*4-4)*60, // seconds
        desc:`S${s} · An hour that pushes ${item.title.split(" ")[0]} closer to the truth — and further from safety.`
      });
    }
    item.seasons.push(eps);
  }
}
return item;
});
const movieDur=it=>it.mins*60;

/* ---- artwork: seeded photo backdrops (picsum.photos), gradient fallback if offline ---- */
const art=(seed,w=460,h=260)=>`https://picsum.photos/seed/streamflix-${seed}/${w}/${h}`;
// layered background: photo on top, brand gradient underneath (shows if image can't load)
const bgFor=(it,seed,w,h)=>`url('${art(seed??it.id,w,h)}') center/cover no-repeat, ${it.grad}`;

/* ---- real playable video: Creative-Commons Blender open movies + Google sample clips ---- */
const VID_BASE="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/";
const VIDEOS=["BigBuckBunny.mp4","ElephantsDream.mp4","Sintel.mp4","TearsOfSteel.mp4",
"ForBiggerBlazes.mp4","ForBiggerEscapes.mp4","ForBiggerFun.mp4","ForBiggerJoyrides.mp4",
"ForBiggerMeltdowns.mp4","SubaruOutbackOnStreetAndDirt.mp4","VolkswagenGTIReview.mp4","WeAreGoingOnBullrun.mp4"];
const vidFor=(id,s=0,e=0)=>VID_BASE+VIDEOS[(id*3+s*5+e)%VIDEOS.length];
