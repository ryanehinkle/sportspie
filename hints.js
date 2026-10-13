/* Per-round optional hints and persisted, idempotent hint statistics. */
(function(root){
  "use strict";
  const MAX_HINTS=5;
  function maxForLeague(league){
    return league==="CFB"?4:MAX_HINTS;
  }
  function count(session,limit=MAX_HINTS){
    const n=Number(session?.hintsUsed);
    return Number.isInteger(n)?Math.max(0,Math.min(MAX_HINTS,Math.max(0,Math.min(MAX_HINTS,limit)),n)):0;
  }
  function stats(store,scope){
    if(!store.hintStats||typeof store.hintStats!=="object")store.hintStats={};
    if(!store.hintStats[scope]||typeof store.hintStats[scope]!=="object"){
      store.hintStats[scope]={totalUsed:0,helpedRounds:0,completedRounds:0,
        completedHints:0,trackedWins:0,hintFreeWins:0};
    }
    const result=store.hintStats[scope];
    for(const key of ["totalUsed","helpedRounds","completedRounds","completedHints","trackedWins","hintFreeWins"]){
      if(!Number.isInteger(result[key])||result[key]<0)result[key]=0;
    }
    return result;
  }
  function reveal(session,store,scope,limit=MAX_HINTS){
    if(!session||session.complete||count(session)>=limit)return false;
    const previous=count(session);
    session.hintsUsed=previous+1;
    const aggregate=stats(store,scope);
    aggregate.totalUsed++;
    if(previous===0)aggregate.helpedRounds++;
    return true;
  }
  function complete(session,store,scope){
    if(!session?.complete||session.hintResultCounted)return false;
    // Older already-completed puzzles didn't offer optional hints. Avoid
    // retroactively classifying those wins as hint-free.
    if(!session.optionalHintsEnabled)return false;
    const aggregate=stats(store,scope);
    aggregate.completedRounds++;
    aggregate.completedHints+=count(session);
    if(session.won){
      aggregate.trackedWins++;
      if(count(session)===0)aggregate.hintFreeWins++;
    }
    session.hintResultCounted=true;
    return true;
  }
  const api={MAX_HINTS,maxForLeague,count,stats,reveal,complete};
  if(typeof module!=="undefined"&&module.exports)module.exports=api;
  if(root)root.SportsPieHints=api;
})(typeof window!=="undefined"?window:null);
