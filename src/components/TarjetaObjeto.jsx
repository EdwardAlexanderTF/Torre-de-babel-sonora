import { Quote, Feather, Cpu, AlertCircle, Sliders, FileText } from 'lucide-react';
import IconoObjeto from './IconoObjeto';
import ReproductorAudio from './ReproductorAudio';

const META_PERSPECTIVA = {
  sujeto: {
    etiqueta: 'I · Voz del Sujeto',
    subetiqueta: 'Autodefinición y memoria situada',
    borde: 'border-[#d27d46]/35 hover:border-[#d27d46]/65',
    pill: 'border-[#d27d46]/40 bg-[#d27d46]/10 text-[#f0b88f]',
    acento: 'text-[#f0b88f]',
    glow: 'from-[#d27d46]/10 via-transparent to-transparent',
  },
  compositor: {
    etiqueta: 'II · Escucha del Compositor',
    subetiqueta: 'Mediación estética y traducción humana',
    borde: 'border-[#7ba393]/35 hover:border-[#7ba393]/65',
    pill: 'border-[#7ba393]/40 bg-[#7ba393]/10 text-[#b6d5c8]',
    acento: 'text-[#b6d5c8]',
    glow: 'from-[#7ba393]/10 via-transparent to-transparent',
  },
  ia: {
    etiqueta: 'III · Síntesis de la IA',
    subetiqueta: 'Inferencia estadística y modelado afectivo',
    borde: 'border-[#74a4c4]/35 hover:border-[#74a4c4]/65',
    pill: 'border-[#74a4c4]/40 bg-[#74a4c4]/10 text-[#b2d4ec]',
    acento: 'text-[#b2d4ec]',
    glow: 'from-[#74a4c4]/10 via-transparent to-transparent',
  },
};

export default function TarjetaObjeto({
  perspectiva,
  datos,
  casoId,
  activePlayerId,
  onActivatePlayer,
  expandida = false,
}) {
  const meta = META_PERSPECTIVA[perspectiva];

  const tituloAudio =
    perspectiva === 'sujeto'
      ? datos.tituloCancion
      : perspectiva === 'compositor'
        ? datos.tituloPieza
        : datos.tituloPiezaIA;

  const subtituloAudio =
    perspectiva === 'sujeto'
      ? datos.artista
      : perspectiva === 'compositor'
        ? 'Composición interpretativa original'
        : 'Generación algorítmica';

  return (
    <article
      className={`relative flex flex-col overflow-hidden rounded-2xl border bg-gradient-to-b bg-stone-950/75 p-5 transition-all duration-300 ${meta.borde} ${meta.glow} ${
        expandida ? 'lg:p-7' : ''
      }`}
    >
      {/* Encabezado de perspectiva */}
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <span
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.16em] ${meta.pill}`}
          >
            {meta.etiqueta}
          </span>
          <p className="mt-1.5 text-xs text-stone-400">{meta.subetiqueta}</p>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-widest text-stone-600">
          {datos.imagenObjeto ? 'IMG' : 'SVG'}
        </span>
      </div>

      {/* Vitrina del objeto simbólico */}
      <div className="mb-4 flex items-center gap-4 rounded-xl border border-stone-800/70 bg-stone-900/45 p-3.5">
        <IconoObjeto
          tipoIconoSVG={datos.tipoIconoSVG}
          imagenObjeto={datos.imagenObjeto}
          alt={datos.nombreObjeto}
          perspectiva={perspectiva}
          className={expandida ? 'h-28 w-28 shrink-0' : 'h-22 w-22 shrink-0'}
        />
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-stone-500">
            Objeto simbólico
          </p>
          <h3 className="mt-0.5 font-serif text-xl font-semibold leading-snug text-stone-100">
            {datos.nombreObjeto}
          </h3>
          <p className="mt-1.5 text-xs leading-relaxed text-stone-300/90">
            {datos.descripcionSimbolica}
          </p>
        </div>
      </div>

      {/* Reproductor de audio */}
      <div className="mb-5">
        <ReproductorAudio
          rutaAudio={datos.rutaAudio}
          titulo={tituloAudio}
          subtitulo={subtituloAudio}
          perspectiva={perspectiva}
          playerId={`${casoId}-${perspectiva}`}
          activePlayerId={activePlayerId}
          onActivate={onActivatePlayer}
        />
      </div>

      {/* Contenido textual específico por visión */}
      <div className="mt-auto space-y-4">
        {perspectiva === 'sujeto' && (
          <>
            <div className="rounded-xl border border-[#d27d46]/25 bg-[#d27d46]/5 p-4">
              <div className="mb-1.5 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-[#f0b88f]">
                <Quote className="h-3.5 w-3.5" />
                <span>Cita de autodefinición</span>
              </div>
              <blockquote className="font-serif text-lg italic leading-relaxed text-stone-100">
                {datos.citaAutodefinicion}
              </blockquote>
            </div>

            <div className="rounded-xl border border-stone-800/80 bg-stone-900/40 p-4">
              <div className="mb-1.5 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-stone-400">
                <FileText className="h-3.5 w-3.5" />
                <span>Nota crítica</span>
              </div>
              <p className="text-sm leading-relaxed text-stone-300">{datos.notaCritica}</p>
            </div>
          </>
        )}

        {perspectiva === 'compositor' && (
          <>
            <div className="rounded-xl border border-[#7ba393]/25 bg-[#7ba393]/5 p-4">
              <div className="mb-1.5 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-[#b6d5c8]">
                <Sliders className="h-3.5 w-3.5" />
                <span>Decisiones compositivas</span>
              </div>
              <p className="text-sm leading-relaxed text-stone-200">
                {datos.decisionesCompositivas}
              </p>
            </div>

            <div className="rounded-xl border border-stone-800/80 bg-stone-900/40 p-4">
              <div className="mb-1.5 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-stone-400">
                <Feather className="h-3.5 w-3.5" />
                <span>Tensión interpretativa</span>
              </div>
              <p className="text-sm leading-relaxed text-stone-300">
                {datos.tensionInterpretativa}
              </p>
            </div>
          </>
        )}

        {perspectiva === 'ia' && (
          <>
            <div className="rounded-xl border border-[#74a4c4]/25 bg-[#74a4c4]/5 p-4">
              <div className="mb-1.5 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-[#b2d4ec]">
                <Cpu className="h-3.5 w-3.5" />
                <span>Salida textual generada por IA</span>
              </div>
              <p className="font-mono text-xs leading-relaxed text-stone-200">
                {datos.textoGeneradoIA}
              </p>
            </div>

            <div className="rounded-xl border border-stone-800/80 bg-stone-900/40 p-4">
              <div className="mb-1.5 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-stone-400">
                <AlertCircle className="h-3.5 w-3.5" />
                <span>Crítica algorítmica</span>
              </div>
              <p className="text-sm leading-relaxed text-stone-300">
                {datos.criticaAlgoritmica}
              </p>
            </div>
          </>
        )}
      </div>
    </article>
  );
}
