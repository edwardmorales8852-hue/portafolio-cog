"use strict";
/* ===== CONFIGURACIÓN EDITABLE ===== */
const CONFIG = {
  email: "tu@correo.com", // reemplaza por tu correo real
  // Deja "" los perfiles que aún no tengas; no se mostrarán como enlaces.
  links: { Behance: "", Vimeo: "", Instagram: "", LinkedIn: "", GitHub: "" }
};
const CATEGORIES = ["Todos", "Dirección de arte", "Animación 3D", "Cortometrajes", "Producción audiovisual", "Experimentos visuales"];
/* Para añadir un proyecto: copia un objeto y cambia el id. cover: "assets/images/mi-portada.jpg" (si está vacío se usa arte provisional). */
const PROJECTS = [
  { id: "001", title: "El último partido", category: "Cortometrajes", year: 2025, duration: "Por definir", role: "Dirección y arte conceptual",
    tools: ["Blender", "DaVinci Resolve", "Procreate"], tones: ["#D58B52", "#2b1d16"], cover: "",
    description: "Ciencia ficción: un robot de combate obsoleto juega una partida absurda de ping-pong entre ruinas.",
    synopsis: "En una ciudad en ruinas, un robot de combate retirado encuentra una mesa de ping-pong intacta. Nadie queda para jugar, así que juega solo.",
    goal: "Contrastar humor y melancolía usando la ambientación como narrador principal.",
    palette: ["#0A0A0A", "#282828", "#A3A3A3", "#D58B52"],
    steps: ["Investigación de referencias de ciencia ficción postapocalíptica", "Storyboard y animatic", "Diseño del robot y del escenario", "Producción y postproducción"],
    result: "Ejemplo conceptual: aún no existe material final.", media: { video: "", images: [] }, credits: ["Dirección: [tu nombre]"] },
  { id: "002", title: "Chrome Worlds", category: "Animación 3D", year: 2025, duration: "Loop de 20 s", role: "Modelado, iluminación y cámara",
    tools: ["Blender", "Cycles"], tones: ["#9aa4ad", "#1b1f24"], cover: "",
    description: "Exploración de materiales metálicos, reflejos, iluminación de estudio y movimiento de cámara.",
    synopsis: "Series de objetos cromados en espacios mínimos, estudiados por cómo reflejan la luz.",
    goal: "Entender cómo la iluminación y el entorno definen un material metálico.",
    palette: ["#0A0A0A", "#171717", "#9AA4AD", "#F0EEE8"],
    steps: ["Modelado de formas simples", "Pruebas de materiales", "Esquemas de luz", "Movimiento de cámara y render"],
    result: "Ejemplo conceptual: sustituye por renders propios.", media: { video: "", images: [] }, credits: [] },
  { id: "003", title: "Fragmentos", category: "Producción audiovisual", year: 2024, duration: "Por definir", role: "Montaje y diseño sonoro",
    tools: ["DaVinci Resolve", "Audacity"], tones: ["#7c4a5a", "#1a1216"], cover: "",
    description: "Ejercicio de montaje, ritmo, color y sonido para contar con imágenes.",
    synopsis: "Una secuencia de planos breves que construye una historia solo por yuxtaposición.",
    goal: "Explorar cómo el ritmo y el sonido crean significado entre planos.",
    palette: ["#0A0A0A", "#7C4A5A", "#A3A3A3", "#F0EEE8"],
    steps: ["Selección de material", "Montaje de ritmo", "Diseño sonoro", "Corrección de color"],
    result: "Ejemplo conceptual: añade un vídeo en media.video.", media: { video: "", images: [] }, credits: [] },
  { id: "004", title: "Formas en movimiento", category: "Experimentos visuales", year: 2026, duration: "10 s", role: "Motion graphics",
    tools: ["After Effects", "JavaScript"], tones: ["#4d7fa0", "#101820"], cover: "",
    description: "Geometría abstracta, tipografía animada y composición digital.",
    synopsis: "Formas básicas y letras que se transforman siguiendo un ritmo visual.",
    goal: "Probar cómo la tipografía y la geometría pueden compartir un mismo movimiento.",
    palette: ["#0A0A0A", "#4D7FA0", "#D58B52", "#F0EEE8"],
    steps: ["Boceto de ritmo", "Animación de formas", "Tipografía cinética", "Composición final"],
    result: "Ejemplo conceptual: sustituye por tu experimento.", media: { video: "", images: [] }, credits: [] }
];
const LAB = [
  ["Pruebas de iluminación", "Iluminación", "#D58B52"], ["Estudio de materiales", "Materiales", "#9aa4ad"],
  ["Experimento tipográfico", "Tipografía", "#F0EEE8"], ["Animación abstracta", "Animación", "#4d7fa0"],
  ["Shader generativo", "Shaders", "#7c4a5a"], ["Cámara virtual", "Cámara virtual", "#5a7c5f"],
  ["Exploración con IA", "IA", "#a06fb0"], ["Boceto y prototipo", "Bocetos", "#888"]
].map(([title, tech, c], i) => ({ title, tech, c, note: `Espacio reservado ${String(i + 1).padStart(2, "0")}: sustituye por tu experimento.` }));
const STEPS = [
  ["Concepto", "Investigación, intención narrativa, referencias y objetivos.", "#D58B52"],
  ["Preproducción", "Guion, storyboard, diseño de personajes, escenarios, planificación y animatic.", "#7c4a5a"],
  ["Dirección de arte", "Paleta cromática, composición, iluminación, materiales y lenguaje visual.", "#9aa4ad"],
  ["Producción", "Modelado, animación, grabación, creación de recursos y desarrollo técnico.", "#4d7fa0"],
  ["Postproducción", "Montaje, composición, corrección de color, efectos y diseño sonoro.", "#5a7c5f"],
  ["Entrega", "Render final, exportación, optimización y presentación del proyecto.", "#D58B52"]
];

