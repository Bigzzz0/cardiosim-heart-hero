import {chromium} from 'playwright';
import {spawn} from 'node:child_process';
import {runCase2Flow} from './case2-browser-flow.mjs';
const port=4187;
const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','--host','127.0.0.1','--port',String(port),'--strictPort'],{stdio:'ignore'});
const browser=await chromium.launch({headless:true});
try{
 for(let i=0;i<40;i++){try{if((await fetch(`http://127.0.0.1:${port}`)).ok)break;}catch{}await new Promise(r=>setTimeout(r,250));}
 await runCase2Flow(browser,`http://127.0.0.1:${port}`);
}finally{await browser.close();server.kill();}
