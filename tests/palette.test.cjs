const {test}=require("node:test");
const assert=require("node:assert/strict");
const {extractFromPixels}=require("../palette.js");

function canvas(width,height,fill=[0,0,0,0]){
  const arr=new Uint8ClampedArray(width*height*4);
  for(let y=0;y<height;y++)for(let x=0;x<width;x++)paint(arr,width,x,y,...fill);
  return arr;
}
function paint(data,width,x,y,r,g,b,a=255){
  const offset=(y*width+x)*4;
  data[offset]=r;data[offset+1]=g;data[offset+2]=b;data[offset+3]=a;
}
function summary(parts){
  return Object.fromEntries(parts.map(p=>[p.color,Math.round(p.value*1000)/10]));
}
function near(actual,expected,eps=.15){assert.ok(Math.abs(actual-expected)<=eps,
  "expected "+actual+" to be within "+eps+" of "+expected);}

test("transparent canvas pixels never enter the proportion denominator",()=>{
  const w=20,h=20,d=canvas(w,h);
  for(let y=3;y<13;y++)for(let x=2;x<12;x++)paint(d,w,x,y,0,0,0);
  for(let y=13;y<18;y++)for(let x=2;x<12;x++)paint(d,w,x,y,255,75,5);
  const out=extractFromPixels(d,w,h);
  assert.equal(out.length,2);
  const black=out.find(p=>p.color==="#000000");
  const orange=out.find(p=>p.color==="#FF4B05");
  assert.ok(black&&orange,JSON.stringify(out));
  near(black.value,2/3,.001);
  near(orange.value,1/3,.001);
});

test("flat light-gray background connected to the borders is excluded",()=>{
  const w=40,h=40,d=canvas(w,h,[230,230,230,255]);
  for(let y=10;y<30;y++)for(let x=10;x<30;x++)paint(d,w,x,y,0,0,0);
  for(let y=18;y<22;y++)for(let x=18;x<22;x++)paint(d,w,x,y,255,60,0);
  const out=extractFromPixels(d,w,h);
  assert.equal(out.length,2,JSON.stringify(out));
  assert.equal(out.some(p=>p.color==="#E6E6E6"),false);
  near(out.find(p=>p.color==="#000000").value,.96,.001);
  near(out.find(p=>p.color==="#FF3C00").value,.04,.001);
});

test("nearby anti-aliased shades do not create extra slices",()=>{
  const w=24,h=24,d=canvas(w,h);
  for(let y=2;y<22;y++)for(let x=2;x<22;x++)
    paint(d,w,x,y,(x+y)%3===0?8:0,(x+y)%3===0?8:0,(x+y)%3===0?8:0);
  for(let y=8;y<15;y++)for(let x=8;x<15;x++)
    paint(d,w,x,y,(x+y)%2===0?253:255,(x+y)%2===0?253:255,(x+y)%2===0?253:255);
  const out=extractFromPixels(d,w,h);
  assert.equal(out.length,2,JSON.stringify(out));
  near(out.find(p=>p.value>.5).value,(400-49)/400,.005);
});

test("white and genuinely silver remain distinct if present in the cutout",()=>{
  const w=50,h=50,d=canvas(w,h);
  for(let y=5;y<35;y++)for(let x=5;x<35;x++)paint(d,w,x,y,0,0,0);
  for(let y=35;y<45;y++)for(let x=5;x<25;x++)paint(d,w,x,y,255,255,255);
  for(let y=35;y<45;y++)for(let x=25;x<45;x++)paint(d,w,x,y,189,198,204);
  const out=extractFromPixels(d,w,h);
  assert.equal(out.length,3,JSON.stringify(out));
  near(out.reduce((s,p)=>s+p.value,0),1,.000001);
  assert.ok(out.some(p=>p.color==="#FFFFFF"));
  assert.ok(out.some(p=>p.color==="#BDC6CC"));
});

test("partially transparent pixels contribute fractionally",()=>{
  const w=10,h=10,d=canvas(w,h);
  for(let y=0;y<6;y++)for(let x=0;x<10;x++)paint(d,w,x,y,0,0,0);
  for(let y=6;y<10;y++)for(let x=0;x<10;x++)paint(d,w,x,y,255,0,0,128);
  const out=extractFromPixels(d,w,h);
  assert.equal(out.length,2,JSON.stringify(out));
  const expectedBlack=60/(60+40*128/255);
  near(out.find(p=>p.color==="#000000").value,expectedBlack,.001);
  near(out.reduce((s,p)=>s+p.value,0),1,.000001);
});

test("a legitimate solid neutral logo is not blindly erased",()=>{
  const w=20,h=20,d=canvas(w,h,[0,0,0,255]);
  // All-black artwork should remain a valid single slice.
  const out=extractFromPixels(d,w,h);
  assert.equal(out.length,1);
  near(out[0].value,1,.000001);
});


test("Red Wings style red and white image has TWO colors despite multiple pink edge shades",()=>{
  const w=160,h=110,d=canvas(w,h,[0,0,0,0]);
  // Large red field with solid white interior and an antialiased boundary.
  for(let y=10;y<100;y++)for(let x=10;x<150;x++)paint(d,w,x,y,233,7,43);
  for(let y=17;y<93;y++)for(let x=93;x<146;x++)paint(d,w,x,y,255,255,255);
  // Render an 8px gradient with distinct pinks, just as raster logos do.
  for(let y=17;y<93;y++)for(let t=0;t<8;t++){
    const f=(t+1)/9;
    paint(d,w,85+t,y,Math.round(233+22*f),Math.round(7+248*f),Math.round(43+212*f));
  }
  const out=extractFromPixels(d,w,h);
  assert.equal(out.length,2,"red/white artwork must not invent pink wedges: "+JSON.stringify(out));
  const red=out.find(p=>p.color==="#E9072B"),white=out.find(p=>p.color==="#FFFFFF");
  assert.ok(red&&white,JSON.stringify(out));
  near(out.reduce((sum,p)=>sum+p.value,0),1,.000001);
});

test("Red Wings style flattened light-gray image excludes matte AND pink raster edges",()=>{
  const w=120,h=120,d=canvas(w,h,[230,230,230,255]);
  for(let y=20;y<100;y++)for(let x=15;x<105;x++)paint(d,w,x,y,233,7,43);
  for(let y=33;y<87;y++)for(let x=65;x<100;x++)paint(d,w,x,y,255,255,255);
  for(let y=33;y<87;y++)for(let t=0;t<7;t++){
    const blend=(t+1)/8;
    paint(d,w,58+t,y,Math.round(233+22*blend),Math.round(7+248*blend),Math.round(43+212*blend));
  }
  const out=extractFromPixels(d,w,h);
  assert.equal(out.length,2,JSON.stringify(out));
  near(out.reduce((sum,p)=>sum+p.value,0),1,.000001);
});

test("large distinct orange and red fills remain different colors",()=>{
  const w=100,h=100,d=canvas(w,h);
  for(let y=10;y<90;y++)for(let x=10;x<50;x++)paint(d,w,x,y,220,20,40);
  for(let y=10;y<90;y++)for(let x=50;x<90;x++)paint(d,w,x,y,253,120,25);
  const out=extractFromPixels(d,w,h);
  assert.equal(out.length,2,JSON.stringify(out));
  near(out[0].value,.5,.001);
  near(out[1].value,.5,.001);
});
