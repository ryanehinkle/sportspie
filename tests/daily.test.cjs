const {test}=require("node:test");
const assert=require("node:assert/strict");
const {spawnSync}=require("node:child_process");
const fs=require("node:fs");
const clock=require("../daily.js");

test("the launch day is Puzzle #1 in both daily categories",()=>{
  assert.equal(clock.puzzleNumber("2026-10-13"),1);
  assert.equal(clock.puzzleNumber("2026-10-14"),2);
  assert.equal(clock.puzzleNumber("2026-10-20"),8);
});
function withZone(zone,instant){
  const script="const d=require('./daily.js'),date=new Date("+JSON.stringify(instant)+");"+
    "console.log(JSON.stringify({day:d.localDay(date),number:d.puzzleNumber(d.localDay(date)),"+
    "msToMidnight:d.nextMidnight(date)-date.getTime()}))";
  const result=spawnSync(process.execPath,["-e",script],{
    cwd:process.cwd(),env:{...process.env,TZ:zone},encoding:"utf8"
  });
  assert.equal(result.status,0,result.stderr);
  return JSON.parse(result.stdout);
}
test("puzzles change at viewer-local midnight, not 00:00 UTC",()=>{
  const justBefore=withZone("America/Chicago","2026-10-14T04:59:59.000Z");
  const justAfter=withZone("America/Chicago","2026-10-14T05:00:00.000Z");
  assert.equal(justBefore.day,"2026-10-13");
  assert.equal(justBefore.number,1);
  assert.equal(justBefore.msToMidnight,1000);
  assert.equal(justAfter.day,"2026-10-14");
  assert.equal(justAfter.number,2);
  assert.equal(justAfter.msToMidnight,86400000);
});
test("different timezones see their own civil dates",()=>{
  assert.equal(withZone("Asia/Tokyo","2026-10-13T00:00:00.000Z").day,"2026-10-13");
  assert.equal(withZone("America/Los_Angeles","2026-10-13T00:00:00.000Z").day,"2026-10-12");
});
test("DST transitions still reset at actual local midnight",()=>{
  const spring=withZone("America/Chicago","2026-03-08T06:00:00.000Z");
  const fall=withZone("America/Chicago","2026-11-01T05:00:00.000Z");
  assert.equal(spring.msToMidnight,23*3600000);
  assert.equal(fall.msToMidnight,25*3600000);
});
test("two daily categories, an SVG pie and no expired footer copy",()=>{
  const app=fs.readFileSync("app.js","utf8");
  const html=fs.readFileSync("index.html","utf8");
  assert.match(app,/dailyCategory==="CFB"/);
  assert.match(app,/const index=.*DAILY\.puzzleNumber/);
  assert.match(app,/document\.createElementNS\(ns,"path"\)/);
  assert.match(app,/DAILY\.nextMidnight\(now\)/);
  assert.match(html,/data-daily="PRO"/);
  assert.match(html,/data-daily="CFB"/);
  assert.match(html,/id="pieSvg"/);
  assert.doesNotMatch(html,/id="sourceNote"|class="footer"/);
});
