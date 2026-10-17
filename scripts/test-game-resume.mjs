import {chromium} from 'playwright';
import {spawn} from 'node:child_process';
import assert from 'node:assert/strict';
import {CaseEngine} from '../src/game/core/CaseEngine.ts';
import {getGameCase} from '../src/game/cases/index.ts';
const port=4186;
const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','--host','127.0.0.1','--port',String(port),'--strictPort'],{stdio:'ignore'});
const browser=await chromium.launch({headless:true});
try{
 for(let i=0;i<40;i++){try{if((await fetch(`http://127.0.0.1:${port}`)).ok)break;}catch{}await new Promise(r=>setTimeout(r,250));}
 for(const id of ['case-01','case-02']){
  const config=getGameCase(id);const game=new CaseEngine(config);game.mission.jumpTo('MEDICATION');
  if(config.gradable)game.activitySteps=['step_order_check'];
  const page=await browser.newPage({viewport:{width:390,height:844},hasTouch:true,isMobile:true});
  await page.addInitScript(save=>localStorage.setItem(`cardiosim.phaser.checkpoint.${save.caseId}.v2`,JSON.stringify(save)),game.checkpoint());
  await page.goto(`http://127.0.0.1:${port}/game.html?case=${id}`);await page.locator('.resume-banner').waitFor();
  await page.waitForTimeout(5600);
  const mission=await page.evaluate(caseId=>JSON.parse(localStorage.getItem(`cardiosim.phaser.checkpoint.${caseId}.v2`)).mission,config.id);
  assert.equal(mission,'MEDICATION','idle briefing must not overwrite the resumable checkpoint');
  await page.locator('.resume-banner button').first().tap();await page.locator('main[data-mission="MEDICATION"]').waitFor();
  if(config.gradable){
   const object=page.locator('[data-workbench-object="ampoule"]');const a=await object.boundingBox();const target=await page.locator('[data-workbench-target="label-reader"]').boundingBox();assert(a&&target);
   const c=await page.context().newCDPSession(page);await c.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{id:1,x:a.x+a.width/2,y:a.y+a.height/2}]});await c.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{id:1,x:target.x+target.width/2,y:target.y+target.height/2}]});await c.send('Input.dispatchTouchEvent',{type:'touchCancel',touchPoints:[]});await c.detach();
   assert.equal(await object.evaluate(el=>el.classList.contains('reviewed')),false,'cancelled workbench gesture does not place the ampoule');
   assert.equal(await page.locator('main').getAttribute('data-mistakes'),'0');
   assert((await page.locator('.medication-overview').innerText()).includes('1/7'),'completed preparation steps survive resume');
  }else assert.equal(await page.locator('[data-workbench-object]').count(),0,'missing-order case has no medication props');
  await page.close();
 }
 console.log('Delayed Resume preserves both cases; completed preparation survives and touchCancel does not place or score a workbench object.');
}finally{await browser.close();server.kill();}
