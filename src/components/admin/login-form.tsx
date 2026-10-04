"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/actions/auth";
import { btnPrimary, card, inputClass, labelClass } from "./ui";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});
  return (
    <form action={action} className={`${card} space-y-4`}>
      <label className={labelClass}>
        Email
        <input name="email" type="email" required autoComplete="username" autoFocus className={inputClass} />
      </label>
      <label className={labelClass}>
        Password
        <input name="password" type="password" required autoComplete="current-password" className={inputClass} />
      </label>
      {state.error && (
        <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {state.error}
        </p>
      )}
      <button type="submit" disabled={pending} className={`${btnPrimary} w-full`}>
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
