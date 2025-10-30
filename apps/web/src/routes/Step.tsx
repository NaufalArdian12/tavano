import { Link, useNavigate, useParams } from "react-router-dom";
// TODO: import VideoPlayer jika ada

export default function Step() {
  const nav = useNavigate();
  const { slug, n } = useParams();
  const stepNum = Number(n ?? 1);

  // TODO: fetch step content (video url + hint) dari Supabase

  const next = () => {
    // contoh: setelah step 3, pindah ke quiz dengan id tertentu
    if (stepNum >= 3) nav(`/quiz/demo-quiz-id`);
    else nav(`/topic/${slug}/step/${stepNum + 1}`);
  };

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-xl font-semibold">Step {stepNum}</h1>

      <div className="aspect-video bg-gray-100 rounded-xl flex items-center justify-center">
        {/* <VideoPlayer src={videoUrl} /> */}
        <p className="text-gray-500">[ Video Placeholder ]</p>
      </div>

      <p className="text-sm text-gray-700">
        Hint: Bayangkan pizza dibagi menjadi beberapa bagian.
      </p>

      <div className="flex gap-2">
        <Link to={`/topic/${slug}`} className="px-3 py-2 rounded border">
          Kembali
        </Link>
        <button
          onClick={next}
          className="px-3 py-2 rounded bg-black text-white"
        >
          Lanjut
        </button>
      </div>
    </main>
  );
}
