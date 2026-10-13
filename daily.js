/* Civil dates follow the player's device timezone, never UTC. */
(function(root){
  "use strict";
  const START="2026-10-13";
  function localDay(date=new Date()){
    const y=date.getFullYear();
    const m=String(date.getMonth()+1).padStart(2,"0");
    const d=String(date.getDate()).padStart(2,"0");
    return y+"-"+m+"-"+d;
  }
  function puzzleNumber(day){
    const [y,m,d]=day.split("-").map(Number);
    const [sy,sm,sd]=START.split("-").map(Number);
    return Math.max(1,Math.round((Date.UTC(y,m-1,d)-Date.UTC(sy,sm-1,sd))/86400000)+1);
  }
  function nextMidnight(date=new Date()){
    return new Date(date.getFullYear(),date.getMonth(),date.getDate()+1).getTime();
  }
  function displayDate(day){
    const [y,m,d]=day.split("-").map(Number);
    return new Intl.DateTimeFormat(undefined,{month:"long",day:"numeric",year:"numeric"})
      .format(new Date(y,m-1,d,12));
  }
  const helpers={localDay,puzzleNumber,nextMidnight,displayDate};
  if(typeof module!=="undefined"&&module.exports)module.exports=helpers;
  if(root)root.SportsPieDaily=helpers;
})(typeof window!=="undefined"?window:null);
