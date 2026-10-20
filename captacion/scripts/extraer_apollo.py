import json, sys, glob
uses = {}; rows = []
files = glob.glob('/root/.claude/projects/-home-user-qualivo/*.jsonl')
for f in files:
    for line in open(f):
        try: o = json.loads(line)
        except: continue
        msg = o.get('message') or {}
        c = msg.get('content')
        if not isinstance(c, list): continue
        for b in c:
            if b.get('type') == 'tool_use' and 'apollo_organizations_lookup' in b.get('name',''):
                uses[b['id']] = b['input']
            elif b.get('type') == 'tool_result' and b.get('tool_use_id') in uses or (b.get('type')=='tool_result'):
                tid = b.get('tool_use_id')
                if tid not in uses: continue
                cont = b.get('content')
                txt = cont if isinstance(cont, str) else ''.join(x.get('text','') for x in cont if isinstance(x, dict))
                try: data = json.loads(txt)
                except: continue
                for org in data.get('organizations', []):
                    rows.append({'q': uses[tid], 'org': org})
print(len(uses), 'llamadas;', len(rows), 'filas', file=sys.stderr)
json.dump(rows, open('apollo_raw_rows.json','w'))
