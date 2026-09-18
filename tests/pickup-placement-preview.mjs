import {createRequire} from 'node:module';import fs from 'node:fs';
import {startTestServer} from './local-room.mjs';
const require=createRequire(import.meta.url),{chromium}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright');
const {server,url}=await startTestServer(),browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_EXECUTABLE_PATH});
fs.mkdirSync('tests/screenshots',{recursive:true});
try{
 for(const viewport of [{width:1400,height:900},{width:844,height:390},{width:667,height:375}]){
  const page=await browser.newPage({viewport,isMobile:viewport.width<1000,hasTouch:viewport.width<1000,deviceScaleFactor:1,serviceWorkers:'block',reducedMotion:'reduce'});
  await page.route('**/*',r=>r.request().url().startsWith(url)?r.continue():r.abort());await page.goto(url);await page.waitForFunction(()=>typeof openSheet==='function');
  await page.evaluate(()=>{side='federation';locked=true;turn=freshTurn();turn.round=1;turn.phase='you';turn.started=true;const u=unitById('rx-78-2-gundam');roster=[{uid:1,id:u.id,st:freshState(u)}];openSheet(1);
  });
  await page.screenshot({path:'tests/screenshots/pickup-trio-'+viewport.width+'.png'});await page.close();
 }
}finally{await browser.close();await new Promise(r=>server.close(r));}
