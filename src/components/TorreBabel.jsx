import { useState } from 'react';
import { ArrowUpRight, BookMarked, CheckCircle2, Compass } from 'lucide-react';

/**
 * Coordenadas arquitectónicas de las 4 entradas/arcos sobre el lienzo SVG (viewBox 0 0 900 720).
 * Cada entrada corresponde a uno de los 4 casos de src/data/casos.js, desde la base hasta la cúspide inconclusa.
 */
const ENTRADAS_TORRE = [
  {
    casoId: 'caso-1',
    codigo: 'I',
    // Centro del arco en coordenadas del viewBox (900 x 720)
    cx: 356,
    cy: 562,
    ancho: 62,
    alto: 86,
    pista:
      '¿Cómo se representa la mamertería? Tres expresiones musicales en resistencia alrededor de Jennifer.',
    ladoEtiqueta: 'izquierda',
  },
  {
    casoId: 'caso-2',
    codigo: 'II',
    cx: 530,
    cy: 432,
    ancho: 54,
    alto: 74,
    pista: 'Conversión Software versión 41.0',
    ladoEtiqueta: 'derecha',
  },
  {
    casoId: 'caso-3',
    codigo: 'III',
    cx: 386,
    cy: 312,
    ancho: 48,
    alto: 66,
    pista: 'Tres idiomas a media voz resonando dentro de una caracola de cerámica.',
    ladoEtiqueta: 'izquierda',
  },
  {
    casoId: 'caso-4',
    codigo: 'IV',
    cx: 468,
    cy: 196,
    ancho: 44,
    alto: 60,
    pista: 'Andamios al viento, silencio abierto y una identidad en construcción.',
    ladoEtiqueta: 'derecha',
  },
];

const VIEWBOX_W = 900;
const VIEWBOX_H = 720;

