'use strict';
const $=id=>document.getElementById(id);let settings,memories,timer,index,frames=[],playing=false,activeMonth;
const monthName=k=>new Date(k+'-15T12:00:00Z').toLocaleDateString('en-US',{month:'long',year:'numeric',timeZone:'UTC'});
function nyMonth(){return new Intl.DateTimeFormat('en-CA',{timeZone:'America/New_York',year:'numeric',month:'2-digit'}).formatToParts(new Date()).filter(p=>p.type==='year'||p.type==='month').map(p=>p.value).join('-');}
function deadline(k){const [y,m]=k.split('-').map(Number);const utc=Date.UTC(y,m,1);let t=utc;for(let i=0;i<3;i++){const parts=new Intl.DateTimeFormat('en-US',{timeZone:'America/New_York',year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric',second:'numeric',hourCycle:'h23'}).formatToParts(new Date(t));const p=Object.fromEntries(parts.map(x=>[x.type,x.value]));t+=utc-Date.UTC(+p.year,+p.month-1,+p.day,+p.hour,+p.minute,+p.second);}return t;}
function developed(k){try{return localStorage.getItem('snapit-developed-'+k)==='yes'}catch{return false}}
function available(k){return memories[k]?.released===true&&Array.isArray(memories[k].photos)&&memories[k].photos.length>0&&Date.now()>=deadline(k)}
function button(label,fn){const b=document.createElement('button');b.textContent=label;b.onclick=fn;return b;}
function renderAlbums(){ $('albums').replaceChildren();$('develop').replaceChildren();let count=0;for(const k of Object.keys(memories).sort().reverse()){if(!available(k))continue;if(developed(k)){$('albums').append(button(monthName(k)+' — Replay',()=>start(k)));count++;}else $('develop').append(button('DEVELOP PHOTOS — '+monthName(k),()=>start(k)));}if(!count)$('albums').textContent='Your developed monthly recaps will appear here.';}
function tick(){const seconds=Math.max(0,Math.ceil((deadline(settings.month)-Date.now())/1000));$('countdown').textContent=seconds?`${Math.floor(seconds/86400)}d ${Math.floor(seconds/3600)%24}h ${Math.floor(seconds/60)%60}m ${seconds%60}s`:'Month complete!';if(!seconds&&!$('develop').children.length)renderAlbums();}
function page(archive){$('cameraPage').hidden=archive;$('memoriesPage').hidden=!archive;$('home').setAttribute('aria-pressed',String(!archive));$('archive').setAttribute('aria-pressed',String(archive));renderAlbums();}
$('home').onclick=()=>page(false);$('archive').onclick=()=>page(true);
function start(k){activeMonth=k;frames=[{title:monthName(k),subtitle:'in the ESSA Community...'},...memories[k].photos,{title:'Thank you!',subtitle:'To every ESSA handler who shared a memory.'}];index=0;playing=true;$('pause').textContent='Pause';$('player').showModal();show();}
function show(){clearTimeout(timer);const f=frames[index],s=$('slide');s.replaceChildren();if(f.title){const h=document.createElement('h2');h.textContent=f.title;const p=document.createElement('p');p.textContent=f.subtitle;s.append(h,p);}else{const img=document.createElement('img');img.src='images/'+activeMonth+'/'+encodeURIComponent(f.id)+'.jpg';img.alt='Community ESSA photograph';img.onerror=()=>{img.alt='Photograph unavailable';};const c=document.createElement('span');c.className='credit';c.textContent=f.username||'';s.append(img,c);}if(playing)timer=setTimeout(()=>advance(1),4000);}
function advance(n){if(index+n>=frames.length){try{localStorage.setItem('snapit-developed-'+activeMonth,'yes')}catch{}$('player').close();page(true);return;}index=Math.max(0,index+n);show();}
$('prev').onclick=()=>advance(-1);$('next').onclick=()=>advance(1);$('pause').onclick=()=>{playing=!playing;$('pause').textContent=playing?'Pause':'Play';show();};$('close').onclick=()=>$('player').close();$('player').addEventListener('close',()=>{clearTimeout(timer);playing=false;});
async function load(){try{[settings,memories]=await Promise.all(['settings.json','memories.json'].map(async f=>{const r=await fetch(f,{cache:'no-store'});if(!r.ok)throw Error(f);return r.json()}));$('month').textContent=monthName(settings.month);$('cameraArt').src=settings.cameraImage;$('cameraArt').onerror=()=>{$('cameraArt').hidden=true;};if(settings.submissionsOpen&&settings.month===nyMonth())$('camera').href=settings.submissionUrl;else{$('camera').removeAttribute('href');$('camera').querySelector('span').textContent='Submissions are currently closed.';}$('contributors').textContent='Loading handler count…';refreshHandlerCount();setInterval(refreshHandlerCount,60000);renderAlbums();tick();setInterval(tick,1000);}catch(e){$('status').textContent='Snapit could not load. Please refresh while connected to the internet.';console.error(e);}}load();

const COUNTER_URL = "https://script.google.com/macros/s/AKfycbwc4BYdfKuoYUMzZzgXcs9bQJ2veRGbHOrv765y9DHrHPZ2YhU8W6xA19F9LX0Tuo8CIQ/exec";
async function refreshHandlerCount(){
  try {
    const response=await fetch(COUNTER_URL,{cache:'no-store',credentials:'omit'});
    if(!response.ok) throw Error('Counter unavailable');
    const data=await response.json();
    const n=data.contributorCount;
    if(data.month!==nyMonth() || !Number.isSafeInteger(n) || n<0) throw Error('Invalid counter');
    if(settings.month!==data.month){$('contributors').textContent='Current month count: '+n+' ESSA '+(n===1?'Handler':'Handlers');return;}
    $('contributors').textContent=n===1?'1 ESSA Handler has contributed this month!':`${n} ESSA Handlers have contributed this month!`;
  } catch(error){
    $('contributors').textContent='Live handler count temporarily unavailable.';
    console.warn(error);
  }
}
