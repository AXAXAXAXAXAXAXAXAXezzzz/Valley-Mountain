import { Heart, PackageSearch, Settings, ShoppingBag, Sparkles, UserRound } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import EmptyState from "../components/ui/EmptyState";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { useWishlist } from "../context/WishlistContext";
import { mockProducts } from "../data/mockProducts";
import { orderService } from "../services/api/orderService";
import { productService } from "../services/api/productService";
import { formatCurrency } from "../utils/format";

const SETTINGS_KEY = "vm_profile_settings";
const ALLOWED_TABS = new Set(["overview", "orders", "wishlist", "settings"]);

export default function ProfilePage() {
  const { user, logout, updateLocalProfile } = useAuth();
  const { ids } = useWishlist();
  const { addToCart } = useCart();
  const { pushToast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const [tab, setTab] = useState("overview");
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem(SETTINGS_KEY);
    return saved
      ? JSON.parse(saved)
      : {
          newsletter: true,
          orderAlerts: true,
          darkPreference: false,
        };
  });
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    city: "",
  });

  useEffect(() => {
    setForm((prev) => ({ ...prev, name: user?.name || "", email: user?.email || "" }));
  }, [user]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const requestedTab = params.get("tab");
    if (requestedTab === "support") {
      navigate("/support", { replace: true });
      return;
    }
    if (requestedTab && ALLOWED_TABS.has(requestedTab)) {
      setTab(requestedTab);
    }
  }, [location.search, navigate]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const [ordersData, productsData] = await Promise.all([orderService.getAll(), productService.getAll()]);
        if (cancelled) return;
        setOrders(Array.isArray(ordersData) ? ordersData : []);
        setProducts(Array.isArray(productsData) && productsData.length ? productsData : mockProducts);
      } catch {
        if (!cancelled) {
          setOrders([]);
          setProducts(mockProducts);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const wishlistProducts = useMemo(() => {
    return products.filter((item) => ids.includes(item._id)).slice(0, 8);
  }, [products, ids]);

  const totalSpent = useMemo(() => orders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0), [orders]);
  const recentOrders = useMemo(() => [...orders].slice(0, 5), [orders]);

  if (!user) {
    return <EmptyState title="Please login" description="Account features are available after authentication." />;
  }

  const initials = (user.name || "U")
    .split(" ")
    .map((part) => part[0]?.toUpperCase())
    .join("")
    .slice(0, 2);

  const saveProfile = () => {
    updateLocalProfile({ name: form.name, email: form.email });
    pushToast("Profile updated", "success");
  };

  const saveSettings = () => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    pushToast("Settings saved", "success");
  };

  const reorder = (order) => {
    order.items.forEach((item) => {
      addToCart(
        {
          _id: item.productId || `reorder_${Date.now()}`,
          name: item.name,
          price: item.price,
          images: [item.image],
        },
        item.qty || 1,
        item.size || "M",
        item.color || "Black"
      );
    });
    pushToast("Order added to cart", "success");
  };

  return (
    <div className="space-y-6">
      <section className="glass-card overflow-hidden">
        <div className="relative p-4 sm:p-8">
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-900 to-zinc-700 opacity-95 dark:from-zinc-100 dark:to-zinc-300" />
          <div className="relative flex flex-col gap-4 text-white dark:text-zinc-900 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-lg font-semibold backdrop-blur dark:bg-zinc-900/15 sm:h-14 sm:w-14 sm:text-xl">
                {initials}
              </div>
              <div>
                <h1 className="font-serif text-2xl sm:text-4xl">{user.name}</h1>
                <p className="text-sm opacity-90">{user.email}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button className="inline-btn border-white/35 bg-white/10 text-white hover:bg-white/15 dark:border-zinc-900/30 dark:bg-zinc-900/10 dark:text-zinc-900" onClick={logout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Orders" value={orders.length} icon={<PackageSearch size={16} />} />
        <StatCard title="Total Spent" value={formatCurrency(totalSpent)} icon={<ShoppingBag size={16} />} />
        <StatCard title="Wishlist" value={ids.length} icon={<Heart size={16} />} />
        <StatCard title="Tier" value={totalSpent > 1500000 ? "Elite" : "Core"} icon={<Sparkles size={16} />} />
      </section>

      <section className="glass-card p-3">
        <div className="flex flex-wrap gap-2">
          <TabButton active={tab === "overview"} onClick={() => setTab("overview")} icon={<UserRound size={14} />} label="Overview" />
          <TabButton active={tab === "orders"} onClick={() => setTab("orders")} icon={<PackageSearch size={14} />} label="Orders" />
          <TabButton active={tab === "wishlist"} onClick={() => setTab("wishlist")} icon={<Heart size={14} />} label="Wishlist" />
          <TabButton active={tab === "settings"} onClick={() => setTab("settings")} icon={<Settings size={14} />} label="Settings" />
        </div>
      </section>

      {tab === "overview" && (
        <section className="grid gap-4 lg:grid-cols-[1.4fr,1fr]">
          <div className="glass-card p-4 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Recent Orders</h2>
              <button className="inline-btn" onClick={() => setTab("orders")}>
                View all
              </button>
            </div>
            {loading ? (
              <p className="text-sm text-zinc-500">Loading orders...</p>
            ) : recentOrders.length === 0 ? (
              <p className="text-sm text-zinc-500">No orders yet.</p>
            ) : (
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div key={order._id} className="rounded-2xl border border-zinc-200 p-4 dark:border-zinc-700">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-zinc-500">#{order._id.slice(0, 8)}</p>
                      <p className="font-semibold">{formatCurrency(order.totalAmount)}</p>
                    </div>
                    <p className="mt-1 text-sm">{order.items.length} items</p>
                    <button className="mt-3 inline-btn" onClick={() => reorder(order)}>
                      Reorder
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="glass-card p-4 sm:p-6">
            <h2 className="text-2xl font-semibold">Quick Links</h2>
            <div className="mt-4 space-y-2">
              <Link to="/catalog" className="inline-btn w-full justify-center">
                Shop catalog
              </Link>
              <Link to="/cart" className="inline-btn w-full justify-center">
                Open cart
              </Link>
              <button className="inline-btn w-full justify-center" onClick={() => setTab("settings")}>
                Account settings
              </button>
            </div>
            <div className="mt-6 rounded-2xl border border-zinc-200 p-4 text-sm dark:border-zinc-700">
              <p className="mb-1 text-zinc-500">Member since</p>
              <p className="font-medium">{new Date().toLocaleDateString("en-GB")}</p>
            </div>
          </div>
        </section>
      )}

      {tab === "orders" && (
        <section className="glass-card p-4 sm:p-6">
          <h2 className="text-2xl font-semibold">Order History</h2>
          {loading ? (
            <p className="mt-3 text-sm text-zinc-500">Loading orders...</p>
          ) : orders.length === 0 ? (
            <p className="mt-3 text-sm text-zinc-500">No orders yet.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {orders.map((order) => (
                <div key={order._id} className="rounded-2xl border border-zinc-200 p-4 dark:border-zinc-700">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-sm text-zinc-500">Order #{order._id.slice(0, 8)}</p>
                      <p className="text-sm">{order.items.length} items</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(order.totalAmount)}</p>
                      <p className="text-xs text-zinc-500">{new Date(order.createdAt || Date.now()).toLocaleDateString("en-GB")}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button className="inline-btn" onClick={() => reorder(order)}>
                      Reorder
                    </button>
                    <button className="inline-btn">Track</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {tab === "wishlist" && (
        <section className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <h2 className="text-2xl font-semibold">Wishlist</h2>
            <span className="text-sm text-zinc-500">{wishlistProducts.length} saved products</span>
          </div>
          {wishlistProducts.length === 0 ? (
            <EmptyState title="Wishlist is empty" description="Save products from catalog to see them here." />
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {wishlistProducts.map((item) => (
                <ProductCard key={item._id} product={item} compact />
              ))}
            </div>
          )}
        </section>
      )}

      {tab === "settings" && (
        <section className="grid gap-4 lg:grid-cols-2">
          <div className="glass-card space-y-3 p-4 sm:p-6">
            <h2 className="text-2xl font-semibold">Profile Settings</h2>
            <Field label="Full name" value={form.name} onChange={(value) => setForm((prev) => ({ ...prev, name: value }))} />
            <Field label="Email" value={form.email} onChange={(value) => setForm((prev) => ({ ...prev, email: value }))} />
            <Field label="Phone" value={form.phone} onChange={(value) => setForm((prev) => ({ ...prev, phone: value }))} />
            <Field label="City" value={form.city} onChange={(value) => setForm((prev) => ({ ...prev, city: value }))} />
            <button className="inline-btn-primary" onClick={saveProfile}>
              Save profile
            </button>
          </div>

          <div className="glass-card space-y-4 p-4 sm:p-6">
            <h2 className="text-2xl font-semibold">Preferences</h2>
            <ToggleRow
              label="Newsletter"
              description="Get updates about drops and collections."
              checked={settings.newsletter}
              onChange={(checked) => setSettings((prev) => ({ ...prev, newsletter: checked }))}
            />
            <ToggleRow
              label="Order alerts"
              description="Status notifications for your orders."
              checked={settings.orderAlerts}
              onChange={(checked) => setSettings((prev) => ({ ...prev, orderAlerts: checked }))}
            />
            <ToggleRow
              label="Dark preference"
              description="Save preference for dark visual style."
              checked={settings.darkPreference}
              onChange={(checked) => setSettings((prev) => ({ ...prev, darkPreference: checked }))}
            />
            <button className="inline-btn-primary" onClick={saveSettings}>
              Save settings
            </button>
          </div>
        </section>
      )}
    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="glass-card p-4 sm:p-5">
      <div className="mb-2 inline-flex rounded-full border border-zinc-300 p-2 dark:border-zinc-700">{icon}</div>
      <p className="text-sm text-zinc-500">{title}</p>
      <p className="mt-1 text-xl font-semibold sm:text-2xl">{value}</p>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }) {
  return (
    <button className={`inline-btn ${active ? "border-zinc-950 dark:border-zinc-100" : ""}`} onClick={onClick}>
      {icon}
      {label}
    </button>
  );
}

function Field({ label, value, onChange }) {
  return (
    <label className="block">
      <p className="mb-1 text-xs uppercase tracking-[0.14em] text-zinc-500">{label}</p>
      <input
        className="w-full rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function ToggleRow({ label, description, checked, onChange }) {
  return (
    <label className="flex items-start justify-between gap-3 rounded-2xl border border-zinc-200 p-3 dark:border-zinc-700">
      <span>
        <p className="font-medium">{label}</p>
        <p className="text-sm text-zinc-500">{description}</p>
      </span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
    </label>
  );
}
