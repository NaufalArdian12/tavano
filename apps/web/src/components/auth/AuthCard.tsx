// src/components/auth/AuthCard.tsx
export default function AuthCard({ title, subtitle, children }: {
  title: string; subtitle?: string; children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-white to-gray-50 p-4">
      <div className="w-full max-w-md bg-white/90 backdrop-blur border border-gray-100 shadow-xl rounded-2xl p-8">
        <div className="text-center mb-8 space-y-1">
          <h1 className="text-2xl font-extrabold tracking-tight">{title}</h1>
          {subtitle && <p className="text-gray-500 text-sm">{subtitle}</p>}
        </div>
        {children}
        <p className="text-[11px] text-gray-400 text-center mt-6">
          Dengan masuk, kamu menyetujui ketentuan & kebijakan kami.
        </p>
      </div>
    </div>
  );
}
