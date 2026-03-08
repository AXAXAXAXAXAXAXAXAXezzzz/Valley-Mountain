import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { orderService } from "../services/api/orderService";

export default function CheckoutPage() {
  const { register, handleSubmit } = useForm({
    defaultValues: { fullName: "", email: "", address: "", city: "", country: "", paymentMethod: "card" },
  });
  const { items, totals, clearCart } = useCart();
  const { pushToast } = useToast();
  const navigate = useNavigate();

  const onSubmit = async (values) => {
    await orderService.create({ customer: values, items, totalAmount: totals.amount });
    clearCart();
    pushToast("Order confirmed", "success");
    navigate("/profile");
  };

  return (
    <div className="glass-card mx-auto max-w-3xl p-4 sm:p-8">
      <h1 className="font-serif text-3xl sm:text-4xl">Checkout</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 grid gap-4 md:grid-cols-2">
        <input
          className="rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          placeholder="Full name"
          {...register("fullName", { required: true })}
        />
        <input
          className="rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          placeholder="Email"
          {...register("email", { required: true })}
        />
        <input
          className="rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 md:col-span-2"
          placeholder="Address"
          {...register("address", { required: true })}
        />
        <input
          className="rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          placeholder="City"
          {...register("city", { required: true })}
        />
        <input
          className="rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          placeholder="Country"
          {...register("country", { required: true })}
        />
        <select
          className="rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 md:col-span-2"
          {...register("paymentMethod")}
        >
          <option value="card">Card</option>
          <option value="paypal">PayPal</option>
          <option value="cod">Cash on delivery</option>
        </select>
        <button className="inline-btn-primary md:col-span-2" type="submit">
          Confirm order
        </button>
      </form>
    </div>
  );
}
