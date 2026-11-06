/* Sai Metal And Tube — all page behaviour.
   Edit CONTACT, PAY_DETAILS, PAYMENT, CURRENCIES/FX_DATE and the product list P near the top. */
/* ---------- Business settings: add phone / WhatsApp / email here ---------- */
const CONTACT = { phone: '', whatsapp: '', email: '' }; // e.g. whatsapp: '919800000000'

/* ---------- Payment methods: edit this list to change the Payment section everywhere ---------- */
/* Details shown when a payment card is opened. Empty bank fields show "Shared with your quote". */
const PAY_DETAILS = {
  payee: 'Sai Metal And Tube',            // name on cheques and bank account
  bank: {                                 // fill these in to show them on the site
    accountName: '', bankName: '', accountNumber: '', ifsc: '', branch: '', accountType: '',
    swift: '', bankAddress: '', intermediaryBank: '', intermediarySwift: ''   // for international (SWIFT) payments
  },
  online: [
    { name:'NEFT',       status:'available', desc:'Bank-to-bank transfer for any amount. Runs 24×7 in half-hourly batches.' },
    { name:'RTGS',       status:'available', desc:'Real-time transfer for payments of ₹2 lakh and above.' },
    { name:'IMPS',       status:'available', desc:'Instant transfer, any time of day, from net banking or your bank app.' },
    { name:'UPI',        status:'soon',      desc:'Pay from any UPI app by scanning our QR code.' },
    { name:'SWIFT wire', status:'request',   desc:'For international buyers paying from a bank outside India.' },
  ],
};
const PAYMENT = [
  { icon:'bank',   name:'Bank transfer', detail:'Direct transfer to our business bank account.' },
  { icon:'online', name:'Online',        detail:'Pay online from your bank or payment app.' },
  { icon:'cash',   name:'Cash',          detail:'Cash payment accepted.' },
  { icon:'cheque', name:'Cheque',        detail:'Cheque payable to Sai Metal And Tube.' },
];

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(pointer: fine)').matches;
const lowPower = !finePointer || (navigator.hardwareConcurrency||8) <= 4 || (navigator.deviceMemory||8) <= 4;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const sm = (a,b,x)=>{ const t=Math.min(1,Math.max(0,(x-a)/(b-a))); return t*t*(3-2*t); };
const clamp01 = x=>Math.min(1,Math.max(0,x));
const esc = s => String(s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));


/* ---------- Catalogue data (from the listed range, cleaned) ---------- */
const CATS = [['all','All'],['round','Round pipes'],['square','Square pipes'],['rect','Rectangular pipes'],['d','D-shape pipes'],['oval','Oval & capsule'],['curtain','Curtain rods'],['wiper','Wiper & mop'],['coupling','Waste couplings'],['bar','Bars & rods'],['kitchen','Kitchen tools']];
const catOf = k => CATS.find(c=>c[0]===k);
const P = [
  ['19 OD Stainless Steel Pipe','round','round','19 OD',150,'kg'],
  ['3/4″ Stainless Steel Pipe','round','round','3/4″',150,'kg'],
  ['22 mm Stainless Steel Pipe','round','round','Ø 22 mm',120,'kg'],
  ['22 OD Stainless Steel Pipe','round','round','22 OD',140,'kg'],
  ['3″ Stainless Steel Pipe','round','round:big','3″',150,'kg'],
  ['3″ Stainless Steel Welded Pipe','round','round:big:weld','3″ welded',150,'kg'],
  ['304 Stainless Steel Pipe','round','round','Grade 304',280,'kg'],
  ['Stainless Steel Welded Pipe','round','round::weld','Welded',null,'kg'],
  ['Stainless Steel Polished Pipe','round','round::polish','Polished',null,'kg'],
  ['3 × 3 Stainless Steel Square Pipe','square','square','3 × 3',150,'kg'],
  ['3 × 3 Square Stainless Steel Pipe','square','square','3 × 3',140,'kg'],
  ['3 × 3 Stainless Steel Square Pipe, 202','square','square','3 × 3',150,'kg'],
  ['3 × 3 Stainless Steel Square Pipe, 304','square','square','3 × 3',190,'kg'],
  ['60 × 60 mm Stainless Steel Square Pipe','square','square:big','60 × 60 mm',155,'kg'],
  ['40 × 10 mm Stainless Steel Rectangular Pipe','rect','rect:40:10','40 × 10 mm',145,'kg'],
  ['25 × 12 mm Stainless Steel Rectangular Pipe','rect','rect:25:12','25 × 12 mm',120,'kg'],
  ['40 × 20 mm Stainless Steel Rectangular Pipe','rect','rect:40:20','40 × 20 mm',140,'kg'],
  ['20 × 10 mm Stainless Steel Rectangular Pipe','rect','rect:20:10','20 × 10 mm',140,'kg'],
  ['Stainless Steel D Shape Pipe','d','d','D shape',180,'kg'],
  ['Stainless Steel D Section Pipe','d','d','D section',150,'kg'],
  ['304 Stainless Steel D Shape Pipe','d','d','D shape',150,'kg'],
  ['Stainless Steel Capsule Pipe','oval','capsule','Capsule',140,'kg'],
  ['Stainless Steel Oval Pipe','oval','oval','Oval',140,'kg'],
  ['Stainless Steel Curtain Rod','curtain','curtain:finial','Curtain rod',140,'kg'],
  ['Stainless Steel Curtain Pipe','curtain','curtain','Curtain pipe',140,'kg'],
  ['Stainless Steel Rod for Curtains','curtain','curtain:finial','Curtain rod',140,'kg'],
  ['1″ Curtain Pipe','curtain','curtain','1″',140,'kg'],
  ['3″ Stainless Steel Wiper Stick','wiper','wiper','3″',150,'piece'],
  ['4″ Stainless Steel Wiper Pipe','wiper','wiper','4″',50,'piece'],
  ['Stainless Steel Wiper Pipe','wiper','wiper','Wiper pipe',45,'piece'],
  ['MS Mop Stick (mild steel)','wiper','wiper:ms','Mop stick',22,'piece'],
  ['SS Waste Coupling, Full Thread','coupling','coupling:full','Full thread',45,'piece'],
  ['SS Waste Coupling','coupling','coupling','Coupling',45,'piece'],
  ['Stainless Steel Bar','bar','bar','Bar',155,'kg'],
  ['Stainless Steel Rod','bar','rod','Rod',160,'kg'],
  ['Stainless Steel Round Bar','bar','rod:big','Round bar',null,'kg'],
  ['SS Taveta','kitchen','spatula','Taveta',55,'piece'],
  ['SS Palta','kitchen','spatula','Palta',55,'piece'],
  ['SS Palta, Wooden Handle','kitchen','spatula:w','Palta',55,'piece'],
  ['SS Skimmer','kitchen','skimmer','Skimmer',60,'piece'],
  ['SS Zara (Jhara)','kitchen','skimmer','Zara',null,'piece'],
  ['SS Udipi Zara','kitchen','skimmer:big','Udipi zara',null,'piece'],
  ['SS Zara, Wooden Handle','kitchen','skimmer:w','Zara',null,'piece'],
  ['SS Scoop','kitchen','ladle','Scoop',60,'piece'],
  ['SS Chamach, Wooden Handle','kitchen','ladle:w','Chamach',60,'piece'],
  ['SS Drinking Straw','kitchen','straw','Straw',120,'piece'],
].map(([name,cat,shape,dim,price,unit],i)=>({id:'p'+i,idx:i,name,cat,shape,dim,price,unit,
  grade:/304/.test(name)?'304':/202/.test(name)?'202':null}));
$('#factCount').textContent = P.length;

/* ---------- Section drawings (SVG placeholders and blueprints) ---------- */
const C = (cx,cy,r)=>`M${cx-r} ${cy}a${r} ${r} 0 1 0 ${2*r} 0a${r} ${r} 0 1 0 ${-2*r} 0Z`;
const RR = (x,y,w,h,r)=>`M${x+r} ${y}H${x+w-r}A${r} ${r} 0 0 1 ${x+w} ${y+r}V${y+h-r}A${r} ${r} 0 0 1 ${x+w-r} ${y+h}H${x+r}A${r} ${r} 0 0 1 ${x} ${y+h-r}V${y+r}A${r} ${r} 0 0 1 ${x+r} ${y}Z`;
const CL = `<g class="cl-cross" stroke="#4b5363" stroke-width=".7" stroke-dasharray="7 2 1 2" fill="none"><path d="M10 60H150M80 6V114"/><circle cx="80" cy="60" r="1.5" fill="#4b5363" opacity=".6"/></g>`;
function glyph(shape, mono){
  const [kind,a] = shape.split(':'); const wood = a==='w';
  const S = d => mono ? `<path d="${d}" fill="none" fill-rule="evenodd" stroke="currentColor" stroke-width="5"/>` : `<path d="${d}" fill="url(#gSteel)" fill-rule="evenodd" stroke="rgba(255,255,255,.35)" stroke-width=".6"/>`;
  const cl = mono?'':CL;
  let s = '';
  if(kind==='round'||kind==='curtain') s = cl+S(C(80,60,40)+C(80,60,34));
  else if(kind==='square') s = cl+S(RR(42,22,76,76,7)+RR(48,28,64,64,3));
  else if(kind==='rect'){ const b=shape.split(':')[2]; const w=+a||40,h=+b||20,k=Math.min(118/w,80/h),W=w*k,H=h*k,x=80-W/2,y=60-H/2,t=Math.max(4,Math.min(6,H*.12));
    s = cl+S(RR(x,y,W,H,5)+RR(x+t,y+t,W-2*t,H-2*t,2)); }
  else if(kind==='d'){ const R=44,hb=24,cy=60+(R-hb)/2,t=6;
    const o=`M${80+R} ${cy}A${R} ${R} 0 0 0 ${80-R} ${cy}V${cy+hb-6}Q${80-R} ${cy+hb} ${80-R+6} ${cy+hb}H${80+R-6}Q${80+R} ${cy+hb} ${80+R} ${cy+hb-6}Z`;
    const r2=R-t,b2=cy+hb-t; const i=`M${80+r2} ${cy}A${r2} ${r2} 0 0 0 ${80-r2} ${cy}V${b2}H${80+r2}Z`;
    s = cl+S(o+i); }
  else if(kind==='oval') s = cl+S(`M30 60a50 30 0 1 0 100 0a50 30 0 1 0 -100 0Z M36 60a44 24 0 1 0 88 0a44 24 0 1 0 -88 0Z`);
  else if(kind==='capsule') s = cl+S(RR(28,32,104,56,28)+RR(34,38,92,44,22));
  else if(kind==='rod') s = cl+`<path d="${C(80,60,36)}" fill="url(#gSteel)"/>`;
  else if(kind==='bar') s = cl+`<path d="${RR(46,26,68,68,6)}" fill="url(#gSteel)"/>`;
  else if(kind==='coupling'){ const hex=[...Array(6)].map((_,i)=>{const t=Math.PI/3*i+Math.PI/6;return `${80+44*Math.cos(t)} ${60+44*Math.sin(t)}`}).join('L'); s = cl+S(`M${hex}Z`+C(80,60,24)); }
  else if(kind==='wiper') s = cl+`<path d="M12 52H130V68H12Z" fill="url(#gSteel)"/><path d="M130 54H150V66H130Z" fill="#8a929c"/>`;
  else if(kind==='ladle') s = cl+`<ellipse cx="44" cy="74" rx="30" ry="22" fill="url(#gSteel)"/><path d="M68 62L118 34" stroke="url(#gSteel)" stroke-width="5" stroke-linecap="round"/><path d="M114 36L150 16" stroke="${wood?'url(#gWood)':'url(#gSteel)'}" stroke-width="${wood?9:5}" stroke-linecap="round"/>`;
  else if(kind==='skimmer'){ let holes=''; for(let y=-2;y<=2;y++)for(let x=-2;x<=2;x++){ if(x*x+y*y<=5) holes+=C(46+x*9,72+y*8,2.3);}
    s = cl+`<path d="${C(46,72,30)}${holes}" fill="url(#gSteel)" fill-rule="evenodd"/><path d="M72 58L118 32" stroke="url(#gSteel)" stroke-width="5" stroke-linecap="round"/><path d="M114 34L150 14" stroke="${wood?'url(#gWood)':'url(#gSteel)'}" stroke-width="${wood?9:5}" stroke-linecap="round"/>`; }
  else if(kind==='spatula') s = cl+`<path d="M14 82L66 66Q72 64 74 70L80 88Q82 94 76 96L24 108Q16 110 14 102Z" fill="url(#gSteel)"/><path d="M76 76L118 46" stroke="url(#gSteel)" stroke-width="5" stroke-linecap="round"/><path d="M114 49L150 24" stroke="${wood?'url(#gWood)':'url(#gSteel)'}" stroke-width="${wood?9:5}" stroke-linecap="round"/>`;
  else if(kind==='straw') s = cl+`<path d="M26 104L104 40Q112 34 122 34H148" fill="none" stroke="url(#gSteel)" stroke-width="9" stroke-linecap="round"/>`;
  return `<svg viewBox="0 0 160 120" aria-hidden="true">${s}</svg>`;
}
const isProfile = k => ['round','square','rect','d','oval','capsule','curtain'].includes(k.split(':')[0]);

