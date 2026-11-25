import { useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  BookMarked,
  Cpu,
  Feather,
  FileText,
  Headphones,
  Layers,
  Pause,
  Play,
  Radio,
  Quote,
  Sliders,
  VolumeX,
} from 'lucide-react';
import IconoObjeto from './IconoObjeto';
import PanelConfrontacion from './PanelConfrontacion';

const ESTACIONES_META = [
  {
    key: 'sujeto',
    propiedad: 'objetoSujeto',
    posicion: 'Izquierda',
    romano: 'I',
    tituloRol: 'Objeto del Sujeto',
    subtituloRol: 'Memoria íntima y autodefinición',
    colorHex: '#d27d46',
    colorClaro: '#f0b88f',
    badgeClass: 'border-[#d27d46]/45 bg-[#d27d46]/12 text-[#f0b88f]',
    bordeActivo: 'border-[#d27d46]/75 shadow-[0_0_32px_rgba(210,125,70,0.22)]',
    ondaColor: 'border-[#d27d46]/60',
    barraColor: 'bg-[#d27d46]',
    focoGrad:
      'radial-gradient(ellipse at 50% 0%, rgba(210,125,70,0.26) 0%, rgba(210,125,70,0) 72%)',
  },
  {
    key: 'compositor',
    propiedad: 'objetoCompositor',
    posicion: 'Centro',
    romano: 'II',
    tituloRol: 'Objeto del Compositor',
    subtituloRol: 'Escucha situada y mediación estética',
    colorHex: '#7ba393',
    colorClaro: '#b6d5c8',
    badgeClass: 'border-[#7ba393]/45 bg-[#7ba393]/12 text-[#b6d5c8]',
    bordeActivo: 'border-[#7ba393]/75 shadow-[0_0_32px_rgba(123,163,147,0.22)]',
    ondaColor: 'border-[#7ba393]/60',
    barraColor: 'bg-[#7ba393]',
    focoGrad:
      'radial-gradient(ellipse at 50% 0%, rgba(123,163,147,0.24) 0%, rgba(123,163,147,0) 72%)',
  },
  {
    key: 'ia',
    propiedad: 'objetoIA',
    posicion: 'Derecha',
    romano: 'III',
    tituloRol: 'Objeto de la IA',
    subtituloRol: 'Síntesis estadística y predicción afectiva',
    colorHex: '#74a4c4',
    colorClaro: '#b2d4ec',
    badgeClass: 'border-[#74a4c4]/45 bg-[#74a4c4]/12 text-[#b2d4ec]',
    bordeActivo: 'border-[#74a4c4]/75 shadow-[0_0_32px_rgba(116,164,196,0.24)]',
    ondaColor: 'border-[#74a4c4]/60',
    barraColor: 'bg-[#74a4c4]',
    focoGrad:
      'radial-gradient(ellipse at 50% 0%, rgba(116,164,196,0.25) 0%, rgba(116,164,196,0) 72%)',
  },
];

function crearEstadoInicialAudios() {
  return {
    sujeto: { estado: 'cargando', isPlaying: false, currentTime: 0, duration: 0 },
    compositor: { estado: 'cargando', isPlaying: false, currentTime: 0, duration: 0 },
    ia: { estado: 'cargando', isPlaying: false, currentTime: 0, duration: 0 },
  };
}

