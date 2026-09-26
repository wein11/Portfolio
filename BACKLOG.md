# Backlog del portfolio de Santiago Weinbinder

Documento de traspaso para cualquier persona o LLM que siga trabajando en este repositorio. Explica qué se hizo, en qué orden, con qué skills, cómo está armado el código, qué reglas hay que respetar y cómo editarlo sin romper nada.

Repositorio: `wein11/portfolio` (GitHub). Dueño: Santiago Weinbinder.

---

## 1. Reglas que no se negocian

Leé esto antes de tocar cualquier archivo.

1. **Prohibido el guion largo (carácter Unicode U+2014) y el guion medio usado como separador (U+2013).** Es una preferencia explícita del dueño del repo y aplica a todo: textos del sitio, commits, comentarios de código y documentos. Usá punto, coma, dos puntos, paréntesis o un guion común (`-`). Antes de commitear, corré `grep -nP '(*UTF8)[\x{2013}\x{2014}]' index.html styles.css main.js i18n.js BACKLOG.md README.md` y tiene que salir vacío. `DESIGN.md` es un archivo que aportó el usuario y sí tiene guiones largos: no lo reescribas.
2. **`DESIGN.md` manda sobre las skills.** Cuando una skill contradice el DESIGN.md (por ejemplo taste-skill prohíbe la paleta crema o Impeccable limita el tamaño del display a 6rem), gana el DESIGN.md. Impeccable lo dice textual: "The brief wins".
3. **Monocromo estricto.** Solo tres colores: `#191919` (tinta), `#efedea` (papel), `#e3e1de` (piedra). Nada de colores de acento, estados de color ni degradados. Si el usuario pide un color de acento, es una decisión suya: preguntale y documentá el cambio acá y en DESIGN.md.
4. **Radio 0 en todo y cero sombras.** La única excepción es el punto del cursor, que es un círculo porque el usuario pidió "un punto".
5. **Los botones son links de texto subrayados**, nunca bloques con fondo.
6. **Todo texto visible tiene que existir en los dos idiomas** (ver sección 7).
7. **Toda animación nueva tiene que respetar `prefers-reduced-motion`** y tener un motivo que se pueda decir en una oración (jerarquía, narración, respuesta a una acción o cambio de estado).
8. **El sitio tiene que verse completo sin JavaScript.** Si GSAP no carga, todo el contenido queda visible y estático.
9. **Sitio estático, sin build.** HTML, CSS y JS planos, pensado para GitHub Pages. No agregues frameworks, bundlers ni `package.json` sin que el usuario lo pida.
10. **No crees pull requests ni mergees a `main` sin pedido explícito del usuario.**

---

## 2. Ramas y estado

| Rama | Qué tiene |
|---|---|
| `main` | El portfolio viejo (Poppins, Swiper, fondo de puntitos). Es lo que publica GitHub Pages. |
| `claude/kind-faraday-h9hj6n` | `main` + las skills instaladas en `.claude/`. Sin cambios en el sitio. |
| `claude/portfolio-redesign` | Sale de la rama anterior. Tiene las skills y el rediseño completo. **Es la rama de trabajo actual.** |

Todavía no hay pull request. Para publicar el rediseño en GitHub Pages hay que mergear `claude/portfolio-redesign` a `main` (o cambiar la rama que publica Pages).

Vista previa privada del rediseño (artifact de claude.ai, solo la ve el dueño): https://claude.ai/artifact/WZ9LEtXAbHhdLodh5oB63B

---

## 3. Historial de lo que se hizo

### 3.1 Instalación de skills (rama `claude/kind-faraday-h9hj6n`)

El usuario pidió instalar cuatro repos de skills. En el entorno no había `gh`, así que se clonaron con `git clone --depth 1 https://github.com/<owner>/<repo>.git` en una carpeta temporal y se copiaron a `.claude/skills/` del proyecto. Así viajan con el repo y se cargan en cualquier sesión nueva de Claude Code.

