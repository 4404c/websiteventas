/* ======================================================
   LÓGICA DE LA PÁGINA
   No hace falta tocar este archivo para agregar productos
   o cambiar etiquetas — eso se hace en productos.js
   ====================================================== */

let filtroActivo = "Todos";

function obtenerEtiquetasUnicas() {
  const set = new Set();
  productos.forEach(p => p.etiquetas.forEach(e => set.add(e)));
  return ["Todos", ...Array.from(set).sort()];
}

function renderizarFiltros() {
  const cont = document.getElementById("filtros");
  cont.innerHTML = "";
  obtenerEtiquetasUnicas().forEach(etq => {
    const btn = document.createElement("button");
    btn.className = "filtro-btn" + (etq === filtroActivo ? " activo" : "");
    btn.textContent = etq;
    btn.onclick = () => {
      filtroActivo = etq;
      renderizarFiltros();
      renderizarGrilla();
    };
    cont.appendChild(btn);
  });
}

function renderizarGrilla() {
  const grilla = document.getElementById("grilla-productos");
  grilla.innerHTML = "";

  const lista = productos.filter((p, i) => {
    p._indice = i; // guardamos el índice original para abrir el detalle
    return filtroActivo === "Todos" || p.etiquetas.includes(filtroActivo);
  });

  if (lista.length === 0) {
    grilla.innerHTML = `<p class="sin-resultados">No hay productos con esta etiqueta todavía.</p>`;
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

function mostrarDetalle(indice) {
  const p = productos[indice];

  window.productoActual = p;
  indiceFotoActual = 0;
  renderizarFotoDetalle();
  document.getElementById("detalle-etiquetas").innerHTML =
    p.etiquetas.map(e => `<span class="chip">${e}</span>`).join("");
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
renderizarFiltros();
renderizarGrilla();