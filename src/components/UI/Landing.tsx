"use client";

import Link from "next/link";
import {
  Leaf,
  Sparkles,
  Users,
  Camera,
  TrendingUp,
  MessageSquare,
  ArrowRight,
  Flower2,
  Carrot,
  TreePine,
} from "lucide-react";
import Footer from "@/src/components/UI/Footer";

const features = [
  {
    icon: <Camera className="w-6 h-6" />,
    title: "AI Plant Doctor",
    desc: "Snap a photo to identify any plant or diagnose disease in seconds.",
    color: "from-green-500 to-emerald-600",
    badge: "NEW",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Grow Your Community",
    desc: "Follow gardeners worldwide and swap tips with people who get it.",
    color: "from-teal-500 to-cyan-600",
  },
  {
    icon: <MessageSquare className="w-6 h-6" />,
    title: "Share Your Garden",
    desc: "Post photos, write guides, and inspire others with your harvest.",
    color: "from-amber-500 to-orange-600",
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: "Trending Tips",
    desc: "Discover what's growing — seasonal trends, hashtags, and expert advice.",
    color: "from-pink-500 to-rose-600",
  },
];

const categories = [
  { name: "Herbs", icon: <Leaf className="w-4 h-4" /> },
  { name: "Vegetables", icon: <Carrot className="w-4 h-4" /> },
  { name: "Flowers", icon: <Flower2 className="w-4 h-4" /> },
  { name: "Indoor", icon: <TreePine className="w-4 h-4" /> },
];

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen">
      <main className="w-full">
        {/* Hero */}
        <section className="relative overflow-hidden">
          {/* Decorative blobs */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-green-300/30 dark:bg-green-500/10 rounded-full blur-3xl" />
          <div className="absolute top-20 -right-32 w-96 h-96 bg-emerald-300/30 dark:bg-emerald-500/10 rounded-full blur-3xl" />

          <div className="max-w-screen-xl mx-auto px-4 pt-12 pb-20 sm:pt-20 sm:pb-28 relative">
            <div className="flex flex-col items-center text-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm font-medium mb-6 border border-green-200/60 dark:border-green-800/60">
                <Sparkles className="w-4 h-4" />
                Now with AI Plant Doctor
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white max-w-4xl leading-[1.05]">
                Where gardeners{" "}
                <span className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
                  grow together
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-lg sm:text-xl text-gray-600 dark:text-gray-300">
                Share tips, swap seeds, diagnose plants with AI, and connect
                with a worldwide community rooted in growing things.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Link href="/register" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 hover:scale-[1.02] transition-all duration-200">
                    Create your account
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
                <Link href="/login" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    Sign in
                  </button>
                </Link>
              </div>

              {/* Category pills */}
              <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
                <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">
                  Explore:
                </span>
                {categories.map((c) => (
                  <div
                    key={c.name}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300"
                  >
                    {c.icon}
                    {c.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="max-w-screen-xl mx-auto px-4 py-12 sm:py-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
              Everything your garden needs
            </h2>
            <p className="mt-3 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              From identifying mystery weeds to building your following — LeafLink
              is the social home for green thumbs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="group relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
              >
                {f.badge && (
                  <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-300 text-amber-900">
                    {f.badge}
                  </span>
                )}
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} text-white mb-4 shadow-md`}
                >
                  {f.icon}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {f.title}
                </h3>
                <p className="mt-1.5 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA card */}
        <section className="max-w-screen-xl mx-auto px-4 pb-16">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-500 via-emerald-600 to-teal-600 p-8 sm:p-12 text-white">
            <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full -translate-y-1/3 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-56 h-56 bg-white/10 rounded-full translate-y-1/3 -translate-x-1/3" />
            <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 mb-3">
                  <Leaf className="w-5 h-5" />
                  <span className="text-sm font-semibold uppercase tracking-wider text-white/90">
                    LeafLink
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold max-w-xl">
                  Ready to dig in? Join thousands of gardeners growing together.
                </h3>
              </div>
              <Link href="/register">
                <button className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-green-700 font-semibold shadow-lg hover:bg-white/90 transition-colors whitespace-nowrap">
                  Get started — it&apos;s free
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Landing;
