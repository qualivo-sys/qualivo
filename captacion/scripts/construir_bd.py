import json, re, unicodedata, csv, sys
from collections import Counter, defaultdict
rows = json.load(open('apollo_raw_rows.json'))
env = set(d.lower() for d in json.load(open('enviados_reales.json'))['dominios'])

def norm(s):
    s = unicodedata.normalize('NFKD', s or '').encode('ascii','ignore').decode().lower()
    return s

ADS = {'facebook_custom_audiences','google_adwords_conversion','google_remarketing','doubleclick_conversion'}
CRM = {'hubspot','salesforce','pipedrive','zoho_crm','activecampaign'}
SECTOR_Q = {'formacion':'Formación','formación':'Formación','reformas':'Reformas y hogar','clinica':'Clínicas y salud',
            'inmobiliaria':'Inmobiliaria','asesoria':'Servicios profesionales','automocion':'Automoción',
            'software':'Software y tecnología B2B','gimnasio':'Fitness y bienestar','eventos':'Eventos, turismo y hostelería',
            'muebles':'Retail con tienda (hogar)','distribucion':'Industria y distribución','B2B':'Software y tecnología B2B',
            'consulting':'Servicios profesionales','ingenieria':'Industria y distribución'}

# tipologia por nombre/dominio (manda sobre la query)
NAME_RULES = [
  ('Clínicas y salud', r'clinic|dental|denta|odonto|ortodon|estetic|aesthetic|fisio|psicolog|nutricion|oftalm|fertil|medic|capilar|skin|vascular|hospital|salud|veterin|vet\b'),
  ('Formación', r'formacion|academ|escuela|school|campus|oposicion|e-?learning|master|mba|training|fp\b|idiomas|english|educa'),
  ('Inmobiliaria', r'inmobil|real estate|realty|propert|immobil|promoci|inmo|realtor|brokers?\b.*(estate|marbella)'),
  ('Reformas y hogar', r'reform|construc|cocina|kitchen|ventana|aluminio|alumin|carpinter|climatiz|solar|instalacion|fontaner|interiorismo|interiores|arquitect|rehabilit|piscina|bano'),
  ('Automoción', r'motor|auto|wagen|car\b|cars\b|concesionari|renting|motos?\b|seat|kia|hyundai|renault|volvo|toyota|bmw|audi|mercedes|peugeot|citro|ford|skoda|lexus|nissan|vehic'),
  ('Servicios profesionales', r'abogad|lawyer|legal|advocat|asesor|gestori|seguros|insurance|correduria|broker|economistas|consultor|consulting|auditor|fiscal|bufete|despacho'),
  ('Retail con tienda (hogar)', r'mueble|mobel|mobles|colchon|sofa|decora|furniture|home\b|optica|joyer|electrodom|descanso|dormi'),
  ('Fitness y bienestar', r'gym|fitness|pilates|yoga|wellness|spa\b|sport|deport|crossfit'),
  ('Eventos, turismo y hostelería', r'hotel|catering|evento|event|boda|viaje|travel|turism|resort|restaur'),
]

# ruido: no es el ICP (grandes, publicos, asociaciones, medios, agencias/competencia, portales, proveedores)
RUIDO = [
  (r'fundaci|foundation|asociaci|association|federaci|colegio profesional|camara de comercio|camara francesa|cci france|pacto mundial|sociedad espanola|gremi|cruz roja|universidad|universitat|upc-|ceu |nebrija|un-habitat|aecoc|icea|icjce|ganvam|adicae|club de la pyme|impact hub|cotec|biocat|aedhe|ateneo|seqc|febiotec|senpe|aepsis|instituto de biomecanica|itcl|centro tecnologic|technology centre', 'Entidad pública, asociación o fundación'),
  (r'inboundcycle|marketing paradise|marketing digital murcia|cyberclick|we are marketing|good rebels|keenfolks|product hackers|bigseo|hustler marketing|digital group|avante|phd media|estimado jose alfredo|publi dental|aesinergy|brandemia|semrush|imagina\b', 'Agencia o competencia'),
  (r'fotocasa|pisos\.com|idealista|trovit|rastreator|bodas\.net|coches\.com|infoempleo|trabajos\.com|turijobs|jobstoday|europe language jobs|all european careers|softonic|ilovepdf|forbes|conde nast|okdiario|diario|marketingdirecto|negocios television|graffica|modaes|eu-startups|diariolaley|vlex|stayforlong|heymondo|fintonic|acierto|tuio|evo banco|myinvestor|triodos|sofinco|amovens|copart|offerum|takeachef|take a chef', 'Portal, medio o marca de consumo masiva'),
  (r'axa|mapfre|liberty seguros|direct seguros|mutua|mutual|lagun aro|seguros atocha|union alcoyana|patria hispana|hiscox|markel|telefonica seguros|almudena seguros|relyens|spb seguros|asefa|umas|amv\.es|mmt seguros|europea seguros|soliss|nueva mutua|iati seguros|aura seguros|garante', 'Aseguradora (no corredor)'),
  (r'ie business|ie school|eoi business|esic|icemd|santander open|universidad europea|inesem|ealde|esneca|centro de estudios garrigues|iviglobal|ivi rma', 'Escuela grande o de grupo'),
  (r'henry schein|knauf|veka|mitsubishi|saunier duval|porcelanosa|xtone|festo|rittal|weg iberia|hafele|hettich|emuca|stahlwille|fuchs|schmitz|markem|porsche iberica|volvo car espana|honda motor|jaguar land rover spain|bmw talento|hoya lens|inmode|leuze|stemmer|amada|smileat|ald automotive|realia|iberdrola inmobiliaria|culmia|quabit|inmocaixa|accenture|axis corporate|kirey|alten|randstad|teamsystem|izertis|sapiens|experian|esri|zte|avi-spl|ifs iberica|v-valley|abas iberica|logalty|signaturit|emburse|booksy|aquanima|freightos|virustotal|alkora|ihg\.com|intercontinental|nhow|kimpton|olympia-grupo quiron|anytime fitness iberia|smartfit|havaianas|amer global|ecoembes|rajapack|mail boxes|bigbuy|hortifrut|cocunat|genially|softonic|italki|strands|wobi|cegos|casino', 'Proveedor, fabricante o grupo grande'),
  (r'recruit|talent|selecci|seleccion|empleo|jobs|rrhh|recursos humanos|headhunt|axxon|servitalent|triangle talent|blu selection|the valley|nuclio|adlanter|ayanet|sede21|pardo seleccion|personal para eventos|talentchef|montreal associates', 'Selección de personal o empleo'),
]
BLOQ = {'growitschool.com','growthhackingcourse.io','anticbarcelona113.es','formacion.ninja','kubysoft.com',
        'escolaeronauticadecatalunya.cat','alphapublicidad.com','sheerpa.com','eleva.com','equipzilla.com','goqualivo.com','gotqualivo.com','qualivo.es'}
