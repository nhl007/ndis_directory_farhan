"use client";

import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

type EditorProps = {
  html?: string;
  setHtml: React.Dispatch<React.SetStateAction<string>>;
};

export default function QuillTextEditor({ html, setHtml }: EditorProps) {
  //   const [html, setValue] = useState("");

  return (
    <div className="w-full bg-white min-h-[350px]">
      <ReactQuill
        className="h-[300px] flex flex-col"
        theme="snow"
        value={html}
        onChange={setHtml}
        modules={{
          toolbar: [
            ["bold", "italic", "underline", "strike"],
            ["blockquote", "code-block"],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ script: "sub" }, { script: "super" }],
            [{ indent: "-1" }, { indent: "+1" }],
            [{ header: [1, 2, 3, 4, 5, false] }],
            [{ color: [] }, { background: [] }],
          ],
        }}
      />
    </div>
  );
}
