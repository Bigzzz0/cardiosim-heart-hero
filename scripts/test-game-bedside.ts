import {chromium, type Page} from 'playwright';
import {spawn} from 'node:child_process';
import assert from 'node:assert/strict';
import {CaseEngine} from '../src/game/core/CaseEngine';
import {verticalSlice} from '../src/game/cases/verticalSlice';

const port=4181;
const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','--host','127.0.0.1','--port',String(port),'--strictPort'],{stdio:'ignore'});
const browser=await chromium.launch({headless:true});
async function drag(page:Page,from:{x:number;y:number},to:{x:number;y:number},touch:boolean){
 if(touch){const c=await page.context().newCDPSession(page);await c.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{id:1,...from}]});for(let i=1;i<=10;i++)await c.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{id:1,x:from.x+(to.x-from.x)*i/10,y:from.y+(to.y-from.y)*i/10}]});await c.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await c.detach();}
 else {await page.mouse.move(from.x,from.y);await page.mouse.down();await page.mouse.move(to.x,to.y,{steps:10});await page.mouse.up();}
}
try{
 for(let i=0;i<40;i++){try{if((await fetch(`http://127.0.0.1:${port}`)).ok)break;}catch{}await new Promise(resolve=>setTimeout(resolve,250));}
 for(const [width,height] of [[1440,900],[1280,720],[1024,768],[390,844]]){
  const game=new CaseEngine(verticalSlice);game.mission.jumpTo('MEDICATION');
  const steps=game.mission.current.activity!.steps!;game.activitySteps=steps.slice(0,3).map(s=>s.id);
  const page=await browser.newPage({viewport:{width,height},hasTouch:width<760});const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(checkpoint=>localStorage.setItem(`cardiosim.phaser.checkpoint.${checkpoint.caseId}.v2`,JSON.stringify(checkpoint)),game.checkpoint());
  await page.goto(`http://127.0.0.1:${port}/game.html`);await page.locator('.resume-banner button').first().click();
  const token=page.locator('.syringe-tool-token');await token.scrollIntoViewIfNeeded();
  const source=(await token.boundingBox())!;const target=(await page.locator('.ampoule-drop-target').boundingBox())!;
  await drag(page,{x:source.x+source.width/2,y:source.y+source.height/2},{x:target.x+target.width/2,y:target.y+target.height/2},width<760);
  const grip=page.locator('[data-syringe-plunger]');await grip.waitFor();await grip.scrollIntoViewIfNeeded();
  assert.equal(await page.locator('input[type=range].syringe-plunger').count(),0);
  assert.equal(await page.locator('.syringe-target-mark,.on-target').count(),0,'no pre-confirm answer feedback');
  const bounds=(await grip.boundingBox())!;const body=(await page.locator('.syringe-instrument').boundingBox())!;
  const max=Number(await grip.getAttribute('aria-valuemax'));
  await drag(page,{x:bounds.x+bounds.width/2,y:bounds.y+bounds.height/2},{x:bounds.x+bounds.width/2+body.width*.26*2/max,y:bounds.y+bounds.height/2},width<760);
  assert(Math.abs(Number(await grip.getAttribute('aria-valuenow'))-2)<.2,'direct mouse/touch plunger movement');
  if(width<760){
   const now=(await grip.boundingBox())!;const original=Number(await grip.getAttribute('aria-valuenow'));const c=await page.context().newCDPSession(page);
   await c.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{id:8,x:now.x+now.width/2,y:now.y+now.height/2}]});
   await c.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{id:8,x:now.x+now.width/2+15,y:now.y+now.height/2}]});
   await c.send('Input.dispatchTouchEvent',{type:'touchCancel',touchPoints:[]});await c.detach();
   assert.equal(Number(await grip.getAttribute('aria-valuenow')),original,'touchCancel rolls back uncommitted piston movement');
  }
  await page.locator('.syringe-confirm').click();await page.locator('.feedback.error').waitFor();
  await grip.focus();await page.keyboard.press('Home');for(let i=0;i<40;i++)await page.keyboard.press('ArrowRight');
  assert.equal(Number(await grip.getAttribute('aria-valuenow')),4,'keyboard adjusts same engine state');
  await page.screenshot({path:`screenshots/bedside-syringe-${width}x${height}.png`});
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'no horizontal scrolling');
  await page.locator('.syringe-confirm').click();await page.locator('[data-activity-step-target="step_draw_med"].complete').waitFor({state:'attached'});
  assert.deepEqual(errors,[]);await page.close();
 }
 console.log('Bedside workbench passed four sizes: real mouse/touch plunger, keyboard, Confirm/retry and no answer reveal.');
}finally{await browser.close();server.kill();}
