// Footer.tsx
import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="w-full text-center p-4 bg-default-black text-gray-600 mt-6">
      <div className="space-x-4 mb-2">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        <Link href="/about" className="hover:underline">
          About
        </Link>
        <Link href="/profile/create-post" className="hover:underline">
          Create Post
        </Link>
        <Link href="/profile" className="hover:underline">
          Profile
        </Link>
      </div>
      <p>
        &copy; 2024 <span className="text-purple-500 ">LeafLink</span>.
        All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
