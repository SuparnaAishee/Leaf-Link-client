"use client";

import { useState } from "react";
import { Editor } from "@tinymce/tinymce-react";

export default function RichTextEditor() {
  const [content, setContent] = useState("");

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <Editor
        apiKey="your-tinymce-api-key"
        value={content}
        onEditorChange={(newContent) => setContent(newContent)}
        init={{
          height: 200,
          menubar: false,
          plugins: "lists link image",
          toolbar:
            "undo redo | formatselect | bold italic | bullist numlist | link image",
        }}
      />
    </div>
  );
}