EXTRANJERO = re.compile(r'\.(com\.ar|pt|ca|co\.uk|us|fr|de|it|mx|cl|co)$')

agg = {}
for x in rows:
    o, q = x['org'], x['q']
    oid = o['id']
    a = agg.setdefault(oid, {'id':oid,'nombre':o.get('name','').strip(),'dominio':(o.get('domain') or '').lower(),
                             'web':o.get('website_url') or '', 'sectores':Counter(), 'senales':set()})
    tags = q.get('q_organization_keyword_tags') or []
    if tags: a['sectores'][SECTOR_Q.get(tags[0], tags[0])] += 1
    tech = set(q.get('currently_using_any_of_technology_uids') or [])
    if tech & ADS and tech & CRM: a['senales'].add('anuncios o CRM')
    elif tech & ADS: a['senales'].add('anuncios')
    elif tech & CRM: a['senales'].add('CRM')
    if q.get('organization_department_or_subdepartment_counts'): a['senales'].add('equipo comercial')

# dedupe por dominio
pordom = {}
for a in agg.values():
    k = a['dominio'] or ('id:'+a['id'])
    if k in pordom:
        b = pordom[k]; b['sectores'] += a['sectores']; b['senales'] |= a['senales']
    else: pordom[k] = a

keep, out = [], []
for a in pordom.values():
    n = norm(a['nombre'] + ' ' + a['dominio'])
    sen = set(a['senales'])
    if 'anuncios o CRM' in sen and len(sen) > 1: sen.discard('anuncios o CRM')
    a['senales'] = sen
    tip = None
    for t, rx in NAME_RULES:
        if re.search(rx, n): tip = t; break
    if not tip:
        tip = a['sectores'].most_common(1)[0][0] if a['sectores'] else 'Otros B2B'
    if tip in ('crm',): tip = 'Otros B2B'
    a['tipologia'] = tip
    motivo = None
    for rx, m in RUIDO:
        if re.search(rx, n): motivo = m; break
    if not motivo and a['dominio'] in BLOQ: motivo = 'Cliente o dominio bloqueado'
    if not motivo and a['dominio'] in env: motivo = 'Ya contactado por correo'
    if not motivo and not a['dominio']: motivo = 'Sin dominio en Apollo'
    if not motivo and EXTRANJERO.search(a['dominio']): motivo = 'Dominio fuera de España'
    if not motivo and not (sen - {''}): motivo = 'Sin señal verificada'
    a['motivo'] = motivo
    nsen = len({s for s in sen if s != 'anuncios o CRM'}) + (1 if 'anuncios o CRM' in sen else 0)
    a['n_senales'] = nsen
    (out if motivo else keep).append(a)

PESO = {'Formación':3,'Reformas y hogar':3,'Clínicas y salud':3,'Inmobiliaria':2,'Servicios profesionales':2,
        'Automoción':2,'Retail con tienda (hogar)':2,'Fitness y bienestar':2,'Eventos, turismo y hostelería':1,
        'Industria y distribución':1,'Software y tecnología B2B':1,'Otros B2B':1}
for a in keep:
    w = PESO.get(a['tipologia'],1); n = a['n_senales']
    a['score'] = n*2 + w
    a['prioridad'] = 'A' if (n >= 2 and w >= 2) or n >= 3 else 'B' if (w == 3 or n >= 2) else 'C'

keep.sort(key=lambda a:(-a['score'], a['tipologia'], a['nombre'].lower()))
json.dump([{k:(sorted(v) if isinstance(v,set) else dict(v) if isinstance(v,Counter) else v) for k,v in a.items()} for a in keep], open('bd_icp_keep.json','w'), ensure_ascii=False, indent=0)
json.dump([{k:(sorted(v) if isinstance(v,set) else dict(v) if isinstance(v,Counter) else v) for k,v in a.items()} for a in out], open('bd_icp_out.json','w'), ensure_ascii=False, indent=0)
print('orgs únicas', len(agg), 'dominios únicos', len(pordom), 'quedan', len(keep), 'fuera', len(out))
print(Counter(a['motivo'] for a in out).most_common())
t = Counter(a['tipologia'] for a in keep)
for k,v in t.most_common():
    p = Counter(a['prioridad'] for a in keep if a['tipologia']==k)
    print(f"{k:32} {v:4}  A={p['A']:3} B={p['B']:3} C={p['C']:3}")
print(Counter(a['prioridad'] for a in keep))
print(Counter(' + '.join(sorted(a['senales'])) for a in keep).most_common())
