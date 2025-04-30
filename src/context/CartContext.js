import React, { createContext, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (produto) => {
    setCart((prevCart) => [...prevCart, produto]);
  };

  const removeFromCart = (produtoId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== produtoId));
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};