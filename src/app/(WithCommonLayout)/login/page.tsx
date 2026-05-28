"use client";

import { Suspense, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nextui-org/button";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FieldValues, SubmitHandler } from "react-hook-form";
import { Leaf, Loader2 } from "lucide-react";

import { loginValidationSchema } from "@/src/schemas/login.validation";
import { useUserLogin } from "@/src/hooks/auth.hook";
import { useUser } from "@/src/context/user.provider";
import LLInput from "@/src/components/form/LLInput";
import LLForm from "@/src/components/form/LLFrom";

const LoginPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setIsLoading: userLoading } = useUser();

  const redirect = searchParams.get("redirect");
  const { mutate: handleUserLogin, isPending, isSuccess } = useUserLogin();

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    handleUserLogin(data);
    userLoading(true);
  };

  useEffect(() => {
    if (!isPending && isSuccess) {
      if (redirect) {
        router.push(redirect);
      } else {
        router.push("/");
      }
    }
  }, [isPending, isSuccess, redirect, router]);

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl mb-4 shadow-lg shadow-green-500/20">
              <Leaf className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Welcome Back!
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Sign in to continue to LeafLink
            </p>
          </div>

          <LLForm
            resolver={zodResolver(loginValidationSchema)}
            onSubmit={onSubmit}
          >
            <div className="space-y-4">
              <LLInput
                label="Email"
                name="email"
                type="email"
              />
              <LLInput
                label="Password"
                name="password"
                type="password"
              />
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
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </Button>
          </LLForm>

          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="text-green-600 hover:text-green-700 font-semibold transition-colors"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Join our community of gardening enthusiasts
          </p>
        </div>
      </div>
    </div>
  );
};

const LoginWithSuspense = () => {
  return (
    <Suspense fallback={
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-green-500" />
      </div>
    }>
      <LoginPage />
    </Suspense>
  );
};

export default LoginWithSuspense;
