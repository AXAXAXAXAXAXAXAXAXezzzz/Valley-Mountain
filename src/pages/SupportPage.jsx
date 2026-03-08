import { Camera, Ellipsis, SendHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "../context/ToastContext";
import { supportService } from "../services/api/supportService";
import { uploadService } from "../services/api/uploadService";

const SUPPORT_BRAND = { name: "Valley Mountain", logoLight: "/logo.png", logoDark: "/logo2.png" };

export default function SupportPage() {
  const { pushToast } = useToast();
  const [supportChat, setSupportChat] = useState([]);
  const [supportLoading, setSupportLoading] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatFile, setChatFile] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const loadSupport = async () => {
      setSupportLoading(true);
      try {
        const data = await supportService.getAll();
        if (cancelled) return;
        const list = Array.isArray(data) ? data : [];
        list.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
        setSupportChat(list);
      } catch {
        if (!cancelled) setSupportChat([]);
      } finally {
        if (!cancelled) setSupportLoading(false);
      }
    };

    loadSupport();
    const timer = setInterval(loadSupport, 6000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, []);

  const sendSupportTicket = async () => {
    if (!chatMessage.trim() && !chatFile) {
      pushToast("Message or photo is required", "error");
      return;
    }

    let image = "";
    if (chatFile) {
      try {
        image = await uploadService.uploadImage(chatFile);
      } catch {
        image = "";
      }
    }

    try {
      const created = await supportService.create({
        subject: "Support chat",
        message: chatMessage.trim() || "Photo attached",
        image,
      });
      setSupportChat((prev) => [...prev, created]);
      setChatMessage("");
      setChatFile(null);
    } catch {
      pushToast("Failed to send message", "error");
    }
  };

  return (
    <>
      <section className="relative h-[calc(100vh-72px)] overflow-hidden border-y border-zinc-200/70 bg-zinc-100 text-zinc-900 dark:border-zinc-800/80 dark:bg-zinc-950 dark:text-zinc-100">
      <img src="/karta.png" alt="" className="absolute inset-0 h-full w-full object-cover opacity-20 dark:opacity-35" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.55),transparent_45%),linear-gradient(180deg,rgba(255,255,255,0.35),rgba(245,245,245,0.8))] dark:bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_45%),linear-gradient(180deg,rgba(0,0,0,0.35),rgba(0,0,0,0.7))]" />

      <div className="relative mx-auto flex h-full w-full max-w-lg flex-col p-3 sm:p-5">
        <div className="mb-3 flex flex-col items-center text-center sm:mb-4">
          <img src={SUPPORT_BRAND.logoLight} alt={`${SUPPORT_BRAND.name} logo`} className="reveal h-14 w-auto object-contain dark:hidden" />
          <img src={SUPPORT_BRAND.logoDark} alt={`${SUPPORT_BRAND.name} logo`} className="reveal hidden h-14 w-auto object-contain dark:block" />
          <h1 className="reveal reveal-delay-1 mt-2 font-serif text-4xl leading-none text-zinc-900 dark:text-zinc-100 sm:text-5xl">{SUPPORT_BRAND.name}</h1>
        </div>

        <div className="flex min-h-0 flex-1 flex-col rounded-[24px] border border-zinc-300/70 bg-white/80 p-3 backdrop-blur-md sm:p-4 dark:border-zinc-200/15 dark:bg-zinc-900/45">
          <div className="mb-3 flex items-center justify-between sm:mb-4">
            <div className="flex items-center gap-3 pl-1">
              <div className="h-10 w-10 shrink-0 rounded-full border border-zinc-300 bg-white p-1 dark:border-zinc-700 dark:bg-zinc-900">
                <img src={SUPPORT_BRAND.logoLight} alt="" className="h-full w-full object-contain dark:hidden" />
                <img src={SUPPORT_BRAND.logoDark} alt="" className="hidden h-full w-full object-contain dark:block" />
              </div>
              <div>
                <p className="reveal reveal-delay-1 text-base font-semibold">{SUPPORT_BRAND.name} Support</p>
                <p className="reveal reveal-delay-2 text-sm text-zinc-500 dark:text-zinc-400">Chat with an operator in real-time</p>
              </div>
            </div>
            <button className="rounded-full p-1 text-zinc-500 transition hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200" type="button">
              <Ellipsis size={18} />
            </button>
          </div>

          <div className="mb-3 min-h-0 flex-1 space-y-2 overflow-y-auto rounded-2xl border border-zinc-300/70 bg-white/70 p-3 sm:mb-4 dark:border-zinc-100/10 dark:bg-zinc-950/35">
            {supportLoading ? <p className="text-sm text-zinc-500 dark:text-zinc-400">Loading chat...</p> : null}
            {!supportLoading && supportChat.length === 0 ? (
              <div className="flex h-full min-h-[180px] items-center justify-center">
                <p className="reveal reveal-delay-2 text-center text-sm text-zinc-500 dark:text-zinc-400">No messages yet.</p>
              </div>
            ) : null}

            {supportChat.map((item) => (
              <div key={item._id} className="flex justify-end">
                <div className="w-fit max-w-[92%] rounded-2xl border border-zinc-300 bg-white px-4 py-3 dark:border-zinc-100/10 dark:bg-zinc-900/70">
                  <p className="text-zinc-900 dark:text-zinc-100">{item.message}</p>
                  {item.image ? <img src={item.image} alt="attachment" className="mt-2 h-24 w-24 rounded-lg object-cover" /> : null}
                  <p className="mt-1 text-right text-xs text-zinc-500 dark:text-zinc-500">
                    {new Date(item.createdAt || Date.now()).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}{" "}
                    <span className={item.status === "resolved" ? "text-sky-500" : "text-zinc-500 dark:text-zinc-400"}>
                      {item.status === "resolved" ? "✓✓" : "✓"}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-zinc-300/70 pt-3 dark:border-zinc-100/10">
            <div className="flex items-center gap-2 rounded-2xl border border-zinc-300/70 bg-white/70 px-2 py-2 dark:border-zinc-100/15 dark:bg-zinc-950/45">
              <span className="pl-2 text-zinc-500 dark:text-zinc-400">
                <Camera size={16} />
              </span>
              <input
                id="support-photo"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => setChatFile(event.target.files?.[0] || null)}
              />
              <label
                htmlFor="support-photo"
                className="inline-flex h-8 shrink-0 cursor-pointer items-center rounded-full border border-zinc-300 bg-white px-3 text-xs font-medium text-zinc-700 transition hover:border-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:border-zinc-400"
              >
                {chatFile ? "Photo selected" : "Choose photo"}
              </label>
              <input
                className="h-10 flex-1 bg-transparent px-3 text-sm text-zinc-900 outline-none placeholder:text-zinc-500 dark:text-zinc-100"
                placeholder="Write a message..."
                value={chatMessage}
                onChange={(event) => setChatMessage(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    sendSupportTicket();
                  }
                }}
              />
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-300 text-zinc-600 transition hover:border-zinc-500 hover:text-zinc-900 dark:border-zinc-100/20 dark:text-zinc-300 dark:hover:border-zinc-100/50 dark:hover:text-zinc-100"
                onClick={sendSupportTicket}
              >
                <SendHorizontal size={17} />
              </button>
            </div>
          </div>
        </div>
      </div>
      </section>

      <div className="relative h-10" aria-hidden="true">
        <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-zinc-400/70 to-transparent dark:via-zinc-600/80" />
        <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-zinc-400 bg-white dark:border-zinc-600 dark:bg-zinc-900" />
      </div>
    </>
  );
}
