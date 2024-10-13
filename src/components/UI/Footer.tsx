// Footer.tsx
import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="w-full text-center p-4 bg-default-black text-gray-600 mt-6">
      <div className="space-x-4 mb-2">
        <Link className="hover:underline" href="/">
          Home
        </Link>
        <Link className="hover:underline" href="/about">
          About
        </Link>
        <Link className="hover:underline" href="/profile/create-post">
          Create Post
        </Link>
        <Link className="hover:underline" href="/profile">
          Profile
        </Link>
      </div>
      <p>
        &copy; 2024 <span className="text-purple-500 ">LeafLink</span>. All
        rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