| Commit | Origen | Qué se copió | Qué se dejó afuera y por qué |
|---|---|---|---|
| `b0cc3ae` | `Hainrixz/claude-webkit` | 21 skills de `.claude/skills/` (frontend-design, apple-design, emil-design-eng, ui-ux-pro-max, web-design-guidelines, shadcn-ui, building-components, prototype, animate, animation-vocabulary, improve-animations, review-animations, find-animation-opportunities, playwright-cli, chrome-bridge-automation, web-reader, deep-research, seo-audit, humanizer, vercel-deploy, vercel-react-best-practices) y `ATTRIBUTION.md` | `.claude/settings.local.json`: daba permisos amplios sin confirmación (`rm*`, `curl*`, `git*`, etc.). |
| `be93f90` | `pbakaus/impeccable` | La skill `impeccable` (`.claude/skills/impeccable/`) y sus 4 agentes en `.claude/agents/` (finish-reviewer, documenter, manual-edit-applier, asset-producer) | `.claude/settings.json` con hooks `PostToolUse` y `Stop`. Esos hooks ejecutan `scripts/impeccable`, que descarga un binario externo en `~/.impeccable/bin/`. El instalador oficial `npx impeccable install` fue bloqueado por el entorno por ejecutar código no confiable. |
| `f8ff4f4` | `Leonxlnx/taste-skill` | 13 skills de `skills/` (taste-skill, taste-skill-v1, gpt-tasteskill, output-skill, minimalist-skill, soft-skill, brutalist-skill, redesign-skill, image-to-code-skill, stitch-skill, imagegen-frontend-web, imagegen-frontend-mobile, brandkit) | `skills/llms.txt` (es un índice, no una skill). |
| `01f739d` | `greensock/gsap-skills` | 8 skills oficiales de GSAP (gsap-core, gsap-timeline, gsap-scrolltrigger, gsap-plugins, gsap-utils, gsap-performance, gsap-react, gsap-frameworks) | Ejemplos y `llms.txt`. |

Ningún nombre de skill choca con otro. Hay varias skills de diseño que se superponen (frontend-design, impeccable, taste-skill, ui-ux-pro-max): si no se nombra ninguna, el modelo elige.

### 3.2 Rediseño (commit `5d0b373`, rama `claude/portfolio-redesign`)

Pedido del usuario: portfolio nuevo usando las skills instaladas, las imágenes del repo, textos inspirados en los originales (no idénticos) y el DESIGN.md que aportó ("Adcker, giant brutalist poster on warm museum paper").

- Se reemplazaron `index.html` y `styles.css`, se borró `JS.js` (Swiper) y se creó `main.js`.
- Se agregó `DESIGN.md` al repo, copia exacta del archivo del usuario.
- Se reescribieron todos los textos en español rioplatense (voseo: "Tenés", "Escribime").
- Se sacó el mapa de Google (tira de ubicación, prohibida por taste-skill) y los logos de herramientas (rompían el monocromo; ahora son texto en una cinta).
- Se mantuvieron los anclajes viejos (`#profile`, `#education`, `#experience`, `#tools`, `#contact`) para no romper links.

### 3.3 Segunda ronda (commit `4ca82c2`)

Pedidos del usuario y cómo se resolvió cada uno:

| Pedido | Solución |
|---|---|
| Cambiar el cursor por un punto con rastro | Punto `.cursor` más un `<canvas class="cursor-trail">` que dibuja las últimas 24 posiciones cada vez más finas. Ambos con `mix-blend-mode: difference`. |
| Que el texto cambie de color al pasar el mouse | El punto crece sobre el texto y, por el `difference`, invierte los colores de lo que queda adentro. Se eligió inversión y no un color nuevo para respetar el monocromo. |
| Scroll más suave | Lenis 1.3.26 sincronizado con ScrollTrigger y con el ticker de GSAP. |
| Traducción al inglés | Botón ES/EN, diccionario en `i18n.js`, persistencia en `localStorage` y parámetro `?lang=en`. |
| No le gustó la foto dentro del titular | Se sacó del hero. Ahora es un retrato grande en la sección Perfil: blanco y negro, `position: sticky` en escritorio, parallax suave, se descubre al entrar y se pone a color con hover. |

---

## 4. Qué skills se usaron y para qué

