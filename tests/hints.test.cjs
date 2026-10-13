const {test}=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const hints=require("../hints.js");

test("no hint is visible before click, even after incorrect guesses",()=>{
  const store={},round={guesses:["NFL:chi","NFL:pit"],complete:false,won:false,optionalHintsEnabled:true};
  assert.equal(hints.count(round),0);
  assert.equal(hints.stats(store,"PRO").totalUsed,0);
  const app=fs.readFileSync("app.js","utf8");
  assert.match(app,/function revealHint\(\)/);
  assert.match(app,/\$\("hintBtn"\)\.addEventListener\("click",revealHint\)/);
  assert.match(app,/clueTexts\(\)\.slice\(0,used\)/);
  assert.doesNotMatch(app,/new clue has unlocked/i);
});
test("each click reveals exactly one clue, up to five",()=>{
  const store={},round={guesses:[],complete:false,optionalHintsEnabled:true};
  for(let n=1;n<=5;n++){
    assert.equal(hints.reveal(round,store,"PRO"),true);
    assert.equal(hints.count(round),n);
  }
  assert.equal(hints.reveal(round,store,"PRO"),false);
  assert.equal(hints.count(round),5);
  assert.equal(hints.stats(store,"PRO").totalUsed,5);
  assert.equal(hints.stats(store,"PRO").helpedRounds,1);
});
test("a refresh or a rejected click does not duplicate hint stats",()=>{
  const store={},round={hintsUsed:0,complete:false,optionalHintsEnabled:true};
  assert.equal(hints.reveal(round,store,"CFB"),true);
  assert.equal(hints.count(JSON.parse(JSON.stringify(round))),1);
  round.complete=true;round.won=true;
  assert.equal(hints.reveal(round,store,"CFB"),false);
  assert.equal(hints.complete(round,store,"CFB"),true);
  assert.equal(hints.complete(round,store,"CFB"),false);
  const aggregate=hints.stats(store,"CFB");
  assert.equal(aggregate.totalUsed,1);
  assert.equal(aggregate.helpedRounds,1);
  assert.equal(aggregate.completedRounds,1);
  assert.equal(aggregate.completedHints,1);
  assert.equal(aggregate.hintFreeWins,0);
});
test("a hint-free win is measured only after optional hints were enabled",()=>{
  const store={};
  const legacy={guesses:[],complete:true,won:true}; // older game had automatic hints
  assert.equal(hints.complete(legacy,store,"PRO"),false);
  const newRound={hintsUsed:0,complete:true,won:true,optionalHintsEnabled:true};
  assert.equal(hints.complete(newRound,store,"PRO"),true);
  const record=hints.stats(store,"PRO");
  assert.equal(record.hintFreeWins,1);
  assert.equal(record.trackedWins,1);
  assert.equal(record.completedRounds,1);
  assert.equal(record.completedHints,0);
});
test("daily Pro, CFB and individual Unlimited scopes remain independent",()=>{
  const store={};
  for(const scope of ["PRO","CFB","UNLIMITED:ALL","UNLIMITED:NHL"]){
    const round={complete:false,optionalHintsEnabled:true};
    hints.reveal(round,store,scope);
    round.complete=true;round.won=false;
    hints.complete(round,store,scope);
  }
  assert.equal(Object.keys(store.hintStats).length,4);
  assert.equal(hints.stats(store,"PRO").totalUsed,1);
  assert.equal(hints.stats(store,"CFB").totalUsed,1);
  assert.equal(hints.stats(store,"UNLIMITED:ALL").totalUsed,1);
  assert.equal(hints.stats(store,"UNLIMITED:NHL").totalUsed,1);
  assert.equal(hints.stats(store,"UNLIMITED:NBA").totalUsed,0);
});
test("stats and buttons are present and existing gameplay rules are unchanged",()=>{
  const page=fs.readFileSync("index.html","utf8");
  const app=fs.readFileSync("app.js","utf8");
  for(const id of ["hintBtn","hintCounter","statHintsUsed","statHintFreeWins","statAvgHints","statHelpedRounds"]){
    assert.match(page,new RegExp('id="'+id+'"'));
  }
  assert.match(page,/src="\.\/hints\.js"/);
  assert.match(app,/const MAX_GUESSES=6/);
  assert.match(app,/HINTS\.complete\(session,store,hintScope\(\)\)/);
});