function formatearTiempo(segundos) {
  if (!Number.isFinite(segundos) || segundos < 0) return '0:00';
  const m = Math.floor(segundos / 60);
  const s = Math.floor(segundos % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function PasilloCaso({
  caso,
  indiceActual = 0,
  totalCasos = 4,
  casoAnterior = null,
  casoSiguiente = null,
  reflexionGuardada = '',
  onGuardarReflexion,
  onVolverTorre,
  onCambiarCaso,
  onAbrirBitacora,
}) {
  // Referencias independientes de <audio> para permitir Modo Babel (hasta 3 pistas simultáneas)
  const audioRefs = useRef({
    sujeto: null,
    compositor: null,
    ia: null,
  });

  const [estacionSeleccionada, setEstacionSeleccionada] = useState(null);
  const [modoBabel, setModoBabel] = useState(false); // Desactivado por defecto (modo exclusivo)
  const [avisoPendienteKey, setAvisoPendienteKey] = useState(null);
  const [exploradas, setExploradas] = useState({});
  const [audios, setAudios] = useState(crearEstadoInicialAudios);

  const pausarEstacion = (key, reiniciar = false) => {
    const el = audioRefs.current[key];
    if (el) {
      el.pause();
      if (reiniciar) {
        el.currentTime = 0;
      }
    }
    setAudios((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        isPlaying: false,
        currentTime: reiniciar ? 0 : prev[key].currentTime,
      },
    }));
  };

  const silenciarTodo = () => {
    ESTACIONES_META.forEach(({ key }) => {
      const el = audioRefs.current[key];
      if (el) {
        el.pause();
      }
    });
    setAudios((prev) => ({
      sujeto: { ...prev.sujeto, isPlaying: false },
      compositor: { ...prev.compositor, isPlaying: false },
      ia: { ...prev.ia, isPlaying: false },
    }));
  };

  // Reiniciar estado de audios y lectura al cambiar de caso
  useEffect(() => {
    ESTACIONES_META.forEach(({ key }) => {
      const el = audioRefs.current[key];
      if (el) {
        el.pause();
        el.currentTime = 0;
      }
    });
    setAudios(crearEstadoInicialAudios());
    setEstacionSeleccionada(null);
    setAvisoPendienteKey(null);
    setExploradas({});
  }, [caso.id]);

  // Limpieza garantizada al desmontar el pasillo
  useEffect(() => {
    const refsSnapshot = audioRefs.current;
    return () => {
      Object.values(refsSnapshot).forEach((el) => {
        if (el) el.pause();
      });
    };
  }, []);

  const handleLoadedMetadata = (key, event) => {
    const dur = event.currentTarget.duration;
    setAudios((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        estado: 'disponible',
        duration: Number.isFinite(dur) ? dur : 0,
      },
    }));
  };

  const handleAudioError = (key) => {
    setAudios((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        estado: 'pendiente',
        isPlaying: false,
        currentTime: 0,
        duration: 0,
      },
    }));
  };

  const handleTimeUpdate = (key, event) => {
    const t = event.currentTarget.currentTime;
    setAudios((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        currentTime: t,
      },
    }));
  };

  const handleEnded = (key) => {
    setAudios((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        isPlaying: false,
        currentTime: 0,
      },
    }));
  };

  const handleToggleModoBabel = () => {
    const next = !modoBabel;
    setModoBabel(next);

    // Al volver a modo exclusivo, mantener solo la estación seleccionada (si estaba sonando) y pausar el resto
    if (!next) {
      const activas = ESTACIONES_META.map((m) => m.key).filter((k) => audios[k].isPlaying);
      if (activas.length > 1) {
        const conservar =
          estacionSeleccionada && audios[estacionSeleccionada]?.isPlaying
            ? estacionSeleccionada
            : activas[0];
        activas.forEach((k) => {
          if (k !== conservar) pausarEstacion(k, false);
        });
      }
    }
  };

  const activarObjeto = async (meta) => {
    const { key } = meta;
    const estadoEstacion = audios[key];
    const audioEl = audioRefs.current[key];

    // Siempre abrir los textos críticos en el mural lateral y marcar como explorada
    setEstacionSeleccionada(key);
    setExploradas((prev) => ({ ...prev, [key]: true }));

    // Si el archivo aún no existe o falló al cargar: advertir discretamente sin romper la experiencia
    if (estadoEstacion.estado === 'pendiente' || !audioEl) {
      setAvisoPendienteKey(key);
      return;
    }

    setAvisoPendienteKey(null);

    // Si ya está reproduciéndose, pausar esta pista
    if (estadoEstacion.isPlaying) {
      pausarEstacion(key, false);
      return;
    }

    // En modo normal (exclusivo), detener cualquier otro audio activo antes de reproducir
    if (!modoBabel) {
      ESTACIONES_META.forEach((otra) => {
        if (otra.key !== key) {
          pausarEstacion(otra.key, false);
        }
      });
    }

    try {
      await audioEl.play();
      setAudios((prev) => ({
        ...prev,
        [key]: {
          ...prev[key],
          estado: 'disponible',
          isPlaying: true,
        },
      }));
    } catch {
      // Si el navegador rechaza reproducción por archivo inexistente o corrupto
      handleAudioError(key);
      setAvisoPendienteKey(key);
    }
  };

  const handleSeek = (key, nuevoTiempo) => {
    const el = audioRefs.current[key];
    if (!el || audios[key].estado !== 'disponible') return;
    const tiempoSeguro = Math.min(Math.max(Number(nuevoTiempo), 0), audios[key].duration || 0);
    el.currentTime = tiempoSeguro;
    setAudios((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        currentTime: tiempoSeguro,
      },
    }));
  };

  const handleSalir = () => {
    silenciarTodo();
    onVolverTorre?.();
  };

  const pistasActivas = ESTACIONES_META.filter((m) => audios[m.key].isPlaying);
  const metaActiva = ESTACIONES_META.find((m) => m.key === estacionSeleccionada) || null;
  const objetoActivo = metaActiva ? caso[metaActiva.propiedad] : null;
  const audioActivo = metaActiva ? audios[metaActiva.key] : null;
  const exploradasCount = Object.keys(exploradas).length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Elementos <audio> independientes por estación con onLoadedMetadata y onError */}
      {ESTACIONES_META.map((meta) => {
        const objeto = caso[meta.propiedad];
        return (
          <audio
            key={`${caso.id}-${meta.key}`}
            ref={(el) => {
              audioRefs.current[meta.key] = el;
            }}
            src={objeto.rutaAudio}
            preload="metadata"
            onLoadedMetadata={(e) => handleLoadedMetadata(meta.key, e)}
            onError={() => handleAudioError(meta.key)}
            onTimeUpdate={(e) => handleTimeUpdate(meta.key, e)}
            onEnded={() => handleEnded(meta.key)}
          />
        );
      })}

      {/* ================================================================
          ENCABEZADO DEL PASILLO + RETORNO A LA TORRE DE BABEL
         ================================================================ */}
      <section className="mb-6 flex flex-col gap-4 rounded-2xl border border-stone-800/85 bg-stone-950/85 p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleSalir}
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[#d27d46]/50 bg-[#d27d46]/12 px-4 py-2 font-mono text-xs uppercase tracking-[0.16em] text-[#f0b88f] transition-colors hover:bg-[#d27d46]/22"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Volver al exterior de la Torre</span>
          </button>

          <div className="flex flex-wrap items-center gap-2.5 font-mono text-[11px] text-stone-400">
            <span className="rounded-full border border-stone-800 bg-stone-900/80 px-3 py-1">
              {caso.nivelTorre}
            </span>
            <span className="rounded-full border border-stone-800 bg-stone-900/80 px-3 py-1">
              Explorados: {exploradasCount}/3 pedestales
            </span>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-3 border-t border-stone-800/75 pt-4 md:flex-row md:items-end">
          <div className="max-w-3xl">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-stone-500">
              Interior del Umbral 0{indiceActual + 1} / 0{totalCasos}
            </p>
            <h2 className="mt-1 font-serif text-3xl font-semibold text-stone-50 sm:text-4xl">
              Pasillo de {caso.seudonimo}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-stone-300">
              {caso.descripcionUmbral}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2 font-mono text-[11px] text-stone-400">
            <Headphones className="h-4 w-4 text-[#d27d46]" />
            <span>Haz clic en cada objeto para escuchar y abrir su lectura</span>
          </div>
        </div>
      </section>

      {/* ================================================================
          ESPACIO PRINCIPAL: GALERÍA DE 3 PEDESTALES + MURAL LATERAL
         ================================================================ */}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.38fr)_minmax(350px,0.92fr)]">
        {/* PERSPECTIVA VISUAL DE PASILLO / GALERÍA CON 3 PEDESTALES ALINEADOS */}
        <section
          aria-label="Galería interior con tres pedestales"
          className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-stone-800/90 bg-[#0d0b09] p-5 shadow-2xl shadow-black/60 sm:p-7"
        >
          {/* Fondo arquitectónico en perspectiva SVG */}
          <svg
            aria-hidden="true"
            viewBox="0 0 800 540"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-0 h-full w-full"
          >
            <defs>
              <linearGradient id="pasillo-techo" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#1c1814" stopOpacity="0.92" />
                <stop offset="55%" stopColor="#110e0c" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#0b0a09" stopOpacity="0.95" />
              </linearGradient>
              <linearGradient id="pasillo-suelo" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#171411" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#26201a" stopOpacity="0.95" />
              </linearGradient>
              <pattern
                id="pasillo-hatch"
                width="10"
                height="10"
                patternUnits="userSpaceOnUse"
                patternTransform="rotate(40)"
              >
                <line x1="0" y1="0" x2="0" y2="10" stroke="#c7b99e" strokeWidth="0.5" strokeOpacity="0.11" />
              </pattern>
            </defs>

            <rect width="800" height="540" fill="url(#pasillo-techo)" />
            <rect width="800" height="390" fill="url(#pasillo-hatch)" />

            {/* Muros laterales en perspectiva */}
            <polygon
              points="0,0 135,98 135,388 0,520"
              fill="#14110e"
              stroke="#c7b99e"
              strokeWidth="0.9"
              strokeOpacity="0.22"
            />
            <polygon
              points="800,0 665,98 665,388 800,520"
              fill="#120f0d"
              stroke="#c7b99e"
              strokeWidth="0.9"
              strokeOpacity="0.22"
            />

            {/* Muro del fondo */}
            <rect
              x="135"
              y="98"
              width="530"
              height="290"
              fill="#100e0c"
              stroke="#c7b99e"
              strokeWidth="0.9"
              strokeOpacity="0.24"
            />

            {/* Tres nichos alineados detrás de los pedestales */}
            <path
              d="M168 388 V176 A62 62 0 0 1 292 176 V388"
              fill="#0b0a09"
              fillOpacity="0.65"
              stroke="#d27d46"
              strokeWidth="0.9"
              strokeOpacity="0.26"
            />
            <path
              d="M338 388 V164 A62 62 0 0 1 462 164 V388"
              fill="#0b0a09"
              fillOpacity="0.65"
              stroke="#7ba393"
              strokeWidth="0.9"
              strokeOpacity="0.26"
            />
            <path
              d="M508 388 V176 A62 62 0 0 1 632 176 V388"
              fill="#0b0a09"
              fillOpacity="0.65"
              stroke="#74a4c4"
              strokeWidth="0.9"
              strokeOpacity="0.26"
            />

            {/* Bóvedas sucesivas */}
            <path d="M40 165 Q400 -24 760 165" fill="none" stroke="#c7b99e" strokeWidth="1" strokeOpacity="0.25" />
            <path
              d="M92 140 Q400 18 708 140"
              fill="none"
              stroke="#c7b99e"
              strokeWidth="0.85"
              strokeOpacity="0.2"
              strokeDasharray="3 4"
            />
            <path d="M135 122 Q400 44 665 122" fill="none" stroke="#c7b99e" strokeWidth="0.75" strokeOpacity="0.18" />

            {/* Suelo de losas en fuga */}
            <polygon
              points="135,388 665,388 800,540 0,540"
              fill="url(#pasillo-suelo)"
              stroke="#c7b99e"
              strokeWidth="0.9"
              strokeOpacity="0.26"
            />
            <g stroke="#c7b99e" strokeWidth="0.7" strokeOpacity="0.16">
              <line x1="230" y1="388" x2="120" y2="540" />
              <line x1="340" y1="388" x2="295" y2="540" />
              <line x1="460" y1="388" x2="505" y2="540" />
              <line x1="570" y1="388" x2="680" y2="540" />
              <line x1="100" y1="425" x2="700" y2="425" />
              <line x1="56" y1="472" x2="744" y2="472" />
              <line x1="18" y1="514" x2="782" y2="514" />
            </g>
          </svg>

          {/* Barra superior de la galería: Modo Babel (Escucha superpuesta) + Silenciar todo */}
          <div className="relative z-10 mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-stone-800/70 pb-3.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                role="switch"
                aria-checked={modoBabel}
                onClick={handleToggleModoBabel}
                className={`inline-flex cursor-pointer items-center gap-2.5 rounded-xl border px-3 py-1.5 text-left transition-all ${
                  modoBabel
                    ? 'border-[#d27d46]/70 bg-[#d27d46]/15 text-[#f0b88f]'
                    : 'border-stone-800 bg-stone-950/80 text-stone-300 hover:border-stone-700'
                }`}
              >
                <Layers className="h-3.5 w-3.5 shrink-0" />
                <span className="font-mono text-[11px] tracking-wide">
                  Modo Babel (Escucha superpuesta)
                </span>
                {/* Indicador tipo switch */}
                <span
                  className={`relative inline-flex h-4 w-7 shrink-0 items-center rounded-full transition-colors ${
                    modoBabel ? 'bg-[#d27d46]' : 'bg-stone-700'
                  }`}
                >
                  <span
                    className={`inline-block h-3 w-3 rounded-full bg-stone-950 transition-transform ${
                      modoBabel ? 'translate-x-3.5' : 'translate-x-0.5'
                    }`}
                  />
                </span>
              </button>

              {modoBabel && (
                <span className="font-mono text-[10px] text-stone-400">
                  Hasta 3 voces simultáneas ({pistasActivas.length}/3 sonando)
                </span>
              )}
            </div>

            {pistasActivas.length > 0 && (
              <button
                type="button"
                onClick={silenciarTodo}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-stone-700 bg-stone-950/90 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-stone-200 transition-colors hover:border-[#d27d46]/60 hover:text-[#f0b88f]"
              >
                <VolumeX className="h-3.5 w-3.5" />
                <span>Silenciar todo ({pistasActivas.length})</span>
              </button>
            )}
          </div>

          {/* 3 ESTACIONES / PEDESTALES ALINEADOS: Izquierda (Sujeto), Centro (Compositor), Derecha (IA) */}
          <div className="relative z-10 grid gap-5 sm:grid-cols-3 sm:items-start">
            {ESTACIONES_META.map((meta) => {
              const objeto = caso[meta.propiedad];
              const audioInfo = audios[meta.key];
              const esSeleccionada = estacionSeleccionada === meta.key;
              const estaSonando = audioInfo.isPlaying;
              const esPendiente = audioInfo.estado === 'pendiente';
              const mostrarControlesDebajo = estaSonando || esSeleccionada;

              return (
                <div key={meta.key} className="relative flex flex-col items-center">
                  {/* Haz de luz cenital que ilumina el pedestal activo */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-8 inset-x-0 h-56 transition-opacity duration-500"
                    style={{
                      background: meta.focoGrad,
                      opacity: estaSonando ? 1 : esSeleccionada ? 0.62 : 0.2,
                    }}
                  />

                  {/* Etiqueta de posición sobre el nicho */}
                  <span
                    className={`relative z-10 mb-3 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.16em] transition-colors ${
                      esSeleccionada || estaSonando
                        ? meta.badgeClass
                        : 'border-stone-800 bg-stone-950/75 text-stone-400'
                    }`}
                  >
                    <span>{meta.romano}</span>
                    <span className="opacity-50">·</span>
                    <span>{meta.posicion}</span>
                  </span>

                  {/* Botón interactivo del Objeto Simbólico */}
                  <button
                    type="button"
                    onClick={() => activarObjeto(meta)}
                    aria-pressed={estaSonando}
                    aria-label={`${meta.tituloRol}: ${objeto.nombreObjeto}. ${
                      esPendiente
                        ? 'Archivo de audio pendiente por cargar. Haz clic para leer sus textos críticos.'
                        : estaSonando
                          ? 'Pausar audio'
                          : 'Reproducir audio y abrir lectura'
                    }`}
                    className="group relative z-10 flex cursor-pointer flex-col items-center focus:outline-none"
                  >
                    {/* Ondas sonoras concéntricas cuando el objeto está sonando */}
                    <div className="relative flex h-36 w-36 items-center justify-center">
                      {estaSonando && (
                        <>
                          <span
                            aria-hidden="true"
                            className={`animate-onda-1 pointer-events-none absolute inset-1 rounded-full border ${meta.ondaColor}`}
                          />
                          <span
                            aria-hidden="true"
                            className={`animate-onda-2 pointer-events-none absolute inset-1 rounded-full border ${meta.ondaColor}`}
                          />
                          <span
                            aria-hidden="true"
                            className={`animate-onda-3 pointer-events-none absolute inset-1 rounded-full border ${meta.ondaColor}`}
                          />
                        </>
                      )}

                      {/* Contenedor animado del objeto (imagenObjeto o SVG de respaldo) */}
                      <div
                        className={`relative rounded-2xl border bg-stone-950/85 p-2 transition-all duration-300 ${
                          estaSonando
                            ? `animate-objeto-pulso ${meta.bordeActivo}`
                            : esSeleccionada
                              ? meta.bordeActivo
                              : 'border-stone-800/90 group-hover:-translate-y-1 group-hover:border-stone-600'
                        }`}
                      >
                        <IconoObjeto
                          tipoIconoSVG={objeto.tipoIconoSVG}
                          imagenObjeto={objeto.imagenObjeto}
                          alt={objeto.nombreObjeto}
                          perspectiva={meta.key}
                          className="h-24 w-24 border-0 bg-transparent p-1"
                        />

                        {/* Insignia de estado (Play / Pause / Pendiente) */}
                        <span
                          className="absolute -bottom-2.5 -right-2.5 flex h-8 w-8 items-center justify-center rounded-full border shadow-lg transition-transform group-hover:scale-110"
                          style={{
                            backgroundColor: esPendiente
                              ? '#1c1917'
                              : estaSonando
                                ? meta.colorHex
                                : '#141210',
                            borderColor: esPendiente ? '#78716c' : meta.colorClaro,
                            color: esPendiente
                              ? '#a8a29e'
                              : estaSonando
                                ? '#0b0a09'
                                : meta.colorClaro,
                          }}
                          title={
                            esPendiente
                              ? 'Archivo pendiente por cargar (clic para leer textos)'
                              : estaSonando
                                ? 'Pausar pista'
                                : 'Reproducir pista'
                          }
                        >
                          {esPendiente ? (
                            <AlertTriangle className="h-3.5 w-3.5" />
                          ) : estaSonando ? (
                            <Pause className="h-3.5 w-3.5" />
                          ) : (
                            <Play className="ml-0.5 h-3.5 w-3.5" />
                          )}
                        </span>
                      </div>
                    </div>

                    {/* PEDESTAL ARQUITECTÓNICO DE PIEDRA */}
                    <div className="mt-3 flex w-full min-w-[172px] max-w-[214px] flex-col items-center">
                      <div
                        className="h-2 w-[92%] rounded-t-sm border-x border-t transition-colors"
                        style={{
                          borderColor: estaSonando || esSeleccionada ? meta.colorHex : '#3a332c',
                          backgroundColor: '#24201b',
                        }}
                      />
                      <div
                        className={`w-[86%] border-x border-b px-3 py-3.5 text-center transition-all ${
                          estaSonando || esSeleccionada
                            ? 'border-stone-600 bg-gradient-to-b from-[#231f1a] to-[#15120f]'
                            : 'border-stone-800 bg-gradient-to-b from-[#1b1814] to-[#110f0d] group-hover:border-stone-700'
                        }`}
                      >
                        <p
                          className="font-mono text-[9.5px] uppercase tracking-[0.18em]"
                          style={{ color: meta.colorClaro }}
                        >
                          {meta.tituloRol}
                        </p>
                        <h3 className="mt-1 font-serif text-base font-semibold leading-snug text-stone-100">
                          {objeto.nombreObjeto}
                        </h3>

                        {/* Etiqueta discreta de estado sobre la placa del pedestal */}
                        {esPendiente ? (
                          <span className="mt-2 inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 font-mono text-[9.5px] text-amber-300/90">
                            <AlertTriangle className="h-2.5 w-2.5" />
                            <span>Archivo pendiente por cargar</span>
                          </span>
                        ) : (
                          <p className="mt-1.5 font-mono text-[10px] text-stone-500">
                            {estaSonando ? '● Escuchando' : 'Clic para escuchar'}
                          </p>
                        )}
                      </div>
                      <div className="h-2.5 w-full rounded-b-sm border border-stone-800 bg-[#191613]" />
                    </div>
                  </button>

                  {/* BARRA DE PROGRESO MINIMALISTA DEBAJO DEL PEDESTAL (solo si está reproduciéndose o seleccionado) */}
                  {mostrarControlesDebajo && (
                    <div className="relative z-10 mt-3 w-full max-w-[214px] rounded-xl border border-stone-800/90 bg-stone-950/90 px-3 py-2.5">
                      {esPendiente ? (
                        <div className="space-y-1 text-center">
                          <p className="font-mono text-[10px] text-amber-300/90">
                            Archivo pendiente por cargar
                          </p>
                          <p className="truncate font-mono text-[9.5px] text-stone-500">
                            {objeto.rutaAudio}
                          </p>
                          <p className="text-[10px] text-stone-400">
                            Lectura crítica disponible en el mural
                          </p>
                        </div>
                      ) : (
                        <>
                          <div className="mb-1 flex items-center justify-between font-mono text-[10px] text-stone-400">
                            <span>{formatearTiempo(audioInfo.currentTime)}</span>
                            <span>{formatearTiempo(audioInfo.duration)}</span>
                          </div>
                          <input
                            type="range"
                            min={0}
                            max={audioInfo.duration || 0}
                            step={0.1}
                            value={Math.min(audioInfo.currentTime, audioInfo.duration || 0)}
                            onChange={(e) => handleSeek(meta.key, e.target.value)}
                            disabled={!audioInfo.duration}
                            aria-label={`Adelantar o retroceder ${objeto.nombreObjeto}`}
                            className="babel-range w-full"
                            style={{ '--thumb-color': meta.colorClaro }}
                          />
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Pie técnico de la galería */}
          <div className="relative z-10 mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-stone-800/75 pt-3 font-mono text-[11px] text-stone-500">
            <span className="flex items-center gap-1.5">
              <Radio
                className="h-3.5 w-3.5"
                style={{
                  color: pistasActivas.length > 0 ? '#f0b88f' : '#57534e',
                }}
              />
              <span>
                {pistasActivas.length === 0
                  ? 'Modo normal: una pista a la vez · Activa Modo Babel para superponer voces'
                  : pistasActivas.length === 1
                    ? `Escuchando: ${pistasActivas[0].tituloRol}`
                    : `Fricción activa: ${pistasActivas.map((p) => p.romano).join(' + ')} en simultáneo`}
              </span>
            </span>
          </div>
        </section>

        {/* ================================================================
            PANEL LATERAL / MURAL DEL PASILLO (TEXTOS CRÍTICOS DE LA VISIÓN)
           ================================================================ */}
        <aside
          aria-label="Mural de lectura del pasillo"
          className="flex flex-col rounded-2xl border border-stone-800/90 bg-gradient-to-b from-stone-950/95 via-[#13110e] to-stone-950/95 p-5 sm:p-6"
        >
          <div className="mb-4 flex items-center justify-between gap-2 border-b border-stone-800/80 pb-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-stone-400">
              Mural del Pasillo
            </span>
            <div className="flex gap-1.5">
              {ESTACIONES_META.map((m) => {
                const activo = estacionSeleccionada === m.key;
                return (
                  <button
                    key={m.key}
                    type="button"
                    onClick={() => activarObjeto(m)}
                    title={`Abrir y escuchar: ${m.tituloRol}`}
                    className={`cursor-pointer rounded-md border px-2 py-0.5 font-mono text-[10px] uppercase transition-colors ${
                      activo
                        ? m.badgeClass
                        : 'border-stone-800 bg-stone-900/70 text-stone-500 hover:border-stone-700 hover:text-stone-300'
                    }`}
                  >
                    {m.romano}
                  </button>
                );
              })}
            </div>
          </div>

          {!metaActiva || !objetoActivo || !audioActivo ? (
            <div className="flex flex-1 flex-col items-center justify-center py-10 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-stone-800 bg-stone-900/70">
                <Headphones className="h-6 w-6 text-[#d27d46]" />
              </div>
              <h3 className="font-serif text-2xl font-medium text-stone-100">
                El mural aguarda tu escucha
              </h3>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-stone-400">
                Haz clic sobre cualquiera de los tres objetos en sus pedestales para reproducir su
                audio (si ya está cargado) y leer aquí sus textos críticos.
              </p>

              <div className="mt-6 grid w-full max-w-sm gap-2">
                {ESTACIONES_META.map((m) => (
                  <button
                    key={m.key}
                    type="button"
                    onClick={() => activarObjeto(m)}
                    className="flex cursor-pointer items-center justify-between rounded-xl border border-stone-800/90 bg-stone-900/50 px-3.5 py-2.5 text-left text-xs text-stone-300 transition-colors hover:border-stone-700 hover:bg-stone-900"
                  >
                    <span>
                      <strong
                        className="font-mono text-[10px] uppercase tracking-wider"
                        style={{ color: m.colorClaro }}
                      >
                        {m.romano} · {m.tituloRol}
                      </strong>
                      <span className="block text-stone-400">{caso[m.propiedad].nombreObjeto}</span>
                    </span>
                    <Play className="h-3.5 w-3.5 shrink-0 text-stone-400" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div key={metaActiva.key} className="animate-mural-reveal flex flex-1 flex-col">
              {/* Encabezado de la visión activa */}
              <div>
                <span
                  className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.16em] ${metaActiva.badgeClass}`}
                >
                  {metaActiva.romano} · {metaActiva.tituloRol}
                </span>
                <h3 className="mt-2 font-serif text-2xl font-semibold leading-snug text-stone-50">
                  {objetoActivo.nombreObjeto}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-stone-400">
                  {objetoActivo.descripcionSimbolica}
                </p>
              </div>

              {/* Ficha sonora + aviso seguro cuando el archivo aún no existe */}
              <div className="mt-4 rounded-xl border border-stone-800/90 bg-stone-950/90 p-3.5">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => activarObjeto(metaActiva)}
                    disabled={audioActivo.estado === 'pendiente'}
                    aria-label={
                      audioActivo.estado === 'pendiente'
                        ? 'Archivo de audio pendiente por cargar'
                        : audioActivo.isPlaying
                          ? 'Pausar'
                          : 'Reproducir'
                    }
                    className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border transition-colors disabled:cursor-not-allowed disabled:opacity-45"
                    style={{
                      borderColor:
                        audioActivo.estado === 'pendiente' ? '#78716c' : metaActiva.colorClaro,
                      backgroundColor:
                        audioActivo.isPlaying && audioActivo.estado === 'disponible'
                          ? metaActiva.colorHex
                          : 'transparent',
                      color:
                        audioActivo.isPlaying && audioActivo.estado === 'disponible'
                          ? '#0b0a09'
                          : metaActiva.colorClaro,
                    }}
                  >
                    {audioActivo.estado === 'pendiente' ? (
                      <AlertTriangle className="h-4 w-4 text-amber-300" />
                    ) : audioActivo.isPlaying ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="ml-0.5 h-4 w-4" />
                    )}
                  </button>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-stone-100">
                      {metaActiva.key === 'sujeto'
                        ? objetoActivo.tituloCancion
                        : metaActiva.key === 'compositor'
                          ? objetoActivo.tituloPieza
                          : objetoActivo.tituloPiezaIA}
                    </p>
                    <p className="truncate text-xs text-stone-400">
                      {metaActiva.key === 'sujeto'
                        ? objetoActivo.artista
                        : metaActiva.key === 'compositor'
                          ? objetoActivo.compositor
                            ? `Compositor: ${objetoActivo.compositor}`
                            : metaActiva.subtituloRol
                          : objetoActivo.modeloIA
                            ? `Compuesta por: ${objetoActivo.modeloIA}`
                            : metaActiva.subtituloRol}
                    </p>
                  </div>
                </div>

                {audioActivo.estado === 'pendiente' ? (
                  <div
                    role="status"
                    className={`mt-3 rounded-lg border px-3 py-2 text-xs ${
                      avisoPendienteKey === metaActiva.key
                        ? 'border-amber-500/45 bg-amber-500/10 text-amber-200'
                        : 'border-stone-800 bg-stone-900/70 text-stone-300'
                    }`}
                  >
                    <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-amber-300">
                      Archivo pendiente por cargar
                    </p>
                    <p className="mt-0.5 text-[11px] leading-relaxed text-stone-300">
                      Coloca el audio en <code className="text-amber-200">{objetoActivo.rutaAudio}</code>{' '}
                      (carpeta <code className="text-stone-200">public/audios/</code>). Mientras
                      tanto puedes explorar sus textos críticos abajo.
                    </p>
                  </div>
                ) : (
                  <div className="mt-2.5 flex items-center justify-between border-t border-stone-800/70 pt-2 font-mono text-[10px] text-stone-500">
                    <span className="truncate">{objetoActivo.rutaAudio}</span>
                    <span className="shrink-0 text-stone-400">
                      {formatearTiempo(audioActivo.currentTime)} /{' '}
                      {formatearTiempo(audioActivo.duration)}
                    </span>
                  </div>
                )}
              </div>

              {/* Textos curatoriales siempre legibles aunque el audio esté pendiente */}
              <div className="mt-4 flex-1 space-y-3.5">
                {metaActiva.key === 'sujeto' && (
                  <>
                    <div className="rounded-xl border border-[#d27d46]/25 bg-[#d27d46]/6 p-4">
                      <div className="mb-1.5 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-[#f0b88f]">
                        <Quote className="h-3.5 w-3.5" />
                        <span>Cita de la canción</span>
                      </div>
                      <blockquote className="whitespace-pre-line font-serif text-lg italic leading-relaxed text-stone-100">
                        {objetoActivo.citaAutodefinicion}
                      </blockquote>
                    </div>

                    <div className="rounded-xl border border-stone-800/80 bg-stone-900/45 p-4">
                      <div className="mb-1.5 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-stone-400">
                        <FileText className="h-3.5 w-3.5" />
                        <span>Nota crítica</span>
                      </div>
                      <p className="text-sm leading-relaxed text-stone-300">
                        {objetoActivo.notaCritica}
                      </p>
                    </div>
                  </>
                )}

                {metaActiva.key === 'compositor' && (
                  <>
                    <div className="rounded-xl border border-[#7ba393]/25 bg-[#7ba393]/6 p-4">
                      <div className="mb-1.5 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-[#b6d5c8]">
                        <Sliders className="h-3.5 w-3.5" />
                        <span>Decisiones compositivas</span>
                      </div>
                      <p className="text-sm leading-relaxed text-stone-200">
                        {objetoActivo.decisionesCompositivas}
                      </p>
                    </div>

                    <div className="rounded-xl border border-stone-800/80 bg-stone-900/45 p-4">
                      <div className="mb-1.5 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-stone-400">
                        <Feather className="h-3.5 w-3.5" />
                        <span>Tensión interpretativa</span>
                      </div>
                      <p className="text-sm leading-relaxed text-stone-300">
                        {objetoActivo.tensionInterpretativa}
                      </p>
                    </div>
                  </>
                )}

                {metaActiva.key === 'ia' && (
                  <>
                    <div className="rounded-xl border border-[#74a4c4]/25 bg-[#74a4c4]/6 p-4">
                      <div className="mb-1.5 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-[#b2d4ec]">
                        <Cpu className="h-3.5 w-3.5" />
                        <span>Texto generado por IA</span>
                      </div>
                      <p className="font-mono text-xs leading-relaxed text-stone-200">
                        {objetoActivo.textoGeneradoIA}
                      </p>
                    </div>

                    <div className="rounded-xl border border-stone-800/80 bg-stone-900/45 p-4">
                      <div className="mb-1.5 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-stone-400">
                        <AlertCircle className="h-3.5 w-3.5" />
                        <span>Crítica algorítmica</span>
                      </div>
                      <p className="text-sm leading-relaxed text-stone-300">
                        {objetoActivo.criticaAlgoritmica}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* ================================================================
          FONDO DEL PASILLO: PREGUNTA DE CONFRONTACIÓN Y REFLEXIÓN
         ================================================================ */}
      <div className="mt-8">
        <div className="mb-3 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.24em] text-stone-500">
          <span className="h-px flex-1 bg-stone-800" />
          <span>Fondo del Pasillo · Ábside de Confrontación</span>
          <span className="h-px flex-1 bg-stone-800" />
        </div>

        <PanelConfrontacion
          caso={caso}
          reflexionGuardada={reflexionGuardada}
          onGuardarReflexion={onGuardarReflexion}
        />
      </div>

      {/* ================================================================
          NAVEGACIÓN FINAL: DESCENDER / BITÁCORA FINAL / EXTERIOR / ASCENDER
         ================================================================ */}
      <nav
        aria-label="Navegación desde el pasillo"
        className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-stone-800/80 pt-5"
      >
        <button
          type="button"
          onClick={() => {
            if (casoAnterior) {
              silenciarTodo();
              onCambiarCaso?.(casoAnterior.id);
            }
          }}
          disabled={!casoAnterior}
          className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-stone-800 bg-stone-950/80 px-4 py-2.5 font-mono text-xs uppercase tracking-[0.14em] text-stone-300 transition-colors hover:border-stone-700 hover:text-stone-100 disabled:cursor-not-allowed disabled:opacity-35"
        >
          <ArrowDown className="h-4 w-4" />
          <span>{casoAnterior ? `Descender · ${casoAnterior.nivelTorre}` : 'Base de la Torre'}</span>
        </button>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleSalir}
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-stone-700 bg-stone-900/75 px-4 py-2.5 font-mono text-xs uppercase tracking-[0.14em] text-stone-200 transition-colors hover:border-[#d27d46]/60 hover:text-[#f0b88f]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Exterior de la Torre</span>
          </button>

          {onAbrirBitacora && (
            <button
              type="button"
              onClick={() => {
                silenciarTodo();
                onAbrirBitacora();
              }}
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[#7ba393]/50 bg-[#7ba393]/12 px-4 py-2.5 font-mono text-xs uppercase tracking-[0.14em] text-[#b6d5c8] transition-colors hover:bg-[#7ba393]/22"
            >
              <BookMarked className="h-3.5 w-3.5" />
              <span>Bitácora Final</span>
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => {
            if (casoSiguiente) {
              silenciarTodo();
              onCambiarCaso?.(casoSiguiente.id);
            }
          }}
          disabled={!casoSiguiente}
          className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[#d27d46]/45 bg-[#d27d46]/12 px-4 py-2.5 font-mono text-xs uppercase tracking-[0.14em] text-[#f0b88f] transition-colors hover:bg-[#d27d46]/20 disabled:cursor-not-allowed disabled:opacity-35"
        >
          <span>{casoSiguiente ? `Ascender · ${casoSiguiente.nivelTorre}` : 'Cúspide alcanzada'}</span>
          <ArrowUp className="h-4 w-4" />
        </button>
      </nav>
    </div>
  );
}
