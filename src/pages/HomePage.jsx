import { ArrowRight, Footprints, Package, Shield, Shirt, ShoppingBag, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import SkeletonCards from "../components/ui/SkeletonCards";
import { mockProducts } from "../data/mockProducts";
import { productService } from "../services/api/productService";

function SectionDivider() {
  return (
    <div className="relative h-10" aria-hidden="true">
      <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-zinc-400/70 to-transparent dark:via-zinc-600/80" />
      <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-zinc-400 bg-white shadow-sm dark:border-zinc-600 dark:bg-zinc-900" />
    </div>
  );
}

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadProducts = async (withLoading = false) => {
      if (withLoading) setLoading(true);
      try {
        const data = await productService.getAll();
        if (cancelled) return;
        if (Array.isArray(data) && data.length) setProducts(data);
        else setProducts(mockProducts);
      } catch {
        if (!cancelled) setProducts(mockProducts);
      } finally {
        if (!cancelled && withLoading) setLoading(false);
      }
    };

    loadProducts(true);
    const timer = setInterval(() => loadProducts(false), 5000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, []);

  const featured = useMemo(() => {
    const list = products.filter((item) => item.featured);
    return (list.length ? list : products).slice(0, 4);
  }, [products]);
  const newProductsPool = useMemo(() => {
    const list = products
      .filter((item) => item.isNew)
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    if (list.length) return list;
    return [...products].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }, [products]);

  const newProducts = useMemo(() => {
    if (!newProductsPool.length) return [];
    const count = Math.min(4, newProductsPool.length);
    return newProductsPool.slice(0, count);
  }, [newProductsPool]);
  const categories = [
    {
      title: "Zipper",
      subtitle: "Hardware-focused detail.",
      image: "/zipper-new.png",
      icon: Package,
    },
    {
      title: "Longsleeve",
      subtitle: "Clean long sleeve silhouette.",
      image: "/longsleeve-new.png",
      icon: Shirt,
    },
    {
      title: "Tee",
      subtitle: "Single tee product shot.",
      image: "/tee.png",
      icon: Shirt,
    },
    {
      title: "Bag",
      subtitle: "Minimal carry piece.",
      image: "/bag.png",
      icon: ShoppingBag,
    },
    {
      title: "Ring",
      subtitle: "Jewelry close-up object.",
      image: "/ring.png",
      icon: Sparkles,
    },
    {
      title: "Shoes",
      subtitle: "Single sneaker frame.",
      image: "/shoes.png",
      icon: Footprints,
    },
    {
      title: "Pants",
      subtitle: "Straight pants product shot.",
      image: "/pants.png",
      icon: Shield,
    },
    {
      title: "Toy",
      subtitle: "Single toy object.",
      image: "/toy.png",
      icon: Sparkles,
    },
    {
      title: "Hoodie",
      subtitle: "Premium hoodie product.",
      image: "/hoodie.png",
      icon: Shirt,
    },
    {
      title: "Accessory",
      subtitle: "Small accessory focus.",
      image: "/accessory.png",
      icon: ShoppingBag,
    },
    {
      title: "Short",
      subtitle: "Simple shorts item.",
      image: "/pants.png",
      icon: Shield,
    },
    {
      title: "Hat",
      subtitle: "Single hat product shot.",
      image: "/hat.png",
      icon: Sparkles,
    },
    {
      title: "Mask",
      subtitle: "Mask product object.",
      image: "/mask.png",
      icon: Package,
    },
    {
      title: "Belt",
      subtitle: "Single belt detail.",
      image: "/belt.png",
      icon: Sparkles,
    },
    {
      title: "Glasses",
      subtitle: "Single glasses product.",
      image: "/glasses.png",
      icon: Sparkles,
    },
  ];
  const categoryQueryMap = {
    zipper: { search: "зиппер", category: "zipper" },
    longsleeve: { search: "лонгслив", category: "longsleeve" },
    tee: { search: "футболка", category: "t-shirt" },
    bag: { search: "сумка", category: "bag" },
    ring: { search: "кольцо", category: "ring" },
    shoes: { search: "обувь", category: "sneakers" },
    pants: { search: "штаны", category: "pants" },
    toy: { search: "игрушка", category: "toy" },
    hoodie: { search: "худи", category: "hoodie" },
    accessory: { search: "аксессуар", category: "accessories" },
    short: { search: "шорты", category: "short" },
    hat: { search: "кепка", category: "hat" },
    mask: { search: "маска", category: "mask" },
    belt: { search: "ремень", category: "belt" },
    glasses: { search: "очки", category: "glasses" },
  };
  const quickCategories = [
    { title: "All", category: "all", search: "" },
    ...categories.map((item) => {
      const key = item.title.toLowerCase();
      const query = categoryQueryMap[key] || { search: key, category: "all" };
      return { title: item.title, category: query.category, search: query.search };
    }),
  ];

  return (
    <div className="space-y-16">
      <section className="relative overflow-hidden rounded-[2.2rem] border border-zinc-200/70 bg-zinc-950 px-6 py-10 text-white sm:px-10 sm:py-14 dark:border-zinc-800">
        <img
          src="/fon.png"
          alt="Hero"
          className="absolute inset-0 h-[108%] w-full -translate-y-4 object-cover object-center opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/72 via-black/38 to-black/22" />
        <p className="pointer-events-none absolute bottom-6 right-8 hidden text-4xl font-semibold tracking-[0.22em] text-white/10 lg:block">
          VALLEY MOUNTAIN
        </p>

        <div className="relative max-w-3xl space-y-6">
          <p className="reveal text-[11px] uppercase tracking-[0.22em] text-zinc-200">new era of essentials</p>
          <h1 className="reveal reveal-delay-1 font-serif text-5xl leading-[0.95] text-zinc-200 sm:text-6xl lg:text-7xl">
            Valley Mountain.
            <span className="block text-zinc-300">Move With Intent.</span>
          </h1>
          <p className="reveal reveal-delay-2 max-w-xl text-base text-zinc-200/95">
            Precision-tailored essentials for movement, travel, and city rhythm.
          </p>
          <div className="reveal reveal-delay-3 flex flex-wrap gap-3">
            <Link className="inline-btn-primary bg-white text-zinc-950 hover:bg-zinc-100 dark:bg-white dark:text-zinc-950" to="/catalog">
              Shop Collection <ArrowRight size={14} />
            </Link>
            <Link className="inline-btn border-white/45 bg-transparent text-white hover:border-white hover:bg-white/10" to="/catalog">
              New Products
            </Link>
          </div>
          <div className="reveal reveal-delay-3 inline-flex max-w-xl rounded-full border border-white/30 bg-black/35 px-4 py-2 text-xs tracking-wide text-zinc-200">
            Valley Mountain Shop - online shop for the one who moves different.
          </div>
          <div className="reveal reveal-delay-3 flex flex-wrap gap-6 pt-1 text-xs uppercase tracking-[0.16em] text-zinc-300">
            <span>premium quality</span>
            <span>fast delivery</span>
            <span>easy returns</span>
          </div>
        </div>
      </section>

      <section className="reveal">
        <div>
          <div className="flex flex-nowrap items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {quickCategories.map((item) => {
              const categoryLink =
                item.category === "all"
                  ? item.search
                    ? `/catalog?search=${encodeURIComponent(item.search)}`
                    : "/catalog"
                  : `/catalog?search=${encodeURIComponent(item.search)}&category=${encodeURIComponent(item.category)}`;
              return (
                <Link
                  key={`chip-${item.title}`}
                  to={categoryLink}
                  className={`inline-flex h-10 shrink-0 items-center rounded-full border px-4 text-[13px] font-medium leading-none transition duration-300 ${
                    item.category === "all"
                      ? "border-zinc-950 bg-zinc-950 text-white hover:bg-black dark:border-white dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
                      : "border-zinc-300 bg-white/95 text-zinc-800 shadow-[0_8px_18px_-14px_rgba(0,0,0,0.35)] hover:border-zinc-900 hover:bg-white dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:border-zinc-400 dark:hover:bg-zinc-700"
                  }`}
                >
                  {item.category === "all" ? "All" : item.title}
                </Link>
              );
            })}
          </div>
        </div>
      </section>
      <SectionDivider />

      <section className="space-y-5 reveal">
        <div className="flex items-end justify-between">
          <h2 className="font-serif text-4xl">Featured Pieces</h2>
          <Link to="/catalog" className="inline-btn">
            Explore all
          </Link>
        </div>
        <div className="rounded-[2rem] border border-zinc-200/90 p-4 shadow-[0_18px_40px_-30px_rgba(0,0,0,0.35)] sm:p-5 dark:border-zinc-700">
          {loading ? (
            <SkeletonCards />
          ) : (
            <div className="grid auto-rows-fr gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {featured.map((product) => (
                <ProductCard key={product._id} product={product} compact />
              ))}
            </div>
          )}
        </div>
      </section>
      <SectionDivider />

      <section className="space-y-5 reveal reveal-delay-1">
        <h2 className="font-serif text-4xl">New Products</h2>
        <div className="rounded-[2rem] border border-zinc-200/90 p-4 shadow-[0_18px_40px_-30px_rgba(0,0,0,0.35)] sm:p-5 dark:border-zinc-700">
          {loading ? (
            <SkeletonCards />
          ) : (
            <div className="grid auto-rows-fr gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {newProducts.map((product) => (
                <ProductCard key={product._id} product={product} compact />
              ))}
            </div>
          )}
        </div>
      </section>
      <SectionDivider />

      <section className="space-y-5 reveal reveal-delay-2">
        <h2 className="font-serif text-4xl">Shop by Category</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {categories.map((category, index) => {
            const Icon = category.icon;
            const query = categoryQueryMap[category.title.toLowerCase()] || {
              search: category.title.toLowerCase(),
              category: "all",
            };
            const categoryLink =
              query.category === "all"
                ? `/catalog?search=${encodeURIComponent(query.search)}`
                : `/catalog?search=${encodeURIComponent(query.search)}&category=${encodeURIComponent(query.category)}`;
            return (
              <Link
                to={categoryLink}
                key={category.title}
                className="group relative h-72 overflow-hidden rounded-[1.75rem] border border-zinc-200/90 bg-[#f5f3ef] shadow-[0_18px_40px_-26px_rgba(0,0,0,0.45)]"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <img
                  src={category.image}
                  alt={category.title}
                  className={`h-full w-full object-cover transition duration-700 group-hover:scale-105 ${
                    category.title === "Mask" ? "scale-125 object-center" : ""
                  }`}
                />
                <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/70 via-black/34 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-between p-5 text-white">
                  <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-black/45 px-3 py-1 text-xs font-semibold tracking-[0.12em] text-white backdrop-blur-sm">
                    <Icon size={14} className="text-white/90" />
                    CATEGORY
                  </div>
                  <div className="space-y-2 pb-1">
                    <h3 className="h-10 overflow-hidden text-2xl font-semibold leading-tight text-white">{category.title}</h3>
                    <p className="h-12 overflow-hidden text-sm leading-6 text-white/78">{category.subtitle}</p>
                    <span className="inline-flex w-fit items-center rounded-full bg-black px-5 py-2 text-sm font-semibold text-white transition hover:bg-zinc-900">
                      View category
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
      <SectionDivider />

      <section className="grid gap-4 md:grid-cols-3 reveal reveal-delay-3">
        {[
          ["Fast Delivery", "Express delivery for major cities."],
          ["Premium Materials", "Selected fabrics and lasting comfort."],
          ["Easy Returns", "14-day simple return policy."],
        ].map(([title, text]) => (
          <div key={title} className="glass-card p-6">
            <h4 className="font-semibold">{title}</h4>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{text}</p>
          </div>
        ))}
      </section>
    </div>
  );
}





