import json
def hi(h):
    if not isinstance(h,dict) or 'header' not in h: return h
    return {'header':{k:h['header'].get(k) for k in ['h','w','position','top','bg','borderBottom','shadow']},'bar':h['bar'],'barStyle':h['barStyle'],
      'nav':[(l['t'],l['current'],l['icon'],l['w']) for l in h['navLinks']],'navCenter':h['navCenter'],'hc':h['headerCenter'],'underline':h['underline'],
      'search':h['search'] and {k:h['search'].get(k) for k in ['w','h','placeholder','visible','wrapW','lupa','radius']},'new':h['newBtn'] and {k:h['newBtn'].get(k) for k in ['t','vis','bg','radius','h']},
      'bell':h['bell'] and (h['bell']['vis'],h['bell']['badge']),'avatar':h['avatar'] and (h['avatar']['vis'],h['avatar']['w'],h['avatar']['radius']),'logo':h['logo'] and h['logo']['t'],'mono':h['mono'],
      'sidebars':h['sidebars'],'container':h['container'][:3],'stories':h['stories'],'dock':h['dockVisible'],'menuBtn':h['menuBtnVisible'],'panelBtn':h['panelBtnVisible'],'overflow':h['overflow']['over']}
for s in ['dev-1','dev-2','dev-3']:
    d=json.load(open(f'out/{s}-desktop.json'))
    print('=====',s)
    for k,v in d.items():
        if k=='site': continue
        if k in ('d1440','d1920','d1280','d1024','t768','t820','t767'): print(' ',k,json.dumps(hi(v),ensure_ascii=False))
        else: print(' ',k,json.dumps(v,ensure_ascii=False)[:1500])
