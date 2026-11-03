# Consolida as notas por requisito (valores atribuídos em fidelidade.md a partir das medições) e calcula médias.
import json, os
S = {  # requisito: (dev-1, dev-2, dev-3)
 'ARQ1':(100,100,100),'ARQ2':(100,100,100),'ARQ3':(100,100,100),'ARQ4':(100,100,100),'ARQ5':(100,100,100),'ARQ6':(100,100,100),'ARQ7':(100,100,100),
 'DSK1':(100,100,100),'DSK2':(100,100,100),'DSK3':(100,100,100),'DSK4':(100,100,100),'DSK5':(100,100,100),'DSK6':(100,100,100),'DSK7':(100,100,25),
 'DSK8':(100,100,100),'DSK9':(100,100,100),'DSK10':(100,100,100),'DSK11':(100,100,100),'DSK12':(100,100,100),'DSK13':(100,100,60),'DSK14':(100,67,100),'DSK15':(100,100,100),
 'MOB1':(100,100,100),'MOB2':(100,100,100),'MOB3':(100,100,100),'MOB4':(100,100,100),'MOB5':(100,100,100),'MOB6':(50,100,50),'MOB7':(100,100,100),
 'MOB8':(100,100,100),'MOB9':(100,100,94),'MOB10':(100,100,100),'MOB11':(100,100,100),'MOB12':(100,100,100),
 'PAL1':(75,75,100),'PAL2':(100,100,25),'PAL3':(100,100,100),'PAL4':(100,100,100),'PAL5':(75,75,100),'PAL6':(100,100,100),'PAL7':(100,100,0),
 'PAL8':(100,100,67),'PAL9':(100,100,100),'PAL10':(100,100,100),'PAL11':(100,100,100),'PAL12':(100,100,100),'PAL13':(54,72,73),
 'CMP1':(100,100,100),'CMP2':(100,100,100),'CMP3':(100,100,100),'CMP4':(100,100,100),'CMP5':(100,100,100),'CMP6':(100,100,100),'CMP7':(100,100,100),
 'CMP8':(100,100,100),'CMP9':(100,100,50),'CMP10':(100,100,100),'CMP11':(100,100,100),'CMP12':(100,67,100),
 'INT1':(100,100,100),'INT2':(100,100,100),'INT3':(100,100,100),'INT4':(100,100,100),'INT5':(100,100,100),'INT6':(100,100,100),'INT7':(100,100,80),
 'INT8':(100,100,100),'INT9':(100,100,100),'INT10':(100,100,100),'INT11':(100,100,100),'INT12':(100,100,100),
}
dims = {'Arquitetura':'ARQ','Desktop':'DSK','Celular':'MOB','Paleta/tokens':'PAL','Componentes':'CMP','Interações':'INT'}
out = {}
for i, dev in enumerate(['dev-1','dev-2','dev-3']):
    o = {}
    for name, p in dims.items():
        v = [s[i] for k, s in S.items() if k.startswith(p)]
        o[name] = (round(sum(v)/len(v), 1), len(v))
    allv = [s[i] for s in S.values()]
    o['Geral'] = (round(sum(allv)/len(allv), 1), len(allv))
    o['abaixo_de_100'] = [k for k, s in S.items() if s[i] < 100]
    out[dev] = o
print(json.dumps(out, ensure_ascii=False, indent=1))
json.dump(out, open(os.path.join(os.path.dirname(__file__), '../medicoes/notas.json'), 'w'), ensure_ascii=False, indent=1)
