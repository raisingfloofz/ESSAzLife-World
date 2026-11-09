'use strict';
const $ = id => document.getElementById(id);
const els = {status:$('status'),buddy:$('buddy'),meter:$('meterFill'),text:$('soundText'),start:$('startBtn'),stop:$('stopBtn'),note:$('permissionNote'),sensitivity:$('sensitivity'),value:$('sensitivityValue'),theme:$('themeChoice'),choice:$('buddyChoice'),reduce:$('reduceMotion'),rings:$('rings')};
const SETTINGS_KEY='essazlifeEchozSettingsV1';
let stream=null,context=null,analyser=null,source=null,frame=0,level=0,lastReaction=0,buffer=null;
function saveSettings(){try{localStorage.setItem(SETTINGS_KEY,JSON.stringify({buddy:els.choice.value,sensitivity:Number(els.sensitivity.value),theme:els.theme.value,reduce:els.reduce.checked}));}catch(e){console.warn('Could not save Echoz settings',e);}}
function applySettings(){if(!els.buddy.querySelector('img'))els.buddy.textContent=els.choice.value;els.value.textContent=els.sensitivity.value+'%';document.body.dataset.theme=els.theme.value;document.body.classList.toggle('reduce-motion',els.reduce.checked);saveSettings();}
try{const s=JSON.parse(localStorage.getItem(SETTINGS_KEY)||'null');if(s){if([...els.choice.options].some(o=>o.value===s.buddy))els.choice.value=s.buddy;if(Number.isFinite(s.sensitivity))els.sensitivity.value=Math.max(10,Math.min(100,s.sensitivity));if([...els.theme.options].some(o=>o.value===s.theme))els.theme.value=s.theme;els.reduce.checked=Boolean(s.reduce);}}catch(e){console.warn('Could not load settings',e);}applySettings();
[els.choice,els.theme,els.reduce,els.sensitivity].forEach(el=>el.addEventListener('input',applySettings));
function setListening(on){els.start.disabled=on;els.stop.disabled=!on;els.status.textContent=on?'🟢 Listening':'Mic off';}
function visualize(time){if(!analyser)return;analyser.getByteTimeDomainData(buffer);let sum=0;for(let i=0;i<buffer.length;i++){const x=(buffer[i]-128)/128;sum+=x*x;}const rms=Math.sqrt(sum/buffer.length);const sensitivity=Number(els.sensitivity.value)/60;const target=Math.min(1,Math.max(0,(rms-.012)*9*sensitivity));level=level*.72+target*.28;const strength=Math.min(1,level);els.meter.style.width=(strength*100).toFixed(1)+'%';els.rings.style.setProperty('--ring-scale',(1+strength*.38).toFixed(2));els.rings.style.setProperty('--ring-opacity',(.13+strength*.65).toFixed(2));els.buddy.style.setProperty('--scale',(1+strength*.28).toFixed(2));els.buddy.style.setProperty('--rotate',((Math.sin(time/125)*strength*10).toFixed(2))+'deg');if(time-lastReaction>200){els.text.textContent=strength>.65?'🎉 WOW! BIG SOUND!':strength>.25?'🎶 I hear you!':strength>.07?'👂 Listening...':'🤫 So quiet!';lastReaction=time;}frame=requestAnimationFrame(visualize);}
async function start(){if(stream)return;if(!navigator.mediaDevices?.getUserMedia){els.note.textContent='Microphone access is unavailable. Open Echoz using HTTPS or localhost in a supported browser.';return;}els.start.disabled=true;els.text.textContent='Asking for microphone permission...';try{stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:false,noiseSuppression:false,autoGainControl:false},video:false});const AudioContextClass=window.AudioContext||window.webkitAudioContext;if(!AudioContextClass)throw new Error('Web Audio is not supported in this browser.');context=new AudioContextClass();source=context.createMediaStreamSource(stream);analyser=context.createAnalyser();analyser.fftSize=1024;analyser.smoothingTimeConstant=.65;source.connect(analyser);buffer=new Uint8Array(analyser.fftSize);await context.resume();level=0;setListening(true);els.note.textContent='Listening locally. No audio is recorded, stored, or uploaded.';frame=requestAnimationFrame(visualize);startHeartbeat();const track=stream.getAudioTracks()[0];if(track)track.addEventListener('ended',stop,{once:true});}catch(err){console.error('Echoz microphone error',err);stop();els.text.textContent='Could not start listening';els.note.textContent='Microphone unavailable: '+(err.name==='NotAllowedError'?'permission was denied. Allow the microphone in your browser settings.':err.message||'Please check your microphone and try again.');}}
function stop(){stopAllEchozSounds();cancelAnimationFrame(frame);frame=0;if(source){try{source.disconnect();}catch{}source=null;}if(stream){stream.getTracks().forEach(track=>track.stop());stream=null;}if(context){context.close().catch(()=>{});context=null;}analyser=null;buffer=null;level=0;els.meter.style.width='0%';els.rings.style.setProperty('--ring-scale','1');els.rings.style.setProperty('--ring-opacity','.16');els.buddy.style.setProperty('--scale','1');els.buddy.style.setProperty('--rotate','0deg');els.text.textContent='Ready to listen!';setListening(false);}
els.start.addEventListener('click',start);els.stop.addEventListener('click',stop);window.addEventListener('pagehide',stop);
if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker.js').catch(err=>console.warn('Echoz offline setup failed',err)));


