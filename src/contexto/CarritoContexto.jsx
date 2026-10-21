// src/contexto/CarritoContexto.jsx
import { createContext, useContext, useState } from "react";

const CarritoContexto = createContext();

export const useCarrito = () => useContext(CarritoContexto);

export function CarritoProvider({ children }) {
  const [carrito, setCarrito] = useState([]);

  const agregarAlCarrito = (producto) => {
    setCarrito((prev) => {
      const existe = prev.find((item) => item.id === producto.id);
      if (existe) {
        return prev.map((item) =>
          item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
  };

  const eliminarDelCarrito = (id) => {
    setCarrito((prev) => prev.filter((item) => item.id !== id));
  };

  const limpiarCarrito = () => setCarrito([]);

  const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  const cantidadTotal = carrito.reduce((acc, item) => acc + item.cantidad, 0);

  return (
    <CarritoContexto.Provider
      value={{ carrito, agregarAlCarrito, eliminarDelCarrito, limpiarCarrito, total, cantidadTotal }}
    >
      {children}
    </CarritoContexto.Provider>
  );
}