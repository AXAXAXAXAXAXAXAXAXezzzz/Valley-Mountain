import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Lock, Mail } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function LoginPage() {
  const { register, handleSubmit } = useForm();
  const { login, googleLogin } = useAuth();
  const { pushToast } = useToast();
  const navigate = useNavigate();

  const onSubmit = async (values) => {
    try {
      const result = await login(values.email, values.password);
      pushToast("Welcome back", "success");
      navigate(result.user?.isAdmin ? "/admin" : "/profile");
    } catch {
      pushToast("Invalid credentials", "error");
    }
  };

  const handleGoogleLogin = async () => {
    console.log("google click works");
    try {
      const user = await googleLogin();
      console.log(user.displayName);
      console.log(user.email);
      console.log(user.photoURL);
      pushToast("Logged in with Google", "success");
      navigate("/profile");
    } catch (error) {
      console.error("Google login failed:", error.code, error.message);
      pushToast(error?.code ? `Google login failed: ${error.code}` : "Google login failed", "error");
    }
  };

  return (
    <section className="mx-auto flex min-h-[620px] max-w-4xl flex-col justify-center p-6 text-center sm:p-8 reveal">
      <p className="text-center font-serif text-5xl text-zinc-900 dark:text-zinc-100">Valley Mountain</p>
      <img src="/logo.png" alt="Valley Mountain logo" className="mx-auto mt-2 h-14 w-auto object-contain dark:hidden" />
      <img src="/logo2.png" alt="Valley Mountain logo" className="mx-auto mt-2 hidden h-14 w-auto object-contain dark:block" />
      <hr className="mx-auto mt-4 w-full max-w-lg border-zinc-300 dark:border-zinc-700" />

      <div
        className="mx-auto mt-3 max-w-lg rounded-[1.5rem] border border-zinc-200 bg-zinc-50 bg-cover bg-center p-6 shadow-[0_20px_45px_-28px_rgba(0,0,0,0.45)] dark:border-zinc-700 dark:bg-zinc-900 dark:shadow-[0_20px_45px_-28px_rgba(255,255,255,0.55)] reveal reveal-delay-1"
        style={{ backgroundImage: "url('/karta.png')" }}
      >
        <h1 className="font-serif text-5xl text-zinc-900 dark:text-zinc-100">Welcome Back</h1>
        <p className="mt-2 text-lg text-zinc-500 dark:text-zinc-400">Please sign in to your account</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-2.5 reveal reveal-delay-2">
          <label className="flex h-12 items-center gap-2.5 rounded-lg border border-zinc-300 bg-white px-4 dark:border-zinc-700 dark:bg-zinc-950">
            <Mail size={18} className="text-zinc-500" />
            <input className="w-full bg-transparent text-base outline-none placeholder:text-zinc-500" placeholder="Email Address" {...register("email", { required: true })} />
          </label>

          <label className="flex h-12 items-center gap-2.5 rounded-lg border border-zinc-300 bg-white px-4 dark:border-zinc-700 dark:bg-zinc-950">
            <Lock size={18} className="text-zinc-500" />
            <input type="password" className="w-full bg-transparent text-base outline-none placeholder:text-zinc-500" placeholder="Password" {...register("password", { required: true })} />
            <span className="shrink-0 text-sm text-zinc-500">Forgot?</span>
          </label>

          <button type="submit" className="mt-1 h-12 w-full rounded-lg bg-zinc-950 text-xl font-semibold text-white transition hover:bg-black dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200">
            Sign In
          </button>
        </form>

        <div className="my-6 flex items-center gap-3 text-zinc-500 dark:text-zinc-400">
          <div className="h-px flex-1 bg-zinc-300 dark:bg-zinc-700" />
          <span className="text-sm">or continue with</span>
          <div className="h-px flex-1 bg-zinc-300 dark:bg-zinc-700" />
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="btn inline-flex h-12 w-full items-center justify-center gap-3 rounded-lg border border-[#e5e5e5] bg-white text-base font-medium text-black transition hover:bg-zinc-100"
        >
          <svg aria-label="Google logo" width="18" height="18" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
            <path fill="#FFC107" d="M43.61 20.08H42V20H24v8h11.3C33.64 32.66 29.19 36 24 36c-6.63 0-12-5.37-12-12s5.37-12 12-12c3.06 0 5.84 1.15 7.96 3.04l5.66-5.66C34.05 6.05 29.27 4 24 4 12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20c0-1.34-.14-2.65-.39-3.92z"/>
            <path fill="#FF3D00" d="M6.31 14.69l6.57 4.82C14.66 16.09 19 12 24 12c3.06 0 5.84 1.15 7.96 3.04l5.66-5.66C34.05 6.05 29.27 4 24 4 16.32 4 9.64 8.34 6.31 14.69z"/>
            <path fill="#4CAF50" d="M24 44c5.16 0 9.86-1.98 13.41-5.2l-6.19-5.24C29.15 35.09 26.68 36 24 36c-5.17 0-9.61-3.32-11.28-7.94l-6.52 5.02C9.5 39.56 16.22 44 24 44z"/>
            <path fill="#1976D2" d="M43.61 20.08H42V20H24v8h11.3c-.8 2.34-2.31 4.33-4.08 5.56l.01-.01 6.19 5.24C36.97 39.14 44 34 44 24c0-1.34-.14-2.65-.39-3.92z"/>
          </svg>
          Login with Google
        </button>

        <div className="mt-6 border-t border-zinc-300 pt-6 text-center dark:border-zinc-700">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">New to Valley Mountain?</p>
          <Link className="mt-1 inline-block text-xl font-semibold text-zinc-900 underline underline-offset-4 dark:text-zinc-100" to="/register">
            Create Account
          </Link>
        </div>
      </div>
      <hr className="mx-auto mt-4 w-full max-w-lg border-zinc-300 dark:border-zinc-700" />
    </section>
  );
}



