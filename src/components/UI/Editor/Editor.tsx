"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { BoldIcon, ImageIcon, ItalicIcon, VideoIcon } from "lucide-react";
import { Dispatch, SetStateAction, useRef } from "react";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import TextStyle from "@tiptap/extension-text-style";
import ListItem from "@tiptap/extension-list-item";
import Color from "@tiptap/extension-color";
import Heading from "@tiptap/extension-heading";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import BulletList from "@tiptap/extension-bullet-list";

import IFrame from "./IFrame";

import { uploadToCloudinary } from "@/src/utils/uploadToCloudinary";
interface IProps {
  content: string;
  setContent: Dispatch<SetStateAction<string>>;
  setUploadingImage: Dispatch<SetStateAction<boolean>>;
}
const Editor = ({ content, setContent, setUploadingImage }: IProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      BulletList.configure({
        itemTypeName: "listItem",
      }),
      Heading.configure({ levels: [1, 2, 3, 4, 5, 6] }),
      Color.configure({ types: [TextStyle.name, ListItem.name] }),
      TextStyle,
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),

      Image,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight,

      IFrame,
    ],
    content: content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setUploadingImage(true);
      const imageUrl = await uploadToCloudinary(file, "image");

      setUploadingImage(false);
      if (imageUrl && editor) {
        editor.chain().focus().setImage({ src: imageUrl }).run();
      }
    }
  };

  const addIframe = () => {
    const url = window.prompt("URL");

    if (url && editor) {
      editor.chain().focus().setIframe({ src: url }).run();
    }
  };

  return (
    <div>
      {editor && (
        <div className="flex flex-wrap mb-2 gap-2 editor-button-group">
          <button
            className={editor.isActive("bold") ? "is-active" : ""}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <BoldIcon className="size-4" /> Bold
          </button>
          <button
            className={editor.isActive("italic") ? "is-active" : ""}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <ItalicIcon className="size-4" /> Italic
          </button>
          <button
            className={editor.isActive("strike") ? "is-active" : ""}
            disabled={!editor.can().chain().focus().toggleStrike().run()}
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
          >
            Strike
          </button>
          <button
            className={editor.isActive("code") ? "is-active" : ""}
            disabled={!editor.can().chain().focus().toggleCode().run()}
            type="button"
            onClick={() => editor.chain().focus().toggleCode().run()}
          >
            Code
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().unsetAllMarks().run()}
          >
            Clear marks
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().clearNodes().run()}
          >
            Clear nodes
          </button>
          <button
            className={editor.isActive("paragraph") ? "is-active" : ""}
            type="button"
            onClick={() => editor.chain().focus().setParagraph().run()}
          >
            Paragraph
          </button>
          <button
            className={
              editor.isActive("heading", { level: 1 }) ? "is-active" : ""
            }
            type="button"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
          >
            H1
          </button>
          <button
            className={
              editor.isActive("heading", { level: 2 }) ? "is-active" : ""
            }
            type="button"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
          >
            H2
          </button>
          <button
            className={
              editor.isActive("heading", { level: 3 }) ? "is-active" : ""
            }
            type="button"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
          >
            H3
          </button>
          <button
            className={
              editor.isActive("heading", { level: 4 }) ? "is-active" : ""
            }
            type="button"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 4 }).run()
            }
          >
            H4
          </button>
          <button
            className={
              editor.isActive("heading", { level: 5 }) ? "is-active" : ""
            }
            type="button"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 5 }).run()
            }
          >
            H5
          </button>
          <button
            className={
              editor.isActive("heading", { level: 6 }) ? "is-active" : ""
            }
            type="button"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 6 }).run()
            }
          >
            H6
          </button>
          <button
            className={editor.isActive("bulletList") ? "is-active" : ""}
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            Bullet list
          </button>
          <button
            className={editor.isActive("orderedList") ? "is-active" : ""}
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            Ordered list
          </button>
          <button
            className={editor.isActive("codeBlock") ? "is-active" : ""}
            type="button"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          >
            Code block
          </button>
          <button
            className={editor.isActive("blockquote") ? "is-active" : ""}
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          >
            Blockquote
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
          >
            Horizontal rule
          </button>
          <button
            className={editor.isActive("highlight") ? "is-active" : ""}
            type="button"
            onClick={() => editor.chain().focus().toggleHighlight().run()}
          >
            Highlight
          </button>
          <button
            className={
              editor.isActive({ textAlign: "left" }) ? "is-active" : ""
            }
            type="button"
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
          >
            Left
          </button>
          <button
            className={
              editor.isActive({ textAlign: "center" }) ? "is-active" : ""
            }
            type="button"
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
          >
            Center
          </button>
          <button
            className={
              editor.isActive({ textAlign: "right" }) ? "is-active" : ""
            }
            type="button"
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
          >
            Right
          </button>
          <button
            className={
              editor.isActive({ textAlign: "justify" }) ? "is-active" : ""
            }
            type="button"
            onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          >
            Justify
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setHardBreak().run()}
          >
            Hard break
          </button>
          <button
            disabled={!editor.can().chain().focus().undo().run()}
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
          >
            Undo
          </button>
          <button
            disabled={!editor.can().chain().focus().redo().run()}
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
          >
            Redo
          </button>
          <label htmlFor="photo">
            <input
              ref={fileInputRef}
              hidden
              id="photo"
              type="file"
              onChange={handleFileChange}
            />

            <button
              className="flex gap-2 border border-gray-50 items-center justify-center rounded-lg px-2 py-2"
              type="button"
              onClick={handleClick}
            >
              <ImageIcon className="size-4" /> Upload Image
            </button>
          </label>
          <button
            className="flex gap-2 border border-gray-50 items-center justify-center rounded-lg px-2 py-2"
            type="button"
            onClick={addIframe}
          >
            <VideoIcon className="size-4" /> Add Video Link
          </button>
        </div>
      )}

      <EditorContent editor={editor} />
    </div>
  );
};

export default Editor;
