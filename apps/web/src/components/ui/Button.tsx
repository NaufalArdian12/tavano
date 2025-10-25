// src/components/ui/Button.tsx
import React from "react";
export function Button({
  children, loading, className, ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }) {
  return (
    <button
      {...rest}
      disabled={rest.disabled || loading}
      className={`w-full py-3 rounded-xl font-semibold text-white transition
      ${loading ? "bg-black/50 cursor-not-allowed" : "bg-black hover:bg-black/90"} ${className||""}`}
    >
      {loading ? "Memproses…" : children}
    </button>
  );
}
