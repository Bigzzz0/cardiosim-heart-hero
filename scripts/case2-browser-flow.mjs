export async function runCase2Flow(browser,baseURL,errors=[]) {
  const case2Page=await browser.newPage({viewport:{width:1440,height:900}});
  case2Page.setDefaultTimeout(30000);
  case2Page.setDefaultNavigationTimeout(45000);
  const demoStudent={studentId:'browser-qa',name:'Browser QA'};
  const emptyTelemetry={student:demoStudent,preTestScore:0,preTestAnswers:{},postTestScore:0,postTestAnswers:{},learningGain:0,discoveredHotspots:[],prioritizationErrors:0,medicationErrors:0,ioErrors:0,crisisResponseTimeSeconds:0,totalTimeSeconds:0,surveyScores:{},feedbackText:''};
  await case2Page.addInitScript(value=>{if(!sessionStorage.getItem('cardiosim.game.return.v1'))sessionStorage.setItem('cardiosim.game.return.v1',JSON.stringify(value));},{student:demoStudent,telemetry:emptyTelemetry});
  case2Page.on('pageerror',error=>errors.push(error.message));
  case2Page.on('console',message=>{if(message.type()==='error')errors.push(message.text());});
  await case2Page.goto(`${baseURL}/?stage=SCENARIO_SELECT`,{waitUntil:'domcontentloaded'});
  await case2Page.getByRole('button',{name:'เลือกเล่นเคสที่ 2 (เข้าสู่เนื้อหาจำลอง)'}).click();
  await case2Page.waitForURL(url=>url.pathname.endsWith('/game.html')&&url.searchParams.get('case')==='case-02',{waitUntil:'domcontentloaded'});
  await case2Page.locator('.phaser-host canvas').waitFor();
  if(await case2Page.locator('.brand small').innerText()!=='CASE-02')throw new Error('Web scenario selection did not load the Case 2 patient room');
  const case2VitalText=()=>case2Page.locator('.monitor .vital-large b, .monitor .vital-small b').allTextContents();
  if(await case2Page.locator('.monitor-no-trace').count()!==1||JSON.stringify(await case2VitalText())!==JSON.stringify(['—','—','—/—','—']))throw new Error('Case 2 must not invent an ECG trace or numeric vital signs');
  const case2Canvas=case2Page.locator('.phaser-host canvas');
  const case2Point=async(x,y)=>case2Page.evaluate(({x,y})=>{const id={'490,442':'arm','526,575':'finger','602,558':'wrist'}[`${x},${y}`];const at=id?JSON.parse(document.querySelector('main')?.getAttribute('data-patient-targets')??'[]').find(t=>t.id===id):null;if(at){x=at.x;y=at.y;}const canvas=document.querySelector('.phaser-host canvas');const view=JSON.parse(document.querySelector('.room-stage')?.getAttribute('data-world-view')??'null');if(!canvas||!view)throw Error('Case 2 Phaser world view unavailable');const bounds=canvas.getBoundingClientRect();return{x:bounds.left+(x-view.x)/view.width*bounds.width,y:bounds.top+(y-view.y)/view.height*bounds.height};},{x,y});
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
    await case2Page.getByRole('button',{name:'ยืนยันคำตอบ'}).click();
    if(await case2Page.locator('.feedback.error').count())throw new Error('Case 2 decisions must be recorded without a clinically correct/incorrect judgment');
    await case2Page.getByRole('button',{name:'ต่อไป'}).click();
  }
  await case2Page.locator('main[data-mission="MEDICATION"]').waitFor();
  if(await case2Page.locator('.activity-card input, .activity-card select').count()||await case2Page.locator('.activity-equipment-token').count())throw new Error('Case 2 must not expose medication fields or equipment without a Doctor Order');
  if(await case2Page.locator('.missing-data-card').getByText('ไม่มีข้อมูลในเรื่องย่อ').count()<2)throw new Error('Case 2 medication station should identify the missing order and allergy source');
  await case2Page.getByRole('button',{name:'บันทึกว่าไม่มีข้อมูลใน Case'}).click();
  await case2Page.getByRole('button',{name:'บันทึกข้อมูลที่ขาด'}).click();
  await case2Page.getByRole('button',{name:'ต่อไป'}).click();
  await case2Page.locator('.activity-surface-instruction b').getByText('คำนวณสมดุล สารน้ำเข้าและออก').waitFor();
  if(await case2Page.locator('.io-item-token,.io-zone,.activity-card input,.balance-options').count())throw new Error('Case 2 I/O board must not fabricate numeric items or a calculation worksheet');
  await case2Page.getByRole('button',{name:'บันทึกว่าไม่มีข้อมูลใน Case'}).click();
  await case2Page.getByRole('button',{name:'บันทึกข้อมูลที่ขาด'}).click();
  if(await case2Page.locator('.feedback.error').count())throw new Error('Case 2 I/O entry should be ungraded');
  await case2Page.getByRole('button',{name:'ต่อไป'}).click();
  await case2Page.getByRole('heading',{name:'อาการผู้ป่วย กำลังเปลี่ยนไป',level:1}).waitFor();
  if(!await case2Page.locator('.emergency-room').isVisible()||JSON.stringify(await case2VitalText())!==JSON.stringify(['—','—','—/—','—']))throw new Error('Case 2 emergency must change the scene state while keeping unavailable vitals blank');
  if(!await case2Page.locator('.game-hud.is-emergency .hud-emergency').isVisible())throw new Error('Case 2 emergency state should also be visible in the game HUD');
  await case2Page.waitForTimeout(5300);
  await case2Page.getByRole('heading',{name:'ประเมิน ABC อย่างเป็นลำดับ',level:1}).waitFor();
  for(const target of [{x:550,y:280},{x:550,y:395},{x:602,y:558}]){
    await case2Drag(case2Page.locator('.toolbar button').filter({hasText:'ประเมิน ABC'}),target);
    await case2Page.waitForFunction(count=>document.querySelectorAll('.objective.done').length>=count,await case2Page.locator('.objective.done').count()+1);
  }
  await case2Page.getByRole('button',{name:'เตรียมติด ECG'}).click();
  const case2Targets=JSON.parse(await case2Page.locator('main').getAttribute('data-ecg-targets')??'[]');
  const case2Layout=JSON.parse(await case2Page.locator('main').getAttribute('data-ecg-layout')??'{}');
  const case2LeadDrag=async(index)=>{const tray=await case2Point(case2Layout.tray.x+index*case2Layout.tray.spacing,case2Layout.tray.y);const target=case2Targets[index];const end=await case2Point(target.x,target.y);await case2Page.mouse.move(tray.x,tray.y);await case2Page.mouse.down();await case2Page.mouse.move(end.x,end.y,{steps:8});await case2Page.mouse.up();};
  for(let index=0;index<6;index++){await case2LeadDrag(index);await case2Page.waitForFunction(count=>document.querySelectorAll('.lead-status button.lead-done').length>=count,index+1);}
  await case2Page.getByRole('button',{name:'ยืนยัน ECG',exact:true}).click();
  await case2Page.getByRole('button',{name:'Confirm · บันทึก ECG'}).click();
  await case2Page.locator('.activity-surface-instruction b').getByText('อ่านผล ECG และบันทึกคำตอบ').waitFor();
  if(await case2Page.locator('.ecg-no-strip').count()!==1||await case2Page.locator('.ecg-readout').count())throw new Error('Case 2 ECG console must show no strip or rhythm readout');
  await case2Page.locator('.activity-card input[type="text"]').fill('practice note');
  await case2Page.getByRole('button',{name:'บันทึกการอ่าน ECG'}).click();
  await case2Page.getByRole('button',{name:'ต่อไป'}).click();
  await case2Page.locator('.surface-instruction b').getByText('เลือกการตอบสนอง แล้วดูผลที่ผู้ป่วย').waitFor();
  if(!await case2Page.locator('[data-room-surface="monitor-response"]').isVisible())throw new Error('Case 2 emergency response should still use the in-room monitor surface');
  await case2Page.locator('.answer-card').first().click();
  await case2Page.getByRole('button',{name:'ยืนยันคำตอบ'}).click();
  if(await case2Page.locator('.feedback.error').count())throw new Error('Case 2 treatment choice must be recorded without a clinical judgment');
  await case2Page.getByRole('button',{name:'ต่อไป'}).click();
  await case2Page.waitForTimeout(6600); await case2Page.getByRole('button',{name:'ดูผลภารกิจ'}).click();
  await case2Page.getByRole('heading',{name:'ดูแลครบ จบภารกิจจำลอง',level:1}).waitFor();
  if(await case2Page.locator('.result-metrics').first().innerText().then(text=>text.includes('คะแนนเดโม'))||!await case2Page.getByText('รอบฝึก · ไม่ให้คะแนนทางคลินิก',{exact:true}).isVisible())throw new Error('Case 2 result must be marked as an unscored practice run');
  await case2Page.screenshot({path:'screenshots/game-case-02-result.png',fullPage:true});
  await case2Page.getByRole('button',{name:'ไปทำ Post-test'}).click();
  await case2Page.waitForURL(url=>url.searchParams.get('stage')==='POSTTEST',{waitUntil:'domcontentloaded'});
  const returned=await case2Page.evaluate(()=>JSON.parse(sessionStorage.getItem('cardiosim.game.return.v1')??'{}'));
  if(returned.telemetry?.gameResult?.caseId!=='case-02'||returned.telemetry.gameResult.scoreStatus!=='unscored'||returned.student?.studentId!=='browser-qa')throw new Error(`Typed game result was not returned to the web Post-test: ${JSON.stringify(returned.telemetry?.gameResult)}`);
  if(errors.length)throw new Error(`Case 2/browser integration errors:\n${errors.join('\n')}`);
  console.log('Case 2 full flow passed: web case selection, missing clinical data, all room stages, unscored result and typed Post-test return.');
}