export default function TorreBabel({
  casos = [],
  reflexiones = {},
  onEntrarCaso,
  onAbrirManifiesto,
  onAbrirBitacora,
}) {
  const [hoveredId, setHoveredId] = useState(null);
  const [transicionEntrada, setTransicionEntrada] = useState(null);

  const casosPorId = Object.fromEntries(casos.map((c) => [c.id, c]));

  const entradasActivas = ENTRADAS_TORRE.map((entrada, idx) => {
    const caso = casosPorId[entrada.casoId] || casos[idx];
    if (!caso) return null;
    return {
      ...entrada,
      caso,
      originX: (entrada.cx / VIEWBOX_W) * 100,
      originY: (entrada.cy / VIEWBOX_H) * 100,
    };
  }).filter(Boolean);

  const entradaHover = entradasActivas.find((e) => e.caso.id === hoveredId) || null;
  const totalReflexiones = casos.filter((c) => Boolean(reflexiones[c.id]?.trim())).length;

  const iniciarIngreso = (entrada) => {
    if (transicionEntrada) return;
    setHoveredId(entrada.caso.id);
    setTransicionEntrada({
      casoId: entrada.caso.id,
      originX: entrada.originX,
      originY: entrada.originY,
      nivel: entrada.caso.nivelTorre,
      seudonimo: entrada.caso.seudonimo,
    });

    // Duración sincronizada con el zoom/fundido arquitectónico hacia el arco
    setTimeout(() => {
      onEntrarCaso(entrada.caso.id);
    }, 640);
  };

  const estiloZoom = transicionEntrada
    ? {
        transformOrigin: `${transicionEntrada.originX}% ${transicionEntrada.originY}%`,
        transform: 'scale(2.35)',
        opacity: 0,
        filter: 'brightness(1.25) blur(1.5px)',
      }
    : {
        transformOrigin: '50% 50%',
        transform: 'scale(1)',
        opacity: 1,
        filter: 'brightness(1) blur(0px)',
      };

  return (
    <div className="relative flex min-h-[calc(100vh-84px)] flex-col justify-between overflow-hidden">
      {/* Velo cálido de fundido durante el ingreso a un umbral */}
      <div
        aria-hidden="true"
        className={`pointer-events-none fixed inset-0 z-40 transition-opacity duration-500 ${
          transicionEntrada ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background:
            'radial-gradient(circle at center, rgba(210,125,70,0.22) 0%, rgba(11,10,9,0.96) 72%)',
        }}
      >
        {transicionEntrada && (
          <div className="flex h-full flex-col items-center justify-center px-6 text-center">
            <span className="font-mono text-xs uppercase tracking-[0.28em] text-[#f0b88f]">
              Cruzando {transicionEntrada.nivel}
            </span>
            <p className="mt-2 font-serif text-3xl italic text-stone-100 sm:text-4xl">
              Pasillo de {transicionEntrada.seudonimo}
            </p>
          </div>
        )}
      </div>

      {/* Contenedor principal con transición de zoom/fundido */}
      <div
        className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 pb-8 pt-6 transition-all duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)] sm:px-6 lg:px-8"
        style={estiloZoom}
      >
        {/* Franja superior editorial (encabezado de lámina de archivo) */}
        <div className="mb-4 flex flex-wrap items-end justify-between gap-4 border-b border-stone-800/80 pb-4">
          <div className="max-w-2xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#d27d46]">
              Lámina I · Elevación Exterior · Archivo Crítico
            </p>
            <h2 className="mt-1.5 font-serif text-3xl font-medium leading-tight text-stone-50 sm:text-4xl">
              Elige un umbral para ingresar a la Torre
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-stone-400">
              Cada arco resguarda una biografía sonora fracturada en tres lenguas: la memoria del{' '}
              <span className="text-[#f0b88f]">Sujeto</span>, la mediación del{' '}
              <span className="text-[#b6d5c8]">Compositor</span> y la síntesis de la{' '}
              <span className="text-[#b2d4ec]">IA</span>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] text-stone-400">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-stone-800 bg-stone-950/80 px-3 py-1.5">
              <Compass className="h-3.5 w-3.5 text-[#d27d46]" />
              <span>{entradasActivas.length} arcos accesibles</span>
            </span>
            <button
              type="button"
              onClick={onAbrirBitacora}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[#7ba393]/50 bg-[#7ba393]/12 px-3.5 py-1.5 text-[#b6d5c8] transition-colors hover:bg-[#7ba393]/22"
            >
              <BookMarked className="h-3.5 w-3.5" />
              <span>
                Muro de Síntesis ({totalReflexiones}/{casos.length})
              </span>
            </button>
          </div>
        </div>

        {/* Escena arquitectónica interactiva */}
        <div className="relative mx-auto w-full max-w-5xl flex-1">
          <div className="relative overflow-hidden rounded-2xl border border-stone-800/90 bg-gradient-to-b from-[#13110f] via-[#0e0c0a] to-[#0a0908] shadow-2xl shadow-black/70">
            {/* Marco sutil interior tipo grabado impreso */}
            <div className="pointer-events-none absolute inset-3 rounded-xl border border-stone-700/25" />

            {/* Ilustración SVG arquitectónica en estilo grabado contemporáneo */}
            <svg
              viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
              role="img"
              aria-label="Ilustración arquitectónica exterior de la Torre de Babel con 4 entradas interactivas"
              className="block h-auto w-full select-none"
            >
              <defs>
                {/* Trama de grabado diagonal (buril) */}
                <pattern
                  id="hatch-diagonal"
                  width="8"
                  height="8"
                  patternUnits="userSpaceOnUse"
                  patternTransform="rotate(35)"
                >
                  <line x1="0" y1="0" x2="0" y2="8" stroke="#c7b99e" strokeWidth="0.55" strokeOpacity="0.16" />
                </pattern>

                {/* Trama cruzada para zonas en sombra profunda */}
                <pattern id="hatch-cross" width="7" height="7" patternUnits="userSpaceOnUse">
                  <path d="M0 7L7 0M-1 1L1 -1M6 8L8 6" stroke="#c7b99e" strokeWidth="0.5" strokeOpacity="0.14" />
                  <path d="M0 0L7 7" stroke="#0b0a09" strokeWidth="0.6" strokeOpacity="0.45" />
                </pattern>

                {/* Hiladas de sillares de piedra */}
                <pattern id="stone-courses" width="36" height="14" patternUnits="userSpaceOnUse">
                  <path
                    d="M0 14H36M18 0V14M0 7H36"
                    stroke="#d6cab4"
                    strokeWidth="0.45"
                    strokeOpacity="0.14"
                    fill="none"
                  />
                </pattern>

                {/* Degradado atmosférico del cielo */}
                <radialGradient id="sky-halo" cx="50%" cy="32%" r="58%">
                  <stop offset="0%" stopColor="#d27d46" stopOpacity="0.14" />
                  <stop offset="42%" stopColor="#8c7a62" stopOpacity="0.06" />
                  <stop offset="100%" stopColor="#0b0a09" stopOpacity="0" />
                </radialGradient>

                {/* Degradado de piedra esculpida para muros */}
                <linearGradient id="tower-stone" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#24201b" />
                  <stop offset="32%" stopColor="#322c25" />
                  <stop offset="68%" stopColor="#211d18" />
                  <stop offset="100%" stopColor="#14120f" />
                </linearGradient>

                <linearGradient id="tower-stone-light" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#302a23" />
                  <stop offset="45%" stopColor="#3f372e" />
                  <stop offset="100%" stopColor="#1a1714" />
                </linearGradient>

                {/* Degradado interior cálido de los umbrales iluminados */}
                <radialGradient id="arch-warm-glow" cx="50%" cy="62%" r="65%">
                  <stop offset="0%" stopColor="#ffdfad" stopOpacity="0.95" />
                  <stop offset="38%" stopColor="#d27d46" stopOpacity="0.78" />
                  <stop offset="78%" stopColor="#7a3f1d" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#14110f" stopOpacity="0" />
                </radialGradient>

                <radialGradient id="arch-idle-glow" cx="50%" cy="70%" r="65%">
                  <stop offset="0%" stopColor="#d27d46" stopOpacity="0.34" />
                  <stop offset="65%" stopColor="#52321e" stopOpacity="0.14" />
                  <stop offset="100%" stopColor="#0e0c0a" stopOpacity="0" />
                </radialGradient>

                <filter id="warm-bloom" x="-60%" y="-60%" width="220%" height="220%">
                  <feGaussianBlur stdDeviation="7" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                <linearGradient id="ground-fade" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#26211c" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#0b0a09" stopOpacity="1" />
                </linearGradient>
              </defs>

              {/* Fondo atmosférico y retícula de lámina topográfica */}
              <rect width={VIEWBOX_W} height={VIEWBOX_H} fill="url(#sky-halo)" />

              {/* Líneas sutiles de medición y ejes arquitectónicos */}
              <g stroke="#c7b99e" strokeOpacity="0.11" strokeWidth="0.75">
                <line x1="450" y1="36" x2="450" y2="668" strokeDasharray="3 6" />
                <line x1="88" y1="196" x2="812" y2="196" strokeDasharray="2 7" />
                <line x1="88" y1="312" x2="812" y2="312" strokeDasharray="2 7" />
                <line x1="88" y1="432" x2="812" y2="432" strokeDasharray="2 7" />
                <line x1="88" y1="562" x2="812" y2="562" strokeDasharray="2 7" />
                {/* Arcos astronómicos / ondas de sonido concéntricas sobre la cúspide */}
                <circle cx="450" cy="155" r="110" fill="none" strokeDasharray="2 5" />
                <circle cx="450" cy="155" r="175" fill="none" strokeDasharray="1 7" />
                <circle cx="450" cy="155" r="245" fill="none" strokeDasharray="1 9" />
              </g>

              {/* Referencias de umbrales en el margen izquierdo (sin valores numéricos de altura) */}
              <g fill="#9e907b" fontFamily="JetBrains Mono, monospace" fontSize="10" opacity="0.68">
                <text x="42" y="199">UMBRAL IV</text>
                <text x="42" y="315">UMBRAL III</text>
                <text x="42" y="435">UMBRAL II</text>
                <text x="42" y="565">UMBRAL I</text>
                <text x="42" y="655">CIMIENTOS</text>
              </g>

              {/* Anotaciones marginales a la derecha */}
              <g fill="#9e907b" fontFamily="JetBrains Mono, monospace" fontSize="9.5" opacity="0.52" textAnchor="end">
                <text x="858" y="62">REF. ARCHIVO // BABEL-04</text>
                <text x="858" y="77">ESCALA SIMBÓLICA 1:∞</text>
                <text x="858" y="655">SEDIMENTO ACÚSTICO</text>
              </g>

              {/* Nubes / bruma de grabado horizontal */}
              <g className="animate-bruma" stroke="#c7b99e" strokeWidth="0.9" strokeLinecap="round" opacity="0.32">
                <path d="M108 174H232M138 182H258M124 190H202" />
                <path d="M640 132H772M668 140H790M694 148H756" />
                <path d="M675 268H804M695 276H784" />
                <path d="M96 364H205M118 372H186" />
              </g>

              {/* Horízonte y terreno escarpado de base */}
              <path
                d="M0 644 Q145 622 255 636 T520 638 T755 628 Q830 622 900 640 L900 720 L0 720 Z"
                fill="url(#ground-fade)"
              />
              <path
                d="M0 644 Q145 622 255 636 T520 638 T755 628 Q830 622 900 640"
                fill="none"
                stroke="#8f816c"
                strokeWidth="1.2"
                strokeOpacity="0.45"
              />
              {/* Trama de grabado en el terreno */}
              <path
                d="M70 662H235M140 676H320M570 668H785M620 684H830M260 692H610"
                stroke="#c7b99e"
                strokeWidth="0.7"
                strokeOpacity="0.18"
              />

              {/* =================================================================
                  CUERPO ARQUITECTÓNICO DE LA TORRE DE BABEL (4 NIVELES + CÚSPIDE)
                 ================================================================= */}

              {/* --- NIVEL I: BASAMENTO MONUMENTAL (y: 492 -> 642) --- */}
              <g id="torre-nivel-1">
                {/* Volumen principal */}
                <polygon
                  points="196,642 224,494 676,494 704,642"
                  fill="url(#tower-stone)"
                  stroke="#b9aa92"
                  strokeWidth="1.4"
                  strokeOpacity="0.6"
                />
                {/* Textura de hiladas y sombra derecha */}
                <polygon points="196,642 224,494 676,494 704,642" fill="url(#stone-courses)" />
                <polygon points="525,494 676,494 704,642 548,642" fill="url(#hatch-cross)" opacity="0.85" />

                {/* Contrafuertes inclinados laterales */}
                <polygon points="174,642 204,522 224,522 208,642" fill="#1e1a16" stroke="#a69780" strokeWidth="1" strokeOpacity="0.55" />
                <polygon points="726,642 696,522 676,522 692,642" fill="#14120f" stroke="#8c7e6a" strokeWidth="1" strokeOpacity="0.45" />

                {/* Arcadas ciegas rítmicas del primer nivel */}
                {[248, 286, 444, 488, 532, 576, 620].map((x) => (
                  <path
                    key={`arc1-${x}`}
                    d={`M${x} 638 V578 A13 13 0 0 1 ${x + 26} 578 V638`}
                    fill="#100e0c"
                    fillOpacity="0.72"
                    stroke="#b5a58d"
                    strokeWidth="0.9"
                    strokeOpacity="0.4"
                  />
                ))}

                {/* Rampa exterior ascendente de Nivel I a Nivel II */}
                <polygon
                  points="212,520 678,480 682,494 218,534"
                  fill="#383129"
                  stroke="#cbbca3"
                  strokeWidth="1.1"
                  strokeOpacity="0.65"
                />
                {/* Cornisa superior Nivel I */}
                <rect x="214" y="486" width="472" height="10" fill="#2c2620" stroke="#c7b99e" strokeWidth="1" strokeOpacity="0.55" />
              </g>

              {/* --- NIVEL II: GALERÍA DE ARCOS (y: 368 -> 486) --- */}
              <g id="torre-nivel-2">
                <polygon
                  points="248,486 272,368 628,368 652,486"
                  fill="url(#tower-stone-light)"
                  stroke="#b9aa92"
                  strokeWidth="1.35"
                  strokeOpacity="0.62"
                />
                <polygon points="248,486 272,368 628,368 652,486" fill="url(#stone-courses)" />
                <polygon points="502,368 628,368 652,486 520,486" fill="url(#hatch-cross)" opacity="0.82" />

                {/* Columnata y arcos secundarios */}
                {[284, 320, 356, 392, 428, 464, 586].map((x) => (
                  <path
                    key={`arc2-${x}`}
                    d={`M${x} 484 V434 A11 11 0 0 1 ${x + 22} 434 V484`}
                    fill="#110f0d"
                    fillOpacity="0.72"
                    stroke="#b5a58d"
                    strokeWidth="0.85"
                    strokeOpacity="0.42"
                  />
                ))}

                {/* Rampa helicoidal hacia Nivel III */}
                <polygon
                  points="642,394 268,358 266,370 644,406"
                  fill="#362f27"
                  stroke="#cbbca3"
                  strokeWidth="1.05"
                  strokeOpacity="0.6"
                />
                {/* Cornisa Nivel II */}
                <rect x="262" y="360" width="376" height="9" fill="#2c2620" stroke="#c7b99e" strokeWidth="1" strokeOpacity="0.55" />
              </g>

              {/* --- NIVEL III: CLAUSTRO DE LAS LENGUAS (y: 254 -> 360) --- */}
              <g id="torre-nivel-3">
                <polygon
                  points="296,360 318,254 582,254 604,360"
                  fill="url(#tower-stone)"
                  stroke="#b9aa92"
                  strokeWidth="1.3"
                  strokeOpacity="0.62"
                />
                <polygon points="296,360 318,254 582,254 604,360" fill="url(#hatch-diagonal)" />
                <polygon points="484,254 582,254 604,360 496,360" fill="url(#hatch-cross)" opacity="0.82" />

                {/* Arcos del claustro */}
                {[326, 434, 466, 498, 530, 560].map((x) => (
                  <path
                    key={`arc3-${x}`}
                    d={`M${x} 358 V314 A9.5 9.5 0 0 1 ${x + 19} 314 V358`}
                    fill="#110f0d"
                    fillOpacity="0.76"
                    stroke="#b5a58d"
                    strokeWidth="0.8"
                    strokeOpacity="0.44"
                  />
                ))}

                {/* Rampa hacia Nivel IV */}
                <polygon
                  points="310,282 590,248 592,258 312,292"
                  fill="#342d26"
                  stroke="#cbbca3"
                  strokeWidth="1"
                  strokeOpacity="0.6"
                />
                {/* Cornisa Nivel III */}
                <rect x="308" y="246" width="284" height="9" fill="#2c2620" stroke="#c7b99e" strokeWidth="1" strokeOpacity="0.55" />
              </g>

              {/* --- NIVEL IV: MIRADOR INCONCLUSO Y ANDAMIOS (y: 124 -> 246) --- */}
              <g id="torre-nivel-4">
                {/* Cuerpo superior inacabado con borde superior roto / escalonado */}
                <path
                  d="M342 246 L356 154 L388 154 L394 136 L432 136 L440 148 L478 148 L484 128 L522 128 L528 164 L544 164 L558 246 Z"
                  fill="url(#tower-stone-light)"
                  stroke="#c7b99e"
                  strokeWidth="1.25"
                  strokeOpacity="0.65"
                />
                <path
                  d="M342 246 L356 154 L388 154 L394 136 L432 136 L440 148 L478 148 L484 128 L522 128 L528 164 L544 164 L558 246 Z"
                  fill="url(#hatch-diagonal)"
                />
                <polygon points="468,148 522,128 558,246 476,246" fill="url(#hatch-cross)" opacity="0.75" />

                {/* Ventanas altas secundarias */}
                {[372, 404, 508].map((x) => (
                  <path
                    key={`arc4-${x}`}
                    d={`M${x} 244 V204 A8.5 8.5 0 0 1 ${x + 17} 204 V244`}
                    fill="#110f0d"
                    fillOpacity="0.78"
                    stroke="#b5a58d"
                    strokeWidth="0.8"
                    strokeOpacity="0.45"
                  />
                ))}

                {/* Andamiaje y grúa de madera/hierro (obra inacabada de Babel) */}
                <g stroke="#d27d46" strokeOpacity="0.58" strokeWidth="1.15" fill="none">
                  {/* Torres de andamio izquierda */}
                  <line x1="358" y1="154" x2="358" y2="102" />
                  <line x1="378" y1="154" x2="378" y2="108" />
                  <line x1="352" y1="126" x2="386" y2="126" />
                  <line x1="358" y1="126" x2="378" y2="152" strokeOpacity="0.4" />
                  <line x1="378" y1="126" x2="358" y2="152" strokeOpacity="0.4" />

                  {/* Pluma/grúa central apuntando al cielo */}
                  <line x1="504" y1="128" x2="504" y2="76" stroke="#e6c89c" strokeOpacity="0.65" />
                  <line x1="504" y1="84" x2="578" y2="62" stroke="#e6c89c" strokeOpacity="0.7" />
                  <line x1="504" y1="104" x2="554" y2="70" strokeOpacity="0.45" />
                  <line x1="564" y1="67" x2="564" y2="112" stroke="#c7b99e" strokeDasharray="2 2" />
                  {/* Bloque suspendido */}
                  <rect x="556" y="112" width="16" height="10" fill="#2c2620" stroke="#e6c89c" strokeWidth="0.9" />
                </g>

                {/* Finas líneas ascendentes inconclusas hacia el vacío */}
                <g stroke="#c7b99e" strokeWidth="0.75" strokeOpacity="0.28" strokeDasharray="3 5">
                  <line x1="394" y1="136" x2="404" y2="72" />
                  <line x1="484" y1="128" x2="478" y2="62" />
                </g>
              </g>

              {/* =================================================================
                  4 ENTRADAS / ARCOS INTERACTIVOS CORRESPONDIENTES A casos.js
                 ================================================================= */}
              {entradasActivas.map((entrada) => {
                const { caso, cx, cy, ancho, alto, codigo } = entrada;
                const esHover = hoveredId === caso.id;
                const tieneReflexion = Boolean(reflexiones[caso.id]?.trim());

                const halfW = ancho / 2;
                const radio = halfW;
                const baseY = cy + alto / 2;
                const springY = cy - alto / 2 + radio;

                const dArco = `M ${cx - halfW} ${baseY} V ${springY} A ${radio} ${radio} 0 0 1 ${cx + halfW} ${springY} V ${baseY} Z`;
                const dMarcoExt = `M ${cx - halfW - 6} ${baseY} V ${springY} A ${radio + 6} ${radio + 6} 0 0 1 ${cx + halfW + 6} ${springY} V ${baseY}`;

                return (
                  <g
                    key={caso.id}
                    role="button"
                    tabIndex={0}
                    aria-label={`${caso.nivelTorre}: ${caso.seudonimo}. ${entrada.pista} Haz clic para entrar.`}
                    className="cursor-pointer outline-none"
                    onMouseEnter={() => setHoveredId(caso.id)}
                    onMouseLeave={() => setHoveredId((prev) => (prev === caso.id ? null : prev))}
                    onFocus={() => setHoveredId(caso.id)}
                    onBlur={() => setHoveredId((prev) => (prev === caso.id ? null : prev))}
                    onClick={() => iniciarIngreso(entrada)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        iniciarIngreso(entrada);
                      }
                    }}
                  >
                    {/* Halo luminoso proyectado fuera del umbral al hacer hover */}
                    <ellipse
                      cx={cx}
                      cy={cy + 6}
                      rx={esHover ? ancho * 1.35 : ancho * 0.85}
                      ry={esHover ? alto * 0.9 : alto * 0.62}
                      fill={esHover ? 'url(#arch-warm-glow)' : 'url(#arch-idle-glow)'}
                      style={{
                        transition: 'all 320ms cubic-bezier(0.22, 1, 0.36, 1)',
                        opacity: esHover ? 0.95 : 0.45,
                      }}
                    />

                    {/* Haz de luz sobre el suelo del umbral */}
                    <polygon
                      points={`${cx - halfW},${baseY} ${cx + halfW},${baseY} ${cx + halfW + 24},${baseY + 24} ${cx - halfW - 24},${baseY + 24}`}
                      fill="url(#arch-warm-glow)"
                      style={{
                        transition: 'opacity 320ms ease',
                        opacity: esHover ? 0.52 : 0.08,
                      }}
                    />

                    {/* Moldura de piedra exterior (dovelas del arco) */}
                    <path
                      d={dMarcoExt}
                      fill="none"
                      stroke={esHover ? '#f3c58e' : '#c7b99e'}
                      strokeWidth={esHover ? '2.2' : '1.4'}
                      strokeOpacity={esHover ? '0.95' : '0.62'}
                      style={{ transition: 'all 260ms ease' }}
                    />

                    {/* Interior del vano / portal */}
                    <path
                      d={dArco}
                      fill={esHover ? 'url(#arch-warm-glow)' : '#090807'}
                      stroke={esHover ? '#ffe6be' : '#d27d46'}
                      strokeWidth={esHover ? '1.8' : '1.15'}
                      strokeOpacity={esHover ? '1' : '0.68'}
                      filter={esHover ? 'url(#warm-bloom)' : undefined}
                      style={{ transition: 'all 280ms ease' }}
                    />

                    {/* Profundidad interior en perspectiva (pasillo que se adentra en la torre) */}
                    <path
                      d={`M ${cx - halfW * 0.56} ${baseY} V ${springY + 5} A ${radio * 0.56} ${radio * 0.56} 0 0 1 ${cx + halfW * 0.56} ${springY + 5} V ${baseY}`}
                      fill="none"
                      stroke={esHover ? '#fff4dc' : '#d27d46'}
                      strokeWidth="0.9"
                      strokeOpacity={esHover ? '0.85' : '0.32'}
                      style={{ transition: 'all 280ms ease' }}
                    />

                    {/* Escalón luminoso del umbral */}
                    <line
                      x1={cx - halfW - 7}
                      y1={baseY}
                      x2={cx + halfW + 7}
                      y2={baseY}
                      stroke={esHover ? '#ffe2b3' : '#d27d46'}
                      strokeWidth={esHover ? '2.5' : '1.4'}
                      strokeLinecap="round"
                    />

                    {/* Clave numerada en la cúspide del arco */}
                    <circle
                      cx={cx}
                      cy={springY - radio - 6}
                      r={esHover ? 11 : 9.5}
                      fill={esHover ? '#d27d46' : '#181512'}
                      stroke={esHover ? '#ffe6be' : '#d27d46'}
                      strokeWidth="1.2"
                      style={{ transition: 'all 260ms ease' }}
                    />
                    <text
                      x={cx}
                      y={springY - radio - 2.5}
                      textAnchor="middle"
                      fontFamily="JetBrains Mono, monospace"
                      fontSize="9.5"
                      fontWeight="600"
                      fill={esHover ? '#0b0a09' : '#f0b88f'}
                    >
                      {codigo}
                    </text>

                    {/* Indicador sutil si ya tiene nota registrada en bitácora */}
                    {tieneReflexion && (
                      <circle
                        cx={cx + halfW + 7}
                        cy={springY - 4}
                        r="4"
                        fill="#7ba393"
                        stroke="#0b0a09"
                        strokeWidth="1.2"
                      />
                    )}

                    {/* Área táctil/clic generosa invisible para facilitar la interacción */}
                    <rect
                      x={cx - halfW - 14}
                      y={springY - radio - 20}
                      width={ancho + 28}
                      height={alto + 28}
                      fill="transparent"
                    />
                  </g>
                );
              })}
            </svg>

            {/* Etiqueta flotante contextual al pasar el cursor sobre una entrada */}
            {entradaHover && !transicionEntrada && (
              <div
                key={entradaHover.caso.id}
                className="animate-etiqueta-flotante pointer-events-none absolute z-20 hidden w-72 rounded-xl border border-[#d27d46]/60 bg-stone-950/92 p-3.5 shadow-2xl shadow-black/80 backdrop-blur-md md:block"
                style={{
                  left: `${Math.min(Math.max(entradaHover.originX, 20), 80)}%`,
                  top: `${Math.max(entradaHover.originY - 9, 14)}%`,
                }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#f0b88f]">
                    {entradaHover.caso.nivelTorre}
                  </span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-[#f0b88f]" />
                </div>

                <p className="mt-1 font-serif text-xl font-semibold text-stone-50">
                  {entradaHover.caso.seudonimo}
                </p>

                <p className="mt-1 text-xs leading-relaxed text-stone-300">
                  {entradaHover.pista}
                </p>

                <div className="mt-2.5 flex items-center justify-between border-t border-stone-800/90 pt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-stone-400">
                  <span>Objeto: {entradaHover.caso.objetoSujeto.nombreObjeto}</span>
                </div>
              </div>
            )}
          </div>

          {/* Índice inferior interactivo (también facilita navegación móvil y sincroniza hover con los arcos) */}
          <div className="mt-4 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
            {entradasActivas.map((entrada) => {
              const esHover = hoveredId === entrada.caso.id;
              const tieneReflexion = Boolean(reflexiones[entrada.caso.id]?.trim());

              return (
                <button
                  key={entrada.caso.id}
                  type="button"
                  onMouseEnter={() => setHoveredId(entrada.caso.id)}
                  onMouseLeave={() => setHoveredId((prev) => (prev === entrada.caso.id ? null : prev))}
                  onFocus={() => setHoveredId(entrada.caso.id)}
                  onBlur={() => setHoveredId((prev) => (prev === entrada.caso.id ? null : prev))}
                  onClick={() => iniciarIngreso(entrada)}
                  className={`group flex cursor-pointer flex-col justify-between rounded-xl border p-3.5 text-left transition-all ${
                    esHover
                      ? 'border-[#d27d46]/70 bg-gradient-to-b from-[#d27d46]/15 to-stone-950/90 shadow-lg shadow-black/40'
                      : 'border-stone-800/85 bg-stone-950/75 hover:border-stone-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`font-mono text-[10px] uppercase tracking-[0.16em] ${
                          esHover ? 'text-[#f0b88f]' : 'text-stone-500'
                        }`}
                      >
                        Arco {entrada.codigo}
                      </span>
                      {tieneReflexion ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#7ba393]" />
                      ) : (
                        <ArrowUpRight
                          className={`h-3.5 w-3.5 transition-transform ${
                            esHover ? 'translate-x-0.5 -translate-y-0.5 text-[#f0b88f]' : 'text-stone-600'
                          }`}
                        />
                      )}
                    </div>

                    <p className="mt-1 font-serif text-lg font-semibold text-stone-100">
                      {entrada.caso.seudonimo}
                    </p>
                    <p className="font-mono text-[10px] text-stone-400">
                      {entrada.caso.nivelTorre}
                    </p>
                  </div>

                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-stone-400 group-hover:text-stone-300">
                    {entrada.pista}
                  </p>
                </button>
              );
            })}
          </div>

          {onAbrirManifiesto && (
            <div className="mt-5 flex justify-center">
              <button
                type="button"
                onClick={onAbrirManifiesto}
                className="cursor-pointer font-mono text-[11px] uppercase tracking-[0.2em] text-stone-500 underline decoration-stone-700 underline-offset-4 transition-colors hover:text-[#f0b88f] hover:decoration-[#d27d46]"
              >
                Leer nota curatorial sobre la metáfora de Babel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
