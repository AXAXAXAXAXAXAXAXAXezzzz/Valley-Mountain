import { Grid3X3, LayoutList, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import ProductFilters from "../components/catalog/ProductFilters";
import ProductCard from "../components/ProductCard";
import EmptyState from "../components/ui/EmptyState";
import Modal from "../components/ui/Modal";
import SkeletonCards from "../components/ui/SkeletonCards";
import { useCart } from "../context/CartContext";
import { mockProducts } from "../data/mockProducts";
import { useDebounce } from "../hooks/useDebounce";
import { productService } from "../services/api/productService";
import { formatCurrency } from "../utils/format";

const CATEGORY_CONFIG = {
  zipper: { category: "zipper", title: "Zipper", image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=1200&q=80", price: 109, sizes: ["S", "M", "L", "XL"], colors: ["Black", "Gray"] },
  longsleeve: { category: "longsleeve", title: "Longsleeve", image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1200&q=80", price: 94, sizes: ["S", "M", "L", "XL"], colors: ["Black", "White", "Gray"] },
  "t-shirt": { category: "t-shirt", title: "Tee", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80", price: 72, sizes: ["S", "M", "L", "XL"], colors: ["White", "Black", "Gray"] },
  bag: { category: "bag", title: "Bag", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=80", price: 124, sizes: ["One Size"], colors: ["Black", "Gray"] },
  ring: { category: "ring", title: "Ring", image: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=1200&q=80", price: 89, sizes: ["One Size"], colors: ["Silver", "Black"] },
  sneakers: { category: "sneakers", title: "Shoes", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80", price: 184, sizes: ["40", "41", "42", "43", "44"], colors: ["Black", "White"] },
  pants: { category: "pants", title: "Pants", image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=1200&q=80", price: 132, sizes: ["S", "M", "L", "XL"], colors: ["Black", "Navy", "Sand"] },
  toy: { category: "toy", title: "Toy", image: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&w=1200&q=80", price: 64, sizes: ["One Size"], colors: ["Black", "White"] },
  hoodie: { category: "hoodie", title: "Hoodie", image: "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=1200&q=80", price: 149, sizes: ["S", "M", "L", "XL"], colors: ["Black", "Gray", "White"] },
  accessories: { category: "accessories", title: "Accessory", image: "https://images.unsplash.com/photo-1611923134239-b9be5816e9f1?auto=format&fit=crop&w=1200&q=80", price: 52, sizes: ["One Size"], colors: ["Black", "Brown"] },
  short: { category: "short", title: "Short", image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=1200&q=80", price: 76, sizes: ["S", "M", "L", "XL"], colors: ["Black", "Gray"] },
  hat: { category: "hat", title: "Hat", image: "https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=1200&q=80", price: 52, sizes: ["One Size"], colors: ["Black", "Gray"] },
  mask: { category: "mask", title: "Mask", image: "https://images.unsplash.com/photo-1584634731339-252c581abfc5?auto=format&fit=crop&w=1200&q=80", price: 34, sizes: ["One Size"], colors: ["Black", "Gray"] },
  belt: { category: "belt", title: "Belt", image: "https://images.unsplash.com/photo-1611923134239-b9be5816e9f1?auto=format&fit=crop&w=1200&q=80", price: 57, sizes: ["S", "M", "L"], colors: ["Black", "Brown"] },
  glasses: { category: "glasses", title: "Glasses", image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=1200&q=80", price: 96, sizes: ["One Size"], colors: ["Black", "Silver"] },
};

const SEARCH_ALIASES = {
  "\u043e\u0447\u043a\u0438": ["glasses"],
  "\u043e\u0431\u0443\u0432\u044c": ["sneakers"],
  "\u0448\u043e\u0440\u0442\u044b": ["short"],
  "\u0440\u0435\u043c\u0435\u043d\u044c": ["belt"],
  "\u043c\u0430\u0441\u043a\u0430": ["mask"],
  "\u043a\u0435\u043f\u043a\u0430": ["hat"],
  "\u0430\u043a\u0441\u0435\u0441\u0441\u0443\u0430\u0440": ["accessories"],
  "\u0445\u0443\u0434\u0438": ["hoodie"],
  "\u0438\u0433\u0440\u0443\u0448\u043a\u0430": ["toy"],
  "\u0448\u0442\u0430\u043d\u044b": ["pants"],
  "\u043a\u043e\u043b\u044c\u0446\u043e": ["ring"],
  "\u0441\u0443\u043c\u043a\u0430": ["bag"],
  "\u0444\u0443\u0442\u0431\u043e\u043b\u043a\u0430": ["t-shirt"],
  "\u043b\u043e\u043d\u0433\u0441\u043b\u0438\u0432": ["longsleeve"],
  "\u0437\u0438\u043f\u043f\u0435\u0440": ["zipper"],
};

const normalizeCategory = (category = "") => {
  const value = category.toLowerCase();
  if (value === "tee") return "t-shirt";
  if (value === "shoes") return "sneakers";
  if (value === "accessory") return "accessories";
  return value;
};

const ensureCategoryProducts = (items, minCount = 10) => {
  const source = Array.isArray(items) ? [...items] : [];
  const extras = [];
  const grouped = Object.fromEntries(Object.keys(CATEGORY_CONFIG).map((key) => [key, []]));

  source.forEach((item) => {
    const key = normalizeCategory(item.category);
    if (grouped[key]) grouped[key].push({ ...item, category: CATEGORY_CONFIG[key].category, logistics: Number(item.logistics ?? 2) });
    else extras.push({ ...item, logistics: Number(item.logistics ?? 2) });
  });

  const generated = [];
  const now = Date.now();

  Object.entries(CATEGORY_CONFIG).forEach(([key, config]) => {
    const base = grouped[key];
    const current = [...base];

    if (!current.length) {
      current.push({
        _id: `auto-${key}-1`,
        name: `${config.title} Core 1`,
        category: config.category,
        price: config.price,
        logistics: 2,
        description: `${config.title} essential with premium minimal construction.`,
        images: [config.image],
        colors: config.colors,
        sizes: config.sizes,
        stock: 25,
        isNew: true,
        featured: false,
        popularity: 70,
        createdAt: new Date(now).toISOString(),
      });
    }

    while (current.length < minCount) {
      const idx = current.length + 1;
      const seed = current[(idx - 1) % current.length];
      current.push({
        ...seed,
        _id: `${seed._id}-${key}-${idx}`,
        name: `${config.title} Core ${idx}`,
        price: config.price + (idx % 5) * 4,
        logistics: Number(seed.logistics ?? 2),
        stock: 18 + ((idx * 3) % 47),
        popularity: Math.min(99, 64 + idx),
        isNew: idx % 2 === 0,
        featured: idx % 4 === 0,
        createdAt: new Date(now - idx * 3600 * 1000).toISOString(),
      });
    }

    generated.push(...current);
  });

  return [...extras, ...generated].map((item) => ({ ...item, logistics: Number(item.logistics ?? 2) }));
};

const matchesSearch = (item, rawQuery) => {
  const query = rawQuery.trim().toLowerCase();
  if (!query) return true;
  const text = `${item.name} ${item.description} ${item.category}`.toLowerCase();
  if (text.includes(query)) return true;
  const aliases = SEARCH_ALIASES[query];
  if (!aliases?.length) return false;
  const normalized = normalizeCategory(item.category);
  return aliases.includes(normalized);
};

export default function CatalogPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [visibleCount, setVisibleCount] = useState(8);
  const [quickProduct, setQuickProduct] = useState(null);
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    size: "all",
    color: "all",
    minPrice: 1,
    maxPrice: 300,
    sort: "newest",
    onlyNew: false,
    inStock: false,
    featured: false,
  });
  const { addToCart } = useCart();
  const debouncedSearch = useDebounce(filters.search, 260);
  const location = useLocation();

  useEffect(() => {
    let cancelled = false;
    const loadProducts = async () => {
      try {
        const data = await productService.getAll();
        if (cancelled) return;
        setProducts(ensureCategoryProducts(Array.isArray(data) && data.length ? data : mockProducts));
      } catch {
        if (!cancelled) setProducts(ensureCategoryProducts(mockProducts));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadProducts();
    const timer = setInterval(loadProducts, 5000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (!params.toString()) return;
    const search = params.get("search") || "";
    const category = params.get("category") || "all";
    setFilters((prev) => ({ ...prev, search, category }));
    setVisibleCount(8);
  }, [location.search]);

  const categories = useMemo(() => [...new Set(products.map((item) => item.category))], [products]);

  const filtered = useMemo(() => {
    const query = debouncedSearch.toLowerCase();
    const next = products
      .filter((item) => (filters.category === "all" ? true : item.category === filters.category))
      .filter((item) => (filters.size === "all" ? true : item.sizes.includes(filters.size)))
      .filter((item) => (filters.color === "all" ? true : item.colors.includes(filters.color)))
      .filter((item) => item.price >= Number(filters.minPrice || 1))
      .filter((item) => item.price <= Number(filters.maxPrice || 300))
      .filter((item) => (filters.onlyNew ? item.isNew : true))
      .filter((item) => (filters.inStock ? item.stock > 0 : true))
      .filter((item) => (filters.featured ? item.featured : true))
      .filter((item) => matchesSearch(item, query));

    if (filters.sort === "price-asc") next.sort((a, b) => a.price - b.price);
    if (filters.sort === "price-desc") next.sort((a, b) => b.price - a.price);
    if (filters.sort === "popular") next.sort((a, b) => b.popularity - a.popularity);
    if (filters.sort === "newest") next.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return next;
  }, [products, filters, debouncedSearch]);

  const visibleProducts = filtered.slice(0, visibleCount);

  const clearFilters = () => {
    setFilters({
      search: "",
      category: "all",
      size: "all",
      color: "all",
      minPrice: 1,
      maxPrice: 300,
      sort: "newest",
      onlyNew: false,
      inStock: false,
      featured: false,
    });
    setVisibleCount(8);
  };

  const activeChips = [
    filters.category !== "all" ? `Category: ${filters.category}` : null,
    filters.size !== "all" ? `Size: ${filters.size}` : null,
    filters.color !== "all" ? `Color: ${filters.color}` : null,
    filters.onlyNew ? "New only" : null,
    filters.inStock ? "In stock" : null,
    filters.featured ? "Featured" : null,
    filters.search ? `Search: ${filters.search}` : null,
  ].filter(Boolean);

  return (
    <div className="space-y-6">
      <div className="reveal">
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Catalog</p>
        <h1 className="font-serif text-3xl sm:text-5xl">Engineered Wardrobe</h1>
      </div>

      <section className="glass-card reveal reveal-delay-1 space-y-4 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button className="inline-btn" onClick={() => setFiltersOpen((prev) => !prev)}>
              <SlidersHorizontal size={14} />
              {filtersOpen ? "Hide Filters" : "Show Filters"}
            </button>
            <button className={`inline-btn ${viewMode === "grid" ? "border-zinc-950 dark:border-white" : ""}`} onClick={() => setViewMode("grid")}>
              <Grid3X3 size={14} />
              Grid
            </button>
            <button className={`inline-btn ${viewMode === "list" ? "border-zinc-950 dark:border-white" : ""}`} onClick={() => setViewMode("list")}>
              <LayoutList size={14} />
              List
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm text-zinc-500">{filtered.length} products</p>
            <button className="inline-btn" onClick={clearFilters}>
              <X size={14} />
              Clear
            </button>
          </div>
        </div>

        {activeChips.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {activeChips.map((chip) => (
              <span key={chip} className="rounded-full border border-zinc-300 px-3 py-1 text-xs dark:border-zinc-700">
                {chip}
              </span>
            ))}
          </div>
        )}

        {filtersOpen && <ProductFilters filters={filters} setFilters={setFilters} categories={categories} />}
      </section>

      {loading ? (
        <SkeletonCards />
      ) : filtered.length === 0 ? (
        <EmptyState title="No products found" description="Adjust filters to discover more items." />
      ) : (
        <>
          <div className={`reveal reveal-delay-2 gap-3 sm:gap-4 ${viewMode === "grid" ? "grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid grid-cols-1"}`}>
            {visibleProducts.map((product) => (
              <ProductCard key={product._id} product={product} mode={viewMode} onQuickView={setQuickProduct} />
            ))}
          </div>

          {visibleCount < filtered.length && (
            <div className="flex justify-center">
              <button className="inline-btn-primary" onClick={() => setVisibleCount((prev) => prev + 4)}>
                Load more
              </button>
            </div>
          )}
        </>
      )}

      {quickProduct && (
        <Modal title={quickProduct.name} onClose={() => setQuickProduct(null)}>
          <div className="grid gap-4 md:grid-cols-[220px,1fr]">
            <img src={quickProduct.images?.[0]} alt={quickProduct.name} className="h-44 w-full rounded-2xl object-cover sm:h-56" />
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">{quickProduct.category}</p>
              <p className="text-lg font-semibold">{formatCurrency(quickProduct.price)}</p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">{quickProduct.description}</p>
              <div className="flex flex-wrap gap-2">
                {quickProduct.colors.map((color) => (
                  <span key={color} className="rounded-full border border-zinc-300 px-2 py-1 text-xs dark:border-zinc-700">
                    {color}
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  className="inline-btn-primary"
                  onClick={() => {
                    addToCart(quickProduct);
                    setQuickProduct(null);
                  }}
                >
                  Add to cart
                </button>
                <button className="inline-btn" onClick={() => setQuickProduct(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
