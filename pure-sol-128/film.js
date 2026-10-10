/* PURE SOL. Original Canvas choreography by actual GPT 6.1 Sol. */
(()=>{'use strict';
const C=document.getElementById('film'),g=C.getContext('2d',{alpha:false});
const W=1920,H=1080,B=60/128,D=37.5,N=192,TAU=Math.PI*2;
const K={ink:'#10110f',ivory:'#f2f0e6',lime:'#c8ff64',metal:'#a8aaa3'};
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v)),lerp=(a,b,t)=>a+(b-a)*t;
const ease=t=>1-Math.pow(1-clamp(t),4),smooth=t=>{t=clamp(t);return t*t*(3-2*t)},inout=t=>t<.5?8*t*t*t*t:1-8*Math.pow(1-t,4);
const pulse=(b,at,len=.6)=>{const p=(b-at)/len;return p<0||p>1?0:Math.sin(p*Math.PI)};
const envelope=(b,a,z)=>smooth((b-a)/.8)*smooth((z-b)/.65);
let glyphs=[],lineGlyphs=[],makeGlyphs=[],ready=false;
const poses=[
[0,'dot',1240,540,28,28,0],[4,'line',1160,570,1000,7,-.12],
[8,'diamond',960,510,740,700,-.18],[12,'ring',960,510,730,730,.18],
[16,'facet',960,520,810,760,-.15],[20,'phone',1000,540,372,372*149.6/71.5,-.08],
[24,'film',960,560,1280,660,.025],[28,'timeline',960,565,1320,650,0],
[32,'wave',960,575,1480,385,0],[36,'waveRing',960,560,860,610,.08],
[40,'graph',960,560,860,660,-.04],[44,'graph',960,560,790,740,.04],
[48,'browser',960,570,1300,670,-.025],[52,'route',960,570,1270,650,.025],
[56,'loop',960,550,1370,780,-.12],[60,'triangle',960,550,1160,760,.1],
[64,'cta',960,555,1190,400,0],[68,'heart',960,555,700,640,0],
[72,'ring',960,540,720,720,.1],[76,'logo',960,530,1060,380,0],[80,'logo',960,530,1060,380,0]
];
function target(kind,u,w,h,b){const a=u*TAU;let x,y;
if(kind==='dot'||kind==='ring'||kind==='waveRing'||kind==='logo'){let r=kind==='waveRing'?1+.12*Math.sin(a*12-b*1.1):1;x=Math.cos(a)*w*.5*r;y=Math.sin(a)*h*.5*r;}
else if(kind==='line'){x=Math.cos(a)*w*.5;y=Math.sin(a)*h*.5;}
else if(['phone','film','timeline','browser','route','cta'].includes(kind)){const n=kind==='phone'?.15:kind==='cta'?.36:.23;x=Math.sign(Math.cos(a))*Math.pow(Math.abs(Math.cos(a)),n)*w*.5;y=Math.sign(Math.sin(a))*Math.pow(Math.abs(Math.sin(a)),n)*h*.5;}
else if(kind==='diamond'){x=Math.cos(a)/(Math.abs(Math.cos(a))+Math.abs(Math.sin(a)))*w*.5;y=Math.sin(a)/(Math.abs(Math.cos(a))+Math.abs(Math.sin(a)))*h*.5;}
else if(kind==='facet'||kind==='triangle'){const edges=kind==='facet'?6:3;const z=(a+Math.PI/edges)%(TAU/edges)-Math.PI/edges;const r=Math.cos(Math.PI/edges)/Math.cos(z);x=Math.cos(a)*w*.5*r;y=Math.sin(a)*h*.5*r;}
else if(kind==='wave'){x=(u<.5?u*2:2-u*2)*w-w*.5;const q=(x/w+.5);const amp=(.25+.75*Math.pow(Math.sin(q*Math.PI),2));y=(u<.5?-1:1)*(8+Math.abs(Math.sin(q*Math.PI*11+b*.55))*h*.45*amp);}
else if(kind==='graph'){let r=1+.13*Math.cos(7*a);x=Math.cos(a)*w*.5*r;y=Math.sin(a)*h*.5*r;}
else if(kind==='loop'){x=Math.cos(a)*w*.5;y=Math.sin(2*a)*h*.5;}
else if(kind==='heart'){x=16*Math.pow(Math.sin(a),3)*w/32;y=-(13*Math.cos(a)-5*Math.cos(2*a)-2*Math.cos(3*a)-Math.cos(4*a))*h/32;}
else{x=Math.cos(a)*w/2;y=Math.sin(a)*h/2;}
return [x,y];}
function form(b){let i=Math.min(poses.length-2,Math.floor(Math.max(0,b)/4));let a=poses[i],z=poses[i+1];let phase=(b-a[0])/4;
// Anticipation holds useful poses, then elastic physical morphs on the next bar.
let m=inout(clamp((phase-.39)/.56));let cx=lerp(a[2],z[2],m),cy=lerp(a[3],z[3],m),rot=lerp(a[6],z[6],m);
const q=Math.sin(b*TAU/8)*.014;rot+=q;let pts=[];
for(let j=0;j<N;j++){let u=j/N,p=target(a[1],u,a[4],a[5],b),r=target(z[1],u,z[4],z[5],b);let x=lerp(p[0],r[0],m),y=lerp(p[1],r[1],m);pts.push([cx+x*Math.cos(rot)-y*Math.sin(rot),cy+x*Math.sin(rot)+y*Math.cos(rot)]);}
return{pts,cx,cy,rot,w:lerp(a[4],z[4],m),h:lerp(a[5],z[5],m),kind:a[1],next:z[1],m};}
function path(pts,closed=true){g.beginPath();g.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++)g.lineTo(pts[i][0],pts[i][1]);if(closed)g.closePath();}
function line(x1,y1,x2,y2,color,width=2,alpha=1){g.save();g.globalAlpha=alpha;g.strokeStyle=color;g.lineWidth=width;g.beginPath();g.moveTo(x1,y1);g.lineTo(x2,y2);g.stroke();g.restore();}
function round(x,y,w,h,r,fill,stroke){g.beginPath();g.roundRect(x,y,w,h,r);if(fill){g.fillStyle=fill;g.fill()}if(stroke){g.strokeStyle=stroke;g.lineWidth=2;g.stroke()}}
function circle(x,y,r,fill,stroke,width=2){g.beginPath();g.arc(x,y,r,0,TAU);if(fill){g.fillStyle=fill;g.fill()}if(stroke){g.strokeStyle=stroke;g.lineWidth=width;g.stroke()}}
function text(str,x,y,size=120,color=K.ivory,weight=700,align='left'){g.fillStyle=color;g.font=`${weight} ${size}px Pretendard`;g.textAlign=align;g.textBaseline='alphabetic';g.fillText(str,x,y)}
function background(b){g.fillStyle=K.ink;g.fillRect(0,0,W,H);let glow=g.createRadialGradient(1300+100*Math.sin(b/12),550,5,1300,550,850);glow.addColorStop(0,'#242820');glow.addColorStop(.5,'#181b16');glow.addColorStop(1,K.ink);g.fillStyle=glow;g.fillRect(0,0,W,H);
g.save();g.globalAlpha=.09;g.strokeStyle=K.ivory;g.lineWidth=1;g.beginPath();g.arc(1250,550,420+b*.8,-2.2,1.8);g.stroke();g.restore();line(100,95,1820,95,K.ivory,1,.14);line(100,985,1820,985,K.ivory,1,.14);
// Rhythm marks are compositional accents, never invented analytics.
for(let i=0;i<20;i++){const active=clamp(b/4-i);g.fillStyle=active>0?K.lime:'#34372f';g.fillRect(100+i*23,1020,active>0?14:5,3)}
}
function shell(f,b,alpha=1){g.save();g.globalAlpha=alpha;const sheen=g.createLinearGradient(f.cx-f.w/2,f.cy-f.h/2,f.cx+f.w/2,f.cy+f.h/2);sheen.addColorStop(0,K.ivory);sheen.addColorStop(.16,K.metal);sheen.addColorStop(.32,K.ivory);sheen.addColorStop(.61,'#64695d');sheen.addColorStop(.85,K.ivory);sheen.addColorStop(1,K.metal);
let fill=envelope(b,13.5,31);if(fill>.01){path(f.pts);g.globalAlpha=alpha*fill*.86;g.fillStyle=sheen;g.fill();g.globalAlpha=alpha;}
path(f.pts);g.strokeStyle=sheen;g.lineWidth=5.5;g.stroke();g.restore();}
function ringDepth(f,b){let a=envelope(b,9.8,18.4);if(!a)return;g.save();g.globalAlpha=a;g.translate(f.cx,f.cy);g.rotate(f.rot);for(let i=0;i<6;i++){const scale=1-i*.05;g.strokeStyle=i%2?K.lime:K.ivory;g.globalAlpha=a*(.5-i*.055);g.lineWidth=i?1.3:3;g.beginPath();g.ellipse(i*7,i*6,f.w*.5*scale,f.h*.5*scale,Math.sin(b*.2)*.35,0,TAU);g.stroke();}g.restore();}
function phone(f,b){const a=envelope(b,19,24.1);if(!a)return;g.save();g.globalAlpha=a;g.translate(f.cx,f.cy);g.rotate(f.rot);const w=372,h=w*149.6/71.5;const material=g.createLinearGradient(-w/2,0,w/2,0);material.addColorStop(0,'#7f8478');material.addColorStop(.04,K.ivory);material.addColorStop(.5,K.metal);material.addColorStop(.98,K.ivory);material.addColorStop(1,'#62675c');round(-w/2+14,-h/2+6,w,h,43,'#60665b');round(-w/2,-h/2,w,h,43,material);round(-w/2+8,-h/2+8,w-16,h-16,36,K.ink,'#4b5143');const sw=w-16,sh=h-16;
const inner=g.createLinearGradient(0,-h/2,0,h/2);inner.addColorStop(0,'#252c1e');inner.addColorStop(1,'#11150d');round(-sw/2+4,-sh/2+4,sw-8,sh-8,32,inner);round(-56,-h/2+18,112,25,15,K.ink);circle(45,-h/2+30,4,'#485442');text('9:41',-w/2+26,-h/2+41,15,K.ivory);text('AI 전문 채널',0,-175,27,K.metal,400,'center');text('IT뱅구',0,-89,71,K.ivory,700,'center');line(-110,-43,110,-43,K.lime,2,.6);text('아이디어를',0,12,29,K.ivory,400,'center');text('실제 영상으로',0,53,29,K.ivory,400,'center');const t=g.createLinearGradient(-150,80,150,255);t.addColorStop(0,K.lime);t.addColorStop(1,'#7ca837');round(-145,107,290,163,20,t);g.fillStyle=K.ink;g.beginPath();g.moveTo(-20,153);g.lineTo(30,188);g.lineTo(-20,223);g.closePath();g.fill();text('@ITbaeng9',0,321,23,K.metal,400,'center');round(-56,h/2-25,112,4,4,K.ivory);g.restore();}
function film(f,b){const a=envelope(b,24,31.5);if(!a)return;g.save();g.globalAlpha=a;g.translate(f.cx,f.cy);g.rotate(f.rot);const w=Math.min(f.w-20,1265),h=f.h-22;round(-w/2,-h/2,w,h,34,K.ink);g.strokeStyle='#78806e';g.lineWidth=1;round(-w/2+18,-h/2+18,w-36,h-110,22,null,'#78806e');
// A miniature version of the persistent moving form is the actual film artwork.
const phase=(b-24)*.8;g.save();g.translate(0,-30);g.rotate(phase*.18);for(let i=0;i<5;i++){g.strokeStyle=i%2?K.lime:K.ivory;g.globalAlpha=a*(1-i*.15);g.lineWidth=i?1:3;g.strokeRect(-112+i*11,-112+i*11,224-i*22,224-i*22)}g.restore();g.globalAlpha=a;g.fillStyle=K.lime;g.beginPath();g.moveTo(-18,-64);g.lineTo(32,-29);g.lineTo(-18,6);g.closePath();g.fill();const y=h/2-52;for(let i=0;i<12;i++){const x=-w/2+33+i*(w-70)/12;round(x,y,(w-85)/12,20,4,i<7?'#555c4c':'#292e24')}const play=clamp((b-24)/7);line(-w/2+30+play*(w-60),y-17,-w/2+30+play*(w-60),y+37,K.lime,3);text('AI 영상 제작',-w/2+32,-h/2+58,24,K.ivory,400);g.restore();}
function sound(f,b){let a=envelope(b,31.7,39.8);if(!a)return;g.save();g.globalAlpha=a;const wid=1320,h=320;for(let i=0;i<43;i++){const x=f.cx-wid/2+i*wid/42;const q=i/42;const amp=(.25+.75*Math.sin(q*Math.PI))*Math.abs(Math.sin(i*.79+b*2.1));const height=12+h*amp;g.strokeStyle=i<23?K.ivory:K.lime;g.lineWidth=5;g.lineCap='round';g.beginPath();g.moveTo(x,f.cy-height/2);g.lineTo(x,f.cy+height/2);g.stroke();}text('BGM · 효과음',f.cx,f.cy+365,31,K.metal,400,'center');g.restore();}
const graphNodes=Array.from({length:9},(_,i)=>{const a=i*TAU/9-.3;return [Math.cos(a)*(i%2?265:315),Math.sin(a)*(i%2?230:280)]});
function graph(f,b){const alpha=envelope(b,39.7,47.7);if(!alpha)return;g.save();g.globalAlpha=alpha;g.translate(f.cx,f.cy);const orbit=(b-40)*.045;g.rotate(orbit);for(let i=0;i<9;i++){const p=graphNodes[i],z=graphNodes[(i+3)%9];const draw=ease((b-40-i*.11)/1.1);line(p[0],p[1],lerp(p[0],z[0],draw),lerp(p[1],z[1],draw),K.metal,1.5,.55);line(0,0,p[0]*draw,p[1]*draw,K.lime,1.5,.65)}for(let i=0;i<9;i++){const p=graphNodes[i];circle(p[0],p[1],i%3?9:15,i%3?K.ivory:K.lime);circle(p[0],p[1],24,null,K.metal,1)}circle(0,0,58,K.ink,K.lime,3);g.rotate(-orbit);text('생각',0,12,30,K.ivory,700,'center');g.restore();text('옵시디언 기록',f.cx,f.cy+371,31,K.metal,400,'center');}
function browser(f,b){let a=envelope(b,47.7,55.7);if(!a)return;g.save();g.globalAlpha=a;g.translate(f.cx,f.cy);g.rotate(f.rot);const w=1240,h=625;round(-w/2,-h/2,w,h,31,K.ink,'#656d5b');line(-w/2,-h/2+64,w/2,-h/2+64,K.metal,1,.5);for(let i=0;i<3;i++)circle(-w/2+28+i*24,-h/2+31,5,i===0?K.lime:K.metal);round(-w/2+150,-h/2+18,410,29,12,'#282e21');text('Ego Lite',-w/2+170,-h/2+41,21,K.ivory,400);
const route=[[-300,57],[-150,57],[-150,-78],[71,-78],[71,105],[298,105]];const progress=clamp((b-49)/4.2)*(route.length-1);g.beginPath();g.moveTo(...route[0]);for(let i=1;i<route.length;i++){const t=clamp(progress-(i-1));if(t>0)g.lineTo(lerp(route[i-1][0],route[i][0],t),lerp(route[i-1][1],route[i][1],t))}g.strokeStyle=K.lime;g.lineWidth=5;g.lineCap='round';g.lineJoin='round';g.stroke();for(let i=0;i<3;i++){const p=route[i*2];round(p[0]-39,p[1]-39,78,78,18,'#252d1c',K.metal);text(['시작','실행','완료'][i],p[0],p[1]+9,22,K.ivory,700,'center')};const idx=Math.min(route.length-2,Math.floor(progress)),fract=progress-idx;circle(lerp(route[idx][0],route[idx+1][0],fract),lerp(route[idx][1],route[idx+1][1],fract),10,K.ivory);text('반복되는 작업에, 흐름을.',0,h/2-35,25,K.metal,400,'center');g.restore();}
function invitation(f,b){let a=envelope(b,55.7,63.7);if(!a)return;g.save();g.globalAlpha=a;g.translate(f.cx,f.cy);g.rotate(Math.sin(b*.18)*.1);for(let i=0;i<3;i++){g.strokeStyle=i?K.ivory:K.lime;g.lineWidth=i?1.5:4;g.beginPath();g.ellipse((i-1)*15,0,280-i*25,160+i*40,i*.6,0,TAU);g.stroke()}for(let i=0;i<3;i++){const ang=(b-56)*.4+i*TAU/3;circle(Math.cos(ang)*265,Math.sin(ang)*185,11,i?K.ivory:K.lime)}g.restore();}
function cta(f,b){let a=envelope(b,63.6,71.65);if(!a)return;g.save();g.globalAlpha=a;g.translate(f.cx,f.cy);const click=pulse(b,65,.65)+pulse(b,67,.65);g.scale(1-click*.035,1-click*.035);round(-390,-112,780,224,60,K.lime);text(b>=65?'구독 중':'구독',-100,26,75,K.ink,700,'center');line(80,-62,80,62,K.ink,1,.35);text('좋아요',228,23,56,K.ink,700,'center');if(b>=65){let v=ease((b-65)/.35);g.beginPath();g.moveTo(-278,-4);g.lineTo(-251,22);g.lineTo(-251+45*v,22-55*v);g.strokeStyle=K.ink;g.lineWidth=8;g.lineCap='round';g.lineJoin='round';g.stroke()}else{g.fillStyle=K.ink;g.beginPath();g.moveTo(-272,-29);g.lineTo(-221,2);g.lineTo(-272,34);g.closePath();g.fill()}
const at=b>=67?67:65,spread=clamp((b-at)/.65);if(b>=65&&spread<1){g.globalAlpha=a*(1-spread);circle(at===65?-130:223,0,80+110*spread,null,K.ivory,3)}g.restore();if(b>=67){g.save();g.globalAlpha=a;circle(f.cx+223,f.cy+170,12,K.lime);text('함께해 주세요',f.cx,f.cy+200,30,K.ivory,400,'center');g.restore()}}
function middleText(str,x,y,size,color=K.ivory){g.fillStyle=color;g.font=`700 ${size}px Pretendard`;g.textAlign='center';g.textBaseline='middle';g.fillText(str,x,y);}
function sampleGlyphs(word='IT뱅구',font=248){const o=document.createElement('canvas');o.width=1200;o.height=390;const c=o.getContext('2d');c.font=`700 ${font}px Pretendard`;c.textAlign='center';c.textBaseline='middle';c.fillStyle='#fff';c.fillText(word,600,197);const data=c.getImageData(0,0,1200,390).data;const out=[];for(let y=30;y<363;y+=7)for(let x=80;x<1120;x+=7)if(data[(y*1200+x)*4+3]>120)out.push([x-600,y-197]);return out;}
function ending(b){let a=envelope(b,71.4,81);if(!a)return;const settle=ease((b-72.2)/3.45),tail=clamp((b-75.2)/1.15);g.save();g.globalAlpha=a;for(let i=0;i<glyphs.length;i++){const p=glyphs[i],u=i/glyphs.length,ang=u*TAU;const r=330+75*Math.sin(i*1.71);const spin=(1-settle)*1.2;const sx=960+Math.cos(ang+spin)*r,sy=520+Math.sin(ang+spin)*r*.85;const x=lerp(sx,960+p[0],settle),y=lerp(sy,480+p[1],settle);g.fillStyle=i%7===0?K.lime:K.ivory;const size=lerp(2.5,5.9,settle)*(1-tail);if(size>.1)g.fillRect(x-size/2,y-size/2,size,size)}g.globalAlpha=a*tail;middleText('IT뱅구',960,480,248);g.globalAlpha=a*ease((b-74.6)/1.2);text('AI 전문 채널',960,305,36,K.metal,400,'center');text('함께 배우고, 직접 만듭니다.',960,679,44,K.ivory,400,'center');g.globalAlpha=a*ease((b-76)/.7);line(770,754,1150,754,K.lime,3);text('@ITbaeng9',960,823,32,K.metal,400,'center');g.restore();}

