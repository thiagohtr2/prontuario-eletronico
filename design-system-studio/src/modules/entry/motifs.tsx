import type { CSSProperties, ReactNode } from 'react'
import type { Motif as MotifKind } from './types'

/**
 * Ilustrações vetoriais originais usadas nas demonstrações (nada de imagens externas).
 * `a` = cor principal, `b` = secundária, `c` = clara (superfície), `d` = traço/escura.
 */
export function Motif({
  kind,
  a,
  b,
  c,
  d,
  style,
}: {
  kind: MotifKind
  a: string
  b: string
  c: string
  d: string
  style?: CSSProperties
}) {
  return (
    <svg viewBox="0 0 200 160" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false" style={{ display: 'block', ...style }}>
      {draw(kind, a, b, c, d)}
    </svg>
  )
}

function draw(kind: MotifKind, a: string, b: string, c: string, d: string): ReactNode {
  switch (kind) {
    case 'app':
      return (
        <g>
          <rect x="18" y="22" width="164" height="116" rx="9" fill={c} stroke={d} strokeOpacity=".18" />
          <rect x="18" y="22" width="164" height="14" rx="9" fill={a} opacity=".14" />
          <circle cx="28" cy="29" r="2.4" fill={d} opacity=".35" />
          <circle cx="36" cy="29" r="2.4" fill={d} opacity=".35" />
          <circle cx="44" cy="29" r="2.4" fill={d} opacity=".35" />
          <rect x="18" y="36" width="34" height="102" fill={a} opacity=".08" />
          {[0, 1, 2].map((col) => (
            <g key={col}>
              <rect x={60 + col * 40} y="44" width="34" height="5" rx="2" fill={d} opacity=".3" />
              {Array.from({ length: 3 - col }, (_, i) => (
                <rect key={i} x={60 + col * 40} y={54 + i * 26} width="34" height="21" rx="4" fill={i === 0 && col === 1 ? a : c} stroke={d} strokeOpacity=".15" />
              ))}
            </g>
          ))}
          <circle cx="160" cy="118" r="6" fill={b} />
        </g>
      )
    case 'leaf':
      return (
        <g>
          <ellipse cx="100" cy="58" rx="15" ry="40" fill={a} />
          <ellipse cx="74" cy="74" rx="12" ry="32" fill={a} opacity=".85" transform="rotate(-38 74 74)" />
          <ellipse cx="126" cy="74" rx="12" ry="32" fill={a} opacity=".85" transform="rotate(38 126 74)" />
          <ellipse cx="60" cy="96" rx="8" ry="22" fill={a} opacity=".7" transform="rotate(-62 60 96)" />
          <ellipse cx="140" cy="96" rx="8" ry="22" fill={a} opacity=".7" transform="rotate(62 140 96)" />
          <path d="M100 30 V104 M100 70 L82 84 M100 80 L118 90" stroke={c} strokeWidth="2" opacity=".6" fill="none" />
          <rect x="66" y="102" width="68" height="10" rx="3" fill={b} />
          <path d="M71 112 H129 L121 150 H79 Z" fill={b} opacity=".85" />
        </g>
      )
    case 'car':
      return (
        <g>
          <path d="M14 112 Q20 94 48 90 L80 72 Q92 66 112 66 L140 66 Q158 68 170 84 L184 92 Q192 97 190 112 Z" fill={a} />
          <path d="M86 77 L106 71 L138 71 L151 85 L86 85 Z" fill={c} opacity=".55" />
          <path d="M28 100 H58" stroke={c} strokeWidth="2" opacity=".5" />
          <circle cx="58" cy="113" r="15" fill={d} />
          <circle cx="58" cy="113" r="6" fill={c} opacity=".7" />
          <circle cx="152" cy="113" r="15" fill={d} />
          <circle cx="152" cy="113" r="6" fill={c} opacity=".7" />
          <rect x="176" y="94" width="10" height="4" rx="2" fill={b} />
          <path d="M0 130 H200" stroke={b} strokeWidth="2" opacity=".5" />
        </g>
      )
    case 'house':
      return (
        <g>
          <path d="M0 138 H200" stroke={d} strokeOpacity=".3" strokeWidth="2" />
          <rect x="36" y="70" width="92" height="68" fill={c} stroke={d} strokeOpacity=".25" />
          <rect x="26" y="60" width="124" height="10" fill={d} />
          <rect x="46" y="82" width="44" height="46" fill={a} opacity=".55" />
          <path d="M68 82 V128" stroke={c} strokeWidth="2" />
          <rect x="104" y="96" width="62" height="42" fill={b} opacity=".8" />
          <rect x="112" y="104" width="14" height="34" fill={c} opacity=".8" />
          <circle cx="178" cy="104" r="14" fill={a} opacity=".35" />
          <rect x="177" y="112" width="2" height="26" fill={d} opacity=".4" />
        </g>
      )
    case 'card':
      return (
        <g transform="rotate(-8 100 80)">
          <rect x="38" y="44" width="124" height="78" rx="11" fill={a} />
          <rect x="52" y="62" width="22" height="16" rx="3" fill={b} />
          <rect x="52" y="96" width="70" height="6" rx="3" fill={c} opacity=".7" />
          <rect x="52" y="108" width="40" height="5" rx="2.5" fill={c} opacity=".5" />
          <circle cx="140" cy="102" r="9" fill={c} opacity=".5" />
          <circle cx="128" cy="102" r="9" fill={c} opacity=".3" />
        </g>
      )
    case 'ant':
      return (
        <g stroke={d} strokeWidth="2.4" strokeLinecap="round" fill="none">
          <path d="M84 84 L64 60 M90 86 L84 120 M96 84 L114 58 M100 88 L120 120 M108 86 L140 66 M110 90 L148 118" />
          <path d="M54 72 Q44 52 30 48 M58 70 Q56 48 46 36" />
          <ellipse cx="60" cy="80" rx="12" ry="11" fill={a} stroke="none" />
          <ellipse cx="92" cy="84" rx="15" ry="10" fill={a} stroke="none" />
          <ellipse cx="136" cy="88" rx="26" ry="18" fill={a} stroke="none" />
          <path d="M126 80 Q136 76 148 82" stroke={c} strokeOpacity=".5" />
          <circle cx="56" cy="77" r="2.4" fill={c} stroke="none" />
        </g>
      )
    case 'shapes':
      return (
        <g>
          <circle cx="72" cy="72" r="40" fill={a} />
          <rect x="96" y="52" width="64" height="64" fill={b} />
          <path d="M40 140 L80 96 L120 140 Z" fill={d} />
          <circle cx="150" cy="40" r="8" fill={d} />
        </g>
      )
    case 'fridge':
      return (
        <g>
          <ellipse cx="100" cy="150" rx="46" ry="5" fill={d} opacity=".12" />
          <rect x="68" y="12" width="64" height="136" rx="9" fill={c} stroke={d} strokeOpacity=".22" strokeWidth="1.5" />
          <path d="M68 60 H132" stroke={d} strokeOpacity=".22" strokeWidth="1.5" />
          <rect x="120" y="26" width="4" height="22" rx="2" fill={d} opacity=".55" />
          <rect x="120" y="70" width="4" height="40" rx="2" fill={d} opacity=".55" />
          <rect x="80" y="72" width="22" height="13" rx="3" fill={a} />
          <rect x="83" y="76" width="10" height="2" fill={c} />
          <rect x="68" y="12" width="10" height="136" rx="4" fill={b} opacity=".25" />
        </g>
      )
    case 'planet':
      return (
        <g>
          {[
            [24, 22], [60, 14], [170, 30], [150, 12], [186, 70], [14, 80], [40, 140], [178, 132], [110, 10],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 1.8 : 1.1} fill={c} opacity=".9" />
          ))}
          <circle cx="100" cy="88" r="42" fill={a} />
          <path d="M70 70 Q100 60 130 76" stroke={c} strokeOpacity=".25" strokeWidth="5" fill="none" />
          <ellipse cx="100" cy="90" rx="78" ry="15" fill="none" stroke={b} strokeWidth="5" transform="rotate(-14 100 90)" />
          <circle cx="34" cy="50" r="6" fill={b} />
        </g>
      )
    case 'cup':
      return (
        <g>
          <path d="M88 20 Q80 32 90 42 Q98 52 90 62 M110 16 Q102 30 112 40 Q120 50 112 60" stroke={b} strokeWidth="4" strokeLinecap="round" fill="none" />
          <ellipse cx="100" cy="134" rx="62" ry="10" fill={b} />
          <path d="M150 86 a18 18 0 1 1 -8 30" stroke={a} strokeWidth="9" fill="none" />
          <path d="M52 70 H148 L140 120 Q100 136 60 120 Z" fill={a} />
          <ellipse cx="100" cy="70" rx="48" ry="7" fill={d} opacity=".55" />
        </g>
      )
    case 'heart':
      return (
        <g>
          <path d="M100 136 C40 96 38 44 74 42 C90 41 100 54 100 64 C100 54 110 41 126 42 C162 44 160 96 100 136 Z" fill={a} />
          <path d="M30 88 H70 L80 70 L94 106 L106 76 L114 88 H170" stroke={c} strokeWidth="4.5" strokeLinejoin="round" strokeLinecap="round" fill="none" />
          <circle cx="150" cy="40" r="10" fill={b} />
          <path d="M146 40 H154 M150 36 V44" stroke={c} strokeWidth="2.5" />
        </g>
      )
    case 'gamepad':
      return (
        <g>
          <path d="M48 62 Q60 54 80 56 H120 Q140 54 152 62 Q176 82 170 118 Q166 132 152 128 L132 108 H68 L48 128 Q34 132 30 118 Q24 82 48 62 Z" fill={a} />
          <rect x="56" y="78" width="26" height="8" rx="2" fill={c} />
          <rect x="65" y="69" width="8" height="26" rx="2" fill={c} />
          <circle cx="132" cy="76" r="6" fill={b} />
          <circle cx="146" cy="88" r="6" fill={b} />
          <circle cx="118" cy="88" r="6" fill={c} opacity=".8" />
          <circle cx="132" cy="100" r="6" fill={c} opacity=".8" />
        </g>
      )
    case 'mountain':
      return (
        <g>
          <circle cx="146" cy="48" r="16" fill={b} />
          <path d="M0 140 L58 64 L96 112 L130 76 L200 140 Z" fill={a} />
          <path d="M58 64 L70 80 L62 84 L52 76 Z M130 76 L142 90 L132 92 L122 86 Z" fill={c} opacity=".85" />
          <path d="M20 140 Q60 120 90 128 T160 112" stroke={c} strokeWidth="2.5" strokeDasharray="5 6" fill="none" />
        </g>
      )
    case 'letter':
      return (
        <g>
          <circle cx="100" cy="80" r="58" fill={a} opacity=".12" />
          <text x="100" y="112" textAnchor="middle" fontFamily="'Fraunces Variable', Georgia, serif" fontSize="96" fontWeight="600" fill={d}>
            M
          </text>
          <path d="M44 132 H156" stroke={b} strokeWidth="3" />
        </g>
      )
    case 'plate':
      return (
        <g>
          <rect x="22" y="40" width="5" height="84" rx="2.5" fill={d} opacity=".5" />
          <path d="M170 40 Q182 70 174 92 V124" stroke={d} strokeOpacity=".5" strokeWidth="5" strokeLinecap="round" fill="none" />
          <circle cx="100" cy="82" r="56" fill={c} stroke={d} strokeOpacity=".15" />
          <circle cx="100" cy="82" r="40" fill={b} opacity=".35" />
          <circle cx="88" cy="76" r="14" fill={a} />
          <circle cx="112" cy="90" r="11" fill={b} />
          <ellipse cx="112" cy="68" rx="9" ry="5" fill={a} opacity=".6" transform="rotate(-30 112 68)" />
        </g>
      )
    case 'book':
      return (
        <g>
          <path d="M100 52 Q70 40 30 46 V122 Q70 116 100 128 Z" fill={c} stroke={d} strokeOpacity=".25" strokeWidth="1.5" />
          <path d="M100 52 Q130 40 170 46 V122 Q130 116 100 128 Z" fill={c} stroke={d} strokeOpacity=".25" strokeWidth="1.5" />
          <path d="M42 62 Q70 58 90 64 M42 74 Q70 70 90 76 M42 86 Q66 82 84 88" stroke={a} strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M110 64 Q130 58 158 62 M110 76 Q130 70 158 74" stroke={d} strokeOpacity=".25" strokeWidth="3" strokeLinecap="round" fill="none" />
          <rect x="120" y="86" width="30" height="22" rx="3" fill={b} />
          <circle cx="100" cy="30" r="9" fill={b} />
        </g>
      )
    case 'headphones':
      return (
        <g>
          <path d="M50 102 Q50 28 100 28 Q150 28 150 102" stroke={a} strokeWidth="11" strokeLinecap="round" fill="none" />
          <rect x="34" y="88" width="32" height="50" rx="14" fill={a} />
          <rect x="134" y="88" width="32" height="50" rx="14" fill={a} />
          <rect x="58" y="94" width="10" height="38" rx="5" fill={b} />
          <rect x="132" y="94" width="10" height="38" rx="5" fill={b} />
          <path d="M70 40 Q100 30 130 40" stroke={c} strokeOpacity=".3" strokeWidth="3" fill="none" />
        </g>
      )
    case 'horizon':
      return (
        <g>
          <path d="M0 92 L40 70 L80 86 L120 62 L160 82 L200 70 V100 H0 Z" fill={d} opacity=".16" />
          <circle cx="100" cy="98" r="30" fill={b} />
          <rect x="0" y="98" width="200" height="62" fill={a} opacity=".75" />
          <path d="M30 116 H80 M110 116 H170 M50 130 H150 M80 144 H120" stroke={c} strokeWidth="2.5" strokeLinecap="round" opacity=".7" />
        </g>
      )
    case 'bars':
      return (
        <g>
          <path d="M24 134 H180" stroke={d} strokeOpacity=".25" strokeWidth="2" />
          {[44, 70, 58, 92, 80, 110].map((h, i) => (
            <rect key={i} x={30 + i * 25} y={134 - h} width="16" height={h} rx="3" fill={i === 5 ? a : b} opacity={i === 5 ? 1 : 0.55} />
          ))}
          <polyline points="38,84 63,62 88,72 113,44 138,52 163,26" fill="none" stroke={a} strokeWidth="3.5" strokeLinejoin="round" strokeLinecap="round" />
          <circle cx="163" cy="26" r="5" fill={a} />
        </g>
      )
    case 'dress':
      return (
        <g>
          <path d="M100 14 a8 8 0 1 1 6 12 L100 32 M100 32 L56 48 H144 Z" stroke={d} strokeWidth="2.5" fill="none" strokeLinejoin="round" />
          <path d="M80 46 L120 46 L126 74 L152 148 H48 L74 74 Z" fill={a} />
          <rect x="74" y="72" width="52" height="8" fill={b} />
          <path d="M88 80 L76 146 M112 80 L124 146" stroke={c} strokeOpacity=".25" strokeWidth="2" />
        </g>
      )
    case 'jar':
      return (
        <g>
          <rect x="60" y="54" width="80" height="90" rx="16" fill={b} />
          <rect x="56" y="40" width="88" height="18" rx="5" fill={d} />
          <rect x="72" y="82" width="56" height="38" rx="5" fill={c} />
          <ellipse cx="100" cy="100" rx="13" ry="7" fill={a} transform="rotate(-25 100 100)" />
          <path d="M92 108 Q100 98 112 92" stroke={c} strokeWidth="1.5" fill="none" />
          <circle cx="160" cy="124" r="14" fill={a} opacity=".85" />
          <circle cx="40" cy="128" r="10" fill={a} opacity=".55" />
        </g>
      )
    case 'pulse':
      return (
        <g>
          <path d="M6 96 H62 L74 60 L90 132 L104 40 L118 112 L128 96 H194" stroke={b} strokeWidth="5" strokeLinejoin="round" strokeLinecap="round" fill="none" />
          <rect x="54" y="74" width="92" height="9" rx="4" fill={d} opacity=".7" />
          <rect x="40" y="56" width="16" height="46" rx="4" fill={a} />
          <rect x="144" y="56" width="16" height="46" rx="4" fill={a} />
          <rect x="28" y="64" width="12" height="30" rx="3" fill={a} opacity=".8" />
          <rect x="160" y="64" width="12" height="30" rx="3" fill={a} opacity=".8" />
        </g>
      )
    case 'people':
      return (
        <g>
          <rect x="118" y="16" width="64" height="34" rx="12" fill={b} />
          <path d="M132 50 L128 62 L144 50 Z" fill={b} />
          <rect x="128" y="27" width="34" height="4" rx="2" fill={c} />
          <rect x="128" y="36" width="22" height="4" rx="2" fill={c} opacity=".7" />
          <circle cx="62" cy="74" r="15" fill={a} opacity=".7" />
          <path d="M34 140 Q36 96 62 96 Q88 96 90 140 Z" fill={a} opacity=".7" />
          <circle cx="138" cy="80" r="14" fill={b} opacity=".75" />
          <path d="M112 140 Q114 102 138 102 Q162 102 164 140 Z" fill={b} opacity=".75" />
          <circle cx="100" cy="68" r="18" fill={a} />
          <path d="M66 144 Q68 92 100 92 Q132 92 134 144 Z" fill={a} />
        </g>
      )
    case 'frame':
      return (
        <g>
          <path d="M30 22 V36 M22 30 H36 M170 22 V36 M164 30 H178 M30 138 V124 M22 130 H36 M170 138 V124 M164 130 H178" stroke={d} strokeWidth="2" />
          <rect x="44" y="40" width="112" height="80" fill={c} stroke={d} strokeWidth="5" />
          <path d="M50 114 L84 76 L108 102 L124 86 L150 114 Z" fill={a} />
          <circle cx="128" cy="62" r="10" fill={b} />
        </g>
      )
    case 'envelope':
      return (
        <g>
          <rect x="38" y="46" width="124" height="84" rx="10" fill={c} stroke={a} strokeWidth="3" />
          <path d="M42 52 L100 98 L158 52" stroke={a} strokeWidth="3" fill="none" strokeLinejoin="round" />
          <circle cx="156" cy="48" r="13" fill={b} />
          <path d="M150 48 L155 53 L163 43" stroke={c} strokeWidth="3" fill="none" strokeLinecap="round" />
        </g>
      )
    case 'shield':
      return (
        <g>
          <path d="M100 24 L150 42 V86 Q150 122 100 142 Q50 122 50 86 V42 Z" fill={a} />
          <path d="M78 84 L94 100 L124 68" stroke={c} strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="160" cy="36" r="7" fill={b} />
        </g>
      )
    default:
      return null
  }
}
