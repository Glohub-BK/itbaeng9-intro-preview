/* Reused catalog primitives: device-frame-stage geometry, mesh-gradient-bg radial drift,
   shimmer-sweep mask. Unified into one paused, deterministic timeline. */
window.createIntroTimeline=function(){
  'use strict';
  const stage=document.getElementById('stage');
  const tl=gsap.timeline({paused:true});
  tl.fromTo('.mesh',{'--hf-x1':'26%','--hf-y1':'48%','--hf-x2':'70%','--hf-y2':'25%','--hf-x3':'69%','--hf-y3':'85%'},{'--hf-x1':'33%','--hf-y1':'41%','--hf-x2':'63%','--hf-y2':'34%','--hf-x3':'61%','--hf-y3':'72%',duration:8,ease:'sine.inOut'},0);
  // Aurora-drift's oversize blurred fields, with two restrained flowing light ribbons.
  tl.fromTo('.aurora-a',{x:-70,y:70,scale:.96},{x:160,y:-110,scale:1.1,duration:8,ease:'sine.inOut'},0);
  tl.fromTo('.aurora-b',{x:90,y:-60,scale:1.06},{x:-170,y:150,scale:.96,duration:8,ease:'sine.inOut'},0);
  tl.fromTo('.light-ribbon-a',{x:-260,y:140,scaleX:.84},{x:260,y:-110,scaleX:1.12,duration:8,ease:'sine.inOut'},0);
  tl.fromTo('.light-ribbon-b',{x:190,y:-110,scaleX:1.1},{x:-220,y:130,scaleX:.88,duration:8,ease:'sine.inOut'},0);
  tl.fromTo('.rim-light',{'--rim-angle':'-35deg',opacity:.38},{'--rim-angle':'285deg',opacity:.78,duration:8,ease:'sine.inOut'},0);
  tl.fromTo('.device-frame',{opacity:0,y:88,scale:.96,rotationX:6,rotationY:-14,rotationZ:-10},{opacity:1,y:0,scale:1,rotationX:3,rotationY:-8,rotationZ:-5,duration:1.12,ease:'power3.out'},.08);
  tl.fromTo('.phone-shadow',{opacity:0,scale:.75},{opacity:.9,scale:1,duration:1.1,ease:'power3.out'},.12);
  tl.fromTo('.frame-header',{opacity:0},{opacity:1,duration:.8,ease:'power2.out'},.25);
  tl.fromTo('.side-note',{opacity:0,y:12},{opacity:1,y:0,duration:.8,ease:'power3.out'},1.3);
  tl.fromTo('.frame-footer',{opacity:0},{opacity:1,duration:.7,ease:'power2.out'},1.7);
  tl.fromTo('.channel-mark',{opacity:0,y:18,scale:.92},{opacity:1,y:0,scale:1,duration:.7,ease:'power3.out'},.98);
  tl.fromTo('.descriptor',{opacity:0,y:18},{opacity:1,y:0,duration:.65,ease:'power3.out'},1.13);
  tl.fromTo('.channel-name',{opacity:0,y:20},{opacity:1,y:0,duration:.68,ease:'power3.out'},1.27);
  tl.fromTo('.channel-support',{opacity:0,y:12},{opacity:1,y:0,duration:.6,ease:'power3.out'},1.5);
  tl.fromTo('.channel-handle',{opacity:0,y:10},{opacity:1,y:0,duration:.6,ease:'power3.out'},1.63);
  tl.fromTo('.subscribe-button',{opacity:0,y:16,scale:.97},{opacity:1,y:0,scale:1,duration:.65,ease:'power3.out'},1.82);
  tl.fromTo('.like-button',{opacity:0,y:16,scale:.97},{opacity:1,y:0,scale:1,duration:.65,ease:'power3.out'},1.94);
  tl.fromTo('.phone-home',{opacity:0},{opacity:1,duration:.6,ease:'power2.out'},1.8);
  tl.fromTo('.subscribe-button',{scale:1},{scale:.95,duration:.12,ease:'power1.in',immediateRender:false},3.15);
  tl.to('.subscribe-button',{scale:1,duration:.38,ease:'power3.out'},3.27);
  tl.fromTo('.subscribe-touch',{opacity:0,scale:.45},{opacity:.6,scale:.75,duration:.08,ease:'power2.out'},3.15);
  tl.to('.subscribe-touch',{opacity:0,scale:1.4,duration:.36,ease:'power2.out'},3.23);
  tl.fromTo('.subscribe-label',{opacity:1,y:0},{opacity:0,y:-9,duration:.17,ease:'power2.in',immediateRender:false},3.27);
  tl.fromTo('.subscribed-label',{opacity:0,y:10},{opacity:1,y:0,duration:.23,ease:'power3.out'},3.39);
  tl.fromTo('.play-icon',{opacity:1},{opacity:0,duration:.16,immediateRender:false},3.27);
  tl.fromTo('.check-icon',{opacity:0,scale:.8},{opacity:1,scale:1,duration:.25,ease:'power3.out'},3.4);
  tl.fromTo('.like-button',{scale:1},{scale:.95,duration:.12,ease:'power1.in',immediateRender:false},4.75);
  tl.to('.like-button',{scale:1,duration:.38,ease:'power3.out'},4.87);
  tl.fromTo('.like-touch',{opacity:0,scale:.45},{opacity:.6,scale:.75,duration:.08,ease:'power2.out'},4.75);
  tl.to('.like-touch',{opacity:0,scale:1.4,duration:.36,ease:'power2.out'},4.83);
  tl.fromTo('.like-button',{color:'#eae6f5',backgroundColor:'#f7f3ff08',borderColor:'#ffffff2b'},{color:'#a7f0f2',backgroundColor:'#7be6ef12',borderColor:'#7be6ef55',duration:.35,ease:'power2.out',immediateRender:false},4.87);
  tl.fromTo('.phone-float',{y:0},{y:-3,duration:2.1,ease:'sine.inOut'},5.9);
  tl.fromTo('.shimmer-mask',{'--shimmer-pos':'-20%'},{'--shimmer-pos':'120%',duration:.65,ease:'power2.inOut'},6.05);
  return tl;
};
