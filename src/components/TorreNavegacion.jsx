import { Compass, CheckCircle2 } from 'lucide-react';

export default function TorreNavegacion({
  casos,
  casoActivoId,
  onSeleccionar,
  reflexiones = {},
}) {
  // Se ordenan de arriba (Umbral IV) hacia abajo (Umbral I) para reflejar la silueta ascendente de la Torre
  const nivelesAscendentes = [...casos].reverse();

  return (
    <aside
      aria-label="Niveles de la Torre de Babel"
      className="rounded-2xl border border-stone-800/80 bg-stone-950/70 p-4 backdrop-blur-sm"
    >
      <div className="mb-4 flex items-center justify-between border-b border-stone-800/80 pb-3">
        <div className="flex items-center gap-2">
          <Compass className="h-4 w-4 text-[#d27d46]" />
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-stone-300">
            Alzado de la Torre
          </span>
        </div>
        <span className="font-mono text-[11px] text-stone-500">
          {casos.length} umbrales
        </span>
      </div>

      {/* Silueta escalonada de la torre (ziggurat) */}
      <div className="flex flex-col items-center gap-2.5">
        {nivelesAscendentes.map((caso, idx) => {
          const esActivo = caso.id === casoActivoId;
          const tieneReflexion = Boolean(reflexiones[caso.id]?.trim());
          // Ancho progresivo: más estrecho en la cúspide, más ancho en la base
          const widths = ['w-[78%]', 'w-[86%]', 'w-[93%]', 'w-full'];
          const widthClass = widths[idx] || 'w-full';

          return (
            <button
              key={caso.id}
              type="button"
              onClick={() => onSeleccionar(caso.id)}
              className={`group relative cursor-pointer rounded-xl border px-3.5 py-3 text-left transition-all ${widthClass} ${
                esActivo
                  ? 'border-[#d27d46]/70 bg-gradient-to-r from-[#d27d46]/15 via-stone-900/90 to-stone-900/80 shadow-lg shadow-black/40'
                  : 'border-stone-800/80 bg-stone-900/40 hover:border-stone-700 hover:bg-stone-900/75'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`font-mono text-[10px] uppercase tracking-[0.16em] ${
                    esActivo ? 'text-[#f0b88f]' : 'text-stone-500 group-hover:text-stone-400'
                  }`}
                >
                  {caso.nivelTorre}
                </span>
                {tieneReflexion && (
                  <CheckCircle2
                    className="h-3.5 w-3.5 shrink-0 text-[#7ba393]"
                    title="Reflexión registrada"
                  />
                )}
              </div>

              <div className="mt-1 flex items-baseline justify-between gap-2">
                <span
                  className={`font-serif text-lg font-medium ${
                    esActivo ? 'text-stone-50' : 'text-stone-300 group-hover:text-stone-100'
                  }`}
                >
                  {caso.seudonimo}
                </span>
                <span className="font-mono text-[10px] text-stone-500">
                  {esActivo ? '● Aquí' : 'Entrar →'}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Base simbólica de la torre */}
      <div className="mt-3 flex items-center justify-center gap-2 pt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-stone-600">
        <span className="h-px flex-1 bg-stone-800" />
        <span>Cimientos</span>
        <span className="h-px flex-1 bg-stone-800" />
      </div>
    </aside>
  );
}