| Skill | Uso concreto |
|---|---|
| `taste-skill` | Marco general: "design read", diales (variación 8, movimiento 6, densidad 3), prohibiciones de patrones de IA (eyebrows, números de sección, tiras de ubicación, CTA duplicados, marquee máximo uno por página, guion largo prohibido) y el pre-flight check final. |
| `impeccable` | Se leyeron `SKILL.md` y `reference/craft-floor.md` directamente. Aportó: "the brief wins", modo "Experience" para portfolios, temas del navegador (selección, scrollbar, foco), y la regla de un solo momento de movimiento principal. **No se corrió su lanzador** (`scripts/impeccable context`) porque descarga un binario externo que el entorno bloquea. |
| `gsap-scrolltrigger`, `gsap-core`, `gsap-timeline` | API correcta de ScrollTrigger (`start`, `scrub`, `once`, `batch`), `gsap.matchMedia()` para movimiento reducido, timelines del hero, `quickTo` del cursor. |
| `gsap-plugins` | SplitText (gratis desde GSAP 3.13) para encender el texto del perfil palabra por palabra. |
| `artifact-design` | Solo para publicar la vista previa en claude.ai (reglas del artifact: sin etiquetas `<html>`, temas con `data-theme`, CDN permitidos). |
| `frontend-design`, `emil-design-eng`, `ui-ux-pro-max`, `brutalist-skill` y el resto | Instaladas pero no cargadas explícitamente. Pueden servir para futuras iteraciones. |

---

## 5. Arquitectura de archivos

```
index.html   Estructura y textos en español (fuente del idioma ES)
styles.css   Tokens, layout, componentes, cursor, Lenis, movimiento reducido
main.js      Idioma, menú móvil, Lenis, nav, cursor y todas las animaciones GSAP
i18n.js      Diccionario en inglés: window.I18N_EN = { clave: 'texto' }
DESIGN.md    Sistema visual (aportado por el usuario, no reescribir)
BACKLOG.md   Este documento
README.md    Descripción corta y cómo levantarlo en local
img/         Fotos, capturas de proyectos y certificados (nombres con espacios)
.claude/     Skills y agentes instalados
```

### Dependencias externas (todas por CDN, versiones fijas)

- `https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js`
- `https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollTrigger.min.js`
- `https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/SplitText.min.js`
- `https://cdn.jsdelivr.net/npm/lenis@1.3.26/dist/lenis.min.js` (expone `window.Lenis`)
- Google Fonts: `Geist` 400 y 700, `Kumbh Sans` 400.

Orden de carga al final del body, todos con `defer`: GSAP, ScrollTrigger, SplitText, Lenis, `i18n.js`, `main.js`. `i18n.js` tiene que ir antes de `main.js`.

---

## 6. Sistema visual implementado

### Tokens (`:root` en `styles.css`)

| Token | Valor | Uso |
|---|---|---|
| `--ink` | `#191919` | Tinta |
| `--bone` | `#efedea` | Papel |
| `--stone` | `#e3e1de` | Superficie secundaria (fondo de imágenes mientras cargan) |
| `--bg` / `--fg` / `--surface` | Alias semánticos | En modo oscuro se invierten (`--bg: ink`, `--fg: bone`, `--surface: #232322`) |
| `--font-sans` | Geist | Todo el sitio, incluido el display |
| `--font-alt` | Kumbh Sans | Solo la cinta de herramientas |
| `--text-caption` | 16px | Metadatos, links, cuerpo chico |
| `--text-body` | clamp(18px, 1.6vw, 21px) | Intro de contacto |
| `--text-sub` | clamp(24px, 2.6vw, 34px) | Títulos de proyectos y formación |
| `--text-heading` | clamp(32px, 5vw, 69px) | Texto del perfil, mail, títulos destacados |
| `--text-display` | clamp(52px, 13.2vw, 185px) | Titulares gigantes (en celular el hero usa 19vw) |
| `--gutter` | clamp(16px, 2.4vw, 32px) | Margen lateral |
| `--edge` | max(gutter, centrado a 1400px) | Margen de nav, formación, cinta y footer para alinear con el contenido |
| `--section-gap` | clamp(112px, 14vw, 200px) | Separación entre secciones |
| `--max` | 1400px | Ancho máximo |
| `--ease-out` | cubic-bezier(0.16, 1, 0.3, 1) | Transiciones CSS |

Display: mayúsculas, peso 400, `line-height: 0.8`, `letter-spacing: -0.05em`. Cada renglón animable es `.line > span`; `.line` tiene `overflow: hidden` y un `padding-top: 0.14em` compensado con margen negativo para que no se corten las tildes ni la Ñ. Si cambiás el line-height, revisá "DISEÑO", "CÓDIGO" y "FORMACIÓN".

