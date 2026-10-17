import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
const port=4180;const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','--host','127.0.0.1','--port',String(port),'--strictPort'],{stdio:'ignore'});
for(let i=0;i<40;i++){try{if((await fetch(`http://127.0.0.1:${port}/game.html`)).ok)break;}catch{}await new Promise(r=>setTimeout(r,250));}
const browser=await chromium.launch({headless:true});
try{
 for(const [width,height] of [[1440,900],[1280,720],[1024,768],[390,844]]){
  const page=await browser.newPage({viewport:{width,height},hasTouch:width<760});const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(`http://127.0.0.1:${port}/game.html`,{waitUntil:'domcontentloaded'});await page.locator('.phaser-host canvas').waitFor();await page.waitForFunction(()=>document.querySelector('.room-stage').dataset.worldView);await page.waitForTimeout(700);
  await page.screenshot({path:`screenshots/storybook-intro-${width}x${height}.png`});
  await page.locator('.mission-panel .full-primary').click();await page.waitForTimeout(300);
  const tray=await page.locator('.toolbar').boundingBox();assert(tray&&tray.x>=0&&tray.x+tray.width<=width&&tray.y+tray.height<=height,'tray visible');
  const metrics=await page.locator('.toolbar button').evaluateAll(es=>es.map(el=>{const r=el.getBoundingClientRect();return{w:r.width,h:r.height};}));assert(metrics.every(r=>r.w>=44&&r.h>=44),'touch sizes');
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  assert.equal(await page.locator('.empty-tool-slot').count(),0,'no decorative empty slots');assert.equal(await page.locator('.hud-next').count(),0,'no duplicate advance action');assert.equal(await page.evaluate(()=>performance.getEntriesByType('resource').some(e=>/game\/supplied\/(round-white|pill-white|button-white|paper-note|slot-selected|arrow-right|arrow-left|check)\.png/.test(e.name))),false,'no Cozy UI bitmap loaded');
  await page.screenshot({path:`screenshots/storybook-room-${width}x${height}.png`});
  const point=async id=>page.evaluate(id=>{const target=document.querySelector(`[data-patient-hotspot="${id}"]`);const r=target.getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2};},id);
  const token=await page.locator('.toolbar button').filter({hasText:'ซักประวัติ'}).boundingBox();const from={x:token.x+token.width/2,y:token.y+token.height/2},to=await point('head');
  if(width<760){const cdp=await page.context().newCDPSession(page);await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{id:1,...from}]});for(let i=1;i<=12;i++)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{id:1,x:from.x+(to.x-from.x)*i/12,y:from.y+(to.y-from.y)*i/12}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await cdp.detach();}else{await page.mouse.move(from.x,from.y);await page.mouse.down();await page.mouse.move(to.x,to.y,{steps:12});await page.mouse.up();}
  await page.waitForFunction(()=>document.querySelector('.objective-pips')?.getAttribute('aria-valuenow')==='1');
  await page.locator('.mission-panel .primary:visible').first().click();await page.waitForFunction(()=>document.querySelector('main').dataset.mission==='ASSESSMENT');await page.waitForTimeout(250);
  const trayTop=(await page.locator('.toolbar').boundingBox()).y;const finger=await page.locator('[data-patient-hotspot="finger"]').boundingBox();assert(finger&&finger.y+finger.height<trayTop,'finger target clears tray');
  await page.screenshot({path:`screenshots/storybook-assessment-${width}x${height}.png`});
  const attempts=await page.locator('main').getAttribute('data-attempts');const mistakes=await page.locator('main').getAttribute('data-mistakes');
  const cancelTool=await page.locator('[data-tool-id="stethoscope"]').boundingBox();
  if(width>=760){await page.mouse.move(cancelTool.x+cancelTool.width/2,cancelTool.y+25);await page.mouse.down();await page.mouse.move(30,25,{steps:10});await page.mouse.up();
   assert.equal(await page.locator('main').getAttribute('data-attempts'),attempts,'dropping on HUD/outside cancels');assert.equal(await page.locator('main').getAttribute('data-mistakes'),mistakes);
  }
  const before=await page.locator('.toolbar .tray-count').textContent();
  const steth=page.locator('.toolbar button').filter({hasText:width<760?'หัวฟัง':'Stethoscope'}).first();
  const b=await steth.boundingBox(); const chest=await point('chest');
  if(width<760){const c=await page.context().newCDPSession(page);await c.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{id:2,x:b.x+b.width/2,y:b.y+25}]});await c.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{id:2,...chest}]});await c.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await c.detach();}
  else {await page.mouse.move(b.x+b.width/2,b.y+25);await page.mouse.down();await page.mouse.move(chest.x,chest.y,{steps:10});await page.mouse.up();}
  await page.waitForFunction(()=>document.querySelector('main').dataset.interactionPending==='true');
  assert.equal(await page.locator('.toolbar .tray-count').textContent(),before,'chart stays private during examination');
  await page.screenshot({path:`screenshots/bedside-contact-${width}x${height}.png`});
  await page.waitForFunction(()=>document.querySelector('.objective-pips').getAttribute('aria-valuenow')==='1');
  assert.equal(Number(await page.locator('.toolbar .tray-count').textContent()),Number(before)+1,'chart records on completion');
  assert.deepEqual(errors,[]);await page.close();
 }
 console.log('Reference UI passed four sizes: real mouse/touch first drag, contextual tool tray, local mission action, assessment, no page errors/overflow.');
}finally{await browser.close();server.kill();}
