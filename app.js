/* ======================================================
   LÓGICA DE LA PÁGINA
   Ahora el catálogo se carga desde productos.json
   (ya no se usa productos.js).

   Para agregar/editar productos, se edita productos.json.
   Las imágenes van en la carpeta img/ y se referencian
   como "img/nombre-archivo.jpg".
   ====================================================== */

let productos = [];
let filtroCategoria = "Todos";
let filtroSubcategoria = "Todos";
let terminoBusqueda = "";
let indiceFotoActual = 0;

const NUMERO_WHATSAPP = "5490000000000"; // <-- poné acá tu número (con código de país, sin +)

function normalizarTexto(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function formatearPrecio(numero) {
  const n = Number(numero);
  if (isNaN(n)) return "";
  return "$" + n.toLocaleString("es-AR");
}

/* Convierte un producto del formato de productos.json
   al formato que usa el resto de la página */
function transformarProducto(p) {
  let fotos = [];
  if (Array.isArray(p.imagenes) && p.imagenes.length > 0) {
    fotos = p.imagenes;
  } else if (p.imagen) {
    fotos = [p.imagen];
  } else {
    fotos = ["https://via.placeholder.com/600x600?text=Sin+foto"];
  }

  const specs = Object.entries(p.atributos || {}).map(([nombre, valor]) => ({
    nombre,
    valor
  }));
  if (p.marca) specs.push({ nombre: "Marca", valor: p.marca });

  const mensaje = encodeURIComponent(`Hola! Te consulto por: ${p.nombreProducto}`);

  return {
    titulo: p.nombreProducto,
    etiquetas: Array.isArray(p.categorias) ? p.categorias : [],
    subcategoria: p.subcategoria || "",
    fotos,
    precioAntes: "",
    precioAhora: formatearPrecio(p.precio),
    stock: "",
    desc: p.descripcionProducto || "",
    specs,
    whatsapp: `https://wa.me/${NUMERO_WHATSAPP}?text=${mensaje}`
  };
}

async function cargarProductos() {
  const grilla = document.getElementById("grilla-productos");
  try {
    const resp = await fetch("productos.json");
    if (!resp.ok) throw new Error("No se pudo leer productos.json");
    const data = await resp.json();
    productos = data
      .filter(p => p.publicado !== false)
      .map(transformarProducto);
  } catch (err) {
    console.error(err);
    grilla.innerHTML = `<p class="sin-resultados">No se pudo cargar el catálogo. Si estás abriendo el archivo index.html directamente (file://), necesitás servir la página con un servidor local para que funcione el fetch de productos.json.</p>`;
    productos = [];
  }
  renderizarFiltros();
  renderizarGrilla();
}

function renderizarGrilla() {
  const grilla = document.getElementById("grilla-productos");
  grilla.innerHTML = "";

  const busquedaNormalizada = normalizarTexto(terminoBusqueda.trim());

  const lista = productos.filter((p, i) => {
    p._indice = i;
    const coincideCategoria = filtroCategoria === "Todos" || p.etiquetas.includes(filtroCategoria);
    const coincideSubcategoria = filtroSubcategoria === "Todos" || p.subcategoria === filtroSubcategoria;
    const coincideBusqueda =
      busquedaNormalizada === "" || normalizarTexto(p.titulo).includes(busquedaNormalizada);
    return coincideCategoria && coincideSubcategoria && coincideBusqueda;
  });

  if (lista.length === 0) {
    grilla.innerHTML = `<p class="sin-resultados">No se encontraron productos.</p>`;
    return;
  }

  lista.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";
    card.onclick = () => mostrarDetalle(p._indice);
    card.innerHTML = `
      <img class="foto-mini" src="${p.fotos[0]}" alt="${p.titulo}">
      <div class="card-info">
        <div class="etiquetas-mini">
          ${p.etiquetas.slice(0, 1).map(e => `<span class="chip">${e}</span>`).join("")}
          ${p.subcategoria ? `<span class="chip chip-sub">${p.subcategoria}</span>` : ""}
          ${p.etiquetas.length > 1 ? `<span class="chip">+${p.etiquetas.length - 1}</span>` : ""}
        </div>
        <h3>${p.titulo}</h3>
        <div class="precio-mini">
          ${p.precioAhora}${p.precioAntes ? `<span class="antes">${p.precioAntes}</span>` : ""}
        </div>
      </div>
    `;
    grilla.appendChild(card);
  });
}

function obtenerCategoriasUnicas() {
  const set = new Set();
  productos.forEach(p => p.etiquetas.forEach(e => set.add(e)));
  return ["Todos", ...Array.from(set).sort()];
}

function obtenerSubcategoriasUnicas() {
  const set = new Set();
  productos.forEach(p => {
    if (p.subcategoria) set.add(p.subcategoria);
  });
  return ["Todos", ...Array.from(set).sort()];
}

