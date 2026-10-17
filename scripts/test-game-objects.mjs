import {chromium} from 'playwright';
import {spawn} from 'node:child_process';
import assert from 'node:assert/strict';
import {CaseEngine} from '../src/game/core/CaseEngine.ts';
import {verticalSlice} from '../src/game/cases/verticalSlice.ts';
import {performWorkbenchStep} from './workbench-browser-helpers.mjs';
const port=4185;
const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','--host','127.0.0.1','--port',String(port),'--strictPort'],{stdio:'ignore'});
const browser=await chromium.launch({headless:true});
try{
 for(let i=0;i<40;i++){try{if((await fetch(`http://127.0.0.1:${port}`)).ok)break;}catch{}await new Promise(r=>setTimeout(r,250));}
 for(const [width,height] of [[1440,900],[1280,720],[1024,768],[390,844]]){
  const game=new CaseEngine(verticalSlice);game.mission.jumpTo('MEDICATION');
  const page=await browser.newPage({viewport:{width,height},hasTouch:width<760});const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(`http://127.0.0.1:${port}/game.html`);
  await page.evaluate(save=>{localStorage.clear();localStorage.setItem(`cardiosim.phaser.checkpoint.${save.caseId}.v2`,JSON.stringify(save));},game.checkpoint());
  await page.reload();await page.locator('.resume-banner button').first().click();
  const drag=async(source,target)=>{
   const a=await source.boundingBox(),b=await target.boundingBox();assert(a&&b);
   assert(a.y>=0&&a.y+a.height<=height&&b.y>=0&&b.y+b.height<=height,`source and target fit before gesture ${width}: ${JSON.stringify({a,b})}`);
   if(width<760){const c=await page.context().newCDPSession(page);await c.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{id:1,x:a.x+a.width/2,y:a.y+a.height/2}]});for(let i=1;i<=8;i++)await c.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{id:1,x:a.x+a.width/2+(b.x+b.width/2-a.x-a.width/2)*i/8,y:a.y+a.height/2+(b.y+b.height/2-a.y-a.height/2)*i/8}]});await c.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await c.detach();}
   else{await page.mouse.move(a.x+a.width/2,a.y+a.height/2);await page.mouse.down();await page.mouse.move(b.x+b.width/2,b.y+b.height/2,{steps:8});await page.mouse.up();}
  };
  await page.locator('.workbench-confirm').click();await page.locator('.feedback.error').waitFor();
  for(const step of game.mission.current.activity.steps){
   if(step.interaction.kind==='syringe-withdrawal'){
    await page.locator('.syringe-tool-token').scrollIntoViewIfNeeded();await drag(page.locator('.syringe-tool-token'),page.locator('.ampoule-drop-target'));
    const grip=page.locator('[data-syringe-plunger]');await grip.focus();await page.keyboard.press('Home');for(let n=0;n<40;n++)await page.keyboard.press('ArrowRight');
    await page.screenshot({path:`screenshots/polish-medication-syringe-${width}x${height}.png`});
    await page.locator('.syringe-confirm').click();
   }else{
    await page.screenshot({path:`screenshots/polish-medication-${step.id}-${width}x${height}.png`});
    await performWorkbenchStep(page,step.id,drag);
   }
  }
  assert.equal(await page.locator('main').getAttribute('data-decision-confirmed'),'false','all preparation still needs final confirmation');
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);assert.deepEqual(errors,[]);
  await page.close();
 }
 console.log('Seven physical preparation steps pass at four viewports with real mouse/touch, visible source/target, keyboard piston, retry and final Confirm still required.');
}finally{await browser.close();server.kill();}
