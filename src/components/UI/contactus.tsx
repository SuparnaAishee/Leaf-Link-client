"use client";

import React, { useState } from "react";
import { Leaf, Mail, MessageSquare, Send, CheckCircle2, User } from "lucide-react";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <section className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] px-4">
        <div className="w-full max-w-md text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-200/60 dark:border-gray-700/60 shadow-lg p-8">
          <div className="inline-flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg shadow-green-500/30">
            <CheckCircle2 className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Thanks for reaching out!
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            We&apos;ll get back to you within a day or two.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] px-4 py-10">
      <div className="w-full max-w-lg">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl mb-3 shadow-lg shadow-green-500/20">
            <Leaf className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Contact Us</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Questions, ideas, or feedback — drop us a line.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-200/60 dark:border-gray-700/60 shadow-lg p-6 sm:p-8 space-y-5"
        >
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Your name"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              />
            </div>
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Message
            </label>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                placeholder="Tell us what's on your mind..."
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition resize-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-600 shadow-md hover:shadow-lg hover:from-green-600 hover:to-emerald-700 transition-all"
          >
            <Send className="w-4 h-4" />
            Send message
          </button>
        </form>
      </div>
    </section>
  );
};

export default ContactForm;
