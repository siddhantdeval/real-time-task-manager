"use client";

import React, { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { forgotPasswordAction, ForgotPasswordActionState } from "@/app/actions/auth.actions";
export function ForgotPasswordForm() {
  const [state, formAction, isPending] = useActionState<ForgotPasswordActionState, FormData>(
    forgotPasswordAction,
    {
      email: "",
      redirectPath: "/login",
    },
  );

  if (state?.success) {
    return (
      <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm">
        <p className="font-semibold mb-1">Check your email</p>
        <p>
          If an account with that email exists, we've sent a password reset link. It expires in 1
          hour.
        </p>
        <a
          href="/login"
          className="mt-4 inline-block text-sm font-medium text-violet-600 hover:text-violet-700"
        >
          ← Back to Sign in
        </a>
      </div>
    );
  }

  return (
    <form className="space-y-6" action={formAction}>
      {state?.error && (
        <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
          {state.error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email address</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="name@company.com"
          autoComplete="email"
          className={state?.fieldErrors?.email ? "border-red-500 focus-visible:ring-red-500" : ""}
          required
        />
        {state?.fieldErrors?.email && (
          <p className="text-xs text-red-500 mt-1">{state.fieldErrors.email[0]}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Sending..." : "Send Reset Link"}
      </Button>

      <div className="text-center">
        <a href="/login" className="text-sm text-slate-500 hover:text-slate-700">
          ← Back to Sign in
        </a>
      </div>
    </form>
  );
}
