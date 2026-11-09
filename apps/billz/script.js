'use strict';
(() => {
  const KEY = 'essazlife_billz_v1';
  const BUDDIES = [
    ['boba','Boba'],['brisket','Brisket'],['coolant','Coolant'],['daisybelle','DaisyBelle'],
    ['lily','Lily'],['Maple','Maple'],['mocha','Mocha'],['MooCow','MooCow'],
    ['moose','Moose'],['mudpie','Mudpie'],['oreo','Oreo'],['pepper','Pepper'],
    ['pumpkin','Pumpkin'],['stormy','Stormy'],['tiny','Tiny'],['tracker','Tracker'],
    ['trouble','Trouble'],['wilbur','Wilbur']
  ];
  const $ = id => document.getElementById(id);
  const money = n => new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(n);
  const today = () => { const d = new Date(); return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-'); };
  const formatDate = iso => iso ? new Date(iso+'T12:00:00').toLocaleDateString('en-US',{year:'numeric',month:'short',day:'numeric'}) : 'No date';
  const uuid = () => typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const defaultState = () => ({version:1,paychecks:[],recurring:[],selectedId:null,settings:{buddy:'MooCow',buddyEnabled:true,reduceMotion:false}});
  let state = defaultState();
  let editing = {type:'paycheck',id:null};
  let pendingConfirm = null;
  let toastTimeout;
  const finiteAmount = value => typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 999999999 && Math.abs(Math.round(value*100)-value*100) < 0.000001;
  const validDate = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value+'T12:00:00')) && new Date(value+'T12:00:00').toISOString().slice(0,10) === value;
  function validateBackup(input) {
    if (!input || typeof input !== 'object' || input.version !== 1 || !Array.isArray(input.paychecks) || input.paychecks.length > 10000) throw Error('Not a supported Billz backup.');
    const ids = new Set();
    const cleaned = input.paychecks.map(p => {
      if (!p || typeof p.id !== 'string' || !p.id || ids.has(p.id) || !validDate(p.date) || !finiteAmount(p.amount) || typeof p.note !== 'string' || p.note.length > 100 || !Array.isArray(p.bills) || p.bills.length > 10000) throw Error('Invalid paycheck information in backup.');
      ids.add(p.id);
      const billIds = new Set();
      const bills = p.bills.map(b => {
        if (!b || typeof b.id !== 'string' || !b.id || billIds.has(b.id) || typeof b.name !== 'string' || !b.name.trim() || b.name.length > 100 || !['Need','Want'].includes(b.priority) || !validDate(b.due) || !finiteAmount(b.amount) || typeof b.paid !== 'boolean') throw Error('Invalid bill information in backup.');
        billIds.add(b.id);
        return {id:b.id,name:b.name,priority:b.priority,due:b.due,amount:b.amount,paid:b.paid,recurringId:typeof b.recurringId==='string'?b.recurringId:null};
      });
      return {id:p.id,date:p.date,amount:p.amount,overdraft:finiteAmount(p.overdraft)?p.overdraft:0,note:p.note,bills};
    });
    const frequencies=['weekly','biweekly','monthly','quarterly','yearly'];
    if(input.recurring!==undefined && (!Array.isArray(input.recurring)||input.recurring.length>10000))throw Error('Invalid recurring bills.');
    const recurringIds=new Set();
    const recurring=(input.recurring||[]).map(r=>{
      if(!r||typeof r.id!=='string'||!r.id||recurringIds.has(r.id)||typeof r.name!=='string'||!r.name.trim()||r.name.length>100||!['Need','Want'].includes(r.priority)||!validDate(r.start)||!finiteAmount(r.amount)||!frequencies.includes(r.frequency))throw Error('Invalid recurring bill information.');
      recurringIds.add(r.id);
      return {id:r.id,name:r.name,priority:r.priority,start:r.start,amount:r.amount,frequency:r.frequency};
    });
    const settings = input.settings || {};
    const buddy = BUDDIES.some(([file])=>file === settings.buddy) ? settings.buddy : 'MooCow';
    return {version:1,paychecks:cleaned,recurring,selectedId:cleaned.some(p=>p.id === input.selectedId) ? input.selectedId : (cleaned[0]?.id || null),settings:{buddy,buddyEnabled:settings.buddyEnabled !== false,reduceMotion:settings.reduceMotion === true}};
  }
  function load() {
    try { const raw = localStorage.getItem(KEY); if(raw) state = validateBackup(JSON.parse(raw)); }
    catch(e) { console.warn('Billz saved data could not be loaded:',e); alert('Saved Billz data could not be read. Your existing storage has not been overwritten. Export or inspect your browser storage before making changes.'); throw e; }
  }
  function save() { try {localStorage.setItem(KEY,JSON.stringify(state)); return true;} catch(e) { alert('Could not save Billz data. Browser storage may be full or blocked. Please export a backup if possible.'); return false; } }
  function commit(change) {const previous = structuredClone(state); change(); if (!save()) {state=previous;render();return false;} render();return true;}
  const selected = () => state.paychecks.find(p=>p.id===state.selectedId) || null;
  const sum = (arr, predicate=()=>true) => Math.round(arr.filter(predicate).reduce((t,b)=>t+Math.round(b.amount*100),0))/100;
  const totals = p => ({planned:sum(p.bills),paid:sum(p.bills,b=>b.paid),unpaid:sum(p.bills,b=>!b.paid)});
  function notify(message) {const toast=$('toast');toast.textContent=message;toast.classList.add('show');clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>toast.classList.remove('show'),3000);}
  function el(tag, className, text) {const node=document.createElement(tag);if(className)node.className=className;if(text!==undefined)node.textContent=text;return node;}
  function button(label, className, handler, title) {const b=el('button',className,label);b.type='button';if(title)b.title=title;b.addEventListener('click',handler);return b;}
  function render() {renderBudget();renderStatistics();renderHistory();renderProfile();}
  function renderBudget() {
    const p=selected();
    const picker=$('paycheckSelect');picker.replaceChildren();
    [...state.paychecks].sort((a,b)=>b.date.localeCompare(a.date)).forEach(item=>{const o=new Option(`${formatDate(item.date)} · ${money(item.amount)}${item.note?' · '+item.note:''}`,item.id);picker.add(o);});
    if(p)picker.value=p.id;
    $('budgetContent').hidden=!p;$('noPaychecks').hidden=!!p;
    $('editPaycheckBtn').disabled=!p;$('deletePaycheckBtn').disabled=!p;
    if(!p)return;
    renderRecurringSuggestions(p);
    const t=totals(p);
    $('incomeTotal').textContent=money(p.amount);$('plannedTotal').textContent=money(t.planned);$('paidTotal').textContent=money(t.paid);
    $('remainingTotal').textContent=money(p.amount-(p.overdraft||0)-t.planned);$('remainingTotal').classList.toggle('negative',p.amount<(p.overdraft||0)+t.planned);
    $('unpaidSummary').textContent=`Still unpaid: ${money(t.unpaid)}`;
    $('cashSummary').textContent=`After payments made: ${money(p.amount-(p.overdraft||0)-t.paid)}`;
    const filter=$('billFilter').value, sort=$('billSort').value;
    let bills=p.bills.filter(b=>filter==='all'||(filter==='need'&&b.priority==='Need')||(filter==='want'&&b.priority==='Want')||(filter==='paid'&&b.paid)||(filter==='unpaid'&&!b.paid));
    bills=[...bills].sort((a,b)=>sort==='amount'?b.amount-a.amount:sort==='priority'?(a.priority==='Need'?0:1)-(b.priority==='Need'?0:1)||a.due.localeCompare(b.due):a.due.localeCompare(b.due));
    const list=$('billList');list.replaceChildren();
    const overdraftRow=el('article','bill-card overdraft-bill-row');
    const overdraftMain=el('div','bill-main');
    overdraftMain.append(el('div','bill-title','Overdraft amount'),el('p','overdraft-subtext','This will be paid before anything.'));
    const overdraftActions=el('div','bill-actions');
    overdraftActions.append(el('span','bill-amount negative','−'+money(p.overdraft||0)),button('✎ Edit','btn secondary',()=>openEntry('paycheck',p.id),'Edit overdraft amount'));
    overdraftRow.append(overdraftMain,overdraftActions);list.append(overdraftRow);
    if(!bills.length){const empty=el('div','empty-state');empty.append(el('div','empty-emoji','🧾'),el('h2','',p.bills.length?'No bills match this filter':'No bills assigned yet'),el('p','',p.bills.length?'Try another filter.':'Add a bill to this paycheck to get started.'));list.append(empty);return;}
    for(const bill of bills){
      const card=el('article','bill-card'+(bill.paid?' paid':''));
      const main=el('div','bill-main'), meta=el('div','bill-meta');
      const priority=el('span','priority '+bill.priority.toLowerCase(),bill.priority);
      const due=el('span',!bill.paid&&bill.due<today()?'overdue':'',`Due ${formatDate(bill.due)}${!bill.paid&&bill.due<today()?' · Overdue':''}`);
      meta.append(priority,due);if(bill.recurringId)meta.append(el('span','', '🔁 Recurring'));main.append(el('div','bill-title',bill.name),meta);
      const actions=el('div','bill-actions');actions.append(el('span','bill-amount',money(bill.amount)));
      actions.append(button(bill.paid?'✅ Paid':'❌ Unpaid','status-btn'+(bill.paid?' is-paid':''),()=>{if(commit(()=>{bill.paid=!bill.paid;}))notify('Bill status updated!');},'Toggle payment status'));
      actions.append(button('✎','mini-btn',()=>openEntry('bill',bill.id),'Edit bill'));
      actions.append(button('🗑','mini-btn delete',()=>confirmAction('Delete bill?',`Delete “${bill.name}” from this paycheck?`,()=>{if(commit(()=>{p.bills=p.bills.filter(b=>b.id!==bill.id);}))notify('Bill deleted.');}),'Delete bill'));
      card.append(main,actions);list.append(card);
    }
  }

  // Due-date arithmetic uses UTC calendar dates, avoiding daylight-saving shifts.
  const dateUTC = iso => new Date(iso+'T12:00:00Z');
  const isoUTC = d => d.toISOString().slice(0,10);
  function occurrenceDate(start,frequency,index){
    const original=dateUTC(start),d=new Date(original);
    if(frequency==='weekly'||frequency==='biweekly')d.setUTCDate(d.getUTCDate()+index*(frequency==='weekly'?7:14));
    else {
      const months=frequency==='monthly'?1:frequency==='quarterly'?3:12;
      d.setUTCDate(1);d.setUTCMonth(d.getUTCMonth()+index*months);
      const last=new Date(Date.UTC(d.getUTCFullYear(),d.getUTCMonth()+1,0)).getUTCDate();
      d.setUTCDate(Math.min(original.getUTCDate(),last));
    }
    return isoUTC(d);
  }
  function renderRecurringSuggestions(p){
    const area=$('recurringSuggestions');area.replaceChildren();
    const days=Number($('recurringRange').value)||30;
    const cutoff=new Date(dateUTC(p.date));cutoff.setUTCDate(cutoff.getUTCDate()+days);
    const end=isoUTC(cutoff),suggestions=[];
    for(const r of state.recurring){
      // Up to 600 occurrences is sufficient for the 1-year selection window.
      for(let i=0;i<600;i++){
        const due=occurrenceDate(r.start,r.frequency,i);
        if(due>end)break;
        if(due<p.date)continue;
        if(p.bills.some(b=>b.recurringId===r.id&&b.due===due))continue;
        suggestions.push({r,due});
      }
    }
    suggestions.sort((a,b)=>a.due.localeCompare(b.due)||a.r.name.localeCompare(b.r.name));
    if(!suggestions.length){area.append(el('p','muted',state.recurring.length?'No unassigned recurring bills in this date range.':'No recurring schedules yet. Check “Repeat this bill” when adding a bill.'));return;}
    for(const {r,due} of suggestions.slice(0,60)){
      const line=el('div','recurring-suggestion'),info=el('div');
      info.append(el('strong','',r.name+' · '+money(r.amount)),el('small','',r.priority+' · Due '+formatDate(due)+' · '+r.frequency));
      line.append(info,button('+ Assign','btn secondary',()=>{
        if(commit(()=>p.bills.push({id:uuid(),name:r.name,priority:r.priority,due,amount:r.amount,paid:false,recurringId:r.id}))){$('entryDialog').close();notify('Recurring bill assigned to this paycheck.');}
      }));area.append(line);
    }
    if(suggestions.length>60)area.append(el('p','muted','Showing the first 60 occurrences. Choose a shorter date range to narrow the list.'));
  }
  function renderStatistics(){
    const paychecks=state.paychecks;
    $('statsEmpty').hidden=paychecks.length>0;
    $('statsContent').hidden=paychecks.length===0;
    if(!paychecks.length)return;
    const income=Math.round(paychecks.reduce((t,p)=>t+Math.round(p.amount*100),0))/100;
    const allBills=paychecks.flatMap(p=>p.bills);
    const need=sum(allBills,b=>b.priority==='Need');
    const want=sum(allBills,b=>b.priority==='Want');
    const paid=sum(allBills,b=>b.paid);
    const unpaid=sum(allBills,b=>!b.paid);
    const overdrafts=Math.round(paychecks.reduce((t,p)=>t+Math.round((p.overdraft||0)*100),0))/100;
    const planned=need+want;
    const pct=n=>income>0?100*n/income:0;
    const visibleNeed=income>0?Math.min(100,pct(need)):0;
    const visibleWant=income>0?Math.min(100-visibleNeed,pct(want)):0;
    const label=n=>income>0?n.toFixed(1)+'%':'N/A';
    $('statsNeed').textContent=money(need)+' · '+label(pct(need));
    $('statsWant').textContent=money(want)+' · '+label(pct(want));
    $('statsRemaining').textContent=money(Math.max(0,income-planned))+' · '+label(Math.max(0,100-pct(planned)));
    $('statsCenter').textContent=label(pct(planned));
    $('statsDonut').style.background=`conic-gradient(#ec4899 0% ${visibleNeed}%,#3b82f6 ${visibleNeed}% ${visibleNeed+visibleWant}%,#e5e7eb ${visibleNeed+visibleWant}% 100%)`;
    $('statsDonut').setAttribute('aria-label',`All-time income ${money(income)}, needs ${money(need)}, wants ${money(want)}, unallocated ${money(Math.max(0,income-planned))}.`);
    const summary=$('lifetimeTotals');summary.replaceChildren();
    [['Paychecks',String(paychecks.length)],['Total income',money(income)],['Needs',money(need)],['Wants',money(want)],['Overdrafts',money(overdrafts)],['Paid bills',money(paid)],['Unpaid bills',money(unpaid)],['After overdrafts & bills',money(income-overdrafts-planned)]].forEach(([name,value])=>{
      const item=el('div','lifetime-stat');item.append(el('span','',name),el('strong',name==='Overdrafts'?'negative':'',value));summary.append(item);
    });
    $('statsOverBudget').hidden=planned+overdrafts<=income;
    $('statsOverBudget').textContent=planned+overdrafts>income?'⚠️ Planned bills and overdrafts exceed all-time income by '+money(planned+overdrafts-income)+'.':'';
  }

  function renderHistory(){
    const list=$('historyList');list.replaceChildren();
    const q=$('historySearch').value.trim().toLowerCase();
    const paychecks=[...state.paychecks].sort((a,b)=>b.date.localeCompare(a.date))
      .filter(p=>`${formatDate(p.date)} ${p.date} ${p.note}`.toLowerCase().includes(q));
    if(!paychecks.length){
      const empty=el('div','empty-state');
      empty.append(el('div','empty-emoji','📜'),el('h2','',state.paychecks.length?'No matching paychecks':'Your history is empty'),
        el('p','',state.paychecks.length?'Try a different search.':'Create your first paycheck in Budget to begin.'));
      list.append(empty);return;
    }
    const dayDiff=(date)=>{
      const a=dateUTC(today()),b=dateUTC(date);
      return Math.round((b-a)/86400000);
    };
    for(const p of paychecks){
      const t=totals(p),overdraft=p.overdraft||0;
      const need=sum(p.bills,b=>b.priority==='Need'),want=sum(p.bills,b=>b.priority==='Want');
      const remaining=p.amount-overdraft-t.planned;
      const card=el('article','history-card dashboard-card');
      const head=el('div','history-card-head');
      const heading=el('div');
      heading.append(el('h2','',formatDate(p.date)),el('small','',p.note||'Paycheck'));
      const balance=el('div','history-remaining-balance');
      balance.append(el('span','','Left After Overdraft & Bills'),el('strong',remaining<0?'negative':'',money(remaining)),el('small','',`Original paycheck: ${money(p.amount)}`));
      const countdown=el('div','payday-countdown');
      const days=dayDiff(p.date);
      countdown.append(el('span','','Days Until PayDay'),
        el('strong','',days>0?String(days):days===0?'PayDay!':'Date passed'));
      const right=el('div','history-head-right');right.append(balance,countdown);
      head.append(heading,right);card.append(head);

      const chartRow=el('div','history-chart-row');
      const chart=el('div','mini-donut');
      const chartLabel=el('div','mini-donut-center');
      const allocated=p.amount>0?((need+want)/p.amount)*100:0;
      const needFill=p.amount>0?Math.min(100,100*need/p.amount):0;
      const wantFill=p.amount>0?Math.min(100-needFill,100*want/p.amount):0;
      chart.style.background=`conic-gradient(#ec4899 0% ${needFill}%,#3b82f6 ${needFill}% ${needFill+wantFill}%,#e5e7eb ${needFill+wantFill}% 100%)`;
      chart.setAttribute('role','img');
      chart.setAttribute('aria-label',`Needs ${money(need)}, wants ${money(want)}, unallocated ${money(Math.max(0,p.amount-need-want))}`);
      chartLabel.append(el('strong','',p.amount>0?allocated.toFixed(1)+'%':'N/A'),el('small','','Allocated'));
      chart.append(chartLabel);
      const legend=el('div','mini-chart-legend');
      const addLegend=(name,value,color)=>{
        const row=el('div','mini-legend-row');
        const title=el('span','');
        const dot=el('i','mini-legend-dot');dot.style.background=color;
        title.append(dot,document.createTextNode(name));
        row.append(title,el('strong','',`${money(value)} · ${p.amount>0?(value/p.amount*100).toFixed(1)+'%':'N/A'}`));
        legend.append(row);
      };
      addLegend('Needs',need,'#ec4899');
      addLegend('Wants',want,'#3b82f6');
      addLegend('Unallocated',Math.max(0,p.amount-need-want),'#9ca3af');
      chartRow.append(chart,legend);card.append(chartRow);


      const numbers=el('div','history-numbers');
      [['Planned bills',t.planned],['Paid',t.paid],['Unpaid',t.unpaid]].forEach(([label,value])=>{
        const n=el('div');n.append(el('span','muted',label),el('strong',value<0?'negative':'',money(value)));numbers.append(n);
      });
      card.append(numbers);
      if(remaining<0)card.append(el('p','overbudget-message',`⚠️ Over budget by ${money(-remaining)}.`));

      const details=el('details','history-details');
      details.append(el('summary','',`View ${p.bills.length} bill${p.bills.length===1?'':'s'} + overdraft`));
      const overdraftDetail=el('div','history-bill overdraft-history-row');
      const overdraftLabel=el('span','');
      overdraftLabel.append(el('strong','','Overdraft amount'),el('small','','This will be paid before anything.'));
      overdraftDetail.append(overdraftLabel,el('strong','negative','−'+money(overdraft)),button('Edit','btn secondary',()=>openEntry('paycheck',p.id)));
      details.append(overdraftDetail);
      for(const b of [...p.bills].sort((a,b)=>a.due.localeCompare(b.due))){
        const row=el('div','history-bill');
        row.append(el('span','',`${b.paid?'✅':'❌'} ${b.name} · ${b.priority}`),
          el('span','',`${money(b.amount)} · ${formatDate(b.due)}`));details.append(row);
      }
      if(!p.bills.length)details.append(el('p','muted','No bills assigned.'));
      card.append(details);
      const actions=el('div','history-actions');
      actions.append(button('Open in Budget','btn secondary',()=>{
        state.selectedId=p.id;save();switchTab('budget');render();
      }));
      actions.append(button('Edit paycheck','btn secondary',()=>openEntry('paycheck',p.id)));
      card.append(actions);list.append(card);
    }
  }
  function renderProfile(){
    const sel=$('buddySelect');if(!sel.options.length)BUDDIES.forEach(([file,name])=>sel.add(new Option(name,file)));
    sel.value=state.settings.buddy;
    const display=BUDDIES.find(([file])=>file===state.settings.buddy)||BUDDIES[7];
    const path=`images/${display[0]}.png`;
    $('buddyPreview').src=path;$('walkingBuddy').src=path;$('buddyName').textContent=display[1];
    $('buddyEnabled').checked=state.settings.buddyEnabled;$('reduceMotion').checked=state.settings.reduceMotion;
    $('buddyLane').hidden=!state.settings.buddyEnabled;
    $('walkingBuddy').classList.toggle('still',state.settings.reduceMotion);
  }
  function switchTab(tab){document.querySelectorAll('.tab').forEach(b=>{const active=b.dataset.tab===tab;b.classList.toggle('active',active);if(active)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});document.querySelectorAll('.page').forEach(p=>{const active=p.id===tab+'Page';p.hidden=!active;p.classList.toggle('active',active);});window.scrollTo({top:0,behavior:'instant'});}
  function openEntry(type,id=null){
    editing={type,id};$('entryForm').reset();$('formError').textContent='';
    $('paycheckFields').hidden=type!=='paycheck';$('billFields').hidden=type!=='bill';
    $('dialogTitle').textContent=`${id?'Edit':'Add'} ${type}`;
    if(type==='paycheck'){
      const p=id?state.paychecks.find(x=>x.id===id):null;
      $('paycheckDate').value=p?.date||today();$('paycheckAmount').value=p?.amount??'';$('paycheckOverdraft').value=p?.overdraft??0;$('paycheckNote').value=p?.note||'';
    } else {
      const b=id?selected()?.bills.find(x=>x.id===id):null;
      $('billName').value=b?.name||'';$('billPriority').value=b?.priority||'Need';$('billDue').value=b?.due||today();$('billAmount').value=b?.amount??'';$('billStatus').value=String(b?.paid??false);$('billRecurring').checked=!!(b?.recurringId&&state.recurring.some(r=>r.id===b.recurringId));const template=state.recurring.find(r=>r.id===b?.recurringId);$('billFrequency').value=template?.frequency||'monthly';$('recurringFields').hidden=!$('billRecurring').checked;
    }
    if(type==='bill' && selected())renderRecurringSuggestions(selected());
    $('entryDialog').showModal();
  }
  function parseAmount(id){const input=$(id),raw=input.value.trim();if(!raw)return null;const n=Number(raw);if(!Number.isFinite(n)||n<0||n>999999999||!/^(?:\d+)(?:\.\d{1,2})?$/.test(raw))return null;return Math.round(n*100)/100;}
  function submitEntry(e){
    e.preventDefault();const {type,id}=editing;
    if(type==='paycheck'){
      const date=$('paycheckDate').value,amount=parseAmount('paycheckAmount'),overdraft=parseAmount('paycheckOverdraft'),note=$('paycheckNote').value.trim();
      if(!validDate(date)||amount===null||overdraft===null){$('formError').textContent='Enter a valid date and nonnegative amount (up to 2 decimal places).';return;}
      const success=commit(()=>{if(id){const p=state.paychecks.find(x=>x.id===id);if(!p)return;p.date=date;p.amount=amount;p.overdraft=overdraft;p.note=note;}else{const p={id:uuid(),date,amount,overdraft,note,bills:[]};state.paychecks.push(p);state.selectedId=p.id;}});
      if(success){$('entryDialog').close();notify(id?'Paycheck updated!':'Paycheck added!');}
    }else{
      const p=selected();if(!p)return;
      const name=$('billName').value.trim(),priority=$('billPriority').value,due=$('billDue').value,amount=parseAmount('billAmount'),paid=$('billStatus').value==='true',repeat=$('billRecurring').checked,frequency=$('billFrequency').value;
      if(!name||!['Need','Want'].includes(priority)||!validDate(due)||amount===null){$('formError').textContent='Enter a bill name, priority, valid due date, and nonnegative amount.';return;}
      const success=commit(()=>{
        let recurringId=null;
        if(repeat){
          // Updating an occurrence changes only this occurrence; its existing template is not changed.
          // New recurring settings create a new schedule for future paycheck suggestions.
          const old=id?p.bills.find(x=>x.id===id):null;
          const existing=state.recurring.find(r=>r.id===old?.recurringId);
          if(existing && existing.name===name && existing.priority===priority && existing.amount===amount && existing.frequency===frequency && existing.start===due){recurringId=existing.id;}
          else{recurringId=uuid();state.recurring.push({id:recurringId,name,priority,start:due,amount,frequency});}
        }
        if(id){const b=p.bills.find(x=>x.id===id);if(!b)return;Object.assign(b,{name,priority,due,amount,paid,recurringId});}
        else p.bills.push({id:uuid(),name,priority,due,amount,paid,recurringId});
      });
      if(success){$('entryDialog').close();notify(id?'Bill updated!':'Bill added!');}
    }
  }
  function confirmAction(title,message,callback){$('confirmTitle').textContent=title;$('confirmMessage').textContent=message;pendingConfirm=callback;$('confirmDialog').showModal();}
  function exportBackup(){
    const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');
    a.href=url;a.download=`ESSAzLife-Billz-backup-${today()}.json`;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);notify('Backup downloaded!');
  }
  async function restoreFile(file){
    if(!file)return;
    try{
      if(file.size>15*1024*1024)throw Error('Backup is too large (15 MB limit).');
      const imported=validateBackup(JSON.parse(await file.text()));
      confirmAction('Restore backup?',`Replace your current ${state.paychecks.length} paycheck(s) with ${imported.paychecks.length} paycheck(s) from this backup? This cannot be undone unless you exported your current data.`,()=>{
        const old=state;state=imported;if(save()){render();switchTab('budget');notify('Backup restored successfully!');}else{state=old;render();}
      });
    }catch(e){alert('Could not restore backup: '+e.message);}finally{$('importFile').value='';}
  }
  function bind(){
    document.querySelectorAll('.tab').forEach(b=>b.addEventListener('click',()=>switchTab(b.dataset.tab)));
    $('togglePaycheckPicker').addEventListener('click',()=>{
      const panel=$('paycheckPicker');
      const opening=panel.hidden;
      panel.hidden=!opening;
      $('togglePaycheckPicker').setAttribute('aria-expanded',String(opening));
      if(opening)$('paycheckSelect').focus();
    });
    $('addPaycheckBtn').addEventListener('click',()=>openEntry('paycheck'));
    $('emptyAddPaycheckBtn').addEventListener('click',()=>openEntry('paycheck'));
    $('editPaycheckBtn').addEventListener('click',()=>{if(selected())openEntry('paycheck',selected().id);});
    $('deletePaycheckBtn').addEventListener('click',()=>{const p=selected();if(!p)return;confirmAction('Delete paycheck?',`Delete the paycheck from ${formatDate(p.date)} and all ${p.bills.length} assigned bill(s)?`,()=>{if(commit(()=>{state.paychecks=state.paychecks.filter(x=>x.id!==p.id);state.selectedId=[...state.paychecks].sort((a,b)=>b.date.localeCompare(a.date))[0]?.id||null;}))notify('Paycheck deleted.');});});
    $('addBillBtn').addEventListener('click',()=>{if(selected())openEntry('bill');});
    $('paycheckSelect').addEventListener('change',e=>{commit(()=>{state.selectedId=e.target.value;});});
    $('billFilter').addEventListener('change',renderBudget);$('billSort').addEventListener('change',renderBudget);
    $('historySearchToggle').addEventListener('click',()=>{
      const panel=$('historySearchPanel');const opening=panel.hidden;
      panel.hidden=!opening;
      $('historySearchToggle').setAttribute('aria-expanded',String(opening));
      if(opening)$('historySearch').focus();
      else { $('historySearch').value='';renderHistory(); }
    });
    $('historySearch').addEventListener('input',renderHistory);$('recurringRange').addEventListener('change',()=>{if(selected())renderRecurringSuggestions(selected());});$('billRecurring').addEventListener('change',e=>{$('recurringFields').hidden=!e.target.checked;});
    $('entryForm').addEventListener('submit',submitEntry);
    $('closeDialog').addEventListener('click',()=>$('entryDialog').close());$('cancelDialog').addEventListener('click',()=>$('entryDialog').close());
    $('confirmCancel').addEventListener('click',()=>$('confirmDialog').close());
    $('confirmAccept').addEventListener('click',()=>{const fn=pendingConfirm;pendingConfirm=null;$('confirmDialog').close();if(fn)fn();});
    $('confirmDialog').addEventListener('close',()=>{pendingConfirm=null;});
    $('buddySelect').addEventListener('change',e=>{if(commit(()=>{state.settings.buddy=e.target.value;}))notify('Buddy selected!');});
    $('buddyEnabled').addEventListener('change',e=>commit(()=>{state.settings.buddyEnabled=e.target.checked;}));
    $('reduceMotion').addEventListener('change',e=>commit(()=>{state.settings.reduceMotion=e.target.checked;}));
    $('exportBtn').addEventListener('click',exportBackup);
    $('importBtn').addEventListener('click',()=>$('importFile').click());
    $('importFile').addEventListener('change',e=>restoreFile(e.target.files?.[0]));
    $('clearDataBtn').addEventListener('click',()=>confirmAction('Delete ALL Billz data?','This permanently deletes every paycheck, bill, payment status, and buddy setting stored in this browser. Export a backup first if you want to keep them.',()=>{const old=state;state=defaultState();if(save()){render();switchTab('budget');notify('Billz data cleared.');}else{state=old;render();}}));
    window.addEventListener('online',updateConnection);window.addEventListener('offline',updateConnection);
  }
  function updateConnection(){$('connectionBadge').textContent=navigator.onLine?'Local & private':'Offline ready';}
  load();bind();render();switchTab('history');updateConnection();
})();
