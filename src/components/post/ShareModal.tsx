"use client";

import { useEffect, useState } from "react";
import {
  Check,
  Copy,
  Facebook,
  Mail,
  Send,
  Share2,
  Twitter,
  X,
} from "lucide-react";
import { toast } from "sonner";

interface ShareModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  text?: string;
  postId: string;
}

const buildUrl = (postId: string) => {
  if (typeof window === "undefined") return "";
  return `${window.location.origin}/posts/${postId}`;
};

export default function ShareModal({
  open,
  onClose,
  title,
  text,
  postId,
}: ShareModalProps) {
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (open) {
      setUrl(buildUrl(postId));
      setCopied(false);
    }
  }, [open, postId]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const encUrl = encodeURIComponent(url);
  const encText = encodeURIComponent(text || title);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied to clipboard");
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Couldn't copy the link");
    }
  };

  const handleNativeShare = async () => {
    if (!navigator.share) return;
    try {
      await navigator.share({ title, text, url });
      onClose();
    } catch {
      /* user cancelled */
    }
  };

  const channels = [
    {
      label: "WhatsApp",
      href: `https://wa.me/?text=${encText}%20${encUrl}`,
      bg: "bg-green-500",
      Icon: WhatsAppGlyph,
    },
    {
      label: "Twitter",
      href: `https://twitter.com/intent/tweet?text=${encText}&url=${encUrl}`,
      bg: "bg-sky-500",
      Icon: Twitter,
    },
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encUrl}`,
      bg: "bg-blue-600",
      Icon: Facebook,
    },
    {
      label: "Telegram",
      href: `https://t.me/share/url?url=${encUrl}&text=${encText}`,
      bg: "bg-cyan-500",
      Icon: Send,
    },
    {
      label: "Email",
      href: `mailto:?subject=${encodeURIComponent(title)}&body=${encText}%0A%0A${encUrl}`,
      bg: "bg-rose-500",
      Icon: Mail,
    },
  ];

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Share post"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-green-500" />
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Share this post
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="px-5 py-4">
          <div className="grid grid-cols-5 gap-3 mb-5">
            {channels.map(({ label, href, bg, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1.5 group"
              >
                <div
                  className={`${bg} w-12 h-12 rounded-full flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  {label}
                </span>
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-xl px-3 py-2.5">
            <span className="flex-1 truncate text-sm text-gray-600 dark:text-gray-300">
              {url}
            </span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" /> Copied
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Copy
                </>
              )}
            </button>
          </div>

          {typeof navigator !== "undefined" && "share" in navigator && (
            <button
              onClick={handleNativeShare}
              className="w-full mt-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-green-500/30 transition-all"
            >
              More sharing options…
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function WhatsAppGlyph({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M20.52 3.48A11.94 11.94 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.11.55 4.13 1.6 5.94L0 24l6.21-1.63A11.93 11.93 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.2-1.25-6.21-3.48-8.52ZM12 21.83a9.83 9.83 0 0 1-5.02-1.38l-.36-.21-3.69.97.98-3.6-.23-.37A9.83 9.83 0 1 1 12 21.83Zm5.4-7.36c-.29-.15-1.74-.86-2.01-.96-.27-.1-.47-.15-.66.15-.2.29-.76.96-.93 1.15-.17.2-.34.22-.63.07-.29-.14-1.24-.46-2.36-1.46-.87-.78-1.46-1.74-1.63-2.03-.17-.29-.02-.45.13-.6.13-.13.29-.34.44-.51.15-.17.2-.29.29-.49.1-.2.05-.37-.02-.51-.07-.14-.66-1.6-.91-2.19-.24-.58-.49-.5-.66-.51l-.56-.01c-.2 0-.51.07-.78.37-.27.29-1.02 1-1.02 2.43 0 1.43 1.04 2.81 1.18 3 .14.2 2.05 3.13 4.96 4.39.69.3 1.23.48 1.65.61.69.22 1.32.19 1.81.12.55-.08 1.74-.71 1.99-1.4.24-.69.24-1.28.17-1.4-.07-.12-.27-.2-.56-.34Z" />
    </svg>
  );
}
