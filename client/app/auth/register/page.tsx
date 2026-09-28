"use client";

import { useState, useRef, ChangeEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import { Eye, EyeOff, Loader2, CheckCircle2, AlertCircle, Camera, X, User } from "lucide-react";
import { apiFetch } from "../../lib/api";

interface RegisterFormInputs {
  avatar?: FileList;
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
}

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RegisterFormInputs>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  // Watch password to validate confirmPassword match
  const watchedPassword = watch("password");

  // Handle local avatar preview
  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setPreviewUrl(URL.createObjectURL(files[0]));
    } else {
      setPreviewUrl(null);
    }
  };

  const handleRemoveAvatar = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setValue("avatar", undefined, { shouldValidate: true });
  };

  const onSubmit: SubmitHandler<RegisterFormInputs> = async (data) => {
    setServerError(null);

    try {
      const formData = new FormData();
      formData.append("fullname", data.name);
      formData.append("username", data.name.toLowerCase().replace(/\s+/g, "").slice(0, 24));
      formData.append("email", data.email);
      formData.append("password", data.password);

      if (data.avatar && data.avatar.length > 0) {
        formData.append("image", data.avatar[0]);
      }

      await apiFetch("/api/auth/register", { method: "POST", body: formData });

      setIsSuccess(true);
      setPreviewUrl(null);
      reset();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setServerError(err.message);
      } else {
        setServerError("An unexpected error occurred. Please try again.");
      }
    }
  };

  // Destructure avatar registration to connect internal ref & onChange
  const { ref: avatarHookFormRef, onChange: avatarHookFormOnChange, ...avatarRest } = register(
    "avatar",
    {
      validate: {
        fileSize: (files) => {
          if (!files || files.length === 0) return true;
          return files[0].size <= MAX_FILE_SIZE || "Image size must be less than 2MB";
        },
        fileType: (files) => {
          if (!files || files.length === 0) return true;
          return ALLOWED_TYPES.includes(files[0].type) || "Only JPG, PNG, and WebP are allowed";
        },
      },
    }
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Create an account
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* Success Banner */}
        {isSuccess && (
          <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
            <span>Account created successfully! Check your email to verify.</span>
          </div>
        )}

        {/* Server Error Banner */}
        {serverError && (
          <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">
            <AlertCircle className="h-5 w-5 shrink-0 text-rose-600" />
            <span>{serverError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          {/* PROFILE PICTURE UPLOAD */}
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="relative">
              <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-slate-300 bg-slate-100 shadow-inner">
                {previewUrl ? (
                  <Image
                    src={previewUrl}
                    alt="Profile preview"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <User className="h-10 w-10 text-slate-400" />
                )}
              </div>

              <label
                htmlFor="avatar"
                className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-indigo-600 text-white shadow-md transition hover:bg-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2"
                title="Upload photo"
              >
                <Camera className="h-4 w-4" />
                <input
                  id="avatar"
                  type="file"
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  className="sr-only"
                  {...avatarRest}
                  ref={(e) => {
                    avatarHookFormRef(e);
                    fileInputRef.current = e;
                  }}
                  onChange={(e) => {
                    avatarHookFormOnChange(e);
                    handleAvatarChange(e);
                  }}
                />
              </label>

              {previewUrl && (
                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-rose-500 text-white shadow hover:bg-rose-600 focus:outline-none"
                  title="Remove photo"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <span className="text-xs text-slate-500">
              Upload photo (JPG, PNG, WebP up to 2MB)
            </span>
            {errors.avatar && (
              <p className="text-xs text-rose-600">{errors.avatar.message}</p>
            )}
          </div>

          {/* Full Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="John Doe"
              {...register("name", {
                required: "Full name is required",
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters",
                },
                maxLength: {
                  value: 50,
                  message: "Name cannot exceed 50 characters",
                },
              })}
              className="mt-1.5 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-rose-600">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Please enter a valid email address",
                },
              })}
              className="mt-1.5 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-rose-600">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700">
              Password
            </label>
            <div className="relative mt-1.5">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                  validate: {
                    hasUpper: (val) =>
                      /[A-Z]/.test(val) || "Must contain at least one uppercase letter",
                    hasLower: (val) =>
                      /[a-z]/.test(val) || "Must contain at least one lowercase letter",
                    hasNumber: (val) =>
                      /[0-9]/.test(val) || "Must contain at least one number",
                    hasSpecial: (val) =>
                      /[^A-Za-z0-9]/.test(val) || "Must contain at least one special character",
                  },
                })}
                className="block w-full rounded-lg border border-slate-300 px-3 py-2 pr-10 text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-rose-600">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700">
              Confirm Password
            </label>
            <div className="relative mt-1.5">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (val) =>
                    val === watchedPassword || "Passwords do not match",
                })}
                className="block w-full rounded-lg border border-slate-300 px-3 py-2 pr-10 text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-rose-600">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Terms and Conditions */}
          <div>
            <div className="flex items-start">
              <input
                id="terms"
                type="checkbox"
                {...register("terms", {
                  required: "You must accept the terms and conditions",
                })}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="terms" className="ml-2 text-sm text-slate-600">
                I agree to the{" "}
                <Link href="/terms" className="font-medium text-indigo-600 hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="font-medium text-indigo-600 hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>
            {errors.terms && (
              <p className="mt-1 text-xs text-rose-600">{errors.terms.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Registering...
              </>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}