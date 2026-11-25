import { useEffect, useState } from 'react';
import { ArrowLeft, BookMarked, BookOpen, X } from 'lucide-react';
import { CASOS } from './data/casos';
import TorreBabel from './components/TorreBabel';
import PasilloCaso from './components/PasilloCaso';
import BitacoraFinal from './components/BitacoraFinal';

const STORAGE_KEY = 'babel_sonora_reflexiones_v1';

export default function App() {
  const [vista, setVista] = useState('torre'); // 'torre' (exterior principal) | 'pasillo' (interior del caso)
  const [saliendoPasillo, setSaliendoPasillo] = useState(false);
  const [casoActivoId, setCasoActivoId] = useState(CASOS[0].id);
  const [mostrarManifiesto, setMostrarManifiesto] = useState(false);
  const [mostrarBitacora, setMostrarBitacora] = useState(false);

  const [reflexiones, setReflexiones] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reflexiones));
    } catch {
      // ignorar errores de cuota en storage
    }
  }, [reflexiones]);

  const indiceActual = CASOS.findIndex((c) => c.id === casoActivoId);
  const casoActual = CASOS[indiceActual] || CASOS[0];
  const casoAnterior = indiceActual > 0 ? CASOS[indiceActual - 1] : null;
  const casoSiguiente = indiceActual < CASOS.length - 1 ? CASOS[indiceActual + 1] : null;

  const handleEntrarDesdeTorre = (id) => {
    setCasoActivoId(id);
    setSaliendoPasillo(false);
    setVista('pasillo');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleVolverATorre = () => {
    if (vista === 'torre' || saliendoPasillo) return;
    setSaliendoPasillo(true);
    setTimeout(() => {
      setVista('torre');
      setSaliendoPasillo(false);
      window.scrollTo({ top: 0, behavior: 'instant' });
    }, 320);
  };

  const handleSeleccionarCaso = (id) => {
    setCasoActivoId(id);
    setVista('pasillo');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGuardarReflexion = (clave, texto) => {
    setReflexiones((prev) => ({ ...prev, [clave]: texto }));
  };

  const handleLimpiarReflexiones = () => {
    setReflexiones({});
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignorar errores de storage
    }
  };

  const totalReflexiones = CASOS.filter((c) => Boolean(reflexiones[c.id]?.trim())).length;

  return (
    <div className="babel-grid min-h-screen text-stone-100">
      {/* Cabecera arquitectónica */}
      <header className="sticky top-0 z-30 border-b border-stone-800/80 bg-stone-950/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3.5">
            {/* Emblema geométrico de la Torre de Babel (regresa al exterior) */}
            <button
              type="button"
              onClick={handleVolverATorre}
              title="Ir a la vista exterior de la Torre"
              className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl border border-[#d27d46]/40 bg-stone-900/90 transition-colors hover:border-[#d27d46]"
            >
              <svg viewBox="0 0 40 40" className="h-7 w-7" fill="none">
                <rect x="7" y="29" width="26" height="5" rx="1" stroke="#d27d46" strokeWidth="1.5" />
                <rect x="10" y="22" width="20" height="5" rx="1" stroke="#7ba393" strokeWidth="1.5" />
                <rect x="13" y="15" width="14" height="5" rx="1" stroke="#74a4c4" strokeWidth="1.5" />
                <path
                  d="M16 12C16 9.5 18 8 20 8C22 8 24 9.5 24 12"
                  stroke="#efe9dc"
                  strokeWidth="1.3"
                  strokeDasharray="2 2"
                />
              </svg>
            </button>

            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-stone-400">
                Archivo Interactivo · Identidad y Música
              </p>
              <h1 className="font-serif text-2xl font-semibold tracking-wide text-stone-50 sm:text-3xl">
                La Torre de Babel Sonora
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {vista === 'pasillo' && (
              <button
                type="button"
                onClick={handleVolverATorre}
                className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[#d27d46]/45 bg-[#d27d46]/12 px-3.5 py-2 font-mono text-xs uppercase tracking-[0.14em] text-[#f0b88f] transition-colors hover:bg-[#d27d46]/22"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Exterior de la Torre</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setMostrarBitacora(true)}
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[#7ba393]/45 bg-[#7ba393]/12 px-3.5 py-2 font-mono text-xs uppercase tracking-[0.14em] text-[#b6d5c8] transition-colors hover:bg-[#7ba393]/22"
            >
              <BookMarked className="h-3.5 w-3.5" />
              <span>
                Bitácora ({totalReflexiones}/{CASOS.length})
              </span>
            </button>

            <button
              type="button"
              onClick={() => setMostrarManifiesto((v) => !v)}
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-stone-700/80 bg-stone-900/80 px-3.5 py-2 font-mono text-xs uppercase tracking-[0.14em] text-stone-200 transition-colors hover:border-[#d27d46]/60 hover:text-[#f0b88f]"
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>La Metáfora</span>
            </button>
          </div>
        </div>

        {/* Panel desplegable de contexto curatorial y referentes bibliográficos */}
        {mostrarManifiesto && (
          <div className="max-h-[75vh] overflow-y-auto border-t border-stone-800/80 bg-stone-950/95">
            <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:flex-row lg:items-start lg:justify-between lg:px-8">
              <div className="max-w-4xl space-y-5">
                <div className="space-y-2.5 text-sm leading-relaxed text-stone-300">
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#d27d46]">
                    Nota Curatorial · La Metáfora de Babel
                  </p>
                  <p className="font-serif text-xl italic text-stone-100">
                    «Una misma biografía escuchada en tres lenguas que nunca coinciden por completo.»
                  </p>
                  <p>
                    En cada umbral de esta torre habita un sujeto representado a través de tres
                    objetos simbólicos y tres piezas sonoras: su propia elección musical y memoria
                    íntima (<span className="text-[#f0b88f]">Sujeto</span>), la traducción estética
                    de un compositor humano (<span className="text-[#b6d5c8]">Compositor</span>) y
                    la síntesis estadística generada por inteligencia artificial (
                    <span className="text-[#b2d4ec]">IA</span>).
                  </p>
                  <p className="text-stone-400">
                    El propósito no es decidir cuál versión es «correcta», sino habitar la fricción
                    entre ellas: aquello que se gana, se desplaza o se pierde cuando traducimos una
                    identidad a sonido.
                  </p>
                </div>

                {/* Bibliografía y referentes teóricos (formato APA 7.ª ed.) */}
                <div className="rounded-xl border border-stone-800/85 bg-stone-900/45 p-4 sm:p-5">
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#f0b88f]">
                    Referentes conceptuales y bibliografía
                  </p>
                  <p className="mt-1 text-xs text-stone-400">
                    Las interpretaciones, tensiones críticas y preguntas de cada pasillo dialogan
                    con los siguientes referentes:
                  </p>

                  <ul className="mt-3.5 space-y-2.5 text-xs leading-relaxed text-stone-300 sm:text-[13px]">
                    <li className="pl-5 -indent-5">
                      Larrosa, J. (2001). Dar la palabra. Notas para una dialógica de la
                      transmisión. En J. Larrosa y C. Skliar (Eds.),{' '}
                      <em className="text-stone-100">
                        Habitantes de Babel: Políticas y poéticas de la diferencia
                      </em>{' '}
                      (pp. 411–432). Laertes.
                    </li>
                    <li className="pl-5 -indent-5">
                      Larrosa, J., y Skliar, C. (2001). Babilonios somos. A modo de presentación. En
                      J. Larrosa y C. Skliar (Eds.),{' '}
                      <em className="text-stone-100">
                        Habitantes de Babel: Políticas y poéticas de la diferencia
                      </em>{' '}
                      (pp. 11–43). Laertes.
                    </li>
                    <li className="pl-5 -indent-5">
                      Nussbaum, M. C. (2005). La imaginación narrativa. En{' '}
                      <em className="text-stone-100">
                        El cultivo de la humanidad: Una defensa clásica de la reforma en la
                        educación liberal
                      </em>
                      . Paidós.
                    </li>
                    <li className="pl-5 -indent-5">
                      Sigman, M., y Bilinkis, S. (2023).{' '}
                      <em className="text-stone-100">
                        Artificial: La nueva inteligencia y el contorno de lo humano
                      </em>
                      . Debate.
                    </li>
                  </ul>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setMostrarManifiesto(false)}
                aria-label="Cerrar explicación"
                className="self-start cursor-pointer rounded-lg border border-stone-800 p-2 text-stone-400 hover:border-stone-700 hover:text-stone-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Pantalla principal: Exterior de la Torre de Babel */}
      {vista === 'torre' ? (
        <main className="animate-umbral-enter">
          <TorreBabel
            casos={CASOS}
            reflexiones={reflexiones}
            onEntrarCaso={handleEntrarDesdeTorre}
            onAbrirManifiesto={() => setMostrarManifiesto(true)}
            onAbrirBitacora={() => setMostrarBitacora(true)}
          />
        </main>
      ) : (
        /* Vista interior: Pasillo del caso con 3 pedestales, mural lateral y ábside de confrontación */
        <main
          className={`transition-all duration-300 ${
            saliendoPasillo ? 'scale-[0.985] opacity-0' : 'animate-umbral-enter'
          }`}
        >
          <PasilloCaso
            key={casoActual.id}
            caso={casoActual}
            indiceActual={indiceActual}
            totalCasos={CASOS.length}
            casoAnterior={casoAnterior}
            casoSiguiente={casoSiguiente}
            reflexionGuardada={reflexiones[casoActual.id] || ''}
            onGuardarReflexion={handleGuardarReflexion}
            onVolverTorre={handleVolverATorre}
            onCambiarCaso={handleSeleccionarCaso}
            onAbrirBitacora={() => setMostrarBitacora(true)}
          />
        </main>
      )}

      {/* Modal: Muro de Síntesis / Bitácora Final de la Torre */}
      <BitacoraFinal
        abierto={mostrarBitacora}
        onCerrar={() => setMostrarBitacora(false)}
        casos={CASOS}
        reflexiones={reflexiones}
        onGuardarReflexion={handleGuardarReflexion}
        onLimpiarTodo={handleLimpiarReflexiones}
        onIrACaso={handleSeleccionarCaso}
      />
    </div>
  );
}
