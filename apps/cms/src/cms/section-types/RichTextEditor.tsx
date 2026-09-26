"use client";

import { useEffect, useState } from "react";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";

import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Heading3,
  Link as LinkIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
} from "lucide-react";

interface LocalizedText {
  en?: string;
  ar?: string;
}

interface RichTextEditorProps {
  value: LocalizedText;
  onChange: (value: LocalizedText) => void;
}

type EditorLanguage = "en" | "ar";

export default function RichTextEditor({
  value,
  onChange,
}: RichTextEditorProps) {
  const [language, setLanguage] = useState<EditorLanguage>("en");

  const currentValue = value?.[language] ?? "";

  const editor = useEditor({
    immediatelyRender: false,

    extensions: [
      StarterKit,

      Link.configure({
        openOnClick: false,
      }),

      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],

    content: currentValue,

    onUpdate: ({ editor }) => {
      const html = editor.getHTML();

      onChange({
        ...value,
        [language]: html,
      });
    },
  });

  /*
   * When the language changes, load that language's
   * content into TipTap.
   */
  useEffect(() => {
    if (!editor) return;

    const nextContent = value?.[language] ?? "";

    if (editor.getHTML() !== nextContent) {
      editor.commands.setContent(nextContent, false);
    }
  }, [language, editor, value]);

  if (!editor) {
    return null;
  }

  const setEditorLanguage = (nextLanguage: EditorLanguage) => {
    if (nextLanguage === language) return;

    /*
     * Save the current editor content before switching.
     */
    const currentHtml = editor.getHTML();

    onChange({
      ...value,
      [language]: currentHtml,
    });

    setLanguage(nextLanguage);
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;

    const url = window.prompt("Enter URL", previousUrl || "");

    if (url === null) return;

    if (url === "") {
      editor.chain().focus().unsetLink().run();

      return;
    }

    editor.chain().focus().setLink({ href: url }).run();
  };

  return (
    <div
      className="overflow-hidden rounded-xl border border-border bg-background"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      {/* ====================================================== */}
      {/* LANGUAGE TABS */}
      {/* ====================================================== */}

      <div className="flex items-center border-b bg-muted/40">
        <button
          type="button"
          onClick={() => setEditorLanguage("en")}
          className={`flex-1 px-4 py-3 text-sm font-semibold transition-colors ${
            language === "en"
              ? "bg-background text-primary shadow-sm"
              : "text-muted-foreground hover:bg-muted"
          }`}
        >
          🇬🇧 English
        </button>

        <button
          type="button"
          onClick={() => setEditorLanguage("ar")}
          className={`flex-1 px-4 py-3 text-sm font-semibold transition-colors ${
            language === "ar"
              ? "bg-background text-primary shadow-sm"
              : "text-muted-foreground hover:bg-muted"
          }`}
        >
          🇸🇦 العربية
        </button>
      </div>

      {/* ====================================================== */}
      {/* TOOLBAR */}
      {/* ====================================================== */}

      <div
        className="flex flex-wrap items-center gap-1 border-b bg-muted/40 p-2"
        dir="ltr"
      >
        {/* Bold */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`rounded-md p-2 hover:bg-muted ${
            editor.isActive("bold") ? "bg-muted" : ""
          }`}
        >
          <Bold className="h-4 w-4" />
        </button>

        {/* Italic */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`rounded-md p-2 hover:bg-muted ${
            editor.isActive("italic") ? "bg-muted" : ""
          }`}
        >
          <Italic className="h-4 w-4" />
        </button>

        <div className="mx-1 h-6 w-px bg-border" />

        {/* H2 */}
        <button
          type="button"
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleHeading({
                level: 2,
              })
              .run()
          }
          className={`rounded-md p-2 hover:bg-muted ${
            editor.isActive("heading", {
              level: 2,
            })
              ? "bg-muted"
              : ""
          }`}
        >
          <Heading2 className="h-4 w-4" />
        </button>

        {/* H3 */}
        <button
          type="button"
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleHeading({
                level: 3,
              })
              .run()
          }
          className={`rounded-md p-2 hover:bg-muted ${
            editor.isActive("heading", {
              level: 3,
            })
              ? "bg-muted"
              : ""
          }`}
        >
          <Heading3 className="h-4 w-4" />
        </button>

        <div className="mx-1 h-6 w-px bg-border" />

        {/* Bullet List */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`rounded-md p-2 hover:bg-muted ${
            editor.isActive("bulletList") ? "bg-muted" : ""
          }`}
        >
          <List className="h-4 w-4" />
        </button>

        {/* Ordered List */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`rounded-md p-2 hover:bg-muted ${
            editor.isActive("orderedList") ? "bg-muted" : ""
          }`}
        >
          <ListOrdered className="h-4 w-4" />
        </button>

        <div className="mx-1 h-6 w-px bg-border" />

        {/* Left */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={`rounded-md p-2 hover:bg-muted ${
            editor.isActive({
              textAlign: "left",
            })
              ? "bg-muted"
              : ""
          }`}
        >
          <AlignLeft className="h-4 w-4" />
        </button>

        {/* Center */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={`rounded-md p-2 hover:bg-muted ${
            editor.isActive({
              textAlign: "center",
            })
              ? "bg-muted"
              : ""
          }`}
        >
          <AlignCenter className="h-4 w-4" />
        </button>

        {/* Right */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={`rounded-md p-2 hover:bg-muted ${
            editor.isActive({
              textAlign: "right",
            })
              ? "bg-muted"
              : ""
          }`}
        >
          <AlignRight className="h-4 w-4" />
        </button>

        <div className="mx-1 h-6 w-px bg-border" />

        {/* Link */}
        <button
          type="button"
          onClick={setLink}
          className={`rounded-md p-2 hover:bg-muted ${
            editor.isActive("link") ? "bg-muted" : ""
          }`}
        >
          <LinkIcon className="h-4 w-4" />
        </button>

        <div className="mx-1 h-6 w-px bg-border" />

        {/* Undo */}
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          className="rounded-md p-2 hover:bg-muted"
        >
          <Undo className="h-4 w-4" />
        </button>

        {/* Redo */}
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          className="rounded-md p-2 hover:bg-muted"
        >
          <Redo className="h-4 w-4" />
        </button>
      </div>

      {/* ====================================================== */}
      {/* EDITOR */}
      {/* ====================================================== */}

      <EditorContent
        editor={editor}
        className="
          min-h-[350px]
          p-6
          outline-none

          [&_.ProseMirror]:min-h-[300px]
          [&_.ProseMirror]:outline-none

          [&_.ProseMirror_h2]:mb-4
          [&_.ProseMirror_h2]:mt-6
          [&_.ProseMirror_h2]:text-3xl
          [&_.ProseMirror_h2]:font-bold

          [&_.ProseMirror_h3]:mb-3
          [&_.ProseMirror_h3]:mt-5
          [&_.ProseMirror_h3]:text-2xl
          [&_.ProseMirror_h3]:font-semibold

          [&_.ProseMirror_p]:my-3
          [&_.ProseMirror_p]:leading-7

          [&_.ProseMirror_ul]:my-4
          [&_.ProseMirror_ul]:list-disc
          [&_.ProseMirror_ul]:pl-6

          [&_.ProseMirror_ol]:my-4
          [&_.ProseMirror_ol]:list-decimal
          [&_.ProseMirror_ol]:pl-6

          [&_.ProseMirror_a]:text-primary
          [&_.ProseMirror_a]:underline
        "
      />
    </div>
  );
}