Modo oscuro: automático por `prefers-color-scheme`. La sección Formación usa `.invert` (fondo `--fg`, texto `--bg`), así que se invierte en ambos modos. Es la única inversión de la página, permitida por DESIGN.md.

Capas (z-index): 10 menú móvil, 20 navegación, 30 skip link, 39 rastro del cursor, 40 punto del cursor.

### Secciones en orden

| Sección | id | Notas |
|---|---|---|
| Nav | (header `.nav`) | Logo, links (ocultos en menos de 768px), botón ES/EN y botón Menú en celular. Transparente arriba (`.is-top`), con fondo al scrollear, se esconde al bajar (`.is-hidden`). |
| Menú móvil | `#menu` | Panel negro a pantalla completa, se abre con `clip-path`. Usa `inert` cuando está cerrado; cierra con Escape, con un link o al pasar a escritorio. |
| Hero | (sin id, `.hero`) | Solo tipografía: "Diseño / y código / para la web". Pie con metadato y link "Ver trabajos". |
| Perfil | `#profile` | Grilla de 12 columnas desde 900px: retrato en columnas 1 a 4 (sticky), texto en 6 a 12. Texto grande + tres columnas (Hoy, Estudio, Busco). |
| Trabajos | `#experience` | Título display con contador `(6)`. Grilla asimétrica de 12 columnas con clases `.w-a` a `.w-f`. Cada tarjeta es un `<a>` entero. |
| Herramientas | `#tools` | Marquee CSS con dos grupos idénticos (`.marquee-group`). El segundo se oculta con movimiento reducido. Texto accesible aparte en `.sr-only`. |
| Formación | `#education` | Superficie invertida. `<ol>` de 6 ítems; desde 1100px hay 3 columnas y el primero ocupa 2 columnas por 2 filas (6 celdas exactas, sin huecos). |
| Contacto | `#contact` | "Hablemos", mail grande, LinkedIn y GitHub. |
| Footer | `.footer` | Copyright y "Volver arriba" (apunta a `#top`, un div vacío al inicio del body). |

---

## 7. Traducción (ES/EN)

### Cómo funciona

- El español vive en el HTML. Al cargar, `main.js` lee el texto de cada elemento marcado y arma el diccionario `ES` en memoria.
- El inglés vive en `i18n.js` (`window.I18N_EN`).
- Atributos que marcan qué traducir:
  - `data-i18n="clave"`: reemplaza el `textContent` del elemento.
  - `data-i18n-alt="clave"`: reemplaza el `alt` de una imagen.
  - `data-i18n-aria="clave"`: reemplaza el `aria-label`.
- También se traducen `document.title` (`meta.title`) y la meta description (`meta.desc`).
- Idioma inicial: `?lang=en` o `?lang=es` en la URL; si no hay, lo guardado en `localStorage` (clave `lang`); si no, español.
- Al cambiar de idioma: fundido corto, cambio de textos, se vuelve a animar el hero, se rehace el SplitText del perfil (`beforeLang` y `afterLang` en `main.js`) y se llama a `ScrollTrigger.refresh()`.

### Reglas para editar textos

- `data-i18n` pisa **todo** el contenido del elemento. Nunca lo pongas en un elemento que tenga hijos con marcado (por ejemplo el título de Trabajos: la clave va en un `<span>` interno para no borrar el `<sup>(6)</sup>`).
- Nombres propios que no cambian (Necod, CheckLab, CodeLens, "UADE, Universidad Argentina de la Empresa.", "JavaScript", "Python") no llevan clave.
- Si agregás un texto visible nuevo: poné el español en el HTML con `data-i18n="nueva.clave"` y agregá `'nueva.clave': 'English text'` en `i18n.js`. Si falta la clave en inglés, se muestra el español.
- Las claves de fecha se reutilizan (`date.nov22` aparece dos veces). Reutilizá claves cuando el texto sea idéntico, como `tag.full` o `cert`.

---

## 8. Movimiento

Todo está en `main.js`. Las animaciones de contenido están dentro de `gsap.matchMedia()` con `(prefers-reduced-motion: no-preference)`; con movimiento reducido no corren, no hay Lenis, no hay cursor custom y la cinta queda quieta y envuelta.

