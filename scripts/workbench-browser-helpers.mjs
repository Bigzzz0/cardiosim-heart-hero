export async function performWorkbenchStep(page, stepId, drag) {
 const bench=page.locator(`[data-workbench-step="${stepId}"]`);
 await bench.waitFor();
 for(const object of await bench.locator('[data-workbench-object]').all()) {
  if(await object.getAttribute('data-workbench-movable')==='true') {
   const target=bench.locator('[data-workbench-target]').first();
   await object.scrollIntoViewIfNeeded();
   if(drag)await drag(object,target,`workbench ${stepId}`);
   else {await object.click();await target.click();}
  } else await object.click();
 }
 await bench.locator('.workbench-confirm').click();
 await page.locator(`[data-activity-step-target="${stepId}"].complete`).waitFor({state:'attached'});
}
