import { AlertCircle, BarChart3, ImageUp, MessageSquare, Package2, Plus, Search, ShieldCheck, Star, Trash2, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Modal from "../components/ui/Modal";
import { useToast } from "../context/ToastContext";
import { orderService } from "../services/api/orderService";
import { productService } from "../services/api/productService";
import { reviewService } from "../services/api/reviewService";
import { supportService } from "../services/api/supportService";
import { uploadService } from "../services/api/uploadService";
import { userService } from "../services/api/userService";
import { formatCurrency } from "../utils/format";

const DEFAULT_CATEGORIES = [
  "zipper",
  "longsleeve",
  "t-shirt",
  "bag",
  "ring",
  "sneakers",
  "pants",
  "toy",
  "hoodie",
  "accessories",
  "short",
  "hat",
  "mask",
  "belt",
  "glasses",
];

const emptyForm = {
  productCode: "",
  name: "",
  category: "hoodie",
  price: 0,
  logistics: 2,
  stock: 0,
  colors: "Black,White",
  sizes: "S,M,L,XL",
  image: "",
  description: "",
  isNew: true,
  featured: false,
  popularity: 75,
};

const asArray = (value) =>
  String(value || "")
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

const normalizeCode = (value, fallbackIndex) => {
  const text = String(value || "").trim();
  if (!text) return `#${fallbackIndex}`;
  return text.startsWith("#") ? text : `#${text}`;
};

export default function AdminDashboardPage() {
  const { pushToast } = useToast();
  const [tab, setTab] = useState("products");
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState(DEFAULT_CATEGORIES);
  const [newCategory, setNewCategory] = useState("");
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const loadData = async ({ silent = false } = {}) => {
    if (!silent) setLoading(true);
    try {
      const [productsData, usersData, ordersData, ticketsData, reviewsData] = await Promise.all([
        productService.getAll(),
        userService.getAll(),
        orderService.getAll(),
        supportService.getAll(),
        reviewService.getAll(),
      ]);

      const preparedProducts = (Array.isArray(productsData) ? productsData : []).map((item, index) => ({
        ...item,
        productCode: normalizeCode(item.productCode || item._id?.replace(/\D/g, ""), index + 1),
      }));
      setProducts(preparedProducts);
      setUsers(Array.isArray(usersData) ? usersData : []);
      setOrders(Array.isArray(ordersData) ? ordersData : []);
      setTickets(Array.isArray(ticketsData) ? ticketsData : []);
      setReviews(Array.isArray(reviewsData) ? reviewsData : []);

      const fromProducts = preparedProducts.map((item) => String(item.category || "").toLowerCase()).filter(Boolean);
      const merged = [...new Set([...DEFAULT_CATEGORIES, ...fromProducts])];
      setCategoryOptions(merged);
    } catch {
      if (!silent) pushToast("Failed to load admin data", "error");
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const timer = setInterval(() => loadData({ silent: true }), 5000);
    return () => clearInterval(timer);
  }, []);

  const filteredProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter((item) => {
      const idText = `${item.productCode || ""} ${item._id || ""}`.toLowerCase();
      return (
        idText.includes(q) ||
        String(item.name || "").toLowerCase().includes(q) ||
        String(item.category || "").toLowerCase().includes(q)
      );
    });
  }, [products, query]);

  const salesStats = useMemo(() => {
    const totalRevenue = orders.reduce((sum, item) => sum + Number(item.totalAmount || 0), 0);
    const itemsSold = orders.reduce(
      (sum, order) => sum + (Array.isArray(order.items) ? order.items.reduce((acc, line) => acc + Number(line.qty || 1), 0) : 0),
      0
    );
    const today = new Date().toISOString().slice(0, 10);
    const todayRevenue = orders
      .filter((order) => String(order.createdAt || "").slice(0, 10) === today)
      .reduce((sum, item) => sum + Number(item.totalAmount || 0), 0);
    return {
      totalRevenue,
      itemsSold,
      ordersCount: orders.length,
      todayRevenue,
    };
  }, [orders]);

  const topProducts = useMemo(() => {
    const map = new Map();
    orders.forEach((order) => {
      (order.items || []).forEach((line) => {
        const key = line.productId || line.name;
        const prev = map.get(key) || { key, name: line.name || "Product", qty: 0, revenue: 0 };
        prev.qty += Number(line.qty || 1);
        prev.revenue += Number(line.price || 0) * Number(line.qty || 1);
        map.set(key, prev);
      });
    });
    return [...map.values()].sort((a, b) => b.qty - a.qty).slice(0, 8);
  }, [orders]);

  const openCreate = () => {
    setEditingProduct(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditingProduct(item);
    setForm({
      productCode: item.productCode || "",
      name: item.name || "",
      category: item.category || "hoodie",
      price: Number(item.price || 0),
      logistics: Number(item.logistics ?? 2),
      stock: Number(item.stock || 0),
      colors: (item.colors || []).join(","),
      sizes: (item.sizes || []).join(","),
      image: item.images?.[0] || "",
      description: item.description || "",
      isNew: !!item.isNew,
      featured: !!item.featured,
      popularity: Number(item.popularity || 75),
    });
    setModalOpen(true);
  };

  const submitProduct = async () => {
    if (!form.name.trim()) {
      pushToast("Product name is required", "error");
      return;
    }

    const payload = {
      productCode: normalizeCode(form.productCode, products.length + 1),
      name: form.name.trim(),
      category: form.category.trim().toLowerCase(),
      price: Number(form.price || 0),
      logistics: Number(form.logistics || 0),
      stock: Number(form.stock || 0),
      colors: asArray(form.colors),
      sizes: asArray(form.sizes),
      images: form.image ? [form.image] : [],
      description: form.description.trim(),
      isNew: !!form.isNew,
      featured: !!form.featured,
      popularity: Number(form.popularity || 50),
    };

    try {
      if (editingProduct?._id) {
        await productService.update(editingProduct._id, payload);
        pushToast("Product updated", "success");
      } else {
        await productService.create(payload);
        pushToast("Product created", "success");
      }
      setModalOpen(false);
      await loadData({ silent: true });
    } catch {
      pushToast("Failed to save product", "error");
    }
  };

  const deleteProduct = async (id) => {
    try {
      await productService.remove(id);
      setProducts((prev) => prev.filter((item) => item._id !== id));
      pushToast("Product deleted", "success");
    } catch {
      pushToast("Failed to delete product", "error");
    }
  };

  const duplicateProduct = async (item) => {
    try {
      await productService.create({
        ...item,
        productCode: normalizeCode(String(item.productCode || "").replace("#", ""), products.length + 1),
        name: `${item.name} Copy`,
      });
      await loadData({ silent: true });
      pushToast("Product duplicated", "success");
    } catch {
      pushToast("Duplicate failed", "error");
    }
  };

  const onUploadImage = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadService.uploadImage(file);
      setForm((prev) => ({ ...prev, image: url }));
      pushToast("Image uploaded", "success");
    } catch {
      pushToast("Image upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  const addCategory = () => {
    const value = newCategory.trim().toLowerCase();
    if (!value) return;
    if (categoryOptions.includes(value)) {
      pushToast("Category already exists", "info");
      return;
    }
    setCategoryOptions((prev) => [...prev, value]);
    setNewCategory("");
    pushToast("Category added", "success");
  };

  const removeCategory = (name) => {
    const hasProducts = products.some((item) => item.category === name);
    if (hasProducts) {
      pushToast("Category used by products", "error");
      return;
    }
    setCategoryOptions((prev) => prev.filter((item) => item !== name));
  };

  const updateTicketStatus = async (ticket, status) => {
    try {
      const next = await supportService.update(ticket._id, { status });
      setTickets((prev) => prev.map((item) => (item._id === ticket._id ? next : item)));
      pushToast("Ticket updated", "success");
    } catch {
      pushToast("Failed to update ticket", "error");
    }
  };

  const deleteReview = async (reviewId) => {
    try {
      await reviewService.remove(reviewId);
      setReviews((prev) => prev.filter((item) => item._id !== reviewId));
      pushToast("Review deleted", "success");
    } catch {
      pushToast("Failed to delete review", "error");
    }
  };

  const deleteUser = async (userId) => {
    try {
      await userService.remove(userId);
      setUsers((prev) => prev.filter((item) => item._id !== userId));
      pushToast("User deleted", "success");
    } catch {
      pushToast("Failed to delete user", "error");
    }
  };

  return (
    <div className="space-y-5">
      <section className="glass-card p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Admin Control</p>
            <h1 className="font-serif text-4xl">Valley Mountain Dashboard</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <Stat title="Sales" value={formatCurrency(salesStats.totalRevenue)} icon={<BarChart3 size={14} />} />
            <Stat title="Orders" value={salesStats.ordersCount} icon={<Package2 size={14} />} />
            <Stat title="Users" value={users.length} icon={<Users size={14} />} />
          </div>
        </div>
      </section>

      <section className="glass-card p-3">
        <div className="flex flex-wrap gap-2">
          <Tab active={tab === "products"} onClick={() => setTab("products")} icon={<Package2 size={14} />} label="Products" />
          <Tab active={tab === "sales"} onClick={() => setTab("sales")} icon={<BarChart3 size={14} />} label="Sales" />
          <Tab active={tab === "users"} onClick={() => setTab("users")} icon={<Users size={14} />} label="Users" />
          <Tab active={tab === "support"} onClick={() => setTab("support")} icon={<MessageSquare size={14} />} label="Support" />
          <Tab active={tab === "reviews"} onClick={() => setTab("reviews")} icon={<Star size={14} />} label="Reviews" />
          <Tab active={tab === "categories"} onClick={() => setTab("categories")} icon={<ShieldCheck size={14} />} label="Categories" />
        </div>
      </section>

      {loading ? <div className="glass-card p-6 text-sm text-zinc-500">Loading admin data...</div> : null}

      {!loading && tab === "products" && (
        <section className="space-y-4">
          <div className="glass-card flex flex-wrap items-center justify-between gap-3 p-4">
            <label className="relative w-full max-w-sm">
              <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                className="w-full rounded-full border border-zinc-300 bg-white py-2 pl-9 pr-3 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                placeholder="Search by #id, name, category"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
            <button className="inline-btn-primary" onClick={openCreate}>
              <Plus size={14} />
              Add New
            </button>
          </div>

          <div className="glass-card overflow-hidden">
            <div className="grid grid-cols-[90px,1.8fr,1fr,120px,120px,120px,260px] gap-2 border-b border-zinc-200/80 px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500 dark:border-zinc-800">
              <span>ID</span>
              <span>Product</span>
              <span>Category</span>
              <span>Price</span>
              <span>Logistics</span>
              <span>Stock</span>
              <span>Actions</span>
            </div>
            <div className="max-h-[62vh] overflow-y-auto">
              {filteredProducts.map((item) => (
                <div
                  key={item._id}
                  className="grid grid-cols-[90px,1.8fr,1fr,120px,120px,120px,260px] items-center gap-2 border-b border-zinc-200/75 px-3 py-2 text-sm dark:border-zinc-800"
                >
                  <span className="font-medium">{item.productCode || item._id}</span>
                  <div className="min-w-0">
                    <p className="truncate font-medium">{item.name}</p>
                    <p className="truncate text-xs text-zinc-500">{item._id}</p>
                  </div>
                  <span className="capitalize">{item.category}</span>
                  <span>{formatCurrency(item.price)}</span>
                  <span>{formatCurrency(item.logistics ?? 2)}</span>
                  <span>{item.stock}</span>
                  <div className="flex flex-wrap gap-2">
                    <button className="inline-btn !px-3 !py-1.5 text-xs" onClick={() => openEdit(item)}>
                      Edit
                    </button>
                    <button className="inline-btn !px-3 !py-1.5 text-xs" onClick={() => duplicateProduct(item)}>
                      Duplicate
                    </button>
                    <button className="inline-btn !px-3 !py-1.5 text-xs text-red-600 dark:text-red-400" onClick={() => deleteProduct(item._id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {!loading && tab === "sales" && (
        <section className="grid gap-4 lg:grid-cols-[1fr,1.2fr]">
          <div className="glass-card space-y-3 p-5">
            <h2 className="text-2xl font-semibold">Sales Overview</h2>
            <SalesLine label="Total Revenue" value={formatCurrency(salesStats.totalRevenue)} />
            <SalesLine label="Today Revenue" value={formatCurrency(salesStats.todayRevenue)} />
            <SalesLine label="Total Orders" value={salesStats.ordersCount} />
            <SalesLine label="Items Sold" value={salesStats.itemsSold} />
          </div>
          <div className="glass-card p-5">
            <h2 className="mb-3 text-2xl font-semibold">Top Selling Products</h2>
            {topProducts.length === 0 ? (
              <p className="text-sm text-zinc-500">No sales data yet.</p>
            ) : (
              <div className="space-y-2">
                {topProducts.map((item) => (
                  <div key={item.key} className="flex items-center justify-between rounded-2xl border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-xs text-zinc-500">{item.qty} pcs sold</p>
                    </div>
                    <p className="font-semibold">{formatCurrency(item.revenue)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {!loading && tab === "users" && (
        <section className="glass-card p-4">
          <h2 className="mb-3 text-2xl font-semibold">All Users</h2>
          <div className="space-y-2">
            {users.map((item) => (
              <div key={item._id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-xs text-zinc-500">{item.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full border border-zinc-300 px-3 py-1 text-xs dark:border-zinc-700">{item.isAdmin ? "Admin" : "User"}</span>
                  {!item.isAdmin ? (
                    <button className="inline-btn !px-3 !py-1.5 text-xs text-red-600 dark:text-red-400" onClick={() => deleteUser(item._id)}>
                      <Trash2 size={12} />
                      Delete
                    </button>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {!loading && tab === "support" && (
        <section className="glass-card p-4">
          <h2 className="mb-3 text-2xl font-semibold">Tech Support Tickets</h2>
          {tickets.length === 0 ? (
            <p className="text-sm text-zinc-500">No tickets yet.</p>
          ) : (
            <div className="space-y-3">
              {tickets.map((ticket) => (
                <div key={ticket._id} className="rounded-2xl border border-zinc-200 p-3 dark:border-zinc-700">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-medium">{ticket.subject}</p>
                      <p className="text-xs text-zinc-500">
                        {ticket.userName} - {ticket.userEmail}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className={`inline-btn !px-3 !py-1.5 text-xs ${ticket.status === "open" ? "border-amber-400 text-amber-600 dark:text-amber-300" : ""}`}
                        onClick={() => updateTicketStatus(ticket, "open")}
                      >
                        Open
                      </button>
                      <button
                        className={`inline-btn !px-3 !py-1.5 text-xs ${ticket.status === "resolved" ? "border-emerald-400 text-emerald-600 dark:text-emerald-300" : ""}`}
                        onClick={() => updateTicketStatus(ticket, "resolved")}
                      >
                        Resolved
                      </button>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-200">{ticket.message}</p>
                  {ticket.image ? <img src={ticket.image} alt="ticket" className="mt-2 h-24 w-24 rounded-xl object-cover" /> : null}
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {!loading && tab === "reviews" && (
        <section className="glass-card p-4">
          <h2 className="mb-3 text-2xl font-semibold">Product Reviews</h2>
          {reviews.length === 0 ? (
            <p className="text-sm text-zinc-500">No reviews yet.</p>
          ) : (
            <div className="space-y-3">
              {reviews.map((item) => (
                <div key={item._id} className="rounded-2xl border border-zinc-200 p-3 dark:border-zinc-700">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-medium">{item.productName || item.productId}</p>
                      <p className="text-xs text-zinc-500">
                        {item.userName} - {item.userEmail}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full border border-zinc-300 px-3 py-1 text-xs dark:border-zinc-700">{item.rating}/5</span>
                      <button className="inline-btn !px-3 !py-1.5 text-xs text-red-600 dark:text-red-400" onClick={() => deleteReview(item._id)}>
                        <Trash2 size={12} />
                        Delete
                      </button>
                    </div>
                  </div>
                  <p className="mt-2 text-sm">{item.message || "No text"}</p>
                  {item.image ? <img src={item.image} alt="review" className="mt-2 h-24 w-24 rounded-xl object-cover" /> : null}
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {!loading && tab === "categories" && (
        <section className="glass-card p-4">
          <h2 className="mb-3 text-2xl font-semibold">Categories</h2>
          <div className="mb-3 flex flex-wrap gap-2">
            <input
              className="rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
              placeholder="new category"
              value={newCategory}
              onChange={(event) => setNewCategory(event.target.value)}
            />
            <button className="inline-btn-primary" onClick={addCategory}>
              <Plus size={14} />
              Add category
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {categoryOptions.map((name) => (
              <span key={name} className="inline-flex items-center gap-2 rounded-full border border-zinc-300 px-3 py-1 text-sm dark:border-zinc-700">
                {name}
                {!DEFAULT_CATEGORIES.includes(name) ? (
                  <button className="text-zinc-500 hover:text-red-500" onClick={() => removeCategory(name)}>
                    <Trash2 size={12} />
                  </button>
                ) : null}
              </span>
            ))}
          </div>
        </section>
      )}

      {modalOpen ? (
        <Modal title={editingProduct ? "Edit product card" : "Add product card"} onClose={() => setModalOpen(false)}>
          <div className="grid gap-3 pb-1 md:grid-cols-2">
            <Field label="Product ID (#1, #2...)" value={form.productCode} onChange={(value) => setForm((prev) => ({ ...prev, productCode: value }))} />
            <Field label="Product Name" value={form.name} onChange={(value) => setForm((prev) => ({ ...prev, name: value }))} />
            <div>
              <Label text="Category" />
              <select
                className="w-full rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                value={form.category}
                onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
              >
                {categoryOptions.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
            <Field type="number" label="Price (UZS)" value={form.price} onChange={(value) => setForm((prev) => ({ ...prev, price: value }))} />
            <Field type="number" label="Logistics (UZS)" value={form.logistics} onChange={(value) => setForm((prev) => ({ ...prev, logistics: value }))} />
            <Field type="number" label="Stock Quantity" value={form.stock} onChange={(value) => setForm((prev) => ({ ...prev, stock: value }))} />
            <Field label="Colors (comma separated)" value={form.colors} onChange={(value) => setForm((prev) => ({ ...prev, colors: value }))} />
            <Field label="Sizes (comma separated)" value={form.sizes} onChange={(value) => setForm((prev) => ({ ...prev, sizes: value }))} />
            <div className="md:col-span-2">
              <Label text="Product Image" />
              <div className="rounded-2xl border border-dashed border-zinc-300 p-3 text-center dark:border-zinc-700">
                <p className="mb-2 text-xs uppercase tracking-[0.12em] text-zinc-500">Drag and drop or upload file</p>
                <label className="inline-btn cursor-pointer">
                  <ImageUp size={14} />
                  {uploading ? "Uploading..." : "Upload file"}
                  <input type="file" accept="image/*" className="hidden" onChange={(event) => onUploadImage(event.target.files?.[0])} />
                </label>
                {form.image ? <img src={form.image} alt="preview" className="mx-auto mt-3 h-20 w-20 rounded-xl object-cover" /> : null}
              </div>
            </div>
            <div className="md:col-span-2">
              <Field label="Image URL (optional)" value={form.image} onChange={(value) => setForm((prev) => ({ ...prev, image: value }))} />
            </div>
            <div className="md:col-span-2">
              <Label text="Description" />
              <textarea
                rows="3"
                className="w-full rounded-2xl border border-zinc-300 bg-white px-4 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                value={form.description}
                onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
              />
            </div>
            <Field type="number" label="Popularity (1-100)" value={form.popularity} onChange={(value) => setForm((prev) => ({ ...prev, popularity: value }))} />
            <div className="flex items-center gap-4 pt-6">
              <label className="inline-flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.isNew} onChange={(event) => setForm((prev) => ({ ...prev, isNew: event.target.checked }))} />
                New
              </label>
              <label className="inline-flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.featured} onChange={(event) => setForm((prev) => ({ ...prev, featured: event.target.checked }))} />
                Featured
              </label>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button className="inline-btn-primary" onClick={submitProduct}>
              Save Product
            </button>
          </div>
        </Modal>
      ) : null}

      <div className="glass-card flex items-start gap-2 p-3 text-xs text-zinc-500">
        <AlertCircle size={14} className="mt-0.5 shrink-0" />
        <p>
          Changes are synced through backend API and become visible to all users immediately while the backend server is running.
        </p>
      </div>
    </div>
  );
}

function Tab({ active, onClick, icon, label }) {
  return (
    <button className={`inline-btn ${active ? "border-zinc-950 dark:border-zinc-100" : ""}`} onClick={onClick}>
      {icon}
      {label}
    </button>
  );
}

function Stat({ title, value, icon }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900">
      <p className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.12em] text-zinc-500">
        {icon}
        {title}
      </p>
      <p className="font-semibold">{value}</p>
    </div>
  );
}

function SalesLine({ label, value }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-700">
      <span className="text-zinc-500">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

function Label({ text }) {
  return <p className="mb-1 text-xs uppercase tracking-[0.14em] text-zinc-500">{text}</p>;
}

function Field({ label, value, onChange, type = "text" }) {
  return (
    <label className="block">
      <Label text={label} />
      <input
        type={type}
        className="w-full rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}
