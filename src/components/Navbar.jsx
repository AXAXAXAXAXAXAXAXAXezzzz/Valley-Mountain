import { Heart, Menu, ShoppingBag, User, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import ThemeToggle from "./ui/ThemeToggle";

const links = [
  { to: "/", label: "Home" },
  { to: "/catalog", label: "Catalog" },
  { to: "/support", label: "Support" },
  { to: "/profile", label: "Profile" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { totals } = useCart();
  const { ids } = useWishlist();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const activeGender = new URLSearchParams(location.search).get("gender");

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/60 bg-white/85 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/85">
      <div className="shell flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src="/logo.png" alt="Valley Mountain logo" className="h-10 w-auto bg-transparent object-contain dark:hidden" />
          <img src="/logo2.png" alt="Valley Mountain logo" className="hidden h-10 w-auto bg-transparent object-contain dark:block" />
          <span className="font-serif text-3xl leading-none tracking-tight">Valley Mountain</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <div className="flex items-center gap-2">
            {[
              { label: "Man", gender: "man" },
              { label: "Woman", gender: "woman" },
            ].map((item, index) => {
              const isActive = location.pathname === "/catalog" && activeGender === item.gender;
              return (
                <div key={item.gender} className="flex items-center gap-2">
                  {index > 0 && <span className="text-zinc-400 dark:text-zinc-500">/</span>}
                  <Link
                    to={`/catalog?gender=${item.gender}`}
                    className={`text-sm font-medium tracking-wide transition duration-300 ${
                      isActive
                        ? "scale-110 text-zinc-950 dark:text-white"
                        : "text-zinc-500 hover:scale-105 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                    }`}
                  >
                    {item.label}
                  </Link>
                </div>
              );
            })}
          </div>

          {links.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `text-sm tracking-wide transition ${
                  isActive
                    ? "text-zinc-950 dark:text-white"
                    : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
          {user?.isAdmin && (
            <Link to="/admin" className="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-300">
              Admin
            </Link>
          )}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          <Link className="inline-btn" to="/cart">
            <ShoppingBag size={16} />
            {totals.count}
          </Link>
          <Link className="inline-btn" to="/profile">
            <Heart size={16} />
            {ids.length}
          </Link>
          {user ? (
            <button className="inline-btn" onClick={handleLogout}>
              <User size={16} />
              Logout
            </button>
          ) : (
            <Link className="inline-btn" to="/login">
              <User size={16} />
              Login
            </Link>
          )}
        </div>

        <button className="inline-btn md:hidden" onClick={() => setOpen((prev) => !prev)}>
          {open ? <X size={16} /> : <Menu size={16} />}
        </button>
      </div>

      {open && (
        <div className="shell space-y-3 border-t border-zinc-200 py-4 md:hidden dark:border-zinc-800">
          <div className="flex gap-2">
            {[
              { label: "Man", gender: "man" },
              { label: "Woman", gender: "woman" },
            ].map((item, index) => {
              const isActive = location.pathname === "/catalog" && activeGender === item.gender;
              return (
                <div key={`mobile-${item.gender}`} className="flex items-center gap-2">
                  {index > 0 && <span className="text-zinc-400 dark:text-zinc-500">/</span>}
                  <Link
                    to={`/catalog?gender=${item.gender}`}
                    className={`text-sm font-medium transition ${
                      isActive
                        ? "scale-105 text-zinc-950 dark:text-white"
                        : "text-zinc-500 dark:text-zinc-300"
                    }`}
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                </div>
              );
            })}
          </div>

          {links.map((item) => (
            <Link key={item.to} to={item.to} className="block text-sm" onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}
          <div className="flex flex-wrap gap-2">
            <ThemeToggle />
            <Link className="inline-btn" to="/cart" onClick={() => setOpen(false)}>
              Cart {totals.count}
            </Link>
            {!user ? (
              <Link className="inline-btn" to="/login" onClick={() => setOpen(false)}>
                Login
              </Link>
            ) : (
              <button className="inline-btn" onClick={handleLogout}>
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