| Animación | Dónde | Motivo |
|---|---|---|
| Entrada del hero | Timeline: renglones suben con `yPercent` de 110 a 0, `expo.out`, stagger 0.1; luego aparece el pie | Presentación, el momento principal de la página |
| Títulos de sección | `.reveal-title`: misma subida de renglones, `once: true`, `start: 'top 85%'` | Marca el cambio de capítulo |
| Retrato | `clip-path` de abajo hacia arriba al entrar; `img` con parallax `yPercent` -6 a 6 y `scrub` | Presenta a la persona al llegar a Perfil |
| Texto del perfil | SplitText por palabras, opacidad de 0.18 a 1 con `scrub` | Acompaña el ritmo de lectura |
| Capturas de trabajos | `ScrollTrigger.batch` con `clip-path` y `scale` 1.15 a 1 | Jerarquía: la imagen aparece antes que el texto |
| Cinta de herramientas | CSS `@keyframes marquee`, 48s, pausa con hover | Muestra muchas herramientas sin una lista larga |
| Nav | `ScrollTrigger.create` con `onUpdate`, clases `.is-top` y `.is-hidden` | No tapar contenido al leer |
| Cursor | `quickTo` para seguir el mouse, canvas con rastro en `gsap.ticker`, crece según el elemento con `pointerover` | Pedido del usuario; da respuesta al pasar por el texto |
| Scroll suave | Lenis (`lerp: 0.085`, `anchors: true`), `lenis.on('scroll', ScrollTrigger.update)`, `gsap.ticker.add(t => lenis.raf(t * 1000))`, `lagSmoothing(0)` | Pedido del usuario |

### Detalles del cursor

- Solo se activa si `(hover: hover) and (pointer: fine)` y no hay movimiento reducido. Agrega la clase `has-cursor` al `<html>`, que oculta el cursor nativo.
- Tamaños según lo que hay debajo (array `sizes` en `main.js`, se evalúa en orden y gana el primero):
  - display, cinta y links del menú: 150px
  - texto del perfil, mail, títulos de trabajos y de formación: 90px
  - links y botones: 60px
  - párrafos y etiquetas: 40px
  - resto: 12px
- El rastro usa trazos color papel con alfa; con `difference` se ve oscuro sobre papel y claro sobre tinta. Si el punto no se mueve, no dibuja nada (se saltean segmentos de largo casi cero).

### Reglas para agregar movimiento

- Agregalo dentro del bloque `mm.add('(prefers-reduced-motion: no-preference)', ...)`.
- Animá solo `transform`, `opacity` y `clip-path`. Nunca `top`, `left`, `width` o `height` (la única excepción es el tamaño del punto del cursor, que es un elemento fijo chico).
- No uses `window.addEventListener('scroll')`. Usá ScrollTrigger.
- Máximo una cinta tipo marquee por página. Ya existe.
- Si el contenido puede quedar oculto esperando una animación, asegurate de que sin JS quede visible. El hero usa la clase `js-anim` en `<html>` (la agrega un script inline en el head y se quita sola a los 2.5 segundos por si GSAP falla).

---

## 9. Tareas comunes

### Agregar un proyecto

1. Copiá un bloque `<a class="work-item w-?">` en `.work-grid` de `index.html`.
2. Imagen en `img/`, con `width` y `height` reales, `loading="lazy"`, `decoding="async"` y un `alt` con `data-i18n-alt`.
3. Descripción con `data-i18n`, etiqueta con `data-i18n` (reutilizá `tag.*` si aplica).
4. Agregá las claves en inglés en `i18n.js`.
5. Actualizá el contador `(6)` del título.
6. Definí la posición en la grilla en `styles.css` (bloque `@media (min-width: 768px)` de `.w-a` a `.w-f`). Mantené la asimetría y evitá que queden huecos raros.

### Agregar un ítem de formación

Copiá un `<li class="edu-item">`. Con 7 ítems la grilla de 3 columnas deja un hueco: revisá la regla `.edu-item:first-child` (hoy ocupa 2 por 2 para que 6 ítems cierren exacto) y ajustala para que la cantidad de celdas cierre.

### Cambiar un texto

Español en `index.html`, inglés en `i18n.js` con la misma clave. Respetá el voseo en español y la regla de cero guiones largos.

### Cambiar la foto

`img/yo.jpg` (473 por 517). Se usa en Perfil y como favicon y `og:image`. Si cambian las proporciones, actualizá `width`, `height` y el `aspect-ratio` de `.profile-photo` en `styles.css`.

---

## 10. Cómo probar

