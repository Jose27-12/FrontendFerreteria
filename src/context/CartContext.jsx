import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [carrito, setCarrito] = useState([]);

  const formatearPrecio = (precio) =>
    precio.toLocaleString('es-CO', { style: 'currency', currency: 'COP' });

  return (
    <CartContext.Provider value={{ carrito, setCarrito, formatearPrecio }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
  