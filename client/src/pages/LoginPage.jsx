import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import AuthLayout from "../components/auth/AuthLayout";
import { useLoginMutation } from "../hooks/useAuth";

export default function LoginPage() {
  const isAuthenticated = useSelector((s) => s.ui.isAuthenticated);
  const location = useLocation();
  const loginMutation = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  if (isAuthenticated) {
    return <Navigate to={location.state?.from?.pathname || "/app"} replace />;
  }

  const onSubmit = (values) => {
    loginMutation.mutate({
      email: values.email.trim(),
      password: values.password,
    });
  };

  return (
    <AuthLayout
      title="Sign in to Orbit"
      subtitle="Enter your email and password to access your account"
      activeTab="login"
      error={loginMutation.error?.message}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-neutral-700 mb-1">
            Email
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-[16px] text-neutral-400 pointer-events-none">
              mail
            </span>
            <input
              type="email"
              placeholder="name@example.com"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email format",
                },
              })}
              className="w-full pl-9 pr-3 py-2 bg-neutral-50 border border-outline-variant rounded text-xs text-on-surface placeholder:text-neutral-400 focus:outline-none focus:border-on-surface focus:bg-white transition-colors"
            />
          </div>
          {errors.email && (
            <span className="text-[11px] text-red-600 mt-1 block">
              {errors.email.message}
            </span>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-medium text-neutral-700">
              Password
            </label>
            <a
              href="#"
              className="text-xs text-neutral-500 hover:text-on-surface transition-colors"
            >
              Forgot password?
            </a>
          </div>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-[16px] text-neutral-400 pointer-events-none">
              lock
            </span>
            <input
              type="password"
              placeholder="••••••••••••"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Minimum 6 characters required",
                },
              })}
              className="w-full pl-9 pr-3 py-2 bg-neutral-50 border border-outline-variant rounded text-xs text-on-surface placeholder:text-neutral-400 focus:outline-none focus:border-on-surface focus:bg-white transition-colors"
            />
          </div>
          {errors.password && (
            <span className="text-[11px] text-red-600 mt-1 block">
              {errors.password.message}
            </span>
          )}
        </div>

        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="w-full mt-2 py-2 rounded bg-on-surface text-white font-medium text-xs hover:bg-neutral-800 disabled:opacity-60 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          {loginMutation.isPending ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Signing in...</span>
            </>
          ) : (
            <span>Sign in</span>
          )}
        </button>
      </form>
    </AuthLayout>
  );
}
