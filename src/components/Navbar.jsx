import { Heart, ShoppingBag, User } from "lucide-react";
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
      <div className="shell flex h-14 items-center justify-between gap-2 sm:h-16">
        <Link to="/" className="flex items-center gap-2 sm:gap-3">
          <img src="/logo.png" alt="Valley Mountain logo" className="h-8 w-auto bg-transparent object-contain dark:hidden sm:h-10" />
          <img src="/logo2.png" alt="Valley Mountain logo" className="hidden h-8 w-auto bg-transparent object-contain dark:block sm:h-10" />
          <span className="whitespace-nowrap font-serif text-xl leading-none tracking-tight max-[380px]:text-lg sm:text-3xl">Valley Mountain</span>
        </Link>

        <nav className="flex min-w-0 items-center gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-4 md:gap-6">
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
                    className={`whitespace-nowrap text-xs font-medium tracking-wide transition duration-300 sm:text-sm ${
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
                `whitespace-nowrap text-xs tracking-wide transition sm:text-sm ${
                  isActive
                    ? "text-zinc-950 dark:text-white"
                    : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
          {(user?.isAdmin || ["admin", "mentor", "support"].includes(user?.role)) && (
            <Link to="/admin" className="whitespace-nowrap text-xs text-zinc-500 hover:text-zinc-900 sm:text-sm dark:text-zinc-300">
              Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <ThemeToggle />
          <Link className="inline-btn !px-2 !py-1.5 sm:!px-4 sm:!py-2" to="/cart">
            <ShoppingBag size={16} />
            {totals.count}
          </Link>
          <Link className="inline-btn !px-2 !py-1.5 sm:!px-4 sm:!py-2" to="/profile">
            <Heart size={16} />
            {ids.length}
          </Link>
          {user ? (
            <button className="inline-btn !px-2 !py-1.5 sm:!px-4 sm:!py-2" onClick={handleLogout}>
              <User size={16} />
              Logout
            </button>
          ) : (
            <Link className="inline-btn !px-2 !py-1.5 sm:!px-4 sm:!py-2" to="/login">
              <User size={16} />
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

