"use client";

import { useState } from "react";
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
  Heart,
  Bookmark,
  Share2,
  Check,
  Copy,
  Github,
  Zap,
  Shield,
  Crown,
  UserPlus,
  PlayCircle,
} from "lucide-react";
import Footer from "@/src/components/UI/Footer";

// Visitors testing the portfolio can sign in with these — replace with your real demo account.
const DEMO_EMAIL = "demo@leaflink.app";
const DEMO_PASSWORD = "demo1234";

const stats = [
  { label: "Active gardeners", value: "5K+" },
  { label: "Tips shared", value: "12K+" },
  { label: "AI diagnoses", value: "3K+" },
  { label: "Plant species", value: "200+" },
];

const features = [
  {
    icon: <Camera className="w-6 h-6" />,
    title: "AI Plant Doctor",
    desc: "Upload a photo — get the species, care plan, and disease diagnosis in seconds. Powered by Claude.",
    color: "from-green-500 to-emerald-600",
    badge: "NEW",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Grow Your Network",
    desc: "Follow gardeners, build mutual circles, and find people who actually know their compost.",
    color: "from-teal-500 to-cyan-600",
  },
  {
    icon: <MessageSquare className="w-6 h-6" />,
    title: "Rich Posts & Stories",
    desc: "Tiptap editor, image uploads, categories, comments — share guides the way they deserve.",
    color: "from-amber-500 to-orange-600",
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: "Trending & Categories",
    desc: "Herbs, Vegetables, Flowers, Indoor… filter the feed to exactly what you're growing.",
    color: "from-pink-500 to-rose-600",
  },
  {
    icon: <Crown className="w-6 h-6" />,
    title: "Verified Profiles",
    desc: "Premium gardeners get a verified badge via integrated payment flow.",
    color: "from-purple-500 to-indigo-600",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Secure by Default",
    desc: "JWT auth, role-based routes, protected APIs. Your account stays yours.",
    color: "from-slate-600 to-gray-700",
  },
];

const steps = [
  {
    icon: <UserPlus className="w-5 h-5" />,
    title: "Sign up free",
    desc: "Create your account in under a minute — no credit card, no questions asked.",
    detail: "✨ 30 seconds",
  },
  {
    icon: <MessageSquare className="w-5 h-5" />,
    title: "Share & explore",
    desc: "Post tips, follow other gardeners, drop comments, and build your circle.",
    detail: "📝 Post, comment, follow",
  },
  {
    icon: <Camera className="w-5 h-5" />,
    title: "Grow with AI",
    desc: "Snap any plant — get identification, care plans, and disease diagnoses instantly.",
    detail: "🌿 Plant Doctor + care plans",
  },
];

const categories = [
  { name: "Herbs", icon: <Leaf className="w-4 h-4" /> },
  { name: "Vegetables", icon: <Carrot className="w-4 h-4" /> },
  { name: "Flowers", icon: <Flower2 className="w-4 h-4" /> },
  { name: "Indoor", icon: <TreePine className="w-4 h-4" /> },
];

