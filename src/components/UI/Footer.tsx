import React from "react";
import Link from "next/link";
import {
  Leaf,
  Mail,
  Heart,
  Send,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 mt-8">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg shadow-green-500/20">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-2xl bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                LeafLink
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed max-w-sm">
              Join the largest community of gardening enthusiasts. Share tips, discover new plants, and grow together.
            </p>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm uppercase tracking-wider">Product</h3>
            <ul className="space-y-3">
              {[
                { label: "Features", href: "/about" },
                { label: "Premium", href: "/profile/verify-profile" },
                { label: "AI Plant Doctor", href: "/ai-garden" },
                { label: "Community", href: "/" },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-sm text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm uppercase tracking-wider">Company</h3>
            <ul className="space-y-3">
              {[
                { label: "About", href: "/about" },
                { label: "Sign in", href: "/login" },
                { label: "Create account", href: "/register" },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-sm text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mt-12 p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-800 rounded-2xl border border-green-100 dark:border-gray-700">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Get gardening tips in your inbox</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Join 10,000+ gardeners who receive weekly tips and inspiration.</p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-green-200 dark:border-gray-600 bg-white dark:bg-gray-900 focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-200 dark:focus:ring-green-800"
                />
              </div>
              <button className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-md hover:shadow-lg font-medium flex items-center gap-2">
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Subscribe</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-100 dark:border-gray-800">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
              <p>&copy; 2025 LeafLink. All rights reserved.</p>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
              Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> for gardeners
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
