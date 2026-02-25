"use client";

import { useActionState, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAction, LoginActionState } from "@/app/actions/auth";

export function LoginForm() {
  const [state, formAction, isPending] = useActionState<LoginActionState, FormData>(loginAction, {
    email: "",
    password: "",
    redirectPath: "/projects",
  });
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form className="space-y-6" action={formAction}>
      {state?.error && (
        <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
          {state.error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="name@company.com"
          autoComplete="email"
          className={state?.fieldErrors?.email ? "border-red-500 focus-visible:ring-red-500" : ""}
          required
          defaultValue={state.email}
        />
        {state?.fieldErrors?.email && (
          <p className="text-xs text-red-500 mt-1">{state.fieldErrors.email[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <a
            href="/forgot-password"
            className="text-sm text-violet-600 hover:text-violet-700 font-medium"
          >
            Forgot password?
          </a>
        </div>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            autoComplete="current-password"
            className={
              state?.fieldErrors?.password ? "border-red-500 focus-visible:ring-red-500 pr-10" : "pr-10"
            }
            minLength={6}
            required
            defaultValue={state.password}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-colors"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {state?.fieldErrors?.password && (
          <p className="text-xs text-red-500 mt-1">{state.fieldErrors.password[0]}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Signing in..." : "Sign In"}
      </Button>

      <div className="text-center text-sm text-slate-500 pt-4 border-t border-slate-200 mt-6">
        Don't have an account?{" "}
        <a href="/signup" className="text-violet-600 hover:text-violet-700 font-medium">
          Sign up for free
        </a>
      </div>
    </form>
  );
}
