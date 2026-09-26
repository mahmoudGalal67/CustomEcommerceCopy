"use client";

import { useEffect } from "react";
import {
  useForm,
  useFieldArray,
  Controller,
  type Control,
  type UseFormRegister,
  type FieldErrors,
} from "react-hook-form";

import {
  useGetSettingsQuery,
  useUpdateSettingsMutation,
} from "@/services/SettingsApi";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

import {
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Undo,
  Redo,
  Link as LinkIcon,
  FileText,
  ShieldCheck,
  CreditCard,
  Package,
  ShoppingBag,
  Heart,
  Star,
  Clock,
  Headphones,
  BadgeCheck,
  RotateCcw,
  Lock,
  Sparkles,
  Users,
  Award,
  CircleCheck,
  Store,
  Gift,
  Tag,
  Percent,
  Wallet,
  MapPin,
  Phone,
  Mail,
  Truck,
  type LucideIcon,
} from "lucide-react";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";

/* =========================================================
   TYPES
========================================================= */

type LocalizedText = {
  en: string;
  ar: string;
};

type TermsItem = {
  icon: string;
  title: LocalizedText;
  description: LocalizedText;
};

type SettingsForm = {
  terms: TermsItem[];
};

/* =========================================================
   DEFAULTS
========================================================= */

const emptyLocalizedText = (): LocalizedText => ({
  en: "",
  ar: "",
});

const defaultTermsItem = (): TermsItem => ({
  icon: "FileText",
  title: emptyLocalizedText(),
  description: emptyLocalizedText(),
});

/* =========================================================
   NORMALIZE LOCALIZED TEXT
========================================================= */

const normalizeLocalizedText = (value: unknown): LocalizedText => {
  if (!value) {
    return {
      en: "",
      ar: "",
    };
  }

  /*
   * New bilingual format
   */
  if (
    typeof value === "object" &&
    value !== null &&
    "en" in value &&
    "ar" in value
  ) {
    const localized = value as {
      en?: unknown;
      ar?: unknown;
    };

    return {
      en: typeof localized.en === "string" ? localized.en : "",
      ar: typeof localized.ar === "string" ? localized.ar : "",
    };
  }

  /*
   * Old format
   *
   * If terms were previously stored as a simple string,
   * preserve it as English.
   */
  if (typeof value === "string") {
    return {
      en: value,
      ar: "",
    };
  }

  return {
    en: "",
    ar: "",
  };
};

/* =========================================================
   ICONS
========================================================= */

const ICONS: Record<string, LucideIcon> = {
  FileText,
  ShieldCheck,
  CreditCard,
  Package,
  ShoppingBag,
  Heart,
  Star,
  Clock,
  Headphones,
  BadgeCheck,
  RotateCcw,
  Lock,
  Sparkles,
  Users,
  Award,
  CircleCheck,
  Store,
  Gift,
  Tag,
  Percent,
  Wallet,
  MapPin,
  Phone,
  Mail,
  Truck,
};

const iconOptions = Object.keys(ICONS);

/* =========================================================
   RICH TEXT EDITOR
========================================================= */

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  direction?: "ltr" | "rtl";
};

function RichTextEditor({
  value,
  onChange,
  placeholder = "Write something...",
  direction = "ltr",
}: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,

    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
      }),
    ],

    content: value,

    editorProps: {
      attributes: {
        dir: direction,
        class:
          "prose prose-sm dark:prose-invert max-w-none min-h-[260px] px-4 py-3 focus:outline-none text-start",
      },
    },

    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;

    const currentContent = editor.getHTML();

    if (currentContent !== value) {
      editor.commands.setContent(value || "", {
        emitUpdate: false,
      });
    }
  }, [editor, value]);

  if (!editor) {
    return null;
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-background">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 border-b bg-muted/30 p-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "bg-muted" : ""}
        >
          <Bold className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "bg-muted" : ""}
        >
          <Italic className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={editor.isActive("underline") ? "bg-muted" : ""}
        >
          <UnderlineIcon className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="mx-1 h-6" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={editor.isActive("heading", { level: 2 }) ? "bg-muted" : ""}
        >
          H2
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={editor.isActive("heading", { level: 3 }) ? "bg-muted" : ""}
        >
          H3
        </Button>

        <Separator orientation="vertical" className="mx-1 h-6" />

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? "bg-muted" : ""}
        >
          <List className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive("orderedList") ? "bg-muted" : ""}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="mx-1 h-6" />

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => {
            const url = window.prompt("Enter URL");

            if (url) {
              editor
                .chain()
                .focus()
                .extendMarkRange("link")
                .setLink({ href: url })
                .run();
            }
          }}
        >
          <LinkIcon className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().undo().run()}
        >
          <Undo className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().redo().run()}
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      {/* Editor */}
      <div className="relative">
        {!value && (
          <div
            dir={direction}
            className={`pointer-events-none absolute top-3 px-4 text-sm text-muted-foreground ${
              direction === "rtl" ? "right-0" : "left-0"
            }`}
          >
            {placeholder}
          </div>
        )}

        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

