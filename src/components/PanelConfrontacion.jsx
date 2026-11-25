import { useState } from 'react';
import { MessageSquareQuote, Sparkles, Save, Check } from 'lucide-react';

export default function PanelConfrontacion({
  caso,
  reflexionGuardada = '',
  onGuardarReflexion,
}) {
  const [borrador, setBorrador] = useState(reflexionGuardada);
  const [recienGuardado, setRecienGuardado] = useState(false);

  // Sincroniza el textarea al cambiar de umbral
  const [ultimoCasoId, setUltimoCasoId] = useState(caso.id);
  if (caso.id !== ultimoCasoId) {
    setUltimoCasoId(caso.id);
    setBorrador(reflexionGuardada);
    setRecienGuardado(false);
  }

  const handleGuardar = (e) => {
    e.preventDefault();
    onGuardarReflexion(caso.id, borrador);
    setRecienGuardado(true);
    setTimeout(() => setRecienGuardado(false), 2200);
  };

  return (
    <section
      aria-labelledby="titulo-confrontacion"
      className="relative overflow-hidden rounded-2xl border border-amber-500/25 bg-gradient-to-br from-stone-900/90 via-stone-950/95 to-stone-950 p-6 sm:p-7"
    >
      <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-[#d27d46]/10 blur-3xl" />

      <div className="relative">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-[#f0b88f]">
            <MessageSquareQuote className="h-4 w-4" />
            <span id="titulo-confrontacion">Pregunta para quien escucha</span>
          </div>
          <span className="font-mono text-[11px] text-stone-500">
            {caso.nivelTorre} · {caso.seudonimo}
          </span>
        </div>

        <h3 className="mt-3 font-serif text-2xl font-medium leading-snug text-stone-50 sm:text-3xl">
          {caso.preguntaConfrontacion}
        </h3>

        {/* Resumen visual de los tres objetos que colisionan */}
        <div className="mt-5 grid gap-2.5 sm:grid-cols-3">
          <div className="rounded-lg border border-[#d27d46]/25 bg-stone-950/60 px-3.5 py-2.5">
            <p className="font-mono text-[10px] uppercase tracking-widest text-[#f0b88f]">
              Sujeto
            </p>
            <p className="mt-0.5 text-xs font-medium text-stone-200">
              {caso.objetoSujeto.nombreObjeto}
            </p>
          </div>
          <div className="rounded-lg border border-[#7ba393]/25 bg-stone-950/60 px-3.5 py-2.5">
            <p className="font-mono text-[10px] uppercase tracking-widest text-[#b6d5c8]">
              Compositor
            </p>
            <p className="mt-0.5 text-xs font-medium text-stone-200">
              {caso.objetoCompositor.nombreObjeto}
            </p>
          </div>
          <div className="rounded-lg border border-[#74a4c4]/25 bg-stone-950/60 px-3.5 py-2.5">
            <p className="font-mono text-[10px] uppercase tracking-widest text-[#b2d4ec]">
              IA
            </p>
            <p className="mt-0.5 text-xs font-medium text-stone-200">
              {caso.objetoIA.nombreObjeto}
            </p>
          </div>
        </div>

        {/* Bitácora del visitante */}
        <form onSubmit={handleGuardar} className="mt-5">
          <label
            htmlFor={`reflexion-${caso.id}`}
            className="mb-2 flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-stone-400"
          >
            <Sparkles className="h-3.5 w-3.5 text-[#d27d46]" />
            <span>Deja tu nota en la bitácora del umbral (se guarda localmente)</span>
          </label>
          <textarea
            id={`reflexion-${caso.id}`}
            rows={3}
            value={borrador}
            onChange={(e) => setBorrador(e.target.value)}
            placeholder="¿Qué escuchas que las otras dos visiones omiten o transforman? Escribe aquí tu lectura..."
            className="w-full rounded-xl border border-stone-800 bg-stone-950/90 px-4 py-3 text-sm text-stone-100 placeholder:text-stone-600 focus:border-[#d27d46]/60 focus:outline-none"
          />

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-stone-500">
              Tus anotaciones te acompañan mientras asciendes por los cuatro umbrales.
            </p>
            <button
              type="submit"
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[#d27d46]/50 bg-[#d27d46]/15 px-4 py-2 font-mono text-xs uppercase tracking-[0.14em] text-[#f0b88f] transition-colors hover:bg-[#d27d46]/25"
            >
              {recienGuardado ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  <span>Nota guardada</span>
                </>
              ) : (
                <>
                  <Save className="h-3.5 w-3.5" />
                  <span>Registrar nota</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
