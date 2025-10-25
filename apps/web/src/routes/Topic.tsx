import { Link, useParams } from "react-router-dom";

export default function Topic() {
  const { slug } = useParams();
  // TODO: fetch steps by slug (Supabase)
  const steps = [1,2,3]; // placeholder

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-xl font-semibold">Topik: {slug}</h1>
      <ul className="space-y-2">
        {steps.map((n)=>(
          <li key={n} className="p-3 border rounded-lg flex items-center justify-between">
            <span>Step {n}</span>
            <Link className="px-3 py-1 rounded bg-black text-white" to={`/topic/${slug}/step/${n}`}>Mulai</Link>
          </li>
        ))}
      </ul>
      <div className="pt-6">
        <Link to="/dashboard" className="underline text-sm">Lihat Dashboard</Link>
      </div>
    </main>
  );
}
