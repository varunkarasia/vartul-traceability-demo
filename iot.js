/* Illustrative capture points. No live devices or telemetry are connected. */
(()=>{
const captures=[
 {id:'input',section:'collection',node:'source',label:'Input weight capture',event:'Weight event captured',type:'Incoming material',context:'An example device event attaches a weight capture to the incoming batch. No measured weight is supplied in this demo.',record:'Pickup + receiving record'},
 {id:'process',section:'sorting',node:'recycle',label:'Machine process event',event:'Process event captured',type:'Recycling operation',context:'An example machine-mounted device registers a process event and links it to the material being handled. This is not live machine status.',record:'Processing record'},
 {id:'output',section:'destination',node:'film',label:'Output batch identity',event:'Batch identifier captured',type:'Finished film',context:'An example identification event connects the finished product to FLM–024. A captured identifier does not confirm receipt by the next holder.',record:'Conversion + dispatch record'}
];
captures.forEach((c,i)=>{
 const area=document.createElement('div');area.className='iot-touchpoint';area.id='iot-'+c.id;
 area.innerHTML=`<button class="iot-trigger" aria-expanded="false" aria-controls="iot-detail-${c.id}"><span class="iot-target" aria-hidden="true"><i></i></span><span><small>IoT / SAMPLE CAPTURE</small><strong>${c.label}</strong></span><b aria-hidden="true">+</b></button><div id="iot-detail-${c.id}" class="iot-readout" hidden><p class="iot-kicker">ILLUSTRATIVE DEVICE EVENT</p><h3>${c.event}</h3><div class="iot-event"><span>${c.type}</span><strong>FLM–024</strong></div><p>${c.context}</p><button class="iot-linked" data-iot-link="${c.node}">View linked record <span>↗</span></button><small>${c.record}</small><div class="iot-review"><span>CHAIN VERIFICATION</span><p>Review the linked record and the handoff evidence. Device data alone does not verify the chain.</p></div></div>`;
 document.querySelector('#'+c.section).append(area);
 area.querySelector('.iot-trigger').addEventListener('click',()=>{const trigger=area.querySelector('.iot-trigger'),panel=area.querySelector('.iot-readout'),opened=trigger.getAttribute('aria-expanded')==='true';trigger.setAttribute('aria-expanded',String(!opened));trigger.querySelector('b').textContent=opened?'+':'−';panel.hidden=opened;});
 area.querySelector('.iot-linked').addEventListener('click',()=>{const net=document.querySelector('#network');net.querySelector('#network-reset').click();net.classList.add('scan-open');window.productNetwork.select(c.node);const target=matchMedia('(max-width:700px)').matches?net.querySelector('#network-inspector'):net.querySelector('.network-bar');target.scrollIntoView({block:'start',behavior:document.documentElement.classList.contains('motion-paused')?'instant':'smooth'});const focus=net.querySelector('#network-inspector .text-button');focus.focus({preventScroll:true});});
});
})();