function facetedMass(f,b){const a=envelope(b,7.8,19.8);if(!a)return;g.save();g.globalAlpha=a*.3;for(let i=0;i<12;i++){const p=f.pts[i*16],z=f.pts[(i*16+16)%N];const shade=g.createLinearGradient(f.cx,f.cy,p[0],p[1]);shade.addColorStop(0,i%3===0?'#c8ff6410':'#f2f0e605');shade.addColorStop(1,i%3===0?'#c8ff64bb':'#f2f0e6aa');g.fillStyle=shade;g.beginPath();g.moveTo(f.cx,f.cy);g.lineTo(...p);g.lineTo(...z);g.closePath();g.fill();}g.restore();}
function geometryType(b,start,end,targets,label,size,y){const a=envelope(b,start-.35,end+.45);if(!a)return;const m=ease((b-start)/1.15),tail=smooth((b-(start+1.15))/.45),reverse=smooth((b-(end-.4))/.75),source=form(start-.2);g.save();g.globalAlpha=a;for(let i=0;i<targets.length;i++){const p=targets[i],r=source.pts[Math.floor(i/targets.length*N)];const spin=(1-m)*Math.sin(i*.2)*28;const x=lerp(r[0],960+p[0],m),yy=lerp(r[1],y+p[1],m);const sz=lerp(3.5,5.8,m)*(1-tail);g.fillStyle=i%5===0?K.lime:K.ivory;g.fillRect(x+spin-sz/2,yy-sz/2,sz,sz);}g.globalAlpha=a*tail;middleText(label,960,y,size);g.restore();}
function middleHook(b){const a=envelope(b,39.75,42.2);if(!a)return;g.save();g.globalAlpha=a;const r=ease((b-40)/.4);circle(960,560,60*(1-pulse(b,40,.6)*.12),K.lime);g.strokeStyle=K.ink;g.lineWidth=7;g.lineCap='round';g.beginPath();g.moveTo(935,560);g.lineTo(955,580);g.lineTo(955+37*r,580-48*r);g.stroke();text('구독 · 좋아요',960,686,32,K.ivory,700,'center');g.restore();}
const titles=[
['한 점의','상상.','모든 시작은, 작은 아이디어에서.'],['선을','넘어.','생각에 움직임을 더합니다.'],['형태가','되고.','상상을, 손에 잡히는 장면으로.'],['영상이','되고.','AI 영상 제작'],['소리로','완성.','BGM · 효과음'],['기록을','연결.','옵시디언으로 생각을 잇고'],['반복을','자동화.','Ego Lite로 흐름을 만들고'],['함께 배우고,','직접 만들자.','AI를 실제 콘텐츠와 작업으로.'],['다음 상상도,','함께.','구독과 좋아요로 이어 주세요.']
];

