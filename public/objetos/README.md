# Carpeta de ilustraciones de objetos (`./objetos/...`)

Coloca aquí tus ilustraciones o fotografías recortadas (`.png`, `.webp`, `.svg`, `.jpg`) para reemplazar cualquiera de los SVG simbólicos generados por defecto.

Ejemplo de uso en `src/data/casos.js`:

```js
imagenObjeto: './objetos/caso1_sujeto.png',
```

En Vite, los archivos ubicados en `public/objetos/` se resuelven en `./objetos/...`.
Si `imagenObjeto` se deja en `null` o el archivo aún no existe en esta carpeta, `IconoObjeto.jsx` muestra automáticamente el icono SVG de respaldo correspondiente sin errores visuales.
