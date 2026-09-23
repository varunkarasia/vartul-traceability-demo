/* Illustrative precision-engineering lineage. No device connection, camera or backend. */
(() => {
 const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
 const reduced = matchMedia('(prefers-reduced-motion: reduce)');
 const nodes = [
 {
  "id": "stock",
  "label": "Aluminium stock",
  "kind": "Material lot",
  "code": "AL–207",
  "x": 15,
  "y": 24.5,
  "title": "Identity before the first cut.",
  "status": "Supplier material document missing",
  "gap": true,
  "text": "The sample receiving note identifies aluminium lot AL–207 and links it to work order WO–024. The supporting supplier material document has not been attached.",
  "fields": [
   [
    "Material identity",
    "Aluminium stock / AL–207"
   ],
   [
    "Allocated to",
    "Work order WO–024"
   ],
   [
    "Evidence gap",
    "Supplier material document"
   ]
  ]
 },
 {
  "id": "machining",
  "label": "CNC machining",
  "kind": "Work order + event",
  "code": "WO–024 / MC–024",
  "x": 50,
  "y": 24.5,
  "title": "An event with a work-order link.",
  "status": "Sample cycle event attached",
  "text": "The machining record links a completed cycle to WO–024, material lot AL–207 and part PT–024–01. This illustrative event indicates a process step; it does not establish dimensional conformity.",
  "fields": [
   [
    "Input → part",
    "AL–207 → PT–024–01"
   ],
   [
    "Work order",
    "WO–024"
   ],
   [
    "Device event",
    "MC–024 / cycle completed"
   ]
  ]
 },
 {
  "id": "finishing",
  "label": "Deburr & clean",
  "kind": "Process record",
  "code": "FN–024",
  "x": 85,
  "y": 24.5,
  "title": "Keep the finishing step visible.",
  "status": "Sample operation record",
  "text": "The sample finishing record carries the same part identity through edge deburring and cleaning. No coating, heat treatment or special process is implied by this route.",
  "fields": [
   [
    "Part identity",
    "PT–024–01"
   ],
   [
    "Operation record",
    "FN–024 / deburr and clean"
   ],
   [
    "Next step",
    "Dimensional inspection"
   ]
  ]
 },
 {
  "id": "inspection",
  "label": "Dimensional inspection",
  "kind": "Review evidence",
  "code": "IR–024",
  "x": 85,
  "y": 67.3,
  "title": "A report needs a review.",
  "status": "Reviewer sign-off pending",
  "gap": true,
  "text": "IR–024 is linked to this part as a sample inspection document. No measured values or pass/fail result are supplied. Reviewer sign-off remains absent, so this record does not establish release approval.",
  "fields": [
   [
    "Part inspected",
    "PT–024–01"
   ],
   [
    "Document link",
    "IR–024 / dimensional inspection"
   ],
   [
    "Evidence gap",
    "Reviewer sign-off"
   ]
  ]
 },
 {
  "id": "part",
  "label": "Finished component",
  "kind": "Part identity",
  "code": "PT–024–01",
  "x": 50,
  "y": 67.3,
  "title": "A part with its making attached.",
  "status": "Sample part identity",
  "text": "This illustrative aluminium mounting plate carries a single part identifier through machining, finishing and inspection. Its connected records keep both completed steps and open evidence visible.",
  "fields": [
   [
    "Material lot",
    "AL–207"
   ],
   [
    "Work order",
    "WO–024"
   ],
   [
    "Inspection status",
    "IR–024 / review pending"
   ]
  ]
 },
 {
  "id": "dispatch",
  "label": "Dispatch & receipt",
  "kind": "Chain evidence",
  "code": "DN–024",
  "x": 15,
  "y": 67.3,
  "title": "Follow the next handoff.",
  "status": "Receiving confirmation pending",
  "gap": true,
  "text": "A sample dispatch note identifies PT–024–01. Recipient confirmation is not attached. Dispatch is not evidence of acceptance, and the open inspection review remains visible.",
  "fields": [
   [
    "Part dispatched",
    "PT–024–01"
   ],
   [
    "Handoff record",
    "DN–024 / sample dispatch"
   ],
   [
    "Evidence gap",
    "Receiving confirmation"
   ]
  ]
 }
];
 const edges = [['stock','machining'],['machining','finishing'],['finishing','inspection'],['inspection','part'],['part','dispatch']];
 const byId = Object.fromEntries(nodes.map(n=>[n.id,n]));
 let visible = new Set(['part']), selected = 'part', timer = null, step = -1, elapsed = 0, last = 0, scanPaused = false, motionPaused = reduced.matches;
 const phases = [
 {
  "ids": [
   "part"
  ],
  "title": "PT–024–01 identified.",
  "copy": "Start with the finished component and its sample part record.",
  "select": "part"
 },
 {
  "ids": [
   "inspection"
  ],
  "title": "Back through inspection.",
  "copy": "IR–024 is linked to the part. Reviewer sign-off remains pending.",
  "select": "inspection"
 },
 {
  "ids": [
   "finishing"
  ],
  "title": "Deburred and cleaned.",
  "copy": "FN–024 retains the part identity through the finishing operation.",
  "select": "finishing"
 },
 {
  "ids": [
   "machining"
  ],
  "title": "The machining event.",
  "copy": "A sample cycle links WO–024 to the part and its incoming material lot.",
  "select": "machining"
 },
 {
  "ids": [
   "stock"
  ],
  "title": "At the material origin.",
  "copy": "Lot AL–207 supplied the stock. Its supporting material document is still missing.",
  "select": "stock"
 }
];
 $('#network-nodes').innerHTML = nodes.map(n=>`<button class="net-node ${n.gap?'gap':''}" data-id="${n.id}" style="--x:${n.x}%;--y:${n.y}%" aria-pressed="false"><small>${n.kind}</small><strong>${n.label}</strong><span class="node-id">${n.code}</span></button>`).join('');
 function renderNetwork(){
  $$('.net-node').forEach(b=>{const shown=visible.has(b.dataset.id);b.classList.toggle('revealed',shown);b.disabled=!shown;b.setAttribute('aria-pressed',String(b.dataset.id===selected));});
  $$('.edges path').forEach(p=>{const [a,b]=p.dataset.edge.split(' ');p.classList.toggle('revealed',visible.has(a)&&visible.has(b));p.classList.toggle('selected',(a===selected||b===selected)&&visible.has(a)&&visible.has(b));});
 }
 function select(id){
  const n=byId[id]; if(!n)return; selected=id;
  const connected=edges.filter(e=>e.includes(id)).map(e=>e.find(v=>v!==id));
  $('#record-content').innerHTML=`<p class="eyebrow">${n.kind} / ${n.code}</p><h3 id="record-title">${n.title}</h3><p>${n.text}</p><span class="record-state ${n.gap?'gap':''}">${n.gap?'○ ':''}${n.status}</span><dl>${n.fields.map(([k,v])=>`<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl><h4>Linked records</h4><div class="record-links">${connected.map(k=>`<button data-node="${k}">${byId[k].label} ↗</button>`).join('')}</div>`;
  renderNetwork();
 }
 function stopTimer(){if(timer)clearInterval(timer);timer=null;$('#trace').classList.remove('scanning','scan-paused');$('#scan-pause').disabled=true;$('#scan-pause').textContent='Pause';}
 function finish(scanned=false){
  stopTimer();visible=new Set(nodes.map(n=>n.id));$('#trace').dataset.scanState='complete';$('#scan-start').innerHTML='Replay sample scan <span>↗</span>';$('#scan-skip').disabled=true;$('#scan-skip').textContent='Full trace shown';
  $('#scan-kicker').textContent=scanned?'REVERSE TRACE COMPLETE':'SAMPLE RECORDS OPEN';$('#scan-heading').textContent=scanned?'Every step, connected.':'Explore the connected records.';$('#scan-copy').textContent='Review the material, process and inspection records, then follow the open dispatch handoff.';
  $$('.scan-steps li').forEach(li=>{li.classList.add('revealed');li.classList.remove('current');});select('part');$('#scan-announcement').textContent=scanned?'Reverse trace complete. The material and process records are available for review.':'All sample records are available for review.';
 }
 function phase(i){
  step=i;phases[i].ids.forEach(id=>visible.add(id));$('#trace').dataset.scanPhase=String(i);$('#trace').dataset.scanState='tracing';$('#scan-heading').textContent=phases[i].title;$('#scan-copy').textContent=phases[i].copy;$('#scan-kicker').textContent=`REVERSE TRACE / 0${i+1} OF 05`;
  $$('.scan-steps li').forEach((li,j)=>{li.classList.toggle('revealed',j<=i);li.classList.toggle('current',j===i);});select(phases[i].select);$('#scan-announcement').textContent=phases[i].title;
 }
 function start(){
  stopTimer();visible=new Set();scanPaused=false;elapsed=0;phase(0);$('#trace').classList.add('scan-open');$('#trace').dataset.traceOrder='part → inspection → finishing → machining + work order → material lot';$('#scan-start').innerHTML='Restart scan <span>↻</span>';$('#scan-skip').disabled=false;$('#scan-skip').textContent='Show full trace';
  $('#trace').scrollIntoView({block:'start',behavior:motionPaused||reduced.matches?'instant':'smooth'});
  if(reduced.matches||motionPaused){finish(true);return;}
  $('#scan-pause').disabled=false;$('#trace').classList.add('scanning');last=performance.now();timer=setInterval(()=>{const now=performance.now(),delta=now-last;last=now;if(scanPaused||motionPaused||document.hidden)return;elapsed+=delta;if(elapsed>=2100){elapsed=0;if(step<phases.length-1)phase(step+1);else finish(true);}},80);
 }
 $('#scan-start').addEventListener('click',start);$('#scan-skip').addEventListener('click',()=>finish(false));
 $('#scan-pause').addEventListener('click',()=>{scanPaused=!scanPaused;$('#scan-pause').textContent=scanPaused?'Resume':'Pause';$('#trace').classList.toggle('scan-paused',scanPaused);});
 document.addEventListener('click',e=>{
  const b=e.target.closest('[data-node]');if(!b)return;const insideTrace=!!b.closest('#trace');if(!insideTrace||!visible.has(b.dataset.node))finish(false);select(b.dataset.node);
  if(!insideTrace){$('#trace').classList.add('scan-open');$('#record-panel').scrollIntoView({block:'center',behavior:motionPaused||reduced.matches?'instant':'smooth'});$('#record-panel').focus({preventScroll:true});}
 });
 $$('.net-node').forEach(b=>b.addEventListener('click',()=>{select(b.dataset.id);}));
 $$('.capture-trigger').forEach(b=>b.addEventListener('click',()=>{const open=b.getAttribute('aria-expanded')==='true';b.setAttribute('aria-expanded',String(!open));$('#'+b.getAttribute('aria-controls')).hidden=open;}));
 function updateMotion(){document.documentElement.classList.toggle('motion-paused',motionPaused);$('#motion-toggle').setAttribute('aria-pressed',String(motionPaused));$('#motion-toggle').textContent=motionPaused?'Resume motion':'Pause motion';}
 $('#motion-toggle').addEventListener('click',()=>{motionPaused=!motionPaused;updateMotion();});reduced.addEventListener('change',()=>{motionPaused=reduced.matches;updateMotion();if(reduced.matches&&timer)finish(true);});updateMotion();
 let scrollPending=false;function updateScene(){scrollPending=false;const sections=$$('.cinematic');let current=sections[0];for(const section of sections){if(section.getBoundingClientRect().top<innerHeight*.55)current=section;}$$('.scene').forEach(s=>s.classList.toggle('active',s.dataset.scene===current.dataset.photo));}
 addEventListener('scroll',()=>{if(!scrollPending){scrollPending=true;requestAnimationFrame(updateScene);}},{passive:true});addEventListener('resize',updateScene);updateScene();select('part');$('#trace').dataset.scanState='ready';
})();