/* Automatic faint heartbeat and cuddle sounds; no Comfort Soundz panel. */
const heartbeatAudio=new Audio('sounds/heartbeat.wav');
heartbeatAudio.loop=true;heartbeatAudio.volume=0.12;heartbeatAudio.preload='none';
const sleepingAudio=new Audio();sleepingAudio.loop=true;sleepingAudio.volume=0.35;sleepingAudio.preload='none';
function startHeartbeat(){heartbeatAudio.play().catch(err=>console.warn('Heartbeat unavailable:',err));}
function stopHeartbeat(){heartbeatAudio.pause();heartbeatAudio.currentTime=0;}
function stopAllEchozSounds(){
 // Stop every audio channel immediately, not only the heartbeat and cuddle loop.
 for(const audio of [heartbeatAudio,sleepingAudio,animalAudio]){
  audio.pause();
  try{audio.currentTime=0;}catch{}
 }
 // Stop recognition too, preventing further voice-triggered sounds after Stop.
 voiceActive=false;
 const toggle=$('voiceCommands');
 if(toggle)toggle.checked=false;
 if(voiceRecognizer){try{voiceRecognizer.abort();}catch{}}
}

window.addEventListener('pagehide',()=>{stopHeartbeat();sleepingAudio.pause();});
/* Echoz v1.2 — animal reactions, photo, and sleeping mode */
const animalFiles={
 dog:{speak:['dog-bark.wav','puppy.wav'],eat:'dog-eating.wav',no:'dog-whine.wav',sleep:'dog-sleep.wav'},
 cat:{speak:['kitten-meow.wav','cat-meow.wav'],eat:'cat-eating.wav',sleep:'cat-purr.wav'},
 cow:{speak:['cow-moo.wav'],sleep:'dog-sleep.wav'}
};
const species=$('species'),voiceAge=$('dogAge'),sleepToggle=$('sleepMode'),animalNote=$('animalNote');
const animalAudio=new Audio();animalAudio.preload='none';
let animalLast=0,occasionalTimer=null,voiceRecognizer=null,voiceActive=false;
const ANIMAL_KEY='essazlifeEchozAnimalsV1';
try{
 const s=JSON.parse(localStorage.getItem(ANIMAL_KEY)||'{}');
 if(['dog','cat','cow'].includes(s.species))species.value=s.species;
 voiceAge.value=s.age==='adult'?'adult':'baby';
 $('occasionalSounds').checked=!!s.occasional;
}catch{}
function saveAnimal(){
 try{localStorage.setItem(ANIMAL_KEY,JSON.stringify({species:species.value,age:voiceAge.value,occasional:$('occasionalSounds').checked}));}catch{}
}
function syncAnimal(){
 const emoji={dog:'🐶',cat:'🐱',cow:'🐮'}[species.value];
 els.choice.value=emoji;
 if(!els.buddy.querySelector('img'))els.buddy.textContent=emoji;
 saveSettings();saveAnimal();
 if(sleepToggle.checked){
  sleepingAudio.src='sounds/'+chooseAnimalFile('sleep');
  sleepingAudio.play().catch(()=>{});
 }
}
function chooseAnimalFile(action){
 const data=animalFiles[species.value];
 if(action==='no'&&species.value!=='dog')return null;
 if(action==='eat'&&species.value==='cow')return null;
 if(action==='speak'){
  const choices=data.speak;
  if(species.value==='dog')return voiceAge.value==='adult'?choices[0]:choices[1];
  if(species.value==='cat')return voiceAge.value==='adult'?choices[1]:choices[0];
  return choices[0];
 }
 return data[action]||null;
}
async function animalReact(action){
 if(!stream){animalNote.textContent='Press Start Listening first.';return;}
 if(sleepToggle.checked&&action!=='sleep'){animalNote.textContent='💤 Your ESSA is sleeping. Turn off Sleeping Mode to play!';return;}
 const filename=chooseAnimalFile(action);
 if(!filename){animalNote.textContent='This species does not have a '+action+' recording assigned yet.';return;}
 animalAudio.pause();animalAudio.currentTime=0;
 animalAudio.src='sounds/'+filename;
 animalAudio.volume=.65;
 try{
  await animalAudio.play();
  animalNote.textContent='🐾 '+filename+' playing!';
  animalLast=Date.now();
 }catch{
  animalNote.textContent='Missing or unsupported: sounds/'+filename+'. Download the Freesound recording and rename it to this filename.';
 }
}
$('speakBtn').addEventListener('click',()=>animalReact('speak'));
$('eatBtn').addEventListener('click',()=>animalReact('eat'));
$('noBtn').addEventListener('click',()=>animalReact('no'));
[species,voiceAge].forEach(el=>el.addEventListener('change',syncAnimal));
$('occasionalSounds').addEventListener('change',saveAnimal);
syncAnimal();

