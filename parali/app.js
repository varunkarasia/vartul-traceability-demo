/* Illustrative parali supply lineage. No device connection, camera or backend. */
(() => {
 const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
 const reduced = matchMedia('(prefers-reduced-motion: reduce)');
 const nodes = [
 {
  "id": "source",
  "label": "Field collection",
  "kind": "Source reference",
  "code": "SRC–014",
  "x": 10,
  "y": 20.4,
  "title": "Keep the field source visible.",
  "status": "Collection document missing",
  "gap": true,
  "text": "The sample source register identifies SRC–014 as the collection origin for paddy-straw lot PL–024. Its supporting field collection document is not attached.",
  "fields": [
   [
    "Material",
    "Paddy straw / parali"
   ],
   [
    "Linked lot",
    "PL–024"
   ],
   [
    "Evidence gap",
    "Field collection document"
   ]
  ]
 },
 {
  "id": "bales",
  "label": "Baling & identity",
  "kind": "Bale lot",
  "code": "PL–024",
  "x": 35,
  "y": 20.4,
  "title": "A tag connects the physical bale.",
  "status": "Sample bale register",
  "text": "Bale tag BL–024–A links to collection lot PL–024 and source reference SRC–014. It illustrates how the lot identity can travel with the straw.",
  "fields": [
   [
    "Sample tag",
    "BL–024–A"
   ],
   [
    "Source link",
    "SRC–014 → PL–024"
   ],
   [
    "Capture event",
    "Identifier linked / illustrative"
   ]
  ]
 },
 {
  "id": "storage",
  "label": "Aggregation",
  "kind": "Storage handoff",
  "code": "AG–024",
  "x": 60,
  "y": 20.4,
  "title": "A stack with its lot intact.",
  "status": "Sample storage record",
  "text": "The aggregation record links lot PL–024 to a sample storage bay and its issue to vehicle load LD–024. No stock quantity or storage duration is supplied.",
  "fields": [
   [
    "Lot received",
    "PL–024"
   ],
   [
    "Storage reference",
    "AG–024 / sample Bay A"
   ],
   [
    "Issued to",
    "Load LD–024"
   ]
  ]
 },
 {
  "id": "load",
  "label": "Vehicle & load",
  "kind": "Transport handoff",
  "code": "LD–024",
  "x": 85,
  "y": 20.4,
  "title": "Follow the load, not just the truck.",
  "status": "Carrier acknowledgment pending",
  "gap": true,
  "text": "Load LD–024 links the straw lot to illustrative vehicle reference VH–07 and the plant delivery. A carrier handoff acknowledgment is not attached; no live location is represented.",
  "fields": [
   [
    "Lot → load",
    "PL–024 → LD–024"
   ],
   [
    "Vehicle reference",
    "VH–07 / illustrative"
   ],
   [
    "Evidence gap",
    "Carrier handoff acknowledgment"
   ]
  ]
 },
 {
  "id": "weighbridge",
  "label": "Weighbridge",
  "kind": "Receipt evidence",
  "code": "WB–024",
  "x": 85,
  "y": 61.2,
  "title": "A weight receipt belongs to a load.",
  "status": "Sample receipt linked",
  "text": "WB–024 is linked to load LD–024 and vehicle reference VH–07. The example demonstrates receipt linkage; gross, tare and net weight values are not supplied.",
  "fields": [
   [
    "Linked load",
    "LD–024 / VH–07"
   ],
   [
    "Receipt reference",
    "WB–024"
   ],
   [
    "Weight values",
    "Not supplied in this demo"
   ]
  ]
 },
 {
  "id": "quality",
  "label": "Intake quality",
  "kind": "Receiving check",
  "code": "QC–024",
  "x": 60,
  "y": 84.7,
  "title": "Keep the check with the delivery.",
  "status": "Sample intake record attached",
  "text": "The sample intake record links a moisture-check context to load LD–024. No measured moisture value, threshold, instrument accuracy or calibration assurance is asserted.",
  "fields": [
   [
    "Load checked",
    "LD–024"
   ],
   [
    "Record reference",
    "QC–024 / intake check"
   ],
   [
    "Measured result",
    "Not supplied in this demo"
   ]
  ]
 },
 {
  "id": "delivery",
  "label": "Plant acceptance",
  "kind": "Feedstock delivery",
  "code": "DEL–024",
  "x": 35,
  "y": 61.2,
  "title": "Received at the plant, linked to the field.",
  "status": "Accepted for intake / sample record",
  "text": "DEL–024 illustrates a plant feedstock acceptance record linking the load, weighbridge receipt and intake-quality record. Upstream evidence gaps remain open. This is feedstock receipt, not evidence of gas production.",
  "fields": [
   [
    "Load received",
    "LD–024 ← PL–024"
   ],
   [
    "Intake evidence",
    "WB–024 + QC–024"
   ],
   [
    "Upstream review",
    "Collection document and carrier acknowledgment missing"
   ]
  ]
 }
];
 const edges = [['source','bales'],['bales','storage'],['storage','load'],['load','weighbridge'],['load','quality'],['weighbridge','delivery'],['quality','delivery']];
 const byId = Object.fromEntries(nodes.map(n=>[n.id,n]));
 let visible = new Set(['delivery']), selected = 'delivery', timer = null, step = -1, elapsed = 0, last = 0, scanPaused = false, motionPaused = reduced.matches;
 const phases = [
 {
  "ids": [
   "delivery"
  ],
  "title": "DEL–024 identified.",
  "copy": "Start with the sample plant acceptance record for the straw delivery.",
  "select": "delivery"
 },
 {
  "ids": [
   "weighbridge",
   "quality"
  ],
  "title": "The intake evidence.",
  "copy": "Weighbridge receipt WB–024 and intake check QC–024 connect to the same load.",
  "select": "delivery"
 },
 {
  "ids": [
   "load"
  ],
  "title": "Back to the vehicle load.",
  "copy": "LD–024 links the vehicle reference and lot. Carrier acknowledgment remains pending.",
  "select": "load"
 },
 {
  "ids": [
   "storage"
  ],
  "title": "Through aggregation.",
  "copy": "AG–024 connects the stored lot to its outbound load.",
  "select": "storage"
 },
 {
  "ids": [
   "bales"
  ],
  "title": "The bale keeps its identity.",
  "copy": "Tag BL–024–A belongs to collection lot PL–024.",
  "select": "bales"
 },
 {
  "ids": [
   "source"
  ],
  "title": "At the field source.",
  "copy": "SRC–014 is the source reference. Its supporting collection document is still missing.",
  "select": "source"
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
  $('#scan-kicker').textContent=scanned?'REVERSE TRACE COMPLETE':'SAMPLE RECORDS OPEN';$('#scan-heading').textContent=scanned?'From receipt to field.':'Explore the connected records.';$('#scan-copy').textContent='Review the field source, bale lot, transport and intake records. Keep the evidence gaps in view.';
  $$('.scan-steps li').forEach(li=>{li.classList.add('revealed');li.classList.remove('current');});select('delivery');$('#scan-announcement').textContent=scanned?'Reverse trace complete. The source, load and intake records are available for review.':'All sample records are available for review.';
 }
 function phase(i){
  step=i;phases[i].ids.forEach(id=>visible.add(id));$('#trace').dataset.scanPhase=String(i);$('#trace').dataset.scanState='tracing';$('#scan-heading').textContent=phases[i].title;$('#scan-copy').textContent=phases[i].copy;$('#scan-kicker').textContent=`REVERSE TRACE / 0${i+1} OF 06`;
  $$('.scan-steps li').forEach((li,j)=>{li.classList.toggle('revealed',j<=i);li.classList.toggle('current',j===i);});select(phases[i].select);$('#scan-announcement').textContent=phases[i].title;
 }
 function start(){
  stopTimer();visible=new Set();scanPaused=false;elapsed=0;phase(0);$('#trace').classList.add('scan-open');$('#trace').dataset.traceOrder='delivery → weighbridge + quality → vehicle load → aggregation → bale lot → field source';$('#scan-start').innerHTML='Restart scan <span>↻</span>';$('#scan-skip').disabled=false;$('#scan-skip').textContent='Show full trace';
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
 addEventListener('scroll',()=>{if(!scrollPending){scrollPending=true;requestAnimationFrame(updateScene);}},{passive:true});addEventListener('resize',updateScene);updateScene();select('delivery');$('#trace').dataset.scanState='ready';
})();
