# Carpeta de audios (`./audios/...`)

Coloca aquí los archivos `.mp3` referenciados en `src/data/casos.js` mediante rutas relativas `./audios/...`:

- `caso1_sujeto.mp3`
- `caso1_compositor.mp3`
- `caso1_ia.mp3`
- `caso2_sujeto.mp3`
- `caso2_compositor.mp3`
- `caso2_ia.mp3`
- `caso3_sujeto.mp3`
- `caso3_compositor.mp3`
- `caso3_ia.mp3`
- `caso4_sujeto.mp3`
- `caso4_compositor.mp3`
- `caso4_ia.mp3`

En Vite, todo lo guardado dentro de `public/audios/` se sirve automáticamente en `./audios/...` tanto en desarrollo (`npm.cmd run dev`) como en compilación (`npm.cmd run build`).

Si algún archivo aún no ha sido colocado aquí, el pasillo detecta el error de carga de forma segura, muestra la etiqueta **"Archivo pendiente por cargar"** y mantiene accesibles todos los textos críticos del objeto.
