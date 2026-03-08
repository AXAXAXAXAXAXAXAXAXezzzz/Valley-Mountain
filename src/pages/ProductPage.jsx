import { Heart, ShoppingBag } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import EmptyState from "../components/ui/EmptyState";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { useWishlist } from "../context/WishlistContext";
import { mockProducts } from "../data/mockProducts";
import { productService } from "../services/api/productService";
import { reviewService } from "../services/api/reviewService";
import { uploadService } from "../services/api/uploadService";
import { formatCurrency } from "../utils/format";

export default function ProductPage() {
  const { id } = useParams();
  const location = useLocation();
  const initialProduct = location.state?.product || mockProducts.find((item) => item._id === id) || null;
  const [product, setProduct] = useState(initialProduct);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(!initialProduct);
  const [size, setSize] = useState("M");
  const [color, setColor] = useState("Black");
  const [qty, setQty] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewImageUrl, setReviewImageUrl] = useState("");
  const [reviewFile, setReviewFile] = useState(null);
  const { addToCart } = useCart();
  const { pushToast } = useToast();
  const { ids, toggleWishlist } = useWishlist();
  const { user } = useAuth();

  useEffect(() => {
    let cancelled = false;
    const hasInitialProduct = !!initialProduct;

    const load = async () => {
      if (!hasInitialProduct) setLoading(true);
      try {
        const [one, all] = await Promise.all([productService.getOne(id), productService.getAll()]);
        if (cancelled) return;
        const list = Array.isArray(all) && all.length ? all : mockProducts;
        setProducts(list);
        setProduct(one);
        setSize(one.sizes?.[0] || "M");
        setColor(one.colors?.[0] || "Black");
      } catch {
        if (cancelled) return;
        const fallback = mockProducts.find((item) => item._id === id) || initialProduct || null;
        setProduct(fallback);
        setProducts(mockProducts);
        if (fallback) {
          setSize(fallback.sizes?.[0] || "M");
          setColor(fallback.colors?.[0] || "Black");
        }
      } finally {
        if (!cancelled && !hasInitialProduct) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [id, initialProduct]);

  useEffect(() => {
    let cancelled = false;
    const loadReviews = async () => {
      try {
        const data = await reviewService.getAll({ productId: id });
        if (!cancelled) setReviews(Array.isArray(data) ? data : []);
      } catch {
        if (!cancelled) setReviews([]);
      }
    };
    loadReviews();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const related = useMemo(() => {
    return products.filter((item) => item.category === product?.category && item._id !== product?._id).slice(0, 4);
  }, [products, product]);
  const logisticsFee = Number(product?.logistics ?? 2);
  const totalWithLogistics = useMemo(
    () => (Number(product?.price || 0) + logisticsFee) * Math.max(1, Number(qty || 1)),
    [product?.price, logisticsFee, qty],
  );

  if (loading) {
    return <EmptyState title="Loading product" description="Please wait." />;
  }
  if (!product) return <EmptyState title="Product unavailable" description="Try opening another item from catalog." />;

  const submitReview = async () => {
    if (!user) {
      pushToast("Login required for review", "error");
      return;
    }
    if (!reviewText.trim()) {
      pushToast("Write review text", "error");
      return;
    }
    let image = reviewImageUrl.trim();
    if (reviewFile) {
      try {
        image = await uploadService.uploadImage(reviewFile);
      } catch {
        image = "";
      }
    }
    const created = await reviewService.create({
      productId: product._id,
      productName: product.name,
      rating: reviewRating,
      message: reviewText.trim(),
      image,
    });
    setReviews((prev) => [created, ...prev]);
    setReviewText("");
    setReviewRating(5);
    setReviewImageUrl("");
    setReviewFile(null);
    pushToast("Review published", "success");
  };

  return (
    <div className="space-y-10">
      <section className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-3">
          <img src={product.images?.[0]} alt={product.name} className="glass-card h-[520px] w-full object-cover" />
          <div className="grid grid-cols-3 gap-3">
            {(product.images || []).map((img) => (
              <img key={img} src={img} alt={product.name} className="glass-card h-28 w-full object-cover" />
            ))}
          </div>
        </div>

        <div className="glass-card space-y-6 p-8">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">{product.category}</p>
            <h1 className="mt-2 font-serif text-5xl">{product.name}</h1>
            <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">{product.description}</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-semibold">{formatCurrency(product.price)}</p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Logistics: {formatCurrency(logisticsFee)}</p>
            <p className="text-sm font-semibold">Total price: {formatCurrency(totalWithLogistics)}</p>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium">Size</p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((option) => (
                <button
                  key={option}
                  className={`inline-btn ${size === option ? "border-zinc-950 dark:border-zinc-100" : ""}`}
                  onClick={() => setSize(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium">Color</p>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((option) => (
                <button
                  key={option}
                  className={`inline-btn ${color === option ? "border-zinc-950 dark:border-zinc-100" : ""}`}
                  onClick={() => setColor(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium">Quantity</p>
            <input
              type="number"
              min="1"
              value={qty}
              onChange={(event) => setQty(Number(event.target.value) || 1)}
              className="w-24 rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              className="inline-btn-primary"
              onClick={() => {
                addToCart(product, qty, size, color);
                pushToast("Added to cart", "success");
              }}
            >
              <ShoppingBag size={14} />
              Add to cart
            </button>
            <button className="inline-btn" onClick={() => toggleWishlist(product._id)}>
              <Heart size={14} fill={ids.includes(product._id) ? "currentColor" : "none"} />
              Add to wishlist
            </button>
            <Link className="inline-btn" to="/catalog">
              Back to catalog
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.1fr,1fr]">
        <div className="glass-card space-y-3 p-5">
          <h2 className="font-serif text-3xl">Reviews</h2>
          {!reviews.length ? (
            <p className="text-sm text-zinc-500">No reviews yet.</p>
          ) : (
            <div className="space-y-3">
              {reviews.map((item) => (
                <div key={item._id} className="rounded-2xl border border-zinc-200 p-3 text-sm dark:border-zinc-700">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">{item.userName || "User"}</p>
                    <p className="text-xs text-zinc-500">{new Date(item.createdAt).toLocaleDateString("en-GB")}</p>
                  </div>
                  <p className="mt-1 text-xs text-zinc-500">Rating: {item.rating}/5</p>
                  <p className="mt-2">{item.message}</p>
                  {item.image && <img src={item.image} alt="review" className="mt-2 h-24 w-24 rounded-xl object-cover" />}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass-card space-y-3 p-5">
          <h2 className="font-serif text-3xl">Leave Review</h2>
          <textarea
            className="w-full rounded-2xl border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            rows="3"
            placeholder="Awesome jeans, great fit..."
            value={reviewText}
            onChange={(event) => setReviewText(event.target.value)}
          />
          <div className="grid gap-2 sm:grid-cols-2">
            <input
              type="number"
              min="1"
              max="5"
              className="rounded-full border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
              value={reviewRating}
              onChange={(event) => setReviewRating(Math.max(1, Math.min(5, Number(event.target.value) || 5)))}
            />
            <input
              className="rounded-full border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
              placeholder="Image URL (optional)"
              value={reviewImageUrl}
              onChange={(event) => setReviewImageUrl(event.target.value)}
            />
          </div>
          <input type="file" accept="image/*" className="text-sm" onChange={(event) => setReviewFile(event.target.files?.[0] || null)} />
          <button className="inline-btn-primary" onClick={submitReview}>
            Publish review
          </button>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-serif text-4xl">You May Also Like</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((item) => (
            <ProductCard key={item._id} product={item} />
          ))}
        </div>
      </section>
    </div>
  );
}
