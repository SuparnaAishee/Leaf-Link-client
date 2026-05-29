"use client";

import { ReactNode } from "react";
import Link from "next/link";

// Splits a plain-text post/comment body into mixed text + clickable
// @mention and #hashtag links. Existing markup the editor emits (HTML)
// is not handled here — this is intended for the plain-text rendering
// path the feed currently uses.
//
// Each #tag links to /tag/<slug>; each @handle links to /profile
// (we don't yet have per-user URLs, so the dropdown's same fallback
// behavior is mirrored here for now).

const TOKEN_REGEX = /(@[a-zA-Z0-9_]+|#[a-zA-Z0-9_]+)/g;

export const RichText = ({
  children,
  className,
}: {
  children: string | null | undefined;
  className?: string;
}) => {
  if (!children) return null;

  const parts = children.split(TOKEN_REGEX);
  const nodes: ReactNode[] = parts.map((part, i) => {
    if (part.startsWith("#") && part.length > 1) {
      const tag = part.slice(1);
      return (
        <Link
          key={i}
          href={`/tag/${encodeURIComponent(tag.toLowerCase())}`}
          className="text-green-600 dark:text-green-400 hover:underline font-medium"
        >
          {part}
        </Link>
      );
    }
    if (part.startsWith("@") && part.length > 1) {
      return (
        <Link
          key={i}
          href="/profile"
          className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
        >
          {part}
        </Link>
      );
    }
    return <span key={i}>{part}</span>;
  });

  return <span className={className}>{nodes}</span>;
};
