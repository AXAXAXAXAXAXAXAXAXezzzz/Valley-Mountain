export default function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/45 px-3 py-4" onClick={onClose}>
      <div className="glass-card my-auto w-full max-w-3xl p-4 sm:p-5" onClick={(event) => event.stopPropagation()}>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button className="inline-btn" onClick={onClose}>
            Close
          </button>
        </div>
        <div className="max-h-[82vh] overflow-y-auto pr-1">{children}</div>
      </div>
    </div>
  );
}
