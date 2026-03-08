import { createContext, useContext, useMemo, useState } from "react";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [ids, setIds] = useState(() => {
    const saved = localStorage.getItem("velor_wishlist");
    return saved ? JSON.parse(saved) : [];
  });

  const toggleWishlist = (id) => {
    const next = ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id];
    setIds(next);
    localStorage.setItem("velor_wishlist", JSON.stringify(next));
  };

  const value = useMemo(() => ({ ids, toggleWishlist }), [ids]);
  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export const useWishlist = () => useContext(WishlistContext);