/* ===== UTILIDADES (sin innerHTML: todo se inserta como texto) ===== */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const pad = n => String(n).padStart(2, "0");
function h(tag, attrs = {}, ...kids) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") e.className = v;
    else if (k === "vars") Object.entries(v).forEach(([n, x]) => e.style.setProperty(n, x));
    else if (k.startsWith("on")) e.addEventListener(k.slice(2), v);
    else e.setAttribute(k, v);
  }
  e.append(...kids.flat().filter(x => x != null));
  return e;
}
const art = (p, extra = {}) => p.cover
  ? h("img", { class: "art", src: p.cover, alt: `Portada de ${p.title}`, loading: "lazy" })
  : h("div", { class: "art", role: "img", "aria-label": `Imagen provisional de ${p.title}`, vars: { "--a": p.tones[0], "--b": p.tones[1], ...extra } });
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .12 });
const reveal = el => { el.classList.add("rv"); io.observe(el); return el; };
function filterBar(host, items, onPick) {
  items.forEach((name, i) => host.append(h("button", { type: "button", "aria-pressed": String(i === 0), onclick: () => {
    $$("button", host).forEach(b => b.setAttribute("aria-pressed", String(b === host.children[i])));
    onPick(name);
  } }, name)));
}

/* ===== PORTAFOLIO ===== */
const grid = $("#grid");
function renderGrid(cat = "Todos") {
  grid.replaceChildren();
  const list = PROJECTS.filter(p => cat === "Todos" || p.category === cat);
  if (!list.length) grid.append(h("p", { class: "empty" }, "Aún no hay proyectos en esta categoría. Añade uno en PROJECTS dentro de script.js."));
  list.forEach(p => grid.append(reveal(h("button", { class: "card", type: "button", "aria-label": `Abrir proyecto ${p.id}: ${p.title}`, onclick: () => openDetail(p.id) },
    art(p),
    h("div", { class: "row meta" }, h("span", { class: "id" }, `PROYECTO ${p.id}`), h("span", {}, `${p.category} · ${p.year}`)),
    h("h3", {}, p.title), h("p", {}, p.description),
    h("p", { class: "meta" }, `${p.role} · ${p.tools.join(", ")}${p.duration ? " · " + p.duration : ""}`)))));
}
filterBar($("#filters"), CATEGORIES, renderGrid);
renderGrid();

/* ===== VISTA DE DETALLE ===== */
const dlg = $("#detail"), dBody = $("#dBody");
function sec(title, ...body) { return h("section", {}, h("h3", {}, title), h("div", {}, ...body)); }
function openDetail(id) {
  const i = PROJECTS.findIndex(p => p.id === id), p = PROJECTS[i];
  const prev = PROJECTS[(i - 1 + PROJECTS.length) % PROJECTS.length], next = PROJECTS[(i + 1) % PROJECTS.length];
  const m = p.media || {};
  dBody.replaceChildren(h("div", { class: "d" },
    h("button", { class: "x", type: "button", onclick: () => dlg.close() }, "Cerrar ✕"),
    h("div", { class: "cover" }, art(p)),
    h("div", {}, h("p", { class: "meta id" }, `PROYECTO ${p.id}`), h("h2", { id: "dTitle" }, p.title)),
    h("dl", { class: "fiche" }, ...[["Categoría", p.category], ["Año", p.year], ["Rol", p.role], ["Duración", p.duration || "—"]].map(([k, v]) => h("div", {}, h("dt", {}, k), h("dd", {}, String(v))))),
    sec("Sinopsis", h("p", {}, p.synopsis)),
    sec("Objetivo creativo", h("p", {}, p.goal)),
    sec("Dirección de arte", h("div", { class: "sw", role: "list" }, ...p.palette.map(c => h("i", { role: "listitem", title: c, "aria-label": c, vars: { background: c } }))), h("p", { class: "meta" }, p.palette.join("  ·  "))),
    sec("Storyboard", h("div", { class: "sb" }, ...[0, 1, 2, 3].map(n => art(p, { "--x": `${20 + n * 20}%`, "--r": `${150 + n * 15}deg` })))),
    sec("Proceso", h("ol", {}, ...p.steps.map(s => h("li", {}, s)))),
    sec("Material", m.video ? h("video", { controls: "", preload: "none", playsinline: "" }, h("source", { src: m.video })) : h("p", {}, "Sin vídeo todavía. Añade la ruta en media.video."),
      ...(m.images || []).map(src => h("img", { src, alt: `Imagen de ${p.title}`, loading: "lazy" }))),
    sec("Herramientas", h("p", {}, p.tools.join(", "))),
    sec("Resultado final", h("p", {}, p.result)),
    sec("Créditos", h("p", {}, p.credits.length ? p.credits.join(" / ") : "Sin colaboradores registrados.")),
    h("div", { class: "pn" }, h("button", { type: "button", onclick: () => openDetail(prev.id) }, `← ${prev.title}`), h("button", { type: "button", onclick: () => openDetail(next.id) }, `${next.title} →`))));
  if (!dlg.open) dlg.showModal();
  dlg.scrollTop = 0;
}

