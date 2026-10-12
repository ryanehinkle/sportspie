#!/usr/bin/env node
/**
 * SportsPie: download and verify all primary team marks at deployment time.
 * Produces a self-contained GitHub Pages build: no runtime ESPN API dependency,
 * no incorrect guesses using different logos than the analyzed image.
 */
import {readFile,writeFile,mkdir} from "node:fs/promises";
import path from "node:path";
import {Buffer} from "node:buffer";

const ESPN_GIST="https://gist.githubusercontent.com/saiemgilani/c6596f0e1c8b148daabc2b7f1e6f6add/raw/915d48a38d56a90a02d20856faf428408eeff131/logos";
const JSON_HEADERS={"User-Agent":"SportsPie/1.0 (+https://github.com/ryanehinkle/sportspie)","Accept":"application/json,text/plain,*/*"};
const clean=s=>String(s??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]/g,"");
const nickOverrides={
  "BYU":"Cougars","FIU":"Panthers","LSU":"Tigers",
  "UCF":"Knights","UConn":"Huskies","UMass":"Minutemen",
  "UNLV":"Rebels","USC":"Trojans","USF":"Bulls","UAB":"Blazers",
  "UTEP":"Miners","UTSA":"Roadrunners"
};
const aliases={
  "Appalachian State":["Appalachian State"],
  "BYU":["BYU","Brigham Young"],
  "California":["California","California Golden Bears"],
  "FIU":["Florida International","FIU"],
  "Georgia Tech":["Georgia Tech"],
  "Hawaii":["Hawaii"],
  "Louisiana":["Louisiana","Louisiana-Lafayette","Louisiana Lafayette","UL Lafayette"],
  "Louisiana-Monroe":["Louisiana-Monroe","UL Monroe","Louisiana Monroe"],
  "LSU":["LSU","Louisiana State"],
  "Miami (FL)":["Miami","Miami (FL)"],
  "Miami (OH)":["Miami (OH)","Miami Ohio"],
  "Middle Tennessee":["Middle Tennessee","Middle Tennessee State"],
  "NC State":["NC State","North Carolina State"],
  "Ole Miss":["Ole Miss","Mississippi"],
  "Pittsburgh":["Pittsburgh","Pitt"],
  "Sam Houston":["Sam Houston","Sam Houston State"],
  "SMU":["SMU","Southern Methodist"],
  "Southern Miss":["Southern Miss","Southern Mississippi"],
  "Texas A&M":["Texas A&M"],
  "UConn":["UConn","Connecticut"],
  "UMass":["UMass","Massachusetts"],
  "USF":["USF","South Florida"],
  "UCF":["UCF","Central Florida"],
  "UCLA":["UCLA"],
  "USC":["USC","Southern California"],
  "UAB":["UAB","Alabama-Birmingham"],
  "UTSA":["UTSA","Texas-San Antonio"],
  "UTEP":["UTEP","Texas-El Paso"],
  "Western Kentucky":["Western Kentucky"]
};
function readCsvLine(line){
  const out=[];let val="",quoted=false;
  for(let i=0;i<line.length;i++){
    const c=line[i];
    if(c==='"'){if(quoted&&line[i+1]==='"'){val+='"';i++;}else quoted=!quoted;}
    else if(c===','&&!quoted){out.push(val);val="";}
    else val+=c;
  }
  out.push(val);return out;
}
async function fetchResponse(url,tries=3){
  let lastError;
  for(let attempt=0;attempt<tries;attempt++){
    try{
      const response=await fetch(url,{headers:JSON_HEADERS,signal:AbortSignal.timeout(18000),redirect:"follow"});
      if(response.ok)return response;
      throw Error("HTTP "+response.status+" at "+url);
    }catch(e){
      lastError=e;
      if(attempt+1<tries)await new Promise(resolve=>setTimeout(resolve,300+attempt*700));
    }
  }
  throw lastError;
}
function parseCsv(text){
  const rows=text.split(/\r?\n/).map(readCsvLine)
    .filter(c=>c.length>=4&&/^\d+$/.test(c[0])&&c[1]&&c[2]);
  return rows.map(c=>({id:c[0],school:c[1].trim(),mascot:c[2].trim(),abbr:c[3].trim()}));
}
async function prepareCollegeTeams(){
  const namesFile=JSON.parse(await readFile("data/fbs-2026.json","utf8"));
  if(namesFile.season!==2026||namesFile.names.length!==138)throw Error("FBS 2026 roster must contain 138 schools");
  const gist=await (await fetchResponse(ESPN_GIST)).text();
  const catalog=parseCsv(gist);
  if(catalog.length<300)throw Error("College ESPN catalog did not load ("+catalog.length+" rows)");
  const teams=namesFile.names.map(school=>{
    const options=aliases[school]||[school];
    const row=options.map(alias=>catalog.find(r=>clean(r.school)===clean(alias))).find(Boolean);
    if(!row)throw Error("Missing ESPN ID for FBS school: "+school+" aliases="+options.join(", "));
    return {league:"CFB",abbr:row.id,city:school,
      nickname:nickOverrides[school]||row.mascot,
      name:school+" "+(nickOverrides[school]||row.mascot),
      key:"CFB:"+row.id,
      logoSource:"https://a.espncdn.com/i/teamlogos/ncaa/500/"+row.id+".png"};
  });
  const duplicates=teams.filter((t,i)=>teams.findIndex(x=>x.key===t.key)!==i);
  if(duplicates.length)throw Error("Duplicate FBS ESPN IDs: "+duplicates.map(x=>x.name+"="+x.abbr).join(", "));
  const js="/* Generated from the verified 2026 FBS roster and ESPN's primary marks. */\n"+
    "window.SPORTSPIE_CFB_TEAMS = "+JSON.stringify(teams,null,2)+";\n";
  await writeFile("cfb-teams.js",js);
  // Useful for auditing the generated roster through the workflow run.
  console.log("SPORTSPIE_CFB_MANIFEST_B64="+Buffer.from(js).toString("base64"));
  console.log("Resolved "+teams.length+" FBS schools from "+catalog.length+" NCAA team identities.");
  return teams;
}
function preferDefaultLogo(logos){
  const supported=(logos||[]).filter(l=>l&&typeof l.href==="string"&&l.href.startsWith("https://"));
  const preferred=supported.find(l=>l.rel?.includes("default")&&l.rel?.includes("full"))||
    supported.find(l=>l.rel?.includes("default"))||
    supported.find(l=>!l.rel?.includes("dark"));
  return preferred?.href||null;
}
async function proLogos(){
  const api={
    NFL:"football/nfl",NHL:"hockey/nhl",NBA:"basketball/nba",MLB:"baseball/mlb"
  };
  const maps={};
  for(const [league,sport] of Object.entries(api)){
    try{
      const url="https://site.api.espn.com/apis/site/v2/sports/"+sport+"/teams?limit=100";
      const json=await(await fetchResponse(url,2)).json();
      const listing=(json.sports||[]).flatMap(s=>(s.leagues||[]).flatMap(l=>l.teams||[]));
      const m=[];
      for(const item of listing){
        const t=item.team||item;
        m.push({name:t.displayName,abbreviation:String(t.abbreviation||"").toLowerCase(),
          nickname:t.name,href:preferDefaultLogo(t.logos)});
      }
      maps[league]=m;
      console.log("ESPN",league,"primary logos:",m.filter(v=>v.href).length);
    }catch(e){
      maps[league]=[];
      console.warn("ESPN team API unavailable for",league,e.message);
    }
  }
  return maps;
}
function proEntries(source,maps){
  const segment=source.split("  const TEAM_ROWS = [")[1]?.split("\n  ];")[0];
  if(!segment)throw Error("Could not read existing four-league team catalog");
  const values=[...segment.matchAll(/"(NFL|NHL|NBA|MLB)\|([a-z]+)\|([^|]*)\|([^|]*)\|[^"]+"/g)];
  if(values.length!==124)throw Error("Expected 124 professional teams, got "+values.length);
  const aliases={
    "NFL:wsh":["was"],"NBA:gs":["gsw"],"NBA:no":["nop"],
    "NBA:ny":["nyk"],"NBA:sa":["sas"],"NBA:utah":["ut"],
    "MLB:ath":["oak"],"MLB:la":["lad"],"MLB:laa":["ana"],
    "NHL:tb":["tbl"],"NHL:uta":["utah"]
  };
  return values.map((match)=>{
    const [,league,abbr,city,nickname]=match;
    const name=city?city+" "+nickname:nickname;
    const key=league+":"+abbr;
    const expected=(maps[league]||[]).find(t=>
      clean(t.name)===clean(name))||
      (maps[league]||[]).find(t=>
        [abbr,...(aliases[key]||[])].includes(t.abbreviation));
    const base="https://a.espncdn.com/i/teamlogos/"+league.toLowerCase()+"/500/";
    const candidates=[expected?.href,base+abbr+".png",...(aliases[key]||[]).map(s=>base+s+".png")]
      .filter(Boolean);
    return {league,abbr,city,nickname,key,name,candidates};
  });
}
function isImage(buffer){
  return (buffer.length>70&&buffer[0]===137&&buffer[1]===80&&buffer[2]===78&&buffer[3]===71)||
    (buffer.length>70&&buffer.toString("ascii",0,4)==="RIFF"&&buffer.toString("ascii",8,12)==="WEBP")||
    (buffer.length>70&&buffer[0]===255&&buffer[1]===216)||
    (buffer.length>70&&buffer.toString("ascii",0,3)==="GIF");
}
async function fetchLogo(team){
  const candidates=team.logoSource?[team.logoSource]:team.candidates;
  const errors=[];
  for(const url of [...new Set(candidates)]){
    try{
      const response=await fetchResponse(url,2);
      const bytes=Buffer.from(await response.arrayBuffer());
      if(!isImage(bytes))throw Error("Content is not a supported raster image");
      const dest=path.join("assets","logos",team.league.toLowerCase(),team.abbr+".png");
      await mkdir(path.dirname(dest),{recursive:true});
      await writeFile(dest,bytes);
      return {key:team.key,url,bytes:bytes.length};
    }catch(e){errors.push(url+": "+e.message);}
  }
  throw Error(team.name+" ("+team.key+") logo download failed: "+errors.join(" | "));
}
async function inBatches(items,capacity,fn){
  const results=[];
  for(let i=0;i<items.length;i+=capacity){
    const group=await Promise.allSettled(items.slice(i,i+capacity).map(fn));
    group.forEach((v,j)=>results.push(v.status==="fulfilled"?v.value:Promise.reject(v.reason)));
  }
  return Promise.all(results);
}
async function main(){
  const cfb=await prepareCollegeTeams();
  const app=await readFile("app.js","utf8");
  const api=await proLogos();
  const pro=proEntries(app,api);
  const all=[...pro,...cfb];
  if(new Set(all.map(t=>t.key)).size!==262)throw Error("Team ID collision in 262-team manifest");
  const downloads=[];
  const failures=[];
  for(let i=0;i<all.length;i+=12){
    await Promise.all(all.slice(i,i+12).map(async t=>{
      try{downloads.push(await fetchLogo(t));}
      catch(e){failures.push(e.message);}
    }));
    if((i/12)%5===0)console.log("Verified "+downloads.length+"/"+all.length+" primary team logos");
  }
  if(failures.length)throw Error(failures.length+" primary logos failed:\n"+failures.join("\n"));
  const sources=Object.fromEntries(downloads.map(d=>[d.key,d.url]));
  await writeFile("logo-sources.js",
    "/* Verified primary-logo URLs for display fallback. */\nwindow.SPORTSPIE_LOGO_SOURCES = "+
    JSON.stringify(sources,null,2)+";\n");
  console.log("READY: "+cfb.length+" FBS and "+pro.length+
    " professional primary logos verified and stored locally. Total "+downloads.length+".");
}
await main();
