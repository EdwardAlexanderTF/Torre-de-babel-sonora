import { useEffect, useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Radio, Sparkles } from 'lucide-react';

function formatearTiempo(segundos) {
  if (!Number.isFinite(segundos) || segundos < 0) return '0:00';
  const min = Math.floor(segundos / 60);
  const seg = Math.floor(segundos % 60);
  return `${min}:${seg.toString().padStart(2, '0')}`;
}

const FRECUENCIAS_REFERENCIA = {
  sujeto: [220, 261.63, 329.63], // La menor cálido (memoria íntima)
  compositor: [196, 293.66, 392, 440], // Quintas abiertas y suspensión camerística
  ia: [261.63, 329.63, 392, 523.25], // Acorde cristalino sintético
};

const ESTILOS_PERSPECTIVA = {
  sujeto: {
    bar: 'bg-[#d27d46]',
    ring: 'border-[#d27d46]/40 hover:border-[#d27d46]',
    btn: 'bg-[#d27d46]/15 text-[#f0b88f] hover:bg-[#d27d46]/25 border-[#d27d46]/40',
    badge: 'text-[#f0b88f]',
  },
  compositor: {
    bar: 'bg-[#7ba393]',
    ring: 'border-[#7ba393]/40 hover:border-[#7ba393]',
    btn: 'bg-[#7ba393]/15 text-[#b6d5c8] hover:bg-[#7ba393]/25 border-[#7ba393]/40',
    badge: 'text-[#b6d5c8]',
  },
  ia: {
    bar: 'bg-[#74a4c4]',
    ring: 'border-[#74a4c4]/40 hover:border-[#74a4c4]',
    btn: 'bg-[#74a4c4]/15 text-[#b2d4ec] hover:bg-[#74a4c4]/25 border-[#74a4c4]/40',
    badge: 'text-[#b2d4ec]',
  },
};

