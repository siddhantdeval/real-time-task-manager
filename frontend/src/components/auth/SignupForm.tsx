"use client";

import React, { useActionState, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signupAction, SignupActionState } from "@/app/actions/auth.actions";

export function SignupForm() {
  const [state, formAction, isPending] = useActionState<SignupActionState, FormData>(signupAction, {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <form className="space-y-5" action={formAction}>
      {state?.error && (
        <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
          {state.error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          name="name"
          defaultValue={state.name}
          placeholder="Jane Doe"
          autoComplete="name"
          className={state?.fieldErrors?.name ? "border-red-500 focus-visible:ring-red-500" : ""}
          required
        />
        {state?.fieldErrors?.name && (
          <p className="text-xs text-red-500 mt-1">{state.fieldErrors.name[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          defaultValue={state.email}
          placeholder="name@company.com"
          autoComplete="email"
          className={state?.fieldErrors?.email ? "border-red-500 focus-visible:ring-red-500" : ""}
          required
        />
        {state?.fieldErrors?.email && (
          <p className="text-xs text-red-500 mt-1">{state.fieldErrors.email[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            defaultValue={state.password}
            placeholder="••••••••"
            autoComplete="new-password"
            className={
              state?.fieldErrors?.password
                ? "border-red-500 focus-visible:ring-red-500 pr-10"
                : "pr-10"
            }
            minLength={6}
            required
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

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            defaultValue={state.confirmPassword}
            placeholder="••••••••"
            autoComplete="new-password"
            className={
              state?.fieldErrors?.confirmPassword
                ? "border-red-500 focus-visible:ring-red-500 pr-10"
                : "pr-10"
            }
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-colors"
          >
            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {state?.fieldErrors?.confirmPassword && (
          <p className="text-xs text-red-500 mt-1">{state.fieldErrors.confirmPassword[0]}</p>
        )}
      </div>

      <Button type="submit" className="w-full mt-2" disabled={isPending}>
        {isPending ? "Creating account..." : "Create Account"}
      </Button>

      <div className="text-center text-sm text-slate-500 pt-4 border-t border-slate-200 mt-6">
        Already have an account?{" "}
        <a href="/login" className="text-violet-600 hover:text-violet-700 font-medium">
          Sign in
        </a>
      </div>
    </form>
  );
}