function scheduleOccasional(){
 clearInterval(occasionalTimer);
 occasionalTimer=setInterval(()=>{
  if(species.value==='dog'&&$('occasionalSounds').checked&&!sleepToggle.checked&&stream&&Date.now()-animalLast>25000&&Math.random()<.3)animalReact('speak');
 },15000);
}
scheduleOccasional();

const PHOTO_KEY='essazlifeEchozPhotoV1';
function showPhoto(data){
 if(!data){els.buddy.textContent=els.choice.value;return;}
 els.buddy.innerHTML='';
 const img=document.createElement('img');img.src=data;img.alt='Your ESSA photo';img.className='buddy-photo';
 els.buddy.appendChild(img);
}
try{showPhoto(localStorage.getItem(PHOTO_KEY));}catch{}
$('buddyPhoto').addEventListener('change',()=>{
 const file=$('buddyPhoto').files?.[0];if(!file)return;
 if(!/^image\/(png|jpeg|webp|gif)$/.test(file.type)){ $('photoNote').textContent='Choose a PNG, JPG, WEBP, or GIF.';return;}
 if(file.size>4*1024*1024){$('photoNote').textContent='Choose a photo smaller than 4 MB.';return;}
 const reader=new FileReader();
 reader.onload=()=>{
  const picture=new Image();
  picture.onload=()=>{
   const scale=Math.min(1,512/Math.max(picture.width,picture.height));
   const canvas=document.createElement('canvas');
   canvas.width=Math.max(1,Math.round(picture.width*scale));
   canvas.height=Math.max(1,Math.round(picture.height*scale));
   canvas.getContext('2d').drawImage(picture,0,0,canvas.width,canvas.height);
   const data=canvas.toDataURL('image/webp',.78);
   try{localStorage.setItem(PHOTO_KEY,data);showPhoto(data);$('photoNote').textContent='Optimized photo saved on this device.';}
   catch{$('photoNote').textContent='Not enough browser storage. Try a smaller image.';showPhoto(data);}
  };
  picture.onerror=()=>{$('photoNote').textContent='Could not open this picture.';};
  picture.src=reader.result;
 };
 reader.readAsDataURL(file);
});
$('removePhoto').addEventListener('click',()=>{
 try{localStorage.removeItem(PHOTO_KEY);}catch{}
 $('buddyPhoto').value='';showPhoto(null);$('photoNote').textContent='Emoji restored.';
});
els.choice.addEventListener('change',()=>{if(!els.buddy.querySelector('img'))els.buddy.textContent=els.choice.value;});

