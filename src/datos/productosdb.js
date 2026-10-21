// src/datos/productosdb.js

let productos = [
  { 
    id: 1, 
    codigo: "PR001",
    nombre: "Mermelada de Frutilla", 
    precio: 2500, 
    categoria: "Conservas", 
    vidaUtil: "365 días",
    imagen: "https://osojimix.com/wp-content/uploads/2021/04/MERMELADA-DE-FRUTILLAS.jpg" 
  },
  { 
    id: 2, 
    codigo: "PR002",
    nombre: "Mermelada de Durazno", 
    precio: 2300, 
    categoria: "Conservas", 
    vidaUtil: "365 días",
    imagen: "https://osojimix.com/wp-content/uploads/2022/01/Mermelada-de-duraznos-con-tagatosa-Pa%CC%81gina-500x500.jpg" 
  },
  { 
    id: 3, 
    codigo: "PR003",
    nombre: "Salsa de Tomate", 
    precio: 1800, 
    categoria: "Salsas", 
    vidaUtil: "180 días",
    imagen: "https://www.aceitesdeolivadeespana.com/wp-content/uploads/2021/05/Salsa-de-tomate-casera.jpg" 
  },
  { 
    id: 4, 
    codigo: "PR004",
    nombre: "Choclo en Conserva", 
    precio: 1200, 
    categoria: "Conservas", 
    vidaUtil: "540 días",
    imagen: "https://www.wikihow.com/images_en/thumb/5/50/Store-Sweet-Corn-Step-16-Version-2.jpg/550px-nowatermark-Store-Sweet-Corn-Step-16-Version-2.jpg" 
  },
  { 
    id: 5, 
    codigo: "PR005",
    nombre: "Arvejas en Conserva", 
    precio: 1100, 
    categoria: "Conservas", 
    vidaUtil: "540 días",
    imagen: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjgHRKaiUgwqqplO0kC9Hij4rTuj5bfzwQTCDa6Zmh8XZ46UY_hNNQSul3j73ruYonNK_X3bJuDvvFCK_CC8Z_VUMps_K9qhTn4f-3dGq1PVw1_0Ky7HFJQrktCeZbkQR4NaXMdYe00e6w/s1600/LATA+DE+ARVEJAS+VOLVANDO+A++PLATO.jpg" 
  },
  { 
    id: 6, 
    codigo: "PR006",
    nombre: "Manzana Deshidratada", 
    precio: 3500, 
    categoria: "Deshidratados", 
    vidaUtil: "180 días",
    imagen: "https://deshidratadordealimentos.cl/wp-content/uploads/2020/05/manzanas-1024x683.jpg" 
  }
];

export const obtenerProductos = () => productos;

export const obtenerProductoPorId = (id) => productos.find(p => p.id === parseInt(id));

export const agregarProducto = (nuevoProducto) => {
  nuevoProducto.id = productos.length ? productos[productos.length - 1].id + 1 : 1;
  productos.push(nuevoProducto);
  return nuevoProducto;
};