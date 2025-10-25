import { Zap, Trophy, TrendingUp, Sparkles, LogOut } from "lucide-react";
import { sb } from "../lib/supabase"; // Import Supabase Client

export default function Dashboard() {
  // TODO: fetch user_progress + user_stickers
  
  // Placeholder Data
  const userProgress = {
    topicsCompleted: 3,
    quizScore: 85,
    lastActivity: "1 jam yang lalu",
    level: "Novice Fractioner",
    stepsRemaining: 7,
  };
  
  const userStickers = [
    { name: "Pecahan Dasar", icon: "🍰", description: "Selesaikan Step 1" },
    { name: "Master Penjumlahan", icon: "➕", description: "Dapatkan skor A di Kuis 2" },
    { name: "The Explorer", icon: "🗺️", description: "Kunjungi 3 Topik" },
    { name: "Early Bird", icon: "☀️", description: "Login 3 hari berturut-turut" },
  ];

  const handleLogout = async () => {
    try {
      await sb.auth.signOut();
      // AuthRedirect atau AppLayout akan menangani navigasi ke halaman login setelah token hilang
    } catch (error) {
      console.error("Gagal Logout:", error);
    }
  };

  return (
    <main className="max-w-5xl mx-auto p-8 md:p-12 space-y-8">
      
      {/* Header Dashboard */}
      <div className="flex justify-between items-center border-b pb-4">
        <div className="flex items-center space-x-4">
          <Trophy className="w-10 h-10 text-indigo-500 fill-indigo-100" />
          <h1 className="text-3xl font-extrabold text-gray-900">
            Ringkasan Dashboard
          </h1>
        </div>
        
        {/* Tombol Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition duration-150 shadow-md"
          aria-label="Logout"
        >
          <LogOut className="w-5 h-5" />
          <span>Keluar</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* === PROGRESS SUMMARY (Main Column) === */}
        <section className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
            <TrendingUp className="w-6 h-6 text-teal-600" />
            <span>Progres Belajar</span>
          </h2>

          <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 space-y-4">
            
            {/* Level Card */}
            <div className="bg-indigo-600 text-white p-5 rounded-xl shadow-lg flex justify-between items-center">
              <div>
                <p className="text-sm font-medium opacity-80">Level Anda Saat Ini:</p>
                <p className="text-2xl font-extrabold">{userProgress.level}</p>
              </div>
              <Zap className="w-8 h-8 opacity-70" />
            </div>

            {/* Key Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
              {[
                { label: "Topik Selesai", value: userProgress.topicsCompleted, unit: "Topik", icon: "📚" },
                { label: "Skor Kuis Rata-Rata", value: userProgress.quizScore, unit: "%", icon: "💯" },
                { label: "Langkah Tersisa", value: userProgress.stepsRemaining, unit: "Langkah", icon: "🚶" },
                { label: "Aktivitas Terakhir", value: userProgress.lastActivity, unit: "", icon: "⌚" },
              ].map((stat, index) => (
                <div key={index} className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-center shadow-sm">
                  <div className="text-2xl">{stat.icon}</div>
                  <div className="text-lg font-bold text-gray-800 mt-1">
                    {stat.value}
                    {stat.unit && <span className="text-sm font-medium ml-1">{stat.unit}</span>}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* === STICKER COLLECTION (Sidebar Column) === */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
            <Sparkles className="w-6 h-6 text-yellow-500" />
            <span>Koleksi Stiker</span>
          </h2>
          
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
            <p className="text-sm text-gray-500 mb-4">Kumpulkan stiker dengan menyelesaikan tugas dan kuis!</p>
            
            <div className="grid grid-cols-2 gap-4">
              {userStickers.map((sticker, index) => (
                <div key={index} className="text-center p-3 bg-teal-50 border border-teal-200 rounded-lg shadow-md hover:bg-teal-100 transition duration-150 transform hover:scale-105">
                  <div className="text-3xl mb-1">{sticker.icon}</div>
                  <p className="font-semibold text-gray-800 text-sm">{sticker.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{sticker.description}</p>
                </div>
              ))}
            </div>
            
            {userStickers.length === 0 && (
              <div className="p-4 bg-gray-50 rounded-lg text-center text-gray-500">
                Kumpulkan stiker pertama Anda hari ini 🎉
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
