# -*- coding: utf-8 -*-
"""Original electropop/house composition. GPT 6.1 Sol, 128 BPM, 20 bars.
No external samples. NumPy oscillators, spectral noise, authored arrangement.
"""
from pathlib import Path
import json, wave
import numpy as np
SR=48000
B=60/128
D=37.5
rng=np.random.default_rng(128061)
mix=np.zeros((int(D*SR),2),np.float64)
def add(x,at,gain=1,pan=0):
    start=int(round(at*SR)); x=np.asarray(x)*gain
    if start<0:x=x[-start:];start=0
    count=min(len(x),len(mix)-start)
    if count<=0:return
    p=np.array([np.cos((pan+1)*np.pi/4),np.sin((pan+1)*np.pi/4)])
    mix[start:start+count]+=x[:count,None]*p[None,:]
def freq(m):return 440*2**((m-69)/12)
def clock(d):return np.arange(int(d*SR))/SR
def kick():
    t=clock(.38);f=47+105*np.exp(-t*36);phase=np.cumsum(f)*2*np.pi/SR
    sub=np.sin(phase)*np.exp(-t*11)
    knock=np.sin(2*np.pi*165*t)*np.exp(-t*100)*.16
    click=rng.normal(0,1,len(t))*np.exp(-t*230)*.035
    return np.tanh((sub+knock+click)*1.3)*.63
def spectral_noise(d,lo,hi):
    n=int(d*SR);noise=rng.normal(0,1,n);spec=np.fft.rfft(noise);hz=np.fft.rfftfreq(n,1/SR)
    weight=np.clip((hz-lo)/max(100,lo*.25),0,1)*np.clip((hi-hz)/max(100,hi*.2),0,1)
    out=np.fft.irfft(spec*weight,n=n);return out/(np.std(out)+1e-9)
def hat(opened=False):
    d=.24 if opened else .075;t=clock(d);n=spectral_noise(d,4800,14500)
    e=np.exp(-t*(18 if opened else 65));return n*e*.11

def clap():
    t=clock(.21);n=spectral_noise(.21,900,10800);e=np.zeros_like(t)
    for offset in [0,.012,.024]:e+=np.exp(-np.maximum(0,t-offset)*54)*(t>=offset)
    e+=.3*np.exp(-t*17);tone=np.sin(2*np.pi*180*t)*np.exp(-t*38)
    return n*e*.078+tone*.09

def bass(note,d=.29):
    t=clock(d);f=freq(note);x=np.sin(2*np.pi*f*t)+.20*np.sin(2*np.pi*2*f*t)+.055*np.sin(2*np.pi*3*f*t)
    env=(1-np.exp(-t*150))*np.exp(-t*8)*np.minimum(1,np.maximum(0,(d-t)*50))
    return x*env*.35

def pluck(note,d=.55):
    t=clock(d);f=freq(note);env=(1-np.exp(-t*750))*np.exp(-t*7.5)
    x=(np.sin(2*np.pi*f*t)+.23*np.sin(2*np.pi*f*2*t+.1)+.08*np.sin(2*np.pi*f*3*t))
    return x*env*.16

def chord(notes,d):
    t=clock(d);x=np.zeros_like(t)
    for j,n in enumerate(notes):
        f=freq(n);x+=(np.sin(2*np.pi*f*t)+np.sin(2*np.pi*f*1.0018*t+j*.4)+.18*np.sin(2*np.pi*2*f*t))/2.18
    env=(1-np.exp(-t*12))*np.minimum(1,np.maximum(0,(d-t)*4))
    # Authored eight-step sidechain envelope creates house breathing.
    beatphase=(t/B)%1;duck=.34+.66*(1-np.exp(-beatphase*7))
    return x/len(notes)*env*duck*.29

