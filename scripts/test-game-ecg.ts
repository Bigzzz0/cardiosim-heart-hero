import {chromium} from 'playwright';
import {spawn} from 'node:child_process';
import assert from 'node:assert/strict';
import {CaseEngine} from '../src/game/core/CaseEngine';
import {verticalSlice} from '../src/game/cases/verticalSlice';
const port=4182;
const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','--host','127.0.0.1','--port',String(port),'--strictPort'],{stdio:'ignore'});
let browser;
try{
 browser=await chromium.launch({headless:true,...(process.env.CARDIOSIM_BROWSER_CHANNEL?{channel:process.env.CARDIOSIM_BROWSER_CHANNEL}:{})});
 for(let i=0;i<40;i++){try{if((await fetch(`http://127.0.0.1:${port}`)).ok)break;}catch{}await new Promise(r=>setTimeout(r,250));}
 for(const [width,height] of [[1440,900],[1280,720],[1024,768],[390,844]]){
  if(process.env.CARDIOSIM_ECG_VIEWPORT&&Number(process.env.CARDIOSIM_ECG_VIEWPORT)!==width)continue;
  const game=new CaseEngine(verticalSlice);game.mission.jumpTo('ECG_PLACEMENT');
  const page=await browser.newPage({viewport:{width,height},hasTouch:width<760});const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  page.on('response',response=>{if(response.url().includes('/assets/ecg/')&&response.status()>=400)errors.push(`${response.status()} ${response.url()}`);});
  await page.addInitScript(()=>{const trace:any[]=[];(window as any).__ecgTrace=trace;for(const type of ['pointerdown','pointerup'])window.addEventListener(type,event=>{const e=event as PointerEvent;const bounds=document.querySelector('.ecg-mobile-map>img')?.getBoundingClientRect();trace.push({type,x:e.clientX,y:e.clientY,pointed:(document.elementFromPoint(e.clientX,e.clientY) as HTMLElement)?.className,map:bounds?{x:bounds.x,y:bounds.y,width:bounds.width,height:bounds.height}:null});},true);});
  await page.addInitScript(checkpoint=>{const key=`cardiosim.phaser.checkpoint.${checkpoint.caseId}.v2`;if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(checkpoint));},game.checkpoint());
  await page.goto(`http://127.0.0.1:${port}/game.html`);await page.locator('.resume-banner button').first().click();
  await page.waitForFunction(()=>document.querySelector('main')?.getAttribute('data-mission')==='ECG_PLACEMENT');
  await page.waitForTimeout(250);
  const drop=async(id:string,targetId:string)=>{
   const targets=verticalSlice.ecg.targets;const index=targets.findIndex(t=>t.id===id);const target=targets.find(t=>t.id===targetId)!;
   if(width<760){
    const from=(await page.locator('.ecg-mobile-lead').filter({hasText:id}).boundingBox())!;
    const map=(await page.locator('.ecg-mobile-map>img').boundingBox())!;const image=verticalSlice.ecg.layout.image;
    const end={x:map.x+(target.x-image.x)/image.width*map.width,y:map.y+(target.y-image.y)/image.height*map.height};
    const c=await page.context().newCDPSession(page);await c.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{id:4,x:from.x+from.width/2,y:from.y+from.height/2}]});for(let i=1;i<=10;i++)await c.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{id:4,x:from.x+from.width/2+(end.x-from.x-from.width/2)*i/10,y:from.y+from.height/2+(end.y-from.y-from.height/2)*i/10}]});await c.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await c.detach();
   }else{
    const world=await page.locator('.room-stage').getAttribute('data-world-view');const view=JSON.parse(world!);const canvas=(await page.locator('.phaser-host canvas').boundingBox())!;
    const project=(x:number,y:number)=>({x:canvas.x+(x-view.x)/view.width*canvas.width,y:canvas.y+(y-view.y)/view.height*canvas.height});
    const tray=verticalSlice.ecg.layout.tray;const from=project(tray.x+index*tray.spacing,tray.y);const to=project(target.x,target.y);
    await page.mouse.move(from.x,from.y);await page.mouse.down();await page.mouse.move(to.x,to.y,{steps:12});await page.mouse.up();
   }
   try{
    await page.waitForFunction(({id,targetId,key})=>JSON.parse(localStorage.getItem(key)??'{}').leadPlacements?.[id]===targetId,{id,targetId,key:`cardiosim.phaser.checkpoint.${verticalSlice.id}.v2`},{timeout:5000});
   }catch(error){await page.screenshot({path:`screenshots/bedside-ecg-failed-${width}.png`});throw new Error(`${width}px ${id}→${targetId}: ${JSON.stringify(await page.evaluate(()=>({save:localStorage.getItem(Object.keys(localStorage).find(key=>key.includes('checkpoint'))??''),trace:(window as any).__ecgTrace})))}`,{cause:error});}
  };
  if(width<760){
   await page.locator('.ecg-mobile-lead').filter({hasText:'V1'}).focus();await page.keyboard.press('Enter');
   await page.locator('[data-mobile-ecg-target="V2"]').focus();await page.keyboard.press('Enter');
   await page.waitForFunction(()=>document.querySelector('main')?.getAttribute('data-ecg-placed')==='1');
   await page.locator('.ecg-mobile-lead').filter({hasText:'V1'}).focus();await page.keyboard.press('Enter');
   await page.locator('.ecg-return-lead:visible').click();
   await page.waitForFunction(()=>document.querySelector('main')?.getAttribute('data-ecg-placed')==='0');
  }
  await drop('V1','V2');await drop('V2','V1');for(const t of verticalSlice.ecg.targets.slice(2))await drop(t.id,t.id);
  await page.screenshot({path:`screenshots/bedside-ecg-tentative-${width}x${height}.png`});
  const next=page.locator(width<760?'.ecg-mobile-actions .primary':'.mission-panel .primary:visible').first();await next.waitFor();assert(await next.isEnabled(),`${width}px: all six tentative leads allow Confirm`);
  await page.reload();await page.locator('.resume-banner button').first().click();
  await page.waitForFunction(()=>document.querySelector('main')?.getAttribute('data-ecg-placed')==='6');
  await next.click();await page.locator(width<760?'.ecg-mobile-feedback.error':'.mission-panel .feedback.error').waitFor();
  await page.waitForTimeout(300);await drop('V1','V1');await drop('V2','V2');await next.click();
  await page.screenshot({path:`screenshots/bedside-ecg-confirmed-${width}x${height}.png`});
  await next.click();await page.waitForFunction(()=>document.querySelector('main')?.getAttribute('data-mission')==='ECG_INTERPRETATION');
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));assert.deepEqual(errors,[]);await page.close();
 }
 console.log(`ECG passed ${process.env.CARDIOSIM_ECG_VIEWPORT?`${process.env.CARDIOSIM_ECG_VIEWPORT}px`:'four sizes'}: mouse/touch swap, keyboard placement/removal, resume, Confirm rejects only wrong leads, retry and next.`);
}finally{await browser?.close();server.kill();}
