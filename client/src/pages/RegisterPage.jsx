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
      title="Join the Sovereign Syndicate"
      subtitle="Create your credentials for uncompromised privacy"
      activeTab="register"
      error={registerMutation.error?.message}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-label-md font-semibold text-on-surface mb-1.5">
            Display Name
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3.5 top-3 text-[18px] text-outline pointer-events-none">
              badge
            </span>
            <input
              type="text"
              placeholder="Aurelius Dev"
              {...register("fullname", {
                required: "Display name is required",
                minLength: {
                  value: 2,
                  message: "Must be at least 2 characters",
                },
              })}
              className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border border-outline-variant/40 rounded-xl text-body-sm text-on-surface placeholder:text-outline-variant focus:outline-none focus:border-primary-container focus:bg-surface-container-lowest transition-all"
            />
          </div>
          {errors.fullname && (
            <span className="text-label-sm text-error mt-1 block">
              {errors.fullname.message}
            </span>
          )}
        </div>

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
          <label className="block text-label-md font-semibold text-on-surface mb-1.5">
            Password
          </label>
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
                  value: 8,
                  message: "Password must be at least 8 characters",
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

        <div>
          <label className="block text-label-md font-semibold text-on-surface mb-1.5">
            Confirm Password
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3.5 top-3 text-[18px] text-outline pointer-events-none">
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
              className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border border-outline-variant/40 rounded-xl text-body-sm text-on-surface placeholder:text-outline-variant focus:outline-none focus:border-primary-container focus:bg-surface-container-lowest transition-all"
            />
          </div>
          {errors.confirmPassword && (
            <span className="text-label-sm text-error mt-1 block">
              {errors.confirmPassword.message}
            </span>
          )}
        </div>

        <button
          type="submit"
          disabled={registerMutation.isPending}
          className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-primary-fixed-dim via-primary-container to-secondary-container text-on-primary-fixed font-bold text-title-sm shadow-[0_0_20px_rgba(212,175,55,0.35)] hover:shadow-[0_0_28px_rgba(212,175,55,0.55)] transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {registerMutation.isPending ? (
            <>
              <span className="w-4 h-4 border-2 border-on-primary-fixed border-t-transparent rounded-full animate-spin" />
              <span>Creating Sovereign Enclave...</span>
            </>
          ) : (
            <>
              <span>Create Sovereign Account</span>
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