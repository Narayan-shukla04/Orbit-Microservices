import { Link } from "react-router-dom";

export default function AuthLayout({
  title,
  subtitle,
  activeTab,
  error,
  children,
}) {

  return (
    <div className="min-h-screen bg-surface text-on-surface font-sans antialiased flex flex-col justify-between relative overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-secondary-fixed/25 via-primary-container/20 to-transparent blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute -bottom-24 right-1/4 w-[400px] h-[400px] bg-primary-fixed/20 blur-[130px] pointer-events-none rounded-full" />

      {/* Header bar */}
      <header className="w-full max-w-7xl mx-auto px-6 h-20 flex items-center justify-between z-10">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-headline-md font-bold tracking-tight text-on-surface group-hover:text-primary transition-colors">Orbit</span>
          <span className="text-label-sm font-code uppercase tracking-widest text-primary-container bg-surface-container px-2 py-0.5 rounded-full border border-outline-variant/30">Lumina</span>
        </Link>
        <Link to="/" className="text-body-sm text-on-surface-variant hover:text-on-surface transition-colors flex items-center gap-1 font-medium">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Back to Landing</span>
        </Link>
      </header>

      {/* Main card */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 z-10">
        <div className="w-full max-w-[460px] bg-surface-container-lowest/90 backdrop-blur-xl border border-outline-variant/40 rounded-3xl p-8 sm:p-10 shadow-[0_12px_48px_-12px_rgba(212,175,55,0.18)]">
          {/* Brand header */}
          <div className="text-center mb-8">
            <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-fixed-dim via-primary-container to-secondary-container items-center justify-center text-on-primary-fixed shadow-[0_0_24px_rgba(212,175,55,0.4)] mb-4 font-bold text-title-lg font-code">
              OR
            </div>
            <h1 className="text-headline-sm font-bold text-on-surface tracking-tight">
              {title}
            </h1>
            <p className="text-body-sm text-on-surface-variant mt-1.5">
              {subtitle}
            </p>
          </div>

          {/* Tab switcher */}
          <div className="grid grid-cols-2 p-1 bg-surface-container-low rounded-xl mb-6 border border-outline-variant/30">
            <Link
              to="/login"
              className={`py-2 text-center text-body-sm font-semibold rounded-lg transition-all ${
                activeTab === "login"
                  ? "bg-surface-container-lowest text-on-surface shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className={`py-2 text-center text-body-sm font-semibold rounded-lg transition-all ${
                activeTab === "register"
                  ? "bg-surface-container-lowest text-on-surface shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              Create Account
            </Link>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-error-container/40 border border-error/20 text-on-error-container text-body-sm flex items-start gap-2.5">
              <span className="material-symbols-outlined text-[18px] text-error shrink-0 mt-0.5">error</span>
              <div className="flex-1 text-label-md">
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Form Content */}
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full text-center py-4 text-label-sm text-on-surface-variant font-code z-10">
        Orbit Covenant · End-to-End Cryptographic Enclave
      </footer>
    </div>
  );
}