/* SportsPie pixel-accurate logo palette analysis.
 * Uses original-resolution image pixels, alpha coverage, and (only when needed)
 * a connected-background cutout for images flattened onto a solid matte.
 * No guessed brand colors or resized/downsampled intermediary images.
 */
(function(root){
  "use strict";

  const MAX_COLORS = 10;

  function difference(a,b) {
    const dr=a.r-b.r,dg=a.g-b.g,db=a.b-b.b;
    return Math.sqrt(.95*dr*dr+1.25*dg*dg+.8*db*db);
  }
  function near(a,b,tolerance){
    return Math.abs(a[0]-b[0])<=tolerance &&
      Math.abs(a[1]-b[1])<=tolerance &&
      Math.abs(a[2]-b[2])<=tolerance;
  }
  function pixel(data,index){
    const k=index*4;
    return [data[k],data[k+1],data[k+2],data[k+3]];
  }
  function matteMask(data,width,height){
    const pixels=width*height;
    const corners=[0,width-1,(height-1)*width,pixels-1].map(i=>pixel(data,i));
    // Transparent corners indicate a genuine cutout: never infer a matte.
    if(corners.some(c=>c[3]<245))return null;
    const background=corners[0];
    if(corners.some(c=>!near(c,background,10)))return null;

    // A uniformly colored square/rectangle may be part of a team's mark.
    // Only treat a *neutral* edge as a possible flattened background.
    const rgb=background.slice(0,3);
    const neutral=Math.max(...rgb)-Math.min(...rgb)<=12;
    // Only infer light neutral mattes (white/gray export backgrounds).
    // Black is often part of the mark itself and must never be discarded.
    const light=(rgb[0]+rgb[1]+rgb[2])/3>=180;
    if(!neutral||!light)return null;

    const visited=new Uint8Array(pixels);
    const queue=new Uint32Array(pixels);
    let head=0,tail=0;

    function enqueue(i){
      if(visited[i])return;
      const k=i*4;
      if(data[k+3]<245)return;
      if(Math.abs(data[k]-rgb[0])>12||
         Math.abs(data[k+1]-rgb[1])>12||
         Math.abs(data[k+2]-rgb[2])>12)return;
      visited[i]=1;
      queue[tail++]=i;
    }
    // Flood from all four edges, not from enclosed background-color holes.
    for(let x=0;x<width;x++){enqueue(x);enqueue((height-1)*width+x);}
    for(let y=0;y<height;y++){enqueue(y*width);enqueue(y*width+width-1);}
    while(head<tail){
      const i=queue[head++],x=i%width,y=Math.floor(i/width);
      if(x>0)enqueue(i-1);
      if(x+1<width)enqueue(i+1);
      if(y>0)enqueue(i-width);
      if(y+1<height)enqueue(i+width);
    }
    // Safeguard: don't erase marks with a solid neutral edge or treat a few
    // compression pixels as a matte. Actual alpha takes precedence.
    if(tail<pixels*.12||tail>pixels*.95)return null;
    return visited;
  }

  function appearance(rgb){
    const {r,g,b}=rgb;
    const max=Math.max(r,g,b),min=Math.min(r,g,b),chroma=max-min;
    let hue=0;
    if(chroma){
      if(max===r)hue=((g-b)/chroma)%6;
      else if(max===g)hue=(b-r)/chroma+2;
      else hue=(r-g)/chroma+4;
      hue=(hue*60+360)%360;
    }
    return {hue,chroma,saturation:max?chroma/max:0,brightness:max,
      neutral:chroma<24||chroma/Math.max(1,max)<.105};
  }
  function hueDistance(a,b){
    const delta=Math.abs(a-b);
    return Math.min(delta,360-delta);
  }
  function sameFill(a,b,total){
    if(difference(a,b)<45)return true;
    const x=appearance(a),y=appearance(b);
    if(x.neutral||y.neutral)return false;
    const angle=hueDistance(x.hue,y.hue);
    if(angle>15)return false;
    // A small tint of a major fill is not another team color. Two large,
    // intentionally different blocks of the same hue can remain separate.
    const bothStrong=(a.support||0)/total>.025&&(b.support||0)/total>.025;
    const brightnessGap=Math.abs(x.brightness-y.brightness);
    return !(bothStrong&&brightnessGap>=65);
  }
  function extractFromPixels(data,width,height){
    if(!Number.isInteger(width)||!Number.isInteger(height)||width<1||height<1||
       !data||data.length!==width*height*4){
      throw new Error("Invalid original logo pixel data");
    }
    const cutout=matteMask(data,width,height);
    const histogram=new Map();
    const flatHistogram=new Map();
    let total=0;
    const record=(map,key,r,g,b,weight)=>{
      const entry=map.get(key)||{r:0,g:0,b:0,n:0};
      entry.r+=r*weight;entry.g+=g*weight;entry.b+=b*weight;entry.n+=weight;
      map.set(key,entry);
    };
    for(let i=0;i<width*height;i++){
      if(cutout&&cutout[i])continue;
      const j=i*4;
      const alpha=data[j+3];
      if(alpha<8)continue;
      const weight=alpha/255;
      const r=data[j],g=data[j+1],b=data[j+2];
      const qr=Math.min(255,Math.round(r/12)*12);
      const qg=Math.min(255,Math.round(g/12)*12);
      const qb=Math.min(255,Math.round(b/12)*12);
      const key=(qr<<16)|(qg<<8)|qb;
      record(histogram,key,r,g,b,weight);
      total+=weight;
      // Recognize real, solid fills from their spatially uniform interiors.
      // An antialiased pink border beside a red/white logo is not an interior
      // fill and must not become another pie slice, regardless of pixel count.
      const x=i%width,y=(i/width)|0;
      if(alpha<245||x===0||y===0||x===width-1||y===height-1)continue;
      let matching=0;
      for(let dy=-1;dy<=1;dy++){
        for(let dx=-1;dx<=1;dx++){
          if(dx===0&&dy===0)continue;
          const ni=i+dy*width+dx, k=ni*4;
          if((cutout&&cutout[ni])||data[k+3]<245)continue;
          if(Math.abs(r-data[k])<=7&&Math.abs(g-data[k+1])<=7&&
             Math.abs(b-data[k+2])<=7)matching++;
        }
      }
      if(matching>=6)record(flatHistogram,key,r,g,b,1);
    }
    if(total<12)throw new Error("Logo contains too few visible pixels");

    const toEntries=map=>[...map.values()].map(e=>({
      r:e.r/e.n,g:e.g/e.n,b:e.b/e.n,n:e.n,support:e.n
    })).sort((a,b)=>b.n-a.n);
    const interiors=toEntries(flatHistogram);
    const all=toEntries(histogram);
    const seeds=[];
    // Core regions are the source of meaningful colors. Keep tiny but
    // genuinely flat accent fills; suppress colors existing only on edges.
    for(const entry of interiors){
      if(entry.n<Math.max(3,total*.0008))break;
      if(!seeds.some(seed=>sameFill(seed,entry,total))){
        seeds.push({...entry});
      }
      if(seeds.length>=MAX_COLORS)break;
    }
    // Some logos use gradients or hairline marks with no broad flat interior.
    // Consider their high-frequency colors only when they don't belong to an
    // already discovered color family (e.g. pale red still belongs to red).
    for(const entry of all){
      if(entry.n<Math.max(8,total*.007))break;
      if(!seeds.some(seed=>sameFill(seed,entry,total))){
        seeds.push({...entry,support:0});
      }
      if(seeds.length>=MAX_COLORS)break;
    }
    if(!seeds.length)seeds.push({...all[0]});

    function nearestSeed(color,centers){
      const pixelKind=appearance(color);
      let selected=0,best=Infinity;
      for(let j=0;j<centers.length;j++){
        const seed=centers[j],seedKind=appearance(seed);
        let score=difference(color,seed);
        // An antialiased pink/red edge must be assigned to the actual red
        // fill, even if its pale RGB happens to be closer to white.
        if(!pixelKind.neutral&&!seedKind.neutral){
          const hueGap=hueDistance(pixelKind.hue,seedKind.hue);
          if(hueGap<=19)score*=.19;
          else if(hueGap<=30)score*=.45;
        }
        if(!pixelKind.neutral&&seedKind.neutral&&
           pixelKind.chroma>=24)score+=90;
        if(score<best){best=score;selected=j;}
      }
      return selected;
    }
    function allocate(centers){
      const weights=new Array(centers.length).fill(0);
      for(const entry of all){
        weights[nearestSeed(entry,centers)]+=entry.n;
      }
      return weights;
    }
    const trial=allocate(seeds);
    const significant=seeds.filter((_,i)=>trial[i]/total>=.003);
    if(!significant.length)significant.push(seeds[trial.indexOf(Math.max(...trial))]);
    const counts=allocate(significant);
    function hex(n){return Math.max(0,Math.min(255,Math.round(n))).toString(16).padStart(2,"0").toUpperCase();}
    return significant.map((c,i)=>({
      color:"#"+hex(c.r)+hex(c.g)+hex(c.b),
      value:counts[i]/total
    })).sort((a,b)=>b.value-a.value);
  }

  function extractFromImage(img){
    const width=img.naturalWidth,height=img.naturalHeight;
    if(!width||!height)throw new Error("Empty primary-logo image");
    const canvas=document.createElement("canvas");
    canvas.width=width;
    canvas.height=height;
    const ctx=canvas.getContext("2d",{willReadFrequently:true});
    if(!ctx)throw new Error("Canvas color analysis unavailable");
    // Crucially, don't resize, interpolate, or paint a backdrop before analysis.
    ctx.clearRect(0,0,width,height);
    ctx.drawImage(img,0,0);
    const data=ctx.getImageData(0,0,width,height).data;
    return extractFromPixels(data,width,height);
  }

  const api={extractFromImage,extractFromPixels};
  if(typeof module!=="undefined"&&module.exports)module.exports=api;
  if(root)root.SportsPiePalette=api;
})(typeof window!=="undefined"?window:null);
