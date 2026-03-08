import { ChevronLeft, ChevronRight, Heart, ShoppingBag } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { formatCurrency } from "../utils/format";

const CATEGORY_FALLBACK_IMAGES = {
  zipper: "/zipper-new.png",
  longsleeve: "/longsleeve-new.png",
  "t-shirt": "/tee.png",
  bag: "/bag.png",
  ring: "/ring.png",
  sneakers: "/shoes.png",
  shoes: "/shoes.png",
  pants: "/pants.png",
  toy: "/toy.png",
  hoodie: "/hoodie.png",
  accessories: "/accessory.png",
  accessory: "/accessory.png",
  short: "/short.png",
  hat: "/hat.png",
  mask: "/mask.png",
  belt: "/belt.png",
  glasses: "/glasses.png",
};

export default function ProductCard({ product, mode = "grid", onQuickView, compact = false }) {
  const { addToCart } = useCart();
  const { ids, toggleWishlist } = useWishlist();
  const liked = ids.includes(product._id);
  const isList = mode === "list";
  const images = useMemo(() => {
    const baseImages = Array.isArray(product.images) ? product.images.filter(Boolean) : [];
    const normalizedCategory = String(product.category || "").toLowerCase();
    const fallbackImage = CATEGORY_FALLBACK_IMAGES[normalizedCategory];
    const uniqueImages = Array.from(new Set(baseImages));

    if (!uniqueImages.length) return ["/vite.svg"];
    if (uniqueImages.length === 1 && fallbackImage && fallbackImage !== uniqueImages[0]) return [...uniqueImages, fallbackImage];
    return uniqueImages;
  }, [product.images, product.category]);
  const [imageIndex, setImageIndex] = useState(0);
  const hasCarousel = images.length > 1;

  const showPrevImage = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!hasCarousel) return;
    setImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const showNextImage = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!hasCarousel) return;
    setImageIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <article
      className={`vm-product-card reveal relative h-full overflow-hidden rounded-[2rem] border border-zinc-200/90 bg-[#f8f7f4] p-3 shadow-[0_24px_60px_-40px_rgba(0,0,0,0.5)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_72px_-36px_rgba(0,0,0,0.55)] dark:border-zinc-700 dark:bg-zinc-900 sm:p-4 ${
        isList ? "grid gap-5 md:grid-cols-[280px,1fr] md:items-center" : "flex flex-col"
      }`}
    >
      <div className="pointer-events-none absolute inset-x-5 top-0 h-12 rounded-b-[1.2rem] bg-gradient-to-b from-white/70 to-transparent dark:from-white/5" />
      <p className={`text-center font-serif text-[10px] uppercase tracking-[0.2em] text-zinc-700 dark:text-zinc-200 sm:text-[11px] sm:tracking-[0.24em] ${compact ? "pb-2 sm:pb-3" : "pb-3 sm:pb-4"}`}>Valley Mountain</p>

      <Link
        to={`/product/${product._id}`}
        state={{ product }}
        className={`group relative block overflow-hidden rounded-[1.4rem] ${isList ? "h-64 sm:h-full sm:min-h-[320px]" : compact ? "h-52 sm:h-64" : "h-64 sm:h-80"}`}
      >
        <div className="relative h-full w-full">
          {images.map((image, index) => (
            <img
              key={`${product._id}-image-${index}`}
              src={image}
              alt={`${product.name} ${index + 1}`}
              className={`absolute inset-0 h-full w-full object-cover transition-all duration-500 ${
                index === imageIndex ? "opacity-100 scale-100" : "pointer-events-none opacity-0 scale-[1.02]"
              } group-hover:scale-105`}
            />
          ))}
        </div>

        <div className={`absolute inset-y-0 left-3 flex items-center ${compact ? "opacity-80" : ""}`}>
          <button
            type="button"
            className={`inline-flex items-center justify-center rounded-full bg-white/85 text-zinc-900 shadow-sm backdrop-blur transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40 dark:bg-zinc-900/70 dark:text-zinc-100 dark:hover:bg-zinc-800 ${
              compact ? "h-8 w-8" : "h-9 w-9"
            }`}
            onClick={showPrevImage}
            disabled={!hasCarousel}
            aria-label="Previous product image"
          >
            <ChevronLeft size={compact ? 14 : 16} />
          </button>
        </div>

        <div className={`absolute inset-y-0 right-3 flex items-center ${compact ? "opacity-80" : ""}`}>
          <button
            type="button"
            className={`inline-flex items-center justify-center rounded-full bg-white/85 text-zinc-900 shadow-sm backdrop-blur transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40 dark:bg-zinc-900/70 dark:text-zinc-100 dark:hover:bg-zinc-800 ${
              compact ? "h-8 w-8" : "h-9 w-9"
            }`}
            onClick={showNextImage}
            disabled={!hasCarousel}
            aria-label="Next product image"
          >
            <ChevronRight size={compact ? 14 : 16} />
          </button>
        </div>

        <div className="absolute left-3 top-3">
          <button
            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-zinc-900 shadow-sm backdrop-blur transition hover:bg-white dark:bg-zinc-900/70 dark:text-zinc-100 dark:hover:bg-zinc-800 sm:h-9 sm:w-9"
            onClick={(event) => {
              event.preventDefault();
              toggleWishlist(product._id);
            }}
          >
            <Heart size={14} fill={liked ? "currentColor" : "none"} />
          </button>
        </div>

        {hasCarousel && (
          <div className={`absolute left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-black/30 px-2 py-1 backdrop-blur-sm ${compact ? "bottom-2" : "bottom-3"}`}>
            {images.map((_, index) => (
              <span
                key={`${product._id}-dot-${index}`}
                className={`h-1.5 w-1.5 rounded-full transition ${index === imageIndex ? "bg-white" : "bg-white/45"}`}
              />
            ))}
          </div>
        )}
      </Link>

      <div className={`flex flex-1 flex-col ${isList ? "p-0" : compact ? "px-1 pb-1 pt-4" : "px-1 pb-1 pt-5"}`}>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="vm-product-category mb-2 inline-flex w-fit rounded-full border border-zinc-300 bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-700 max-[480px]:text-[3px] max-[480px]:tracking-[0] dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200">
              {product.category}
            </p>
            <h3 className={`truncate font-serif ${compact ? "text-[1.1rem] leading-tight sm:text-[1.35rem]" : "text-[1.35rem] sm:text-[1.7rem]"} text-zinc-900 dark:text-zinc-100`}>{product.name}</h3>
          </div>
          <p className={`vm-product-price ${compact ? "text-lg sm:text-xl" : "text-[1.25rem] sm:text-[1.65rem]"} whitespace-nowrap font-semibold [font-family:'Open_Sans',sans-serif] text-zinc-900 dark:text-zinc-100`}>{formatCurrency(product.price)}</p>
        </div>

        {!compact && <p className="mt-2 truncate text-sm text-zinc-500 dark:text-zinc-300">{product.description}</p>}

        <div className={`vm-product-actions mt-auto grid grid-cols-2 gap-2.5 ${compact ? "pt-4" : "pt-5"}`}>
          <button
            className={`vm-product-add-btn inline-flex min-w-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-zinc-950 px-3 font-semibold text-white transition hover:bg-black dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 ${
              compact ? "h-9 px-2 text-[10px] sm:h-11 sm:px-3 sm:text-xs" : "h-11 text-xs sm:h-12 sm:text-sm"
            }`}
            onClick={() => addToCart(product)}
          >
            <ShoppingBag size={14} />
            Add
          </button>

          <Link
            to={`/product/${product._id}`}
            state={{ product }}
            className={`vm-product-view-btn inline-flex min-w-0 items-center justify-center whitespace-nowrap rounded-lg border border-zinc-300 bg-transparent px-3 font-semibold text-zinc-800 transition hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-100 dark:hover:bg-zinc-800 ${
              compact ? "h-9 px-2 text-[10px] sm:h-11 sm:px-3 sm:text-xs" : "h-11 text-xs sm:h-12 sm:text-sm"
            }`}
          >
            View Product
          </Link>
        </div>
      </div>
    </article>
  );
}
