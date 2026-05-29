"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Crown,
  Check,
  Sparkles,
  ShieldCheck,
  Zap,
  TrendingUp,
  Star,
  Camera,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import { useUser } from "@/src/context/user.provider";
import { useGetMe } from "@/src/hooks/profile";
import envConfig from "@/src/config/envConfig";

type Plan = {
  id: "monthly" | "annual";
  name: string;
  amount: number;
  period: string;
  tagline: string;
  badge?: string;
  saving?: string;
  highlight?: boolean;
};

const PLANS: Plan[] = [
  {
    id: "monthly",
    name: "Premium Monthly",
    amount: 9.99,
    period: "per month",
    tagline: "Try it for a month, cancel anytime.",
  },
  {
    id: "annual",
    name: "Premium Annual",
    amount: 79.99,
    period: "per year",
    tagline: "Two months free, billed yearly.",
    badge: "Best value",
    saving: "Save 33%",
    highlight: true,
  },
];

const PREMIUM_FEATURES: { icon: React.ReactNode; text: string }[] = [
  { icon: <Crown className="w-4 h-4" />, text: "Verified Gardener badge on your profile and posts" },
  { icon: <Star className="w-4 h-4" />, text: "Access exclusive premium tips, guides, and videos" },
  { icon: <Camera className="w-4 h-4" />, text: "Priority on AI Plant Doctor — unlimited diagnoses" },
  { icon: <TrendingUp className="w-4 h-4" />, text: "Boosted reach: your posts get featured more often" },
  { icon: <Zap className="w-4 h-4" />, text: "Ad-free experience across the entire app" },
  { icon: <ShieldCheck className="w-4 h-4" />, text: "Early access to new features before they launch" },
];

const FAQ = [
  {
    q: "Can I cancel anytime?",
    a: "Yes. You can cancel from your settings at any time and keep access until the end of your billing period.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We use a secure payment gateway that supports major credit/debit cards and popular regional methods.",
  },
  {
    q: "Will I lose my posts if I downgrade?",
    a: "Never. Your posts, comments, followers, and bio stay with you. You just lose access to the premium features.",
  },
  {
    q: "Is there a refund policy?",
    a: "If you're unhappy in the first 7 days, reach out to support and we'll refund the most recent charge.",
  },
];

const PremiumBadge = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <li className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300">
    <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 text-white flex items-center justify-center mt-0.5">
      {icon}
    </span>
    <span className="leading-relaxed">{text}</span>
  </li>
);

