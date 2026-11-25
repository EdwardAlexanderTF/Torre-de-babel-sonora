import { useEffect, useState } from 'react';
import {
  ArrowUpRight,
  BookMarked,
  Check,
  CheckCircle2,
  MessageSquareQuote,
  RotateCcw,
  Save,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';

const CLAVE_TRANSVERSAL = '__transversal__';

const PREGUNTA_TRANSVERSAL =
  'Al reunir las voces de toda la Torre: ¿qué ocurre con la identidad cuando queda en disputa entre la propia voz, la escucha de otro humano y la traducción algorítmica? ¿Qué se pierde —y qué persiste como intraducible— en esa fricción?';

export default function BitacoraFinal({
  abierto,
  onCerrar,
  casos = [],
  reflexiones = {},
  onGuardarReflexion,
  onLimpiarTodo,
  onIrACaso,
}) {
  const [confirmandoBorrado, setConfirmandoBorrado] = useState(false);
  const [borradorTransversal, setBorradorTransversal] = useState(
    reflexiones[CLAVE_TRANSVERSAL] || ''
  );
  const [guardadoTransversal, setGuardadoTransversal] = useState(false);

  // Sincronizar borrador al abrir o cuando se limpie localStorage
  useEffect(() => {
    setBorradorTransversal(reflexiones[CLAVE_TRANSVERSAL] || '');
  }, [reflexiones, abierto]);

  // Cerrar con tecla Escape
  useEffect(() => {
    if (!abierto) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onCerrar?.();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [abierto, onCerrar]);

  if (!abierto) return null;

  const casosRespondidos = casos.filter((c) => Boolean(reflexiones[c.id]?.trim())).length;
  const hayAlgunaRespuesta =
    casosRespondidos > 0 || Boolean(reflexiones[CLAVE_TRANSVERSAL]?.trim());

  const handleGuardarTransversal = (e) => {
    e.preventDefault();
    onGuardarReflexion?.(CLAVE_TRANSVERSAL, borradorTransversal);
    setGuardadoTransversal(true);
    setTimeout(() => setGuardadoTransversal(false), 2200);
  };

  const handleConfirmarLimpieza = () => {
    onLimpiarTodo?.();
    setBorradorTransversal('');
    setConfirmandoBorrado(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="titulo-bitacora-final"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md sm:p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCerrar?.();
      }}
    >
      <div className="animate-umbral-enter flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-stone-700/90 bg-[#0f0d0b] shadow-2xl shadow-black/90">
        {/* Cabecera fija del Muro de Síntesis */}
        <div className="flex items-start justify-between gap-4 border-b border-stone-800/90 bg-stone-950/95 px-6 py-5">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-[#f0b88f]">
              <BookMarked className="h-4 w-4" />
              <span>Muro de Síntesis · Bitácora Final de la Torre</span>
            </div>
            <h2
              id="titulo-bitacora-final"
              className="mt-1.5 font-serif text-2xl font-semibold text-stone-50 sm:text-3xl"
            >
              Archivo personal de tu recorrido
            </h2>
            <p className="mt-1 text-xs text-stone-400">
              {casosRespondidos} de {casos.length} umbrales con reflexión registrada en este
              navegador.
            </p>
          </div>

          <button
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar Bitácora Final"
            className="cursor-pointer rounded-xl border border-stone-800 bg-stone-900/80 p-2 text-stone-400 transition-colors hover:border-stone-700 hover:text-stone-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Cuerpo desplazable: recopilación de todos los casos + pregunta transversal */}
        <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
          {/* Lista de reflexiones por umbral */}
          <section aria-label="Reflexiones por umbral" className="space-y-4">
            {casos.map((caso, idx) => {
              const texto = reflexiones[caso.id]?.trim();
              return (
                <article
                  key={caso.id}
                  className={`rounded-2xl border p-4 sm:p-5 ${
                    texto
                      ? 'border-[#7ba393]/40 bg-stone-950/90'
                      : 'border-stone-800/80 bg-stone-950/55'
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#f0b88f]">
                        0{idx + 1} · {caso.nivelTorre}
                      </span>
                      <h3 className="mt-0.5 font-serif text-xl font-semibold text-stone-100">
                        Pasillo de {caso.seudonimo}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2">
                      {texto ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-[#7ba393]/40 bg-[#7ba393]/12 px-2.5 py-0.5 font-mono text-[10px] text-[#b6d5c8]">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>Registrada</span>
                        </span>
                      ) : (
                        <span className="rounded-full border border-stone-800 bg-stone-900/70 px-2.5 py-0.5 font-mono text-[10px] text-stone-500">
                          Pendiente
                        </span>
                      )}

                      {onIrACaso && (
                        <button
                          type="button"
                          onClick={() => {
                            onCerrar?.();
                            onIrACaso(caso.id);
                          }}
                          className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-stone-800 bg-stone-900/80 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-stone-300 transition-colors hover:border-[#d27d46]/55 hover:text-[#f0b88f]"
                        >
                          <span>Ir al pasillo</span>
                          <ArrowUpRight className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Trío de objetos del caso */}
                  <div className="mt-2.5 flex flex-wrap gap-2 font-mono text-[10px] text-stone-400">
                    <span className="rounded border border-[#d27d46]/25 bg-[#d27d46]/8 px-2 py-0.5 text-[#f0b88f]">
                      Sujeto: {caso.objetoSujeto.nombreObjeto}
                    </span>
                    <span className="rounded border border-[#7ba393]/25 bg-[#7ba393]/8 px-2 py-0.5 text-[#b6d5c8]">
                      Compositor: {caso.objetoCompositor.nombreObjeto}
                    </span>
                    <span className="rounded border border-[#74a4c4]/25 bg-[#74a4c4]/8 px-2 py-0.5 text-[#b2d4ec]">
                      IA: {caso.objetoIA.nombreObjeto}
                    </span>
                  </div>

                  <p className="mt-3 font-serif text-base italic text-stone-300">
                    «{caso.preguntaConfrontacion}»
                  </p>

                  {texto ? (
                    <div className="mt-3 rounded-xl border border-stone-800 bg-stone-900/70 px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap text-stone-100">
                      {texto}
                    </div>
                  ) : (
                    <p className="mt-3 rounded-xl border border-dashed border-stone-800/90 px-4 py-2.5 text-xs italic text-stone-500">
                      Aún no has escrito una reflexión en este umbral.
                    </p>
                  )}
                </article>
              );
            })}
          </section>

          {/* Pregunta transversal final de toda la Torre */}
          <section
            aria-labelledby="pregunta-transversal-titulo"
            className="rounded-2xl border border-[#d27d46]/35 bg-gradient-to-br from-[#d27d46]/10 via-stone-950 to-stone-950 p-5 sm:p-6"
          >
            <div className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-[#f0b88f]">
              <MessageSquareQuote className="h-4 w-4" />
              <span id="pregunta-transversal-titulo">Pregunta transversal de cierre</span>
            </div>

            <p className="mt-2.5 font-serif text-xl font-medium leading-snug text-stone-50 sm:text-2xl">
              {PREGUNTA_TRANSVERSAL}
            </p>

            <form onSubmit={handleGuardarTransversal} className="mt-4">
              <label
                htmlFor="reflexion-transversal-input"
                className="mb-1.5 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-stone-400"
              >
                <Sparkles className="h-3.5 w-3.5 text-[#d27d46]" />
                <span>Síntesis final (opcional, guardada en tu bitácora)</span>
              </label>
              <textarea
                id="reflexion-transversal-input"
                rows={3}
                value={borradorTransversal}
                onChange={(e) => setBorradorTransversal(e.target.value)}
                placeholder="Escribe aquí tu conclusión general tras recorrer la Torre de Babel Sonora..."
                className="w-full rounded-xl border border-stone-800 bg-stone-950/90 px-4 py-3 text-sm text-stone-100 placeholder:text-stone-600 focus:border-[#d27d46]/60 focus:outline-none"
              />
              <div className="mt-3 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[#d27d46]/50 bg-[#d27d46]/15 px-4 py-2 font-mono text-xs uppercase tracking-[0.14em] text-[#f0b88f] transition-colors hover:bg-[#d27d46]/25"
                >
                  {guardadoTransversal ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      <span>Síntesis guardada</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-3.5 w-3.5" />
                      <span>Guardar síntesis</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>
        </div>

        {/* Pie del modal: limpiar respuestas guardadas / cerrar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-stone-800/90 bg-stone-950/95 px-6 py-4">
          {!confirmandoBorrado ? (
            <button
              type="button"
              onClick={() => setConfirmandoBorrado(true)}
              disabled={!hayAlgunaRespuesta}
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-stone-800 bg-stone-900/80 px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-stone-400 transition-colors hover:border-red-500/45 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Limpiar respuestas y reiniciar recorrido</span>
            </button>
          ) : (
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[11px] text-amber-300">
                ¿Borrar todas las reflexiones guardadas?
              </span>
              <button
                type="button"
                onClick={handleConfirmarLimpieza}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-red-500/60 bg-red-500/15 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-red-200 hover:bg-red-500/25"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Sí, limpiar todo</span>
              </button>
              <button
                type="button"
                onClick={() => setConfirmandoBorrado(false)}
                className="cursor-pointer rounded-lg border border-stone-700 bg-stone-900 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-stone-300 hover:text-stone-100"
              >
                Cancelar
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={onCerrar}
            className="cursor-pointer rounded-lg border border-stone-700 bg-stone-900/90 px-4 py-2 font-mono text-xs uppercase tracking-[0.14em] text-stone-200 transition-colors hover:border-stone-500 hover:text-white"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
