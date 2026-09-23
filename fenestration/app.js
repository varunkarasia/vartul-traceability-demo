/* Illustrative fenestration lineage. No device connection, camera or backend. */
(() => {
 const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
 const reduced = matchMedia('(prefers-reduced-motion: reduce)');
 const nodes = [
  {id:'profile',label:'Aluminium profiles',kind:'Material lot',code:'AL–118',x:11,y:20,title:'Start with the profile lot.',status:'Sample receiving note',text:'Incoming aluminium profiles are assigned lot AL–118. The fabrication work order carries this identity into frame FR–024.',fields:[['Received as','Aluminium window profiles'],['Output link','FR–024 / frame fabrication'],['Evidence to review','Receiving note and lot reference']]},
  {id:'sheet',label:'Glass sheets',kind:'Material lot',code:'GL–062',x:11,y:61,title:'A source for every pane.',status:'Supplier document missing',gap:true,text:'The sample receiving note identifies GL–062. Its supplier document is not attached, so the source evidence remains incomplete.',fields:[['Received as','Glass sheets / GL–062'],['Output link','PN–024 / pane processing'],['Evidence gap','Glass supplier document']]},
  {id:'frame',label:'Frame fabrication',kind:'Transformation',code:'FR–024',x:32,y:20,title:'From profile to frame.',status:'Sample process event attached',text:'Cutting, machining and joining produce frame FR–024 from profile lot AL–118. The example machine event is linked to the work order.',fields:[['Input → output','AL–118 → FR–024'],['Device event','Cut cycle completed / illustrative'],['Evidence to review','Work order and fabrication record']]},
  {id:'pane',label:'Pane processing',kind:'Transformation',code:'PN–024',x:32,y:61,title:'Keep the glass identity.',status:'Sample processing record',text:'Sheet lot GL–062 is cut to the work order and the pane edges are prepared for glazing. This representative route does not include a heat-treatment, lamination or insulating-glass step.',fields:[['Input → output','GL–062 → PN–024'],['Process','Cut to order; edge preparation'],['Separate output','Glass offcuts / disposition pending']]},
  {id:'hardware',label:'Fittings & gaskets',kind:'Component lot',code:'HW–009',x:56,y:84,title:'The smaller parts belong too.',status:'Sample component issue note',text:'The fittings and gasket kit is issued to this assembly as HW–009. Its lot reference remains linked alongside the frame and pane.',fields:[['Issued to','WIN–024 assembly'],['Kit reference','HW–009'],['Evidence to review','Component issue note']]},
  {id:'offcuts',label:'Glass offcuts',kind:'Separate output',code:'Disposition pending',x:32,y:84,title:'A branch, not a lost record.',status:'Disposition confirmation pending',gap:true,text:'The cutting record includes a separate offcut branch. This example supplies no measured quantity or confirmed recycling destination.',fields:[['Origin','PN–024 / pane cutting'],['Destination','Not recorded'],['Evidence gap','Disposition record']]},
  {id:'assembly',label:'Glazing & assembly',kind:'Components converge',code:'WIN–024',x:56,y:41,title:'Three components. One identity.',status:'Sample assembly record',text:'Frame FR–024, pane PN–024 and kit HW–009 are linked to finished window WIN–024. The sample identifier capture records this relationship.',fields:[['Frame','FR–024 ← AL–118'],['Pane','PN–024 ← GL–062'],['Fittings & gaskets','HW–009']]},
  {id:'inspection',label:'Inspection',kind:'Review record',code:'CHK–024',x:73,y:41,title:'Review before release.',status:'Sample checklist attached',text:'The illustrative checklist records a visual and operation review of WIN–024. It is not a test certificate, measured performance rating or independent approval.',fields:[['Product','WIN–024'],['Record','CHK–024 / visual + operation review'],['Review scope','Assembly condition and operation']]},
  {id:'window',label:'Finished window',kind:'Product',code:'WIN–024',x:91,y:41,title:'One window. Both histories.',status:'Sample product identity',text:'An aluminium-framed, single-glazed window brings the frame, pane and fittings together. Follow either material branch to its incoming lot.',fields:[['Assembly','FR–024 + PN–024 + HW–009'],['Inspection link','CHK–024'],['Next handoff','Dispatch recorded; receipt pending']]},
  {id:'handoff',label:'Dispatch & handoff',kind:'Chain evidence',code:'Receipt pending',x:91,y:84,title:'Dispatch is not acceptance.',status:'Receiving confirmation pending',gap:true,text:'The sample dispatch note refers to WIN–024. Receiving confirmation and installation acceptance are not attached; the handoff remains open.',fields:[['From → to','Window workshop → installation team'],['Available record','Sample dispatch note'],['Evidence gap','Receipt and installation acceptance']]}
 ];
 const edges = [['profile','frame'],['sheet','pane'],['frame','assembly'],['pane','assembly'],['hardware','assembly'],['assembly','inspection'],['inspection','window'],['pane','offcuts'],['window','handoff']];
 const byId = Object.fromEntries(nodes.map(n=>[n.id,n]));
 let visible = new Set(['window']), selected = 'window', timer = null, step = -1, elapsed = 0, last = 0, scanPaused = false, motionPaused = reduced.matches;
 const phases = [
  {ids:['window'],title:'WIN–024 identified.',copy:'Start with the finished window and its sample product record.',select:'window'},
  {ids:['inspection'],title:'Back through inspection.',copy:'The checklist links to this window. Review its scope, not just its presence.',select:'inspection'},
  {ids:['assembly','hardware'],title:'At the assembly bench.',copy:'Frame FR–024, pane PN–024 and fittings HW–009 meet at WIN–024.',select:'assembly'},
  {ids:['frame','pane'],title:'The journey branches.',copy:'Frame fabrication and pane processing retain separate component identities.',select:'assembly'},
  {ids:['profile','sheet'],title:'Both material origins.',copy:'AL–118 supplies the frame. GL–062 supplies the pane. The glass supplier document is missing.',select:'sheet'}
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
  $('#scan-kicker').textContent=scanned?'REVERSE TRACE COMPLETE':'SAMPLE RECORDS OPEN';$('#scan-heading').textContent=scanned?'Two origins. One window.':'Explore the connected records.';$('#scan-copy').textContent='Review the frame and glass branches, the assembly links and the open handoff evidence.';
  $$('.scan-steps li').forEach(li=>{li.classList.add('revealed');li.classList.remove('current');});select('window');$('#scan-announcement').textContent=scanned?'Reverse trace complete. Both material branches and all sample records are available.':'All sample records are available for review.';
 }
 function phase(i){
  step=i;phases[i].ids.forEach(id=>visible.add(id));$('#trace').dataset.scanPhase=String(i);$('#trace').dataset.scanState='tracing';$('#scan-heading').textContent=phases[i].title;$('#scan-copy').textContent=phases[i].copy;$('#scan-kicker').textContent=`REVERSE TRACE / 0${i+1} OF 05`;
  $$('.scan-steps li').forEach((li,j)=>{li.classList.toggle('revealed',j<=i);li.classList.toggle('current',j===i);});select(phases[i].select);$('#scan-announcement').textContent=phases[i].title;
 }
 function start(){
  stopTimer();visible=new Set();scanPaused=false;elapsed=0;phase(0);$('#trace').classList.add('scan-open');$('#trace').dataset.traceOrder='window → inspection → assembly + hardware → frame + pane → profile + glass lots';$('#scan-start').innerHTML='Restart scan <span>↻</span>';$('#scan-skip').disabled=false;$('#scan-skip').textContent='Show full trace';
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
 addEventListener('scroll',()=>{if(!scrollPending){scrollPending=true;requestAnimationFrame(updateScene);}},{passive:true});addEventListener('resize',updateScene);updateScene();select('window');$('#trace').dataset.scanState='ready';
})();
