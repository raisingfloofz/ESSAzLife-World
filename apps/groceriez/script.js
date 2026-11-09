'use strict';
const KEY='essazlife_groceriez_v1';
let db=load();
function load(){try{const d=JSON.parse(localStorage.getItem(KEY));if(d&&Array.isArray(d.stores)&&Array.isArray(d.trips)&&Array.isArray(d.history))return d;}catch{}return {stores:[],trips:[],history:[]};}
function save(){localStorage.setItem(KEY,JSON.stringify(db));render();}
const uid=()=>crypto.randomUUID?crypto.randomUUID():Date.now().toString(36)+Math.random().toString(36).slice(2);
const money=n=>'$'+(Math.round((Number(n)||0)*100)/100).toFixed(2);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const byId=(id)=>document.getElementById(id);
const itemTotal=i=>(Number(i.price)||0)*(Number(i.qty)||0);
const total=items=>items.reduce((n,i)=>n+itemTotal(i),0);
const budgetValue=t=>t.budget===null||t.budget===undefined||t.budget===''?null:Number(t.budget);
const budgetHtml=t=>{const b=budgetValue(t);if(b===null)return '<span class="muted">No trip budget set</span>';const remaining=b-total(t.items);return `<div class="budget-status ${remaining<0?'over-budget':'within-budget'}"><strong>Budget: ${money(b)}</strong><span>${remaining<0?'Over budget by '+money(-remaining):money(remaining)+' remaining'}</span></div>`;};
const storeName=id=>db.stores.find(s=>s.id===id)?.name||'Deleted store';
function button(text,action,cls='mini secondary'){return `<button class="${cls}" data-action="${action}">${text}</button>`;}
function empty(text){return `<div class="empty">${text}</div>`;}
function render(){
byId('storeCards').innerHTML=db.stores.length?db.stores.map(s=>`<article class="card" data-store="${s.id}"><div class="cardhead"><div><h3>🏪 ${esc(s.name)}</h3><span class="pill">${s.items.length} saved item(s)</span></div><div class="itemactions">${button('✏️ Rename','renameStore')}${button('🗑️','deleteStore','mini danger')}</div></div><ul class="items">${s.items.map(i=>`<li class="itemrow" data-item="${i.id}"><div class="iteminfo"><strong>${esc(i.name)}</strong><small>Aisle: ${esc(i.aisle||'Not set')} • Qty: ${i.qty} • ${money(i.price)} each</small></div><div class="itemactions"><strong>${money(itemTotal(i))}</strong>${button('✏️','editItem')}${button('✕','deleteItem','mini danger')}</div></li>`).join('')}</ul><div class="totalrow"><span>Estimated list total: ${money(total(s.items))}</span>${button('+ Item','addItem')}</div></article>`).join(''):empty('No stores yet! Add your first store to get started. 🏪');
byId('tripCards').innerHTML=db.trips.length?db.trips.map(t=>`<article class="card" data-trip="${t.id}"><div class="cardhead"><div><h3>🛒 ${esc(t.name)}</h3><span class="pill">${t.items.filter(i=>i.checked).length}/${t.items.length} in cart</span></div><div class="itemactions">${button('💰 Budget','editBudget')}${button('🗑️ Delete','deleteTrip','mini danger')}</div></div>${[...new Set(t.items.map(i=>i.storeId))].map(sid=>`<div class="tripstore"><h4>🏪 ${esc(sid==='other'?'One-time items':storeName(sid))}</h4><ul class="items">${t.items.filter(i=>i.storeId===sid).map(i=>`<li class="itemrow ${i.checked?'checked':''}" data-item="${i.id}"><label class="iteminfo check"><input type="checkbox" data-action="toggleItem" ${i.checked?'checked':''}><span><strong>${esc(i.name)}</strong><small>Aisle: ${esc(i.aisle||'Not set')} • Qty: ${i.qty} • ${money(i.price)} each</small></span></label><div class="itemactions"><strong>${money(itemTotal(i))}</strong>${button('✏️','editTripItem')}${button('✕','deleteTripItem','mini danger')}</div></li>`).join('')}</ul></div>`).join('')}<div class="trip-budget">${budgetHtml(t)}</div><div class="totalrow"><span>Estimated: ${money(total(t.items))}<br><small class="muted">In cart: ${money(total(t.items.filter(i=>i.checked)))}</small></span><div class="itemactions">${button('+ One-time item','addTripItem')}${button('✓ Finish trip','finishTrip','mini')}</div></div></article>`).join(''):empty('No active trips. Create a trip from your saved store lists! 🛒');
byId('historyCards').innerHTML=db.history.length?db.history.map(h=>`<article class="card" data-history="${h.id}"><div class="cardhead"><div><h3>🧾 ${esc(h.name)}</h3><small class="muted">${esc(h.date)}</small></div>${button('🗑️','deleteHistory','mini danger')}</div><p>${h.items.length} items • ${h.items.filter(i=>i.checked).length} checked off</p><div class="totalrow"><span>Estimated: ${money(h.estimated)}${budgetValue(h)!==null?`<br><small class="muted">Budget: ${money(budgetValue(h))}</small>`:''}</span><strong>Actual: ${money(h.actual)}</strong></div></article>`).join(''):empty('Your finished shopping trips will appear here. 🧾');
}
// Styled, accessible confirmation dialog. Cancel, Escape and backdrop never delete data.
const confirmDialog=byId('confirmDialog');
function askConfirm(message,{title='Are you sure?',confirmLabel='Delete',danger=true}={}){
  return new Promise(resolve=>{
    const accept=byId('confirmAccept'),cancel=byId('confirmCancel');
    byId('confirmTitle').textContent=title;
    byId('confirmMessage').textContent=message;
    accept.textContent=confirmLabel;
    accept.className=danger?'danger':'';
    let settled=false;
    const finish=value=>{if(settled)return;settled=true;confirmDialog.close();resolve(value);};
    accept.onclick=()=>finish(true);
    cancel.onclick=()=>finish(false);
    const onCancel=e=>{e.preventDefault();finish(false);};
    const onClick=e=>{if(e.target===confirmDialog)finish(false);};
    confirmDialog.addEventListener('cancel',onCancel,{once:true});
    confirmDialog.addEventListener('click',onClick);
    confirmDialog.addEventListener('close',()=>{confirmDialog.removeEventListener('cancel',onCancel);confirmDialog.removeEventListener('click',onClick);if(!settled){settled=true;resolve(false);}},{once:true});
    confirmDialog.showModal();
    cancel.focus();
  });
}
const dlg=byId('editor'), form=byId('editorForm');let onSave=null;
function field(name,label,value='',type='text',extra=''){return `<label class="field">${label}<input name="${name}" type="${type}" value="${esc(value)}" ${extra} required></label>`;}
function edit(title,fields,handler){byId('editorTitle').textContent=title;byId('editorFields').innerHTML=fields;onSave=handler;dlg.showModal();}
form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;const v=Object.fromEntries(new FormData(form));try{onSave(v);dlg.close();save();}catch(err){alert(err.message);}});
byId('cancelEditor').onclick=()=>dlg.close();
const itemFields=i=>field('name','Item name',i?.name||'')+field('qty','Quantity',i?.qty??1,'number','min="0.01" step="0.01"')+field('price','Estimated price per item ($)',i?.price??0,'number','min="0" step="0.01"')+field('aisle','Aisle / location',i?.aisle||'','text','');
function makeItem(v,storeId,original){return {id:original?.id||uid(),storeId,name:v.name.trim(),qty:Number(v.qty),price:Number(v.price),aisle:v.aisle.trim(),checked:original?.checked||false};}
byId('addStore').onclick=()=>edit('🏪 Add Store',field('name','Store name'),v=>{if(!v.name.trim())throw Error('Enter a store name.');db.stores.push({id:uid(),name:v.name.trim(),items:[]});});
byId('addTrip').onclick=()=>{if(!db.stores.length)return alert('Create a store first!');edit('🛒 New Shopping Trip',field('name','Trip name','My Grocery Run')+field('budget','Optional trip budget ($)','','number','min="0" step="0.01"') .replace(' required>','>')+db.stores.map(s=>`<label class="check"><input type="checkbox" name="store_${s.id}" checked> ${esc(s.name)} (${s.items.length} saved items)</label>`).join(''),v=>{const ids=db.stores.filter(s=>v['store_'+s.id]==='on');if(!ids.length)throw Error('Choose at least one store.');db.trips.unshift({id:uid(),name:v.name.trim()||'Shopping Trip',budget:v.budget===''?null:Number(v.budget),items:ids.flatMap(s=>s.items.map(i=>({...i,id:uid(),storeId:s.id,checked:false})))});});};
document.addEventListener('click',async e=>{const b=e.target.closest('[data-action]');if(!b||b.matches('input'))return;const action=b.dataset.action;const storeEl=b.closest('[data-store]'),tripEl=b.closest('[data-trip]'),historyEl=b.closest('[data-history]'),itemEl=b.closest('[data-item]');const s=db.stores.find(x=>x.id===storeEl?.dataset.store),t=db.trips.find(x=>x.id===tripEl?.dataset.trip),h=db.history.find(x=>x.id===historyEl?.dataset.history);const i=s?.items.find(x=>x.id===itemEl?.dataset.item),ti=t?.items.find(x=>x.id===itemEl?.dataset.item);
switch(action){case 'renameStore':edit('Rename Store',field('name','Store name',s.name),v=>s.name=v.name.trim());break;
case 'deleteStore':if(await askConfirm('Delete this permanent store list? Existing trips will be kept.',{title:'Delete store?'})){ db.stores=db.stores.filter(x=>x!==s);save();}break;
case 'addItem':edit('Add Grocery Item',itemFields(),v=>s.items.push(makeItem(v,s.id)));break;
case 'editItem':edit('Edit Grocery Item',itemFields(i),v=>Object.assign(i,makeItem(v,s.id,i)));break;
case 'deleteItem':if(await askConfirm('Remove this saved item?',{title:'Remove item?',confirmLabel:'Remove'})){ s.items=s.items.filter(x=>x!==i);save();}break;
case 'editBudget':edit('💰 Trip Budget',field('budget','Optional trip budget ($)',budgetValue(t)??'','number','min="0" step="0.01"').replace(' required>','>'),v=>{t.budget=v.budget===''?null:Number(v.budget);});break;
case 'deleteTrip':if(await askConfirm('Delete this active trip?',{title:'Delete trip?'})){ db.trips=db.trips.filter(x=>x!==t);save();}break;
case 'addTripItem':edit('One-time Trip Item',itemFields(),v=>t.items.push(makeItem(v,'other')));break;
case 'editTripItem':edit('Edit Trip Item',itemFields(ti),v=>Object.assign(ti,makeItem(v,ti.storeId,ti)));break;
case 'deleteTripItem':t.items=t.items.filter(x=>x!==ti);save();break;
case 'finishTrip':edit('Finish Shopping Trip',field('actual','Actual amount spent ($)',total(t.items.filter(x=>x.checked)).toFixed(2),'number','min="0" step="0.01"'),v=>{db.history.unshift({...t,date:new Date().toLocaleDateString(),estimated:total(t.items),actual:Number(v.actual),id:uid()});db.trips=db.trips.filter(x=>x!==t);});break;
case 'deleteHistory':if(await askConfirm('Delete this history entry?',{title:'Delete history entry?'})){ db.history=db.history.filter(x=>x!==h);save();}break;
}});
document.addEventListener('change',e=>{if(e.target.dataset.action==='toggleItem'){const t=db.trips.find(x=>x.id===e.target.closest('[data-trip]')?.dataset.trip);const i=t?.items.find(x=>x.id===e.target.closest('[data-item]')?.dataset.item);if(i){i.checked=e.target.checked;save();}}});
document.querySelectorAll('nav button').forEach(b=>b.onclick=()=>{document.querySelectorAll('nav button').forEach(x=>x.classList.toggle('active',x===b));document.querySelectorAll('.page').forEach(x=>x.classList.toggle('hidden',x.id!==b.dataset.tab));});
byId('backup').onclick=()=>{const blob=new Blob([JSON.stringify({format:'ESSAzLife Groceriez',version:1,data:db},null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='groceriez-backup-'+new Date().toISOString().slice(0,10)+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
byId('restore').onchange=async e=>{const f=e.target.files[0];if(!f)return;try{const obj=JSON.parse(await f.text());const d=obj.data;if(obj.format!=='ESSAzLife Groceriez'||!d||!Array.isArray(d.stores)||!Array.isArray(d.trips)||!Array.isArray(d.history))throw Error('This is not a valid Groceriez backup.');if(await askConfirm('Restore backup? This replaces your current Groceriez data.',{title:'Restore backup?',confirmLabel:'Restore',danger:false})){ db=d;save();alert('Backup restored!');}}catch(err){alert('Restore failed: '+err.message);}e.target.value='';};
if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker.js').catch(console.warn));render();
