import { AuthProvider } from "./AuthContext";
import { CartProvider } from "./CartContext";
import { ThemeProvider } from "./ThemeContext";
import { ToastProvider } from "./ToastContext";
import { WishlistProvider } from "./WishlistContext";

export function AppProviders({ children }) {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>{children}</CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