sleepToggle.addEventListener('change',async()=>{
 if(!stream){sleepingAudio.pause();return;}
 if(sleepToggle.checked){
  animalAudio.pause();
  sleepingAudio.src='sounds/'+chooseAnimalFile('sleep');
  sleepingAudio.load();
  try{await sleepingAudio.play();animalNote.textContent='💤 Sleeping sound is playing.';}
  catch{animalNote.textContent='Add sounds/'+chooseAnimalFile('sleep')+' to hear sleeping sounds.';}
 }else{
  sleepingAudio.pause();
  animalNote.textContent='🐾 Awake and ready to play!';
 }
});
/* Heartbeat starts automatically when microphone listening starts. */
const ESSA_NAME_KEY='essazlifeEchozNameV1';
const essaNameInput=$('essaName');
try{essaNameInput.value=localStorage.getItem(ESSA_NAME_KEY)||'';}catch{}
let lastNameReaction=0;
const NAME_COOLDOWN_MS=3000;
function normalizedWords(s){return s.toLocaleLowerCase().normalize('NFKC').replace(/[^\p{L}\p{N}]+/gu,' ').trim().split(/\s+/).filter(Boolean);}
function heardEssaName(transcript){
 const name=normalizedWords(essaNameInput.value);
 if(!name.length)return false;
 const words=normalizedWords(transcript);
 return words.some((_,i)=>name.every((w,j)=>words[i+j]===w));
}
function nameReaction(){
 if(sleepToggle.checked||!stream)return;
 const now=Date.now();
 if(now-lastNameReaction<NAME_COOLDOWN_MS)return;
 lastNameReaction=now;
 els.buddy.classList.remove('name-react');
 void els.buddy.offsetWidth;
 els.buddy.classList.add('name-react');
 animalReact('speak');
}
essaNameInput.addEventListener('input',()=>{
 try{localStorage.setItem(ESSA_NAME_KEY,essaNameInput.value.trim());}catch{}
 updateCommands();
});
const SpeechRecognition=window.SpeechRecognition||window.webkitSpeechRecognition;
if(!SpeechRecognition){
 $('voiceCommands').disabled=true;
 $('voiceCommands').parentElement.title='Speech recognition is not supported by this browser.';
}else{
 const recognition=new SpeechRecognition();
 voiceRecognizer=recognition;
 recognition.lang='en-US';recognition.continuous=true;recognition.interimResults=false;
 recognition.onresult=e=>{
  if(!voiceActive)return;
  for(let i=e.resultIndex;i<e.results.length;i++){
   if(!e.results[i].isFinal)continue;
   const transcript=e.results[i][0].transcript;
   const words=normalizedWords(transcript);
   // A spoken command takes precedence over the name reaction.
   if(words.includes('speak'))animalReact('speak');
   else if(words.includes('eat'))animalReact('eat');
   else if(words.includes('wait')||words.includes('no'))animalReact('no');
   else if(heardEssaName(transcript))nameReaction();
  }
 };
 recognition.onerror=e=>{animalNote.textContent='Voice commands: '+e.error+'. Use the buttons instead.';};
 recognition.onend=()=>{
  if(voiceActive){try{recognition.start();}catch{}}
 };
 $('voiceCommands').addEventListener('change',()=>{
  voiceActive=$('voiceCommands').checked;
  if(voiceActive){
   animalNote.textContent='Voice recognition may use your browser speech service and may send speech to a provider. Use buttons for fully local reactions.';
   try{recognition.start();}catch{voiceActive=false;$('voiceCommands').checked=false;}
  }else recognition.stop();
 });
 window.addEventListener('pagehide',()=>{voiceActive=false;recognition.stop();});
}