/* ===== LABORATORIO ===== */
const lab = $("#lab");
function renderLab(t = "Todos") {
  lab.replaceChildren();
  LAB.filter(x => t === "Todos" || x.tech === t).forEach(x => lab.append(reveal(h("article", {},
    art({ title: x.title, tones: [x.c, "#171717"] }), h("p", { class: "meta" }, x.tech), h("h3", {}, x.title), h("p", {}, x.note)))));
}
filterBar($("#labFilters"), ["Todos", ...new Set(LAB.map(x => x.tech))], renderLab);
renderLab();

/* ===== PROCESO (pestañas con teclado) ===== */
const tabs = $("#tabs"), panel = $("#panel");
function pick(i, focus) {
  $$("button", tabs).forEach((b, n) => { b.setAttribute("aria-selected", String(n === i)); b.tabIndex = n === i ? 0 : -1; });
  const [t, d, c] = STEPS[i];
  panel.setAttribute("aria-labelledby", `tab${i}`);
  panel.replaceChildren(art({ title: t, tones: [c, "#171717"] }, { "--x": `${15 + i * 14}%` }), h("p", { class: "meta id" }, `Fase ${pad(i + 1)} de ${pad(STEPS.length)}`), h("h3", {}, t), h("p", {}, d));
  if (focus) tabs.children[i].focus();
}
STEPS.forEach(([t], i) => tabs.append(h("button", { id: `tab${i}`, role: "tab", type: "button", onclick: () => pick(i), onkeydown: e => {
  const k = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
  if (k) { e.preventDefault(); pick((i + k + STEPS.length) % STEPS.length, true); }
} }, h("span", {}, pad(i + 1)), t)));
pick(0);

/* ===== CONTACTO ===== */
$("#mail").textContent = CONFIG.email;
$("#mailto").href = `mailto:${CONFIG.email}`;
const status = $("#status");
$("#copy").addEventListener("click", async () => {
  try { await navigator.clipboard.writeText(CONFIG.email); status.textContent = "Correo copiado."; }
  catch { status.textContent = "No se pudo copiar. Selecciona el correo manualmente."; }
});
Object.entries(CONFIG.links).forEach(([n, url]) => $("#socials").append(h("li", {},
  url ? h("a", { href: url, target: "_blank", rel: "noopener noreferrer" }, n) : h("span", { class: "off" }, `${n} (pendiente)`))));

/* ===== NAVEGACIÓN, PROGRESO, MENÚ, AÑO ===== */
$$(".year").forEach(e => e.textContent = new Date().getFullYear());
const burger = $(".burger"), menu = $("#menu");
burger.addEventListener("click", () => burger.setAttribute("aria-expanded", String(menu.classList.toggle("open"))));
menu.addEventListener("click", e => { if (e.target.tagName === "A") { menu.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); } });
const navIO = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) $$("#menu a").forEach(a => a.classList.toggle("on", a.getAttribute("href") === "#" + e.target.id)); }), { rootMargin: "-45% 0px -50% 0px" });
$$("main section").forEach(s => navIO.observe(s));
const bar = $("#progress"), topBtn = $("#toTop");
addEventListener("scroll", () => {
  const max = document.documentElement.scrollHeight - innerHeight;
  bar.style.width = (max > 0 ? scrollY / max * 100 : 0) + "%";
  topBtn.hidden = scrollY < innerHeight * .6;
}, { passive: true });
topBtn.addEventListener("click", () => scrollTo({ top: 0 }));
dlg.addEventListener("click", e => { if (e.target === dlg) dlg.close(); });
