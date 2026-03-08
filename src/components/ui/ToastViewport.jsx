import { CheckCircle2, Info, TriangleAlert } from "lucide-react";
import { useToast } from "../../context/ToastContext";

const icons = {
  success: <CheckCircle2 size={16} className="text-zinc-700 dark:text-zinc-200" />,
  error: <TriangleAlert size={16} className="text-zinc-700 dark:text-zinc-200" />,
  info: <Info size={16} className="text-zinc-700 dark:text-zinc-200" />,
};

export default function ToastViewport() {
  const { toasts } = useToast();

  return (
    <div className="fixed right-4 top-20 z-50 flex w-[320px] flex-col gap-2">
      {toasts.map((toast) => (
        <div key={toast.id} className="glass-card flex items-center gap-2 px-4 py-3 text-sm">
          {icons[toast.type] || icons.info}
          <p>{toast.message}</p>
        </div>
      ))}
    </div>
  );
}
