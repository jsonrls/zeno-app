"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AtSign, Lock, Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth";
import SecureForm from "@/components/SecureForm";
import { RATE_LIMITS } from "@/lib/security";
import { validatePassword } from "@/lib/passwordValidation";
import {
  sanitizeEmail,
  sanitizeInput,
  sanitizePassword,
  sanitizeUsername,
} from "@/lib/inputSanitization";

export default function Login() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Password validation (simpler for login - just show strength)
  const passwordValidation = useMemo(() => validatePassword(formData.password), [formData.password]);

  // Auto-dismiss error messages after 1 second
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let sanitizedValue = value;

    // Apply appropriate sanitization based on field type
    if (name === 'identifier') {
      // Preserve valid email characters while the address is still being
      // entered (for example, the dot in `name.surname` before `@`).
      sanitizedValue = sanitizeInput(value, { maxLength: 254, trim: false });
    } else if (name === 'password') {
      sanitizedValue = sanitizePassword(value);
    }

    setFormData(prev => ({
      ...prev,
      [name]: sanitizedValue
    }));
  };

  const handleSecureSubmit = async (formData: FormData, csrfToken: string) => {
    setIsLoading(true);
    setError("");

    const identifier = (formData.get('identifier') as string).includes('@')
      ? sanitizeEmail(formData.get('identifier') as string)
      : sanitizeUsername(formData.get('identifier') as string);
    const password = sanitizePassword(formData.get('password') as string);

    const { data, error } = await signIn(identifier, password);

    if (error) {
      setError(error.message || "Failed to sign in");
      throw new Error(error.message || "Failed to sign in");
    } else {
      router.push("/dashboard");
    }

    setIsLoading(false);
  };

  return (
    <div className="auth-page min-h-screen px-4 py-12 sm:py-16">
      <div className="relative mx-auto grid w-full max-w-5xl overflow-hidden border border-ink/20 bg-[#fffcf5] shadow-[6px_6px_0_rgba(36,26,53,0.12)] lg:grid-cols-[0.9fr_1.1fr]">
        <aside className="auth-page__aside hidden p-10 lg:flex lg:flex-col lg:justify-between">
          <Link href="/" className="font-serif text-2xl font-semibold text-paper">Zeno.</Link>
          <div>
            <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.24em] text-marker">Member desk · No. 01</p>
            <p className="font-serif text-4xl leading-tight text-paper">Better work begins with the right people.</p>
          </div>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-paper/60">Study together · Learn deliberately</p>
        </aside>
        <div className="p-6 sm:p-10 lg:p-12">
        {/* Header */}
        <div className="mb-9">
          <Link href="/" className="mb-8 inline-block font-serif text-xl font-semibold text-ink lg:hidden">Zeno.</Link>
          <p className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-purple-700">Return to your desk</p>
          <h1 className="font-serif text-4xl font-medium tracking-tight text-ink sm:text-5xl">Welcome back.</h1>
          <p className="mt-3 leading-relaxed text-ink-soft">
            Sign in to your Zeno account and continue your learning journey
          </p>
        </div>

        {/* Login Form */}
        <SecureForm
          onSubmit={handleSecureSubmit}
          rateLimitConfig={RATE_LIMITS.LOGIN}
          rateLimitIdentifier={formData.identifier || 'anonymous'}
          className="catalog-form space-y-6"
          disabled={isLoading}
        >
          {/* Email or username field */}
          <div className="space-y-2">
            <label htmlFor="identifier" className="block text-sm font-medium text-gray-700">
              Email or Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <AtSign className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="identifier"
                name="identifier"
                type="text"
                required
                autoCapitalize="none"
                autoCorrect="off"
                autoComplete="username"
                value={formData.identifier}
                onChange={handleInputChange}
                className="pl-10 h-12"
                placeholder="Enter your email or username"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2 mt-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={handleInputChange}
                className={`pl-10 pr-12 h-12 ${
                  formData.password && passwordValidation.strength === 'weak'
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : formData.password && passwordValidation.strength === 'strong'
                    ? 'border-purple-300 focus:border-purple-500 focus:ring-purple-500'
                    : formData.password && passwordValidation.strength === 'medium'
                    ? 'border-yellow-300 focus:border-yellow-500 focus:ring-yellow-500'
                    : ''
                }`}
                placeholder="Enter your password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link href="/forgot-password" className="font-medium text-purple-600 hover:text-purple-500">
                Forgot your password?
              </Link>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            size="lg"
            disabled={isLoading}
            className="group mt-4 h-12 w-full rounded-sm shadow-[0.25rem_0.25rem_0_0_#241a35] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[0.1rem_0.1rem_0_0_#241a35]"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                Sign in <ArrowRight className="transition-transform group-hover:translate-x-1" />
              </>
            )}
          </Button>
        </SecureForm>

        {/* Sign Up Link */}
        <div className="mt-8 border-t border-dashed border-ink/20 pt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link href="/signup" className="font-medium text-purple-600 hover:text-purple-500">
              Sign up for free
            </Link>
          </p>
        </div>

        </div>
      </div>
    </div>
  );
}
