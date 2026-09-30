const U='https://images.unsplash.com/photo-';
const DESIGNS=[
{id:1,t:'Soft Linen Lounge',c:'Living Room',m:'Linen, oak, wool',i:'1618221195710-dd6b41faaea6'},
{id:2,t:'Quiet Bedroom',c:'Bedroom',m:'Cotton, walnut',i:'1505693416388-ac5ce068fe85'},
{id:3,t:'Warm Wood Kitchen',c:'Kitchen',m:'Teak, marble',i:'1556909114-f6e7ad7d3136'},
{id:4,t:'Earthy Reading Corner',c:'Living Room',m:'Terracotta, rattan',i:'1586023492125-27b2c045efd7'},
{id:5,t:'Modern Minimal Living',c:'Living Room',m:'Concrete, leather',i:'1600210492486-724fe5c67fb0'},
{id:6,t:'Botanical Bedroom',c:'Bedroom',m:'Bamboo, jute',i:'1616486338812-3dadae4b4ace'},
{id:7,t:'Marble Island Kitchen',c:'Kitchen',m:'Marble, brass',i:'1600585154340-be6161a56a0c'},
{id:8,t:'Spa-Style Bathroom',c:'Bathroom',m:'Stone, glass',i:'1552321554-5fefe8c9ef14'},
{id:9,t:'Home Office Nook',c:'Workspace',m:'Ash wood, felt',i:'1524758631624-e2822e304c36'}];
const $=s=>document.querySelector(s),LS=(k,d)=>JSON.parse(localStorage.getItem(k)||d);
const user=()=>LS('session','null'),users=()=>LS('users','[]');
const saved=()=>LS('saved_'+user()?.email,'[]');
function toast(m){let t=$('#toast');t.textContent=m;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2200)}
function navAuth(){const u=user(),el=$('#authLink');if(!el)return;
 if(u){el.innerHTML=`<a href="#" id="out">Logout (${u.name.split(' ')[0]})</a>`;
  $('#out').onclick=e=>{e.preventDefault();localStorage.removeItem('session');location.href='index.html'}}}
function card(d){const on=user()&&saved().includes(d.id);
 return `<article class="card"><img loading="lazy" src="${U}${d.i}?w=700&q=70" alt="${d.t}">
 <button class="save ${on?'on':''}" data-id="${d.id}" aria-label="Save ${d.t}">${on?'♥':'♡'}</button>
 <div class="info"><h3>${d.t}</h3><small>${d.c} · ${d.m}</small></div></article>`}
function toggleSave(id){if(!user()){toast('Log in to save designs');setTimeout(()=>location.href='login.html',900);return}
 let s=saved();s=s.includes(id)?s.filter(x=>x!==id):[...s,id];
 localStorage.setItem('saved_'+user().email,JSON.stringify(s));toast(s.includes(id)?'Saved to your board':'Removed');return true}
function bindSave(rerender){document.querySelectorAll('.save').forEach(b=>b.onclick=()=>{if(toggleSave(+b.dataset.id))rerender()})}
function gallery(){const g=$('#grid');if(!g)return;let cat='All',q='';
 const cats=['All',...new Set(DESIGNS.map(d=>d.c))];
 $('#chips').innerHTML=cats.map(c=>`<button class="chip ${c=='All'?'on':''}">${c}</button>`).join('');
 const draw=()=>{const l=DESIGNS.filter(d=>(cat=='All'||d.c==cat)&&(d.t+d.m).toLowerCase().includes(q));
  g.innerHTML=l.length?l.map(card).join(''):'<p class="empty">No designs match. Try another word.</p>';bindSave(draw)};
 document.querySelectorAll('.chip').forEach(b=>b.onclick=()=>{document.querySelectorAll('.chip').forEach(x=>x.classList.remove('on'));b.classList.add('on');cat=b.textContent;draw()});
 $('#search').oninput=e=>{q=e.target.value.toLowerCase();draw()};draw()}
function savedPage(){const g=$('#savedGrid');if(!g)return;
 if(!user()){location.href='login.html';return}
 const draw=()=>{const l=DESIGNS.filter(d=>saved().includes(d.id));
  g.innerHTML=l.length?l.map(card).join(''):'<p class="empty">Your board is empty. <a href="index.html#gallery"><b>Browse inspiration</b></a> and tap the heart.</p>';bindSave(draw)};draw()}
function setErr(inp,msg){inp.classList.toggle('bad',!!msg);inp.nextElementSibling.textContent=msg||'';return !msg}
function authPage(){const lf=$('#loginForm');if(!lf)return;const sf=$('#signupForm');
 const tabs=document.querySelectorAll('.tabs .chip');
 tabs.forEach((b,i)=>b.onclick=()=>{tabs.forEach(x=>x.classList.remove('on'));b.classList.add('on');lf.classList.toggle('hide',i==1);sf.classList.toggle('hide',i==0)});
 const em=/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
 sf.onsubmit=e=>{e.preventDefault();const [n,m,p,c]=sf.querySelectorAll('input');
  const ok=[setErr(n,n.value.trim().length<3?'Enter your full name (3+ letters)':''),
   setErr(m,!em.test(m.value)?'Enter a valid email like name@mail.com':users().some(u=>u.email==m.value.toLowerCase())?'This email already has an account':''),
   setErr(p,!/^(?=.*\d).{6,}$/.test(p.value)?'Use 6+ characters with at least one number':''),
   setErr(c,c.value!==p.value?'Passwords do not match':'')].every(Boolean);
  if(!ok)return;const u={name:n.value.trim(),email:m.value.toLowerCase(),pass:p.value};
  localStorage.setItem('users',JSON.stringify([...users(),u]));
  localStorage.setItem('session',JSON.stringify({name:u.name,email:u.email}));toast('Account created');setTimeout(()=>location.href='index.html',800)};
 lf.onsubmit=e=>{e.preventDefault();const [m,p]=lf.querySelectorAll('input');
  if(![setErr(m,!em.test(m.value)?'Enter a valid email':''),setErr(p,!p.value?'Enter your password':'')].every(Boolean))return;
  const u=users().find(x=>x.email==m.value.toLowerCase()&&x.pass==p.value);
  if(!u)return setErr(p,'Email or password is incorrect');
  localStorage.setItem('session',JSON.stringify({name:u.name,email:u.email}));toast('Welcome back, '+u.name.split(' ')[0]);setTimeout(()=>location.href='index.html',800)}}
navAuth();gallery();savedPage();authPage();
