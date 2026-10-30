# Música de E-01 ángulo B (Qualivo): pulso tenso en menor durante la fuga, golpes en cada ✕ y apertura a mayor cuando entra Qualivo.
import numpy as np, wave, os
SR=44100; DUR=float(os.environ.get('DUR','40')); N=int(SR*DUR); out=np.zeros((N,2))
BPM=112; b=60/BPM
def hz(m): return 440*2**((m-69)/12)
def add(s,st,pan=.5,g=1.):
    i=int(st*SR)
    if i>=N: return
    j=min(N,i+len(s)); s=s[:j-i]*g; out[i:j,0]+=s*(1-pan)*2; out[i:j,1]+=s*pan*2
def tt(d): return np.arange(int(d*SR))/SR
def kick():
    t=tt(.35); f=50+90*np.exp(-t*30); return np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-t*9)
def hat():
    t=tt(.05); return np.random.randn(len(t))*np.exp(-t*90)*.5
def pluck(m,d=.22):
    t=tt(d); s=np.sign(np.sin(2*np.pi*hz(m)*t))*.3+np.sin(2*np.pi*hz(m)*t)*.7; return s*np.exp(-t*14)
def pad(ms,d):
    t=tt(d); s=sum(np.sin(2*np.pi*hz(m)*t)+.3*np.sin(2*np.pi*hz(m)*1.004*t) for m in ms)/len(ms)
    e=np.minimum(1,t/.6)*np.minimum(1,(d-t)/.6); return s*e
def hit():
    t=tt(.6); f=hz(40)*np.exp(-t*3); s=np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-t*6)+np.random.randn(len(t))*np.exp(-t*25)*.3; return s
def riser(d):
    t=tt(d); s=np.random.randn(len(t)); s=np.convolve(s,np.ones(30)/30,'same'); return s*(t/d)**2
T_Q=float(os.environ.get('TQ','8.6'))  # entra Qualivo
# tramo 1: fuga (menor, A-F-C-G en menor: Am, F, Dm, E)
minor=[[57,60,64],[53,57,60],[50,53,57],[52,56,59]]
major=[[60,64,67],[55,59,62],[57,60,64],[53,57,60]]  # C G Am F
bar=4*b; x=0; k=0
while x<DUR:
    q=x>=T_Q; ch=(major if q else minor)[k%4]
    add(pad(ch,bar+.4),x,.5,.10 if q else .08)
    add(np.sin(2*np.pi*hz(ch[0]-24)*tt(bar))*np.minimum(1,tt(bar)/.05)*np.exp(-tt(bar)*.6),x,.5,.16)
    for s in range(8):
        st=x+s*b/2
        if st>=DUR: break
        arp=ch[[0,1,2,1][s%4]]+12
        add(pluck(arp+(12 if q and s%2 else 0)),st,.3+.4*(s%2),.10 if q else .07)
        add(hat(),st+b/4,.6,.08 if q else .05)
    for s in range(4):
        if x>=1.0 and x+s*b<DUR-1.2: add(kick(),x+s*b,.5,.32 if q else .26)
    x+=bar; k+=1
import json
for h in json.loads(os.environ.get('HITS','[2.6,4.1,5.6,7.1]')): add(hit(),h,.5,.35)
add(riser(1.4),T_Q-1.4,.5,.12)
add(pad([72,76,79,84],3.6),DUR-3.8,.5,.10)  # cierre luminoso
out=np.tanh(out*1.3); out/=np.abs(out).max()*1.1
fade=np.minimum(1,np.minimum(np.arange(N)/(SR*.3),(N-np.arange(N))/(SR*1.2)))
out*=fade[:,None]
with wave.open(os.environ.get('OUT','musica.wav'),'wb') as w:
    w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes((out*32767).astype(np.int16).tobytes())
