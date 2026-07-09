/* ============================================================
   StreamFlix  ·  js/auth.js
   Sign-up / sign-in flow and session bootstrap.
   ============================================================ */

/* ================= AUTH ================= */
// tiny non-crypto hash — just so passwords aren't sitting in plaintext (NOT real security)
function hashPw(s){let h=5381;for(let i=0;i<s.length;i++)h=((h<<5)+h+s.charCodeAt(i))>>>0;return "h"+h.toString(16);}
const emailRe=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function findUser(email){
  const query=typeof email==="string"?email.trim().toLowerCase():"";
  return query?getAuthState().users.find(u=>u.email===query)||null:null;
}
function currentUser(){
  const email=getAuthSessionEmail();
  return email?findUser(email):null;
}
function doSignUp(name,email,pass){
  name=name.trim();email=email.trim().toLowerCase();
  if(!name)return "Please enter your name.";
  if(!emailRe.test(email))return "Enter a valid email address.";
  if(pass.length<6)return "Password must be at least 6 characters.";
  const d=getAuthState();
  if(d.users.some(u=>u.email===email))return "That email already has an account — try signing in.";
  d.users.push({name,email,pass:hashPw(pass),created:Date.now()});
  _save(d);
  setAuthSession(email);
  return null;
}
function doSignIn(email,pass){
  email=email.trim().toLowerCase();
  if(!emailRe.test(email))return "Enter a valid email address.";
  const u=getAuthState().users.find(x=>x.email===email);
  if(!u||u.pass!==hashPw(pass))return "Wrong email or password.";
  setAuthSession(email);
  return null;
}
function doLogOut(){clearAuthSession();}

/* ---- auth screens ---- */
let authMode="signin";
function buildCollage(el){
let html="";for(let i=0;i<48;i++){const s=(i*7)%titles.length;html+=`<img loading="lazy" src="${art('poster'+s,300,450)}" alt="">`;}
el.innerHTML=html;
}
function showLanding(){
$("auth").classList.remove("show");
$("gate").style.display="none";
document.body.style.overflow="hidden";
$("landing").classList.add("show");
}
function showAuth(mode,prefill){
authMode=mode||"signin";
$("landing").classList.remove("show");
$("gate").style.display="none";
document.body.style.overflow="hidden";
$("auth").classList.add("show");
$("authError").classList.remove("show");markBad(false);
renderAuthMode();
if(prefill)$("auEmail").value=prefill;
setTimeout(()=>$(authMode==="signup"?"auName":"auEmail").focus(),60);
}
function renderAuthMode(){
const su=authMode==="signup";
$("authTitle").textContent=su?"Create your account":"Sign In";
$("authSubmit").textContent=su?"Create account":"Sign In";
$("fgName").classList.toggle("hide",!su);
$("auPass").setAttribute("autocomplete",su?"new-password":"current-password");
$("authSwitch").innerHTML=su
  ? `Already have an account? <b onclick="switchAuth('signin')">Sign in</b>`
  : `New to Streamflix? <b onclick="switchAuth('signup')">Sign up now</b>`;
}
function switchAuth(m){
authMode=m;$("authError").classList.remove("show");markBad(false);
renderAuthMode();
setTimeout(()=>$(m==="signup"?"auName":"auEmail").focus(),0);
}
function landingStart(){
const em=$("landingEmail").value.trim();
if(em&&findUser(em))showAuth("signin",em);   // known email -> sign in
else showAuth("signup",em);                   // otherwise -> create account
}
function showAuthError(msg){const e=$("authError");e.textContent=msg;e.classList.add("show");}
function markBad(on){["auEmail","auPass","auName"].forEach(id=>$(id).classList.toggle("bad",on));}
function submitAuth(){
const email=$("auEmail").value,pass=$("auPass").value,name=$("auName").value;
const err=authMode==="signup"?doSignUp(name,email,pass):doSignIn(email,pass);
if(err){showAuthError(err);markBad(true);return;}
markBad(false);$("authError").classList.remove("show");
onAuthenticated();
}
function togglePw(){const i=$("auPass");i.type=i.type==="password"?"text":"password";}

function onAuthenticated(){
const u=currentUser();
if(u){PROFILES[0].name=u.name.split(" ")[0];} // primary profile = the account holder
$("auth").classList.remove("show");
$("landing").classList.remove("show");
["auName","auEmail","auPass","landingEmail"].forEach(id=>$(id).value="");
enterApp();
}
function enterApp(){ // show the "Who's watching?" gate
activeProfile=null;
document.body.style.overflow="";
$("gate").style.display="flex";
renderGate();
}
function logOutAccount(){
doLogOut();
stopHeroRotation();closeModal();
activeProfile=null;
$("gate").style.display="none";
["notifPanel","profilePanel"].forEach(p=>$(p).classList.remove("open"));
showLanding();
showToast("Signed out of Streamflix");
}