const Landing: React.FC = () => {
  const [copied, setCopied] = useState<"email" | "password" | null>(null);

  const copy = async (value: string, which: "email" | "password") => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(which);
      setTimeout(() => setCopied(null), 1500);
    } catch {}
  };

  return (
    <div className="min-h-screen">
      <main className="w-full">
        {/* ───────────────────────── Hero ───────────────────────── */}
        <section className="relative overflow-hidden">
          <div className="absolute -top-32 -left-32 w-[28rem] h-[28rem] bg-green-300/40 dark:bg-green-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-20 -right-32 w-[28rem] h-[28rem] bg-emerald-300/40 dark:bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-teal-300/30 dark:bg-teal-500/10 rounded-full blur-3xl" />

          <div className="max-w-screen-xl mx-auto px-4 pt-16 pb-20 sm:pt-24 sm:pb-28 relative">
            <div className="flex flex-col items-center text-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm font-medium mb-6 border border-green-200/60 dark:border-green-800/60">
                <Sparkles className="w-4 h-4" />
                A full-stack social platform · Now AI-powered
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white max-w-4xl leading-[1.05]">
                Where gardeners{" "}
                <span className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
                  grow together
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-lg sm:text-xl text-gray-600 dark:text-gray-300">
                LeafLink is a social network for plant lovers — share tips,
                diagnose diseases with AI, follow other gardeners, and grow a
                better garden together.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Link href="/register" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 hover:scale-[1.02] transition-all duration-200">
                    Create your account
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
                <a href="#demo" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <PlayCircle className="w-5 h-5 text-green-600" />
                    Try demo account
                  </button>
                </a>
              </div>

              {/* Stats */}
              <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-12 w-full max-w-3xl">
                {stats.map((s) => (
                  <div key={s.label} className="text-center">
                    <div className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-br from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      {s.value}
                    </div>
                    <div className="mt-1 text-xs sm:text-sm text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────────── Product Spotlight ─────────────────── */}
        <section className="max-w-screen-xl mx-auto px-4 py-12 sm:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-semibold uppercase tracking-wider mb-4">
                <Sparkles className="w-3 h-3" />
                A peek inside
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
                A polished social feed,{" "}
                <span className="bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
                  built for gardeners.
                </span>
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                Stories, a rich post composer, category filters, suggested
                people, trending topics, upcoming events — all wrapped in a
                clean three-column layout that works on dark mode and mobile.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "Three-column responsive feed with sticky sidebars",
                  "Stories row + photo / video / mood composer",
                  "AI Plant Doctor — snap a leaf, get a diagnosis",
                  "Dark mode, follow graph, real-time interactions",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-gray-700 dark:text-gray-300"
                  >
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center mt-0.5">
                      <Check className="w-3 h-3 text-green-600 dark:text-green-400" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/register">
                <button className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold shadow-lg shadow-green-500/20 hover:shadow-xl hover:scale-[1.02] transition-all">
                  Sign up & explore
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>

            {/* Real product screenshot */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-green-400/30 to-emerald-500/30 rounded-3xl blur-2xl" />
              <div className="relative bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                {/* Browser chrome */}
                <div className="flex items-center gap-1.5 px-3 py-2 bg-gray-800 border-b border-gray-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
                  <span className="ml-3 text-[10px] text-gray-400 font-mono truncate">
                    leaflink.app
                  </span>
                </div>
                <img
                  src="/leaflink-preview.png"
                  alt="LeafLink home feed preview"
                  className="w-full h-auto block"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────────── Features Grid ─────────────────── */}
        <section className="bg-white/50 dark:bg-gray-900/40 border-y border-gray-200/60 dark:border-gray-800/60">
          <div className="max-w-screen-xl mx-auto px-4 py-16 sm:py-20">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-4">
                <Zap className="w-3 h-3" />
                Everything Built In
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                Everything your garden community needs
              </h2>
              <p className="mt-3 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Six core features, one platform — built end-to-end from auth to
                AI.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="group relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
                >
                  {f.badge && (
                    <span className="absolute top-4 right-4 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-300 text-amber-900">
                      {f.badge}
                    </span>
                  )}
                  <div
                    className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} text-white mb-4 shadow-md`}
                  >
                    {f.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─────────────────── How it works ─────────────────── */}
        <section className="max-w-screen-xl mx-auto px-4 py-16 sm:py-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-4">
              <Zap className="w-3 h-3" />
              How it works
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
              From signup to first harvest, in 3 steps
            </h2>
            <p className="mt-3 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Join the community in under a minute — then let LeafLink do the rest.
            </p>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Dashed connector on desktop */}
            <div className="hidden md:block absolute top-12 left-[18%] right-[18%] border-t-2 border-dashed border-green-200 dark:border-green-800/60" />

            {steps.map((s, i) => (
              <div
                key={s.title}
                className="relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 text-center group hover:shadow-xl hover:-translate-y-1 transition-all"
              >
                <div className="relative inline-flex mb-4">
                  <div className="absolute -inset-1.5 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl blur opacity-30 group-hover:opacity-60 transition-opacity" />
                  <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                    {i + 1}
                  </div>
                </div>

                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 mb-3">
                  {s.icon}
                </div>

                <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {s.desc}
                </p>
                <p className="mt-4 inline-block text-xs font-medium px-3 py-1 rounded-full bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                  {s.detail}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ─────────────────── Demo Access ─────────────────── */}
        <section id="demo" className="max-w-screen-xl mx-auto px-4 pb-16">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 dark:from-black dark:via-gray-900 dark:to-black p-8 sm:p-12 text-white border border-gray-800">
            <div className="absolute top-0 right-0 w-72 h-72 bg-green-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 text-green-300 text-xs font-semibold uppercase tracking-wider mb-4 border border-green-500/30">
                  <PlayCircle className="w-3 h-3" />
                  Skip the signup
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold leading-tight">
                  Try LeafLink right now —{" "}
                  <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                    no account needed
                  </span>
                </h2>
                <p className="mt-4 text-gray-300 text-lg">
                  Use the demo account below to log in and explore every feature.
                  Post, comment, follow, try the AI Plant Doctor — go wild.
                </p>
                <Link href="/login" className="inline-block mt-6">
                  <button className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold shadow-lg shadow-green-500/30 hover:shadow-xl hover:scale-[1.02] transition-all">
                    Open login page
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>

              {/* Credentials card */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-2 text-green-400 text-sm font-semibold uppercase tracking-wider">
                  <Shield className="w-4 h-4" />
                  Demo credentials
                </div>

                <div>
                  <div className="text-xs text-gray-400 mb-1.5">Email</div>
                  <div className="flex items-center gap-2 bg-black/40 rounded-lg p-3 font-mono text-sm border border-white/10">
                    <span className="flex-1 truncate text-green-300">
                      {DEMO_EMAIL}
                    </span>
                    <button
                      onClick={() => copy(DEMO_EMAIL, "email")}
                      className="flex-shrink-0 p-1.5 rounded-md hover:bg-white/10 transition-colors"
                      aria-label="Copy email"
                    >
                      {copied === "email" ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <div className="text-xs text-gray-400 mb-1.5">Password</div>
                  <div className="flex items-center gap-2 bg-black/40 rounded-lg p-3 font-mono text-sm border border-white/10">
                    <span className="flex-1 truncate text-green-300">
                      {DEMO_PASSWORD}
                    </span>
                    <button
                      onClick={() => copy(DEMO_PASSWORD, "password")}
                      className="flex-shrink-0 p-1.5 rounded-md hover:bg-white/10 transition-colors"
                      aria-label="Copy password"
                    >
                      {copied === "password" ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <p className="text-xs text-gray-500 leading-relaxed pt-1">
                  Tip: open in an incognito window to keep your own session
                  separate.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────────── About the project ─────────────────── */}
        <section className="max-w-screen-xl mx-auto px-4 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-8">
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-xs font-semibold uppercase tracking-wider mb-3">
                <Heart className="w-3 h-3" />
                About the project
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                A full-stack capstone built around a real community.
              </h3>
              <p className="mt-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                LeafLink started as a course assignment and grew into a complete
                social platform: authentication, profiles, follow graphs, a
                rich-text editor, image uploads, payments for verification, and
                an AI feature integrated with Anthropic&apos;s Claude API. Every
                screen was designed and shipped solo, front to back.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {categories.map((c) => (
                  <span
                    key={c.name}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-sm border border-green-200 dark:border-green-800"
                  >
                    {c.icon}
                    {c.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500 via-emerald-600 to-teal-600 rounded-3xl p-8 text-white flex flex-col justify-between">
              <div>
                <Github className="w-8 h-8 mb-3" />
                <h4 className="text-xl font-bold">Open source</h4>
                <p className="mt-2 text-white/90 text-sm leading-relaxed">
                  Browse the full codebase — frontend and backend repos are
                  available on GitHub.
                </p>
              </div>
              <a
                href="https://github.com/SuparnaAishee"
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="mt-6 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-white text-green-700 font-semibold hover:bg-white/90 transition-colors text-sm">
                  View on GitHub
                  <ArrowRight className="w-4 h-4" />
                </button>
              </a>
            </div>
          </div>
        </section>

        {/* ─────────────────── Final CTA ─────────────────── */}
        <section className="max-w-screen-xl mx-auto px-4 pb-16">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-500 via-emerald-600 to-teal-600 p-8 sm:p-14 text-white text-center">
            <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full -translate-y-1/3 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-56 h-56 bg-white/10 rounded-full translate-y-1/3 -translate-x-1/3" />
            <div className="relative">
              <Leaf className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-3xl sm:text-4xl font-bold max-w-2xl mx-auto">
                Ready to dig in?
              </h3>
              <p className="mt-3 text-white/90 max-w-xl mx-auto">
                Join the community or use the demo account — either way, you&apos;re
                two clicks from your first post.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/register">
                  <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-white text-green-700 font-semibold shadow-lg hover:bg-white/90 transition-colors">
                    Get started — free
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
                <a href="#demo">
                  <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-white/10 text-white font-semibold border border-white/30 hover:bg-white/20 transition-colors">
                    <PlayCircle className="w-5 h-5" />
                    Use demo account
                  </button>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Landing;