function typography(b){const i=Math.min(9,Math.floor(b/8));if(i===9)return;const loc=b-i*8;const entry=ease(loc/.72),out=1-smooth((loc-7.4)/.55);g.save();g.globalAlpha=entry*out;const shift=(1-entry)*60;
if(i===0){text('한 점의',100,399+shift,146);text('상상.',100,574+shift,146);text(titles[0][2],100,667+shift,31,K.metal,400);}
else if(i===1){text('경계를 넓히는 움직임',100,164+shift,30,K.metal,400);if(b<9.5||b>11.75)text('선을 넘어.',960,916+shift,112,K.ivory,700,'center');}
else if(i===2){text('형태가',100,347+shift,136);text('되고.',1820,878+shift,136,K.ivory,700,'right');text('상상을, 손에 잡히는 장면으로.',100,923+shift,31,K.metal,400);}
else if(i===3){text('영상이 되다.',960,211+shift,106,K.ivory,700,'center');text('AI 영상 제작',100,949+shift,32,K.metal,400);}
else if(i===4){text('소리로 완성.',960,240+shift,132,K.ivory,700,'center');}
else if(i===5){text('기록을 연결.',960,214+shift,128,K.ivory,700,'center');}
else if(i===6){text('반복을 자동화.',960,211+shift,120,K.ivory,700,'center');}
else if(i===7){text('함께 배우고,',960,350+shift,132,K.ivory,700,'center');if(b<57.4)text('직접 만들자.',960,652+shift,156,K.ivory,700,'center');text('AI를 실제 콘텐츠와 작업으로.',960,894+shift,34,K.metal,400,'center');}
else if(i===8){text('다음 상상도, 함께.',960,256+shift,110,K.ivory,700,'center');text('구독과 좋아요로 이어 주세요.',960,900+shift,34,K.metal,400,'center');}
g.restore();}
function render(t){t=clamp(Number(t)||0,0,D);const b=t/B;g.reset();g.setTransform(1,0,0,1,0,0);background(b);
// Deterministic geometric shutter trails. Never blur readable text.
if(b<72){for(let k=3;k>=1;k--){const past=form(Math.max(0,b-k*.045));g.save();g.globalAlpha=.065*(4-k);path(past.pts);g.strokeStyle=K.lime;g.lineWidth=1.2;g.stroke();g.restore()}}
let f=form(b);g.save();
// A controlled bar-anticipation camera + kick impact: pure authored beat math.
const kick=pulse(b,Math.floor(b),.24),barphase=b%4;const whip=pulse(barphase,3.63,.37);const zoom=1+.023*kick+.07*whip;g.translate(960,540);g.scale(zoom,zoom);g.translate(-960,-540);g.translate(whip*(Math.floor(b/4)%2?18:-18),-kick*3);
if(b<74){let fade=1-smooth((b-71.8)/1.55);const typeDip=1-envelope(b,9.45,12.3)*.9;const makeDip=1-envelope(b,57.5,61.4)*.8;shell(f,b,fade*typeDip*makeDip);facetedMass(f,b);ringDepth(f,b);phone(f,b);film(f,b);sound(f,b);graph(f,b);browser(f,b);if(b<57.5||b>61.4)invitation(f,b);cta(f,b)}g.restore();
// The lime point stays attached to the homologous contour throughout the film.
if(b<72){const u=((b*.12)%1+1)%1,idx=Math.floor(u*N),p=f.pts[idx];g.save();g.shadowColor=K.lime;g.shadowBlur=18;circle(960+(p[0]-960)*zoom+whip*(Math.floor(b/4)%2?18:-18),540+(p[1]-540)*zoom-kick*3,6+3*pulse(b,Math.floor(b),.35),K.lime);g.restore()}
if(b<4){const intro=ease((b-.1)/.7);g.save();g.globalAlpha=intro;circle(1240,540,14+4*pulse(b,1,.5),K.ivory);g.restore()}
typography(b);geometryType(b,9.6,11.5,lineGlyphs,'선을 넘어',172,505);geometryType(b,57.7,61.35,makeGlyphs,'직접 만들자.',156,595);middleHook(b);ending(b);
text('IT뱅구',100,64,30,K.ivory);text('IMAGINE / MAKE / CONNECT',1820,64,26,K.metal,400,'right');if(b<72)text(['IDEA','MOTION','FORM','FILM','SOUND','KNOWLEDGE','AUTOMATION','TOGETHER','SUBSCRIBE'][Math.min(8,Math.floor(b/8))],1820,1034,26,K.metal,400,'right');
window.filmDebug={time:t,beat:b,bar:Math.floor(b/4)+1,section:Math.min(9,Math.floor(b/8)),form:f.kind,nextForm:f.next,morph:f.m,points:N,glyphParticles:glyphs.length};return window.filmDebug;}
window.renderFrame=render;window.FILM={duration:D,bpm:128,fps:60,width:W,height:H};
window.filmReady=Promise.all([document.fonts.load('700 248px Pretendard'),document.fonts.load('400 36px Pretendard')]).then(()=>document.fonts.ready).then(()=>{glyphs=sampleGlyphs();lineGlyphs=sampleGlyphs('선을 넘어',172);makeGlyphs=sampleGlyphs('직접 만들자.',156);ready=true;render(0);document.dispatchEvent(new Event('filmready'));return true});
})();