/* ---------- Requirement state ---------- */
const THUMBS = {};
const ls = { get(k,d){ try{ return JSON.parse(localStorage.getItem(k)) ?? d; }catch(e){ return d; } }, set(k,v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){} } };
const num=(v,max=1e7)=>{ const n=parseFloat(v); return Number.isFinite(n)&&n>0?Math.min(n,max):0; };
let req = (()=>{ const raw=ls.get('smt-req',{}), out={}; if(raw&&typeof raw==='object') for(const k of Object.keys(raw)) if(/^p\d{1,3}$/.test(k)){ const q=num(raw[k]); out[k]=q?String(+q.toFixed(2)):''; } return out; })();
let custom = (()=>{ const raw=ls.get('smt-custom',[]); if(!Array.isArray(raw)) return []; return raw.slice(0,50).map(c=>{
  const qty=Math.max(1,Math.round(num(c&&c.qty,1e5)))||1;
  const kg=+num(c&&c.kg).toFixed(1);
  const cost=num(c&&c.cost,1e10);
  const kgPiece=num(c&&c.kgPiece) || (qty ? +(kg/qty).toFixed(3) : 0);
  const costPiece=num(c&&c.costPiece) || (qty ? cost/qty : 0);
  return {
    name:String(c&&c.name||'Custom size').slice(0,140), qty, kg, cost, kgPiece, costPiece,
    shape: c && typeof c.shape==='string' && /^(round|square|rect(:\d+:\d+)?)$/.test(c.shape) ? c.shape : 'round'
  };
}); })();
const save = ()=>{ ls.set('smt-req',req); ls.set('smt-custom',custom); };
/* ---------- Region & currency (reference rates; quotes confirm the final amount) ---------- */
const FX_DATE='16 Oct 2026';
const CURRENCIES={
  INR:{region:'India',          sym:'₹',   rate:1,      locale:'en-IN'},
  USD:{region:'United States',  sym:'$',   rate:94.82,  locale:'en-US'},
  EUR:{region:'Europe',         sym:'€',   rate:106.50, locale:'en-IE'},
  GBP:{region:'United Kingdom', sym:'£',   rate:126.13, locale:'en-GB'},
  AED:{region:'UAE',            sym:'AED', rate:25.82,  locale:'en-AE'},
  SAR:{region:'Saudi Arabia',   sym:'SAR', rate:25.29,  locale:'en-SA'},
};
const guessCur=()=>{ try{ const tz=Intl.DateTimeFormat().resolvedOptions().timeZone||''; if(/Kolkata|Calcutta/.test(tz)) return 'INR';
  if(/^America\//.test(tz)) return 'USD'; if(/London|Dublin/.test(tz)) return 'GBP'; if(/^Europe\//.test(tz)) return 'EUR'; if(/Dubai|Muscat/.test(tz)) return 'AED'; if(/Riyadh/.test(tz)) return 'SAR'; }catch(e){} return 'INR'; };
let CUR=(()=>{ try{ const c=localStorage.getItem('smt-cur'); if(c&&CURRENCIES[c]) return c; }catch(e){} return guessCur(); })();
const fmtINR = n => '₹' + Math.round(n).toLocaleString('en-IN');
const fmt = n => { if(CUR==='INR') return fmtINR(n); const c=CURRENCIES[CUR], v=n/c.rate, dp=v<100?2:0;
  try{ return new Intl.NumberFormat(c.locale,{style:'currency',currency:CUR,minimumFractionDigits:dp,maximumFractionDigits:dp}).format(v); }catch(e){ return c.sym+' '+v.toFixed(dp); } };
const unitShort = u => u==='kg'?'kg':'pcs';
const stepOf = u => u==='kg'?25:10;
const pById = id => P.find(x=>x.id===id);

/* ---------- Catalogue UI ---------- */
let cat='all', term='';
function renderChips(){
  $('#chips').innerHTML = CATS.map(([k,l])=>{ const n = k==='all'?P.length:P.filter(p=>p.cat===k).length;
    return `<button class="chip" type="button" data-cat="${k}" aria-pressed="${k===cat}">${l}<span class="c">${n}</span></button>`; }).join('');
}
function ctrlHTML(p){
  if(!(p.id in req)) return `<button class="add" type="button" data-add="${p.id}">+ ADD</button>`;
  return `<div class="stepper"><button type="button" data-dec="${p.id}" aria-label="Less ${esc(p.name)}">−</button><input data-q="${p.id}" value="${esc(req[p.id])}" inputmode="decimal" aria-label="Quantity of ${esc(p.name)} in ${unitShort(p.unit)}"><span>${unitShort(p.unit)}</span><button type="button" data-inc="${p.id}" aria-label="More ${esc(p.name)}">+</button></div>`;
}
function cardHTML(p){
  const t = THUMBS[p.id];
  return `<article class="card${t?' r3d':''}" data-id="${p.id}">
    <div class="fig"><div class="floor"></div><div class="ph">${glyph(p.shape)}</div>
      <img class="va${t?' on has-b':''}" data-v="${p.id}a" alt="" ${t?`src="${t.a}"`:''}>
      <img class="vb${t?' on':''}" data-v="${p.id}b" alt="" ${t?`src="${t.b}"`:''}>
      <span class="dim">${esc(p.dim)}</span>${p.grade?`<span class="grade-chip">SS ${esc(p.grade)}</span>`:''}
      <span class="stock${p.price?'':' req'}">${p.price?'Listed price':'Price on request'}</span>
      ${isProfile(p.shape)?`<span class="bp">SECTION ${glyph(p.shape.replace('curtain','round'),true)}</span>`:''}
    </div>
    <div class="body">
      <div><p class="cat-l">${esc(catOf(p.cat)[1])}</p><h3>${esc(p.name)}</h3></div>
      <div class="row">
        ${p.price?`<span class="price-big">${fmt(p.price)}<small>/${esc(p.unit)}</small></span>`:`<span class="price-req">On request</span>`}
        <span class="ctl" data-ctl="${p.id}">${ctrlHTML(p)}</span>
      </div>
    </div>
  </article>`;
}
function renderGrid(){
  const norm = s => s.toLowerCase().replace(/(\d)\s*x\s*(\d)/gi,'$1×$2').replace(/\s*×\s*/g,'×').replace(/[″”"״]/g,'"').replace(/\s+/g,' ').trim();
  const t = norm(term);
  const tokens = t ? t.split(' ').filter(Boolean) : [];
  const list = P.filter(p => {
    if (cat !== 'all' && p.cat !== cat) return false;
    if (!tokens.length) return true;
    const isSS = p.name.toLowerCase().includes('stainless');
    const hay = norm(p.name + ' ' + (p.grade ? 'ss ' + p.grade + ' grade ' + p.grade : '') + ' ' + p.dim + ' ' + catOf(p.cat)[1] + (isSS ? ' ss' : ''));
    return tokens.every(tok => hay.includes(tok));
  });
  $('#grid').innerHTML = list.map(cardHTML).join('');
  $('#empty').hidden = list.length>0;
  $('#resultCount').textContent = `${list.length} ${list.length===1?'product':'products'}`;
  activeCard = null; cardRect = null;
  if(window.gsap && !reduceMotion && list.length > 0){
    gsap.fromTo('#grid .card', {opacity:0, y:12}, {opacity:1, y:0, duration:.35, stagger:.018, ease:'power2.out', clearProps:'opacity,transform'});
  }
}
function refreshCtl(id){ const p=pById(id); $$(`[data-ctl="${id}"]`).forEach(el=>{ el.innerHTML=ctrlHTML(p); }); renderList(); }
function setQty(id,v){ if(!pById(id)) return; const n=num(v,1e6); if(!n){ delete req[id]; } else req[id]=String(+n.toFixed(2)); save(); }
$('#chips').addEventListener('click', e=>{ const b=e.target.closest('[data-cat]'); if(!b) return; cat=b.dataset.cat; $$('.chip').forEach(c=>c.setAttribute('aria-pressed', c===b)); renderGrid(); });
let searchRaf = null;
const onSearch = e=>{
  term=e.target.value;
  if(searchRaf) cancelAnimationFrame(searchRaf);
  searchRaf=requestAnimationFrame(()=>{ searchRaf=null; renderGrid(); });
};
$('#q').addEventListener('input', onSearch);
$('#q').addEventListener('search', onSearch);
$('#grid').addEventListener('click', e=>{
  const add=e.target.closest('[data-add]'), inc=e.target.closest('[data-inc]'), dec=e.target.closest('[data-dec]');
  if(add){ const p=pById(add.dataset.add); req[p.id]=String(stepOf(p.unit)); save(); refreshCtl(p.id); bump(); $(`[data-q="${p.id}"]`)?.focus(); }
  else if(inc){ const p=pById(inc.dataset.inc); setQty(p.id,(parseFloat(req[p.id])||0)+stepOf(p.unit)); refreshCtl(p.id); }
  else if(dec){ const p=pById(dec.dataset.dec); setQty(p.id,(parseFloat(req[p.id])||0)-stepOf(p.unit)); refreshCtl(p.id); bump(); }
});
$('#grid').addEventListener('change', e=>{ const id=e.target.dataset.q; if(!id) return; setQty(id,e.target.value); refreshCtl(id); bump(); });

let activeCard = null, cardRect = null;
$('#grid').addEventListener('pointermove', e=>{
  const c = e.target.closest('.card');
  if(!c){
    if(activeCard){ activeCard.style.transform = ''; activeCard = null; cardRect = null; }
    return;
  }
  if(c !== activeCard){
    if(activeCard) activeCard.style.transform = '';
    activeCard = c;
    cardRect = c.getBoundingClientRect();
  }
  if(!cardRect) cardRect = c.getBoundingClientRect();
  const mx = e.clientX - cardRect.left;
  const my = e.clientY - cardRect.top;
  c.style.setProperty('--mx', mx + 'px');
  c.style.setProperty('--my', my + 'px');
  if(!reduceMotion && finePointer){
    const x = mx / (cardRect.width || 1);
    const y = my / (cardRect.height || 1);
    c.style.transform = `perspective(800px) rotateY(${(x - .5) * 5}deg) rotateX(${(-y + .5) * 4}deg) translateY(-4px)`;
  }
}, { passive: true });
$('#grid').addEventListener('pointerleave', ()=>{
  if(activeCard){ activeCard.style.transform = ''; activeCard = null; }
  cardRect = null;
});
function setCategory(k){ cat=k; term=''; $('#q').value=''; renderChips(); renderGrid(); }
function applyThumb(id){ const t=THUMBS[id]; if(!t) return;
  $$(`img[data-v="${id}a"]`).forEach(i=>{ const done=()=>{ i.classList.add('on','has-b'); i.closest('.card')?.classList.add('r3d'); }; i.onload=done; i.src=t.a; if(i.complete) done(); });
  $$(`img[data-v="${id}b"]`).forEach(i=>{ const done=()=>i.classList.add('on'); i.onload=done; i.src=t.b; if(i.complete) done(); });
  $$(`[data-th="${id}"]`).forEach(el=>{ el.innerHTML=`<img src="${t.a}" alt="">`; });
  $$(`img[data-rail="${id}"]`).forEach(i=>{ const done=()=>i.classList.add('on'); i.onload=done; i.src=t.a; if(i.complete) done(); });
}

/* ---------- Requirement drawer ---------- */
const drawer=$('#drawer'), scrim=$('#scrim');
let lastFocus=null, lenis=null;
function setInert(state){ ['#home','#top','footer'].forEach(sel=>{ const el=$(sel); if(el) el.inert=state; }); }
function openList(){ lastFocus=document.activeElement; drawer.classList.add('open'); scrim.classList.add('open'); drawer.setAttribute('aria-hidden','false'); setInert(true); lenis&&lenis.stop(); setTimeout(()=>$('#closeList').focus(),60); }
function closeList(){ drawer.classList.remove('open'); scrim.classList.remove('open'); drawer.setAttribute('aria-hidden','true'); setInert(false); lenis&&lenis.start(); lastFocus&&lastFocus.focus(); }
$('#openList').onclick=openList; $('#openList2').onclick=openList; $('#closeList').onclick=closeList; scrim.onclick=closeList;
addEventListener('keydown',e=>{ if(e.key==='Escape'&&drawer.classList.contains('open')) closeList(); });
drawer.addEventListener('keydown',e=>{
  if(e.key!=='Tab'||!drawer.classList.contains('open')) return;
  const f=$$('button:not([disabled]), [href], input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])', drawer);
  if(!f.length) return;
  const first=f[0], last=f[f.length-1];
  if(e.shiftKey&&document.activeElement===first){ e.preventDefault(); last.focus(); }
  else if(!e.shiftKey&&document.activeElement===last){ e.preventDefault(); first.focus(); }
});
const count = ()=>Object.keys(req).filter(pById).length + custom.length;
function bump(){ $('#listCount').textContent=count(); if(window.gsap&&!reduceMotion) gsap.fromTo('#listCount',{scale:1.5},{scale:1,duration:.5,ease:'back.out(3)'}); }
function reqText(){
  const ids=Object.keys(req).filter(pById); if(!ids.length && !custom.length) return '';
  const lines=ids.map(id=>{const p=pById(id); const q=req[id]; return `- ${p.name}: ${q?q+' '+unitShort(p.unit):'quantity to confirm'}${p.price?` (listed ${fmtINR(p.price)}/${p.unit}${CUR!=='INR'?`, about ${fmt(p.price)}/${p.unit}`:''})`:''}`;});
  custom.forEach(c=>lines.push(`- ${c.name}: ${c.qty} pcs (about ${c.kg} kg)`));
  return `Requirement for Sai Metal And Tube\n${lines.join('\n')}\n\nDelivery location${CUR!=='INR'?' (city, country, port)':''}: \nRequired by: ${CUR!=='INR'?`\nPreferred currency: ${CUR}`:''}`;
}
function renderList(){
  const ids=Object.keys(req).filter(pById);
  const rows = ids.map(id=>{const p=pById(id); const t=THUMBS[id]; return `
    <div class="dr-item"><div class="th" data-th="${id}">${t?`<img src="${t.a}" alt="">`:glyph(p.shape)}</div>
      <div><h4>${esc(p.name)}</h4><p>${p.price?fmt(p.price)+' / '+esc(p.unit):'Price on request'}</p><button class="rm" type="button" data-rm="${id}">Remove</button></div>
      <div class="qty"><input id="qty-${id}" type="number" inputmode="decimal" min="0" step="any" placeholder="Qty" value="${esc(req[id])}" data-qty="${id}" aria-label="Quantity for ${esc(p.name)} in ${unitShort(p.unit)}"><span>${unitShort(p.unit)}</span></div>
    </div>`;}).concat(custom.map((c,i)=>`
    <div class="dr-item"><div class="th">${glyph(c.shape)}</div>
      <div><h4>${esc(c.name)}</h4><p>About ${esc(c.kg)} kg · est. ${fmt(c.cost)}</p><button class="rm" type="button" data-rmc="${i}">Remove</button></div>
      <div class="qty"><input id="cq-${i}" type="number" inputmode="numeric" min="1" step="1" value="${esc(c.qty)}" data-cq="${i}" aria-label="Pieces of ${esc(c.name)}"><span>pcs</span></div>
    </div>`));
  $('#drBody').innerHTML = rows.length ? rows.join('') : `<div class="dr-empty"><p style="margin:0">Your list is empty. Add products from the catalogue or a size from the calculator and they will appear here.</p><a class="p-link" href="#catalogue" data-close>Go to the catalogue</a></div>`;
  const t = reqText();
  $('#drText').value = t || 'Add products to build your requirement.';
  $('#listCount').textContent = count();
  if(window.__waBtn) window.__waBtn.href = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(t)}`;
}
$('#drBody').addEventListener('change', e=>{
  const id=e.target.dataset.qty; if(id){ setQty(id,e.target.value); refreshCtl(id); return; }
  const ci=e.target.dataset.cq; if(ci!==undefined){ const c=custom[+ci]; if(!c) return; const n=Math.max(1,Math.min(1e5,Math.round(+e.target.value||1))); const per=c.kgPiece||(c.kg/c.qty), cpp=c.costPiece||(c.cost/c.qty); c.qty=n; c.kg=+(per*n).toFixed(1); c.cost=cpp*n; save(); renderList(); }
});
$('#drBody').addEventListener('click', e=>{ const id=e.target.dataset.rm; if(id){ delete req[id]; save(); refreshCtl(id); }
  const ci=e.target.dataset.rmc; if(ci!==undefined){ custom.splice(+ci,1); save(); renderList(); bump(); }
  if(e.target.closest('[data-close]')){ e.preventDefault(); closeList(); go('#catalogue'); } });
$('#copyBtn').addEventListener('click', ()=>{
  const t=reqText(); const msg=$('#drMsg');
  if(!t){ msg.textContent='Add at least one product first.'; return; }
  const fallback=()=>{ const ta=$('#drText'); ta.focus(); ta.select(); msg.textContent='Text selected. Press Ctrl+C (or Cmd+C) to copy.'; };
  try{ navigator.clipboard.writeText(t).then(()=>{ msg.textContent='Copied. Paste it into your enquiry or message.'; }, fallback); }catch(e){ fallback(); }
});
(function contacts(){
  const parts=[]; const acts=$('#drActions');
  if(CONTACT.whatsapp){ const a=document.createElement('a'); a.className='btn btn-line full'; a.target='_blank'; a.rel='noopener noreferrer'; a.textContent='Send on WhatsApp';
    a.href=`https://wa.me/${CONTACT.whatsapp}`; a.addEventListener('click',()=>{ a.href=`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(reqText())}`; }); acts.appendChild(a); window.__waBtn=a; }
  if(CONTACT.phone) parts.push(`Phone ${CONTACT.phone}`);
  if(CONTACT.email) parts.push(`Email ${CONTACT.email}`);
  $('#contactLine').textContent = parts.length ? parts.join(' · ') : 'Point of contact: Hasmukh Patel, Chief Executive.';
})();

/* ---------- Weight & price calculator ---------- */
const DENSITY = {'304':7.93,'202':7.80}; // g/cm³
const RATE = {'304':190,'202':150};      // ₹/kg defaults from listed prices
const calc = {shape:'round', grade:'304', rateTouched:false};
function segBind(id, key, after){ $(id).addEventListener('click',e=>{ const b=e.target.closest('[data-v]'); if(!b) return; calc[key]=b.dataset.v; $$(id+' [data-v]').forEach(x=>x.setAttribute('aria-pressed',x===b)); after&&after(); runCalc(); }); }
segBind('#cShape','shape',()=>{ $$('.calc [data-for]').forEach(f=>f.hidden=f.dataset.for!==calc.shape); });
segBind('#cGrade','grade',()=>{ if(!calc.rateTouched) $('#cRate').value=RATE[calc.grade]; });
$('#cRate').addEventListener('input',()=>{ calc.rateTouched=true; });
$$('.calc input,.calc select').forEach(el=>{ el.addEventListener('input',runCalc); el.addEventListener('change',runCalc); });
let lastCalc=null;
function runCalc(){
  const v=id=>parseFloat($(id).value), err=$('#cErr'); err.textContent='';
  const t=v('#cT'), len=v('#cLen'), pcs=Math.max(1,Math.min(1e5,Math.round(v('#cPcs')||1))), rate=Math.max(0,Math.min(1e5,v('#cRate')||0)), rho=DENSITY[calc.grade];
  const tooLarge = t>100 || len>100 ||
    (calc.shape==='round' && (v('#cOD')*($('#cODu').value==='in'?25.4:1))>2000) ||
    (calc.shape==='square' && v('#cSide')>2000) ||
    (calc.shape==='rect' && (v('#cA')>2000 || v('#cB')>2000));
  if(tooLarge){ err.textContent='Those sizes look too large. Check the units: mm for size and wall, metres for length.'; ['#cKgm','#cKgp','#cKgt','#cCost'].forEach(x=>$(x).textContent='—'); lastCalc=null; $('#cAdd').disabled=true; return; }
  let area=0, desc='', fig='', formula='';
  const bad=m=>{ err.textContent=m; ['#cKgm','#cKgp','#cKgt','#cCost'].forEach(x=>$(x).textContent='—'); lastCalc=null; $('#cAdd').disabled=true; };
  if(!(t>0)) return bad('Enter a wall thickness above 0 mm.');
  if(!(len>0)) return bad('Enter a length above 0 m.');
  if(calc.shape==='round'){ const D=v('#cOD')*($('#cODu').value==='in'?25.4:1); if(!(D>0)) return bad('Enter an outer diameter.');
    if(t>=D/2) return bad('The wall is too thick for that diameter. It must be less than half the OD.');
    area=Math.PI*t*(D-t); desc=`Round pipe ${+D.toFixed(2)} mm OD × ${t} mm wall`;
    const R=52, ri=Math.max(R-Math.max(1.5,R*2*t/D),4);
    fig=`<svg viewBox="0 0 120 120"><path d="${C(60,60,R)}${C(60,60,ri)}" fill="url(#gSteel)" fill-rule="evenodd"/><g stroke="#4b5363" stroke-width=".6" stroke-dasharray="6 2 1 2"><path d="M2 60H118M60 2V118"/></g></svg>`;
    formula=`kg/m = π × t × (OD − t) × ρ<br><b>π × ${t} × (${+D.toFixed(2)} − ${t}) × ${rho}</b> ÷ 1000`; }
  else { const a= calc.shape==='square'? v('#cSide') : v('#cA'), b= calc.shape==='square'? a : v('#cB');
    if(!(a>0&&b>0)) return bad('Enter the outside dimensions.');
    if(t>=Math.min(a,b)/2) return bad('The wall is too thick for that size. It must be less than half the shorter side.');
    area=2*t*(a+b)-4*t*t; desc= calc.shape==='square'? `Square pipe ${a} × ${a} mm × ${t} mm wall` : `Rectangular pipe ${a} × ${b} mm × ${t} mm wall`;
    const k=100/Math.max(a,b), W=a*k, H=b*k, x=60-W/2, y=60-H/2, tt=Math.max(1.5,t*k);
    fig=`<svg viewBox="0 0 120 120"><path d="${RR(x,y,W,H,Math.min(6,H/4))}${RR(x+tt,y+tt,Math.max(1,W-2*tt),Math.max(1,H-2*tt),Math.min(3,H/6))}" fill="url(#gSteel)" fill-rule="evenodd"/><g stroke="#4b5363" stroke-width=".6" stroke-dasharray="6 2 1 2"><path d="M2 60H118M60 2V118"/></g></svg>`;
    formula=`kg/m = [2t(A + B) − 4t²] × ρ<br><b>[2×${t}×(${a}+${b}) − 4×${t}²] × ${rho}</b> ÷ 1000`; }
  const kgm=area*rho/1000, kgp=kgm*len, kgt=kgp*pcs, cost=kgt*rate;
  $('#cFig').innerHTML=fig; $('#cFormula').innerHTML=formula+`<br>ρ (SS ${calc.grade}) = ${rho} g/cm³`;
  $('#cKgm').innerHTML=`${kgm.toFixed(3)}<small>kg/m</small>`; $('#cKgp').innerHTML=`${kgp.toFixed(2)}<small>kg</small>`;
  $('#cKgt').innerHTML=`${kgt.toFixed(1)}<small>kg</small>`; $('#cCost').innerHTML=`${fmt(cost)}`;
  $('#cNote').textContent = calc.shape==='round' ? 'Estimate only, before GST and transport. Default rates come from our listed prices.' : 'Square and rectangular weights ignore corner radius, so actual weight is slightly lower. Estimate only, before GST and transport.';
  if(CUR!=='INR') $('#cNote').textContent += ` Cost shown in ${CUR} at approximate ${FX_DATE} rates.`;
  lastCalc={name:`${desc}, ${len} m, SS ${calc.grade}`, qty:pcs, kg:+kgt.toFixed(1), cost, kgPiece:+kgp.toFixed(3), costPiece:cost/pcs, shape: calc.shape==='round'?'round':calc.shape==='square'?'square':`rect:${Math.round(v('#cA'))||40}:${Math.round(v('#cB'))||20}`};
  $('#cAdd').disabled=false;
}
$('#cAdd').addEventListener('click',()=>{ if(!lastCalc) return; if(custom.length>=50){ $('#cErr').textContent='Your list already has 50 custom sizes. Remove some before adding more.'; return; } custom.push({...lastCalc}); save(); renderList(); bump(); const b=$('#cAdd'), o=b.dataset.origText||b.textContent; b.dataset.origText=o; b.textContent='Added to requirement'; clearTimeout(b._t); b._t=setTimeout(()=>b.textContent=o,1600); });
runCalc();

/* ---------- Grades: uses, bars, MTC ---------- */
const USES=[['Coastal railings','304','Salt air pits lower-nickel steel quickly. Use 304 near the sea.'],['Food & dairy','304','304 is the usual choice for food contact and daily wash-downs.'],['Kitchens & bathrooms','304','Moisture and cleaning chemicals call for 304.'],['Outdoor gates','304','For rain and sun all year, 304 holds its finish longer.'],['Indoor furniture','202','Indoors and dry, 202 gives the same look for less.'],['Curtain rods','202','Curtain rods stay dry indoors, so 202 is the economical pick.'],['Decorative grills','202','For indoor grills and trim, 202 keeps cost down.'],['Partitions','202','Office and shop partitions indoors work well in 202.']];
$('#uses').innerHTML=USES.map((u,i)=>`<li><button class="use" type="button" data-u="${i}" aria-pressed="false">${u[0]}<i>${u[1]}</i></button></li>`).join('');
$('#uses').addEventListener('click',e=>{ const b=e.target.closest('[data-u]'); if(!b) return; const u=USES[+b.dataset.u]; const on=b.getAttribute('aria-pressed')!=='true';
  $$('.use').forEach(x=>x.setAttribute('aria-pressed',x===b&&on)); $$('.grade').forEach(g=>g.classList.toggle('pick',on&&g.dataset.grade===u[1]));
  $('#useNote').textContent= on? `${u[0]}: SS ${u[1]}. ${u[2]}` : 'Pick a use above to see which grade fits.'; });
(()=>{ const gs=$$('.grade'); const show=()=>gs.forEach(g=>g.classList.add('in'));
  if('IntersectionObserver' in window){ const io=new IntersectionObserver(es=>es.forEach(en=>{ if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target);} }),{threshold:.3}); gs.forEach(g=>io.observe(g)); setTimeout(show,6000); } else show(); })();
const MTC={
  '304':{chem:[['C','—','0.08'],['Mn','—','2.00'],['Si','—','0.75'],['P','—','0.045'],['S','—','0.030'],['Cr','18.0','20.0'],['Ni','8.0','10.5'],['N','—','0.10']],mech:[['Tensile strength','515 MPa','—'],['Yield strength (0.2%)','205 MPa','—'],['Elongation in 50 mm','40%','—'],['Hardness','—','92 HRB']]},
  '202':{chem:[['C','—','0.15'],['Mn','7.5','10.0'],['Si','—','1.00'],['P','—','0.060'],['S','—','0.030'],['Cr','17.0','19.0'],['Ni','4.0','6.0'],['N','—','0.25']],mech:[['Tensile strength','620 MPa','—'],['Yield strength (0.2%)','260 MPa','—'],['Elongation in 40 mm','40%','—'],['Hardness','—','241 HB']]}
};
function renderMtc(g){ $('#mtcG').textContent=g; const d=MTC[g];
  $('#mtcChem').innerHTML=`<caption>Chemical composition, % by weight</caption><thead><tr><th>Element</th><th>Min</th><th>Max</th><th>Reported</th></tr></thead><tbody>${d.chem.map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td class="rep">per heat</td></tr>`).join('')}</tbody>`;
  $('#mtcMech').innerHTML=`<caption>Mechanical properties</caption><thead><tr><th>Property</th><th>Min</th><th>Max</th><th>Reported</th></tr></thead><tbody>${d.mech.map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td class="rep">per heat</td></tr>`).join('')}</tbody>`;
  $$('#mtcGrade button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.g===g)); }
renderMtc('304');
$('#mtcGrade').addEventListener('click',e=>{ const b=e.target.closest('[data-g]'); if(b) renderMtc(b.dataset.g); });
$('#openMtc').addEventListener('click',()=>{ const d=$('#mtc'); try{ d.showModal(); }catch(e){ d.setAttribute('open',''); } lenis&&lenis.stop(); });
$('#closeMtc').addEventListener('click',()=>$('#mtc').close());
$('#mtc').addEventListener('close',()=>{ lenis&&lenis.start(); });
$('#mtc').addEventListener('click',e=>{ if(e.target.id==='mtc') $('#mtc').close(); });

/* ---------- Ticker ---------- */
const TK = ['19 OD','22 OD','3/4″','1″','3″','60 × 60','40 × 20','25 × 12','40 × 10','20 × 10','D section','Oval','Capsule','SS 304','SS 202'];
const tkShapes = ['round','square','rect:40:20','d','oval','capsule'];
function fillTicker(el, offset){ const items = TK.map((t,i)=>`<span class="tk-item">${t}${glyph(tkShapes[(i+offset)%tkShapes.length])}</span>`).join(''); el.innerHTML = items+items; }
fillTicker($('#tkA'),0); fillTicker($('#tkB'),3);

/* ---------- Story data ---------- */
const PROFILES = [
  {key:'round', name:'Round', desc:'The everyday section. Railings, furniture frames, curtain fittings and general fabrication.', sizes:'19 OD, 22 OD, 22 mm, 3/4″, 1″, 3″', from:120, grade:'202, 304'},
  {key:'square', name:'Square', desc:'Flat faces and crisp corners for gates, grills, frames and structural trim.', sizes:'3 × 3, 60 × 60 mm', from:140, grade:'202, 304'},
  {key:'rect', name:'Rectangular', desc:'Slim sections for door frames, partitions, shelving and furniture.', sizes:'20 × 10, 25 × 12, 40 × 10, 40 × 20 mm', from:120, grade:'On request'},
  {key:'d', name:'D-shape', desc:'Flat on one side and round on the other. Used as handrail caps and edge trim.', sizes:'D shape, D section', from:150, grade:'304 listed'},
  {key:'oval', name:'Oval', desc:'Softer sections for handles, railings and decorative work. Capsule profile also listed.', sizes:'Oval, capsule', from:140, grade:'On request'},
];
const glyphKey = {round:'round',square:'square',rect:'rect:40:20',d:'d',oval:'oval'};
$('#pIndex').innerHTML = PROFILES.map((p,i)=>`<li><button type="button" data-p="${i}">${glyph(glyphKey[p.key])}${p.name}</button></li>`).join('');
let pActive = -1;
function setProfile(i, animate=true){
  if(i===pActive) return; const p=PROFILES[i]; const prev=pActive; pActive=i;
  $('#pNum').textContent=i+1; $('#pRead').textContent=p.name.toUpperCase();
  $('#pDesc').textContent=p.desc; $('#pSizes').textContent=p.sizes; $('#pGrade').textContent=p.grade;
  $('#pPrice').innerHTML=`${fmt(p.from)}<small>/kg</small>`;
  const link=$('#pLink'); link.firstChild.textContent=`See ${p.name.toLowerCase()} pipes in the catalogue `; link.dataset.cat=p.key;
  $$('#pIndex button').forEach((b,j)=>b.classList.toggle('on',j===i));
  const el=$('#pName');
  if(animate && window.gsap && !reduceMotion && prev>=0){
    const dir = i>prev?1:-1; gsap.killTweensOf([el,'#pDesc','#pSizes','#pPrice','#pGrade']);
    gsap.to(el,{yPercent:-110*dir,opacity:0,duration:.22,ease:'power2.in',onComplete(){ el.textContent=p.name; gsap.fromTo(el,{yPercent:110*dir,opacity:0},{yPercent:0,opacity:1,duration:.55,ease:'power3.out'}); }});
    gsap.fromTo(['#pDesc','#pSizes','#pPrice','#pGrade'],{opacity:.2,y:8},{opacity:1,y:0,duration:.6,stagger:.04,ease:'power2.out'});
  } else el.textContent=p.name;
}
setProfile(0,false);
let fActive=0;
function setStep(i){ if(i===fActive) return; fActive=i; $$('#fSteps li').forEach((li,j)=>li.classList.toggle('on',j===i)); }
$('#pLink').addEventListener('click',e=>{ e.preventDefault(); setCategory(e.currentTarget.dataset.cat||'all'); go('#catalogue'); });
$('#pIndex').addEventListener('click',e=>{ const b=e.target.closest('[data-p]'); if(!b) return; const i=+b.dataset.p; const s=$('#profiles'); const top=s.getBoundingClientRect().top+scrollY; const span=s.offsetHeight-innerHeight;
  go(top+span*Math.min(.97,.06+.86*(i/4))); });

renderChips(); renderGrid(); renderList();

/* ---------- Payment section ---------- */
const PAY_IC={
  intl:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.6 2.6 3.8 5.6 3.8 9s-1.2 6.4-3.8 9c-2.6-2.6-3.8-5.6-3.8-9S9.4 5.6 12 3z"/></svg>',
  bank:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M3 9.5L12 4l9 5.5M4.5 10v8M9 10v8M15 10v8M19.5 10v8M3 20.5h18"/></svg>',
  online:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="6.5" y="2.5" width="11" height="19" rx="2"/><path d="M10.5 18.5h3M9.5 10.5l2 2 3.5-4"/></svg>',
  cash:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="2.5" y="6.5" width="19" height="11" rx="1.5"/><circle cx="12" cy="12" r="2.6"/><path d="M5.5 9.5v5M18.5 9.5v5"/></svg>',
  cheque:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="2.5" y="5.5" width="19" height="13" rx="1.5"/><path d="M5.5 10h7M5.5 14.5h4M14 15l1.6-1.6 1.4 1 2.5-2.9"/></svg>'};
const arrowSm='<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 8h11M9 4l4 4-4 4"/></svg>';
$('#payGrid').innerHTML=PAYMENT.map(m=>`<article class="pay-card glass"><span class="pay-ic">${PAY_IC[m.icon]||PAY_IC.bank}</span><h3><span class="metal">${esc(m.name)}</span></h3><p>${esc(m.detail)}</p><span class="ok-tag">Accepted</span><button class="pay-open" type="button" data-pay="${m.icon}">View details ${arrowSm}</button></article>`).join('');
{ const names=PAYMENT.map(m=>m.name.toLowerCase()); const list=names.length>1?names.slice(0,-1).join(', ')+' or '+names[names.length-1]:names[0]||'';
  const cap=list.charAt(0).toUpperCase()+list.slice(1);
  $('#platePay').textContent=cap.replace(' or ',', '); $('#routePay').textContent=cap+'.';
  $('#payCount').textContent=`${['No','One','Two','Three','Four','Five','Six','Seven','Eight'][PAYMENT.length]||PAYMENT.length} accepted ${PAYMENT.length===1?'method':'methods'}.`;
  $('#payment .lede').textContent='Rates and payment terms are confirmed with your quote.'; }

/* ---------- Payment details sheet ---------- */
(()=>{
  const ps=$('#ps'), tabs=$('#psTabs'), body=$('#psBody'); let curM=null;
  const logo='<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M52 8H22L8 22V31L38 43H20V56H42L56 42V33L26 21H52Z" fill="#25262a"/><path d="M22 8H52V12H24L12 24V29L8 31V22Z" fill="#87939e"/><path d="M20 52H40L52 40V35L56 33V42L42 56H20Z" fill="#65717c"/></svg>';
  const warn='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 3l9.5 17h-19z"/><path d="M12 10v4.5M12 17.5v.5"/></svg>';
  const payee=esc(PAY_DETAILS.payee);
  const B=PAY_DETAILS.bank, haveDomestic=Boolean(B.accountNumber&&B.ifsc), haveIntl=Boolean(B.swift&&B.accountNumber);
  const IM='https://www.indiamart.com/sai-metal-tube/enquiry.html';
  const field=(label,val)=>{ const v=String(val||'').trim(); return v?`<div class="bf"><dt>${label}</dt><dd>${esc(v)}</dd><button class="cp" type="button" data-copy="${esc(v)}" aria-label="Copy ${label}">Copy</button></div>`
    :`<div class="bf pend"><dt>${label}</dt><span class="lockchip"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="3" y="7" width="10" height="7" rx="1.2"/><path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2"/></svg>With your quote</span></div>`; };
  const reqBox=(intl)=>(intl?haveIntl:haveDomestic)?'':`<div class="bank-req"><p>For your security, ${intl?'wire':'account'} details are sent with your ${intl?'proforma invoice':'quote'} and confirmed by phone.</p><a class="btn btn-copper" href="${IM}" target="_blank" rel="noopener noreferrer">Request ${intl?'wire':'bank'} details</a></div>`;
  const ST={available:'Accepted',soon:'Coming soon',request:'On request'};
  const VIEWS={
    bank:()=>`<div class="ps-pane">
      <div class="ps-copy">
        <h3><span class="metal">Bank transfer.</span> <span class="cu">Direct to our account.</span></h3>
        <p>Pay the amount on your quote straight to our business account by NEFT, RTGS or IMPS. International buyers can pay by SWIFT wire.</p>
        <ol class="ps-steps"><li>Get your quote with the final amount, including GST and transport.</li><li>Transfer to the account shown here.</li><li>Send us the transaction reference (UTR) so we can match your payment.</li></ol>
        <div class="ps-note">${warn}<span><b>Check before you pay.</b> Confirm these account details with us by phone before your first transfer. We will never ask you to pay into a different account by message or email.</span></div>
        <p class="ps-msg" id="psMsg" role="status"></p>
      </div>
      <div class="ps-visual">
        <div class="bankcard">
          <div class="bankcard-h"><span>Beneficiary account</span><i class="bchip"></i></div>
          <dl>${field('Account name',B.accountName)}${field('Bank',B.bankName)}${field('Account number',B.accountNumber)}${field('IFSC',B.ifsc)}${field('Branch',B.branch)}${field('Account type',B.accountType)}</dl>${reqBox(false)}
        </div>
      </div></div>`,
    intl:()=>`<div class="ps-pane">
      <div class="ps-copy">
        <h3><span class="metal">Buying from abroad.</span> <span class="cu">Pay by SWIFT wire.</span></h3>
        <p>Order from outside India with an international bank transfer. Prices on this site can be shown in your currency for reference. Your proforma invoice confirms the final amount and currency.</p>
        <ol class="ps-steps"><li>Send sizes, grades, quantities and your delivery city, country or port.</li><li>Receive a proforma invoice with the final amount and agreed shipping terms.</li><li>Pay by SWIFT wire to our account. Your bank may add its own transfer charges.</li><li>Share the SWIFT confirmation (MT103) so we can match your payment.</li></ol>
        <div class="ps-note">${warn}<span><b>Check before you pay.</b> Confirm the wire details with us by phone or video call before your first payment. We will never change our bank account by email.</span></div>
        <p class="ps-msg" id="psMsg" role="status"></p>
      </div>
      <div class="ps-visual">
        <div class="bankcard">
          <div class="bankcard-h"><span>International wire · SWIFT</span><i class="bchip"></i></div>
          <dl>${field('Beneficiary name',B.accountName)}${field('Beneficiary bank',B.bankName)}${field('Account number',B.accountNumber)}${field('SWIFT / BIC',B.swift)}${field('Bank address',B.bankAddress)}${field('Intermediary bank',[B.intermediaryBank,B.intermediarySwift].filter(Boolean).join(' · '))}</dl>${reqBox(true)}
        </div>
        <div class="fx">${Object.entries(CURRENCIES).filter(([k])=>k!=='INR').map(([k,c])=>`<div><b>1 ${k}</b><span>₹${c.rate.toFixed(2)}</span></div>`).join('')}</div>
        <p class="fx-note">Reference rates, ${FX_DATE}. Your bank’s rate on the day of payment applies.</p>
      </div></div>`,
    online:()=>`<div class="ps-pane">
      <div class="ps-copy">
        <h3><span class="metal">Pay online.</span> <span class="cu">From your bank or app.</span></h3>
        <p>Use net banking or your bank’s mobile app to pay by any of the methods marked accepted. Account details are under Bank transfer.</p>
        <ol class="ps-steps"><li>Get your quote with the final amount.</li><li>Choose a method below and pay to our account.</li><li>Share the transaction reference (UTR) with us so we can match your payment.</li></ol>
        <div class="ps-actions"><button class="btn btn-line" type="button" data-go="bank">See bank details</button></div>
      </div>
      <div class="ps-visual"><div class="om">${PAY_DETAILS.online.map(o=>`<div><b>${esc(o.name)}</b><p>${esc(o.desc)}</p><span class="st ${o.status}">${ST[o.status]||''}</span></div>`).join('')}</div></div></div>`,
    cash:()=>`<div class="ps-pane">
      <div class="ps-copy">
        <h3><span class="metal">Buy in person.</span> <span class="cu">Pay in cash.</span></h3>
        <p>Prefer to see the material first? Buy offline at our Ahmedabad unit, pay in cash and take a proper receipt that lists every item, grade, weight and amount.</p>
        <ol class="ps-steps"><li>Contact us for our address and timings.</li><li>Check the material, sizes and weight before you pay.</li><li>Pay in cash and collect your receipt with our GSTIN.</li></ol>
        <div class="ps-note">${warn}<span><b>Cash limit.</b> Under section 269ST of the Income Tax Act, cash of ₹2 lakh or more cannot be accepted for one order or from one person in a day. Larger orders are paid by bank transfer or cheque.</span></div>
      </div>
      <div class="ps-visual"><div class="receipt">
        <span class="stamp">EXAMPLE</span>
        <div class="rc-h">${logo}<b>SAI METAL AND TUBE</b><span>AHMEDABAD · GUJARAT</span><span>GSTIN 24ACVPN8610Q1ZQ</span></div>
        <div class="rc-t">CASH RECEIPT</div>
        <div class="rc-meta"><span>No. ——</span><span>Date ——</span></div>
        <table><thead><tr><th>Item</th><th>Qty</th><th>Rate</th><th>Amount</th></tr></thead><tbody>
          <tr><td>SS pipe, 22 OD<small>Stainless steel, round</small></td><td>50 kg</td><td>₹140</td><td>₹7,000</td></tr>
          <tr><td>SS waste coupling<small>Full thread</small></td><td>20 pcs</td><td>₹45</td><td>₹900</td></tr></tbody></table>
        <div class="rc-tot"><div><span>Subtotal</span><span>₹7,900</span></div><div><span>GST</span><span>as applicable</span></div><div class="g"><span>Paid by</span><span>CASH</span></div></div>
        <div class="rc-f">Thank you for your business.</div>
      </div></div></div>`,
    cheque:()=>`<div class="ps-pane">
      <div class="ps-copy">
        <h3><span class="metal">Pay by cheque.</span> <span class="cu">Filled in like this.</span></h3>
        <p>Make your cheque out exactly as shown so it clears without delay.</p>
        <ol class="ps-steps"><li><span>Pay to <b style="color:var(--platinum)">${payee}</b>.</span></li><li>Cross it “A/c Payee only” in the top-left corner.</li><li>Write the amount from your invoice in words and in figures.</li><li>Write your quote or invoice number and phone number on the back.</li><li>Hand it over in person or send it by courier. We confirm once it clears.</li></ol>
        <div class="ps-actions"><button class="btn btn-line" type="button" data-copy="${payee}">Copy payee name</button></div>
        <p class="ps-msg" id="psMsg" role="status"></p>
      </div>
      <div class="ps-visual"><div class="cheque" role="img" aria-label="Example cheque made out to ${payee}, crossed A/c Payee only">
        <div class="cq-cross"><span>A/C PAYEE ONLY</span></div>
        <div class="cq-bank">YOUR BANK</div>
        <div class="cq-date"><i>D</i><i>D</i><i>M</i><i>M</i><i>Y</i><i>Y</i><i>Y</i><i>Y</i></div>
        <div class="cq-line cq-pay">PAY <em>${payee}</em></div>
        <div class="cq-line cq-amt">RUPEES <em>amount as per invoice</em></div>
        <div class="cq-box">₹</div>
        <div class="cq-sign">Authorised signatory</div>
        <div class="cq-micr">⑈ —————— ⑈ ————————— ⑆ —————— ⑈</div>
        <div class="cq-wm">EXAMPLE</div>
      </div></div></div>`,
  };
  tabs.innerHTML=[...PAYMENT.map(m=>[m.icon,m.name]),['intl','International']].map(([k,n])=>`<button type="button" role="tab" data-m="${k}" aria-selected="false">${PAY_IC[k]||''}${esc(n)}</button>`).join('');
  function show(m){ if(!VIEWS[m]) m='bank'; curM=m; $$('button',tabs).forEach(b=>b.setAttribute('aria-selected',b.dataset.m===m)); body.innerHTML=VIEWS[m](); body.scrollTop=0; }
  function open(m){ show(m); try{ ps.showModal(); }catch(e){ ps.setAttribute('open',''); } lenis&&lenis.stop(); $(`button[data-m="${curM}"]`,tabs)?.focus(); }
  tabs.addEventListener('click',e=>{ const b=e.target.closest('[data-m]'); if(b) show(b.dataset.m); });
  tabs.addEventListener('keydown',e=>{ if(e.key!=='ArrowRight'&&e.key!=='ArrowLeft') return; const bs=$$('button',tabs), i=bs.findIndex(b=>b.dataset.m===curM); const n=bs[(i+(e.key==='ArrowRight'?1:-1)+bs.length)%bs.length]; show(n.dataset.m); n.focus(); });
  body.addEventListener('click',e=>{ const g=e.target.closest('[data-go]'); if(g){ show(g.dataset.go); return; }
    const c=e.target.closest('[data-copy]'); if(!c) return; const v=c.dataset.copy, msg=$('#psMsg');
    const done=()=>{
      if(msg) msg.textContent=`Copied: ${v}`;
      const o=c.dataset.origText||c.textContent; c.dataset.origText=o; c.textContent='Copied';
      clearTimeout(c._t); c._t=setTimeout(()=>c.textContent=o,1400);
    };
    try{ navigator.clipboard.writeText(v).then(done,()=>{ if(msg) msg.textContent=v; }); }catch(err){ if(msg) msg.textContent=v; } });
  $('#psClose').addEventListener('click',()=>ps.close());
  ps.addEventListener('click',e=>{ if(e.target===ps) ps.close(); });
  ps.addEventListener('close',()=>{ lenis&&lenis.start(); });
  $('#payment').addEventListener('click',e=>{ const b=e.target.closest('[data-pay]'); if(b) open(b.dataset.pay); });
  window.__psShow=()=>{ if(ps.open&&curM) show(curM); };
  const fromHash=()=>{ const m=/^#pay-(bank|online|cash|cheque|intl)$/.exec(location.hash); if(m) open(m[1]); };
  addEventListener('hashchange',fromHash); fromHash();
})();

/* ---------- Region / currency menu ---------- */
function renderStatic(){
  $$('[data-inr]').forEach(el=>{ const [a,b]=el.dataset.inr.split('-').map(Number); el.textContent=(b?`${fmt(a)}–${fmt(b)}`:fmt(a))+(el.dataset.sfx||''); });
  $('#catFx').textContent = CUR==='INR' ? 'Rates listed 10 Oct 2026 · confirm before ordering' : `Shown in ${CUR} at approximate ${FX_DATE} rates · listed in INR on 10 Oct 2026`;
  $('#rgCode').textContent = `${CURRENCIES[CUR].sym==='AED'||CURRENCIES[CUR].sym==='SAR'?'':CURRENCIES[CUR].sym+' '}${CUR}`;
  $('#rgMenu').innerHTML = Object.entries(CURRENCIES).map(([k,c])=>`<button type="button" role="menuitemradio" aria-checked="${k===CUR}" data-cur="${k}"><span class="nm">${c.region}</span><span class="cd">${k}</span><span class="rt">${k==='INR'?'Prices as listed':`1 ${k} ≈ ₹${c.rate.toFixed(2)}`}</span></button>`).join('')
    + `<p class="rg-foot">Approximate rates of ${FX_DATE}, for reference. Your quote or proforma invoice confirms the final amount.</p>`;
  $('#piCur').innerHTML = Object.keys(CURRENCIES).map(k=>`<button type="button" data-cur="${k}" aria-pressed="${k===CUR}">${k}</button>`).join('');
}
function setCurrency(k){ if(!CURRENCIES[k]||k===CUR) return; CUR=k; try{ localStorage.setItem('smt-cur',k); }catch(e){}
  renderGrid(); renderRail(); const i=pActive; pActive=-1; setProfile(Math.max(0,i),false); renderList(); runCalc(); renderStatic(); window.__psShow&&window.__psShow(); }
(()=>{ const rg=$('#rg'), btn=$('#rgBtn');
  const close=()=>{ rg.classList.remove('open'); btn.setAttribute('aria-expanded','false'); };
  btn.addEventListener('click',e=>{ e.stopPropagation(); const o=!rg.classList.contains('open'); rg.classList.toggle('open',o); btn.setAttribute('aria-expanded',o); if(o) $('#rgMenu [aria-checked="true"]')?.focus(); });
  document.addEventListener('click',e=>{ const c=e.target.closest('[data-cur]'); if(c){ setCurrency(c.dataset.cur); if(c.closest('#rgMenu')){ close(); btn.focus(); } return; } if(!e.target.closest('#rg')) close(); });
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'&&rg.classList.contains('open')){ close(); btn.focus(); }
    else if(rg.classList.contains('open')&&(e.key==='ArrowDown'||e.key==='ArrowUp')){
      e.preventDefault();
      const items=$$('button[data-cur]',rg);
      const idx=items.indexOf(document.activeElement);
      const next=items[(idx+(e.key==='ArrowDown'?1:-1)+items.length)%items.length];
      next?.focus();
    }
  });
})();
renderStatic(); if(CUR!=='INR'){ renderGrid(); runCalc(); renderList(); const i=pActive; pActive=-1; setProfile(Math.max(0,i),false); }

/* ---------- Dark / light theme ---------- */
(()=>{ const btn=$('#themeBtn'), html=document.documentElement;
  const label=()=>btn.setAttribute('aria-label', html.classList.contains('light')?'Switch to dark theme':'Switch to light theme');
  label();
  btn.addEventListener('click',()=>{ const toLight=!html.classList.contains('light');
    const apply=()=>{ html.classList.toggle('light',toLight); try{ localStorage.setItem('smt-theme',toLight?'light':'dark'); }catch(e){} const m=document.querySelector('meta[name="theme-color"]'); if(m) m.setAttribute('content', toLight ? '#E7EAEE' : '#07080B'); label(); window.__bgSetDay&&window.__bgSetDay(toLight); window.__bgDraw&&window.__bgDraw(); };
    if(document.startViewTransition && !reduceMotion){ const r=btn.getBoundingClientRect(), x=r.left+r.width/2, y=r.top+r.height/2, R=Math.hypot(Math.max(x,innerWidth-x),Math.max(y,innerHeight-y));
      const vt=document.startViewTransition(apply);
      vt.ready.then(()=>html.animate({clipPath:[`circle(0px at ${x}px ${y}px)`,`circle(${R}px at ${x}px ${y}px)`]},{duration:750,easing:'cubic-bezier(.76,0,.24,1)',pseudoElement:'::view-transition-new(root)'})).catch(()=>{});
    } else apply(); });
})();

/* ---------- Category rail ---------- */
const REP={round:'p0',square:'p13',rect:'p16',d:'p18',oval:'p22',curtain:'p23',wiper:'p28',coupling:'p31',bar:'p34',kitchen:'p44'};
const arrow='<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 8h11M9 4l4 4-4 4"/></svg>';
function renderRail(){ $('#catRail').innerHTML=CATS.slice(1).map(([k,l])=>{ const ps=P.filter(p=>p.cat===k), pr=ps.filter(p=>p.price), rep=pById(REP[k])||ps[0];
  const min=pr.length?pr.reduce((a,b)=>b.price<a.price?b:a):null;
  return `<button class="tile" type="button" data-tile="${k}"><span class="t-top"><span>${ps.length} ${ps.length===1?'product':'products'}</span></span>
    <span class="t-img"><img data-rail="${rep.id}" alt="" ${THUMBS[rep.id]?`class="on" src="${THUMBS[rep.id].a}"`:''}><span class="ph">${glyph(rep.shape)}</span></span>
    <span><h3>${l}</h3><span class="t-meta">${min?`from ${fmt(min.price)}/${min.unit}`:'Price on request'}</span></span><span class="t-go">${arrow}</span></button>`; }).join(''); }
renderRail();
(()=>{ const rail=$('#catRail'); let down=null, moved=false;
  rail.addEventListener('click',e=>{ if(moved){ e.preventDefault(); return; } const t=e.target.closest('[data-tile]'); if(!t) return; setCategory(t.dataset.tile); go('#catTools'); });
  if(finePointer){
    let activeTile = null, tileRect = null;
    addEventListener('pointermove',e=>{
      if(down){
        const dx=e.clientX-down.x;
        if(Math.abs(dx)>5){ moved=true; rail.classList.add('dragging'); }
        if(moved) rail.scrollLeft=down.s-dx;
        return;
      }
      const t = e.target ? e.target.closest('#catRail .tile') : null;
      if (!t) {
        if (activeTile) { activeTile.style.transform = ''; activeTile = null; tileRect = null; }
        return;
      }
      if (t !== activeTile) {
        if (activeTile) activeTile.style.transform = '';
        activeTile = t;
        tileRect = t.getBoundingClientRect();
      }
      if (!tileRect) tileRect = t.getBoundingClientRect();
      const mx = e.clientX - tileRect.left;
      const my = e.clientY - tileRect.top;
      t.style.setProperty('--tx', mx + 'px');
      t.style.setProperty('--ty', my + 'px');
      if (!reduceMotion) {
        const x = mx / (tileRect.width || 1);
        const y = my / (tileRect.height || 1);
        t.style.transform = `perspective(800px) rotateY(${(x - .5) * 8}deg) rotateX(${(-y + .5) * 6}deg) translateY(-4px)`;
      }
    }, { passive: true });
    rail.addEventListener('pointerleave', () => {
      if (activeTile) { activeTile.style.transform = ''; activeTile = null; }
      tileRect = null;
    });
    addEventListener('pointerdown',e=>{ if(e.button!==0) return; down={x:e.clientX,s:rail.scrollLeft}; moved=false; });
    addEventListener('pointerup',()=>{ if(!down) return; down=null; rail.classList.remove('dragging'); setTimeout(()=>moved=false,0); });
  }
  const step=()=>(rail.querySelector('.tile')?.offsetWidth||260)*2+28;
  $('#railPrev').onclick=()=>rail.scrollBy({left:-step(),behavior:reduceMotion?'auto':'smooth'});
  $('#railNext').onclick=()=>rail.scrollBy({left:step(),behavior:reduceMotion?'auto':'smooth'});
})();

/* ---------- Heading words: split once, revealed on scroll ---------- */
const wordWrap=(t,cls)=>t.split(/(\s+)/).map(w=>!w||/^\s+$/.test(w)?w:`<span class="w"><span class="wi${cls?' '+cls:''}">${esc(w)}</span></span>`).join('');
const splitHeads=$$('.sec-head h2, .co-copy h2, .enq h2, .f-title');
if(!reduceMotion) splitHeads.forEach(h=>{ h.setAttribute('aria-label',h.textContent.replace(/\s+/g,' ').trim());
  h.innerHTML=[...h.childNodes].map(n=>n.nodeType===3?wordWrap(n.textContent,''):n.nodeType===1?wordWrap(n.textContent,n.className):'').join(''); });

/* ---------- Custom pointer: copper dot, lagging ring ---------- */
const POINTER={x:-500,y:-500,on:false};
addEventListener('pointermove',e=>{ POINTER.x=e.clientX; POINTER.y=e.clientY; POINTER.on=true; },{passive:true});
document.addEventListener('pointerleave',()=>{ POINTER.on=false; });
if(finePointer && !reduceMotion){ document.documentElement.classList.add('has-cur');
  const ring=$('#cur'), dot=$('#curDot'), lbl=$('#curLbl'); let rx=-500,ry=-500, sc=1, tsc=1;
  addEventListener('pointerover',e=>{ const t=e.target; let mode='', text='';
    if(t.closest('#catRail .tile')){ mode='lbl'; text='Explore'; }
    else if(t.closest('#catRail')){ mode='lbl'; text='Drag'; }
    else if(t.closest('.card .fig')){ mode='lbl'; text='View'; }
    else if(t.closest('input,textarea,select')){ mode='text'; }
    else if(t.closest('a,button,label,.card,.pay-card,.use,.cp')){ mode='big'; }
    ring.classList.toggle('lbl',mode==='lbl'); ring.classList.toggle('big',mode==='big'); lbl.textContent=text;
    const txt=mode==='text'; ring.classList.toggle('hide',txt); dot.classList.toggle('hide',txt); });
  addEventListener('pointerdown',()=>{ tsc=.82; }); addEventListener('pointerup',()=>{ tsc=1; });
  const isModal=d=>{ try{ return d.open && (d.matches(':modal') || d.hasAttribute('open')); }catch(e){ return d.open; } };
  const curEls=[ring,dot];
  const rehome=()=>{ const open=[...document.querySelectorAll('dialog')].filter(isModal).pop(); const host=open||document.body;
    curEls.forEach(el=>{ if(el&&el.parentNode!==host) host.appendChild(el); }); };
  const mo=new MutationObserver(rehome); document.querySelectorAll('dialog').forEach(d=>{ mo.observe(d,{attributes:true,attributeFilter:['open']}); d.addEventListener('close',rehome); });
  document.addEventListener('pointerleave',()=>{ ring.classList.add('hide'); dot.classList.add('hide'); });
  document.addEventListener('pointerenter',()=>{ ring.classList.remove('hide'); dot.classList.remove('hide'); });
  let lastCurX = -999, lastCurY = -999, lastCurSc = -1;
  (function loop(){
    if(POINTER.on){
      const x=POINTER.x, y=POINTER.y;
      rx+=(x-rx)*.25; ry+=(y-ry)*.25; sc+=(tsc-sc)*.3;
      if(Math.abs(rx - lastCurX) > 0.1 || Math.abs(ry - lastCurY) > 0.1 || Math.abs(sc - lastCurSc) > 0.002){
        lastCurX = rx; lastCurY = ry; lastCurSc = sc;
        ring.style.transform=`translate3d(${rx.toFixed(1)}px,${ry.toFixed(1)}px,0) scale(${sc.toFixed(3)})`;
        dot.style.transform=`translate3d(${x}px,${y}px,0)`;
      }
    }
    requestAnimationFrame(loop);
  })();
}

/* ---------- Background: a brushed stainless sheet under a moving studio light ---------- */
(function background(){
  const cv=$('#bg'); let gl=null;
  try{ gl=cv.getContext('webgl',{antialias:false,alpha:false,powerPreference:'low-power'}); }catch(e){}
  if(!gl){ cv.style.display='none'; document.documentElement.classList.add('no-bg'); return; }
  const vs='attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
  const fs=`#ifdef GL_FRAGMENT_PRECISION_HIGH
  precision highp float;
  #else
  precision mediump float;
  #endif
  uniform vec2 uRes; uniform float uTime, uScroll, uDay; uniform vec2 uLight; uniform vec3 uWarm, uCool;
  float h(vec2 p){ p=fract(p*vec2(123.34,456.21)); p+=dot(p,p+45.32); return fract(p.x*p.y); }
  float n(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
    return mix(mix(h(i),h(i+vec2(1.,0.)),f.x),mix(h(i+vec2(0.,1.)),h(i+vec2(1.,1.)),f.x),f.y); }
  void main(){
    vec2 fc=gl_FragCoord.xy, uv=fc/uRes; float asp=uRes.x/uRes.y;
    float y=fc.y-uScroll*.55;
    /* brushing: fine streaks running horizontally, the way a polished sheet is finished */
    float s=n(vec2(fc.x*.0035,y*.85))*.5+n(vec2(fc.x*.011,y*2.4))*.3+n(vec2(fc.x*.0012,y*.22))*.2;
    float fine=n(vec2(fc.x*.05,y*6.))*.5+.5;
    vec3 col=mix(vec3(.026,.029,.037),vec3(.085,.092,.11),s);
    /* anisotropic highlight: on brushed steel a light becomes a vertical streak across the grain */
    vec2 d=(fc-uLight)/uRes;
    float core=exp(-d.x*d.x*160.)*exp(-d.y*d.y*1.2);
    float halo=exp(-d.x*d.x*12.)*exp(-d.y*d.y*.8);
    float sweep=exp(-pow((uv.x-(.5+.48*sin(uTime*.06)))*5.,2.))*.45;
    float lum=(core*1.15+halo*.32+sweep*.5)*(.3+.95*s)*(.85+.3*fine);
    col+=vec3(.70,.74,.80)*lum*.24;
    /* warm and cool light pools, tinted per section */
    col+=uWarm*exp(-length((uv-vec2(.94,.06))*vec2(asp,1.))*1.5)*(.55+.45*s)*.42;
    col+=uCool*exp(-length((uv-vec2(.04,.96))*vec2(asp,1.))*1.9)*.22;
    /* vignette and film grain */
    col*=1.-.5*smoothstep(.35,1.25,length((uv-.5)*vec2(asp*.8,1.)));
    col+=(h(fc+fract(uTime*7.))-.5)*.018;
    /* daylight: brushed aluminium, darker grain, soft white highlight */
    vec3 day=mix(vec3(.80,.815,.845),vec3(.94,.947,.958),s);
    day+=vec3(1.)*lum*.16;
    day+=uWarm*exp(-length((uv-vec2(.94,.06))*vec2(asp,1.))*1.6)*.10;
    day+=uCool*exp(-length((uv-vec2(.04,.96))*vec2(asp,1.))*2.)*.07;
    day*=1.-.16*smoothstep(.4,1.3,length((uv-.5)*vec2(asp*.8,1.)));
    day+=(h(fc+fract(uTime*7.))-.5)*.02;
    col=mix(col,day,uDay);
    gl_FragColor=vec4(col,1.);
  }`;
  const sh=(t,src)=>{ const o=gl.createShader(t); gl.shaderSource(o,src); gl.compileShader(o); if(!gl.getShaderParameter(o,gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(o)); return o; };
  let pr; try{ pr=gl.createProgram(); gl.attachShader(pr,sh(gl.VERTEX_SHADER,vs)); gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,fs)); gl.linkProgram(pr); gl.useProgram(pr); }
  catch(e){ console.warn('bg',e); cv.style.display='none'; document.documentElement.classList.add('no-bg'); return; }
  const b=gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER,b); gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
  const loc=gl.getAttribLocation(pr,'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
  const U=k=>gl.getUniformLocation(pr,k), uRes=U('uRes'), uTime=U('uTime'), uScroll=U('uScroll'), uLight=U('uLight'), uWarm=U('uWarm'), uCool=U('uCool'), uDay=U('uDay');
  /* section tints: [warm rgb, cool rgb] */
  const TINT={home:[[.88,.43,.23],[.25,.32,.46]],making:[[1,.45,.18],[.30,.22,.18]],profiles:[[.45,.42,.48],[.30,.42,.62]],grades:[[.80,.40,.22],[.28,.34,.44]],
    catalogue:[[.85,.52,.26],[.24,.36,.62]],company:[[.70,.56,.44],[.30,.34,.42]],payment:[[.72,.40,.22],[.12,.42,.32]],enquire:[[.95,.45,.20],[.28,.32,.44]]};
  const ids=['making','profiles','grades','catalogue','company','payment','enquire'];
  let secTops=[], cachedTint=TINT.home, lastPickY=-9999;
  function updateSecTops(){
    secTops=ids.map(id=>{ const el=$('#'+id); return el?{id,top:el.offsetTop,bottom:el.offsetTop+el.offsetHeight}:null; });
    lastPickY=-9999;
  }
  const pick=()=>{
    const mid=scrollY+innerHeight*.5;
    if(Math.abs(mid - lastPickY) < 8) return cachedTint;
    lastPickY=mid;
    for(const s of secTops){ if(s&&mid>=s.top&&mid<s.bottom){ cachedTint=TINT[s.id]; return cachedTint; } }
    cachedTint=TINT.home; return cachedTint;
  };
  let W=0,H=0,DPR=1; const warm=[...TINT.home[0]], cool=[...TINT.home[1]], L={x:.66,y:.55};
  function resize(){ DPR=Math.min(devicePixelRatio||1, 1); W=innerWidth; H=innerHeight; cv.width=W*DPR; cv.height=H*DPR; gl.viewport(0,0,cv.width,cv.height); updateSecTops(); reqBgDraw(); }
  const t0=performance.now();
  let bgRunning=false;
  let isLight=document.documentElement.classList.contains('light');
  window.__bgSetDay=v=>{ isLight=v; reqBgDraw(); };
  function step(now){
    const tg=pick();
    let maxDiff=0;
    for(let i=0;i<3;i++){
      const dw=(tg[0][i]-warm[i])*.08, dc=(tg[1][i]-cool[i])*.08;
      warm[i]+=dw; cool[i]+=dc;
      maxDiff=Math.max(maxDiff,Math.abs(dw),Math.abs(dc));
    }
    const t=(now-t0)/1000;
    const tx = POINTER.on&&finePointer ? POINTER.x/W : .64+.22*Math.sin(t*.13);
    const ty = POINTER.on&&finePointer ? POINTER.y/H : .5+.12*Math.cos(t*.09);
    const dlx=(tx-L.x)*.1, dly=(ty-L.y)*.1;
    L.x+=dlx; L.y+=dly;
    maxDiff=Math.max(maxDiff,Math.abs(dlx),Math.abs(dly));

    gl.uniform2f(uRes,cv.width,cv.height); gl.uniform1f(uTime,t); gl.uniform1f(uScroll,scrollY*DPR);
    gl.uniform2f(uLight,L.x*cv.width,(1-L.y)*cv.height); gl.uniform3fv(uWarm,warm); gl.uniform3fv(uCool,cool); gl.uniform1f(uDay,isLight?1:0);
    gl.drawArrays(gl.TRIANGLES,0,3);

    if(maxDiff>0.0008 || (POINTER.on && finePointer)){
      requestAnimationFrame(step);
    } else {
      bgRunning=false;
    }
  }
  function reqBgDraw(){
    if(!bgRunning && !document.hidden){
      bgRunning=true;
      requestAnimationFrame(step);
    }
  }
  addEventListener('resize',resize); resize(); window.__bgDraw=reqBgDraw;
  addEventListener('scroll',reqBgDraw,{passive:true});
  if(finePointer) addEventListener('pointermove',reqBgDraw,{passive:true});
  document.addEventListener('visibilitychange',()=>{ if(!document.hidden) reqBgDraw(); });
  reqBgDraw();
})();

/* ---------- Smooth scroll, reveals, small interactions ---------- */
if(window.Lenis && !reduceMotion){
  try {
    lenis = new Lenis({
      duration: 1.05,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.5,
      infinite: false
    });
    document.documentElement.classList.add('has-lenis');
    if(window.ScrollTrigger){
      lenis.on('scroll', ScrollTrigger.update);
    }
    if(window.gsap && gsap.ticker){
      gsap.ticker.add(time => {
        lenis.raf(time * 1000);
      });
    } else {
      const raf = time => {
        lenis.raf(time);
        requestAnimationFrame(raf);
      };
      requestAnimationFrame(raf);
    }
  } catch(e) {
    console.warn('Lenis init failed:', e);
    lenis = null;
  }
}
function go(target){
  const off=-parseInt(getComputedStyle(document.documentElement).getPropertyValue('--hdr'))||-100;
  if(lenis){
    if(typeof target==='number'){ lenis.scrollTo(target,{offset:0,duration:reduceMotion?0:1.1}); }
    else { const el=document.querySelector(target); if(el) lenis.scrollTo(el,{offset:off,duration:reduceMotion?0:1.1}); }
    return;
  }
  if(typeof target==='number'){ scrollTo({top:target,behavior:reduceMotion?'auto':'smooth'}); }
  else {
    const el=document.querySelector(target);
    if(el){ const y = el.getBoundingClientRect().top + window.scrollY + off; scrollTo({top:y, behavior:reduceMotion?'auto':'smooth'}); }
  }
}
document.addEventListener('click',e=>{ const a=e.target.closest('a[href^="#"]'); if(!a||a.id==='pLink'||a.hasAttribute('data-close')) return; const h=a.getAttribute('href'); if(h.length<2) return; e.preventDefault(); go(h); });

const intro=$('#intro'); const t0=performance.now(); let introDone=false;
function heroIn(){ if(!window.gsap||reduceMotion) return;
  gsap.from('.hero h1 .line>span',{yPercent:80,opacity:.1,duration:1.2,stagger:.1,ease:'expo.out'});
  gsap.from(['.hero .eyebrow','.hero .lede','.hero-ctas','.hero-facts','.scroll-cue'],{y:22,opacity:.15,duration:1,stagger:.06,ease:'power3.out',delay:.1}); }
function finishIntro(){ if(introDone) return; introDone=true;
  if(intro){ intro.classList.add('done'); heroIn(); setTimeout(()=>{ try{intro.remove();}catch(e){} }, 700); } }
if(reduceMotion){ document.documentElement.classList.add('no-intro'); introDone=true; }
setTimeout(finishIntro, 50);

if(window.gsap){
  if(window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
  if(!reduceMotion && window.ScrollTrigger){
    $$('.sec-head > :not(h2), .grade, .calc, .co-copy > :not(h2), .plate-wrap, .enq > :not(h2), .tile, .pay-card').forEach(el=>gsap.from(el,{y:36,opacity:.25,duration:1.1,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 92%',once:true}}));
    splitHeads.forEach(h=>{ const w=$$('.wi',h); if(w.length) gsap.from(w,{yPercent:108,duration:1.15,ease:'power4.out',stagger:.045,scrollTrigger:{trigger:h,start:'top 88%',once:true}}); });
    { const lis=$$('#route li'), route=$('#route');
      ScrollTrigger.create({trigger:'#route',start:'top 78%',end:'bottom 55%',scrub:true,onUpdate(self){ route.style.setProperty('--p',self.progress); lis.forEach((li,i)=>li.classList.toggle('on',self.progress>=i/(lis.length-1)-.02)); }}); }
    $$('[data-count]').forEach(el=>{ const n=+el.dataset.count, o={v:0}; let lastVal=-1; gsap.to(o,{v:n,duration:1.6,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 92%',once:true},onUpdate(){const v=Math.round(o.v); if(v!==lastVal){lastVal=v; el.textContent=v;}}}); });
  }
}
if(!window.gsap||!window.ScrollTrigger||reduceMotion){ $$('#route li').forEach(li=>li.classList.add('on')); $('#route').style.setProperty('--p',1); }

/* company card tilt + sheen */
(()=>{ const pl=$('#plate'); if(!pl||!finePointer||reduceMotion) return;
  let r=null;
  pl.addEventListener('pointerenter',()=>{ r=pl.getBoundingClientRect(); });
  pl.addEventListener('pointermove',e=>{
    if(!r) r=pl.getBoundingClientRect();
    const x=(e.clientX-r.left)/(r.width||1), y=(e.clientY-r.top)/(r.height||1);
    pl.style.transform=`rotateY(${(x-.5)*10}deg) rotateX(${((.5-y)*8)}deg)`;
    pl.style.setProperty('--px',(x*100).toFixed(1)+'%');
    pl.style.setProperty('--py',(y*100).toFixed(1)+'%');
  });
  pl.addEventListener('pointerleave',()=>{ r=null; pl.style.transform=''; }); })();

/* header state, progress, nav indicator, ticker motion */
const topBar=$('#top'), progEl=$('#prog'), navLinks=$$('#nav a'), navSecs=navLinks.map(a=>$(a.getAttribute('href'))), navInd=$('#navInd');
const tk=[{el:$('#tkA'),x:0,dir:-1},{el:$('#tkB'),x:0,dir:1}];
let lastY=scrollY, tkVel=0, lastT=performance.now(), lastActive=-2;
let maxScrollCached=1, tkHalves=[1000,1000], navRanges=[], navIndMetrics=[];
function updateLayoutMetrics(){
  const vh=innerHeight;
  maxScrollCached=Math.max(1, document.documentElement.scrollHeight-vh);
  tkHalves=tk.map(r=>(r.el.scrollWidth/2)||1);
  navRanges=navSecs.map(s=>s?{top:s.offsetTop, bottom:s.offsetTop+s.offsetHeight}:null);
  navIndMetrics=navLinks.map(a=>({width:(a.offsetWidth-24)+'px', left:(a.offsetLeft+12)+'px'}));
  lastActive=-2;
}
addEventListener('resize', updateLayoutMetrics);
setTimeout(updateLayoutMetrics, 100);

let lastSolid = null, lastMin = null, tickerVisible = true;
const tickerWrap = $('.ticker-wrap') || $('.ticker') || $('#tkA')?.parentElement;
if(tickerWrap && window.IntersectionObserver){
  const obs = new IntersectionObserver(entries => {
    tickerVisible = entries[0].isIntersecting;
  }, { threshold: 0 });
  obs.observe(tickerWrap);
}

function ui(now){
  const dt=Math.min(.05,(now-lastT)/1000); lastT=now;
  const y=scrollY;
  const isSolid = y > 30;
  if(isSolid !== lastSolid){
    lastSolid = isSolid;
    topBar.classList.toggle('solid', isSolid);
  }
  const isMin = y > 140;
  if(isMin !== lastMin){
    lastMin = isMin;
    document.documentElement.classList.toggle('hdr-min', isMin);
  }
  if(y !== lastY){
    progEl.style.transform=`scaleX(${maxScrollCached>0?y/maxScrollCached:0})`;
    const mid=y+innerHeight*.5;
    let active=-1;
    for(let i=0;i<navRanges.length;i++){
      const nr=navRanges[i];
      if(nr && mid>=nr.top && mid<nr.bottom){ active=i; break; }
    }
    if(active!==lastActive){
      lastActive=active;
      navLinks.forEach((a,i)=>a.classList.toggle('on',i===active));
      if(active>=0 && navIndMetrics[active]){
        navInd.style.width=navIndMetrics[active].width;
        navInd.style.transform=`translateX(${navIndMetrics[active].left})`;
        navInd.style.opacity=1;
      } else navInd.style.opacity=0;
    }
  }
  const v = y - lastY; lastY=y;
  tkVel += (Math.max(-60,Math.min(60,v||0)) - tkVel)*.08;
  if(!reduceMotion && tickerVisible) for(let i=0;i<tk.length;i++){
    const r=tk[i], half=tkHalves[i]||1;
    r.x += (40 + Math.abs(tkVel)*14)*dt*r.dir*(tkVel<-.5?-1:1);
    if(r.x<-half) r.x+=half; if(r.x>0) r.x-=half;
    r.el.style.transform=`translate3d(${r.x.toFixed(1)}px,0,0)`;
  }
  requestAnimationFrame(ui);
}
requestAnimationFrame(ui);
addEventListener('resize', ()=>{ lastActive = -2; });

/* ======================================================================
   3D STAGE
   ====================================================================== */
(function stage(){
  const canvas=$('#stage');
  let ok=false; try{ ok=!!window.THREE && !!(canvas.getContext('webgl2')||canvas.getContext('webgl')); }catch(e){}
  if(!ok){ document.documentElement.classList.add('no-gl'); canvas.style.display='none'; driveStoriesOnly(); finishIntro(); return; }
  const T=THREE, PI=Math.PI;
  const renderer=new T.WebGLRenderer({canvas,antialias:true,alpha:true,powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(devicePixelRatio||1, 1.25));
  renderer.toneMapping=T.ACESFilmicToneMapping; renderer.toneMappingExposure=1.05;
  renderer.outputColorSpace=T.SRGBColorSpace;
  const scene=new T.Scene();
  const CAMZ=14, camera=new T.PerspectiveCamera(30,1,.1,100); camera.position.set(0,0,CAMZ);

  /* High-contrast studio: sharp white key, cool silver rim, charcoal everywhere else */
  function buildEnv(r){
    const env=new T.Scene();
    env.add(new T.Mesh(new T.BoxGeometry(24,14,24),new T.MeshBasicMaterial({color:0x07080b,side:T.BackSide})));
    const strip=(w,hh,col,k,p)=>{const m=new T.Mesh(new T.PlaneGeometry(w,hh),new T.MeshBasicMaterial({color:new T.Color(col).multiplyScalar(k),side:T.DoubleSide}));m.position.set(...p);m.lookAt(0,0,0);env.add(m);};
    strip(16,1.4,'#ffffff',6,[0,6.6,1]);          // overhead softbox
    strip(.9,10,'#ffffff',8,[-9,1,5]);            // sharp white key
    strip(1.3,10,'#dce6f2',4.5,[9,0,-3]);         // cool silver rim
    strip(3.2,.35,'#ffffff',10,[4,3,8]);          // specular kicker
    strip(5,5,'#ffffff',.7,[0,1,11]);             // soft front fill
    strip(10,.8,'#9aa3ad',.6,[0,-6.5,2]);         // floor bounce
    const pm=new T.PMREMGenerator(r); const tex=pm.fromScene(env,.02).texture; pm.dispose(); return tex;
  }
  scene.environment=buildEnv(renderer);
  const keyL=new T.DirectionalLight(0xffffff,1.7); keyL.position.set(-5,6,8); scene.add(keyL);
  const rimL=new T.DirectionalLight(0xdfe8f5,1.3); rimL.position.set(6,-2,-6); scene.add(rimL);

  /* Textures */
  const bc=document.createElement('canvas'); bc.width=1024; bc.height=256; const bx=bc.getContext('2d');
  bx.fillStyle='rgb(220,220,220)'; bx.fillRect(0,0,1024,256);
  for(let i=0;i<3200;i++){ const y=Math.random()*256, g=(150+Math.random()*105)|0; bx.strokeStyle=`rgba(${g},${g},${g},${.15+Math.random()*.45})`; bx.lineWidth=Math.random()<.92?.6:1.4; const x0=Math.random()*1024-200; bx.beginPath(); bx.moveTo(x0,y); bx.lineTo(x0+150+Math.random()*1100,y); bx.stroke(); }
  const brush=new T.CanvasTexture(bc); brush.wrapS=brush.wrapT=T.RepeatWrapping; brush.anisotropy=renderer.capabilities.getMaxAnisotropy();
  const dotTex=(inner,outer)=>{ const c=document.createElement('canvas'); c.width=c.height=64; const x=c.getContext('2d'); const g=x.createRadialGradient(32,32,0,32,32,32); g.addColorStop(0,inner); g.addColorStop(.35,outer); g.addColorStop(1,'rgba(0,0,0,0)'); x.fillStyle=g; x.fillRect(0,0,64,64); const t=new T.CanvasTexture(c); t.colorSpace=T.SRGBColorSpace; return t; };
  const sparkTex=dotTex('rgba(255,255,255,1)','rgba(255,190,130,.6)');
  const glowTex=dotTex('rgba(255,250,240,1)','rgba(255,140,60,.4)');
  const shineTex=dotTex('rgba(255,255,255,1)','rgba(230,240,255,.35)');
  const wc=document.createElement('canvas'); wc.width=256; wc.height=64; const wx=wc.getContext('2d');
  wx.fillStyle='#8a5631'; wx.fillRect(0,0,256,64); for(let i=0;i<90;i++){ wx.strokeStyle=`rgba(${50+Math.random()*40|0},${25+Math.random()*20|0},10,${.15+Math.random()*.35})`; wx.lineWidth=.5+Math.random()*1.5; wx.beginPath(); const y=Math.random()*64; wx.moveTo(0,y); wx.bezierCurveTo(80,y+Math.random()*6-3,170,y+Math.random()*6-3,256,y+Math.random()*4-2); wx.stroke(); }
  const woodTex=new T.CanvasTexture(wc); woodTex.colorSpace=T.SRGBColorSpace;

  /* Physically based stainless: high metalness, low roughness with a brushed grain, clear coat */
  const steelParams={color:0xd9dee4,metalness:.96,roughness:.16,roughnessMap:brush,clearcoat:.4,clearcoatRoughness:.1,reflectivity:1,anisotropy:.45};
  const steel=new T.MeshPhysicalMaterial({...steelParams,vertexColors:true});
  const steelMirror=new T.MeshPhysicalMaterial({...steelParams,color:0xe6eaee,roughness:.08,anisotropy:0,roughnessMap:null,vertexColors:true});
  const steelPlain=new T.MeshPhysicalMaterial({...steelParams});
  const mirrorPlain=new T.MeshPhysicalMaterial({...steelParams,color:0xe6eaee,roughness:.07,anisotropy:0,roughnessMap:null});
  const msSteel=new T.MeshPhysicalMaterial({color:0x8a9097,metalness:.9,roughness:.45,roughnessMap:brush});
  const wood=new T.MeshPhysicalMaterial({color:0xffffff,map:woodTex,metalness:0,roughness:.5,clearcoat:.6,clearcoatRoughness:.35});
  const beadMat=new T.MeshPhysicalMaterial({color:0xb7bdc4,metalness:.95,roughness:.5});

  /* ---- Contours sampled by arc length so all profiles share one vertex layout and can morph ---- */
  const N=160, WALL=.05, R0=.44;
  const sub=(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]], cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]], dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
  function sample(segs,n=N){
    const d=[];
    for(const s of segs){
      if(s[0]==='l'){ const [,a,b]=s; for(let i=0;i<48;i++){const f=i/48; d.push([a[0]+(b[0]-a[0])*f,a[1]+(b[1]-a[1])*f]);} }
      else { const [,c,rx,ry,a0,a1]=s; const m=Math.max(12,Math.ceil(Math.abs(a1-a0)*90)); for(let i=0;i<m;i++){const a=a0+(a1-a0)*i/m; d.push([c[0]+rx*Math.cos(a),c[1]+ry*Math.sin(a)]);} }
    }
    const m=d.length, cum=[0];
    for(let i=1;i<=m;i++){const p=d[i%m],q=d[i-1]; cum.push(cum[i-1]+Math.hypot(p[0]-q[0],p[1]-q[1]));}
    const tot=cum[m], out=[]; let j=0;
    for(let k=0;k<n;k++){ const s=k*tot/n; while(cum[j+1]<s) j++; const f=(s-cum[j])/((cum[j+1]-cum[j])||1); const p=d[j],q=d[(j+1)%m]; out.push([p[0]+(q[0]-p[0])*f,p[1]+(q[1]-p[1])*f]); }
    return out;
  }
  const circle=r=>sample([['a',[0,0],r,r,0,2*PI]]);
  const rrect=(w,hh,r)=>{const X=w/2,Y=hh/2; return sample([
    ['l',[X,0],[X,Y-r]],['a',[X-r,Y-r],r,r,0,PI/2],['l',[X-r,Y],[-X+r,Y]],['a',[-X+r,Y-r],r,r,PI/2,PI],
    ['l',[-X,Y-r],[-X,-Y+r]],['a',[-X+r,-Y+r],r,r,PI,1.5*PI],['l',[-X+r,-Y],[X-r,-Y]],['a',[X-r,-Y+r],r,r,1.5*PI,2*PI],['l',[X,-Y+r],[X,0]]]);};
  const dshape=(R,hb,rc)=>{ const pts=sample([['a',[0,0],R,R,0,PI],['l',[-R,0],[-R,-hb+rc]],['a',[-R+rc,-hb+rc],rc,rc,PI,1.5*PI],['l',[-R+rc,-hb],[R-rc,-hb]],['a',[R-rc,-hb+rc],rc,rc,1.5*PI,2*PI],['l',[R,-hb+rc],[R,0]]]);
    const sh=(R-hb)/2; return pts.map(p=>[p[0],p[1]-sh]); };
  const ellipse=(a,b)=>sample([['a',[0,0],a,b,0,2*PI]]);
  const inset=(O,t)=>{ const n=O.length; return O.map((p,i)=>{const a=O[(i-1+n)%n],b=O[(i+1)%n]; let tx=b[0]-a[0],ty=b[1]-a[1]; const l=Math.hypot(tx,ty)||1; tx/=l;ty/=l; return [p[0]-ty*t,p[1]+tx*t];}); };

  function loft(acc,rings,want,uvWall){
    const base=acc.pos.length/3, R=rings.length, n=rings[0].p.length;
    for(const g of rings){ for(let i=0;i<=n;i++){ const q=g.p[i%n]; acc.pos.push(q[0],q[1],g.z); acc.col.push(g.c,g.c,g.c);
      if(uvWall) acc.uv.push((g.z/acc.L+.5)*acc.L/1.6, i/n*3); else acc.uv.push(q[0]+.5,q[1]+.5); } }
    const Pt=j=>[acc.pos[3*j],acc.pos[3*j+1],acc.pos[3*j+2]];
    const a=Pt(base), b=Pt(base+n+1), a2=Pt(base+1); const flip=dot(cross(sub(b,a),sub(a2,a)),want)<0;
    for(let r=0;r<R-1;r++) for(let i=0;i<n;i++){ const A=base+r*(n+1)+i, B=A+n+1, A2=A+1, B2=B+1; if(flip) acc.idx.push(A,A2,B,A2,B2,B); else acc.idx.push(A,B,A2,A2,B,B2); }
    for(let r=0;r<R;r++) acc.seams.push([base+r*(n+1), base+r*(n+1)+n]);
  }
  /* A pipe: outer wall, depth-darkened bore, chamfered cut edges and flat end faces */
  function tube(O,len,wall=WALL,bev=.012){
    const n=O.length, hl=len/2, I=inset(O,wall), Ob=inset(O,bev), Ib=inset(I,-bev);
    const acc={pos:[],uv:[],col:[],idx:[],seams:[],L:len};
    const tt=[O[1][0]-O[n-1][0],O[1][1]-O[n-1][1]], out=[tt[1],-tt[0],0], inn=[-tt[1],tt[0],0];
    const zw=hl-bev;
    loft(acc,[{p:O,z:zw,c:1},{p:O,z:-zw,c:1}],out,true);
    const IR=[], S=10; for(let s=0;s<=S;s++){ const z=zw-2*zw*s/S, d=Math.abs(z)/zw; IR.push({p:I,z,c:.05+.6*d*d*d}); }
    loft(acc,IR,inn,true);
    for(const sg of [1,-1]){
      loft(acc,[{p:O,z:sg*zw,c:1},{p:Ob,z:sg*hl,c:1}],[out[0],out[1],sg]);
      loft(acc,[{p:I,z:sg*zw,c:.65},{p:Ib,z:sg*hl,c:.85}],[inn[0],inn[1],sg]);
      loft(acc,[{p:Ob,z:sg*hl,c:1},{p:Ib,z:sg*hl,c:.95}],[0,0,sg]);
    }
    const g=new T.BufferGeometry();
    g.setAttribute('position',new T.Float32BufferAttribute(acc.pos,3)); g.setAttribute('uv',new T.Float32BufferAttribute(acc.uv,2)); g.setAttribute('color',new T.Float32BufferAttribute(acc.col,3));
    g.setIndex(acc.idx); g.computeVertexNormals();
    const nr=g.attributes.normal.array;
    for(const [s0,e0] of acc.seams){ const s=s0*3,e=e0*3; const x=nr[s]+nr[e],y=nr[s+1]+nr[e+1],z=nr[s+2]+nr[e+2]; const l=Math.hypot(x,y,z)||1; nr[s]=nr[e]=x/l; nr[s+1]=nr[e+1]=y/l; nr[s+2]=nr[e+2]=z/l; }
    return g;
  }

  const L=6, h=L/2;
  const shapes=[circle(R0), rrect(.82,.82,.09), rrect(1.08,.54,.08), dshape(.46,.2,.07), ellipse(.6,.32)];
  const geos=shapes.map(s=>tube(s,L));
  const morphGeo=geos[0].clone();
  morphGeo.morphAttributes.position=geos.slice(1).map(g=>g.attributes.position);
  morphGeo.morphAttributes.normal=geos.slice(1).map(g=>g.attributes.normal);
  const steelHero=new T.MeshPhysicalMaterial({...steelParams,vertexColors:true});
  const hero=new T.Mesh(morphGeo,steelHero); hero.frustumCulled=false; hero.updateMorphTargets(); scene.add(hero);

  /* Bundle: 19 pipes in hex packing; the centre one is the hero. Pipes leave by shrinking away, never lingering. */
  const D=.9, slots=[];
  for(let q=-2;q<=2;q++) for(let r=-2;r<=2;r++){ if(Math.abs(q+r)>2) continue; slots.push([D*(q+r/2),D*(r*Math.sqrt(3)/2)]); }
  slots.sort((a,b)=>Math.hypot(...a)-Math.hypot(...b));
  const others=slots.slice(1), M=others.length;
  const group=new T.Group(); scene.add(group);
  const inst=new T.InstancedMesh(geos[0],steel,M); inst.frustumCulled=false; group.add(inst);
  const rnd=(a,b)=>a+Math.random()*(b-a);
  const rows=[6,5,4,3], stackPos=[], H=D*Math.sqrt(3)/2;
  rows.forEach((n,k)=>{ for(let j=0;j<n;j++) stackPos.push([rnd(-.35,.35),k*H-1.3*H,(j-(n-1)/2)*D]); });
  const P3=others.map(([x,y],i)=>{ const r=Math.hypot(x,y)||1, ang=Math.atan2(y,x);
    return { b:new T.Vector3(x,y,rnd(-.7,.35)), s:new T.Vector3(x+Math.cos(ang)*2.5,y+Math.sin(ang)*2.5,rnd(-3,-1.5)), k:new T.Vector3(...stackPos[i]),
      len:rnd(.86,1.06), delay:(r/(2*D))*.3+rnd(0,.06) }; });
  const stackQ=new T.Quaternion().setFromAxisAngle(new T.Vector3(0,1,0),PI/2);
  const stackTop=new T.Vector3(0,4*H-1.3*H,0);

  /* ---- Forming: a strip curls into a tube, is welded, then mirror-polished ---- */
  const FN=120, FZ=20, FW=2*PI*R0;
  const fzs=[...Array(FZ+1)].map((_,j)=>h-L*j/FZ);
  function stripPts(c){ const O=[],I=[]; const k=Math.max(c,1e-4)/R0, r=1/k;
    for(let i=0;i<FN;i++){ const s=-FW/2+FW*i/(FN-1), ph=s*k, sn=Math.sin(ph), cs=Math.cos(ph);
      const x=r*sn, y=r*(1-cs)-R0*c; O.push([x,y]); I.push([x-WALL*sn, y+WALL*cs]); }
    return [O,I]; }
  function fLoft(acc,rings,want){
    const base=acc.pos.length/3, R=rings.length, n=rings[0].p.length;
    for(const g of rings) for(const q of g.p){ acc.pos.push(q[0],q[1],g.z); acc.uv.push(g.z/1.6,(q[0]+q[1])*.6); }
    if(!acc.idx) return;
    const Pt=j=>[acc.pos[3*j],acc.pos[3*j+1],acc.pos[3*j+2]];
    const a=Pt(base), b=Pt(base+n), a2=Pt(base+1); const flip=dot(cross(sub(b,a),sub(a2,a)),want)<0;
    for(let r=0;r<R-1;r++) for(let i=0;i<n-1;i++){ const A=base+r*n+i, B=A+n, A2=A+1, B2=B+1; if(flip) acc.idx.push(A,A2,B,A2,B2,B); else acc.idx.push(A,B,A2,A2,B,B2); }
  }
  function fBuild(c,withIdx){ const [O,I]=stripPts(c); const acc={pos:[],uv:[],idx:withIdx?[]:null};
    fLoft(acc,fzs.map(z=>({p:O,z})),[0,-1,0]);
    fLoft(acc,fzs.map(z=>({p:I,z})),[0,1,0]);
    fLoft(acc,[{p:O,z:h},{p:I,z:h}],[0,0,1]);
    fLoft(acc,[{p:O,z:-h},{p:I,z:-h}],[0,0,-1]);
    fLoft(acc,fzs.map(z=>({p:[O[0],I[0]],z})),[-1,0,0]);
    fLoft(acc,fzs.map(z=>({p:[O[FN-1],I[FN-1]],z})),[1,0,0]);
    return acc; }
  const fA=fBuild(1e-4,true);
  const fGeo=new T.BufferGeometry();
  fGeo.setAttribute('position',new T.Float32BufferAttribute(fA.pos,3)); fGeo.setAttribute('uv',new T.Float32BufferAttribute(fA.uv,2));
  fGeo.setAttribute('color',new T.Float32BufferAttribute(new Array(fA.pos.length).fill(1),3)); fGeo.setIndex(fA.idx); fGeo.computeVertexNormals();
  fGeo.attributes.position.setUsage(T.DynamicDrawUsage); fGeo.attributes.color.setUsage(T.DynamicDrawUsage);
  const fMat=steel.clone(); fMat.side=T.DoubleSide;
  const former=new T.Mesh(fGeo,fMat); former.frustumCulled=false; former.visible=false; scene.add(former);
  const beadGeo=new T.CylinderGeometry(.026,.026,1,16,1); beadGeo.rotateX(PI/2);
  const bead=new T.Mesh(beadGeo,beadMat); former.add(bead);
  /* white-hot trail behind the torch: additive segments fading white → copper → red */
  const trail=new T.Group(); former.add(trail);
  const trailCols=['#fffaf0','#ffe2b8','#ffb27a','#ff8a45','#f06a2e','#d24e1f','#a83814','#7a260c'];
  trailCols.forEach((c,i)=>{ const seg=new T.Mesh(new T.CylinderGeometry(.034-i*.002,.034-i*.002,.12,14).rotateX(PI/2),new T.MeshBasicMaterial({color:c,transparent:true,opacity:1-i*.11,blending:T.AdditiveBlending,depthWrite:false})); trail.add(seg); });
  const hotTip=new T.Mesh(new T.SphereGeometry(.035,16,12),new T.MeshBasicMaterial({color:0xffffff})); former.add(hotTip);
  const glow=new T.Sprite(new T.SpriteMaterial({map:glowTex,color:0xffd0a0,blending:T.AdditiveBlending,depthWrite:false,transparent:true})); former.add(glow);
  const bloom=new T.Sprite(new T.SpriteMaterial({map:glowTex,color:0xff7a3a,blending:T.AdditiveBlending,depthWrite:false,transparent:true,opacity:.45})); former.add(bloom);
  const weldLight=new T.PointLight(0xff8a3d,0,4,2); former.add(weldLight);
  /* polish sweep: a bright ring of light travelling along the pipe */
  const ring=new T.Mesh(new T.TorusGeometry(R0+.012,.012,10,96),new T.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.7,blending:T.AdditiveBlending,depthWrite:false})); former.add(ring);
  const shine=new T.Sprite(new T.SpriteMaterial({map:shineTex,color:0xffffff,blending:T.AdditiveBlending,depthWrite:false,transparent:true,opacity:.8})); former.add(shine);
  const polishLight=new T.PointLight(0xffffff,0,3.5,2); former.add(polishLight);
  /* subtle straw tint near the seam, removed by polishing */
  const TINT=[[0,[1.06,.94,.8]],[.05,[1.02,.86,.68]],[.11,[.95,.84,.78]],[.17,[.9,.92,1.02]],[.24,[1,1,1]]];
  function tintAt(d){ for(let i=1;i<TINT.length;i++){ if(d<=TINT[i][0]){ const [d0,c0]=TINT[i-1],[d1,c1]=TINT[i], f=(d-d0)/(d1-d0); return [c0[0]+(c1[0]-c0[0])*f,c0[1]+(c1[1]-c0[1])*f,c0[2]+(c1[2]-c0[2])*f]; } } return [1,1,1]; }
  const tintCache=[...Array(FN)].map((_,i)=>tintAt(Math.min(i,FN-1-i)/(FN-1)*FW));
  let fLast={c:-1,w:-1,p:-1};
  function fUpdate(c,w,pol){
    const geoChanged=Math.abs(c-fLast.c)>.0004;
    if(geoChanged){ const a=fBuild(c,false); fGeo.attributes.position.array.set(a.pos); fGeo.attributes.position.needsUpdate=true; fGeo.computeVertexNormals(); }
    if(geoChanged||Math.abs(w-fLast.w)>.0008||Math.abs(pol-fLast.p)>.0008){
      const col=fGeo.attributes.color.array; const headZ=-h+w*L, polZ=h-pol*L, closed=Math.pow(clamp01(c),10);
      let o=0;
      for(let j=0;j<=FZ;j++){ const z=fzs[j]; const welded=w>0?1-sm(headZ-.06,headZ+.06,z):0; const polished=sm(polZ-.1,polZ+.1,z);
        const amt=welded*(1-polished)*closed; const hot=(w>0&&w<1&&z<headZ)? Math.exp(-(headZ-z)/.35)*closed : 0;
        for(let i=0;i<FN;i++){ const t=tintCache[i]; const near=Math.max(0,1-Math.min(i,FN-1-i)/(FN-1)*FW/.14);
          col[o++]=1+(t[0]-1)*amt+hot*near*1.8; col[o++]=1+(t[1]-1)*amt+hot*near*.75; col[o++]=1+(t[2]-1)*amt+hot*near*.3; } }
      for(let j=0;j<=FZ;j++){ const z=fzs[j], d=1-Math.abs(z)/h; const v=1-c*.9*(1-Math.pow(1-d,3)); for(let i=0;i<FN;i++){ col[o++]=v; col[o++]=v; col[o++]=v; } }
      fGeo.attributes.color.needsUpdate=true;
      const bl=Math.max(.0001,headZ+h), br=1-sm(0,.7,pol);
      bead.visible=w>.002&&br>.02; bead.scale.set(br,br,bl); bead.position.set(0,R0+.002,-h+bl/2);
      trail.children.forEach((s,i)=>s.position.set(0,R0+.006,headZ-.06-i*.12));
      hotTip.position.set(0,R0+.014,headZ); glow.position.copy(hotTip.position); bloom.position.copy(hotTip.position); weldLight.position.set(0,R0+.25,headZ);
      ring.position.set(0,0,polZ); shine.position.set(0,R0+.03,polZ); polishLight.position.set(.3,R0+.45,polZ);
    }
    fLast={c,w,p:pol};
  }

  /* Sparks */
  const SP=120, spPos=new Float32Array(SP*3), spCol=new Float32Array(SP*3), spVel=new Float32Array(SP*3), spLife=new Float32Array(SP), spMax=new Float32Array(SP);
  for(let i=0;i<SP;i++) spPos[i*3+1]=-999;
  const spGeo=new T.BufferGeometry(); spGeo.setAttribute('position',new T.BufferAttribute(spPos,3)); spGeo.setAttribute('color',new T.BufferAttribute(spCol,3));
  const sparks=new T.Points(spGeo,new T.PointsMaterial({size:.06,map:sparkTex,vertexColors:true,transparent:true,depthWrite:false,blending:T.AdditiveBlending,sizeAttenuation:true}));
  sparks.frustumCulled=false; scene.add(sparks);
  let spCursor=0, spAlive=0; const tmpW=new T.Vector3();
  function spawnSparks(at,n){ for(let k=0;k<n;k++){ const i=spCursor; spCursor=(spCursor+1)%SP; const th=Math.random()*PI*2, up=rnd(.3,1), sp=rnd(1.4,4.2), hz=Math.sqrt(1-up*up);
    spPos[i*3]=at.x; spPos[i*3+1]=at.y; spPos[i*3+2]=at.z;
    spVel[i*3]=Math.cos(th)*hz*sp; spVel[i*3+1]=up*sp; spVel[i*3+2]=Math.sin(th)*hz*sp;
    spLife[i]=spMax[i]=rnd(.35,.9); } spAlive=1.2; }
  function updateSparks(dt){ if(spAlive<=0) return; spAlive-=dt;
    for(let i=0;i<SP;i++){ if(spLife[i]<=0) continue; spLife[i]-=dt; const j=i*3;
      spVel[j+1]-=7.5*dt; spVel[j]*=.985; spVel[j+2]*=.985; spPos[j]+=spVel[j]*dt; spPos[j+1]+=spVel[j+1]*dt; spPos[j+2]+=spVel[j+2]*dt;
      const f=Math.max(0,spLife[i]/spMax[i]); spCol[j]=1.2*f+.2; spCol[j+1]=(.85*f*f+.1)*f; spCol[j+2]=.5*f*f*f;
      if(spLife[i]<=0){ spPos[j+1]=-999; spCol[j]=spCol[j+1]=spCol[j+2]=0; } }
    spGeo.attributes.position.needsUpdate=true; spGeo.attributes.color.needsUpdate=true; }

  /* ---- Layout: objects are placed by the visible half-width so they stay in the right column ---- */
  let mobile=false, aspect=1;
  const hw=z=>Math.tan(camera.fov*PI/360)*(CAMZ-z)*aspect;
  const cl=(v,a,b)=>Math.min(b,Math.max(a,v));
  const pose = {
    bundleG(){ if(mobile) return [[0,2.0,-7],[.34,-.6,.05],.85]; const s=cl(hw(0)/6.4,.6,1); return [[hw(0)*.56,-.05,0],[.3,-.6,.06],s]; },
    stackG(){ if(mobile) return [[0,1.6,-10],[.22,-.62,0],.8]; const s=cl(hw(-.5)/8,.5,.82); return [[hw(-.5)*.56,-.55,-.5],[.24,-.62,0],s]; },
    profile(){ if(mobile) return [[0,1.95,0],[.2,-.4,0],1.1]; const s=cl(hw(1.6)/5.4,.6,1); return [[hw(1.6)*.56,.05,1.6],[.2,-.4,0],1.4*s]; },
    forming(){ if(mobile) return [[0,1.7,-1.2],[.62,-.82,.12],.95]; const s=cl(hw(.6)/5.8,.6,1); return [[hw(.6)*.54,-.1,.6],[.62,-.82,.12],1.25*s]; },
  };
  const setEuler=(q,[x,y,z])=>q.setFromEuler(e.set(x,y,z));

  const cur={sp:0,st:0,morph:0,dim:0,c:0,w:0,pol:0}, tgt={sp:0,st:0,morph:0,dim:0,c:0,w:0,pol:0,mode:'bundle',fb:0};
  const gPos=new T.Vector3(), gQ=new T.Quaternion(), tgPos=new T.Vector3(), tgQ=new T.Quaternion(); let gS=1;
  const hPos=new T.Vector3(), hQ=new T.Quaternion(), thPos=new T.Vector3(), thQ=new T.Quaternion(); let hS=1, thS=1;
  const fPos=new T.Vector3(), fQ=new T.Quaternion(); let fS=0;
  const tmpM=new T.Matrix4(), tmpQ=new T.Quaternion(), tmpQ2=new T.Quaternion(), tmpV=new T.Vector3(), tmpS=new T.Vector3(), e=new T.Euler(), I0=new T.Quaternion();

  const ptr={x:0,y:0,tx:0,ty:0};
  addEventListener('pointermove',ev=>{ ptr.tx=(ev.clientX/innerWidth-.5)*2; ptr.ty=(ev.clientY/innerHeight-.5)*2; },{passive:true});
  function resize(){ const w=innerWidth,hh=innerHeight; renderer.setSize(w,hh,false); aspect=w/hh; camera.aspect=aspect; camera.updateProjectionMatrix(); mobile = aspect<.85 || w<900; }
  addEventListener('resize',resize); resize();
  { const [p,r,s]=pose.bundleG(); gPos.set(...p); setEuler(gQ,r); gS=s; }

  const secs={making:$('#making'),profiles:$('#profiles'),enquire:$('#enquire')};
  const fBendEl=$('#fBend'), fSeamEl=$('#fSeam'), fRail=$('#fRail'), pRail=$('#pRail');
  let stageSecMetrics={};
  function updateStageMetrics(){
    const vh=innerHeight;
    for(const k of ['making','profiles','enquire']){
      const el=secs[k];
      if(el) stageSecMetrics[k]={top:el.offsetTop, height:el.offsetHeight, bottom:el.offsetTop+el.offsetHeight};
    }
  }
  addEventListener('resize', updateStageMetrics);
  setTimeout(updateStageMetrics, 120);

  let lastReadY = -9999;
  function readScroll(){
    const y = scrollY;
    if(y === lastReadY && tgt.mode !== 'bundle') return;
    lastReadY = y;
    const vh=innerHeight, mid=y+vh*.5;
    const mk=stageSecMetrics.making||{top:0,height:vh*2,bottom:vh*2};
    const pr=stageSecMetrics.profiles||{top:vh*2,height:vh*2.2,bottom:vh*4.2};
    const en=stageSecMetrics.enquire||{top:vh*10,height:vh,bottom:vh*11};
    const pf=clamp01((y-mk.top)/(mk.height-vh||1)), pp=clamp01((y-pr.top)/(pr.height-vh||1));
    fRail.style.transform=`scaleX(${pf.toFixed(3)})`; pRail.style.transform=`scaleX(${pp.toFixed(3)})`;
    tgt.st=0; tgt.dim=0;
    if(mk.top>mid){ tgt.mode='bundle'; tgt.sp=0; tgt.morph=0; tgt.c=0; tgt.w=0; tgt.pol=0; }
    else if(mk.bottom>mid){ tgt.mode='forming'; tgt.sp=1; tgt.morph=0;
      tgt.c=sm(.07,.5,pf); tgt.w=clamp01((pf-.53)/.25); tgt.pol=clamp01((pf-.8)/.15); tgt.fb=sm(.86,.99,pf);
      setStep(pf<.1?0:pf<.52?1:pf<.79?2:3);
      fBendEl.textContent=Math.round(tgt.c*360)+'°';
      fSeamEl.textContent= tgt.w<=0?'OPEN': tgt.w<1?`WELDING ${Math.round(tgt.w*100)}%`: tgt.pol<1?`POLISHING ${Math.round(tgt.pol*100)}%`:'MIRROR FINISH';
      fSeamEl.className = (tgt.w>0&&tgt.w<1)?'hot':''; }
    else if(pr.bottom>mid){ tgt.mode='profile'; tgt.sp=1; tgt.c=1; tgt.w=1; tgt.pol=1;
      const u=clamp01((pp-.06)/.86)*4, k=Math.min(3,Math.floor(u)), f=u-k; tgt.morph = u>=4?4:k+sm(.3,.7,f);
      setProfile(Math.round(tgt.morph), false); }
    else if(en.top>y+vh*.35){ tgt.mode='hidden'; tgt.sp=1; tgt.dim=1; tgt.morph=0; }
    else { tgt.mode='stack'; tgt.sp=1; tgt.st=1; tgt.morph=0; }
  }

  const callout=$('#callout'), heroTip=new T.Vector3(0,R0,h);
  let last=performance.now(), time=0, fade=0, firstFrame=true;
  let lastInstSp = -1, lastInstSt = -1;
  canvas.style.opacity=0;
  function frame(now){
    requestAnimationFrame(frame);
    const dt=Math.min(.05,(now-last)/1000); last=now; time+=reduceMotion?0:dt;
    readScroll();
    const k=1-Math.exp(-dt*(reduceMotion?20:3.2)), kf=1-Math.exp(-dt*6);
    cur.sp+=(tgt.sp-cur.sp)*k; cur.st+=(tgt.st-cur.st)*k;
    for(const n of ['morph','c','w','pol']) cur[n]+=(tgt[n]-cur[n])*kf;
    cur.dim+=(tgt.dim-cur.dim)*(1-Math.exp(-dt*5));
    fade=Math.min(1,fade+dt*(reduceMotion?10:.8));
    const op=fade*fade*(1-cur.dim);
    canvas.style.opacity=op.toFixed(3);
    if(op<.01 && !firstFrame){
      if(canvas.style.visibility!=='hidden') canvas.style.visibility='hidden';
      callout.style.opacity=0;
      return;
    }
    if(canvas.style.visibility!=='visible') canvas.style.visibility='visible';
    ptr.x+=(ptr.tx-ptr.x)*kf*.5; ptr.y+=(ptr.ty-ptr.y)*kf*.5;

    const [gp,gr,gs]= tgt.mode==='stack'?pose.stackG():pose.bundleG();
    tgPos.set(...gp); setEuler(tgQ,gr); gPos.lerp(tgPos,k); gQ.slerp(tgQ,k); gS+=(gs-gS)*k;
    group.position.copy(gPos); group.scale.setScalar(gS);
    group.quaternion.copy(gQ).multiply(tmpQ.setFromEuler(e.set(Math.sin(time*.35)*.04+ptr.y*.05, Math.sin(time*.22)*.06+ptr.x*.08, 0)));
    group.updateMatrixWorld();

    if(Math.abs(cur.sp - lastInstSp) > 0.0003 || Math.abs(cur.st - lastInstSt) > 0.0003){
      lastInstSp = cur.sp; lastInstSt = cur.st;
      for(let i=0;i<M;i++){
        const p=P3[i]; const a=sm(p.delay,p.delay+.5,cur.sp*1.05), b=sm(p.delay*.6,p.delay*.6+.62,cur.st);
        tmpV.copy(p.b).lerp(p.s,a).lerp(p.k,b);
        tmpQ.copy(I0).slerp(stackQ,b);
        const vis=Math.max(1-a,b), sc=Math.max(.0001,vis);
        tmpS.set(sc,sc,sc*(p.len*(1-b)+.95*b));
        tmpM.compose(tmpV,tmpQ,tmpS); inst.setMatrixAt(i,tmpM);
      }
      inst.instanceMatrix.needsUpdate=true;
      inst.visible = cur.sp<.995 || cur.st>.005;
    }

    const mode=tgt.mode;
    if(mode==='bundle'){ thPos.set(0,0,.55).applyMatrix4(group.matrixWorld); thQ.copy(group.quaternion); thS=gS; }
    else if(mode==='stack'){ thPos.copy(stackTop).applyMatrix4(group.matrixWorld); thQ.copy(group.quaternion).multiply(stackQ); thS=gS; }
    else { const [pp,pr,ps]=pose.profile(); thPos.set(...pp); setEuler(thQ,pr); thS=ps; thQ.premultiply(tmpQ.setFromEuler(e.set(ptr.y*.05,ptr.x*.08,0))); }
    hPos.lerp(thPos,k); hQ.slerp(thQ,k); hS+=(thS-hS)*k;
    hero.position.copy(hPos); hero.quaternion.copy(hQ); hero.scale.setScalar(hS);
    hero.visible = mode!=='forming';

    const inf=hero.morphTargetInfluences; inf.fill(0);
    const m=Math.min(4,Math.max(0,cur.morph)), j=Math.floor(m), f=m-j;
    if(j>=1) inf[j-1]=1-f; if(j<4) inf[j]=f; else inf[3]=1;

    /* former */
    if(mode==='forming'){
      const [ap,ar,as]=pose.forming(), [bp,br,bs]=pose.profile();
      tmpV.set(...ap).lerp(tmpS.set(...bp),tgt.fb); setEuler(tmpQ,ar); tmpQ.slerp(setEuler(tmpQ2,br),tgt.fb);
      tmpQ.premultiply(tmpQ2.setFromEuler(e.set(ptr.y*.05,ptr.x*.08,0)));
      if(!former.visible){ former.visible=true; if(fS<.01){ fPos.copy(tmpV); fQ.copy(tmpQ); } }
      fPos.lerp(tmpV,k); fQ.slerp(tmpQ,k); fS+=((as+(bs-as)*tgt.fb)-fS)*k;
      fUpdate(cur.c,cur.w,cur.pol);
      const welding=cur.w>.002&&cur.w<.998&&cur.c>.97, polishing=cur.pol>.002&&cur.pol<.995;
      hotTip.visible=glow.visible=bloom.visible=trail.visible=welding;
      const flick=.75+Math.random()*.5;
      weldLight.intensity = welding? 10*flick : 0; glow.scale.setScalar(welding? .5+Math.random()*.45 : .01); bloom.scale.setScalar(welding? 1.6+Math.random()*.6 : .01);
      ring.visible=shine.visible=polishing; polishLight.intensity=polishing? 8 : 0; shine.scale.setScalar(polishing? 1.1+Math.sin(time*20)*.05 : .01);
      former.position.copy(fPos); former.quaternion.copy(fQ); former.scale.setScalar(Math.max(.0001,fS));
      if(welding && !reduceMotion){ former.updateMatrixWorld(); tmpW.copy(hotTip.position).applyMatrix4(former.matrixWorld); spawnSparks(tmpW, Math.abs(tgt.w-cur.w)>.001?8:3); }
    } else {
      if(mode==='profile'){ former.visible=false; fS=hS; }
      else { fS+=(0-fS)*k; if(fS<.02) former.visible=false; }
      former.position.copy(fPos); former.quaternion.copy(fQ); former.scale.setScalar(Math.max(.0001,fS));
    }
    updateSparks(dt);

    camera.position.x=ptr.x*.22; camera.position.y=-ptr.y*.16; camera.lookAt(0,0,0);
    renderer.render(scene,camera);

    if(mode==='bundle' && !mobile && fade>.9 && scrollY<innerHeight*.35){
      hero.updateMatrixWorld(); tmpV.copy(heroTip).applyMatrix4(hero.matrixWorld).project(camera);
      const x=(tmpV.x+1)/2*innerWidth, y=(1-tmpV.y)/2*innerHeight; callout.style.transform=`translate3d(${x}px,${y-4.5}px,0)`; callout.style.opacity=1;
    } else callout.style.opacity=0;

    if(firstFrame){ firstFrame=false; finishIntro(); }
  }
  {
    group.position.copy(gPos); group.quaternion.copy(gQ); group.scale.setScalar(gS); group.updateMatrixWorld(); hPos.set(0,0,.55).applyMatrix4(group.matrixWorld); hQ.copy(gQ); hS=gS;
    try {
      former.visible = true;
      hero.visible = true;
      if (hero.morphTargetInfluences) hero.morphTargetInfluences[0] = 0.5;
      inst.visible = true;
      weldLight.intensity = 1;
      polishLight.intensity = 1;
      glow.visible = true; bloom.visible = true; ring.visible = true; shine.visible = true; trail.visible = true; sparks.visible = true;
      renderer.compile(scene, camera);
      renderer.render(scene, camera);
      if (hero.morphTargetInfluences) hero.morphTargetInfluences[0] = 0;
      former.visible = false;
      weldLight.intensity = 0;
      polishLight.intensity = 0;
      glow.visible = false; bloom.visible = false; ring.visible = false; shine.visible = false; trail.visible = false;
    } catch(e) {}
  }
  requestAnimationFrame(frame);

  /* ======================= Product renders for the catalogue ======================= */
  function startThumbs(){
    /* Offscreen rendering disabled for maximum performance and instant load */
  }
})();

function driveStoriesOnly(){
  const mk=$('#making'), pr=$('#profiles');
  let mkTop=0, mkH=1, prTop=0, prH=1;
  function updateStoryMetrics(){
    if(mk){ mkTop=mk.offsetTop; mkH=mk.offsetHeight; }
    if(pr){ prTop=pr.offsetTop; prH=pr.offsetHeight; }
  }
  addEventListener('resize', updateStoryMetrics);
  setTimeout(updateStoryMetrics, 100);
  const onScroll=()=>{
    const vh=innerHeight, y=scrollY;
    const pf=clamp01((y-mkTop)/(mkH-vh||1)); $('#fRail').style.transform=`scaleX(${pf})`; setStep(pf<.1?0:pf<.52?1:pf<.79?2:3);
    const pp=clamp01((y-prTop)/(prH-vh||1)); $('#pRail').style.transform=`scaleX(${pp})`;
    const mid=y+vh*.5;
    if(mkTop<mid && (prTop+prH)>mid){ const u=clamp01((pp-.06)/.86)*4; setProfile(Math.min(4,Math.round(u)), false); }
  };
  addEventListener('scroll', onScroll, {passive:true});
  onScroll();
}
