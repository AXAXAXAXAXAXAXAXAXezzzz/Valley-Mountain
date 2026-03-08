import { createContext, useContext, useMemo, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem("velor_cart");
    return saved ? JSON.parse(saved) : [];
  });

  const persist = (next) => {
    setItems(next);
    localStorage.setItem("velor_cart", JSON.stringify(next));
  };

  const addToCart = (product, qty = 1, size = "M", color = "Black") => {
    const key = `${product._id}-${size}-${color}`;
    const existing = items.find((item) => item.key === key);

    if (existing) {
      persist(items.map((item) => (item.key === key ? { ...item, qty: item.qty + qty } : item)));
      return;
    }

    persist([
      ...items,
      {
        key,
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.images?.[0],
        size,
        color,
        qty,
      },
    ]);
  };

  const updateQty = (key, qty) => persist(items.map((item) => (item.key === key ? { ...item, qty: Math.max(1, qty) } : item)));
  const removeFromCart = (key) => persist(items.filter((item) => item.key !== key));
  const clearCart = () => persist([]);

  const totals = useMemo(() => {
    const count = items.reduce((sum, item) => sum + item.qty, 0);
    const amount = items.reduce((sum, item) => sum + item.price * item.qty, 0);
    return { count, amount };
  }, [items]);

  return (
    <CartContext.Provider value={{ items, totals, addToCart, updateQty, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