progression=[(45,[57,60,64,67]),(41,[53,57,60,64]),(48,[55,60,64,67]),(43,[55,59,62,67])]
arp=[0,2,1,3,2,1,3,2,0,2,3,1,2,3,1,2]
for bar in range(20):
    start=bar*4*B;root,notes=progression[bar%4]
    if bar==19:root,notes=45,[57,60,64,69]
    add(chord(notes,4*B+.2),start,.85,-.22)
    add(chord([n+12 for n in notes[:3]],4*B+.15),start,.20,.30)
    for k in range(4):
        beat=bar*4+k
        # Two beats of anticipation; an intentional one-beat breath before beat40.
        if beat>=2 and beat!=39 and beat<78:add(kick(),beat*B,1)
        if beat>=4 and beat!=39 and beat<78:
            add(bass(root-12 if root>43 else root,.29), (beat+.5)*B,.88)
            if bar%4==3 and k==3:add(bass(root+7,.17),(beat+.75)*B,.42)
        if k in [1,3] and beat>=4 and beat!=39 and beat<78:add(clap(),beat*B,.90)
        if beat>=4 and beat<78:
            add(hat(False),(beat+.5)*B,.72,.22)
            if bar>=2 and beat!=39:add(hat(False),(beat+.0)*B,.34,-.28)
            if bar%4>=2 and beat!=39:add(hat(False),(beat+.75)*B,.32,.45)
            if bar%4==3 and k==3:add(hat(True),(beat+.5)*B,.5,.34)
    # Sixteenth-note plucks, alternate octaves and rhythm holes every fourbars.
    for step in range(16):
        absolute=bar*4+step/4
        if absolute>=78 or 39<=absolute<40:continue
        if bar<2 and step%2:continue
        if bar%4==1 and step in [3,7,11,15]:continue
        note=notes[arp[step]%4]+12+(12 if bar%4==2 and step%4==3 else 0)
        x=pluck(note)
        at=absolute*B;gain=.66 if step%4 else .90
        add(x,at,gain,.28 if step%2 else -.28)
        # Stereo dotted delay, lower and darker octave avoids piercing repeats.
        add(pluck(note-12,.42),at+.75*B,gain*.19,-.42 if step%2 else .42)
    if bar%4==3 and bar<19:
        t=clock(.85);r=spectral_noise(.85,1600,8000)*(t/.85)**1.8*np.minimum(1,(.85-t)*16)*.12
        add(r,start+3*B,.6,.15)

# Major contour transformations: musical air / restrained low impact, exactly onbars.
for beat in range(4,77,4):
    t=clock(.29);n=spectral_noise(.29,650,8500);e=np.sin(np.pi*t/.29)**2
    add(n*e*.055,beat*B-.19,.7,-.18 if beat%8 else .18)
    low=np.sin(2*np.pi*(66*t-42*t*t))*np.exp(-t*18)*.08
    add(low,beat*B,.8)
# Central drop arrives with a soft confirmation mark rather than a harsh beep.
for beat in [40,65,67]:
    t=clock(.10);x=(np.sin(2*np.pi*850*t)*np.exp(-t*85)+.4*np.sin(2*np.pi*1230*t)*np.exp(-t*110))*.09
    add(x,beat*B,.9,0)
# Last chord is the short intentional musical resolution.
add(chord([57,60,64,69],1.68),76*B,.85)
add(pluck(81,.8),76*B,.8,.05)
add(pluck(76,.8),76.5*B,.5,-.1)
add(pluck(69,1.0),77*B,.6,.1)
# Gentle saturation/headroom; no AGC oscillation and no clipped PCM.
mix=np.tanh(mix*1.08)
fadein=np.minimum(1,np.arange(len(mix))/(SR*.035));fadeout=np.minimum(1,(len(mix)-1-np.arange(len(mix)))/(SR*.3))
mix*=fadein[:,None]*np.maximum(0,fadeout[:,None]);peak=np.max(np.abs(mix));mix*=.87/max(peak,1e-9)
p=Path(__file__).parent/'audio';p.mkdir(exist_ok=True)
with wave.open(str(p/'master.wav'),'wb') as f:
    f.setnchannels(2);f.setsampwidth(2);f.setframerate(SR);f.writeframes((mix*32767).astype('<i2').tobytes())
info={'author':'Actual GPT 6.1 Sol','method':'Original programmatic musical composition; NumPy synthesis, no samples or external generation','bpm':128,'duration':D,'sampleRate':SR,'channels':2,'peak':float(np.max(np.abs(mix))),'rms':float(np.sqrt(np.mean(mix**2))),'seed':128061,'ctaClickBeats':[40,65,67]}
(p/'composition-meta.json').write_text(json.dumps(info,indent=2));print(json.dumps(info))