/* v1.5: collapsible settings and live voice-command reference */
const settingsBtn=$('settingsBtn'),settingsPanel=$('settingsPanel'),settingsBackdrop=$('settingsBackdrop');
function setSettingsOpen(open){
 settingsPanel.classList.toggle('open',open);settingsPanel.inert=!open;
 settingsPanel.setAttribute('aria-hidden',String(!open));settingsBtn.setAttribute('aria-expanded',String(open));
 settingsBackdrop.hidden=!open;document.body.classList.toggle('settings-open',open);
 if(open)$('closeSettings').focus();else settingsBtn.focus();
}
settingsBtn.addEventListener('click',()=>setSettingsOpen(!settingsPanel.classList.contains('open')));
$('closeSettings').addEventListener('click',()=>setSettingsOpen(false));
settingsBackdrop.addEventListener('click',()=>setSettingsOpen(false));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&settingsPanel.classList.contains('open'))setSettingsOpen(false);});
function updateCommands(){
 const commands=species.value==='dog'?'Speak • Eat • No • Wait':species.value==='cat'?'Speak • Eat':'Speak';
 const name=essaNameInput.value.trim();
 $('commandList').textContent=(name?'“'+name+'!” • ':'')+commands;
 $('commandHint').textContent=$('voiceCommands').checked?'🎤 Voice commands enabled. Try saying one of these words!':'Turn on voice commands in ⚙️ Settings to use these words.';
}
species.addEventListener('change',updateCommands);
$('voiceCommands').addEventListener('change',updateCommands);
updateCommands();


