import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import assert from 'node:assert/strict';
import { CaseEngine } from '../src/game/core/CaseEngine';
import { getGameCase } from '../src/game/cases';
const port=4184;
const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','--host','127.0.0.1','--port',String(port),'--strictPort'],{stdio:'ignore'});
const browser=await chromium.launch({headless:true});
try {
 for(let i=0;i<40;i++){try{if((await fetch(`http://127.0.0.1:${port}`)).ok)break;}catch{}await new Promise(r=>setTimeout(r,250));}
 for(const caseId of ['case-01','case-02']) for(const [width,height] of [[1440,900],[1280,720],[1024,768],[390,844]]) {
  const config=getGameCase(caseId);const engine=new CaseEngine(config);engine.mission.jumpTo('CASE_SUMMARY');
  const page=await browser.newPage({viewport:{width,height}});
  await page.addInitScript('window.__name = fn => fn');
  await page.goto(`http://127.0.0.1:${port}/game.html?case=${caseId}`);
  await page.evaluate(save=>{localStorage.clear();localStorage.setItem(`cardiosim.phaser.checkpoint.${save.caseId}.v2`,JSON.stringify(save));},engine.checkpoint());
  await page.reload();await page.locator('.resume-banner button').first().click();await page.locator('.result-card').waitFor();
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  assert.equal(await page.locator('.result-details').getAttribute('open'),null);
  const ratios=await page.locator('.result-success,.result-status,.result-metrics b,.result-metrics span').evaluateAll(elements=>elements.filter(el=>el.getBoundingClientRect().height>0).map(el=>{
   const linear=(v:number)=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4;
   const luminance=(color:string)=>{const [r,g,b]=color.match(/[\d.]+/g)!.slice(0,3).map(v=>linear(Number(v)/255));return .2126*r+.7152*g+.0722*b;};
   let parent:Element|null=el;let bg='';while(parent){bg=getComputedStyle(parent).backgroundColor;if(bg!=='rgba(0, 0, 0, 0)')break;parent=parent.parentElement;}
   const a=luminance(getComputedStyle(el).color),b=luminance(bg);return (Math.max(a,b)+.05)/(Math.min(a,b)+.05);
  }));assert(ratios.every(r=>r>=4.5),`result text contrast ${caseId} ${width}: ${ratios}`);
  if(!config.gradable)assert.equal(await page.locator('.result-metrics').first().innerText().then(t=>t.includes('คะแนนเดโม')),false);
  await page.locator('.result-details summary').click();await page.locator('.result-metrics.compact').waitFor();
  await page.locator('.result-details summary').click();await page.screenshot({path:`screenshots/polish-result-${caseId}-${width}x${height}.png`});
  await page.locator('.restart-button').click();await page.locator('.mission-panel .full-primary').click();
  await page.getByRole('button',{name:'เปิดแฟ้มผู้ป่วย',exact:true}).click();
  await page.locator('main[data-game-paused="true"]').waitFor();
  assert.equal(await page.locator('.chart-entry').count(),0,'undiscovered chart stays private');
  await page.keyboard.press('Tab');
  assert(await page.locator('.chart-modal').evaluate(el=>el.contains(document.activeElement)),'Chart contains keyboard focus');
  await page.screenshot({path:`screenshots/polish-chart-${caseId}-${width}x${height}.png`});
  await page.keyboard.press('Escape');await page.locator('.chart-modal').waitFor({state:'detached'});
  await page.getByRole('button',{name:'พักเกม',exact:true}).click();await page.locator('.pause-card').waitFor();
  await page.keyboard.press('Tab');assert(await page.locator('.pause-card').evaluate(el=>el.contains(document.activeElement)),'Pause contains keyboard focus');
  await page.keyboard.press('Escape');await page.locator('.pause-overlay').waitFor({state:'detached'});
  await page.locator('main[data-game-paused="false"]').waitFor();
  await page.close();
 }
 console.log('Result: four viewports, both cases, expandable details, contrast >=4.5:1 and unscored Case 2 verified.');
} finally {await browser.close();server.kill();}
