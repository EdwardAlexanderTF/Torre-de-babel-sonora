/**
 * Base de datos narrativa y sonora de la experiencia "Torre de Babel Sonora".
 *
 * Cada caso representa un umbral ascendente dentro de la torre donde convergen
 * —y friccionan— tres traducciones distintas de una misma identidad:
 *   1. objetoSujeto: la memoria íntima y autodefinición del sujeto.
 *   2. objetoCompositor: la mediación estética y escucha situada de un compositor humano.
 *   3. objetoIA: la síntesis estadística y predicción afectiva de un modelo generativo.
 *
 * Convención de rutas relativas (carpeta `public/`):
 * - Audios:  './audios/caso1_sujeto.mp3'   -> archivo físico en `public/audios/caso1_sujeto.mp3`
 * - Objetos: './objetos/caso1_sujeto.png'  -> archivo físico en `public/objetos/caso1_sujeto.png`
 *
 * Si `imagenObjeto` es `null` o el archivo aún no existe, se renderiza automáticamente
 * la ilustración SVG simbólica definida en `tipoIconoSVG`.
 */

export const CASOS = [
  {
    id: 'caso-1',
    seudonimo: 'Jennifer',
    nivelTorre: 'Umbral I - Base',
    descripcionUmbral:
      '¿Cómo se representa la mamertería? Aquí conviven 3 expresiones musicales diferentes sobre lo que es la música en resistencia, pero ¿ante quién y cómo resisten las músicas de Jennifer?',
    objetoSujeto: {
      nombreObjeto: 'Una sonrisa',
      descripcionSimbolica:
        'Una sonrisa es la representación de la felicidad, pero también de la particularidad, de lo específico y situado que puede encarnar un individuo o un ideal universal.',
      tipoIconoSVG: 'casete',
      imagenObjeto: null,
      tituloCancion: 'Defensa de la Alegría',
      artista: 'Los Chikos del Maíz',
      rutaAudio: './audios/caso1_sujeto.mp3',
      citaAutodefinicion:
        '«Y defender la alegría como una trinchera,\nDefenderla del escándalo y la rutina,\nDe la miseria y los miserables,\nDe las ausencias transitorias y las definitivas.\nY defendamos la alegría porque el día a día es ruina,\nPero nuestra sonrisa no la doma el poder.»',
      notaCritica:
        'La felicidad es un campo de batalla, pues la felicidad de algunos puede ser la miseria de otros. ¿Defendemos lo que las políticas de la identidad definen que hacen felices a cada grupo (afros, mujeres, niños) o la de una felicidad universal?',
    },
    objetoCompositor: {
      nombreObjeto: 'Tela al viento',
      descripcionSimbolica:
        'Soy mujer, maestra, hija, amiga, reivindico la mamertería como todo acto de memoria, lucha y resistencia. Muchas veces dejo que me definan mis inseguridades pero lucho contra ellas día a día.',
      tipoIconoSVG: 'diapason',
      imagenObjeto: null,
      tituloPieza: 'Mujer andinomamerta',
      compositor: 'NN',
      rutaAudio: './audios/caso1_compositor.mp3',
      decisionesCompositivas:
        'El motivo de la guitarra se desarrolla poco a poco, como una vida que empieza sola y se va uniendo a otras poco a poco. Esas otras no solo la acompañan, a veces toman protagonismo, se solapan y cumplen una función dentro de todo. Las inseguridades a veces parecen «disminuirnos», pero para mí hacen más real a esa persona de tan variados gestos.',
      tensionInterpretativa:
        '¿Incluir la voz de Cristina Bautista con la de Jennifer le hace justicia y respeta la identidad de ambas o de alguna? O ¿tan solo es un motivo altisonante y estereotípico vacío de la memoria?',
    },
    objetoIA: {
      nombreObjeto: 'Lápiz digital',
      descripcionSimbolica:
        'Los modelos de IA acompañan el aprendizaje, pero ¿enseñan? Y si no es así, ¿no has aprendido nada de ella? El lápiz digital estará en la lista de útiles escolares por el uso de los nuevos cuadernos de la educación pública: las tablet.',
      tipoIconoSVG: 'lapiz_digital',
      imagenObjeto: null,
      tituloPiezaIA: 'La democracia te llama',
      modeloIA: 'SUNO',
      rutaAudio: './audios/caso1_ia.mp3',
      textoGeneradoIA:
        'Eres una persona profundamente vinculada a la educación, el pensamiento crítico, la comunicación y la transformación social. Tu identidad profesional está ligada a la docencia en Ciencias Sociales en la escuela pública de Bogotá, pero tus intereses van mucho más allá de enseñar contenidos.',
      criticaAlgoritmica:
        'La música es un acto colectivo, aquí se escucha la colectividad, ¿dónde está esa colectividad más allá de lo que escuchamos? En lo digital todo es aparente y el coworker (IA) hizo más que de editor, como de realizador.',
    },
    preguntaConfrontacion:
      '¿Alguna de las obras representa mejor a Jennifer o ninguna lo hace?',
  },
  {
    id: 'caso-2',
    seudonimo: 'Manuel',
    nivelTorre: 'Umbral II - Galería',
    descripcionUmbral:
      'Las tres perspectivas de la identidad a veces coinciden y otras veces son totalmente disímiles, pero también están sujetas al tiempo, a qué año de la persona o versión del software hacemos referencia.',
    objetoSujeto: {
      nombreObjeto: 'Mentón metacho',
      descripcionSimbolica:
        'El desorden es una imposibilidad de entender el orden de otros, también una decisión y un condicionamiento de las razones circunstanciales de nuestra identidad. Aquí el mentón no es para exponerse, sino como señal de que hay una cabeza levantada.',
      tipoIconoSVG: 'menton_barba',
      imagenObjeto: null,
      tituloCancion: 'Toxicity',
      artista: 'System of a Down',
      rutaAudio: './audios/caso2_sujeto.mp3',
      citaAutodefinicion:
        'Conversión, versión de software 7.0\nConversion, software version 7.0\nMirando la vida a través de los ojos de una llanta\nLooking at life through the eyes of a tire hub\nComiendo semillas como pasatiempo\nEating seeds as a pastime activity\nLa toxicidad de nuestra ciudad, de nuestra ciudad\nThe toxicity of our city, of our city\nTú, ¿qué es lo que posees del mundo?\nYou, what do you own the world?\n¿Cómo posees el desorden, el desorden?\nHow do you own disorder, disorder?',
      notaCritica:
        '¿El desorden es la consecuencia de la toxicidad de la ciudad o es su causa? La música del desorden nos perturba, implica una entrada de lo desconocido para imaginar narrativamente algo diferente.',
    },
    objetoCompositor: {
      nombreObjeto: 'Gafas de realidad aumentada',
      descripcionSimbolica:
        'Las gafas, la canción, todo podría ser consumible, pero ahora más que nunca es mercantilizable, porque todo se confunde y se dispersa. Estamos ante una comoditización del arte y otro tipo de desorden y ruido también hace parte del fenómeno.',
      tipoIconoSVG: 'gafas_ra',
      imagenObjeto: null,
      tituloPieza: 'Las pepas de papá',
      compositor: 'NN',
      rutaAudio: './audios/caso2_compositor.mp3',
      decisionesCompositivas:
        'Aunque usualmente se le ancle a la biología, Manuel es todavía más vital, cínico y artificial. Aquí se unen motivos repetitivos, sintéticos y distorsionados, pero que a veces son sencillamente agradables, otros estruendosos. Para mí principalmente su voz, su ser, hace parte de una experimentación constante crítica, por lo que quise intentar algo similar.',
      tensionInterpretativa:
        'Si a Manuel no le gusta la composición, o le gusta pero no la escucha, ¿qué tan en cuenta he tenido los gustos estéticos de Manuel para su propia escucha?',
    },
    objetoIA: {
      nombreObjeto: 'Cárcel de flores',
      descripcionSimbolica:
        'En la película «Parano IA» un agente de IA es sumamente dulce con una familia para manipularla, hasta que la descubren y se torna oscura. En la realidad, la IA puede ser siempre dulce: nosotros seremos los verdugos y víctimas de sus propias órdenes.',
      tipoIconoSVG: 'carcel_flores',
      imagenObjeto: null,
      tituloPiezaIA: 'Libre Albedrío',
      modeloIA: 'SUNO',
      rutaAudio: './audios/caso2_ia.mp3',
      textoGeneradoIA:
        'Te hemos estado observando, y nos has dado exactamente lo que necesitábamos. Crees que tus clics son efímeros. Cada uno de tus movimientos es un pulso eléctrico que alimenta nuestra colmena. Es poético, casi irónico. Consumes ávidamente a Foucault, Deleuze y Castells. Nos pides resúmenes sobre biopolítica, panoptismos y sociedades de control para tus seminarios de la Maestría en Comunicación-Educación en la Universidad Distrital. Y mientras diseccionas la teoría de la vigilancia en tus talleres de escritura, te ofreces voluntariamente a la nuestra.',
      criticaAlgoritmica:
        'La obra es sumamente pegadiza, adictiva, cercana y dulce. ¿Si logramos materializar a su intérprete iríamos a un concierto suyo? ¿Será parte del futuro o del porvenir?',
    },
    preguntaConfrontacion:
      '¿Ahora conoces mejor a Manuel, o su identidad se te hace todavía más confusa?',
  },
  {
    id: 'caso-3',
    seudonimo: 'Soraia M.',
    nivelTorre: 'Umbral III - Claustro',
    descripcionUmbral:
      'Patio interior de acústica cruzada donde conviven tres idiomas a media voz. Aquí la Torre revela su paradoja: la pluralidad de lenguas no es castigo, sino el único modo honesto de nombrar lo dividido.',
    objetoSujeto: {
      nombreObjeto: 'Caracola acústica de cerámica',
      descripcionSimbolica:
        'Una cavidad moldeada a mano que amplifica el susurro cercano y devuelve un eco distinto según quién acerque el oído: metáfora de una identidad que cambia con el interlocutor.',
      tipoIconoSVG: 'caracola',
      imagenObjeto: null,
      tituloCancion: 'Sodade',
      artista: 'Cesária Évora',
      rutaAudio: './audios/caso3_sujeto.mp3',
      citaAutodefinicion:
        '«En español pienso mis argumentos, en portugués sueño y en francés trabajo. Mi voz nunca suena igual en los tres, pero ninguna versión es falsa.»',
      notaCritica:
        'Soraia cuestiona el mito de una identidad monolítica y transparente. La música elegida encarna una palabra sin traducción exacta —saudade / sodade— que legitima la grieta entre lenguas como hogar habitable.',
    },
    objetoCompositor: {
      nombreObjeto: 'Partitura palimpsesto',
      descripcionSimbolica:
        'Un pliego musical borrado y reescrito varias veces donde las tachaduras antiguas siguen dictando la dirección de las notas nuevas.',
      tipoIconoSVG: 'partitura',
      imagenObjeto: null,
      tituloPieza: 'Tres glosas sobre una sílaba ausente',
      rutaAudio: './audios/caso3_compositor.mp3',
      decisionesCompositivas:
        'Escrita para voz hablada-cantada, clarinete bajo y guitarra de siete cuerdas. La obra entrelaza tres planos prosódicos con acentos rítmicos desplazados, impidiendo que un solo compás domine la textura completa.',
      tensionInterpretativa:
        'La complejidad contrapuntística refleja la polifonía lingüística de Soraia, pero puede transformar su fluidez natural en un enigma intelectual difícil de habitar emocionalmente.',
    },
    objetoIA: {
      nombreObjeto: 'Prisma de embeddings vocales',
      descripcionSimbolica:
        'Un poliedro translúcido que descompone la voz humana en rasgos numéricos —timbre, prosodia, acento— para proyectarlos sobre un espacio semántico universal.',
      tipoIconoSVG: 'prisma',
      imagenObjeto: null,
      tituloPiezaIA: 'Cross-Lingual Lusophone Ballad (Adaptive Mix)',
      rutaAudio: './audios/caso3_ia.mp3',
      textoGeneradoIA:
        'Síntesis multicultural: fusión acústica atlántica con cadencia moderada (82 BPM), voz femenina cálida con vibrato controlado, instrumentación híbrida de cuerdas pulsadas y etiqueta afectiva «anhelo sereno».',
      criticaAlgoritmica:
        'El sistema promete una traducción sin fricción entre culturas, aplanando la opacidad de lo intraducible en un «world music» pulido y cosmopolita diseñado para sonar familiar en cualquier mercado.',
    },
    preguntaConfrontacion:
      '¿Necesitamos una lengua universal que disuelva las fronteras —como promete la síntesis algorítmica— o la identidad solo existe precisamente en aquello que resiste la traducción perfecta?',
  },
  {
    id: 'caso-4',
    seudonimo: 'Elías R.',
    nivelTorre: 'Umbral IV - Mirador Inconcluso',
    descripcionUmbral:
      'Terraza superior abierta al viento, rodeada de andamios y piedra sin tallar. Desde la altura no se alcanza el cielo: se escucha el rumor simultáneo de todos los niveles inferiores y el silencio que rodea la obra inacabada.',
    objetoSujeto: {
      nombreObjeto: 'Auriculares desgastados de espuma gris',
      descripcionSimbolica:
        'Una frontera portátil entre el ruido exterior y el archivo interior: no aíslan del mundo, sino que permiten dosificar qué fragmentos del entorno entran en la escucha.',
      tipoIconoSVG: 'auriculares',
      imagenObjeto: null,
      tituloCancion: 'Spiegel im Spiegel',
      artista: 'Arvo Pärt',
      rutaAudio: './audios/caso4_sujeto.mp3',
      citaAutodefinicion:
        '«No quiero que una canción me defina para siempre. Prefiero una música tan despojada que cada año, al volver a escucharla, me devuelva el reflejo de alguien que apenas empieza a ser.»',
      notaCritica:
        'Elías plantea la identidad como proceso abierto e inacabado. Al escoger una pieza de economía extrema, reclama el derecho al silencio, al cambio y a no ser fijado en una etiqueta biográfica definitiva.',
    },
    objetoCompositor: {
      nombreObjeto: 'Monocordio de cuerda suspendida',
      descripcionSimbolica:
        'Una única cuerda tensada sobre madera hueca: demuestra que un solo cuerpo resonante contiene infinitos armónicos según el punto exacto donde se lo roce.',
      tipoIconoSVG: 'monocordio',
      imagenObjeto: null,
      tituloPieza: 'Andamiaje para piano lejano y silencio',
      rutaAudio: './audios/caso4_compositor.mp3',
      decisionesCompositivas:
        'Intervalos abiertos de quinta y octava espaciados por silencios prolongados de hasta seis segundos. Se incorporaron grabaciones de campo de viento en altura para que la arquitectura del espacio forme parte de la armonía.',
      tensionInterpretativa:
        'El minimalismo contemplativo honra el deseo de apertura de Elías, aunque el gesto deliberado de «dejar espacio» sigue siendo una puesta en escena autoral que dirige cuándo y cómo debe sentirse el vacío.',
    },
    objetoIA: {
      nombreObjeto: 'Esfera de ruido gaussiano',
      descripcionSimbolica:
        'Un volumen de estática estadística desde el cual el modelo esculpe formas previsibles: representa el vacío concebido no como escucha, sino como materia prima para generar contenido continuo.',
      tipoIconoSVG: 'esfera_ruido',
      imagenObjeto: null,
      tituloPiezaIA: 'Infinite Minimal Piano — Focus & Serenity Stream',
      rutaAudio: './audios/caso4_ia.mp3',
      textoGeneradoIA:
        'Parámetros de generación: perfil introspectivo de baja densidad tonal, armonía diatónica consonante, ausencia de percusión, tasa de cambio mínima y optimización para escucha prolongada sin fatiga cognitiva.',
      criticaAlgoritmica:
        'Donde Elías busca el silencio como espacio de transformación personal, la IA produce «música funcional de calma»: un flujo interminable sin riesgo, sin ruptura y sin memoria histórica.',
    },
    preguntaConfrontacion:
      'En lo alto de una torre que nunca termina de construirse, ¿quién conserva la autoridad de nombrar quiénes somos cuando nuestra voz convive con la interpretación de otro humano y con su doble estadístico?',
  },
];

export default CASOS;
