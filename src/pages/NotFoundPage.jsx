import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="mx-auto max-w-xl py-16 text-center">
      <h1 className="font-serif text-6xl">404</h1>
      <p className="mt-3 text-sm text-zinc-500">Page not found.</p>
      <Link to="/" className="mt-4 inline-btn">
        Return home
      </Link>
    </div>
  );
}
