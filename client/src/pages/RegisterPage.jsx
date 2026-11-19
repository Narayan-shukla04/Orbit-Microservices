import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import AuthLayout from "../components/auth/AuthLayout";
import { useRegisterMutation } from "../hooks/useAuth";

export default function RegisterPage() {
  const isAuthenticated = useSelector((s) => s.ui.isAuthenticated);
  const location = useLocation();
  const registerMutation = useRegisterMutation();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullname: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const passwordValue = watch("password");

  if (isAuthenticated) {
    return <Navigate to={location.state?.from?.pathname || "/app"} replace />;
  }

  const onSubmit = (values) => {
    const fullname = values.fullname.trim();
    const username = fullname.toLowerCase().replace(/[^a-z0-9]/g, "_");

    registerMutation.mutate({
      fullname,
      username,
      email: values.email.trim(),
      password: values.password,
    });
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Sign up to start communicating on Orbit"
      activeTab="register"
      error={registerMutation.error?.message}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-neutral-700 mb-1">
            Display Name
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-[16px] text-neutral-400 pointer-events-none">
              badge
            </span>
            <input
              type="text"
              placeholder="Alex Doe"
              {...register("fullname", {
                required: "Display name is required",
                minLength: {
                  value: 2,
                  message: "Must be at least 2 characters",
                },
              })}
              className="w-full pl-9 pr-3 py-2 bg-neutral-50 border border-outline-variant rounded text-xs text-on-surface placeholder:text-neutral-400 focus:outline-none focus:border-on-surface focus:bg-white transition-colors"
            />
          </div>
          {errors.fullname && (
            <span className="text-[11px] text-red-600 mt-1 block">
              {errors.fullname.message}
            </span>
          )}
        </div>

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
          <label className="block text-xs font-medium text-neutral-700 mb-1">
            Password
          </label>
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
                  value: 8,
                  message: "Password must be at least 8 characters",
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

        <div>
          <label className="block text-xs font-medium text-neutral-700 mb-1">
            Confirm Password
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-[16px] text-neutral-400 pointer-events-none">
              verified_user
            </span>
            <input
              type="password"
              placeholder="••••••••••••"
              {...register("confirmPassword", {
                required: "Please confirm password",
                validate: (value) =>
                  value === passwordValue || "Passwords do not match",
              })}
              className="w-full pl-9 pr-3 py-2 bg-neutral-50 border border-outline-variant rounded text-xs text-on-surface placeholder:text-neutral-400 focus:outline-none focus:border-on-surface focus:bg-white transition-colors"
            />
          </div>
          {errors.confirmPassword && (
            <span className="text-[11px] text-red-600 mt-1 block">
              {errors.confirmPassword.message}
            </span>
          )}
        </div>

        <button
          type="submit"
          disabled={registerMutation.isPending}
          className="w-full mt-2 py-2 rounded bg-on-surface text-white font-medium text-xs hover:bg-neutral-800 disabled:opacity-60 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          {registerMutation.isPending ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Creating account...</span>
            </>
          ) : (
            <span>Create account</span>
          )}
        </button>
      </form>
    </AuthLayout>
  );
}
