"use client";

import { useState, useRef } from "react";
import { Bold, Italic, List, Link2, Image, Send, Leaf } from "lucide-react";

interface RichTextEditorProps {
  onSubmit?: (content: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({
  onSubmit,
  placeholder = "Share your gardening tips, experiences, or ask questions..."
}: RichTextEditorProps) {
  const [content, setContent] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    if (content.trim() && onSubmit) {
      onSubmit(content);
      setContent("");
    }
  };

  const insertFormatting = (prefix: string, suffix: string = prefix) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const newContent =
      content.substring(0, start) +
      prefix + selectedText + suffix +
      content.substring(end);

    setContent(newContent);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  return (
    <div className={`rounded-xl border-2 transition-all duration-300 ${
      isFocused
        ? "border-green-400 shadow-lg shadow-green-100 dark:shadow-green-900/20"
        : "border-gray-200 dark:border-gray-700"
    } bg-white dark:bg-gray-800`}>
      <div className="flex items-center gap-1 px-3 py-2 border-b border-gray-100 dark:border-gray-700">
        <button
          type="button"
          onClick={() => insertFormatting("**")}
          className="p-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/30 text-gray-500 hover:text-green-600 transition-colors"
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => insertFormatting("*")}
          className="p-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/30 text-gray-500 hover:text-green-600 transition-colors"
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => insertFormatting("\n- ")}
          className="p-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/30 text-gray-500 hover:text-green-600 transition-colors"
          title="List"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => insertFormatting("[", "](url)")}
          className="p-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/30 text-gray-500 hover:text-green-600 transition-colors"
          title="Link"
        >
          <Link2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => insertFormatting("![", "](image-url)")}
          className="p-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/30 text-gray-500 hover:text-green-600 transition-colors"
          title="Image"
        >
          <Image className="w-4 h-4" />
        </button>
        <div className="flex-1" />
        <div className="flex items-center gap-1 text-green-600">
          <Leaf className="w-4 h-4" />
          <span className="text-xs font-medium">LeafLink</span>
        </div>
      </div>

      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className="w-full min-h-[120px] p-4 bg-transparent resize-none focus:outline-none text-gray-700 dark:text-gray-200 placeholder-gray-400"
        rows={4}
      />

      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-b-xl">
        <span className="text-xs text-gray-400">
          {content.length} characters
        </span>
        <button
          onClick={handleSubmit}
          disabled={!content.trim()}
          className={`flex items-center gap-2 px-5 py-2 rounded-full font-medium transition-all duration-300 ${
            content.trim()
              ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-md hover:shadow-lg"
              : "bg-gray-200 dark:bg-gray-600 text-gray-400 cursor-not-allowed"
          }`}
        >
          <Send className="w-4 h-4" />
          Post
        </button>
      </div>
    </div>
  );
}
