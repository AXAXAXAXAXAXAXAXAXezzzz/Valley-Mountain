import { Link } from "react-router-dom";
import EmptyState from "../components/ui/EmptyState";
import { useCart } from "../context/CartContext";
import { formatCurrency } from "../utils/format";

export default function CartPage() {
  const { items, totals, updateQty, removeFromCart } = useCart();

  if (items.length === 0) {
    return <EmptyState title="Your cart is empty" description="Add premium essentials from the catalog." />;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
      <section className="space-y-4">
        {items.map((item) => (
          <article key={item.key} className="glass-card flex gap-4 p-4">
            <img src={item.image} alt={item.name} className="h-28 w-24 rounded-2xl object-cover" />
            <div className="flex flex-1 flex-col justify-between">
              <div>
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-sm text-zinc-500">
                  {item.size} / {item.color}
                </p>
                <p className="mt-1 font-medium">{formatCurrency(item.price)}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="number"
                  min="1"
                  value={item.qty}
                  onChange={(event) => updateQty(item.key, Number(event.target.value) || 1)}
                  className="w-20 rounded-full border border-zinc-300 bg-white px-3 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                />
                <button className="inline-btn" onClick={() => removeFromCart(item.key)}>
                  Remove
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>

      <aside className="glass-card h-fit space-y-3 p-6">
        <h2 className="text-xl font-semibold">Summary</h2>
        <div className="flex items-center justify-between text-sm">
          <span>Items</span>
          <span>{totals.count}</span>
        </div>
        <div className="flex items-center justify-between text-lg font-semibold">
          <span>Total</span>
          <span>{formatCurrency(totals.amount)}</span>
        </div>
        <Link to="/checkout" className="inline-btn-primary">
          Proceed to checkout
        </Link>
      </aside>
    </div>
  );
}
