import numpy as np, wave
SR=44100; DUR=16.0; N=int(SR*DUR); t=np.arange(N)/SR
out=np.zeros((N,2))
bpm=100; beat=60/bpm; bar=4*beat
def note(f): return 440*2**((f-69)/12)
def env(n,a,d,s,r,sus):
    e=np.zeros(n); A=int(a*SR); D=int(d*SR); R=int(r*SR); S=max(0,int(sus*SR)-A-D)
    seg=[np.linspace(0,1,A,False),np.linspace(1,s,D,False),np.full(S,s),np.linspace(s,0,R)]
    x=np.concatenate(seg)[:n]; e[:len(x)]=x; return e
def add(sig,start,pan=0.5,gain=1.0):
    i=int(start*SR); j=min(N,i+len(sig)); 
    if i>=N: return
    s=sig[:j-i]*gain; out[i:j,0]+=s*(1-pan); out[i:j,1]+=s*pan
# Chords: Fmaj7 - Am7 - Dm9 - Bbmaj7 (warm), 1 bar each, loop
chords=[[53,57,60,64],[57,60,64,67],[50,57,60,64],[46,53,57,62]]
for b in range(int(DUR/bar)+1):
    ch=chords[b%4]; st=b*bar
    n=int(bar*SR*1.1); tt=np.arange(n)/SR
    pad=sum(np.sin(2*np.pi*note(m)*tt)*0.5+np.sin(2*np.pi*note(m)*2.003*tt)*0.12 for m in ch)
    add(pad*env(n,0.4,0.6,0.7,0.6,bar*1.05)*0.05,st,0.5)
    # bass
    nb=int(bar*SR); tb=np.arange(nb)/SR; bf=note(ch[0]-12)
    bass=np.sin(2*np.pi*bf*tb)+0.3*np.sin(2*np.pi*2*bf*tb)
    for k in range(2): add((bass*env(nb,0.01,0.2,0.6,0.3,beat*1.8))[:int(beat*2*SR)]*0.12,st+k*2*beat,0.5)
    # arpeggio pluck (8ths), starts bar 1
    if b>=1 or True:
        seq=[ch[0]+12,ch[2]+12,ch[1]+12,ch[3]+12,ch[2]+12,ch[1]+12,ch[3]+12,ch[2]+24]
        for k,m in enumerate(seq):
            n2=int(0.5*SR); t2=np.arange(n2)/SR; f=note(m)
            pl=(np.sin(2*np.pi*f*t2)+0.4*np.sin(2*np.pi*2*f*t2))*np.exp(-t2*7)
            add(pl*0.05,st+k*beat/2,0.35 if k%2 else 0.65)
# drums from second 1.2 (after hook settles)
rng=np.random.default_rng(1)
nb_=int(DUR/beat)+1
for k in range(nb_):
    st=k*beat
    if st<1.2 or st>15.4: continue
    n=int(0.35*SR); tt=np.arange(n)/SR
    kick=np.sin(2*np.pi*(55+70*np.exp(-tt*30))*tt)*np.exp(-tt*9)
    add(kick*0.32,st,0.5)
    hn=int(0.08*SR); hat=rng.standard_normal(hn)*np.exp(-np.arange(hn)/SR*60)
    hat=np.diff(np.concatenate([[0],hat]))
    add(hat*0.05,st+beat/2,0.6)
    if k%4 in (1,3):
        sn=int(0.2*SR); clap=rng.standard_normal(sn)*np.exp(-np.arange(sn)/SR*25)
        add(clap*0.05,st,0.45)
# whoosh riser at wall opening (2.4-3.8) and at transformation (6.6-7.6)
def whoosh(d,peak):
    n=int(d*SR); x=rng.standard_normal(n); 
    # crude band sweep via moving-average of varying length
    e=np.sin(np.linspace(0,np.pi,n))**2
    k=np.cumsum(x); y=np.zeros(n)
    w=np.linspace(60,6,n).astype(int)
    for i in range(n): 
        a=max(0,i-w[i]); y[i]=(k[i]-k[a])/max(1,i-a)
    return y*e*peak
add(whoosh(1.4,0.35),2.4,0.5); add(whoosh(1.0,0.28),6.5,0.5)
# soft chime at button (13.4)
n=int(1.2*SR); tt=np.arange(n)/SR
ch=sum(np.sin(2*np.pi*note(m)*tt) for m in (84,88,91))*np.exp(-tt*4)
add(ch*0.06,13.4,0.5)
# master: fades
fade=np.ones(N); fi=int(0.3*SR); fo=int(1.2*SR)
fade[:fi]=np.linspace(0,1,fi); fade[-fo:]=np.linspace(1,0,fo)
out*=fade[:,None]
out/=np.max(np.abs(out))*1.12
pcm=(out*32767).astype(np.int16)
with wave.open('music.wav','wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print('ok')
