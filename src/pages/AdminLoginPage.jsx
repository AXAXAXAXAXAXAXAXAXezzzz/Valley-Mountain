import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function AdminLoginPage() {
  const { register, handleSubmit } = useForm();
  const { login } = useAuth();
  const { pushToast } = useToast();
  const navigate = useNavigate();

  const onSubmit = async ({ email, password }) => {
    try {
      const response = await login(email, password);
      if (!response.user.isAdmin) {
        pushToast("Admin access required", "error");
        return;
      }
      navigate("/admin");
    } catch {
      pushToast("Invalid admin credentials", "error");
    }
  };

  return (
    <div className="glass-card mx-auto max-w-md p-8">
      <h1 className="font-serif text-4xl">Admin Login</h1>
      <form className="mt-6 space-y-3" onSubmit={handleSubmit(onSubmit)}>
        <input
          className="w-full rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          placeholder="Admin email"
          {...register("email", { required: true })}
        />
        <input
          type="password"
          className="w-full rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          placeholder="Password"
          {...register("password", { required: true })}
        />
        <button className="inline-btn-primary w-full justify-center" type="submit">
          Enter dashboard
        </button>
      </form>
    </div>
  );
}