/* =========================================================
   BILINGUAL FIELD
========================================================= */

type BilingualFieldProps = {
  englishLabel: string;
  arabicLabel: string;
  englishPlaceholder?: string;
  arabicPlaceholder?: string;
  englishRegister: any;
  arabicRegister: any;
  englishError?: string;
  arabicError?: string;
};

function BilingualField({
  englishLabel,
  arabicLabel,
  englishPlaceholder,
  arabicPlaceholder,
  englishRegister,
  arabicRegister,
  englishError,
  arabicError,
}: BilingualFieldProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* English */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label>{englishLabel}</Label>

          <span className="rounded-md bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-600">
            EN
          </span>
        </div>

        <Input
          dir="ltr"
          placeholder={englishPlaceholder}
          className="text-left"
          {...englishRegister}
        />

        {englishError && (
          <p className="text-xs text-destructive">{englishError}</p>
        )}
      </div>

      {/* Arabic */}
      <div className="space-y-2">
        <div className="flex items-center justify-end gap-2">
          <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600">
            AR
          </span>

          <Label>{arabicLabel}</Label>
        </div>

        <Input
          dir="rtl"
          placeholder={arabicPlaceholder}
          className="text-right"
          {...arabicRegister}
        />

        {arabicError && (
          <p className="text-xs text-destructive">{arabicError}</p>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   ICON SELECT
========================================================= */

type IconSelectProps = {
  value: string;
  onChange: (value: string) => void;
};

function IconSelect({ value, onChange }: IconSelectProps) {
  const SelectedIcon = value ? ICONS[value] : null;

  return (
    <div className="space-y-2">
      <Label>Section Icon</Label>

      <div className="flex gap-3">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="
            flex h-10 w-full rounded-md border border-input
            bg-background px-3 py-2 text-sm
            ring-offset-background
            focus:outline-none
            focus:ring-2
            focus:ring-ring
            focus:ring-offset-2
          "
        >
          <option value="">Select an icon</option>

          {iconOptions.map((iconName) => (
            <option key={iconName} value={iconName}>
              {iconName}
            </option>
          ))}
        </select>

        {SelectedIcon && (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border bg-muted/40">
            <SelectedIcon className="h-5 w-5" />
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   TERMS ITEM
========================================================= */

function TermsItemCard({
  index,
  control,
  register,
  errors,
  onRemove,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: {
  index: number;
  control: Control<SettingsForm>;
  register: UseFormRegister<SettingsForm>;
  errors: FieldErrors<SettingsForm>;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
}) {
  const itemErrors = errors.terms?.[index];

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/20">
        <CardTitle className="text-base">Terms Section {index + 1}</CardTitle>

        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onMoveUp}
            disabled={isFirst}
          >
            <ChevronUp className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onMoveDown}
            disabled={isLast}
          >
            <ChevronDown className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onRemove}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-8 pt-6">
        {/* Icon */}
        <Controller
          name={`terms.${index}.icon`}
          control={control}
          render={({ field }) => (
            <IconSelect value={field.value} onChange={field.onChange} />
          )}
        />

        <Separator />

        {/* Title */}
        <BilingualField
          englishLabel="Section Title"
          arabicLabel="عنوان القسم"
          englishPlaceholder="Privacy and Data Protection"
          arabicPlaceholder="الخصوصية وحماية البيانات"
          englishRegister={register(`terms.${index}.title.en`)}
          arabicRegister={register(`terms.${index}.title.ar`)}
          englishError={itemErrors?.title?.en?.message as string | undefined}
          arabicError={itemErrors?.title?.ar?.message as string | undefined}
        />

        <Separator />

        {/* Description */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* English */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Label>Content</Label>

              <span className="rounded-md bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-600">
                EN
              </span>
            </div>

            <Controller
              name={`terms.${index}.description.en`}
              control={control}
              render={({ field }) => (
                <RichTextEditor
                  value={field.value}
                  onChange={field.onChange}
                  direction="ltr"
                  placeholder="Write the terms and conditions..."
                />
              )}
            />
          </div>

          {/* Arabic */}
          <div className="space-y-3">
            <div className="flex items-center justify-end gap-2">
              <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600">
                AR
              </span>

              <Label>المحتوى</Label>
            </div>

            <Controller
              name={`terms.${index}.description.ar`}
              control={control}
              render={({ field }) => (
                <RichTextEditor
                  value={field.value}
                  onChange={field.onChange}
                  direction="rtl"
                  placeholder="اكتب الشروط والأحكام..."
                />
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* =========================================================
   MAIN PAGE
========================================================= */

export default function TermsSettingsPage() {
  const { data: settings, isLoading, isError } = useGetSettingsQuery(undefined);

  const [
    updateSettings,
    {
      isLoading: updateLoading,
      isError: updateError,
      isSuccess: updateSuccess,
    },
  ] = useUpdateSettingsMutation();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SettingsForm>({
    defaultValues: {
      terms: [],
    },
  });

  /* =========================================================
     FIELD ARRAY
  ========================================================= */

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "terms",
  });

  /* =========================================================
     LOAD EXISTING TERMS
  ========================================================= */

  useEffect(() => {
    if (!settings) return;

    const existingTerms = Array.isArray(settings.terms) ? settings.terms : [];

    reset({
      terms: existingTerms.map((item: any) => ({
        icon: item?.icon || "FileText",

        title: normalizeLocalizedText(item?.title),

        description: normalizeLocalizedText(item?.description),
      })),
    });
  }, [settings, reset]);

  /* =========================================================
     SUBMIT
  ========================================================= */

  const onSubmit = async (data: SettingsForm) => {
    const formData = new FormData();

    /*
     * Only send terms.
     *
     * Your Laravel controller already supports
     * partial settings updates.
     */
    formData.append("terms", JSON.stringify(data.terms));

    await updateSettings(formData);
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-muted-foreground">Loading terms...</div>
      </div>
    );
  }

  /* =========================================================
     ERROR
  ========================================================= */

  if (isError) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6">
        <h2 className="font-semibold text-destructive">Failed to load terms</h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Please refresh the page and try again.
        </p>
      </div>
    );
  }

  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto max-w-6xl space-y-8 pb-20"
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Terms & Conditions
        </h1>

        <p className="mt-2 text-muted-foreground">
          Manage your Terms & Conditions content in English and Arabic.
        </p>
      </div>

      {/* Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>Terms & Conditions Content</CardTitle>

          <p className="text-sm text-muted-foreground">
            Create and organize the sections displayed on your Terms &
            Conditions page.
          </p>
        </CardHeader>

        <CardContent>
          <div className="rounded-lg border bg-muted/30 p-4">
            <div className="flex gap-3">
              <FileText className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

              <div>
                <p className="font-medium">Bilingual content</p>

                <p className="mt-1 text-sm text-muted-foreground">
                  Each section can have separate English and Arabic titles and
                  content. You can also reorder sections using the arrows.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Terms Sections */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Terms Sections</CardTitle>

              <p className="mt-1 text-sm text-muted-foreground">
                Add the different sections of your terms and conditions.
              </p>
            </div>

            <Button
              type="button"
              onClick={() => append(defaultTermsItem())}
              className="cursor-pointer"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Section
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {fields.length === 0 ? (
            <div className="rounded-lg border border-dashed p-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <FileText className="h-6 w-6 text-muted-foreground" />
              </div>

              <h3 className="mt-4 font-semibold">No terms sections yet</h3>

              <p className="mt-1 text-sm text-muted-foreground">
                Start by adding your first Terms & Conditions section.
              </p>

              <Button
                type="button"
                variant="outline"
                className="mt-5 cursor-pointer"
                onClick={() => append(defaultTermsItem())}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add First Section
              </Button>
            </div>
          ) : (
            fields.map((field, index) => (
              <TermsItemCard
                key={field.id}
                index={index}
                control={control}
                register={register}
                errors={errors}
                onRemove={() => remove(index)}
                onMoveUp={() => move(index, index - 1)}
                onMoveDown={() => move(index, index + 1)}
                isFirst={index === 0}
                isLast={index === fields.length - 1}
              />
            ))
          )}
        </CardContent>
      </Card>

      {/* Save */}
      <Card className="sticky bottom-4 z-20 shadow-lg">
        <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {updateSuccess && (
              <p className="text-sm font-medium text-green-600">
                Terms updated successfully.
              </p>
            )}

            {updateError && (
              <p className="text-sm font-medium text-destructive">
                Failed to update terms.
              </p>
            )}

            {!updateSuccess && !updateError && (
              <p className="text-sm text-muted-foreground">
                Remember to save your changes.
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={updateLoading}
            className="min-w-[180px] cursor-pointer"
          >
            {updateLoading ? "Saving..." : "Save Terms"}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
