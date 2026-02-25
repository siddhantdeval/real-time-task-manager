"use server";

import { cookies } from "next/headers";
import setCookie from "set-cookie-parser";
import { z } from "zod";
import { getSessionCookieName } from "@/lib/utils";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";

// Shared function to handle backend responses and extract the session cookie
async function addBackEndCookies(response: Response) {
  const data = await response.json();
  if (!response.ok) {
    return {
      error: data.error?.message || "An error occurred during authentication.",
    };
  }

  // Extract Set-Cookie header from Node.js backend
  const setCookieHeader = response.headers.get("set-cookie");

  if (setCookieHeader) {
    const parsedCookies = setCookie.parse(setCookieHeader);

    // Find our specific session cookie
    const sessionCookieName = getSessionCookieName();
    const sessionCookie = parsedCookies.find((c) => c.name === sessionCookieName);

    if (sessionCookie) {
      const cookieStore = await cookies();
      cookieStore.set(sessionCookie.name, sessionCookie.value, {
        httpOnly: sessionCookie.httpOnly,
        secure: sessionCookie.secure,
        sameSite: sessionCookie.sameSite as "strict" | "lax" | "none" | undefined,
        path: sessionCookie.path || "/",
        maxAge: sessionCookie.maxAge,
        domain: sessionCookie.domain,
        expires: sessionCookie.expires,
      });
    }
  }
}

// --- LOGIN ---
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address").min(1, "Please enter your email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginActionState = {
  error?: string;
  fieldErrors?: {
    email?: string[];
    password?: string[];
  };
  redirectPath?: string;
  email: string;
  password: string;
};

export async function loginAction(
  prevState: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> {
  let isRedirect = false;
  const currentState = {
    ...prevState,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  // 1. Validate on the server side
  const validatedFields = loginSchema.safeParse(currentState);

  if (!validatedFields.success) {
    return {
      ...currentState,
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // 2. Fetch from your backend BFF
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validatedFields.data),
    });
    await addBackEndCookies(response);
    isRedirect = true;
    return { ...currentState, email: "", password: "" };
  } catch (error) {
    console.error("Login Action Error:", error);
    return { ...currentState, error: "Failed to connect to the server. Please try again later." };
  } finally {
    if (isRedirect) redirect(currentState.redirectPath || "/projects");
  }
}

// --- SIGNUP ---
const signupSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type SignupActionState = {
  error?: string;
  fieldErrors?: {
    name?: string[];
    email?: string[];
    password?: string[];
    confirmPassword?: string[];
  };
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  redirectPath?: string;
};

export async function signupAction(
  prevState: SignupActionState,
  formData: FormData,
): Promise<SignupActionState> {
  let isRedirect = false;
  const currentState = {
    ...prevState,
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  };
  const validatedFields = signupSchema.safeParse(currentState);

  if (!validatedFields.success) {
    return {
      ...currentState,
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // 1. Register the user
  try {
    const registerResponse = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: validatedFields.data.name,
        email: validatedFields.data.email,
        password: validatedFields.data.password,
      }),
    });

    if (!registerResponse.ok) {
      const data = await registerResponse.json();
      return { ...currentState, error: data.error?.message || "Failed to create account." };
    }

    // 2. Auto-login after successful registration
    const loginResponse = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: validatedFields.data.email,
        password: validatedFields.data.password,
      }),
    });

    await addBackEndCookies(loginResponse);
    isRedirect = true;
    return { ...currentState, email: "", password: "", confirmPassword: "" };
  } catch (error) {
    console.error("Signup Action Error:", error);
    return { ...currentState, error: "Failed to connect to the server. Please try again." };
  } finally {
    if (isRedirect) redirect(currentState.redirectPath || "/projects");
  }
}

// --- FORGOT PASSWORD ---
const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address").min(1, "Please enter your email"),
});

export type ForgotPasswordActionState = {
  success?: boolean;
  error?: string;
  fieldErrors?: {
    email?: string[];
  };
  email: string;
  redirectPath?: string;
};

export async function forgotPasswordAction(
  prevState: ForgotPasswordActionState,
  formData: FormData,
): Promise<ForgotPasswordActionState> {
  let isRedirect = false;
  const currentState = {
    ...prevState,
    email: formData.get("email") as string,
  };

  const validatedFields = forgotPasswordSchema.safeParse(currentState);

  if (!validatedFields.success) {
    return {
      ...currentState,
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const response = await fetch(`${API_URL}/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: validatedFields.data.email }),
    });

    if (!response.ok) {
      const data = await response.json();
      return {
        ...currentState,
        error: data.error?.message || "Failed to request password reset. Please try again.",
      };
    }

    return { ...currentState, success: true };
  } catch (error) {
    console.error("Forgot Password Action Error:", error);
    return { ...currentState, error: "Failed to connect to the server. Please try again later." };
  } finally {
    if (isRedirect) redirect(currentState.redirectPath || "/login");
  }
}

// --- RESET PASSWORD ---
const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Reset token is missing"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type ResetPasswordActionState = {
  success?: boolean;
  error?: string;
  fieldErrors?: {
    token?: string[];
    password?: string[];
    confirmPassword?: string[];
  };
  token: string;
  password: string;
  confirmPassword: string;
  redirectPath?: string;
};

export async function resetPasswordAction(
  prevState: ResetPasswordActionState,
  formData: FormData,
): Promise<ResetPasswordActionState> {
  let isRedirect = false;
  const currentState = {
    ...prevState,
    token: formData.get("token") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
    redirectPath: formData.get("redirectPath") as string,
  };

  const validatedFields = resetPasswordSchema.safeParse(currentState);

  if (!validatedFields.success) {
    return {
      ...currentState,
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const response = await fetch(`${API_URL}/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: validatedFields.data.token,
        password: validatedFields.data.password,
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      return {
        ...prevState,
        error:
          data.error?.message ||
          "Failed to reset password. Please try again or request a new link.",
      };
    }

    isRedirect = true;
    return { ...currentState, password: "", confirmPassword: "" };
  } catch (error) {
    console.error("Reset Password Action Error:", error);
    return { ...currentState, error: "Failed to connect to the server. Please try again later." };
  } finally {
    if (isRedirect) redirect(currentState.redirectPath || "/login");
  }
}

// --- LOGOUT ---
export async function logoutAction() {
  const cookieStore = await cookies();
  const sessionCookieName = getSessionCookieName();

  // We can let the backend know, but strictly speaking clearing the Next.js cookie is enough.
  try {
    const sessionId = cookieStore.get(sessionCookieName)?.value;
    if (sessionId) {
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        headers: {
          Cookie: `${sessionCookieName}=${sessionId}`,
        },
      });
    }
  } catch (error) {
    console.error("Logout API failed, continuing client logout", error);
  }

  // Clear cookie from Next.js proxy
  cookieStore.delete(sessionCookieName);

  redirect("/login");
}