### En local

```bash
python3 -m http.server 8765
# abrir http://localhost:8765/  y  http://localhost:8765/?lang=en
```

### Particularidades del entorno de Claude Code en la nube

- La red bloquea `cdn.jsdelivr.net` para el navegador headless (el proxy responde 403). Para probar, se bajó GSAP y Lenis con `npm pack gsap@3.13.0` y `npm pack lenis` en la carpeta temporal, y en Playwright se interceptaron las requests con `page.route` para servirlos desde disco. Google Fonts se sirvió con `curl` dentro del mismo `route` porque `curl` sí pasa por el proxy.
- Playwright está instalado globalmente: `require($(npm root -g)/playwright)` con Chromium en `/opt/pw-browsers`. No corras `playwright install`.
- No configures el proxy en Chromium para `localhost`: devuelve 405. Mejor no usar proxy y resolver los CDN con `route`.
- Chromium headless reporta `pointer: fine` aunque el viewport sea de celular, así que el cursor custom aparece en las capturas mobile. En un teléfono real no aparece.
- El lanzador de Impeccable y `npx impeccable install` están bloqueados en este entorno.

### Qué revisar

- Escritorio 1440 por 900 y celular 390 por 844, en claro y oscuro, y con `reducedMotion: 'reduce'`.
- Que no haya scroll horizontal (`document.documentElement.scrollWidth - innerWidth` igual a 0).
- Que no haya errores en consola.
- El menú móvil (abrir, cerrar con Escape) y el botón de idioma.
- Hacé **una** ronda de capturas, corregí todo en un solo lote y como máximo confirmá una vez más. El usuario se quejó de esperas largas por demasiadas rondas de prueba.

### Vista previa en claude.ai

Se genera una copia del sitio en la carpeta temporal, adaptada a las reglas de artifacts:
- Sin `<!DOCTYPE>`, `<html>`, `<head>` ni `<body>`: se publica el contenido del head (título, script, fuentes, css) más el contenido del body.
- La clase `js-anim` se agrega por script porque no hay etiqueta `<html>`.
- Las imágenes se copian con nombres sin espacios (`necod.png`, `checklab.png`, `cabelma.png`, `cabelma-servicios.png`, `acquaro.png`, `codelens.png`, `yo.jpg`, `cambridge.pdf`, `photoshop.png`, `desarrollo-web.png`, `javascript.png`) y se reemplazan las rutas.
- En `styles.css` se agrega el guard `:root:not([data-theme="light"])` y el bloque `:root[data-theme="dark"]`.
- Se publica con la herramienta Artifact pasando `styles.css`, `main.js`, `i18n.js` e imágenes en `files`. Para actualizar la misma URL desde otra conversación, hay que pasar la URL del artifact.
- En la vista previa el link `mailto:` puede no funcionar; en el sitio real sí.

---

## 11. Convenciones de git

- Mensajes de commit en español, descriptivos, sin guiones largos.
- Trabajar en `claude/portfolio-redesign` salvo que el usuario pida otra rama.
- `git push -u origin <rama>`; si falla por red, reintentar con espera creciente.
- No reescribir historia ni forzar push.

---

## 12. Pendientes y mejoras sugeridas

- **Comprimir imágenes.** Las capturas PNG pesan entre 0.5 y 1.6 MB cada una. Pasarlas a WebP o AVIF (con `<picture>` y fallback) mejoraría mucho la carga. En el entorno no había Pillow ni ImageMagick.
- **Renombrar imágenes sin espacios** en el repo (hoy `img/Pagina cabelma 2.png`, `img/Ph & Ill.png`, etc.). Requiere actualizar rutas en `index.html`.
- **Publicar**: abrir PR de `claude/portfolio-redesign` a `main` cuando el usuario lo pida.
- **Verificar en producción** que GSAP y Lenis cargan desde jsDelivr (en el entorno de pruebas estaban bloqueados y se probó con copias locales).
- **Hooks de Impeccable**: si el usuario quiere el detector de diseño automático, tiene que correr `npx impeccable install --providers=claude --scope=project` en su máquina.
- **SEO**: la versión en inglés depende de JavaScript. Si importa que Google indexe el inglés, habría que generar una página `en/index.html` estática.
- **Color de acento**: el usuario podría pedir uno para el hover del texto. Hoy es inversión monocroma por regla del DESIGN.md.