export default function ReproductorAudio({
  rutaAudio,
  titulo,
  subtitulo,
  perspectiva = 'sujeto',
  playerId,
  activePlayerId,
  onActivate,
}) {
  const audioRef = useRef(null);
  const synthRef = useRef(null);
  const synthTimerRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [modoReferencia, setModoReferencia] = useState(false);
  const [progresoSintetico, setProgresoSintetico] = useState(0);

  const estilo = ESTILOS_PERSPECTIVA[perspectiva] || ESTILOS_PERSPECTIVA.sujeto;

  const detenerSintetizador = () => {
    if (synthTimerRef.current) {
      clearInterval(synthTimerRef.current);
      synthTimerRef.current = null;
    }
    if (synthRef.current) {
      const { ctx, masterGain, oscillators } = synthRef.current;
      try {
        masterGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.15);
        setTimeout(() => {
          oscillators.forEach((osc) => {
            try {
              osc.stop();
            } catch {
              // ya detenido
            }
          });
          ctx.close().catch(() => {});
        }, 180);
      } catch {
        ctx.close().catch(() => {});
      }
      synthRef.current = null;
    }
  };

  const iniciarSintetizadorReferencia = () => {
    detenerSintetizador();
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.0001, ctx.currentTime);
    masterGain.gain.exponentialRampToValueAtTime(isMuted ? 0.0001 : 0.06, ctx.currentTime + 0.4);
    masterGain.connect(ctx.destination);

    const freqs = FRECUENCIAS_REFERENCIA[perspectiva] || FRECUENCIAS_REFERENCIA.sujeto;
    const waveType = perspectiva === 'sujeto' ? 'triangle' : perspectiva === 'compositor' ? 'sine' : 'sine';

    const oscillators = freqs.map((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = waveType;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      if (perspectiva === 'compositor') {
        osc.detune.setValueAtTime(idx % 2 === 0 ? -4 : 5, ctx.currentTime);
      }
      gain.gain.setValueAtTime(0.35 / freqs.length, ctx.currentTime);
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start();
      return osc;
    });

    synthRef.current = { ctx, masterGain, oscillators };
    setModoReferencia(true);
    setIsPlaying(true);

    const inicio = Date.now();
    const duracionDemo = 18; // segundos de escucha de referencia
    synthTimerRef.current = setInterval(() => {
      const transcurrido = (Date.now() - inicio) / 1000;
      if (transcurrido >= duracionDemo) {
        detenerSintetizador();
        setIsPlaying(false);
        setProgresoSintetico(0);
      } else {
        setProgresoSintetico(transcurrido / duracionDemo);
      }
    }, 120);
  };

  // Pausa si otro reproductor pasa a estar activo
  useEffect(() => {
    if (activePlayerId && activePlayerId !== playerId && isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      detenerSintetizador();
      setIsPlaying(false);
    }
  }, [activePlayerId, playerId, isPlaying]);

  // Reiniciar al cambiar de rutaAudio (cambio de caso)
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    detenerSintetizador();
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setModoReferencia(false);
    setProgresoSintetico(0);
  }, [rutaAudio]);

  // Limpieza al desmontar
  useEffect(() => {
    return () => {
      detenerSintetizador();
    };
  }, []);

  const togglePlay = async () => {
    if (isPlaying) {
      if (audioRef.current) audioRef.current.pause();
      detenerSintetizador();
      setIsPlaying(false);
      return;
    }

    onActivate?.(playerId);

    if (modoReferencia) {
      iniciarSintetizadorReferencia();
      return;
    }

    const audio = audioRef.current;
    if (!audio) return;

    try {
      await audio.play();
      setIsPlaying(true);
    } catch {
      // El archivo MP3 aún no existe en /public/audios: activar escucha sintética de referencia
      iniciarSintetizadorReferencia();
    }
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (audioRef.current) {
      audioRef.current.muted = nextMuted;
    }
    if (synthRef.current) {
      const { ctx, masterGain } = synthRef.current;
      masterGain.gain.setTargetAtTime(nextMuted ? 0.0001 : 0.06, ctx.currentTime, 0.05);
    }
  };

  const handleSeek = (e) => {
    if (modoReferencia || !audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
    audioRef.current.currentTime = ratio * duration;
    setCurrentTime(ratio * duration);
  };

  const porcentaje = modoReferencia
    ? Math.round(progresoSintetico * 100)
    : duration > 0
      ? Math.min(100, (currentTime / duration) * 100)
      : 0;

  return (
    <div className={`rounded-xl border bg-stone-950/80 p-3.5 transition-colors ${estilo.ring}`}>
      <audio
        ref={audioRef}
        src={rutaAudio}
        preload="metadata"
        onLoadedMetadata={(e) => {
          setDuration(e.currentTarget.duration || 0);
          setModoReferencia(false);
        }}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onEnded={() => setIsPlaying(false)}
        onError={() => setModoReferencia(true)}
      />

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={togglePlay}
          aria-label={isPlaying ? `Pausar ${titulo}` : `Reproducir ${titulo}`}
          className={`flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border transition-all ${estilo.btn}`}
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="ml-0.5 h-4 w-4" />}
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <p className="truncate text-sm font-medium text-stone-100">{titulo}</p>
            <span className="shrink-0 font-mono text-[11px] text-stone-400">
              {modoReferencia
                ? `${formatearTiempo(progresoSintetico * 18)} / 0:18`
                : `${formatearTiempo(currentTime)} / ${formatearTiempo(duration)}`}
            </span>
          </div>
          {subtitulo && <p className="truncate text-xs text-stone-400">{subtitulo}</p>}

          {/* Barra de progreso */}
          <div
            onClick={handleSeek}
            role="slider"
            aria-label="Progreso del audio"
            aria-valuenow={Math.round(porcentaje)}
            aria-valuemin={0}
            aria-valuemax={100}
            tabIndex={0}
            className="mt-2 h-1.5 w-full cursor-pointer overflow-hidden rounded-full bg-stone-800"
          >
            <div
              className={`h-full rounded-full transition-all duration-150 ${estilo.bar}`}
              style={{ width: `${porcentaje}%` }}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={toggleMute}
          aria-label={isMuted ? 'Activar sonido' : 'Silenciar'}
          className="cursor-pointer rounded-lg p-1.5 text-stone-400 transition-colors hover:bg-stone-900 hover:text-stone-200"
        >
          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>
      </div>

      {/* Pie técnico con ruta de audio / estado de archivo */}
      <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 border-t border-stone-800/70 pt-2 font-mono text-[11px] text-stone-500">
        <span className="flex items-center gap-1.5 truncate">
          <Radio className={`h-3 w-3 shrink-0 ${isPlaying ? estilo.badge : 'text-stone-600'}`} />
          <span className="truncate">{rutaAudio}</span>
        </span>
        {modoReferencia && (
          <span className={`inline-flex items-center gap-1 ${estilo.badge}`}>
            <Sparkles className="h-3 w-3" />
            <span>Audio de referencia (coloca tu .mp3 en public/audios)</span>
          </span>
        )}
      </div>
    </div>
  );
}
