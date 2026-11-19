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
      title="Welcome Back to Orbit"
      subtitle="Enter your credentials to access your chambers"
      activeTab="login"
      error={loginMutation.error?.message}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-label-md font-semibold text-on-surface mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3.5 top-3 text-[18px] text-outline pointer-events-none">
              mail
            </span>
            <input
              type="email"
              placeholder="syndicate@orbit.community"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email format",
                },
              })}
              className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border border-outline-variant/40 rounded-xl text-body-sm text-on-surface placeholder:text-outline-variant focus:outline-none focus:border-primary-container focus:bg-surface-container-lowest transition-all"
            />
          </div>
          {errors.email && (
            <span className="text-label-sm text-error mt-1 block">
              {errors.email.message}
            </span>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-label-md font-semibold text-on-surface">
              Password
            </label>
            <a
              href="#"
              className="text-label-sm font-semibold text-primary hover:underline"
            >
              Forgot code?
            </a>
          </div>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3.5 top-3 text-[18px] text-outline pointer-events-none">
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
              className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border border-outline-variant/40 rounded-xl text-body-sm text-on-surface placeholder:text-outline-variant focus:outline-none focus:border-primary-container focus:bg-surface-container-lowest transition-all"
            />
          </div>
          {errors.password && (
            <span className="text-label-sm text-error mt-1 block">
              {errors.password.message}
            </span>
          )}
        </div>

        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-primary-fixed-dim via-primary-container to-secondary-container text-on-primary-fixed font-bold text-title-sm shadow-[0_0_20px_rgba(212,175,55,0.35)] hover:shadow-[0_0_28px_rgba(212,175,55,0.55)] transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loginMutation.isPending ? (
            <>
              <span className="w-4 h-4 border-2 border-on-primary-fixed border-t-transparent rounded-full animate-spin" />
              <span>Verifying Credentials...</span>
            </>
          ) : (
            <>
              <span>Access Chambers</span>
              <span className="material-symbols-outlined text-[18px]">
                arrow_forward
              </span>
            </>
          )}
        </button>
      </form>
    </AuthLayout>
  );
}