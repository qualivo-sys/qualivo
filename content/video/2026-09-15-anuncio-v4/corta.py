# recorta pausas y calcula el arranque real de cada frase
import json,wave,subprocess,re,array,sys
d=sys.argv[1]; raw=sys.argv[2]; KEEP=float(sys.argv[3]) if len(sys.argv)>3 else 0.30
FF=subprocess.check_output(['python3','-c','import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())']).decode().strip()
subprocess.run([FF,'-y','-i',f'{d}/{raw}','-ac','1','-ar','44100',f'{d}/raw.wav'],capture_output=True)
out=subprocess.run([FF,'-i',f'{d}/raw.wav','-af','silencedetect=n=-38dB:d=0.30','-f','null','-'],capture_output=True,text=True).stderr
sil=[(float(a),float(b)) for a,b in zip(re.findall(r'silence_start: ([\d.]+)',out),re.findall(r'silence_end: ([\d.]+)',out))]
al0=json.load(open(f'{d}/alignment.json')); st0=al0['character_start_times_seconds']; txt0=''.join(al0['characters'])
# pausas que respiran mas: la que precede a cada ancla (segundos que dejamos)
MAS={'entran leads':0.70,'van a tu CRM':0.45,'y tu gente':0.45}
def keep_de(a,b):
    for anc,k in MAS.items():
        ta=st0[txt0.index(anc)]
        if a<ta<=b+0.05: return k
    return KEEP
cuts=[]
for a,b in sil:
    k=keep_de(a,b)
    if b-a>k+0.02: cuts.append((a+k/2,b-k/2))
w=wave.open(f'{d}/raw.wav'); sr=w.getframerate(); x=array.array('h'); x.frombytes(w.readframes(w.getnframes())); w.close()
y=array.array('h'); pos=0
for a,b in cuts:
    ia,ib=int(a*sr),int(b*sr); seg=x[pos:ia]; n=min(int(sr*0.004),len(seg))
    for i in range(n): seg[len(seg)-n+i]=int(seg[len(seg)-n+i]*(1-i/n))
    y.extend(seg); pos=ib
y.extend(x[pos:])
INS={'anuncios':0.55}
en0=al0['character_end_times_seconds']
ins=[]
for anc,secs in INS.items():
    i=txt0.index(anc)+len(anc)-1; tfin=en0[i]+0.02
    tn=tfin-sum(min(b,tfin)-a for a,b in cuts if a<tfin)   # posicion ya con los cortes aplicados
    ins.append((tn,secs))
ins.sort()
z=array.array('h'); pos=0
for tn,secs in ins:
    p=int(tn*sr); seg=y[pos:p]; n=min(int(sr*0.006),len(seg))
    for i in range(n): seg[len(seg)-n+i]=int(seg[len(seg)-n+i]*(1-i/n))
    z.extend(seg); z.extend(array.array('h',[0]*int(secs*sr))); pos=p
z.extend(y[pos:]); y=z
ww=wave.open(f'{d}/cortada.wav','wb'); ww.setnchannels(1); ww.setsampwidth(2); ww.setframerate(sr); ww.writeframes(y.tobytes()); ww.close()
def nuevo(t):
    tn=t-sum(min(b,t)-a for a,b in cuts if a<t)
    return tn+sum(secs for ti,secs in ins if ti<tn)
al=json.load(open(f'{d}/alignment.json')); st=al['character_start_times_seconds']; txt=''.join(al['characters'])
anchors=["Metes dinero","y tu gente","Pero no todos","Algunos se quedan","Y ahí se te van","Nosotros buscamos","Miramos todo","y metemos inteligencia","En lo que ya usas","Para que más","Qualivo.","Detectamos dónde"]
LEAD=0.3; T0=[round(nuevo(st[txt.index(a)])+LEAD,2) for a in anchors]; fin=round(len(y)/sr+LEAD,2)
print(d,'quitado',round(len(x)/sr-len(y)/sr,2),'s; voz acaba en',fin); print('T0=',T0)
json.dump({'T0':T0,'fin':fin},open(f'{d}/tiempos.json','w'))
