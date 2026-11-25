import { useEffect, useState } from 'react';

const PALETA = {
  sujeto: {
    stroke: '#d27d46',
    soft: 'rgba(210, 125, 70, 0.16)',
    accent: '#f0b88f',
  },
  compositor: {
    stroke: '#7ba393',
    soft: 'rgba(123, 163, 147, 0.16)',
    accent: '#b6d5c8',
  },
  ia: {
    stroke: '#74a4c4',
    soft: 'rgba(116, 164, 196, 0.16)',
    accent: '#b2d4ec',
  },
};

function renderSVGPorTipo(tipo, colors) {
  const { stroke, soft, accent } = colors;

  switch (tipo) {
    case 'casete':
      return (
        <svg viewBox="0 0 120 120" className="h-full w-full" fill="none">
          <rect x="14" y="28" width="92" height="62" rx="6" stroke={stroke} strokeWidth="1.6" fill={soft} />
          <rect x="22" y="36" width="76" height="32" rx="3" stroke={accent} strokeWidth="1" strokeOpacity="0.65" />
          <circle cx="42" cy="52" r="9" stroke={stroke} strokeWidth="1.5" />
          <circle cx="42" cy="52" r="3" fill={accent} />
          <circle cx="78" cy="52" r="9" stroke={stroke} strokeWidth="1.5" />
          <circle cx="78" cy="52" r="3" fill={accent} />
          <path d="M51 52H69" stroke={accent} strokeWidth="1.2" strokeDasharray="3 3" />
          <path d="M30 90L36 76H84L90 90" stroke={stroke} strokeWidth="1.4" />
          <circle cx="46" cy="83" r="2" fill={stroke} />
          <circle cx="74" cy="83" r="2" fill={stroke} />
          <path d="M18 22H44" stroke={accent} strokeWidth="1" strokeOpacity="0.4" />
        </svg>
      );

    case 'diapason':
      return (
        <svg viewBox="0 0 120 120" className="h-full w-full" fill="none">
          <circle cx="60" cy="44" r="34" stroke={stroke} strokeWidth="0.8" strokeDasharray="2 4" strokeOpacity="0.45" />
          <circle cx="60" cy="44" r="24" stroke={accent} strokeWidth="0.8" strokeOpacity="0.35" />
          <path
            d="M46 18V54C46 62 52 68 60 68C68 68 74 62 74 54V18"
            stroke={stroke}
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path d="M60 68V98" stroke={stroke} strokeWidth="2.2" strokeLinecap="round" />
          <circle cx="60" cy="100" r="4" fill={soft} stroke={accent} strokeWidth="1.5" />
          {/* Fisura simbólica en el brazo derecho */}
          <path d="M70 34L77 38L71 42" stroke={accent} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M34 26C30 34 30 46 34 54" stroke={accent} strokeWidth="1.1" strokeLinecap="round" strokeOpacity="0.7" />
          <path d="M86 26C90 34 90 46 86 54" stroke={accent} strokeWidth="1.1" strokeLinecap="round" strokeOpacity="0.7" />
        </svg>
      );

    case 'lapiz_digital':
      return (
        <svg viewBox="0 0 120 120" className="h-full w-full" fill="none">
          {/* Superficie sutil de tablet / cuaderno digital */}
          <rect x="18" y="22" width="84" height="76" rx="7" stroke={stroke} strokeWidth="1.2" strokeOpacity="0.45" fill={soft} />
          <line x1="28" y1="76" x2="64" y2="76" stroke={accent} strokeWidth="0.9" strokeDasharray="3 3" strokeOpacity="0.55" />
          <line x1="28" y1="86" x2="82" y2="86" stroke={accent} strokeWidth="0.9" strokeOpacity="0.35" />
          {/* Lápiz digital en diagonal */}
          <g transform="rotate(-42 62 58)">
            <rect x="26" y="51" width="66" height="12" rx="4" fill="#141210" stroke={accent} strokeWidth="1.7" />
            <polygon points="26,51 12,57 26,63" fill={soft} stroke={accent} strokeWidth="1.5" strokeLinejoin="round" />
            <circle cx="13.5" cy="57" r="1.8" fill={accent} />
            {/* Botón lateral y anillo táctil */}
            <rect x="40" y="54.5" width="12" height="5" rx="2.5" stroke={stroke} strokeWidth="1.2" />
            <line x1="78" y1="51" x2="78" y2="63" stroke={stroke} strokeWidth="1.4" />
          </g>
          {/* Trazo lumínico al contacto con la pantalla */}
          <path d="M28 84C35 79 41 87 48 82" stroke={accent} strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      );

    case 'espectrograma':
      return (
        <svg viewBox="0 0 120 120" className="h-full w-full" fill="none">
          <polygon points="60,14 100,37 100,83 60,106 20,83 20,37" stroke={stroke} strokeWidth="1.4" fill={soft} />
          <polygon points="60,24 91,42 91,78 60,96 29,78 29,42" stroke={accent} strokeWidth="0.9" strokeOpacity="0.5" />
          {[36, 44, 52, 60, 68, 76, 84].map((x, idx) => {
            const heights = [18, 34, 48, 56, 42, 28, 16];
            const h = heights[idx];
            return (
              <line
                key={x}
                x1={x}
                y1={60 - h / 2}
                x2={x}
                y2={60 + h / 2}
                stroke={idx === 3 ? accent : stroke}
                strokeWidth="2"
                strokeLinecap="round"
              />
            );
          })}
          <line x1="20" y1="60" x2="100" y2="60" stroke={accent} strokeWidth="0.8" strokeDasharray="2 3" />
        </svg>
      );

    case 'menton_barba':
      return (
        <svg viewBox="0 0 120 120" className="h-full w-full" fill="none">
          {/* Halo sutil de cabeza erguida */}
          <path d="M26 30C34 22 46 18 60 18C74 18 86 22 94 30" stroke={accent} strokeWidth="0.9" strokeDasharray="3 4" strokeOpacity="0.45" />
          {/* Mandíbula levantada y labio inferior */}
          <path d="M30 28C32 42 42 50 60 50C78 50 88 42 90 28" stroke={accent} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M47 36C52 39 68 39 73 36" stroke={accent} strokeWidth="1.4" strokeLinecap="round" />
          <path d="M51 43C56 45 64 45 69 43" stroke={stroke} strokeWidth="1.2" strokeLinecap="round" />
          {/* Barba larga esculpida en grabado */}
          <path
            d="M30 34C27 56 33 78 46 95C52 103 57 107 60 109C63 107 68 103 74 95C87 78 93 56 90 34C83 45 73 51 60 51C47 51 37 45 30 34Z"
            fill={soft}
            stroke={stroke}
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          {/* Hebras internas de la barba larga */}
          <path d="M39 50C38 66 42 82 51 96" stroke={accent} strokeWidth="1.05" strokeLinecap="round" strokeOpacity="0.72" />
          <path d="M48 54C48 70 50 86 56 101" stroke={stroke} strokeWidth="1.15" strokeLinecap="round" />
          <path d="M60 53V105" stroke={accent} strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.85" />
          <path d="M72 54C72 70 70 86 64 101" stroke={stroke} strokeWidth="1.15" strokeLinecap="round" />
          <path d="M81 50C82 66 78 82 69 96" stroke={accent} strokeWidth="1.05" strokeLinecap="round" strokeOpacity="0.72" />
        </svg>
      );

    case 'gafas_ra':
      return (
        <svg viewBox="0 0 120 120" className="h-full w-full" fill="none">
          {/* Proyección holográfica superior (interfaz RA) */}
          <path d="M30 32H50M70 32H90" stroke={accent} strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.65" />
          <circle cx="60" cy="28" r="3" stroke={accent} strokeWidth="1.1" />
          <path d="M38 38L44 46M82 38L76 46" stroke={stroke} strokeWidth="0.9" strokeOpacity="0.55" />
          {/* Patillas en perspectiva */}
          <path d="M14 54L24 44M106 54L96 44" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
          {/* Visor envolvente de realidad aumentada */}
          <path
            d="M16 52C16 46 21 43 28 43H92C99 43 104 46 104 52V68C104 75 98 80 90 80H72C67 80 64 76 62 72C61 70 59 70 58 72C56 76 53 80 48 80H30C22 80 16 75 16 68V52Z"
            fill={soft}
            stroke={stroke}
            strokeWidth="1.9"
            strokeLinejoin="round"
          />
          {/* Retícula digital y datos sobre los lentes */}
          <rect x="24" y="51" width="26" height="20" rx="4" stroke={accent} strokeWidth="1" strokeOpacity="0.75" />
          <rect x="70" y="51" width="26" height="20" rx="4" stroke={accent} strokeWidth="1" strokeOpacity="0.75" />
          <line x1="29" y1="61" x2="45" y2="61" stroke={accent} strokeWidth="1" strokeDasharray="2 2" />
          <circle cx="83" cy="61" r="4.5" stroke={accent} strokeWidth="1.1" />
          <circle cx="83" cy="61" r="1.4" fill={accent} />
          {/* Reflejo diagonal del cristal */}
          <path d="M32 49L26 67M78 49L72 67" stroke={accent} strokeWidth="0.9" strokeOpacity="0.45" />
          {/* Onda de dispersión inferior */}
          <path d="M34 92H86" stroke={stroke} strokeWidth="0.9" strokeDasharray="4 4" strokeOpacity="0.5" />
        </svg>
      );

    case 'carcel_flores':
      return (
        <svg viewBox="0 0 120 120" className="h-full w-full" fill="none">
          {/* Estructura de celda / reja arqueada */}
          <path
            d="M28 96V46C28 29 42 18 60 18C78 18 92 29 92 46V96H28Z"
            fill={soft}
            stroke={stroke}
            strokeWidth="1.7"
          />
          {/* Barrotes verticales y travesaño */}
          {[40, 50, 60, 70, 80].map((x) => (
            <line key={x} x1={x} y1="22" x2={x} y2="96" stroke={stroke} strokeWidth="1.4" strokeOpacity="0.85" />
          ))}
          <line x1="28" y1="56" x2="92" y2="56" stroke={stroke} strokeWidth="1.2" strokeOpacity="0.7" />
          <line x1="22" y1="96" x2="98" y2="96" stroke={accent} strokeWidth="1.6" strokeLinecap="round" />

          {/* Enredaderas y tallos alrededor de los barrotes */}
          <path d="M24 88C16 74 20 56 30 44C24 34 30 22 42 20" stroke={accent} strokeWidth="1.2" strokeLinecap="round" />
          <path d="M96 88C104 74 100 56 90 44C96 34 90 22 78 20" stroke={accent} strokeWidth="1.2" strokeLinecap="round" />

          {/* Flores rodeando la cárcel (dulzura y encierro) */}
          {[
            [24, 46],
            [96, 46],
            [22, 76],
            [98, 76],
            [60, 18],
            [36, 94],
            [84, 94],
          ].map(([fx, fy], idx) => (
            <g key={idx} transform={`translate(${fx} ${fy})`}>
              <circle cx="0" cy="-4.5" r="3" fill="#0d0b09" stroke={accent} strokeWidth="1.1" />
              <circle cx="4.3" cy="-1.2" r="3" fill="#0d0b09" stroke={accent} strokeWidth="1.1" />
              <circle cx="2.7" cy="3.8" r="3" fill="#0d0b09" stroke={accent} strokeWidth="1.1" />
              <circle cx="-2.7" cy="3.8" r="3" fill="#0d0b09" stroke={accent} strokeWidth="1.1" />
              <circle cx="-4.3" cy="-1.2" r="3" fill="#0d0b09" stroke={accent} strokeWidth="1.1" />
              <circle cx="0" cy="0" r="2.2" fill={stroke} />
            </g>
          ))}
        </svg>
      );

    case 'vinilo':
      return (
        <svg viewBox="0 0 120 120" className="h-full w-full" fill="none">
          <circle cx="60" cy="60" r="44" stroke={stroke} strokeWidth="1.8" fill={soft} />
          <circle cx="60" cy="60" r="36" stroke={accent} strokeWidth="0.9" strokeOpacity="0.55" />
          <circle cx="60" cy="60" r="28" stroke={accent} strokeWidth="0.9" strokeOpacity="0.45" />
          <circle cx="60" cy="60" r="20" stroke={accent} strokeWidth="0.9" strokeOpacity="0.4" />
          <circle cx="60" cy="60" r="13" stroke={stroke} strokeWidth="1.5" fill="rgba(11,10,9,0.7)" />
          <circle cx="60" cy="60" r="3" fill={accent} />
          {/* Surco rayado */}
          <path d="M78 24L67 49" stroke={accent} strokeWidth="1.6" strokeLinecap="round" />
          <path d="M35 84L49 71" stroke={accent} strokeWidth="1.1" strokeDasharray="2 2" />
        </svg>
      );

    case 'metronomo':
      return (
        <svg viewBox="0 0 120 120" className="h-full w-full" fill="none">
          <path d="M42 20H78L94 98H26L42 20Z" stroke={stroke} strokeWidth="1.6" fill={soft} />
          <path d="M32 76H88" stroke={accent} strokeWidth="1" strokeOpacity="0.6" />
          <line x1="60" y1="26" x2="60" y2="86" stroke={accent} strokeWidth="0.9" strokeDasharray="3 3" strokeOpacity="0.5" />
          {/* Péndulo descentrado */}
          <line x1="60" y1="86" x2="84" y2="30" stroke={accent} strokeWidth="2.2" strokeLinecap="round" />
          <polygon points="75,44 83,47 79,56 71,53" fill={stroke} stroke={accent} strokeWidth="1" />
          <circle cx="60" cy="86" r="4" fill={accent} />
        </svg>
      );

    case 'matriz':
      return (
        <svg viewBox="0 0 120 120" className="h-full w-full" fill="none">
          <rect x="20" y="20" width="80" height="80" rx="4" stroke={stroke} strokeWidth="1.4" fill={soft} />
          {[36, 52, 68, 84].map((pos) => (
            <g key={pos}>
              <line x1={pos} y1="20" x2={pos} y2="100" stroke={stroke} strokeWidth="0.7" strokeOpacity="0.45" />
              <line x1="20" y1={pos} x2="100" y2={pos} stroke={stroke} strokeWidth="0.7" strokeOpacity="0.45" />
            </g>
          ))}
          {[
            [36, 36, 3],
            [52, 52, 4.5],
            [68, 36, 2.5],
            [84, 68, 3.5],
            [36, 84, 3],
            [68, 84, 4],
            [52, 68, 2.5],
          ].map(([cx, cy, r], i) => (
            <circle key={i} cx={cx} cy={cy} r={r} fill={i % 2 === 0 ? accent : stroke} />
          ))}
          <path d="M36 36L52 52L68 36M52 52L68 84L84 68" stroke={accent} strokeWidth="1.2" strokeOpacity="0.8" />
        </svg>
      );

    case 'caracola':
      return (
        <svg viewBox="0 0 120 120" className="h-full w-full" fill="none">
          <path
            d="M64 62C64 56 58 52 53 55C46 59 46 69 54 74C64 80 77 74 80 62C84 46 72 31 55 30C34 29 20 47 22 68C24 91 48 104 74 96C88 92 98 81 100 68"
            stroke={stroke}
            strokeWidth="2"
            strokeLinecap="round"
            fill={soft}
          />
          <path
            d="M78 34C88 38 96 48 98 58"
            stroke={accent}
            strokeWidth="1.2"
            strokeDasharray="3 3"
            strokeLinecap="round"
          />
          <circle cx="58" cy="61" r="3" fill={accent} />
        </svg>
      );

    case 'partitura':
      return (
        <svg viewBox="0 0 120 120" className="h-full w-full" fill="none">
          <rect x="22" y="18" width="76" height="84" rx="3" stroke={stroke} strokeWidth="1.5" fill={soft} />
          {[34, 42, 50, 58, 66].map((y) => (
            <line key={y} x1="30" y1={y} x2="90" y2={y} stroke={accent} strokeWidth="0.9" strokeOpacity="0.55" />
          ))}
          {/* Notas y tachaduras de palimpsesto */}
          <ellipse cx="44" cy="54" rx="4.5" ry="3.2" fill={accent} />
          <line x1="48" y1="54" x2="48" y2="30" stroke={accent} strokeWidth="1.4" />
          <ellipse cx="64" cy="46" rx="4.5" ry="3.2" stroke={stroke} strokeWidth="1.4" />
          <line x1="68" y1="46" x2="68" y2="26" stroke={stroke} strokeWidth="1.4" />
          <path d="M48 30L68 26" stroke={accent} strokeWidth="1.8" />
          <path d="M34 78C46 72 58 84 72 76C80 72 86 78 88 80" stroke={stroke} strokeWidth="1.3" strokeDasharray="3 2" />
          <line x1="56" y1="36" x2="82" y2="62" stroke={stroke} strokeWidth="1" strokeOpacity="0.6" />
        </svg>
      );

    case 'prisma':
      return (
        <svg viewBox="0 0 120 120" className="h-full w-full" fill="none">
          <polygon points="60,18 98,88 22,88" stroke={stroke} strokeWidth="1.8" fill={soft} />
          <line x1="60" y1="18" x2="60" y2="88" stroke={accent} strokeWidth="1" strokeOpacity="0.5" />
          <line x1="12" y1="62" x2="46" y2="56" stroke={accent} strokeWidth="1.8" strokeLinecap="round" />
          <line x1="72" y1="52" x2="108" y2="42" stroke={accent} strokeWidth="1.4" strokeLinecap="round" />
          <line x1="74" y1="58" x2="108" y2="58" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" />
          <line x1="76" y1="64" x2="108" y2="74" stroke={accent} strokeWidth="1.1" strokeOpacity="0.65" strokeLinecap="round" />
          <circle cx="60" cy="58" r="4" fill={accent} />
        </svg>
      );

    case 'auriculares':
      return (
        <svg viewBox="0 0 120 120" className="h-full w-full" fill="none">
          <path d="M26 66V56C26 36 41 22 60 22C79 22 94 36 94 56V66" stroke={stroke} strokeWidth="2.2" strokeLinecap="round" />
          <path d="M32 56C32 40 44 28 60 28C76 28 88 40 88 56" stroke={accent} strokeWidth="0.9" strokeOpacity="0.55" />
          <rect x="18" y="60" width="16" height="30" rx="7" stroke={stroke} strokeWidth="1.6" fill={soft} />
          <rect x="86" y="60" width="16" height="30" rx="7" stroke={stroke} strokeWidth="1.6" fill={soft} />
          <path d="M46 74C52 68 68 68 74 74" stroke={accent} strokeWidth="1.1" strokeDasharray="2 3" />
          <path d="M26 90C26 102 42 104 54 100" stroke={accent} strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.7" />
        </svg>
      );

    case 'monocordio':
      return (
        <svg viewBox="0 0 120 120" className="h-full w-full" fill="none">
          <rect x="16" y="64" width="88" height="24" rx="2" stroke={stroke} strokeWidth="1.6" fill={soft} />
          <circle cx="60" cy="76" r="6" stroke={accent} strokeWidth="1.2" />
          {/* Puentes y cuerda vibrante */}
          <polygon points="28,64 32,50 36,64" fill={stroke} />
          <polygon points="84,64 88,50 92,64" fill={stroke} />
          <line x1="20" y1="50" x2="100" y2="50" stroke={accent} strokeWidth="1.8" />
          <path d="M32 50Q60 32 88 50" stroke={accent} strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.8" />
          <path d="M32 50Q60 66 88 50" stroke={stroke} strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.7" />
        </svg>
      );

    case 'esfera_ruido':
      return (
        <svg viewBox="0 0 120 120" className="h-full w-full" fill="none">
          <circle cx="60" cy="60" r="40" stroke={stroke} strokeWidth="1.5" fill={soft} />
          <ellipse cx="60" cy="60" rx="40" ry="15" stroke={accent} strokeWidth="0.9" strokeOpacity="0.55" />
          <ellipse cx="60" cy="60" rx="15" ry="40" stroke={accent} strokeWidth="0.9" strokeOpacity="0.55" />
          {[
            [45, 42],
            [56, 35],
            [72, 46],
            [42, 60],
            [60, 58],
            [76, 62],
            [50, 74],
            [68, 78],
            [58, 84],
            [35, 50],
            [82, 52],
          ].map(([cx, cy], idx) => (
            <circle key={idx} cx={cx} cy={cy} r={idx % 3 === 0 ? 2.2 : 1.4} fill={accent} fillOpacity="0.85" />
          ))}
        </svg>
      );

    default:
      return (
        <svg viewBox="0 0 120 120" className="h-full w-full" fill="none">
          <circle cx="60" cy="60" r="38" stroke={stroke} strokeWidth="1.5" fill={soft} />
          <path d="M38 60H82M60 38V82" stroke={accent} strokeWidth="1.4" />
        </svg>
      );
  }
}

export default function IconoObjeto({
  tipoIconoSVG,
  imagenObjeto = null,
  alt = 'Objeto simbólico',
  perspectiva = 'sujeto',
  className = 'h-24 w-24',
}) {
  const [imgError, setImgError] = useState(false);
  const colors = PALETA[perspectiva] || PALETA.sujeto;

  // Si cambia la ruta de imagenObjeto (al navegar entre casos o reemplazar assets), reintentar carga
  useEffect(() => {
    setImgError(false);
  }, [imagenObjeto]);

  const mostrarImagenPersonalizada = Boolean(imagenObjeto) && !imgError;

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden rounded-xl border border-stone-800/80 bg-stone-950/70 p-2.5 ${className}`}
    >
      {mostrarImagenPersonalizada ? (
        <img
          src={imagenObjeto}
          alt={alt}
          onError={() => setImgError(true)}
          className="h-full w-full rounded-lg object-cover"
        />
      ) : (
        renderSVGPorTipo(tipoIconoSVG, colors)
      )}
    </div>
  );
}