function renderizarFiltros() {
  renderizarListaFiltro("categoria", obtenerCategoriasUnicas(), filtroCategoria, "Categoría");
  renderizarListaFiltro("subcategoria", obtenerSubcategoriasUnicas(), filtroSubcategoria, "Subcategoría");
}

function renderizarListaFiltro(tipo, opciones, valorActual, etiqueta) {
  const lista = document.getElementById(`filtro-${tipo}-lista`);
  const actualEl = document.getElementById(`filtro-${tipo}-actual`);
  lista.innerHTML = "";
  actualEl.textContent = `${etiqueta}: ${valorActual}`;

  opciones.forEach(op => {
    const item = document.createElement("button");
    item.type = "button";
    item.className = "filtro-item" + (op === valorActual ? " activo" : "");
    item.textContent = op;
    item.onclick = () => {
      if (tipo === "categoria") {
        filtroCategoria = op;
      } else {
        filtroSubcategoria = op;
      }
      cerrarFiltroListas();
      renderizarFiltros();
      renderizarGrilla();
    };
    lista.appendChild(item);
  });
}

function toggleFiltroLista(e, tipo) {
  e.stopPropagation();
  const listaId = `filtro-${tipo}-lista`;
  const yaEstabaAbierta = !document.getElementById(listaId).classList.contains("oculto");
  cerrarFiltroListas();
  if (!yaEstabaAbierta) {
    document.getElementById(listaId).classList.remove("oculto");
  }
}

function cerrarFiltroListas() {
  document.querySelectorAll(".filtro-lista").forEach(el => el.classList.add("oculto"));
}

document.addEventListener("click", (e) => {
  if (!e.target.closest(".filtro-dropdown")) {
    cerrarFiltroListas();
  }
});

function mostrarDetalle(indice) {
  const p = productos[indice];

  window.productoActual = p;
  indiceFotoActual = 0;
  renderizarFotoDetalle();
  document.getElementById("detalle-etiquetas").innerHTML =
    p.etiquetas.map(e => `<span class="chip">${e}</span>`).join("") +
    (p.subcategoria ? `<span class="chip chip-sub">${p.subcategoria}</span>` : "");
  document.getElementById("detalle-titulo").textContent = p.titulo;
  document.getElementById("detalle-desc").textContent = p.desc;
  document.getElementById("detalle-precio").innerHTML =
    p.precioAhora + (p.precioAntes ? `<span class="antes">${p.precioAntes}</span>` : "");
  document.getElementById("detalle-whatsapp").href = p.whatsapp;

  const stockEl = document.getElementById("detalle-stock");
  if (p.stock) {
    stockEl.textContent = p.stock;
    stockEl.classList.remove("oculto");
  } else {
    stockEl.classList.add("oculto");
  }

  const specsEl = document.getElementById("detalle-specs");
  specsEl.innerHTML = "";
  p.specs.forEach(s => {
    const li = document.createElement("li");
    li.innerHTML = `<span>${s.nombre}</span><span>${s.valor}</span>`;
    specsEl.appendChild(li);
  });

  document.getElementById("vista-catalogo").classList.add("oculto");
  document.getElementById("vista-detalle").classList.remove("oculto");
  window.scrollTo(0, 0);
}

function renderizarFotoDetalle() {
  const p = window.productoActual;
  document.getElementById("detalle-foto").src = p.fotos[indiceFotoActual];
  document.getElementById("detalle-foto").alt = p.titulo;

  const mostrarNav = p.fotos.length > 1;
  document.querySelector(".foto-flecha-izq").classList.toggle("oculto", !mostrarNav);
  document.querySelector(".foto-flecha-der").classList.toggle("oculto", !mostrarNav);

  const puntosEl = document.getElementById("foto-puntos");
  puntosEl.innerHTML = "";
  if (mostrarNav) {
    p.fotos.forEach((_, i) => {
      const punto = document.createElement("button");
      punto.className = "punto" + (i === indiceFotoActual ? " activo" : "");
      punto.onclick = () => { indiceFotoActual = i; renderizarFotoDetalle(); };
      puntosEl.appendChild(punto);
    });
  }
}

function fotoAnterior() {
  const p = window.productoActual;
  indiceFotoActual = (indiceFotoActual - 1 + p.fotos.length) % p.fotos.length;
  renderizarFotoDetalle();
}

function fotoSiguiente() {
  const p = window.productoActual;
  indiceFotoActual = (indiceFotoActual + 1) % p.fotos.length;
  renderizarFotoDetalle();
}

function mostrarCatalogo() {
  document.getElementById("vista-detalle").classList.add("oculto");
  document.getElementById("vista-catalogo").classList.remove("oculto");
  window.scrollTo(0, 0);
}

/* Arranque de la página */
document.getElementById("buscador").addEventListener("input", (e) => {
  terminoBusqueda = e.target.value;
  renderizarGrilla();
});

cargarProductos();