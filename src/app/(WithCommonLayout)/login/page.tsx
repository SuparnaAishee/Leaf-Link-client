/* eslint-disable prettier/prettier */
import { Button } from "@nextui-org/button";
import { Card } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { Spacer } from "@nextui-org/spacer";
import Link from "next/link";
import React from "react";

const Page = () => {
  return (
    <section className="flex flex-col items-center justify-center min-h-screen ">
      <div className="max-w-lg w-full p-6">
        <Card className="p-8 shadow-lg">
          <h3 className="text-center text-2xl text-purple-500"> LeafLink</h3>
          <p className="text-center mb-6 text-sm">
            Welcome Back! Let&apos;s Get Started
          </p>
          <form className="flex flex-col gap-4">
            {/* Email Input Field */}
            <Input
              isRequired
              type="email"
              label="Email"
              defaultValue="junior@nextui.org"
              className="w-full"
              labelPlacement="outside"
            />

            {/* Password Input Field */}
            <Input
              isRequired
              className="w-full"
              label="Password"
              placeholder="Enter your password"
              type="password"
              labelPlacement="outside"
            />

            <Spacer y={1} />

            {/* Sign In Button */}
            <Button className="mt-4 bg-gradient-to-r from-purple-400 via-purple-600 to-purple-700 text-white hover:from-purple-400 hover:via-purple-500 hover:to-purple-600 transition duration-300">
              Log In
            </Button>
          </form>

          {/* "Don't have an account" text */}
          <p className="text-center text-sm mt-4">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-purple-500 hover:underline">
              Register
            </Link>
          </p>
        </Card>
      </div>
    </section>
  );
};

export default Page;