/* v1.8 — locally saved ESSA profiles */
const LIBRARY_KEY='essazlifeEchozLibraryV1';
const ACTIVE_ESSA_KEY='essazlifeEchozActiveProfileV1';
const librarySelect=$('savedEssaSelect'),libraryStatus=$('libraryStatus');
let activeProfileId='';
function readLibrary(){
 try{
  const data=JSON.parse(localStorage.getItem(LIBRARY_KEY)||'[]');
  return Array.isArray(data)?data.filter(x=>x&&typeof x.id==='string'&&typeof x.name==='string'):[];
 }catch{return [];}
}
function writeLibrary(data){
 try{localStorage.setItem(LIBRARY_KEY,JSON.stringify(data));return true;}
 catch{libraryStatus.textContent='Storage is full. Try a smaller photo or delete an unused ESSA.';return false;}
}
function currentProfile(){
 let photo=null;try{photo=localStorage.getItem(PHOTO_KEY);}catch{}
 return {id:activeProfileId||('essa-'+Date.now()+'-'+Math.random().toString(36).slice(2,7)),
 name:essaNameInput.value.trim(),species:species.value,age:voiceAge.value,
 photo:photo||null,emoji:els.choice.value,theme:els.theme.value,
 sensitivity:Number(els.sensitivity.value),reduce:els.reduce.checked,
 occasional:$('occasionalSounds').checked};
}
function renderLibrary(selected){
 const data=readLibrary();librarySelect.replaceChildren(new Option('Choose a saved ESSA…',''));
 for(const entry of data)librarySelect.add(new Option((entry.name||'Unnamed ESSA')+' ('+entry.species+')',entry.id));
 librarySelect.value=selected&&data.some(x=>x.id===selected)?selected:'';
}
function saveProfile(){
 const profile=currentProfile();
 if(!profile.name){libraryStatus.textContent='Give your ESSA a name before saving.';essaNameInput.focus();return;}
 const data=readLibrary();
 const existing=data.findIndex(x=>x.id===profile.id);
 if(existing>=0)data[existing]=profile;else data.push(profile);
 if(!writeLibrary(data))return;
 activeProfileId=profile.id;
 try{localStorage.setItem(ACTIVE_ESSA_KEY,activeProfileId);}catch{}
 renderLibrary(activeProfileId);
 libraryStatus.textContent='💜 '+profile.name+' saved! You can switch back anytime.';
}
function applyProfile(profile){
 // Silence any current audio before changing companions.
 stop();
 activeProfileId=profile.id;
 try{localStorage.setItem(ACTIVE_ESSA_KEY,activeProfileId);}catch{}
 essaNameInput.value=profile.name||'';
 species.value=['dog','cat','cow'].includes(profile.species)?profile.species:'dog';
 voiceAge.value=profile.age==='adult'?'adult':'baby';
 $('occasionalSounds').checked=!!profile.occasional;
 sleepToggle.checked=false;
 if([...els.theme.options].some(x=>x.value===profile.theme))els.theme.value=profile.theme;
 if(Number.isFinite(profile.sensitivity))els.sensitivity.value=profile.sensitivity;
 els.reduce.checked=!!profile.reduce;
 syncAnimal();
 if(profile.photo){
  try{localStorage.setItem(PHOTO_KEY,profile.photo);}catch{libraryStatus.textContent='Photo could not fit in browser storage.';}
  showPhoto(profile.photo);
 }else{
  try{localStorage.removeItem(PHOTO_KEY);}catch{}
  showPhoto(null);
 }
 try{localStorage.setItem(ESSA_NAME_KEY,essaNameInput.value);}catch{}
 applySettings();updateCommands();renderLibrary(activeProfileId);
 $('buddyPhoto').value='';
 libraryStatus.textContent='🐾 '+(profile.name||'Your ESSA')+' is ready! Press Start Listening.';
}
$('saveEssaBtn').addEventListener('click',saveProfile);
$('loadEssaBtn').addEventListener('click',()=>{
 const profile=readLibrary().find(x=>x.id===librarySelect.value);
 if(!profile){libraryStatus.textContent='Choose an ESSA from the list first.';return;}
 applyProfile(profile);
});
$('newEssaBtn').addEventListener('click',()=>{
 stop();activeProfileId='';
 try{localStorage.removeItem(ACTIVE_ESSA_KEY);localStorage.removeItem(PHOTO_KEY);localStorage.removeItem(ESSA_NAME_KEY);}catch{}
 essaNameInput.value='';species.value='dog';voiceAge.value='baby';
 $('occasionalSounds').checked=false;sleepToggle.checked=false;
 syncAnimal();showPhoto(null);$('buddyPhoto').value='';updateCommands();renderLibrary('');
 libraryStatus.textContent='New ESSA ready! Add a name and photo, then press Save This ESSA.';
});
$('deleteEssaBtn').addEventListener('click',()=>{
 const id=librarySelect.value;
 const data=readLibrary(),entry=data.find(x=>x.id===id);
 if(!entry){libraryStatus.textContent='Choose an ESSA to delete first.';return;}
 if(!confirm('Delete '+entry.name+' from My ESSAz? This cannot be undone.'))return;
 if(!writeLibrary(data.filter(x=>x.id!==id)))return;
 if(activeProfileId===id){
  activeProfileId='';
  try{localStorage.removeItem(ACTIVE_ESSA_KEY);}catch{}
 }
 renderLibrary('');
 libraryStatus.textContent='Deleted '+entry.name+' from saved ESSAs.';
});
try{activeProfileId=localStorage.getItem(ACTIVE_ESSA_KEY)||'';}catch{}
renderLibrary(activeProfileId);
