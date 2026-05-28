"use client";

import Link from "next/link";
import {
  Sprout,
  Eye,
  BookOpen,
  Users,
  PenLine,
  Crown,
  Layout,
  Heart,
  ArrowRight,
  Leaf,
  Sparkles,
} from "lucide-react";

const offerings = [
  {
    icon: <BookOpen className="w-5 h-5" />,
    title: "Expert Tips & Guides",
    desc: "An always-growing library of plant-care tips, seasonal advice, and how-tos.",
    image:
      "https://res.cloudinary.com/dwelabpll/image/upload/v1728055736/1620319892_kfgw3v.png",
    tone: "from-green-500 to-emerald-500",
  },
  {
    icon: <Users className="w-5 h-5" />,
    title: "Interactive Community",
    desc: "Follow growers near you, swap photos, and learn from gardeners worldwide.",
    image:
      "https://res.cloudinary.com/dwelabpll/image/upload/v1728055810/1605885676857_lpchdt.jpg",
    tone: "from-emerald-500 to-teal-500",
  },
  {
    icon: <PenLine className="w-5 h-5" />,
    title: "Rich Content Creation",
    desc: "A powerful editor to write tips, attach photos, and format like a pro.",
    image:
      "https://res.cloudinary.com/dwelabpll/image/upload/v1728055874/1621875021927_bmw9t9.jpg",
    tone: "from-teal-500 to-cyan-500",
  },
  {
    icon: <Crown className="w-5 h-5" />,
    title: "Premium Content",
    desc: "Unlock deep-dive guides and verified-expert posts with a Premium plan.",
    image:
      "https://res.cloudinary.com/dwelabpll/image/upload/v1728055967/What-is-Premium-Content-1_z3bmoz.jpg",
    tone: "from-amber-500 to-orange-500",
  },
  {
    icon: <Layout className="w-5 h-5" />,
    title: "Modern Interface",
    desc: "A fast, responsive UI that works the same way on your phone and laptop.",
    image:
      "https://res.cloudinary.com/dwelabpll/image/upload/v1728056034/user-interface-development-team-design-discussions-thumbnail_mq67dl.webp",
    tone: "from-sky-500 to-indigo-500",
  },
  {
    icon: <Sparkles className="w-5 h-5" />,
    title: "AI Plant Doctor",
    desc: "Identify plants and diagnose diseases from a photo — our 2026 feature.",
    image:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600",
    tone: "from-green-500 to-emerald-600",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-teal-500/10 dark:from-green-900/20 dark:via-emerald-900/10 dark:to-teal-900/20" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-green-400/20 dark:bg-green-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-400/20 dark:bg-emerald-500/10 rounded-full blur-3xl" />

        <div className="relative container mx-auto px-4 py-16 max-w-5xl">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-green-200/50 dark:border-green-700/50 rounded-full text-xs font-semibold text-green-700 dark:text-green-300">
              <Leaf className="w-3.5 h-3.5" />
              About LeafLink
            </span>
          </div>
          <h1 className="text-center text-4xl md:text-5xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
              A community for people who love growing things.
            </span>
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-300 mt-4 max-w-2xl mx-auto text-lg leading-relaxed">
            LeafLink turns gardening from a quiet, solo hobby into a shared craft.
            Share your tips, follow growers you trust, and get practical answers when
            something in your garden isn&apos;t cooperating.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold bg-gradient-to-r from-green-500 to-emerald-600 shadow-md hover:shadow-lg hover:from-green-600 hover:to-emerald-700 transition-all"
            >
              Join the community
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/ai-garden"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-green-700 dark:text-green-300 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-green-200/50 dark:border-green-700/50 hover:bg-white dark:hover:bg-gray-800 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              Try AI Plant Doctor
            </Link>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 pb-16 max-w-5xl">
        {/* Mission + Vision */}
        <section className="grid md:grid-cols-2 gap-5 -mt-2">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-200/60 dark:border-gray-700/60 shadow-sm p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-md shadow-green-500/30">
                <Sprout className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Our Mission</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Make gardening less lonely and less intimidating. Whether you have a
              balcony pot or an acre out back, you should be able to find advice that
              actually fits your situation — from someone who&apos;s done it before.
            </p>
          </div>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-200/60 dark:border-gray-700/60 shadow-sm p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl shadow-md shadow-teal-500/30">
                <Eye className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Our Vision</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              A world where every gardener can ask, learn, and share — and where AI
              tools augment, rather than replace, the wisdom of the people who&apos;ve
              been doing this for years.
            </p>
          </div>
        </section>

        {/* What we offer */}
        <section className="mt-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">What we offer</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Practical tools for hands-in-the-dirt people.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {offerings.map((o) => (
              <div
                key={o.title}
                className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-200/60 dark:border-gray-700/60 shadow-sm overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={o.image}
                    alt={o.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className={`absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-white text-xs font-semibold bg-gradient-to-r ${o.tone} shadow-md`}>
                    {o.icon}
                    {o.title}
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {o.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mt-14 relative overflow-hidden rounded-3xl">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500 via-emerald-600 to-teal-600" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative px-6 sm:px-12 py-12 text-center text-white">
            <Heart className="w-10 h-10 mx-auto mb-3 text-white/90" />
            <h3 className="text-2xl sm:text-3xl font-bold mb-2">Join us today</h3>
            <p className="text-white/90 max-w-xl mx-auto mb-6">
              Whether you&apos;re learning, sharing, or just looking for honest answers
              about why your basil keeps wilting — we&apos;d love to have you.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-green-700 bg-white shadow-lg hover:scale-[1.02] transition-transform"
            >
              Create an account
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
