/* SportsPie pixel-accurate logo palette analysis.
 * Uses original-resolution image pixels, alpha coverage, and (only when needed)
 * a connected-background cutout for images flattened onto a solid matte.
 * No guessed brand colors or resized/downsampled intermediary images.
 */
(function(root){
  "use strict";

  const MAX_COLORS = 12;
  const COLOR_MERGE_DISTANCE = 62;

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

  function extractFromPixels(data,width,height){
    if(!Number.isInteger(width)||!Number.isInteger(height)||width<1||height<1||
       !data||data.length!==width*height*4){
      throw new Error("Invalid original logo pixel data");
    }
    const cutout=matteMask(data,width,height);
    const histogram=new Map();
    let total=0;
    for(let i=0;i<width*height;i++){
      if(cutout&&cutout[i])continue;
      const j=i*4;
      const alpha=data[j+3];
      if(alpha<8)continue;
      const weight=alpha/255; // physical visible pixel area; translucent rims count fractionally
      const r=data[j],g=data[j+1],b=data[j+2];
      const qr=Math.min(255,Math.round(r/12)*12);
      const qg=Math.min(255,Math.round(g/12)*12);
      const qb=Math.min(255,Math.round(b/12)*12);
      const key=(qr<<16)|(qg<<8)|qb;
      const entry=histogram.get(key)||{r:0,g:0,b:0,n:0};
      entry.r+=r*weight;
      entry.g+=g*weight;
      entry.b+=b*weight;
      entry.n+=weight;
      histogram.set(key,entry);
      total+=weight;
    }
    if(total<12)throw new Error("Logo contains too few visible pixels");
    const colors=[...histogram.values()]
      .map(e=>({r:e.r/e.n,g:e.g/e.n,b:e.b/e.n,n:e.n}))
      .sort((a,b)=>b.n-a.n);
    const seeds=[];
    const minPeak=Math.max(1,total*.003);
    for(const color of colors){
      if(color.n<minPeak)break;
      if(!seeds.some(seed=>difference(color,seed)<COLOR_MERGE_DISTANCE)){
        seeds.push({r:color.r,g:color.g,b:color.b});
      }
      if(seeds.length>=MAX_COLORS)break;
    }
    if(!seeds.length)seeds.push({...colors[0]});
    function assign(centers){
      const weights=new Array(centers.length).fill(0);
      for(const entry of colors){
        let closest=0,minimum=Infinity;
        for(let j=0;j<centers.length;j++){
          const distance=difference(entry,centers[j]);
          if(distance<minimum){minimum=distance;closest=j;}
        }
        weights[closest]+=entry.n;
      }
      return weights;
    }
    const firstWeights=assign(seeds);
    const significant=seeds.filter((seed,i)=>firstWeights[i]/total>=.005);
    if(!significant.length)significant.push(seeds[firstWeights.indexOf(Math.max(...firstWeights))]);
    const counts=assign(significant);
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
