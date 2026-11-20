import { Link } from "react-router-dom";

export default function AuthLayout({
  title,
  subtitle,
  activeTab,
  error,
  children,
}) {
  return (
    <div className="min-h-screen bg-surface text-on-surface font-sans antialiased flex flex-col justify-between">
      <header className="w-full max-w-6xl mx-auto px-6 h-16 flex items-center justify-between border-b border-outline-variant">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight text-on-surface">Orbit</span>
        </Link>
        <Link to="/" className="text-sm text-on-surface-variant hover:text-on-surface transition-colors flex items-center gap-1">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Home</span>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[420px] bg-white border border-outline-variant rounded-xl p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-on-surface tracking-tight">
              {title}
            </h1>
            <p className="text-sm text-on-surface-variant mt-1">
              {subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 p-1 bg-surface-container rounded-lg mb-6 border border-outline-variant">
            <Link
              to="/login"
              className={`py-1.5 text-center text-xs font-semibold rounded-md transition-colors ${
                activeTab === "login"
                  ? "bg-white text-on-surface shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className={`py-1.5 text-center text-xs font-semibold rounded-md transition-colors ${
                activeTab === "register"
                  ? "bg-white text-on-surface shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              Create Account
            </Link>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
              <span className="material-symbols-outlined text-[16px] text-red-600 shrink-0 mt-0.5">error</span>
              <div className="flex-1">
                <span>{error}</span>
              </div>
            </div>
          )}

          {children}
        </div>
      </main>

      <footer className="w-full text-center py-6 text-xs text-on-surface-variant border-t border-outline-variant">
        Orbit · Open Community Communication
      </footer>
    </div>
  );
}
