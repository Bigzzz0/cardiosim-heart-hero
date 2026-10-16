import {chromium} from 'playwright';
import {spawn} from 'node:child_process';
const port=4183;const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','--host','127.0.0.1','--port',String(port),'--strictPort'],{stdio:'ignore'});
import {CaseEngine} from '../src/game/core/CaseEngine';
import {verticalSlice} from '../src/game/cases/verticalSlice';
import assert from 'node:assert/strict';
const browser=await chromium.launch({headless:true});
try{
 for(let i=0;i<40;i++){try{if((await fetch(`http://127.0.0.1:${port}`)).ok)break;}catch{}await new Promise(r=>setTimeout(r,250));}
 for(const [width,height] of [[1440,900],[1280,720],[1024,768],[390,844]]){
  const page=await browser.newPage({viewport:{width,height},hasTouch:width<760});
  for(const mission of ['ABC_ASSESSMENT','DIAGNOSIS','MEDICATION','IO_BALANCE'] as const){
   const game=new CaseEngine(verticalSlice);game.mission.jumpTo(mission);game.chart=verticalSlice.findings.slice(0,4).map(f=>({...f,at:0,mission:'ASSESSMENT'}));
   await page.goto(`http://127.0.0.1:${port}/game.html`);await page.evaluate(save=>{localStorage.clear();localStorage.setItem(`cardiosim.phaser.checkpoint.${save.caseId}.v2`,JSON.stringify(save));},game.checkpoint());await page.reload();await page.locator('.resume-banner button').first().click();await page.waitForTimeout(350);
   if(mission==='ABC_ASSESSMENT'){
    const target=(await page.locator('[data-patient-hotspot="wrist"]').boundingBox())!;const panel=(await page.locator('.mission-panel').boundingBox())!;
    assert(target.y+target.height<panel.y || target.x+target.width<panel.x || target.x>panel.x+panel.width,`wrist obstruction ${width}: ${JSON.stringify({target,panel})}`);
   }else if(mission==='DIAGNOSIS'&&width<760){
    for(const [id,slot] of [['other-problem','problem'],['unrelated-evidence','support']]){
     const source=(await page.locator(`[data-answer-option="${id}"]`).boundingBox())!;const target=(await page.locator(`[data-answer-slot="${slot}"]`).boundingBox())!;
     assert(source.y+source.height<=height,`answer card ${id} below screen: ${JSON.stringify(source)}`);
     const c=await page.context().newCDPSession(page);await c.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{id:1,x:source.x+source.width/2,y:source.y+source.height/2}]});await c.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{id:1,x:target.x+target.width/2,y:target.y+target.height/2}]});await c.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await c.detach();
    }
    assert.equal(await page.locator('.answer-slot.filled').count(),2);
    const next=page.getByRole('button',{name:'ดำเนินภารกิจจากแถบด้านบน',exact:true});
    await next.click();await page.locator('.feedback.error').waitFor();
    for(const [slot,id] of [['problem','breathing-problem'],['support','respiratory-evidence']]){
     await page.locator(`[data-answer-slot="${slot}"]`).click();await page.locator(`[data-answer-option="${id}"]`).focus();await page.keyboard.press('Enter');
    }
    assert.equal(await page.locator('main').getAttribute('data-decision-confirmed'),'false');
    await next.click();await page.locator('.answer-slot.locked').first().waitFor();assert.equal(await page.locator('.answer-slot.locked').count(),2);

   }
   if(mission==='DIAGNOSIS'){
    const paper=(await page.locator('.in-room-decision-surface').boundingBox())!;
    for(const card of await page.locator('.answer-card,.answer-slot').all()){
     const r=(await card.boundingBox())!;
     assert(r.y>=paper.y&&r.y+r.height<=paper.y+paper.height,`all answer cards visible without scrolling ${width}: ${JSON.stringify({r,paper})}`);
    }
    assert.equal(await page.locator('.monitor-housing').count(),1,'SVG monitor housing present');
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,'no horizontal page overflow');
   }
   if((mission==='MEDICATION'||mission==='IO_BALANCE')&&width>=760){const view=JSON.parse((await page.locator('.room-stage').getAttribute('data-world-view'))!);const canvas=(await page.locator('.phaser-host canvas').boundingBox())!;const panel=(await page.locator('.mission-panel').boundingBox())!;const head=verticalSlice.hotspots.find(h=>h.id==='head')!;const bottom=canvas.y+(head.y+head.radius-view.y)/view.height*canvas.height;assert(bottom<panel.y,'workspace keeps patient face visible');}
   await page.screenshot({path:`screenshots/bedside-layout-${mission}-${width}x${height}.png`});
  }
  await page.close();
 }
 console.log('Layout verified: ABC wrist unobstructed at four sizes; phone decision cards fit, real touch fills both slots and keyboard replaces answers before Confirm.');
}finally{await browser.close();server.kill();}