const VerifyProfile = () => {
  const { user, setUser } = useUser();
  const { data: meResponse } = useGetMe(user?.email as string);
  const me = meResponse?.data as any;

  const [loadingPlan, setLoadingPlan] = useState<Plan["id"] | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const isPremium = me?.premiumStatus ?? user?.premiumStatus ?? false;

  // Original payment flow — preserved.
  const handleCheckout = async (plan: Plan) => {
    if (!user?._id) {
      toast.error("Please sign in to upgrade.");
      return;
    }
    setLoadingPlan(plan.id);

    const payload = {
      amount: plan.amount,
      user: user._id,
    };

    try {
      const response = await fetch(
        `${envConfig.baseApi}/verify-profile`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
      setLoadingPlan(null);

      if (data?.success) {
        const paymentUrl = data?.data?.payment_url;

        if (paymentUrl) {
          window.location.href = paymentUrl;

          await fetch(
            `${envConfig.baseApi}/users/update-user/${user?._id}`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                isVerified: true,
                premiumStatus: true,
              }),
            }
          );

          // @ts-ignore
          setUser({
            ...user,
            isVerified: true,
            premiumStatus: true,
          });
        } else {
          toast.error("Couldn't start checkout. Please try again.");
        }
      } else {
        toast.error(data?.message || "Couldn't start checkout.");
      }
    } catch (error) {
      setLoadingPlan(null);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* ─────────────── Hero ─────────────── */}
      <section className="relative overflow-hidden">
        <div className="absolute -top-24 -left-20 w-96 h-96 bg-amber-300/30 dark:bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute top-10 -right-32 w-96 h-96 bg-green-300/30 dark:bg-green-500/10 rounded-full blur-3xl" />

        <div className="max-w-5xl mx-auto px-4 pt-12 pb-10 sm:pt-16 sm:pb-14 relative">
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-sm font-semibold border border-amber-200/60 dark:border-amber-800/60 mb-6">
              <Crown className="w-4 h-4" />
              LeafLink Premium
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white max-w-3xl leading-[1.1]">
              Grow further with{" "}
              <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 bg-clip-text text-transparent">
                Premium
              </span>
            </h1>
            <p className="mt-5 max-w-2xl text-base sm:text-lg text-gray-600 dark:text-gray-300">
              Unlock exclusive tips, get a verified badge, supercharge the AI
              Plant Doctor, and let your posts reach more gardeners.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 pb-16 space-y-12">
        {/* ─────────────── Already premium state ─────────────── */}
        {isPremium && (
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-500 via-emerald-600 to-teal-600 p-6 sm:p-8 text-white shadow-xl">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3" />
            <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                  <Crown className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">You&apos;re already Premium</h3>
                  <p className="text-sm text-white/90">
                    Enjoy everything LeafLink has to offer. Thanks for supporting us.
                  </p>
                </div>
              </div>
              <Link href="/profile/premiumContent">
                <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-green-700 font-semibold shadow hover:bg-white/90 transition-colors text-sm">
                  Browse premium content
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>
        )}

        {/* ─────────────── Plans ─────────────── */}
        {!isPremium && (
          <section>
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Choose your plan
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Pick what fits. Cancel anytime — no questions asked.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl mx-auto">
              {PLANS.map((plan) => {
                const isLoading = loadingPlan === plan.id;
                return (
                  <div
                    key={plan.id}
                    className={`relative bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-7 border-2 transition-all ${
                      plan.highlight
                        ? "border-green-500 dark:border-green-500 shadow-xl shadow-green-500/10"
                        : "border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    {plan.badge && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md">
                        <Sparkles className="w-3 h-3" />
                        {plan.badge}
                      </span>
                    )}

                    <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                      {plan.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {plan.tagline}
                    </p>

                    <div className="mt-5 flex items-baseline gap-1.5">
                      <span className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white">
                        ${plan.amount.toFixed(2)}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {plan.period}
                      </span>
                    </div>

                    {plan.saving && (
                      <div className="mt-2 inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                        <TrendingUp className="w-3 h-3" />
                        {plan.saving}
                      </div>
                    )}

                    <button
                      onClick={() => handleCheckout(plan)}
                      disabled={isLoading}
                      className={`mt-6 w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full font-semibold transition-all disabled:opacity-70 disabled:cursor-not-allowed ${
                        plan.highlight
                          ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30 hover:shadow-xl hover:scale-[1.02]"
                          : "bg-gray-900 dark:bg-gray-700 text-white hover:bg-gray-800 dark:hover:bg-gray-600"
                      }`}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Starting checkout…
                        </>
                      ) : (
                        <>
                          Get {plan.name.replace("Premium ", "")}
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    <p className="mt-3 text-[11px] text-center text-gray-400 dark:text-gray-500">
                      Secure checkout · cancel anytime
                    </p>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ─────────────── What you get ─────────────── */}
        <section className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 p-6 sm:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-semibold uppercase tracking-wider mb-4">
                <Sparkles className="w-3 h-3" />
                What you get
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Six premium perks, one upgrade.
              </h2>
              <p className="mt-3 text-gray-600 dark:text-gray-400">
                LeafLink Premium gives you the tools serious gardeners need to
                stand out, learn faster, and grow further.
              </p>
            </div>
            <ul className="space-y-3.5">
              {PREMIUM_FEATURES.map((f, i) => (
                <PremiumBadge key={i} icon={f.icon} text={f.text} />
              ))}
            </ul>
          </div>
        </section>

        {/* ─────────────── FAQ ─────────────── */}
        <section>
          <div className="text-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Questions, answered
            </h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-3">
            {FAQ.map((item, i) => {
              const open = openFaq === i;
              return (
                <div
                  key={item.q}
                  className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(open ? null : i)}
                    className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors"
                  >
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {item.q}
                    </span>
                    <span
                      className={`w-7 h-7 rounded-full bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center transition-transform ${
                        open ? "rotate-45" : ""
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                    </span>
                  </button>
                  {open && (
                    <div className="px-5 pb-4 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ─────────────── Trust / footer note ─────────────── */}
        <section className="text-center text-xs text-gray-500 dark:text-gray-400 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-green-600" />
            Secure checkout
          </span>
          <span className="hidden sm:inline">·</span>
          <span>You can cancel anytime from your settings</span>
          <span className="hidden sm:inline">·</span>
          <span>Need help? Contact support</span>
        </section>
      </div>
    </div>
  );
};

export default VerifyProfile;
