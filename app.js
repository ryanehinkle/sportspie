/* SportsPie — static, zero-build GitHub Pages game. */
(function () {
  "use strict";

  /* Bundled pro teams, plus the generated 2026 FBS catalog. All logo files are self-hosted. */
  const TEAM_ROWS = [
    "NFL|ari|Arizona|Cardinals|#97233F|#000000",
    "NFL|atl|Atlanta|Falcons|#A71930|#000000",
    "NFL|bal|Baltimore|Ravens|#241773|#9E7C0C",
    "NFL|buf|Buffalo|Bills|#00338D|#C60C30",
    "NFL|car|Carolina|Panthers|#0085CA|#101820",
    "NFL|chi|Chicago|Bears|#0B162A|#C83803",
    "NFL|cin|Cincinnati|Bengals|#FB4F14|#000000",
    "NFL|cle|Cleveland|Browns|#311D00|#FF3C00",
    "NFL|dal|Dallas|Cowboys|#003594|#869397",
    "NFL|den|Denver|Broncos|#FB4F14|#002244",
    "NFL|det|Detroit|Lions|#0076B6|#B0B7BC",
    "NFL|gb|Green Bay|Packers|#203731|#FFB612",
    "NFL|hou|Houston|Texans|#03202F|#A71930",
    "NFL|ind|Indianapolis|Colts|#002C5F|#FFFFFF",
    "NFL|jax|Jacksonville|Jaguars|#006778|#D7A22A",
    "NFL|kc|Kansas City|Chiefs|#E31837|#FFB81C",
    "NFL|lv|Las Vegas|Raiders|#000000|#A5ACAF",
    "NFL|lac|Los Angeles|Chargers|#0080C6|#FFC20E",
    "NFL|lar|Los Angeles|Rams|#003594|#FFA300",
    "NFL|mia|Miami|Dolphins|#008E97|#FC4C02",
    "NFL|min|Minnesota|Vikings|#4F2683|#FFC62F",
    "NFL|ne|New England|Patriots|#002244|#C60C30",
    "NFL|no|New Orleans|Saints|#D3BC8D|#101820",
    "NFL|nyg|New York|Giants|#0B2265|#A71930",
    "NFL|nyj|New York|Jets|#125740|#FFFFFF",
    "NFL|phi|Philadelphia|Eagles|#004C54|#A5ACAF",
    "NFL|pit|Pittsburgh|Steelers|#FFB612|#101820",
    "NFL|sf|San Francisco|49ers|#AA0000|#B3995D",
    "NFL|sea|Seattle|Seahawks|#002244|#69BE28",
    "NFL|tb|Tampa Bay|Buccaneers|#D50A0A|#34302B",
    "NFL|ten|Tennessee|Titans|#0C2340|#4B92DB",
    "NFL|wsh|Washington|Commanders|#5A1414|#FFB612",

    "NHL|ana|Anaheim|Ducks|#F47A38|#000000",
    "NHL|bos|Boston|Bruins|#FFB81C|#000000",
    "NHL|buf|Buffalo|Sabres|#003087|#FFB81C",
    "NHL|cgy|Calgary|Flames|#C8102E|#F1BE48",
    "NHL|car|Carolina|Hurricanes|#CC0000|#000000",
    "NHL|chi|Chicago|Blackhawks|#CF0A2C|#000000",
    "NHL|col|Colorado|Avalanche|#6F263D|#236192",
    "NHL|cbj|Columbus|Blue Jackets|#002654|#CE1126",
    "NHL|dal|Dallas|Stars|#006847|#8F8F8C",
    "NHL|det|Detroit|Red Wings|#CE1126|#FFFFFF",
    "NHL|edm|Edmonton|Oilers|#041E42|#FF4C00",
    "NHL|fla|Florida|Panthers|#C8102E|#041E42",
    "NHL|lak|Los Angeles|Kings|#111111|#A2AAAD",
    "NHL|min|Minnesota|Wild|#154734|#A6192E",
    "NHL|mtl|Montreal|Canadiens|#AF1E2D|#192168",
    "NHL|nsh|Nashville|Predators|#FFB81C|#041E42",
    "NHL|njd|New Jersey|Devils|#CE1126|#000000",
    "NHL|nyi|New York|Islanders|#00539B|#F47D30",
    "NHL|nyr|New York|Rangers|#0038A8|#CE1126",
    "NHL|ott|Ottawa|Senators|#C52032|#C2912C",
    "NHL|phi|Philadelphia|Flyers|#F74902|#000000",
    "NHL|pit|Pittsburgh|Penguins|#FCB514|#000000",
    "NHL|sea|Seattle|Kraken|#001628|#99D9D9",
    "NHL|sj|San Jose|Sharks|#006D75|#EA7200",
    "NHL|stl|St. Louis|Blues|#002F87|#FCB514",
    "NHL|tb|Tampa Bay|Lightning|#002868|#FFFFFF",
    "NHL|tor|Toronto|Maple Leafs|#00205B|#FFFFFF",
    "NHL|uta|Utah|Mammoth|#5B839E|#0E1727",
    "NHL|van|Vancouver|Canucks|#00205B|#00843D",
    "NHL|vgk|Vegas|Golden Knights|#B4975A|#333F42",
    "NHL|wsh|Washington|Capitals|#C8102E|#041E42",
    "NHL|wpg|Winnipeg|Jets|#041E42|#004C97",

    "NBA|atl|Atlanta|Hawks|#E03A3E|#C1D32F",
    "NBA|bos|Boston|Celtics|#007A33|#BA9653",
    "NBA|bkn|Brooklyn|Nets|#000000|#FFFFFF",
    "NBA|cha|Charlotte|Hornets|#1D1160|#00788C",
    "NBA|chi|Chicago|Bulls|#CE1141|#000000",
    "NBA|cle|Cleveland|Cavaliers|#6F263D|#FFB81C",
    "NBA|dal|Dallas|Mavericks|#00538C|#002B5E",
    "NBA|den|Denver|Nuggets|#0E2240|#FEC524",
    "NBA|det|Detroit|Pistons|#C8102E|#1D42BA",
    "NBA|gs|Golden State|Warriors|#1D428A|#FFC72C",
    "NBA|hou|Houston|Rockets|#CE1141|#000000",
    "NBA|ind|Indiana|Pacers|#002D62|#FDBB30",
    "NBA|lac|LA|Clippers|#C8102E|#1D428A",
    "NBA|lal|Los Angeles|Lakers|#552583|#FDB927",
    "NBA|mem|Memphis|Grizzlies|#5D76A9|#12173F",
    "NBA|mia|Miami|Heat|#98002E|#F9A01B",
    "NBA|mil|Milwaukee|Bucks|#00471B|#EEE1C6",
    "NBA|min|Minnesota|Timberwolves|#0C2340|#236192",
    "NBA|no|New Orleans|Pelicans|#0C2340|#C8102E",
    "NBA|ny|New York|Knicks|#006BB6|#F58426",
    "NBA|okc|Oklahoma City|Thunder|#007AC1|#EF3B24",
    "NBA|orl|Orlando|Magic|#0077C0|#C4CED4",
    "NBA|phi|Philadelphia|76ers|#006BB6|#ED174C",
    "NBA|phx|Phoenix|Suns|#1D1160|#E56020",
    "NBA|por|Portland|Trail Blazers|#E03A3E|#000000",
    "NBA|sac|Sacramento|Kings|#5A2D81|#63727A",
    "NBA|sa|San Antonio|Spurs|#C4CED4|#000000",
    "NBA|tor|Toronto|Raptors|#CE1141|#000000",
    "NBA|utah|Utah|Jazz|#753BBD|#002B5C",
    "NBA|wsh|Washington|Wizards|#002B5C|#E31837",

    "MLB|ari|Arizona|Diamondbacks|#A71930|#E3D4AD",
    "MLB|atl|Atlanta|Braves|#CE1141|#13274F",
    "MLB|bal|Baltimore|Orioles|#DF4601|#000000",
    "MLB|bos|Boston|Red Sox|#BD3039|#0C2340",
    "MLB|chc|Chicago|Cubs|#0E3386|#CC3433",
    "MLB|chw|Chicago|White Sox|#27251F|#FFFFFF",
    "MLB|cin|Cincinnati|Reds|#C6011F|#000000",
    "MLB|cle|Cleveland|Guardians|#E31937|#0C2340",
    "MLB|col|Colorado|Rockies|#333366|#C4CED4",
    "MLB|det|Detroit|Tigers|#0C2340|#FA4616",
    "MLB|hou|Houston|Astros|#002D62|#EB6E1F",
    "MLB|kc|Kansas City|Royals|#004687|#BD9B60",
    "MLB|la|Los Angeles|Dodgers|#005A9C|#EF3E42",
    "MLB|laa|Los Angeles|Angels|#BA0021|#003263",
    "MLB|mia|Miami|Marlins|#00A3E0|#EF3340",
    "MLB|mil|Milwaukee|Brewers|#12284B|#FFC52F",
    "MLB|min|Minnesota|Twins|#002B5C|#D31145",
    "MLB|nym|New York|Mets|#002D72|#FF5910",
    "MLB|nyy|New York|Yankees|#003087|#FFFFFF",
    "MLB|ath||Athletics|#006141|#FFB819",
    "MLB|phi|Philadelphia|Phillies|#E81828|#002D72",
    "MLB|pit|Pittsburgh|Pirates|#FDB827|#27251F",
    "MLB|sd|San Diego|Padres|#2F241D|#FFC425",
    "MLB|sf|San Francisco|Giants|#FD5A1E|#27251F",
    "MLB|sea|Seattle|Mariners|#0C2C56|#005C5C",
    "MLB|stl|St. Louis|Cardinals|#C41E3A|#0C2340",
    "MLB|tb|Tampa Bay|Rays|#092C5C|#8FBCE6",
    "MLB|tex|Texas|Rangers|#003278|#C0111F",
    "MLB|tor|Toronto|Blue Jays|#134A8E|#E8291C",
    "MLB|wsh|Washington|Nationals|#AB0003|#14225A"
  ];

  const CFB_TEAMS = window.SPORTSPIE_CFB_TEAMS || [];
  const PRIMARY_LOGOS = window.SPORTSPIE_LOGO_SOURCES || {};
  const $ = id => document.getElementById(id);
  const teams = TEAM_ROWS.map(row => {
    const [league,abbr,city,nickname,primary,secondary] = row.split("|");
    const name=city ? city+" "+nickname : nickname;
    return {league,abbr,city,nickname,name,primary,secondary,key:league+":"+abbr,
      logo:"./assets/logos/"+league.toLowerCase()+"/"+abbr+".png"};
  }).concat(CFB_TEAMS.map(t=>({
    ...t,logo:"./assets/logos/cfb/"+t.abbr+".png"
  })));
  const byKey = Object.fromEntries(teams.map(t => [t.key,t]));
  const STORE_KEY = "sportspie-state-v2";
  // Recompute saved palettes when the extraction method changes; preserve guesses and stats.
  const PALETTE_VERSION = 5;
  let store;
  try {store=JSON.parse(localStorage.getItem(STORE_KEY)) || {};} catch(e) {store={};}
  if(!store.records || typeof store.records!=="object") store.records={};
  if(!store.palettes || typeof store.palettes!=="object") store.palettes={};
  if(!store.stats || typeof store.stats!=="object") store.stats={};
  if(!Array.isArray(store.recent)) store.recent=[];
  const DAILY = window.SportsPieDaily;
  const HINTS = window.SportsPieHints;
  if(!DAILY||!HINTS)throw new Error("The SportsPie game helpers were not loaded");
  let league = ["ALL","NFL","NHL","NBA","MLB","CFB"].includes(store.league)?store.league:"ALL";
  let dailyCategory = ["PRO","CFB"].includes(store.dailyCategory)?store.dailyCategory:(league==="CFB"?"CFB":"PRO");
  let mode = ["daily","endless"].includes(store.mode)?store.mode:"daily";
  let day = DAILY.localDay();
  let current = null,session = null,palette = null,paletteSource = null,loadSerial = 0;
  let selected = null,options = [],optionIndex = -1,toastTimer = null;
  const MAX_GUESSES=6;

  function save(){
    try {localStorage.setItem(STORE_KEY, JSON.stringify(store));} catch(e) { /* private browsing */ }
  }
  function pool(){
    if(mode==="daily")return teams.filter(t=>dailyCategory==="CFB"?t.league==="CFB":t.league!=="CFB");
    return league==="ALL" ? teams : teams.filter(t => t.league===league);
  }
  function hash(str) {
    let h=2166136261;
    for(let i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,16777619);}
    return h>>>0;
  }
  function dailyKey(){return "local-v1|"+day+"|"+dailyCategory;}
  function dailyAnswer(){
    // Opening-day featured teams (October 13, 2026) only.
    // These are resolved against the verified primary-logo roster, so both
    // the displayed answer and the analyzed pie use the same logo asset.
    if(day==="2026-10-13"){
      const target=dailyCategory==="CFB"
        ? teams.find(t=>t.league==="CFB"&&t.city==="Auburn"&&t.nickname==="Tigers")
        : byKey["NFL:hou"];
      if(!target)throw new Error("Featured Day 1 team missing from the catalog");
      return target;
    }
    const choices=pool();
    // Continue the normal daily rotation unchanged from Day 2 onward.
    const index=(hash("SportsPie:daily-v3:"+dailyCategory)+37*(DAILY.puzzleNumber(day)-1))%choices.length;
    return choices[index];
  }
  function refreshOpeningDayAttempts(){
    // Before this fix, Day 1 served different answers. Give existing players
    // fresh Day 1 attempts and remove *only* those superseded attempts'
    // aggregate counters, without touching any other date or Unlimited round.
    if(store.openingDayCorrected)return;
    for(const scope of ["PRO","CFB"]){
      const key="local-v1|2026-10-13|"+scope;
      const previous=store.records[key];
      if(!previous)continue;
      const oldStats=store.stats[scope];
      if(previous.counted&&oldStats){
        oldStats.played=Math.max(0,(oldStats.played||0)-1);
        if(previous.won){
          oldStats.wins=Math.max(0,(oldStats.wins||0)-1);
          const index=(previous.guesses||[]).length-1;
          if(index>=0&&index<6&&Array.isArray(oldStats.distribution))
            oldStats.distribution[index]=Math.max(0,(oldStats.distribution[index]||0)-1);
          if(oldStats.lastWon==="2026-10-13"){
            oldStats.lastWon="";
            oldStats.streak=0;
          }
        }
      }
      if(previous.optionalHintsEnabled&&store.hintStats?.[scope]){
        const hintStats=store.hintStats[scope],used=HINTS.count(previous);
        hintStats.totalUsed=Math.max(0,(hintStats.totalUsed||0)-used);
        if(used)hintStats.helpedRounds=Math.max(0,(hintStats.helpedRounds||0)-1);
        if(previous.hintResultCounted){
          hintStats.completedRounds=Math.max(0,(hintStats.completedRounds||0)-1);
          hintStats.completedHints=Math.max(0,(hintStats.completedHints||0)-used);
          if(previous.won){
            hintStats.trackedWins=Math.max(0,(hintStats.trackedWins||0)-1);
            if(!used)hintStats.hintFreeWins=Math.max(0,(hintStats.hintFreeWins||0)-1);
          }
        }
      }
      delete store.records[key];
    }
    store.openingDayCorrected=true;
    save();
  }
  function newEndless(){
    const choices=pool();
    const excluded=new Set(store.recent||[]);
    let available=choices.filter(t=>!excluded.has(t.key));
    if(!available.length) available=choices;
    const t=available[Math.floor(Math.random()*available.length)];
    store.recent=(store.recent||[]).concat(t.key).slice(-Math.min(20,teams.length-1));
    store.endlessSession={league,key:t.key,guesses:[],complete:false,won:false,hintsUsed:0,optionalHintsEnabled:true};
    save();return t;
  }
  function initGame(forceNew){
    loadSerial++;
    day=DAILY.localDay();
    if(mode==="daily"){
      current=dailyAnswer();
      const key=dailyKey();
      if(!store.records[key]) store.records[key]={guesses:[],complete:false,won:false};
      session=store.records[key];
    } else {
      const cached=store.endlessSession;
      if(!forceNew && cached && cached.league===league && byKey[cached.key]){
        session=cached;current=byKey[cached.key];
      } else {
        current=newEndless();
        session=store.endlessSession;
      }
    }
    // Preserve all in-progress guesses/hints when switching modes or refreshing.
    // Already completed older games predate manual hints, so don't classify
    // their previously automatic clues as manually requested.
    if(!session.complete){
      session.optionalHintsEnabled=true;
      session.hintsUsed=HINTS.count(session);
    }
    selected=null; options=[];optionIndex=-1;palette=null;paletteSource=null;
    $("teamInput").value=""; $("teamInput").disabled=false;
    $("suggestions").hidden=true;$("teamInput").setAttribute("aria-expanded","false");
    $("pie").classList.remove("ready");
    $("pie").style.background="";
    $("pieSvg").replaceChildren();
    $("paletteLegend").innerHTML='<span class="muted">Analyzing logo colors…</span>';
    $("feedback").textContent="";
    $("puzzleTitle").textContent=mode==="daily"?DAILY.displayDate(day):"Unlimited";
    $("puzzleSubtitle").textContent=mode==="daily"?"Puzzle #"+DAILY.puzzleNumber(day):"";
    $("puzzleSubtitle").hidden=mode!=="daily";
    $("roundLabel").textContent=mode==="daily"?(dailyCategory==="CFB"?"CFB":"PRO"):"";
    $("roundLabel").hidden=mode!=="daily";
    $("countdownText").textContent=mode==="daily"?"Next puzzle in --:--:--":"";
    $("attemptLabel").textContent="YOUR GUESSES";
    $("guessHeading").textContent="Who does it belong to?";
    $("playContent").hidden=!!session.complete;
    $("endScreen").hidden=!session.complete;
    renderControls();renderGuesses();renderHints();renderAttempts();
    if(session.complete) renderEnd();
    updateSubmit();
    const request=loadSerial;
    getPalette(current).then(result=>{
      if(request!==loadSerial) return;
      palette=result.parts;paletteSource=result.source;
      renderPie();
      if(session.complete) renderEnd();
    }).catch(error=>{
      if(request!==loadSerial) return;
      console.warn("SportsPie could not analyze the primary team logo:",error);
      renderPaletteError();
    });
    save();
  }
  function renderControls(){
    document.querySelectorAll("[data-mode]").forEach(b=>{
      const active=b.dataset.mode===mode;b.classList.toggle("active",active);b.setAttribute("aria-pressed",String(active));
    });
    $("dailySwitch").hidden=mode!=="daily";
    $("unlimitedSwitch").hidden=mode!=="endless";
    $("timerBar").hidden=mode!=="daily";
    document.querySelectorAll("[data-daily]").forEach(b=>{
      const active=b.dataset.daily===dailyCategory;b.classList.toggle("active",active);b.setAttribute("aria-pressed",String(active));
    });
    document.querySelectorAll("[data-league]").forEach(b=>{
      const active=b.dataset.league===league;b.classList.toggle("active",active);b.setAttribute("aria-pressed",String(active));
    });
  }
  // Every image on the site uses the *same verified primary logo* that the
  // pixel analyzer uses. Only fall back to the original URL of that very mark,
  // never to a dark variant, alternate crest, or a different team's logo.
  function imageCandidates(team){
    return [team.logo,PRIMARY_LOGOS[team.key]].filter((src,i,list)=>src&&list.indexOf(src)===i);
  }
  function applyTeamLogo(img,team){
    const candidates=imageCandidates(team);
    let index=0;
    img.alt=team.name+" primary logo";
    img.style.opacity="1";
    img.hidden=false;
    img.onerror=()=>{
      index++;
      if(index<candidates.length){img.src=candidates[index];return;}
      // No fabricated substitute image: this state should be caught by the
      // deploy-time 262-team logo verification.
      img.onerror=null;
      img.style.opacity=".25";
      img.alt=team.name+" logo temporarily unavailable";
    };
    img.src=candidates[0];
  }
  function loadImage(url){
    return new Promise((resolve,reject)=>{
      const img=new Image();
      let done=false;
      const timer=setTimeout(()=>{
        if(!done){done=true;img.onload=img.onerror=null;reject(new Error("Image timed out"));}
      },9000);
      img.crossOrigin="anonymous";
      img.onload=()=>{if(!done){done=true;clearTimeout(timer);resolve(img);}};
      img.onerror=()=>{if(!done){done=true;clearTimeout(timer);reject(new Error("Logo image unavailable"));}};
      img.src=url;
    });
  }
  async function imageFor(team){
    let error;
    for(const url of imageCandidates(team)){
      try{return await loadImage(url);}catch(e){error=e;}
    }
    throw error||new Error("No primary team logo could be loaded");
  }
    function clamp(v,min,max){return Math.max(min,Math.min(max,v));}
  function toHex(r,g,b){
    return "#"+[r,g,b].map(n=>clamp(Math.round(n),0,255).toString(16).padStart(2,"0")).join("").toUpperCase();
  }
  function colorDistance(a,b){
    const dr=a.r-b.r,dg=a.g-b.g,db=a.b-b.b;
    return Math.sqrt(dr*dr*.95+dg*dg*1.25+db*db*.8);
  }
  function extractColors(img){
    if(!window.SportsPiePalette){
      throw new Error("Logo palette analyzer was not loaded");
    }
    return window.SportsPiePalette.extractFromImage(img);
  }
  async function getPalette(team){
    const preferred=new URL(imageCandidates(team)[0],document.baseURI).href;
    const cached=store.palettes[team.key];
    if(cached && cached.version===PALETTE_VERSION && cached.source===preferred &&
      Array.isArray(cached.parts) && cached.parts.length &&
      cached.parts.every(c=>c&&/^#[0-9a-fA-F]{6}$/.test(c.color)&&Number.isFinite(c.value))){
      return {parts:cached.parts,source:cached.source};
    }
    // No guessed brand-color fallback: if the primary logo cannot be analyzed,
    // the game displays a retry action instead of misleading percentages.
    const img=await imageFor(team);
    const parts=extractColors(img);
    store.palettes[team.key]={version:PALETTE_VERSION,source:img.src,parts};
    save();
    return {parts,source:img.src};
  }
  function renderPaletteError(){
    palette=null;paletteSource=null;
    $("pie").classList.remove("ready");
    $("pie").style.background="#2b3349";
    $("pieSvg").replaceChildren();
    const legend=$("paletteLegend");legend.replaceChildren();
    const retry=document.createElement("button");
    retry.type="button";retry.className="retry-palette";
    retry.textContent="Retry loading logo colors ↻";
    retry.addEventListener("click",()=>initGame(false));
    legend.append(retry);
    $("pie").setAttribute("aria-label","Logo colors unavailable. Retry loading.");
    updateSubmit();
  }
  function integerPercentages(parts){
    const raw=parts.map(p=>p.value*100),ints=raw.map(Math.floor);
    let leftover=100-ints.reduce((a,b)=>a+b,0);
    const order=raw.map((n,i)=>({i,rem:n-ints[i]})).sort((a,b)=>b.rem-a.rem);
    for(let i=0;i<leftover;i++) ints[order[i%order.length].i]++;
    return ints;
  }
  function renderPie(){
    if(!palette||!palette.length)return;
    const svg=$("pieSvg"),ns="http://www.w3.org/2000/svg";
    svg.replaceChildren();
    const radius=99.55,cx=100,cy=100;
    if(palette.length===1){
      const circle=document.createElementNS(ns,"circle");
      circle.setAttribute("cx","100");circle.setAttribute("cy","100");
      circle.setAttribute("r",String(radius));
      circle.setAttribute("fill",palette[0].color);
      svg.append(circle);
    }else{
      let angle=-Math.PI/2;
      for(const segment of palette){
        const sweep=Math.max(0,Math.min(1,segment.value))*Math.PI*2;
        if(sweep<.0000001)continue;
        const a0=angle,a1=angle+sweep;
        const x0=cx+radius*Math.cos(a0),y0=cy+radius*Math.sin(a0);
        const x1=cx+radius*Math.cos(a1),y1=cy+radius*Math.sin(a1);
        const path=document.createElementNS(ns,"path");
        path.setAttribute("d","M "+cx+" "+cy+" L "+x0+" "+y0+
          " A "+radius+" "+radius+" 0 "+(sweep>Math.PI?1:0)+" 1 "+x1+" "+y1+" Z");
        path.setAttribute("fill",segment.color);
        // Sub-pixel strokes of the same color eliminate renderer seam artifacts.
        path.setAttribute("stroke",segment.color);
        path.setAttribute("stroke-width","0.65");
        path.setAttribute("stroke-linejoin","round");
        svg.append(path);
        angle=a1;
      }
    }
    $("pie").style.background="transparent";
    $("pie").classList.remove("ready");void $("pie").offsetWidth;$("pie").classList.add("ready");
    const pct=integerPercentages(palette);
    $("paletteLegend").replaceChildren();
    palette.forEach((p,i)=>{
      const wrap=document.createElement("span");wrap.className="swatch-wrap";
      const swatch=document.createElement("span");swatch.className="swatch";swatch.style.backgroundColor=p.color;
      const count=document.createElement("span");count.textContent=pct[i]+"%";
      wrap.append(swatch,count);$("paletteLegend").append(wrap);
    });
    $("pie").setAttribute("aria-label","Mystery logo color breakdown: "+
      palette.map((p,i)=>pct[i]+" percent "+p.color).join(", "));
    updateSubmit();
  }
  function normalize(str){
    return (str||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"")
      .replace(/[^a-z0-9]/g,"");
  }
  function searchTeams(query){
    const q=normalize(query);
    if(!q)return [];
    const guesses=new Set(session.guesses);
    return pool().filter(t=>!guesses.has(t.key))
      .map(t=>{
        const name=normalize(t.name),nick=normalize(t.nickname),city=normalize(t.city);
        const match=name.includes(q)||nick.includes(q)||city.includes(q)||t.abbr.includes(q)||
          (t.key==="MLB:ath"&&["as","oaklandathletics","athletics"].some(x=>x.includes(q)));
        let rank=name===q||nick===q?0:name.startsWith(q)?1:nick.startsWith(q)?2:city.startsWith(q)?3:4;
        return {team:t,match,rank};
      }).filter(x=>x.match).sort((a,b)=>a.rank-b.rank||a.team.name.localeCompare(b.team.name))
      .slice(0,8).map(x=>x.team);
  }
  function closeSuggestions(){
    $("suggestions").hidden=true;
    $("teamInput").setAttribute("aria-expanded","false");
    optionIndex=-1;
  }
  function showSuggestions(){
    options=searchTeams($("teamInput").value);
    const root=$("suggestions");root.replaceChildren();
    if(!$("teamInput").value.trim()||selected){closeSuggestions();return;}
    if(!options.length){
      const none=document.createElement("div");none.className="suggestions-empty";none.textContent="No matching teams";
      root.append(none);
    } else options.forEach((t,i)=>{
      const button=document.createElement("button");button.type="button";button.className="suggestion";
      button.setAttribute("role","option");button.setAttribute("aria-selected",String(i===optionIndex));
      const name=document.createElement("span");name.textContent=t.name;
      const leagueEl=document.createElement("small");leagueEl.textContent=t.league;
      button.append(name,leagueEl);
      // mousedown lets the option be chosen before input loses focus.
      button.addEventListener("mousedown",event=>event.preventDefault());
      button.addEventListener("click",()=>selectTeam(t));
      root.append(button);
    });
    root.hidden=false;
    $("teamInput").setAttribute("aria-expanded","true");
  }
  function selectTeam(team){
    selected=team;
    $("teamInput").value=team.name;
    $("feedback").textContent="";
    closeSuggestions();updateSubmit();$("teamInput").focus();
  }
  function updateSubmit(){
    $("guessBtn").disabled=!selected||!!(session&&session.complete)||!palette;
  }
  function renderAttempts(){
    const count=session.guesses.length;
    $("attemptCount").innerHTML="<strong>"+count+"</strong> / "+MAX_GUESSES;
    const cells=[...$("attemptDots").children];
    cells.forEach((el,i)=>{
      el.className=i<count ? (session.won&&i===count-1?"correct":"used") : "";
    });
    $("attemptDots").setAttribute("aria-label",count+" of "+MAX_GUESSES+" guesses used");
  }
  function renderGuesses(){
    const target=$("guessList");target.replaceChildren();
    if(session.guesses.length===0){
      const empty=document.createElement("div");empty.className="empty-state";
      empty.innerHTML='<div class="empty-symbol" aria-hidden="true">◎</div><span>Your guesses will show up here.</span>';
      target.append(empty);return;
    }
    session.guesses.forEach((key,i)=>{
      const t=byKey[key];if(!t)return;
      const row=document.createElement("div");row.className="guess-row";
      const img=document.createElement("img");img.className="guess-logo";img.loading="lazy";
      applyTeamLogo(img,t);
      const info=document.createElement("div");info.className="guess-info";
      const name=document.createElement("div");name.className="guess-name";name.textContent=t.name;
      const sub=document.createElement("div");sub.className="guess-league";sub.textContent=t.league+" · Guess "+(i+1);
      info.append(name,sub);
      const mark=document.createElement("div");const win=key===current.key;
      mark.className="guess-mark"+(win?" win":"");mark.textContent=win?"✓":"×";
      row.append(img,info,mark);target.append(row);
    });
  }
  function hintScope(){
    return mode==="daily"?dailyCategory:"UNLIMITED:"+league;
  }
  function clueTexts(){
    const nicknameLetters=current.nickname.replace(/[^A-Za-z0-9]/g,"").length;
    if(current.league==="CFB"){
      return [
        "School name begins with: "+(current.city ? current.city[0].toUpperCase() : "Unknown"),
        "Nickname length: "+nicknameLetters+" letters / digits",
        "Nickname begins with: "+current.nickname[0].toUpperCase(),
        "Nickname: "+current.nickname
      ];
    }
    return [
      "League: "+current.league,
      "City / region begins with: "+(current.city ? current.city[0].toUpperCase() : "No city in the team name"),
      "Nickname length: "+nicknameLetters+" letters / digits",
      "Nickname begins with: "+current.nickname[0].toUpperCase(),
      "Home city / region: "+(current.city||"Not included in official name")
    ];
  }
  function renderHints(){
    const maximum=HINTS.maxForLeague(current.league);
    const used=HINTS.count(session,maximum);
    const clues=clueTexts().slice(0,used);
    $("hintCounter").textContent=used+"/"+maximum;
    $("hintBtn").disabled=!!session.complete||used>=maximum;
    $("hintBtn").title=used>=maximum?"All hints revealed":
      "Reveal hint "+(used+1)+" of "+maximum;
    $("hintBox").hidden=!used||!!session.complete;
    $("hintList").replaceChildren();
    clues.forEach((clue,index)=>{
      const div=document.createElement("div");div.className="hint-item";
      div.textContent=(index+1)+". "+clue;
      $("hintList").append(div);
    });
  }
  function revealHint(){
    const maximum=HINTS.maxForLeague(current.league);
    if(!HINTS.reveal(session,store,hintScope(),maximum))return;
    save();
    renderHints();
    $("feedback").textContent="Hint "+HINTS.count(session,maximum)+" revealed.";
  }
  function recordCompletion(won){
    HINTS.complete(session,store,hintScope());
    if(session.counted)return;
    session.counted=true;
    const scope=hintScope();
    const old=store.stats[scope]||{played:0,wins:0,streak:0,best:0,lastWon:"",distribution:[0,0,0,0,0,0]};
    old.played++;
    if(won){
      old.wins++;
      if(mode==="daily"){
        const prev=new Date(day+"T00:00:00Z");prev.setUTCDate(prev.getUTCDate()-1);
        const yesterday=prev.toISOString().slice(0,10);
        old.streak=old.lastWon===yesterday?old.streak+1:(old.lastWon===day?old.streak:1);
        old.lastWon=day;
      }else{
        old.streak=(old.streak||0)+1;
      }
      old.best=Math.max(old.best,old.streak);
      const n=session.guesses.length;old.distribution[n-1]=(old.distribution[n-1]||0)+1;
    }else{
      old.streak=0;
    }
    store.stats[scope]=old;
  }
  function submitGuess(){
    if(!palette||session.complete)return;
    if(!selected){
      const val=normalize($("teamInput").value);
      const exact=pool().find(t=>normalize(t.name)===val||normalize(t.nickname)===val||normalize(t.abbr)===val);
      if(exact){selectTeam(exact);}else{$("feedback").textContent="Please choose a team from the suggestions.";return;}
    }
    if(session.guesses.includes(selected.key)){$("feedback").textContent="You've already guessed that team.";return;}
    const won=selected.key===current.key;
    session.guesses.push(selected.key);
    session.won=won;
    session.complete=won||session.guesses.length>=MAX_GUESSES;
    if(session.complete)recordCompletion(won);
    save();
    $("feedback").textContent=won?"Correct!":session.complete?"Game over!":"Not quite. Try another team or use a hint.";
    selected=null;$("teamInput").value="";closeSuggestions();
    renderGuesses();renderAttempts();renderHints();updateSubmit();
    if(session.complete){
      $("playContent").hidden=true;$("endScreen").hidden=false;renderEnd();
    }else{
      setTimeout(()=>{$("feedback").textContent="";},2200);
      $("teamInput").focus();
    }
  }
  function renderEnd(){
    if(!session.complete)return;
    const won=!!session.won;
    $("resultIcon").className="result-icon"+(won?"":" lost");
    $("resultIcon").textContent=won?"✓":"×";
    $("resultKicker").textContent=won?"WELL PLAYED":"ROUND COMPLETE";
    $("resultHeading").textContent=won?"You got it!":"Out of guesses.";
    const hintResult=session.optionalHintsEnabled?
      " · "+HINTS.count(session)+" "+(HINTS.count(session)===1?"hint":"hints")+" used":"";
    $("resultSub").textContent=won
      ? "Solved in "+session.guesses.length+" "+(session.guesses.length===1?"guess":"guesses")+hintResult+"."
      : "The mystery logo has been revealed"+hintResult+".";
    $("answerName").textContent=current.name;
    $("answerLeague").textContent=current.league+" · Official team logo";
    applyTeamLogo($("answerLogo"),current);
    $("primaryEndBtn").innerHTML=mode==="daily"?"Share result <span>↗</span>":"Next team <span>→</span>";
    $("secondaryEndBtn").textContent=mode==="daily"?"Play unlimited ↗":"Share result ↗";
    $("endNote").textContent=mode==="daily"?"Come back tomorrow for another daily pie.":"Unlimited mode — play as many as you like.";
  }
  function shareResult(){
    const score=session.won?session.guesses.length+"/6":"X/6";
    const header="SportsPie 🥧 · "+(mode==="daily"?"#"+DAILY.puzzleNumber(day)+" · "+day+" · ":"")+(mode==="daily"?dailyCategory:league)+" · "+score;
    const blocks=session.guesses.map(k=>k===current.key?"🟩":"🟪").join("");
    const url="https://ryanehinkle.github.io/sportspie/";
    const hintInfo=session.optionalHintsEnabled?"\n✦ "+HINTS.count(session)+" hints used":"";
    const message=header+"\n"+blocks+hintInfo+"\n"+url;
    if(navigator.clipboard&&navigator.clipboard.writeText){
      navigator.clipboard.writeText(message).then(()=>showToast("Result copied to clipboard!"))
        .catch(()=>manualCopy(message));
    }else manualCopy(message);
  }
  function manualCopy(message){
    const area=document.createElement("textarea");area.value=message;area.style.position="fixed";area.style.opacity="0";document.body.append(area);
    area.select();
    try{document.execCommand("copy");showToast("Result copied to clipboard!");}catch(e){showToast("Sharing unavailable in this browser.");}
    area.remove();
  }
  function showToast(message){
    clearTimeout(toastTimer);$("toast").textContent=message;$("toast").classList.add("show");
    toastTimer=setTimeout(()=>$("toast").classList.remove("show"),2700);
  }
  function showStats(){
    const scope=hintScope();
    const stats=store.stats[scope]||{played:0,wins:0,streak:0,best:0,distribution:[0,0,0,0,0,0]};
    const hintData=HINTS.stats(store,scope);
    $("statsScope").textContent=mode==="daily"
      ? "DAILY · "+(dailyCategory==="PRO"?"NFL / NHL / NBA / MLB":"CFB")
      : "UNLIMITED · "+(league==="ALL"?"ALL LEAGUES":league);
    $("statHintsUsed").textContent=hintData.totalUsed;
    $("statHintFreeWins").textContent=hintData.hintFreeWins;
    $("statAvgHints").textContent=hintData.completedRounds?
      (hintData.completedHints/hintData.completedRounds).toFixed(1):"0.0";
    $("statHelpedRounds").textContent=hintData.helpedRounds;
    $("statPlayed").textContent=stats.played;
    $("statWin").textContent=stats.played?Math.round(100*stats.wins/stats.played)+"%":"0%";
    // A winning streak expires if there wasn't a win today or yesterday.
    const yesterday=new Date(day+"T00:00:00Z");yesterday.setUTCDate(yesterday.getUTCDate()-1);
    const active=stats.lastWon===day||stats.lastWon===yesterday.toISOString().slice(0,10);
    $("statStreak").textContent=active?stats.streak:0;
    $("statBest").textContent=stats.best;
    const dist=stats.distribution||[0,0,0,0,0,0],max=Math.max(1,...dist);
    $("distribution").replaceChildren();
    for(let i=0;i<6;i++){
      const row=document.createElement("div");row.className="distribution-row";
      const num=document.createElement("span");num.textContent=i+1;
      const bg=document.createElement("div");bg.className="distribution-bar";
      const fill=document.createElement("div");fill.className="distribution-fill";
      fill.style.width=dist[i]?Math.max(11,dist[i]/max*100)+"%":"0%";
      fill.textContent=dist[i]||"";
      bg.append(fill);row.append(num,bg);$("distribution").append(row);
    }
    $("statsDialog").showModal();
  }
  function tick(){
    const now=new Date(),updated=DAILY.localDay(now);
    if(updated!==day){
      day=updated;
      if(mode==="daily")initGame(false);
    }
    if(mode!=="daily")return;
    const seconds=Math.max(0,Math.ceil((DAILY.nextMidnight(now)-now.getTime())/1000));
    const hours=String(Math.floor(seconds/3600)).padStart(2,"0");
    const minutes=String(Math.floor(seconds%3600/60)).padStart(2,"0");
    const secs=String(seconds%60).padStart(2,"0");
    $("countdownText").textContent="Next puzzle in "+hours+":"+minutes+":"+secs;
  }
  document.querySelectorAll("[data-mode]").forEach(b=>b.addEventListener("click",()=>{
    if(mode===b.dataset.mode)return;
    mode=b.dataset.mode;store.mode=mode;initGame(false);tick();
  }));
  document.querySelectorAll("[data-daily]").forEach(b=>b.addEventListener("click",()=>{
    if(dailyCategory===b.dataset.daily)return;
    dailyCategory=b.dataset.daily;store.dailyCategory=dailyCategory;
    initGame(false);tick();
  }));
  document.querySelectorAll("[data-league]").forEach(b=>b.addEventListener("click",()=>{
    if(league===b.dataset.league)return;
    league=b.dataset.league;store.league=league;initGame(false);tick();
  }));
  $("teamInput").addEventListener("input",()=>{
    selected=null;optionIndex=-1;$("feedback").textContent="";showSuggestions();updateSubmit();
  });
  $("teamInput").addEventListener("focus",showSuggestions);
  $("teamInput").addEventListener("keydown",event=>{
    if(event.key==="Escape"){closeSuggestions();return;}
    if(event.key==="ArrowDown"||event.key==="ArrowUp"){
      if(!options.length)return;
      event.preventDefault();
      optionIndex=(optionIndex+(event.key==="ArrowDown"?1:options.length-1))%options.length;
      showSuggestions();
      [...$("suggestions").children].forEach((b,i)=>b.classList.toggle("active",i===optionIndex));
      $("suggestions").children[optionIndex]?.scrollIntoView({block:"nearest"});
    }
    if(event.key==="Enter"){
      event.preventDefault();
      if(selected){submitGuess();return;}
      if(!$("suggestions").hidden&&options.length){
        const next=options[Math.max(0,optionIndex)];selectTeam(next);
      }else submitGuess();
    }
  });
  document.addEventListener("pointerdown",event=>{
    if(!event.target.closest(".autocomplete"))closeSuggestions();
  });
  $("guessBtn").addEventListener("click",submitGuess);
  $("hintBtn").addEventListener("click",revealHint);
  $("howBtn").addEventListener("click",()=>$("howDialog").showModal());
  $("statsBtn").addEventListener("click",showStats);
  document.querySelectorAll("[data-close]").forEach(b=>b.addEventListener("click",()=>b.closest("dialog").close()));
  document.querySelectorAll("dialog").forEach(dialog=>dialog.addEventListener("click",event=>{
    if(event.target===dialog)dialog.close();
  }));
  $("primaryEndBtn").addEventListener("click",()=>{
    if(mode==="daily")shareResult();else initGame(true);
  });
  $("secondaryEndBtn").addEventListener("click",()=>{
    if(mode==="daily"){mode="endless";store.mode=mode;initGame(false);tick();}
    else shareResult();
  });

  refreshOpeningDayAttempts();
  initGame(false);
  tick();
  setInterval(tick,1000);
  document.addEventListener("visibilitychange",()=>{if(!document.hidden)tick();});
  window.addEventListener("focus",tick);
  // No runtime logo swapping: build-time verification produces one consistent logo per team.
  console.info("SportsPie loaded:",teams.length,"teams across NFL, NHL, NBA, MLB and CFB.");
})();
