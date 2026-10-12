const {test}=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const vm=require("node:vm");
const fbs=JSON.parse(fs.readFileSync("data/fbs-2026.json","utf8"));
const context={window:{}};
vm.runInNewContext(fs.readFileSync("cfb-teams.js","utf8"),context);
vm.runInNewContext(fs.readFileSync("logo-sources.js","utf8"),context);
const college=context.window.SPORTSPIE_CFB_TEAMS;
const sources=context.window.SPORTSPIE_LOGO_SOURCES;
test("2026 FBS roster includes 138 unique programs",()=>{
  assert.equal(fbs.season,2026);
  assert.equal(fbs.names.length,138);
  assert.equal(new Set(fbs.names).size,138);
  assert.equal(college.length,138);
  assert.equal(new Set(college.map(t=>t.key)).size,138);
  assert.deepEqual(Array.from(college.map(t=>t.city)).sort(),Array.from(fbs.names).sort());
  assert.ok(college.some(t=>t.city==="North Dakota State"));
  assert.ok(college.some(t=>t.city==="Sacramento State"));
});
test("all FBS entries point at primary numeric NCAA logo URLs",()=>{
  for(const t of college){
    assert.equal(t.league,"CFB");
    assert.match(t.abbr,/^\d+$/);
    assert.equal(t.logoSource,"https://a.espncdn.com/i/teamlogos/ncaa/500/"+t.abbr+".png");
  }
});
test("all 262 teams have downloaded, verified primary logos",()=>{
  const code=fs.readFileSync("app.js","utf8");
  const matches=[...code.matchAll(/"(NFL|NHL|NBA|MLB)\|([a-z]+)\|[^"]+"/g)];
  assert.equal(matches.length,124);
  const keys=[...matches.map(m=>m[1]+":"+m[2]),...college.map(t=>t.key)];
  assert.equal(keys.length,262);
  assert.equal(new Set(keys).size,262);
  for(const key of keys){
    assert.ok(sources[key],"Missing primary source for "+key);
    const [league,id]=key.split(":");
    const file="assets/logos/"+league.toLowerCase()+"/"+id+".png";
    assert.ok(fs.existsSync(file),"Missing local logo "+file);
    assert.ok(fs.statSync(file).size>70,"Empty logo "+file);
  }
});
test("incorrect guesses and answer reveal use the same logo-rendering helper",()=>{
  const app=fs.readFileSync("app.js","utf8");
  assert.match(app,/applyTeamLogo\(img,t\)/);
  assert.match(app,/applyTeamLogo\(\$\("answerLogo"\),current\)/);
  assert.match(app,/logo:"\.\/assets\/logos\//);
});
