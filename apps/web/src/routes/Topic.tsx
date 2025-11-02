import { Link, useParams } from "react-router-dom";
import { Sparkles, ArrowRight } from "lucide-react";
import AnswerCardWithSteps from "../components/quiz/AnsweredCardWithSteps";

export default function Topic() {
  const { slug } = useParams();
  const steps = [
    { n: 1, title: "Pengenalan Dasar Pecahan" },
    { n: 2, title: "Penjumlahan dan Pengurangan Pecahan" },
    { n: 3, title: "Perkalian dan Pembagian Pecahan" },
    { n: 4, title: "Latihan Ulang dan Review" },
  ];

  const formattedSlug =
    slug
      ?.split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ") || "Topik";

  return (
    <main className="max-w-4xl mx-auto p-8 md:p-12 space-y-8 bg-white/90 shadow-2xl rounded-xl">
      {/* Header Area */}
      <div className="flex items-center space-x-3 border-b pb-4 border-indigo-100">
        <Sparkles className="w-8 h-8 text-yellow-500 fill-yellow-200" />
        <h1 className="text-3xl font-extrabold text-gray-800">
          Topik: {formattedSlug}
        </h1>
      </div>

      {/* List Steps */}
      <section className="space-y-4">
        <p className="text-gray-600 text-lg font-medium">
          Pilih langkah belajar Anda:
        </p>

        <ul className="space-y-4">
          {steps.map((step) => (
            <li
              key={step.n}
              className="p-4 md:p-5 bg-indigo-50 border border-indigo-200 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.01] flex flex-col md:flex-row items-start md:items-center justify-between"
            >
              <div className="flex items-center space-x-4 mb-3 md:mb-0">
                <span className="text-xl font-bold text-white bg-indigo-500 rounded-full w-8 h-8 flex items-center justify-center shrink-0 shadow-md">
                  {step.n}
                </span>
                <span className="text-lg font-semibold text-gray-800">
                  {step.title}
                </span>
              </div>

              <Link
                className="px-5 py-2 rounded-full font-bold text-white bg-teal-500 hover:bg-teal-600 transition duration-200 ease-in-out shadow-md hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-teal-200 flex items-center space-x-2 w-full md:w-auto justify-center md:justify-start"
                to={`/topic/${slug}/step/${step.n}`}
              >
                <span>Mulai Belajar</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </li>
          ))}
        </ul>
            <AnswerCardWithSteps quizId={"QUIZ_ID_TEST"} />
      </section>

      {/* Footer Link */}
      <div className="pt-6 border-t border-gray-100 text-center">
        <Link
          to="/dashboard"
          className="text-indigo-600 hover:text-indigo-800 font-semibold transition duration-150 text-base flex items-center justify-center space-x-1"
        >
          <span>Lihat Dashboard & Progress Saya</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </main>
  );
}
