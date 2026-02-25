"use client";

import React, { useActionState, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resetPasswordAction, ResetPasswordActionState } from "@/app/actions/auth";

interface ResetPasswordFormProps {
  token: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [state, formAction, isPending] = useActionState<ResetPasswordActionState, FormData>(
    resetPasswordAction,
    {
        password: "",
        confirmPassword: "",
        redirectPath: "/login",
        token: ""
    },
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  if (state?.success) {
    return (
      <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm">
        <p className="font-semibold mb-1">Password reset successfully!</p>
        <p>You can now sign in with your new password.</p>
        <a
          href="/login"
          className="mt-4 inline-block text-sm font-medium text-violet-600 hover:text-violet-700"
        >
          Sign in →
        </a>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
        <p className="font-semibold">Invalid reset link</p>
        <p className="mt-1">
          This link is missing a reset token. Please use the link from your email.
        </p>
        <a
          href="/forgot-password"
          className="mt-4 inline-block text-sm font-medium text-violet-600 hover:text-violet-700"
        >
          Request a new reset link
        </a>
      </div>
    );
  }

  return (
    <form className="space-y-6" action={formAction}>
      {/* Pass token as a hidden field to the server action */}
      <input type="hidden" name="token" value={token} />

      {state?.error && (
        <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
          {state.error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="password">New Password</Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
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
        <Label htmlFor="confirmPassword">Confirm New Password</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
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

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Resetting..." : "Reset Password"}
      </Button>

      <div className="text-center">
        <a href="/login" className="text-sm text-slate-500 hover:text-slate-700">
          ← Back to Sign in
        </a>
      </div>
    </form>
  );
}
