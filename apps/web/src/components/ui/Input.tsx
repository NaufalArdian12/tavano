import React from "react";
type Props = React.InputHTMLAttributes<HTMLInputElement> & { label?: string };
export function Input({ label, ...rest }: Props) {
  return (
    <label className="block space-y-1">
      {label && <span className="text-sm text-gray-700">{label}</span>}
      <input
        className="w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-black/10 placeholder:text-gray-400"
        {...rest}
      />
    </label>
  );
}
