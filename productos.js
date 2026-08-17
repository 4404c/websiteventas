/* ======================================================
   PRODUCTOS
   Acá van todos tus productos. Para agregar uno nuevo,
   copiá un bloque { ... } completo (incluida la coma)
   y pegalo antes del ] que cierra el array.

   etiquetas: podés poner las que quieras (categoría,
   tipo de producto, marca, etc). El filtro de la página
   se arma solo a partir de estas etiquetas, no hace
   falta tocar nada más.
   ====================================================== */
const productos = [
  {
    titulo: "Auriculares inalámbricos XZ200",
    etiquetas: ["Tecnología", "Celular"],
    fotos: [
      "https://via.placeholder.com/600x600?text=Foto+1",
      "https://via.placeholder.com/600x600?text=Foto+1b",
      "https://via.placeholder.com/600x600?text=Foto+1c"
    ],
    precioAntes: "$45.000",
    precioAhora: "$36.000",
    stock: "Último en stock",
    desc: "Cancelación de ruido activa, batería de 30 horas y estuche de carga rápida. Ideal para uso diario y viajes.",
    specs: [
      { nombre: "Batería", valor: "30 hs" },
      { nombre: "Conexión", valor: "Bluetooth 5.3" },
      { nombre: "Color", valor: "Negro" }
    ],
    whatsapp: "https://wa.me/5490000000000?text=Hola!%20Te%20consulto%20por%20los%20auriculares%20XZ200"
  },
  {
    titulo: "Cafetera eléctrica 12 tazas",
    etiquetas: ["Hogar"],
    fotos: ["https://via.placeholder.com/600x600?text=Foto+2"],
    precioAntes: "",
    precioAhora: "$28.500",
    stock: "",
    desc: "Cafetera de filtro con jarra de vidrio, placa térmica y apagado automático.",
    specs: [
      { nombre: "Capacidad", valor: "12 tazas" },
      { nombre: "Potencia", valor: "900W" },
      { nombre: "Color", valor: "Blanco" }
    ],
    whatsapp: "https://wa.me/5490000000000?text=Hola!%20Te%20consulto%20por%20la%20cafetera"
  },
  {
    titulo: "Parlante Bluetooth portátil",
    etiquetas: ["Tecnología"],
    fotos: ["https://via.placeholder.com/600x600?text=Foto+2"],
    precioAntes: "$22.000",
    precioAhora: "$17.900",
    stock: "",
    desc: "Resistente al agua (IPX6), 12 horas de batería y sonido estéreo con graves reforzados.",
    specs: [
      { nombre: "Batería", valor: "12 hs" },
      { nombre: "Resistencia", valor: "IPX6" },
      { nombre: "Color", valor: "Rojo/Negro" }
    ],
    whatsapp: "https://wa.me/5490000000000?text=Hola!%20Te%20consulto%20por%20el%20parlante"
  },
  {
    titulo: "Notebook Lenovo IdeaPad 15\"",
    etiquetas: ["Tecnología", "Computadora", "Lenovo"],
    fotos: ["https://via.placeholder.com/600x600?text=Foto+2"],
    precioAntes: "",
    precioAhora: "$450.000",
    stock: "",
    desc: "8GB RAM, SSD 256GB, ideal para uso diario y estudio. Batería de larga duración.",
    specs: [
      { nombre: "RAM", valor: "8 GB" },
      { nombre: "Almacenamiento", valor: "256 GB SSD" },
      { nombre: "Pantalla", valor: "15.6\"" }
    ],
    whatsapp: "https://wa.me/5490000000000?text=Hola!%20Te%20consulto%20por%20la%20notebook"
  }
];
