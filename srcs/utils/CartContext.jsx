import { createContext, useContext } from 'react';
import { useCart as useCartLogic } from '../components/hooks/useCartRaw';

const CartContext = createContext();

export function CartProvider({ children }) {
  const cartState = useCartLogic();
  return (
    <CartContext.Provider value={cartState}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
