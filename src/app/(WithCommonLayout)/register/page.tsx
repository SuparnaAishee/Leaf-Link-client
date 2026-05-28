"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nextui-org/button";
import Link from "next/link";
import { FieldValues, SubmitHandler } from "react-hook-form";
import { Leaf, User, Loader2, Sparkles, Users, TrendingUp } from "lucide-react";

import LLForm from "@/src/components/form/LLFrom";
import LLInput from "@/src/components/form/LLInput";
import { useUserRegistration } from "@/src/hooks/auth.hook";
import registerValidationSchema from "@/src/schemas/register.validation";

export default function RegisterPage() {
  const { mutate: handleUserRegistration, isPending } = useUserRegistration();

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const userData = {
      ...data,
      profilePhoto:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    };
    handleUserRegistration(userData);
  };

  return (
    <div className="min-h-[calc(100vh-100px)] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl mb-4 shadow-lg shadow-green-500/20">
              <Leaf className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Join LeafLink
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Create your account and start your gardening journey
            </p>
          </div>

          <LLForm
            resolver={zodResolver(registerValidationSchema)}
            onSubmit={onSubmit}
          >
            <div className="space-y-4">
              <LLInput label="Full Name" name="name" />
              <LLInput label="Email" name="email" type="email" />
              <LLInput label="Mobile Number" name="mobileNumber" />
              <LLInput label="Password" name="password" type="password" />
            </div>

            <Button
              className="w-full mt-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl h-12 hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-md hover:shadow-lg"
              size="lg"
              type="submit"
              disabled={isPending}
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating account...
                </span>
              ) : (
                "Create Account"
              )}
            </Button>
          </LLForm>

          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-green-600 hover:text-green-700 font-semibold transition-colors"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>

        {/* Benefits */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
            <div className="w-10 h-10 mx-auto mb-2 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Share Tips</p>
          </div>
          <div className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
            <div className="w-10 h-10 mx-auto mb-2 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Connect</p>
          </div>
          <div className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
            <div className="w-10 h-10 mx-auto mb-2 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Grow</p>
          </div>
        </div>
      </div>
    </div>
  );
}
