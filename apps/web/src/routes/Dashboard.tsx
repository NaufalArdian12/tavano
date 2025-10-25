export default function Dashboard() {
  // TODO: fetch user_progress + user_stickers
  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <section>
        <h2 className="text-lg font-semibold">Progress</h2>
        <div className="p-4 border rounded-xl">Belum ada data progress.</div>
      </section>
      <section>
        <h2 className="text-lg font-semibold">Sticker</h2>
        <div className="p-4 border rounded-xl">Kumpulkan sticker dengan menyelesaikan kuis 🎉</div>
      </section>
    </main>
  );
}
