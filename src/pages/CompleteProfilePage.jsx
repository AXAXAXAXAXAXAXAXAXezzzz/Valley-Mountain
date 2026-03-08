import { Lock, MapPin, Phone, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function CompleteProfilePage() {
  const { user, completeProfile } = useAuth();
  const { pushToast } = useToast();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      nameOrNickname: user?.username || user?.fullName || user?.displayName || user?.name || "",
      phone: user?.phone || "",
      country: user?.country || "",
      city: user?.city || "",
      address: user?.address || "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values) => {
    console.log("complete profile submit started", values);
    try {
      const identity = String(values.nameOrNickname || "").trim();
      const result = await completeProfile({
        ...values,
        fullName: identity,
        username: identity,
      });
      if (result?.passwordDeferred) {
        pushToast("Profile saved. Check your email to set password securely.", "success");
      } else {
        pushToast("Profile completed", "success");
      }
      navigate("/profile");
    } catch (error) {
      pushToast(error?.code ? `Unable to save profile: ${error.code}` : "Unable to save profile", "error");
    }
  };

  const onInvalid = () => {
    pushToast("Please fill all required fields correctly", "error");
  };

  return (
    <section className="mx-auto flex min-h-[620px] max-w-4xl flex-col justify-center p-4 text-center sm:p-8 reveal">
      <p className="text-center font-serif text-4xl text-zinc-900 dark:text-zinc-100 sm:text-5xl">Valley Mountain</p>
      <img src="/logo.png" alt="Valley Mountain logo" className="mx-auto mt-2 h-12 w-auto object-contain dark:hidden sm:h-14" />
      <img src="/logo2.png" alt="Valley Mountain logo" className="mx-auto mt-2 hidden h-12 w-auto object-contain dark:block sm:h-14" />
      <hr className="mx-auto mt-4 w-full max-w-lg border-zinc-300 dark:border-zinc-700" />

      <div
        className="mx-auto mt-3 w-full max-w-xl rounded-[1.75rem] border border-zinc-200/95 bg-zinc-50/95 bg-cover bg-center p-4 shadow-[0_26px_60px_-36px_rgba(0,0,0,0.5)] backdrop-blur-sm dark:border-zinc-700 dark:bg-zinc-900/95 dark:shadow-[0_24px_58px_-34px_rgba(255,255,255,0.45)] sm:p-7 reveal reveal-delay-1"
        style={{ backgroundImage: "url('/karta.png')" }}
      >
        <h1 className="font-serif text-3xl text-zinc-900 dark:text-zinc-100 sm:text-5xl">Complete your profile</h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 sm:text-lg">Set up your account details for faster checkout and future sign-in</p>

        <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="mt-6 space-y-3 reveal reveal-delay-2">
          <label className="flex h-12 items-center gap-2.5 rounded-xl border border-zinc-300 bg-white px-3 dark:border-zinc-700 dark:bg-zinc-950 sm:h-14 sm:gap-3 sm:px-4">
            <User size={18} className="text-zinc-500" />
            <input className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-500 sm:text-[15px]" placeholder="Your Name / Nickname" {...register("nameOrNickname", { required: true })} />
          </label>

          <label className="flex h-12 items-center gap-2.5 rounded-xl border border-zinc-300 bg-white px-3 dark:border-zinc-700 dark:bg-zinc-950 sm:h-14 sm:gap-3 sm:px-4">
            <Phone size={18} className="text-zinc-500" />
            <input
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-500 sm:text-[15px]"
              placeholder="Phone Number"
              {...register("phone", { required: true })}
            />
          </label>

          <label className="flex h-12 items-center gap-2.5 rounded-xl border border-zinc-300 bg-white px-3 dark:border-zinc-700 dark:bg-zinc-950 sm:h-14 sm:gap-3 sm:px-4">
            <MapPin size={18} className="text-zinc-500" />
            <input className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-500 sm:text-[15px]" placeholder="Country" {...register("country", { required: true })} />
          </label>

          <label className="flex h-12 items-center gap-2.5 rounded-xl border border-zinc-300 bg-white px-3 dark:border-zinc-700 dark:bg-zinc-950 sm:h-14 sm:gap-3 sm:px-4">
            <MapPin size={18} className="text-zinc-500" />
            <input className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-500 sm:text-[15px]" placeholder="City" {...register("city", { required: true })} />
          </label>

          <label className="flex h-12 items-center gap-2.5 rounded-xl border border-zinc-300 bg-white px-3 dark:border-zinc-700 dark:bg-zinc-950 sm:h-14 sm:gap-3 sm:px-4">
            <MapPin size={18} className="text-zinc-500" />
            <input className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-500 sm:text-[15px]" placeholder="Address" {...register("address", { required: true })} />
          </label>

          <label className="flex h-12 items-center gap-2.5 rounded-xl border border-zinc-300 bg-white px-3 dark:border-zinc-700 dark:bg-zinc-950 sm:h-14 sm:gap-3 sm:px-4">
            <Lock size={18} className="text-zinc-500" />
            <input type="password" className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-500 sm:text-[15px]" placeholder="Password" {...register("password", { required: true, minLength: 6 })} />
          </label>

          <label className="flex h-12 items-center gap-2.5 rounded-xl border border-zinc-300 bg-white px-3 dark:border-zinc-700 dark:bg-zinc-950 sm:h-14 sm:gap-3 sm:px-4">
            <Lock size={18} className="text-zinc-500" />
            <input type="password" className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-500 sm:text-[15px]" placeholder="Confirm Password" {...register("confirmPassword", { required: true, minLength: 6 })} />
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 h-12 w-full rounded-xl bg-zinc-950 text-lg font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-70 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 sm:h-14 sm:text-xl"
          >
            {isSubmitting ? "Saving..." : "Save and continue"}
          </button>
        </form>
      </div>
      <hr className="mx-auto mt-4 w-full max-w-lg border-zinc-300 dark:border-zinc-700" />
    </section>
  );
}
