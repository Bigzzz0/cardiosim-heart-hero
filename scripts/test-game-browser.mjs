import { chromium } from 'playwright';
import { spawn } from 'node:child_process';

const port = 4179;
const server = spawn('npm', ['run','dev','--','--host','127.0.0.1','--port',String(port),'--strictPort'], { stdio:'ignore', shell:true });
const browser = await chromium.launch({headless:true});
const touchDragGesture = async (page, from, to, id=41) => {
  const cdp=await page.context().newCDPSession(page);
  try {
    await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{id,x:from.x,y:from.y,radiusX:4,radiusY:4,force:1}]});
    for(let step=1;step<=8;step++){
      const ratio=step/8;
      await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{id,x:from.x+(to.x-from.x)*ratio,y:from.y+(to.y-from.y)*ratio,radiusX:4,radiusY:4,force:1}]});
    }
    await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  } finally { await cdp.detach(); }
};
try {
  let ready = false;
  for (let i = 0; i < 40 && !ready; i++) {
    try { const response = await fetch(`http://127.0.0.1:${port}/game.html`); ready = response.ok; } catch { await new Promise(resolve=>setTimeout(resolve,250)); }
  }
  if (!ready) throw new Error('Vite test server did not start');
  const page = await browser.newPage({ viewport:{width:1440,height:1100} });
  await page.addInitScript(()=>{
    const trace=[]; window.__cardioPointerTrace=trace;
    for(const type of ['pointerdown','pointermove','pointerup','pointercancel'])window.addEventListener(type,event=>trace.push({type,pointerId:event.pointerId,button:event.button,x:event.clientX,y:event.clientY,target:event.target instanceof Element?`${event.target.tagName}.${typeof event.target.className==='string'?event.target.className:''}`:'unknown'}),true);
  });
  page.setDefaultTimeout(12000);
  const errors=[]; page.on('pageerror',error=>errors.push(error.message));
  page.on('console',message=>{if(message.type()==='error')errors.push(message.text());});
  await page.goto(`http://127.0.0.1:${port}/game.html`);
  await page.locator('.phaser-host canvas').waitFor(); await page.waitForTimeout(900);
  if (await page.title() !== 'CardioSim | Patient Room') throw new Error('Wrong game entry point');
  if (!await page.locator('.phaser-host canvas').isVisible()) throw new Error('Phaser canvas was not rendered');
  const missionPanel=page.locator('.mission-panel');
  const introMetrics=await page.evaluate(()=>{
    const primary=document.querySelector('.full-primary');const toggle=document.querySelector('.mission-toggle');
    if(!primary||!toggle)throw new Error('Missing primary or mission toggle control');
    const primaryBox=primary.getBoundingClientRect();const toggleBox=toggle.getBoundingClientRect();
    return{primary:{width:primaryBox.width,height:primaryBox.height,font:parseFloat(getComputedStyle(primary).fontSize)},toggle:{width:toggleBox.width,height:toggleBox.height}};
  });
  if(introMetrics.primary.width<44||introMetrics.primary.height<44||introMetrics.primary.font<14||introMetrics.toggle.width<44||introMetrics.toggle.height<44)throw new Error('Primary mission controls or text are below the target-size/readability baseline');
  if(await page.getByRole('progressbar',{name:'ความคืบหน้าภารกิจ'}).getAttribute('aria-valuenow')!=='1')throw new Error('Mission progress should be exposed to assistive technology');
  await page.getByRole('button',{name:'เปิดเสียง'}).click();
  await page.getByRole('button',{name:'ปิดเสียง'}).waitFor();
  await page.getByLabel('ระดับเสียง').waitFor();
  await page.getByRole('button',{name:'ปิดเสียง'}).click();
  await page.getByRole('button',{name:'เปิดเสียง'}).waitFor();
  await page.getByRole('button',{name:'ย่อภารกิจ'}).click();
  if(!await missionPanel.evaluate(element=>element.classList.contains('mission-collapsed')))throw new Error('Mission panel did not collapse');
  await page.getByRole('button',{name:'แสดงภารกิจ'}).click();
  if(await missionPanel.evaluate(element=>element.classList.contains('mission-collapsed')))throw new Error('Mission panel did not expand');
  await page.getByRole('button',{name:'เริ่มดูแลผู้ป่วย'}).click();
  if(await page.locator('.mission-beat').count()!==0)throw new Error('Mission changes should not place a temporary banner over the room');
  const phaseBadge=page.locator('.game-hud .hud-phase');
  if(!(await phaseBadge.innerText()).includes('PATIENT INFORMATION')||!await phaseBadge.evaluate(element=>element.classList.contains('phase-enter')))throw new Error('The game HUD should animate and announce the configured current phase');
  if(!await missionPanel.evaluate(element=>element.classList.contains('mission-collapsed')))throw new Error('Field assessment should start with the compact mission tracker');
  if(!await page.locator('.comms-eyebrow').getByText('CARE TEAM RADIO').isVisible()||await page.locator('.mission-panel.mode-field .mission-step').isVisible())throw new Error('Field prompt should read as an in-game care callout without duplicating the main step counter');
  if(!await page.locator('.mission-compact').isVisible()||!await page.locator('.action-brief').isVisible()||!await page.locator('.objective-pips').isVisible()||await page.locator('.compact-primary').isVisible())throw new Error('Compact mission tracker must show the next tool, patient target, and progress without a disabled advance button');
  if(await page.locator('.objective-pips').getAttribute('aria-valuenow')!=='0')throw new Error('Objective progress should expose the current completion count');
  if(!await page.locator('.action-brief').getByText('ซักประวัติ').isVisible()||!await page.locator('.action-brief').getByText('ศีรษะ / ทางเดินหายใจ').isVisible())throw new Error('Patient information objective should name its configured tool and patient hotspot');
  await page.locator('.tool-tutorial-tip').getByText(/กดค้าง.*ลากไป/).waitFor();
  if(!await page.locator('[data-patient-hotspot="head"]').evaluate(element=>element.classList.contains('tutorial-target')))throw new Error('The first real patient hotspot should be highlighted as the in-play drag tutorial');
  for(const [width,height,name] of [[1440,900,'screenshots/game-field-1440x900.png'],[1280,720,'screenshots/game-field-1280x720.png'],[1024,768,'screenshots/game-field-1024x768.png'],[390,844,'screenshots/game-field-390x844.png']]){
    await page.setViewportSize({width,height});await page.waitForTimeout(120);
    const fieldLayout=await page.evaluate(()=>{const room=document.querySelector('.room-stage')?.getBoundingClientRect();const toolbar=document.querySelector('.toolbar')?.getBoundingClientRect();const controls=[...document.querySelectorAll('.toolbar button')].map(element=>{const rect=element.getBoundingClientRect();return{width:rect.width,height:rect.height,visible:rect.width>0&&rect.height>0};});return{width:innerWidth,height:innerHeight,scrollWidth:document.documentElement.scrollWidth,room:room?.toJSON(),toolbar:toolbar?.toJSON(),controls};});
    if(fieldLayout.scrollWidth>width||!fieldLayout.room||!fieldLayout.toolbar||fieldLayout.toolbar.left<0||fieldLayout.toolbar.right>width||fieldLayout.toolbar.bottom>height||fieldLayout.controls.some(control=>!control.visible||control.width<44||control.height<44))throw new Error(`Patient-room controls are clipped or below touch size at ${width}x${height}: ${JSON.stringify(fieldLayout)}`);
    if(width<=760&&(!await page.locator('.game-hud .hud-steps').isVisible()||await page.locator('.game-hud .hud-phase').isVisible()||!await page.locator('.game-hud .hud-step-count').isVisible()))throw new Error('Mobile HUD should use a compact progress rail and readable step count instead of clipping the full phase name');
    await page.screenshot({path:name,fullPage:true});
  }
  await page.setViewportSize({width:1440,height:1100});await page.waitForTimeout(120);
  const canvas=page.locator('.phaser-host canvas');
  const point=async (x,y) => page.evaluate(({x,y})=>{const canvas=document.querySelector('.phaser-host canvas');const view=JSON.parse(document.querySelector('.room-stage')?.getAttribute('data-world-view')??'null');if(!canvas||!view)throw Error('Phaser camera world view unavailable');const bounds=canvas.getBoundingClientRect();return{x:bounds.left+(x-view.x)/view.width*bounds.width,y:bounds.top+(y-view.y)/view.height*bounds.height};},{x,y});
  const tap=async(x,y)=>{const p=await point(x,y);await page.mouse.click(p.x,p.y);};
  const drag=async(from,to)=>{const start=await from.boundingBox();if(!start)throw Error('Drag start unavailable');const end=await point(to.x,to.y);await page.mouse.move(start.x+start.width/2,start.y+start.height/2);await page.mouse.down();await page.mouse.move(end.x,end.y,{steps:9});await page.mouse.up();};
  const dragCardTo=async(label,slot)=>{
    const from=page.locator('.answer-card').filter({hasText:label}).first();
    const slotLocator=page.locator(`[data-answer-slot="${slot}"]`);
    await slotLocator.scrollIntoViewIfNeeded(); await from.scrollIntoViewIfNeeded();
    let start=await from.boundingBox(); if(!start)throw Error(`Answer drag bounds unavailable for ${slot}`);
    let startPoint={x:start.x+start.width/2,y:start.y+start.height/2}; let startHit={target:'none',option:false};
    for(let attempt=0;attempt<5&&!startHit.option;attempt++){
      await page.mouse.move(startPoint.x,startPoint.y); await page.waitForTimeout(80);
      const state=await from.evaluate((element,point)=>{const rect=element.getBoundingClientRect();const hit=document.elementFromPoint(point.x,point.y);return{rect:{x:rect.x,y:rect.y,width:rect.width,height:rect.height},hit:hit?`${hit.tagName}.${typeof hit.className==='string'?hit.className:''}`:'none',option:hit?.closest('[data-answer-option]')?.getAttribute('data-answer-option')===element.getAttribute('data-answer-option')};},startPoint);
      start=state.rect; startHit={target:state.hit,option:state.option};
      if(!startHit.option)startPoint={x:start.x+start.width/2,y:start.y+start.height/2};
    }
    if(!startHit.option)throw Error(`Answer card did not settle under the pointer before drag: ${label} ${JSON.stringify({start,startHit})}`);
    const target=await slotLocator.boundingBox(); if(!target)throw Error(`Answer slot bounds unavailable for ${slot}`);
    const endPoint={x:target.x+target.width/2,y:target.y+target.height/2};
    await page.mouse.down(); await page.mouse.move(endPoint.x,endPoint.y,{steps:8}); await page.mouse.up();
    try{await page.waitForFunction(selector=>document.querySelector(selector)?.classList.contains('filled'),`[data-answer-slot="${slot}"]`,{timeout:1500});}
    catch{await page.screenshot({path:`screenshots/game-answer-drag-${slot}.png`,fullPage:true});throw new Error(`Answer card did not reach ${slot}: ${JSON.stringify({label,start,target,startHit,disabled:await from.isDisabled(),ghost:await page.locator('.answer-ghost').count(),gameState:await page.locator('main').evaluate(element=>({paused:element.dataset.gamePaused,pending:element.dataset.interactionPending,confirmed:element.dataset.decisionConfirmed,decisions:element.dataset.decisionCount})),pointerTrace:await page.evaluate(()=>window.__cardioPointerTrace.slice(-14)),viewport:await page.evaluate(()=>({width:innerWidth,height:innerHeight,devicePixelRatio,scrollX,scrollY})),slotText:await slotLocator.innerText(),feedback:await page.locator('.feedback').innerText()})}`);}
  };
  const checkLeadLayout=async(width,height,screenshot)=>{
    await page.setViewportSize({width,height}); await page.waitForTimeout(120);
    if(width<=760&&(!await page.locator('.game-hud.is-emergency .hud-emergency').isVisible()||await page.locator('.game-hud.is-emergency .hud-step-count').isVisible()))throw new Error('Emergency mobile HUD should keep the alarm badge and compact progress rail in view');
    const layout=await page.evaluate(()=>{
      const canvas=document.querySelector('.phaser-host canvas');if(!canvas)throw new Error('Missing Phaser canvas');
      const canvasRect=canvas.getBoundingClientRect();const panelRect=document.querySelector('.mission-panel')?.getBoundingClientRect();
      const gameLayout=JSON.parse(document.querySelector('main')?.dataset.ecgLayout??'{}');
      const configuredTargets=JSON.parse(document.querySelector('main')?.dataset.ecgTargets??'[]');
      const confirmRect=document.querySelector('.compact-primary')?.getBoundingClientRect();
      let targetsInView;
      if(innerWidth<=760){
        targetsInView=[...document.querySelectorAll('.ecg-mobile-target')].map(element=>{const rect=element.getBoundingClientRect();return{id:element.getAttribute('aria-label')||element.dataset.mobileEcgTarget,left:rect.left,top:rect.top,right:rect.right,bottom:rect.bottom,width:rect.width,height:rect.height,inside:rect.left>=0&&rect.top>=0&&rect.right<=innerWidth&&rect.bottom<=innerHeight,covered:false};});
      }else{
        const view=JSON.parse(document.querySelector('.room-stage')?.getAttribute('data-world-view')??'null');if(!view)throw new Error('Phaser world view missing during ECG layout check');const scaleX=canvasRect.width/view.width,scaleY=canvasRect.height/view.height;
        const overlays=['.monitor','.toolbar','.room-topline','.mission-panel'].map(selector=>document.querySelector(selector)?.getBoundingClientRect()).filter(Boolean);
        targetsInView=configuredTargets.map(target=>{const x=canvasRect.left+(target.x-view.x)*scaleX,y=canvasRect.top+(target.y-view.y)*scaleY,r=23*Math.min(scaleX,scaleY);return{id:target.id,left:x-r,top:y-r,right:x+r,bottom:y+r,width:r*2,height:r*2,inside:x-r>=0&&x+r<=innerWidth&&y-r>=0&&y+r<=innerHeight&&x-r>=canvasRect.left&&x+r<=canvasRect.right&&y-r>=canvasRect.top&&y+r<=canvasRect.bottom,covered:overlays.some(rect=>rect&&x+r>rect.left&&x-r<rect.right&&y+r>rect.top&&y-r<rect.bottom)};});
      }
      const view=JSON.parse(document.querySelector('.room-stage')?.getAttribute('data-world-view')??'null');
      const trayPoints=innerWidth<=760?[]:configuredTargets.map((target,index)=>{const scaleX=canvasRect.width/view.width,scaleY=canvasRect.height/view.height;const x=canvasRect.left+(gameLayout.tray.x+index*gameLayout.tray.spacing-view.x)*scaleX,y=canvasRect.top+(gameLayout.tray.y-view.y)*scaleY,r=23*Math.min(scaleX,scaleY);return{id:target.id,left:x-r,top:y-r,right:x+r,bottom:y+r,inside:x-r>=0&&x+r<=innerWidth&&y-r>=0&&y+r<=innerHeight};});
      const room=document.querySelector(innerWidth<=760?'.room-stage':'.simulation')?.getBoundingClientRect();const procedure=document.querySelector('.ecg-mobile-procedure')?.getBoundingClientRect();
      return{scrollWidth:document.documentElement.scrollWidth,viewportWidth:innerWidth,viewportHeight:innerHeight,canvas:canvasRect.toJSON(),panel:panelRect?.toJSON(),confirm:confirmRect?.toJSON(),targets:targetsInView,trayPoints,room:room?.toJSON(),procedure:procedure?.toJSON(),toolbar:document.querySelector('.toolbar')?.getBoundingClientRect().toJSON()};
    });
    if(layout.scrollWidth>layout.viewportWidth)throw new Error(`ECG layout overflows horizontally at ${width}x${height}`);
    if(!layout.room||layout.canvas.left<layout.room.left-1||layout.canvas.top<layout.room.top-1||layout.canvas.right>layout.room.right+1||layout.canvas.bottom>layout.room.bottom+1)throw new Error(`Phaser canvas escapes the visible Patient Room at ${width}x${height}: ${JSON.stringify(layout)}`);
    const failed=layout.targets.find(target=>!target.inside||target.covered);
    if(failed)throw new Error(`ECG target ${failed.id} is hidden or covered at ${width}x${height}: ${JSON.stringify(layout)}`);
    if(width<=760){
      if(layout.targets.length!==6||layout.targets.some(target=>target.width<44||target.height<44))throw new Error(`Portrait ECG must expose six accessible touch targets: ${JSON.stringify(layout.targets)}`);
      if(!await page.locator('.ecg-mobile-procedure').isVisible())throw new Error('Portrait ECG screen must expose its touch procedure overlay');
      if(!layout.room||!layout.procedure||layout.procedure.top<270||layout.procedure.bottom>layout.room.bottom+1)throw new Error(`Portrait ECG procedure must preserve a visible upper Patient Room while keeping its controls in view: ${JSON.stringify(layout)}`);
      for(const control of await page.locator('.ecg-mobile-lead,.ecg-mobile-target').all()){
        const box=await control.boundingBox();if(!box||box.width<44||box.height<44||box.left<0||box.right>width||box.top<layout.procedure.top||box.bottom>height)throw new Error('Portrait ECG touch control is too small or outside the visible procedure panel');
      }
    }else{
      const failedTray=layout.trayPoints.find(point=>!point.inside);
      if(failedTray)throw new Error(`ECG tray item ${failedTray.id} is outside the viewport at ${width}x${height}: ${JSON.stringify(layout)}`);
      if(await page.locator('.toolbar').isVisible())throw new Error('Medical toolbar must be hidden during ECG placement');
      const confirm=layout.confirm;
      if(!confirm||confirm.width<44||confirm.height<44||confirm.left<0||confirm.right>width||confirm.top<0||confirm.bottom>height)throw new Error(`ECG confirm is not reachable at ${width}x${height}: ${JSON.stringify(layout)}`);
    }
    await page.screenshot({path:screenshot,fullPage:true});
  };
  const dragDomTo=async(source,target,label)=>{
    await target.scrollIntoViewIfNeeded();await source.scrollIntoViewIfNeeded();
    const from=await source.boundingBox(),to=await target.boundingBox();
    if(!from||!to)throw new Error(`Activity drag bounds unavailable: ${label}`);
    const start={x:from.x+from.width/2,y:from.y+from.height/2},end={x:to.x+to.width/2,y:to.y+to.height/2};
    await page.mouse.move(start.x,start.y);await page.waitForTimeout(80);await page.mouse.down();await page.mouse.move(end.x,end.y,{steps:8});await page.mouse.up();
  };
  const dragMedicationStep=async(stepId)=>{
    await dragDomTo(page.locator('.activity-equipment-token'),page.locator(`[data-activity-step-target="${stepId}"]`),stepId);
    await page.waitForFunction(id=>document.querySelector(`[data-activity-step-target="${id}"]`)?.classList.contains('complete'),stepId,{timeout:2500});
  };
  const dragSyringePlungerTo=async(amount)=>{
    const plunger=page.locator('[data-syringe-plunger]');const box=await plunger.boundingBox();const maximum=Number(await plunger.getAttribute('max'));if(!box||!maximum)throw Error('Syringe plunger bounds or configured scale are missing');
    const value=Number(await plunger.inputValue());const usableWidth=Math.max(1,box.width-10);const start={x:box.x+5+usableWidth*value/maximum,y:box.y+box.height/2};const end={x:box.x+5+usableWidth*amount/maximum,y:start.y};
    await page.mouse.move(start.x,start.y);await page.mouse.down();await page.mouse.move(end.x,end.y,{steps:10});await page.mouse.up();
  };
  const dragIoItemToZone=async(itemId,zoneId)=>{
    await dragDomTo(page.locator(`[data-activity-item="${itemId}"]`),page.locator(`[data-activity-zone="${zoneId}"]`),itemId);
  };
  const checkActivityResponsive=async(surfaceId)=>{
    const original=page.viewportSize();
    for(const [width,height] of [[1440,900],[1280,720],[1024,768],[390,844]]){
      await page.setViewportSize({width,height});await page.waitForTimeout(90);
      const layout=await page.evaluate(selector=>{
        const panel=document.querySelector('.mission-panel');const surface=document.querySelector(selector);const primary=document.querySelector('.mission-panel .full-primary');
        const primaryRect=primary?.getBoundingClientRect();return{scrollWidth:document.documentElement.scrollWidth,panel:panel?.getBoundingClientRect().toJSON(),surface:surface?.getBoundingClientRect().toJSON(),primarySize:primary&&primaryRect?{width:primaryRect.width,height:primaryRect.height,font:parseFloat(getComputedStyle(primary).fontSize)}:null};
      },`[data-room-surface="${surfaceId}"]`);
      if(layout.scrollWidth>width||!layout.panel||!layout.surface||layout.panel.left<0||layout.panel.right>width||layout.surface.left<0||layout.surface.right>width)throw new Error(`${surfaceId} overflows at ${width}x${height}: ${JSON.stringify(layout)}`);
      if(!layout.primarySize||layout.primarySize.width<44||layout.primarySize.height<44||layout.primarySize.font<14)throw new Error(`${surfaceId} primary control is below the touch/readability baseline at ${width}x${height}: ${JSON.stringify(layout)}`);
      await page.locator('.mission-panel').evaluate(element=>{element.scrollTop=element.scrollHeight;});
      const reachable=await page.locator('.mission-panel .full-primary').evaluate(element=>{const rect=element.getBoundingClientRect();return rect.width>=44&&rect.height>=44&&rect.top>=0&&rect.bottom<=innerHeight;});
      if(!reachable)throw new Error(`${surfaceId} Confirm is not reachable at ${width}x${height}`);
      await page.locator('.mission-panel').evaluate(element=>{element.scrollTop=0;});
      await page.screenshot({path:`screenshots/game-${surfaceId}-${width}x${height}.png`,fullPage:true});
    }
    await page.setViewportSize(original);await page.waitForTimeout(100);
  };
  const tool=name=>page.locator('.toolbar button').filter({hasText:name});
  console.log('after intro',await page.locator('.phase-label').innerText(),await canvas.boundingBox());
  const interview=tool('ซักประวัติ');
  await page.keyboard.press('1');
  if(await interview.getAttribute('aria-pressed')!=='true')throw new Error('Keyboard shortcut 1 should select the active mission tool');
  await page.keyboard.press('Escape');
  if(await interview.getAttribute('aria-pressed')!=='false')throw new Error('Escape should clear the selected tool');
  const interviewBox=await interview.boundingBox(); if(!interviewBox)throw Error('Interview tool bounds unavailable');
  await page.mouse.move(interviewBox.x+interviewBox.width/2,interviewBox.y+interviewBox.height/2); await page.mouse.down(); await page.mouse.move(100,30,{steps:5}); await page.mouse.up();
  if(await interview.getAttribute('aria-pressed')!=='false'||await page.locator('.objective.done').count())throw new Error('Dropping outside the room should cancel the tool drag');
  await interview.click();
  if(await interview.getAttribute('aria-pressed')!=='false'||await page.locator('.objective.done').count())throw new Error('A click must not latch a tool to the cursor');
  const interviewStart=await interview.boundingBox();if(!interviewStart)throw Error('Interview tool bounds unavailable for focused drag test');
  const interviewTarget=await point(550,280);
  await page.mouse.move(interviewStart.x+interviewStart.width/2,interviewStart.y+interviewStart.height/2);await page.mouse.down();
  await page.mouse.move(interviewStart.x+interviewStart.width/2+24,interviewStart.y+interviewStart.height/2,{steps:2});
  await page.waitForFunction(()=>document.body.classList.contains('dragging')&&getComputedStyle(document.querySelector('.mission-panel')).visibility==='hidden');
  await page.mouse.move(interviewTarget.x,interviewTarget.y,{steps:8});await page.mouse.up();
  await page.waitForFunction(()=>!document.body.classList.contains('dragging'));
  await page.waitForFunction(()=>getComputedStyle(document.querySelector('.mission-panel')).visibility!=='hidden');
  await page.locator('.interaction-toast.success').waitFor();
  const interactionToastLayout=await page.locator('.interaction-toast').evaluate(element=>{const rect=element.getBoundingClientRect();const stage=document.querySelector('.room-stage')?.getBoundingClientRect();const canvas=document.querySelector('.phaser-host canvas')?.getBoundingClientRect();const view=JSON.parse(document.querySelector('.room-stage')?.getAttribute('data-world-view')??'null');const target=stage&&canvas&&view?{x:canvas.left+(550-view.x)/view.width*canvas.width,y:canvas.top+(280-view.y)/view.height*canvas.height}:null;return{rect:rect.toJSON(),font:parseFloat(getComputedStyle(element).fontSize),stage:stage?.toJSON(),target};});
  if(interactionToastLayout.font<14||interactionToastLayout.rect.left<interactionToastLayout.stage.left||interactionToastLayout.rect.right>interactionToastLayout.stage.right||!interactionToastLayout.target||interactionToastLayout.rect.bottom>=interactionToastLayout.target.y||Math.abs((interactionToastLayout.rect.left+interactionToastLayout.rect.right)/2-interactionToastLayout.target.x)>170)throw new Error(`Interaction feedback should appear beside the patient action: ${JSON.stringify(interactionToastLayout)}`);
  await page.waitForTimeout(900); console.log('after drag',await page.locator('.phase-label').innerText(),await page.locator('.feedback').innerText());
  await page.getByRole('heading',{name:'ฟังผู้ป่วย ก่อนเริ่มประเมิน'}).waitFor();
  await page.getByRole('button',{name:'พักเกม'}).click();
  await page.getByText('SIMULATION PAUSED').waitFor();
  await page.getByRole('button',{name:'กลับไปเล่น'}).click();
  await page.waitForTimeout(800);
  if(!await page.locator('.objective.done').count()){ await page.screenshot({path:'screenshots/game-drag-debug.png',fullPage:true}); throw new Error(`Dragged interview did not complete; phase=${await page.locator('.mission-step').innerText()}; feedback=${await page.locator('.feedback').innerText()}; canvas=${JSON.stringify(await canvas.boundingBox())}`); }
  await page.getByRole('button',{name:'แสดงภารกิจ'}).click();
  await page.getByRole('button',{name:/Patient chart/}).click();
  const chartClose=page.getByRole('button',{name:'ปิด Chart'});
  await page.waitForFunction(()=>document.activeElement?.getAttribute('aria-label')==='ปิด Chart');
  await page.keyboard.press('Tab');
  if(await page.evaluate(()=>document.activeElement?.getAttribute('aria-label'))!=='ปิด Chart')throw new Error('Patient Chart should keep keyboard focus inside its dialog');
  await page.keyboard.press('Shift+Tab');
  if(await page.evaluate(()=>document.activeElement?.getAttribute('aria-label'))!=='ปิด Chart')throw new Error('Shift+Tab should remain inside the Patient Chart dialog');
  await page.keyboard.press('Escape');
  await page.locator('.chart-modal').waitFor({state:'detached'});
  if(!await page.evaluate(()=>document.activeElement instanceof HTMLElement&&document.activeElement.classList.contains('chart-button')))throw new Error('Closing Patient Chart should restore focus to its opener');
  await page.getByRole('button',{name:/Patient chart/}).click();
  await page.locator('.unknown').first().waitFor();
  await page.locator('.chart-entry').getByText(/หายใจไม่ออกค่ะ/).waitFor();
  await chartClose.click();
  await page.getByRole('button',{name:'เริ่มประเมิน'}).click();
  await drag(tool('Stethoscope'),{x:550,y:280});
  await page.locator('.interaction-toast.error').waitFor();
  if(await page.locator('.mission-panel .feedback.error').isVisible())throw new Error('Immediate interaction feedback should not repeat in the mission tracker');
  await page.locator('.interaction-toast.error').waitFor({state:'detached'});
  await page.locator('.mission-panel .feedback.error').waitFor();
  if(await page.locator('.objective.done').count()!==0)throw new Error('A tool dropped on the wrong hotspot must show feedback without completing the assessment');
  await drag(tool('Stethoscope'),{x:550,y:395});
  await page.locator('.interaction-toast.success').getByText(/fine crackles/i).waitFor();
  if((await page.locator('.interaction-toast.success').innerText()).includes('✓'))throw new Error('Success feedback should use one confirmation icon instead of duplicating check marks in its message');
  await page.waitForTimeout(1650);
  await page.locator('.mission-panel .feedback').getByText(/fine crackles/i).waitFor();
  await page.screenshot({path:'screenshots/game-interaction-desktop.png',fullPage:true});
  await page.keyboard.press('1');
  const armTarget=page.locator('[data-patient-hotspot="arm"]');
  await armTarget.focus(); await page.keyboard.press('Enter'); await page.waitForTimeout(1200);
  if(await page.locator('.objective.done').count()!==2)throw new Error('Keyboard selection and focused hotspot activation should perform the same configured patient interaction');
  await drag(tool('SpO₂'),{x:526,y:575}); await page.waitForTimeout(1000);
  await page.screenshot({path:'screenshots/game-assessment.png',fullPage:true});
  await page.getByRole('button',{name:'บันทึกการประเมิน'}).click();
  await page.locator('.surface-instruction b').getByText('จัดวางปัญหาและ ข้อมูลสนับสนุน').waitFor();
  if(!await missionPanel.evaluate(element=>element.classList.contains('mode-bedside-clipboard'))||await missionPanel.evaluate(element=>element.classList.contains('mission-collapsed'))||!await page.locator('[data-room-surface="bedside-clipboard"]').isVisible())throw new Error('Diagnosis and nursing answers should open on the in-room bedside clipboard');
  const decisionBoardLayout=await page.locator('.matching-board').evaluate(element=>({columns:getComputedStyle(element).gridTemplateColumns.split(' ').length,box:element.getBoundingClientRect().toJSON()}));
  if(decisionBoardLayout.columns<2||decisionBoardLayout.box.width<500)throw new Error('Decision answers should use a readable two-column board');
  const answerFont=await page.locator('.answer-card b').first().evaluate(element=>parseFloat(getComputedStyle(element).fontSize));
  if(answerFont<14)throw new Error(`Decision answer text is too small: ${answerFont}px`);
  await dragCardTo('ประเด็นด้านอื่น','problem'); await dragCardTo('ข้อมูลที่ไม่เกี่ยวกับการประเมิน','support');
  await page.getByRole('button',{name:'Confirm · ตรวจคำตอบ'}).click();
  await page.locator('.feedback.error').waitFor();
  await dragCardTo('ประเด็นด้านการหายใจ','problem'); await dragCardTo('ข้อมูลระบบหายใจที่ค้นพบ','support');
  await page.getByRole('button',{name:'Confirm · ตรวจคำตอบ'}).click(); await page.locator('.feedback.success').waitFor();
  await page.getByRole('button',{name:'Next'}).click();
  await page.locator('.surface-instruction b').getByText('เลือกการพยาบาล ให้สัมพันธ์กับปัญหา').waitFor();
  await dragCardTo('จัดท่าผู้ป่วยตามแผน','intervention-1'); await dragCardTo('ไม่บันทึกการติดตาม','intervention-2');
  await page.getByRole('button',{name:'Confirm · ตรวจคำตอบ'}).click(); await page.locator('.feedback.error').waitFor();
  await dragCardTo('ติดตามผลประเมินซ้ำ','intervention-2');
  await page.getByRole('button',{name:'Confirm · ตรวจคำตอบ'}).click(); await page.locator('.feedback.success').waitFor();
  await page.getByRole('button',{name:'Next'}).click();
  await page.locator('.activity-surface-instruction b').getByText('ตรวจคำสั่งยา และบันทึกการเตรียม').waitFor();
  if(!await missionPanel.evaluate(element=>element.classList.contains('mode-medication-station'))||!await page.locator('[data-room-surface="medication-station"]').isVisible()||!await page.locator('.activity-notice').isVisible())throw new Error('Medication should use the in-room preparation station and show its demo status');
  await checkActivityResponsive('medication-station');
  const prepSteps=await page.locator('[data-activity-step-target]').evaluateAll(elements=>elements.map(element=>element.getAttribute('data-activity-step-target')));
  await dragDomTo(page.locator('.activity-equipment-token'),page.locator(`[data-activity-step-target="${prepSteps[1]}"]`),'incorrect medication order');
  await page.locator('.feedback.error').waitFor();
  if(!await page.locator('.activity-equipment-token').isVisible())throw new Error('Incorrect medication step should return the equipment for retry');
  await dragMedicationStep(prepSteps[0]);
  for(const step of prepSteps.slice(1,3))await dragMedicationStep(step);
  await dragDomTo(page.locator('.syringe-tool-token'),page.locator('[data-syringe-ampoule-target="ampoule"]'),'syringe to ampoule');
  await page.locator('[data-syringe-plunger]').waitFor();
  await dragSyringePlungerTo(2);
  await page.locator('.syringe-confirm').click();await page.locator('.feedback.error').waitFor();
  if(await page.locator('[data-activity-step-target="step_draw_med"]').evaluate(element=>element.classList.contains('complete')))throw new Error('An incorrect syringe volume should not complete the medication step');
  await dragSyringePlungerTo(4);
  await page.locator('.syringe-confirm').click();await page.locator('[data-activity-step-target="step_draw_med"].complete').waitFor();
  for(const step of prepSteps.slice(4))await dragMedicationStep(step);
  const medicationSelects=page.locator('.activity-card select');
  const medicationNumbers=page.locator('.activity-card input[type="number"]');
  await medicationSelects.nth(0).selectOption({label:'Furosemide (Lasix)'});
  await medicationNumbers.nth(0).fill('10');
  await medicationSelects.nth(1).selectOption({label:'IV slow push'});
  await medicationSelects.nth(2).selectOption({label:'Hypotension'});
  await medicationSelects.nth(3).selectOption({label:'BP, urine output, K⁺/Mg²⁺'});
  await page.getByRole('button',{name:'Confirm · บันทึกการเตรียมยา'}).click();
  await page.locator('.feedback.error').waitFor();
  await medicationNumbers.nth(0).fill('40');
  await page.getByRole('button',{name:'Confirm · บันทึกการเตรียมยา'}).click();
  await page.locator('.feedback.success').waitFor();
  await page.getByRole('button',{name:'Next'}).click();
  await page.locator('.activity-surface-instruction b').getByText('คำนวณสมดุล สารน้ำเข้าและออก').waitFor();
  await checkActivityResponsive('io-board');
  const ioNumbers=page.locator('.activity-card input[type="number"]');
  await ioNumbers.nth(0).fill('150'); await ioNumbers.nth(1).fill('350'); await ioNumbers.nth(2).fill('200');
  await dragIoItemToZone('iv-intake','output'); await dragIoItemToZone('oral-intake','intake'); await dragIoItemToZone('urine-output','output');
  await page.getByRole('button',{name:/POSITIVE/}).click(); await page.getByRole('button',{name:'Confirm · ตรวจคำตอบ'}).click();
  await page.locator('.feedback.error').waitFor();
  await dragIoItemToZone('iv-intake','intake');
  await ioNumbers.nth(2).fill('-200');
  await page.getByRole('button',{name:/NEGATIVE/}).click(); await page.getByRole('button',{name:'Confirm · ตรวจคำตอบ'}).click();
  await page.locator('.feedback.success').waitFor(); await page.emulateMedia({reducedMotion:'reduce'}); await page.getByRole('button',{name:'Next'}).click();
  await page.getByRole('heading',{name:'อาการผู้ป่วย กำลังเปลี่ยนไป'}).waitFor();
  const alarmMotion=await page.locator('.emergency-room').evaluate(element=>({reduced:matchMedia('(prefers-reduced-motion: reduce)').matches,duration:parseFloat(getComputedStyle(element,'::after').animationDuration)}));
  if(!alarmMotion.reduced||alarmMotion.duration>0.001)throw new Error('Emergency visual motion should honor prefers-reduced-motion');
  await page.waitForTimeout(5300);
  await page.getByRole('heading',{name:'ประเมิน ABC อย่างเป็นลำดับ'}).waitFor();
  if(!await page.locator('.game-hud.is-emergency .hud-emergency').isVisible())throw new Error('Emergency should visibly change the game HUD and identify the urgent state');
  const hand=tool('ประเมิน ABC');
  for(const [x,y] of [[550,280],[550,395],[602,558]]) { await drag(hand,{x,y}); await page.waitForTimeout(950); }
  await page.screenshot({path:'screenshots/game-emergency.png',fullPage:true});
  await page.getByRole('button',{name:'เตรียมติด ECG'}).click();
  await page.getByRole('heading',{name:'เชื่อมต่อ สัญญาณหัวใจ'}).waitFor();
  if(!await missionPanel.evaluate(element=>element.classList.contains('mission-collapsed')))throw new Error('ECG placement should start with a compact mission tracker');
  for(const [width,height,path] of [[1440,900,'screenshots/game-ecg-1440x900.png'],[1280,720,'screenshots/game-ecg-1280x720.png'],[1024,768,'screenshots/game-ecg-1024x768.png'],[390,844,'screenshots/game-ecg-390x844.png']])await checkLeadLayout(width,height,path);
  await page.setViewportSize({width:1440,height:1100}); await page.waitForTimeout(120);
  await page.waitForTimeout(350);
  const ecgLayout=JSON.parse(await page.locator('main').getAttribute('data-ecg-layout')??'{}');
  const configuredLeads=JSON.parse(await page.locator('main').getAttribute('data-ecg-targets')??'[]');
  const starts=configuredLeads.map((_,index)=>({x:ecgLayout.tray.x+index*ecgLayout.tray.spacing,y:ecgLayout.tray.y}));
  const targets=configuredLeads.map(target=>[target.x,target.y]);
  const dragLead=async(index,target)=>{const from=await point(starts[index].x,starts[index].y);const to=await point(target[0],target[1]);await page.mouse.move(from.x,from.y);await page.mouse.down();await page.mouse.move(to.x,to.y,{steps:8});await page.mouse.up();};
  // A deliberately incorrect chest lead should return to its tray and keep the mission retryable.
  await dragLead(0,targets[1]);
  await page.locator('.mission-panel .feedback').getByText(/ยังไม่ตรงตำแหน่ง/).waitFor({timeout:12000}).catch(async()=>{
    await page.screenshot({path:'screenshots/game-ecg-wrong-drop-debug.png',fullPage:true});
    throw new Error(`Incorrect ECG placement did not show retry feedback: ${JSON.stringify({feedback:await page.locator('.mission-panel .feedback').innerText(),placed:await page.locator('.lead-status button.lead-done').count(),canvas:await canvas.boundingBox(),camera:await page.locator('.room-stage').evaluate(element=>({world:element.getAttribute('data-world-view'),stage:element.getBoundingClientRect().toJSON(),host:element.querySelector('.phaser-host')?.getBoundingClientRect().toJSON()})),canvasBuffer:await page.locator('.phaser-host canvas').evaluate(element=>({width:element.width,height:element.height})),pointerTrace:await page.evaluate(()=>window.__cardioPointerTrace.slice(-12))})}`);
  });
  await page.waitForTimeout(350); // Allow the visibly returning lead to reach its tray before retrying it.
  for(let index=0;index<6;index++){
    await dragLead(index,targets[index]);
    await page.waitForFunction(expected=>document.querySelectorAll('.lead-status button.lead-done').length>=expected,index+1,{timeout:3500}).catch(async()=>{
      await page.screenshot({path:'screenshots/game-ecg-placement-failure.png',fullPage:true});
      throw new Error(`ECG lead ${index+1} did not snap; placed=${await page.locator('.lead-status button.lead-done').count()}; feedback=${await page.locator('.feedback').innerText()}`);
    });
  }
  await page.locator('.mission-compact').getByText(/6\/6 leads/).waitFor();
  if(await page.locator('.compact-primary').isDisabled())throw new Error('ECG confirm should be enabled at 6/6 leads');
  await page.screenshot({path:'screenshots/game-ecg.png',fullPage:true});
  await page.getByRole('button',{name:'Confirm · บันทึก ECG'}).click();
  await page.locator('.activity-surface-instruction b').getByText('อ่านผล ECG และบันทึกคำตอบ').waitFor();
  const rhythmSelect=page.locator('.ecg-review-console select');
  if(!await page.locator('.ecg-readout').getByText(/SVT/).isVisible())throw new Error('ECG console should show the rhythm sourced from Case 1 configuration');
  await rhythmSelect.selectOption({label:'ยังระบุไม่ได้'});
  await page.getByRole('button',{name:'Confirm · บันทึกการอ่าน'}).click(); await page.locator('.feedback.error').waitFor();
  await rhythmSelect.selectOption({label:'SVT'});
  await page.getByRole('button',{name:'Confirm · บันทึกการอ่าน'}).click(); await page.locator('.feedback.success').waitFor();
  await page.getByRole('button',{name:'Next'}).click();
  await page.locator('.surface-instruction b').getByText('เลือกการตอบสนอง แล้วดูผลที่ผู้ป่วย').waitFor();
  await dragCardTo('จัดให้นอนราบและให้ดื่มน้ำ','response');
  await page.getByRole('button',{name:'Confirm · ตรวจคำตอบ'}).click();
  await page.locator('.feedback.error').waitFor();
  await dragCardTo('High Fowler’s · Non-rebreather · เรียกทีมฉุกเฉิน','response');
  await page.getByRole('button',{name:'Confirm · ตรวจคำตอบ'}).click(); await page.locator('.feedback.success').waitFor();
  await page.getByRole('button',{name:'Next'}).click();
  await page.getByRole('heading',{name:'ผู้ป่วยตอบสนอง ต่อการดูแล'}).waitFor();
  if(!await page.locator('.room-stage.recovery-room').isVisible()||await page.locator('.room-stage.emergency-room').count())throw new Error('Patient recovery should shift the room out of emergency mode and acknowledge stabilization in-scene');
  await page.waitForTimeout(6600);
  await page.getByRole('button',{name:'ดูผลภารกิจ'}).click();
  await page.getByRole('heading',{name:'ดูแลครบ จบภารกิจจำลอง'}).waitFor();
  for(const [width,height] of [[1440,900],[1280,720],[1024,768],[390,844]]){
    await page.setViewportSize({width,height});await page.waitForTimeout(100);
    const resultLayout=await page.locator('.mission-panel.mode-result').evaluate(element=>{const rect=element.getBoundingClientRect();return{left:rect.left,top:rect.top,right:rect.right,bottom:rect.bottom,width:rect.width,height:rect.height,scrollHeight:element.scrollHeight,clientHeight:element.clientHeight};});
    if(resultLayout.left<0||resultLayout.top<0||resultLayout.right>width||resultLayout.bottom>height||resultLayout.scrollHeight>resultLayout.clientHeight+2||await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw new Error(`Mission result is clipped at ${width}x${height}: ${JSON.stringify(resultLayout)}`);
    if(!await page.getByRole('button',{name:'เล่นซ้ำ'}).isVisible())throw new Error(`Restart action is not visible at ${width}x${height}`);
  }
  await page.setViewportSize({width:1440,height:900});await page.waitForTimeout(100);
  await page.screenshot({path:'screenshots/game-result.png',fullPage:true});
  if(errors.length)throw new Error(`Browser errors:\n${errors.join('\n')}`);

  await page.close();
  const mobile=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  mobile.setDefaultTimeout(12000);
  await mobile.goto(`http://127.0.0.1:${port}/game.html`); await mobile.locator('.phaser-host canvas').waitFor();
  const overflow=await mobile.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
  if(overflow)throw new Error('Mobile layout has horizontal overflow');
  await mobile.getByRole('button',{name:'เริ่มดูแลผู้ป่วย'}).tap();
  await mobile.getByRole('heading',{name:'ฟังผู้ป่วย ก่อนเริ่มประเมิน'}).waitFor();
  const mobileCanvas=await mobile.locator('.phaser-host canvas').boundingBox();
  const mobileTool=await mobile.locator('.toolbar button').filter({hasText:'ซักประวัติ'}).boundingBox();
  if(!mobileCanvas||!mobileTool)throw new Error('Mobile drag bounds unavailable');
  const mobileInterviewTarget=await mobile.evaluate(()=>{const canvas=document.querySelector('.phaser-host canvas');const view=JSON.parse(document.querySelector('.room-stage')?.getAttribute('data-world-view')??'null');const bounds=canvas.getBoundingClientRect();return{x:bounds.left+(550-view.x)/view.width*bounds.width,y:bounds.top+(280-view.y)/view.height*bounds.height};});
  const mobileInterviewFeedback=mobile.evaluate(()=>new Promise((resolve,reject)=>{
    const capture=()=>{
      const element=document.querySelector('.interaction-toast.success');
      if(!element)return;
      const rect=element.getBoundingClientRect();const monitor=document.querySelector('.monitor')?.getBoundingClientRect();
      observer.disconnect();window.clearTimeout(timer);
      resolve({rect:rect.toJSON(),font:parseFloat(getComputedStyle(element).fontSize),monitor:monitor?.toJSON()});
    };
    const observer=new MutationObserver(capture);const timer=window.setTimeout(()=>{observer.disconnect();reject(new Error('Touch interaction did not produce success feedback'))},8000);
    observer.observe(document.body,{childList:true,subtree:true,attributes:true});capture();
  }));
  await touchDragGesture(mobile,{x:mobileTool.x+mobileTool.width/2,y:mobileTool.y+mobileTool.height/2},mobileInterviewTarget,11);
  await mobile.locator('.mission-compact').getByText(/1\/1 จุดตรวจ/).waitFor();
  const mobileToast=await mobileInterviewFeedback;
  if(mobileToast.font<13||mobileToast.rect.left<(mobileToast.monitor?.right??0))throw new Error(`Mobile interaction feedback should be readable and clear the monitor: ${JSON.stringify(mobileToast)}`);
  const touchDrag=async(source,target)=>{
    const start=await source.boundingBox();if(!start)throw Error('Touch drag source unavailable');
    const currentCanvas=await mobile.locator('.phaser-host canvas').boundingBox();if(!currentCanvas)throw Error('Touch canvas bounds unavailable');
    const from={x:start.x+start.width/2,y:start.y+start.height/2};
    const to=target.canvas?await mobile.evaluate(({x,y})=>{const canvas=document.querySelector('.phaser-host canvas');const view=JSON.parse(document.querySelector('.room-stage')?.getAttribute('data-world-view')??'null');if(!canvas||!view)throw Error('Phaser world view unavailable for touch');const bounds=canvas.getBoundingClientRect();return{x:bounds.left+(x-view.x)/view.width*bounds.width,y:bounds.top+(y-view.y)/view.height*bounds.height};},{x:target.x,y:target.y}):await (async()=>{const box=await mobile.locator(`[data-answer-slot="${target.slot}"]`).boundingBox();if(!box)throw Error('Touch answer slot unavailable');return{x:box.x+box.width/2,y:box.y+box.height/2};})();
    await touchDragGesture(mobile,from,to,22);
  };
  await mobile.getByRole('button',{name:'เริ่มประเมิน'}).click();
  const mobileStethoscope=mobile.locator('.toolbar button').filter({hasText:'Stethoscope'});
  await mobileStethoscope.tap();
  if(await mobileStethoscope.getAttribute('aria-pressed')!=='true')throw new Error('A touch tap should select the medical tool without a drag');
  const mobileChecklist=mobile.locator('.mission-panel.mode-field .objectives');
  if(await mobileChecklist.isVisible())throw new Error('The collapsed mobile quest HUD should keep the room clear of its expanded checklist');
  await mobile.getByRole('button',{name:'แสดงภารกิจ'}).tap();
  if(!await mobileChecklist.isVisible())throw new Error('Expanding the mobile quest HUD should reveal its full checklist');
  await mobile.getByRole('button',{name:'ย่อภารกิจ'}).tap();
  const mobileViewport=await mobile.evaluate(()=>({height:innerHeight,scrollHeight:document.documentElement.scrollHeight,toolbar:document.querySelector('.toolbar')?.getBoundingClientRect().toJSON()}));
  if(mobileViewport.scrollHeight>mobileViewport.height+1||!mobileViewport.toolbar||mobileViewport.toolbar.bottom>mobileViewport.height)throw new Error(`Mobile field play should fit the game viewport without page scrolling: ${JSON.stringify(mobileViewport)}`);
  await mobile.screenshot({path:'screenshots/game-interaction-mobile.png',fullPage:true});
  const mobileAssessmentCanvas=await mobile.locator('.phaser-host canvas').boundingBox();
  if(!mobileAssessmentCanvas)throw new Error('Mobile assessment canvas bounds unavailable');
  const mobileChestPoint=await mobile.evaluate(()=>{const canvas=document.querySelector('.phaser-host canvas');const view=JSON.parse(document.querySelector('.room-stage')?.getAttribute('data-world-view')??'null');const bounds=canvas.getBoundingClientRect();return{x:bounds.left+(550-view.x)/view.width*bounds.width,y:bounds.top+(395-view.y)/view.height*bounds.height};});
  await mobile.touchscreen.tap(mobileChestPoint.x,mobileChestPoint.y);
  await mobile.waitForFunction(()=>document.querySelectorAll('.objective.done').length===1);
  let mobileAssessmentCount=1;
  for(const [name,position] of [['BP cuff',{x:490,y:442}],['SpO₂',{x:526,y:575}]]){
    await touchDrag(mobile.locator('.toolbar button').filter({hasText:name}),{canvas:true,...position});
    mobileAssessmentCount+=1;
    await mobile.waitForTimeout(1700);
    if(await mobile.locator('.objective.done').count()<mobileAssessmentCount){
      await mobile.screenshot({path:'screenshots/game-mobile-touch-failure.png',fullPage:true});
      throw new Error(`Mobile touch drag failed: ${name}; feedback=${await mobile.locator('.feedback').innerText()}; tool=${await mobile.locator('.toolbar button').filter({hasText:name}).getAttribute('aria-pressed')}; canvas=${JSON.stringify(await mobile.locator('canvas').boundingBox())}`);
    }
  }
  await mobile.getByRole('button',{name:'บันทึกการประเมิน'}).click();
  await mobile.locator('.surface-instruction b').getByText('จัดวางปัญหาและ ข้อมูลสนับสนุน').waitFor();
  if(await mobile.locator('.matching-board').evaluate(element=>getComputedStyle(element).gridTemplateColumns.split(' ').length)!==1)throw new Error('Touch answer board should collapse to one column on a phone');
  await touchDrag(mobile.locator('.answer-card').filter({hasText:'ประเด็นด้านอื่น'}),{slot:'problem'});
  await touchDrag(mobile.locator('.answer-card').filter({hasText:'ข้อมูลที่ไม่เกี่ยวกับการประเมิน'}),{slot:'support'});
  if(await mobile.locator('.answer-slot.filled').count()!==2)throw new Error('Touch drag did not place answers into slots');
  if(errors.length)throw new Error(`Mobile browser errors:\n${errors.join('\n')}`);

  const mobileActivity=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const mobileMedicationCheckpoint={version:2,caseId:'cardiosim-vertical-slice',mission:'MEDICATION',completed:['history','lungs','bp','oxygen'],chart:[],leads:[],score:{mistakeCount:0,hintCount:0,attempts:0,completionTime:null},elapsed:9000,phaseElapsed:0,emergencyElapsed:0,vitals:{hr:112,bpSystolic:168,bpDiastolic:98,rr:24,spo2:95},decisions:[],decisionConfirmed:false,responses:{},activitySteps:[],activityPlacements:{},activityStepProgress:{}};
  await mobileActivity.addInitScript(checkpoint=>localStorage.setItem('cardiosim.phaser.checkpoint.cardiosim-vertical-slice.v2',JSON.stringify(checkpoint)),mobileMedicationCheckpoint);
  mobileActivity.on('pageerror',error=>errors.push(error.message));
  await mobileActivity.goto(`http://127.0.0.1:${port}/game.html`);await mobileActivity.locator('.phaser-host canvas').waitFor();
  await mobileActivity.locator('.resume-banner').waitFor();await mobileActivity.getByRole('button',{name:'เล่นต่อ'}).tap();
  await mobileActivity.locator('[data-room-surface="medication-station"]').waitFor();
  const mobileEquipment=await mobileActivity.locator('.activity-equipment-token').boundingBox();
  const mobileStep=await mobileActivity.locator('[data-activity-step-target="step_order_check"]').boundingBox();
  if(!mobileEquipment||!mobileStep)throw new Error('Mobile medication equipment or step target is not reachable');
  await touchDragGesture(mobileActivity,{x:mobileEquipment.x+mobileEquipment.width/2,y:mobileEquipment.y+mobileEquipment.height/2},{x:mobileStep.x+mobileStep.width/2,y:mobileStep.y+mobileStep.height/2},71);
  await mobileActivity.locator('[data-activity-step-target="step_order_check"].complete').waitFor();
  for(const stepId of ['step_label_check','step_handwash_prep']){
    const source=mobileActivity.locator('.activity-equipment-token');const target=mobileActivity.locator(`[data-activity-step-target="${stepId}"]`);const sourceBox=await source.boundingBox(),targetBox=await target.boundingBox();if(!sourceBox||!targetBox)throw Error(`Touch medication step ${stepId} bounds unavailable`);
    await touchDragGesture(mobileActivity,{x:sourceBox.x+sourceBox.width/2,y:sourceBox.y+sourceBox.height/2},{x:targetBox.x+targetBox.width/2,y:targetBox.y+targetBox.height/2},61);await target.locator('.step-number').waitFor();await mobileActivity.waitForFunction(id=>document.querySelector(`[data-activity-step-target="${id}"]`)?.classList.contains('complete'),stepId);
  }
  await mobileActivity.waitForFunction(()=>{const element=document.querySelector('.syringe-minigame');const rect=element?.getBoundingClientRect();return !!rect&&rect.top>=0&&rect.bottom<=innerHeight;});
  const mobileSyringe=mobileActivity.locator('.syringe-tool-token');const mobileAmpoule=mobileActivity.locator('[data-syringe-ampoule-target="ampoule"]');const mobileSyringeBox=await mobileSyringe.boundingBox(),mobileAmpouleBox=await mobileAmpoule.boundingBox();if(!mobileSyringeBox||!mobileAmpouleBox)throw Error('Touch syringe or ampoule target is not reachable');
  await touchDragGesture(mobileActivity,{x:mobileSyringeBox.x+mobileSyringeBox.width/2,y:mobileSyringeBox.y+mobileSyringeBox.height/2},{x:mobileAmpouleBox.x+mobileAmpouleBox.width/2,y:mobileAmpouleBox.y+mobileAmpouleBox.height/2},61);
  await mobileActivity.locator('[data-syringe-plunger]').waitFor();
  const mobilePlunger=await mobileActivity.locator('[data-syringe-plunger]').boundingBox();if(!mobilePlunger)throw Error('Touch syringe plunger bounds unavailable');
  await touchDragGesture(mobileActivity,{x:mobilePlunger.x+5,y:mobilePlunger.y+mobilePlunger.height/2},{x:mobilePlunger.x+mobilePlunger.width*.8,y:mobilePlunger.y+mobilePlunger.height/2},61);
  if(Number(await mobileActivity.locator('[data-syringe-plunger]').inputValue())<3.5)throw Error('Touch drag should visibly pull the syringe plunger');
  if(await mobileActivity.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw new Error('Mobile medication station has horizontal overflow');
  await mobileActivity.screenshot({path:'screenshots/game-medication-touch-390x844.png',fullPage:true});

  const mobileECG=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const mobileECGCheckpoint={version:2,caseId:'cardiosim-vertical-slice',mission:'ECG_PLACEMENT',completed:['history','lungs','bp','oxygen','a','b','c'],chart:[],leads:[],score:{mistakeCount:0,hintCount:0,attempts:0,completionTime:null},elapsed:15000,phaseElapsed:0,emergencyElapsed:8000,vitals:{hr:148,bpSystolic:220,bpDiastolic:130,rr:36,spo2:82},decisions:[],decisionConfirmed:false,responses:{}};
  await mobileECG.addInitScript(checkpoint=>localStorage.setItem('cardiosim.phaser.checkpoint.cardiosim-vertical-slice.v2',JSON.stringify(checkpoint)),mobileECGCheckpoint);
  mobileECG.on('pageerror',error=>errors.push(error.message));
  await mobileECG.goto(`http://127.0.0.1:${port}/game.html`); await mobileECG.locator('.phaser-host canvas').waitFor();
  await mobileECG.getByRole('button',{name:'เล่นต่อ'}).click(); await mobileECG.locator('.ecg-mobile-procedure').waitFor();
  const mobileLeadDrag=async(id)=>{
    const source=mobileECG.locator('.ecg-mobile-lead').filter({hasText:id});const from=await source.boundingBox();
    const end=await mobileECG.evaluate(leadId=>{
      const layout=JSON.parse(document.querySelector('main')?.dataset.ecgLayout??'{}');
      const target=JSON.parse(document.querySelector('main')?.dataset.ecgTargets??'[]').find((item)=>item.id===leadId);
      const image=document.querySelector('.ecg-mobile-map img')?.getBoundingClientRect();
      if(!target||!image)throw new Error(`Mobile ECG lead ${leadId} has no configured chest point`);
      return{x:image.left+(target.x-layout.image.x)/layout.image.width*image.width,y:image.top+(target.y-layout.image.y)/layout.image.height*image.height};
    },id);
    if(!from)throw new Error(`Mobile ECG lead ${id} has no touch bounds`);
    const start={x:from.x+from.width/2,y:from.y+from.height/2};
    await touchDragGesture(mobileECG,start,end,61);
  };
  for(const [index,id] of ['V1','V2','V3','V4','V5','V6'].entries()){
    await mobileLeadDrag(id);await mobileECG.locator(`[data-mobile-ecg-target="${id}"].complete`).waitFor();
    if(await mobileECG.locator('.ecg-mobile-target.complete').count()!==index+1)throw new Error(`Mobile ECG lead count did not advance for ${id}`);
  }
  await mobileECG.getByRole('button',{name:'Confirm ECG'}).click();
  await mobileECG.locator('.activity-surface-instruction b').getByText('อ่านผล ECG และบันทึกคำตอบ').waitFor();
  if(!await mobileECG.locator('.phaser-host canvas').isVisible())throw new Error('Mobile ECG confirmation should remain in the PatientRoomScene');
  if(errors.length)throw new Error(`Mobile ECG browser errors:\n${errors.join('\n')}`);

  const case2Page=await browser.newPage({viewport:{width:1440,height:900}});
  case2Page.setDefaultTimeout(12000);
  const demoStudent={studentId:'browser-qa',name:'Browser QA'};
  const emptyTelemetry={student:demoStudent,preTestScore:0,preTestAnswers:{},postTestScore:0,postTestAnswers:{},learningGain:0,discoveredHotspots:[],prioritizationErrors:0,medicationErrors:0,ioErrors:0,crisisResponseTimeSeconds:0,totalTimeSeconds:0,surveyScores:{},feedbackText:''};
  await case2Page.addInitScript(value=>{if(!sessionStorage.getItem('cardiosim.game.return.v1'))sessionStorage.setItem('cardiosim.game.return.v1',JSON.stringify(value));},{student:demoStudent,telemetry:emptyTelemetry});
  case2Page.on('pageerror',error=>errors.push(error.message));
  case2Page.on('console',message=>{if(message.type()==='error')errors.push(message.text());});
  await case2Page.goto(`http://127.0.0.1:${port}/?stage=SCENARIO_SELECT`);
  await case2Page.getByRole('button',{name:'เลือกเล่นเคสที่ 2 (เข้าสู่เนื้อหาจำลอง)'}).click();
  await case2Page.waitForURL(/game\.html\?case=case-02&from=web/);
  await case2Page.locator('.phaser-host canvas').waitFor();
  if(await case2Page.locator('.brand small').innerText()!=='CASE-02')throw new Error('Web scenario selection did not load the Case 2 patient room');
  const case2VitalText=()=>case2Page.locator('.monitor .vital-large b, .monitor .vital-small b').allTextContents();
  if(await case2Page.locator('.monitor-no-trace').count()!==1||JSON.stringify(await case2VitalText())!==JSON.stringify(['—','—','—/—','—']))throw new Error('Case 2 must not invent an ECG trace or numeric vital signs');
  const case2Canvas=case2Page.locator('.phaser-host canvas');
  const case2Point=async(x,y)=>case2Page.evaluate(({x,y})=>{const canvas=document.querySelector('.phaser-host canvas');const view=JSON.parse(document.querySelector('.room-stage')?.getAttribute('data-world-view')??'null');if(!canvas||!view)throw Error('Case 2 Phaser world view unavailable');const bounds=canvas.getBoundingClientRect();return{x:bounds.left+(x-view.x)/view.width*bounds.width,y:bounds.top+(y-view.y)/view.height*bounds.height};},{x,y});
  const case2Drag=async(source,target)=>{const from=await source.boundingBox();if(!from)throw Error('Case 2 drag source bounds unavailable');const end=await case2Point(target.x,target.y);await case2Page.mouse.move(from.x+from.width/2,from.y+from.height/2);await case2Page.mouse.down();await case2Page.mouse.move(end.x,end.y,{steps:9});await case2Page.mouse.up();};
  await case2Page.getByRole('button',{name:'เริ่มดูแลผู้ป่วย'}).click();
  await case2Drag(case2Page.locator('.toolbar button').filter({hasText:'ซักประวัติ'}),{x:550,y:280});
  await case2Page.waitForFunction(()=>document.querySelectorAll('.objective.done').length===1);
  await case2Page.getByRole('button',{name:'เริ่มประเมิน'}).click();
  for(const [index,[name,target]] of [['Stethoscope',{x:550,y:395}],['BP cuff',{x:490,y:442}],['SpO₂',{x:526,y:575}]].entries()){
    await case2Drag(case2Page.locator('.toolbar button').filter({hasText:name}),target);
    await case2Page.waitForFunction(count=>document.querySelectorAll('.objective.done').length>=count,index+1);
  }
  await case2Page.waitForFunction(()=>document.querySelectorAll('.objective.done').length===3);
  if(await case2Page.locator('.feedback.error').count())throw new Error('Case 2 assessment should record actions as ungraded practice');
  await case2Page.getByRole('button',{name:'บันทึกการประเมิน'}).click();
  for(const [title,first,second] of [['จัดวางปัญหาและ ข้อมูลสนับสนุน',0,1],['เลือกการพยาบาล ให้สัมพันธ์กับปัญหา',0,1]]){
    await case2Page.locator('.surface-instruction b').getByText(title).waitFor();
    await case2Page.locator('.answer-card').nth(first).click(); await case2Page.locator('.answer-card').nth(second).click();
    await case2Page.getByRole('button',{name:'Confirm · ตรวจคำตอบ'}).click();
    if(await case2Page.locator('.feedback.error').count())throw new Error('Case 2 decisions must be recorded without a clinically correct/incorrect judgment');
    await case2Page.getByRole('button',{name:'Next'}).click();
  }
  await case2Page.locator('.activity-surface-instruction b').getByText('ตรวจคำสั่งยา และบันทึกการเตรียม').waitFor();
  if(await case2Page.locator('.activity-card input, .activity-card select').count()||await case2Page.locator('.activity-equipment-token').count())throw new Error('Case 2 must not expose medication fields or equipment without a Doctor Order');
  if(await case2Page.locator('.missing-data-card').getByText('ไม่มีข้อมูลในเรื่องย่อ').count()<2)throw new Error('Case 2 medication station should identify the missing order and allergy source');
  await case2Page.getByRole('button',{name:'บันทึกว่าไม่มีข้อมูลใน Case'}).click();
  await case2Page.getByRole('button',{name:'Confirm · บันทึกข้อมูลที่ไม่มี'}).click();
  await case2Page.getByRole('button',{name:'Next'}).click();
  await case2Page.locator('.activity-surface-instruction b').getByText('คำนวณสมดุล สารน้ำเข้าและออก').waitFor();
  if(await case2Page.locator('.io-item-token,.io-zone,.activity-card input,.balance-options').count())throw new Error('Case 2 I/O board must not fabricate numeric items or a calculation worksheet');
  await case2Page.getByRole('button',{name:'บันทึกว่าไม่มีข้อมูลใน Case'}).click();
  await case2Page.getByRole('button',{name:'Confirm · บันทึกข้อมูลที่ไม่มี'}).click();
  if(await case2Page.locator('.feedback.error').count())throw new Error('Case 2 I/O entry should be ungraded');
  await case2Page.getByRole('button',{name:'Next'}).click();
  await case2Page.getByRole('heading',{name:'อาการผู้ป่วย กำลังเปลี่ยนไป'}).waitFor();
  if(!await case2Page.locator('.emergency-room').isVisible()||JSON.stringify(await case2VitalText())!==JSON.stringify(['—','—','—/—','—']))throw new Error('Case 2 emergency must change the scene state while keeping unavailable vitals blank');
  if(!await case2Page.locator('.game-hud.is-emergency .hud-emergency').isVisible())throw new Error('Case 2 emergency state should also be visible in the game HUD');
  await case2Page.waitForTimeout(5300);
  await case2Page.getByRole('heading',{name:'ประเมิน ABC อย่างเป็นลำดับ'}).waitFor();
  for(const target of [{x:550,y:280},{x:550,y:395},{x:602,y:558}]){
    await case2Drag(case2Page.locator('.toolbar button').filter({hasText:'ประเมิน ABC'}),target);
    await case2Page.waitForFunction(count=>document.querySelectorAll('.objective.done').length>=count,await case2Page.locator('.objective.done').count()+1);
  }
  await case2Page.getByRole('button',{name:'เตรียมติด ECG'}).click();
  const case2Targets=JSON.parse(await case2Page.locator('main').getAttribute('data-ecg-targets')??'[]');
  const case2Layout=JSON.parse(await case2Page.locator('main').getAttribute('data-ecg-layout')??'{}');
  const case2LeadDrag=async(index)=>{const tray=await case2Point(case2Layout.tray.x+index*case2Layout.tray.spacing,case2Layout.tray.y);const target=case2Targets[index];const end=await case2Point(target.x,target.y);await case2Page.mouse.move(tray.x,tray.y);await case2Page.mouse.down();await case2Page.mouse.move(end.x,end.y,{steps:8});await case2Page.mouse.up();};
  for(let index=0;index<6;index++){await case2LeadDrag(index);await case2Page.waitForFunction(count=>document.querySelectorAll('.lead-status button.lead-done').length>=count,index+1);}
  await case2Page.getByRole('button',{name:'Confirm · บันทึก ECG'}).click();
  await case2Page.locator('.activity-surface-instruction b').getByText('อ่านผล ECG และบันทึกคำตอบ').waitFor();
  if(await case2Page.locator('.ecg-no-strip').count()!==1||await case2Page.locator('.ecg-readout').count())throw new Error('Case 2 ECG console must show no strip or rhythm readout');
  await case2Page.locator('.activity-card input[type="text"]').fill('practice note');
  await case2Page.getByRole('button',{name:'Confirm · บันทึกการอ่าน'}).click();
  await case2Page.getByRole('button',{name:'Next'}).click();
  await case2Page.locator('.surface-instruction b').getByText('เลือกการตอบสนอง แล้วดูผลที่ผู้ป่วย').waitFor();
  if(!await case2Page.locator('[data-room-surface="monitor-response"]').isVisible())throw new Error('Case 2 emergency response should still use the in-room monitor surface');
  await case2Page.locator('.answer-card').first().click();
  await case2Page.getByRole('button',{name:'Confirm · ตรวจคำตอบ'}).click();
  if(await case2Page.locator('.feedback.error').count())throw new Error('Case 2 treatment choice must be recorded without a clinical judgment');
  await case2Page.getByRole('button',{name:'Next'}).click();
  await case2Page.waitForTimeout(6600); await case2Page.getByRole('button',{name:'ดูผลภารกิจ'}).click();
  await case2Page.getByRole('heading',{name:'ดูแลครบ จบภารกิจจำลอง'}).waitFor();
  if(await case2Page.getByText('DEMO SCORE').count()||!await case2Page.getByText('PRACTICE RUN').isVisible())throw new Error('Case 2 result must be marked as an unscored practice run');
  await case2Page.screenshot({path:'screenshots/game-case-02-result.png',fullPage:true});
  await case2Page.getByRole('button',{name:'ไปทำ Post-test'}).click();
  await case2Page.waitForURL(/\?stage=POSTTEST/);
  const returned=await case2Page.evaluate(()=>JSON.parse(sessionStorage.getItem('cardiosim.game.return.v1')??'{}'));
  if(returned.telemetry?.gameResult?.caseId!=='case-02'||returned.telemetry.gameResult.scoreStatus!=='unscored'||returned.student?.studentId!=='browser-qa')throw new Error(`Typed game result was not returned to the web Post-test: ${JSON.stringify(returned.telemetry?.gameResult)}`);
  if(errors.length)throw new Error(`Case 2/browser integration errors:\n${errors.join('\n')}`);
  console.log('Browser flow passed: desktop drag/drop and retry, chart privacy, Case 1 demo worksheets and treatment, emergency and ABC, six ECG leads, mobile touch and ECG layouts, and complete Case 2 through typed POSTTEST return.');
} finally { await browser.close(); server.kill(); }
