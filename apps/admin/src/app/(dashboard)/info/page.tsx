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
  Truck,
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

type AboutInfo = {
  description: LocalizedText;
  story: LocalizedText;
  location: LocalizedText;
  workingHours: LocalizedText;
  rights: LocalizedText;
  footerDescription: LocalizedText;
};

type Feature = {
  title: LocalizedText;
  description: LocalizedText;
};

type WhyChooseUsItem = {
  icon: string;
  title: LocalizedText;
  description: LocalizedText;
};

type ShoppingItem = {
  icon: string;
  title: LocalizedText;
  description: LocalizedText;
};

type Info = {
  about: AboutInfo;
  features: Feature[];
  whyChooseUs: WhyChooseUsItem[];
  shopping: ShoppingItem[];
};

type SettingsForm = {
  info: Info;
};

/* =========================================================
   DEFAULT VALUES
========================================================= */

const emptyLocalizedText = (): LocalizedText => ({
  en: "",
  ar: "",
});

const defaultInfo: Info = {
  about: {
    description: emptyLocalizedText(),
    story: emptyLocalizedText(),
    location: emptyLocalizedText(),
    workingHours: emptyLocalizedText(),
    rights: emptyLocalizedText(),
    footerDescription: emptyLocalizedText(),
  },

  features: [],

  whyChooseUs: [],

  shopping: [],
};
const normalizeLocalizedText = (value: unknown): LocalizedText => {
  if (!value) {
    return {
      en: "",
      ar: "",
    };
  }

  // New bilingual format
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

  // Old format
  // Automatically preserve old English content
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
   LUCIDE ICONS
========================================================= */

const ICONS: Record<string, LucideIcon> = {
  Truck,
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
          "prose prose-sm dark:prose-invert max-w-none min-h-[220px] px-4 py-3 focus:outline-none text-start",
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

//Bilingiual text field

type BilingualFieldProps = {
  englishLabel: string;
  arabicLabel: string;
  englishPlaceholder?: string;
  arabicPlaceholder?: string;
  englishRegister: any;
  arabicRegister: any;
  englishError?: string;
  arabicError?: string;
  multiline?: boolean;
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
  multiline = false,
}: BilingualFieldProps) {
  const FieldComponent = multiline ? Textarea : Input;

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

        <FieldComponent
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

        <FieldComponent
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
      <Label>Icon</Label>

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
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="flex h-10 w-10 items-center justify-center rounded-md border bg-muted/40">
            <SelectedIcon className="h-5 w-5" />
          </div>

          <span>{value}</span>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   SECTION HEADER
========================================================= */

function SectionHeader({
  title,
  description,
  onAdd,
  buttonText,
}: {
  title: string;
  description?: string;
  onAdd: () => void;
  buttonText: string;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-xl font-semibold">{title}</h2>

        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>

      <Button type="button" onClick={onAdd} cursor-pointer>
        <Plus className="mr-2 h-4 w-4" />
        {buttonText}
      </Button>
    </div>
  );
}

/* =========================================================
   FEATURE ITEM
========================================================= */

function FeatureItem({
  index,
  register,
  errors,
  onRemove,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: {
  index: number;
  register: UseFormRegister<SettingsForm>;
  errors: FieldErrors<SettingsForm>;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
}) {
  const featureErrors = errors.info?.features?.[index];

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/20">
        <CardTitle className="text-base">Feature {index + 1}</CardTitle>

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

      <CardContent className="space-y-6 pt-6">
        <BilingualField
          englishLabel="Title"
          arabicLabel="العنوان"
          englishPlaceholder="Fast and reliable delivery"
          arabicPlaceholder="توصيل سريع وموثوق"
          englishRegister={register(`info.features.${index}.title.en` as const)}
          arabicRegister={register(`info.features.${index}.title.ar` as const)}
          englishError={featureErrors?.title?.en?.message as string | undefined}
          arabicError={featureErrors?.title?.ar?.message as string | undefined}
        />

        <BilingualField
          englishLabel="Description"
          arabicLabel="الوصف"
          englishPlaceholder="Describe this feature..."
          arabicPlaceholder="اكتب وصف هذه الميزة..."
          multiline
          englishRegister={register(
            `info.features.${index}.description.en` as const,
          )}
          arabicRegister={register(
            `info.features.${index}.description.ar` as const,
          )}
          englishError={
            featureErrors?.description?.en?.message as string | undefined
          }
          arabicError={
            featureErrors?.description?.ar?.message as string | undefined
          }
        />
      </CardContent>
    </Card>
  );
}
/* =========================================================
   ICON ITEM
========================================================= */

function IconItem({
  index,
  type,
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
  type: "whyChooseUs" | "shopping";
  control: Control<SettingsForm>;
  register: UseFormRegister<SettingsForm>;
  errors: FieldErrors<SettingsForm>;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
}) {
  const base = `info.${type}.${index}` as const;

  const itemErrors =
    type === "whyChooseUs"
      ? errors.info?.whyChooseUs?.[index]
      : errors.info?.shopping?.[index];

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/20">
        <CardTitle className="text-base">
          {type === "whyChooseUs"
            ? `Reason ${index + 1}`
            : `Shopping Benefit ${index + 1}`}
        </CardTitle>

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

      <CardContent className="space-y-6 pt-6">
        {/* Icon */}
        <Controller
          name={`${base}.icon` as const}
          control={control}
          render={({ field }) => (
            <IconSelect value={field.value} onChange={field.onChange} />
          )}
        />

        {/* Title */}
        <BilingualField
          englishLabel="Title"
          arabicLabel="العنوان"
          englishPlaceholder={
            type === "whyChooseUs" ? "Trusted Quality" : "Easy Shopping"
          }
          arabicPlaceholder={
            type === "whyChooseUs" ? "جودة موثوقة" : "تسوق سهل"
          }
          englishRegister={register(`${base}.title.en` as const)}
          arabicRegister={register(`${base}.title.ar` as const)}
          englishError={itemErrors?.title?.en?.message as string | undefined}
          arabicError={itemErrors?.title?.ar?.message as string | undefined}
        />

        {/* Description */}
        <BilingualField
          englishLabel="Description"
          arabicLabel="الوصف"
          englishPlaceholder="Describe this item..."
          arabicPlaceholder="اكتب وصف هذا العنصر..."
          multiline
          englishRegister={register(`${base}.description.en` as const)}
          arabicRegister={register(`${base}.description.ar` as const)}
          englishError={
            itemErrors?.description?.en?.message as string | undefined
          }
          arabicError={
            itemErrors?.description?.ar?.message as string | undefined
          }
        />
      </CardContent>
    </Card>
  );
}

/* =========================================================
   MAIN PAGE
========================================================= */

export default function InfoSettingsPage() {
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
    watch,
    setValue,
    formState: { errors },
  } = useForm<SettingsForm>({
    defaultValues: {
      info: defaultInfo,
    },
  });

  /* =========================================================
     FIELD ARRAYS
  ========================================================= */

  const {
    fields: featureFields,
    append: appendFeature,
    remove: removeFeature,
    move: moveFeature,
  } = useFieldArray({
    control,
    name: "info.features",
  });

  const {
    fields: whyChooseUsFields,
    append: appendWhyChooseUs,
    remove: removeWhyChooseUs,
    move: moveWhyChooseUs,
  } = useFieldArray({
    control,
    name: "info.whyChooseUs",
  });

  const {
    fields: shoppingFields,
    append: appendShopping,
    remove: removeShopping,
    move: moveShopping,
  } = useFieldArray({
    control,
    name: "info.shopping",
  });

  /* =========================================================
     LOAD SETTINGS
  ========================================================= */

  useEffect(() => {
    if (!settings) return;

    const existingInfo = settings.info;

    reset({
      info: {
        about: {
          description: normalizeLocalizedText(existingInfo?.about?.description),

          story: normalizeLocalizedText(existingInfo?.about?.story),
          location: normalizeLocalizedText(existingInfo?.about?.location),
          workingHours: normalizeLocalizedText(
            existingInfo?.about?.workingHours,
          ),
          footerDescription: normalizeLocalizedText(
            existingInfo?.about?.footerDescription,
          ),
          rights: normalizeLocalizedText(existingInfo?.about?.rights),
        },

        features: (existingInfo?.features || []).map((feature: any) => ({
          title: normalizeLocalizedText(feature.title),
          description: normalizeLocalizedText(feature.description),
        })),

        whyChooseUs: (existingInfo?.whyChooseUs || []).map((item: any) => ({
          icon: item.icon || "BadgeCheck",
          title: normalizeLocalizedText(item.title),
          description: normalizeLocalizedText(item.description),
        })),

        shopping: (existingInfo?.shopping || []).map((item: any) => ({
          icon: item.icon || "ShoppingBag",
          title: normalizeLocalizedText(item.title),
          description: normalizeLocalizedText(item.description),
        })),
      },
    });
  }, [settings, reset]);

  /* =========================================================
     SUBMIT
  ========================================================= */

  const onSubmit = async (data: SettingsForm) => {
    /*
     * Your Laravel endpoint already accepts FormData.
     *
     * JSON.stringify is important here because "info"
     * is a JSON column in Laravel.
     */

    const formData = new FormData();

    formData.append("info", JSON.stringify(data.info));

    /*
     * If your Laravel update endpoint requires these fields
     * even when this page only updates info, you can append
     * them here as well.
     *
     * formData.append("site_name", settings.site_name);
     * formData.append("site_description", settings.site_description);
     */

    await updateSettings(formData);
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-muted-foreground">Loading settings...</div>
      </div>
    );
  }

  /* =========================================================
     ERROR
  ========================================================= */

  if (isError) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6">
        <h2 className="font-semibold text-destructive">
          Failed to load settings
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Please refresh the page and try again.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto max-w-6xl space-y-8 pb-20"
    >
      {/* =====================================================
          PAGE HEADER
      ====================================================== */}

      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Website Information
        </h1>

        <p className="mt-2 text-muted-foreground">
          Manage the content displayed on your About Us, Why Choose Us, and
          Shopping sections.
        </p>
      </div>

      {/* =====================================================
          ABOUT
      ====================================================== */}

      <Card>
        <CardHeader>
          <CardTitle>About Us</CardTitle>

          <p className="text-sm text-muted-foreground">
            Add the main description and story of your company.
          </p>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Description */}

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Label>About Description</Label>

                <span className="rounded-md bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-600">
                  EN
                </span>
              </div>

              <Controller
                name="info.about.description.en"
                control={control}
                render={({ field }) => (
                  <RichTextEditor
                    value={field.value}
                    onChange={field.onChange}
                    direction="ltr"
                    placeholder="Write your company description..."
                  />
                )}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-end gap-2">
                <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600">
                  AR
                </span>

                <Label>وصف الشركة</Label>
              </div>

              <Controller
                name="info.about.description.ar"
                control={control}
                render={({ field }) => (
                  <RichTextEditor
                    value={field.value}
                    onChange={field.onChange}
                    direction="rtl"
                    placeholder="اكتب وصف الشركة..."
                  />
                )}
              />
            </div>
          </div>
          {/* Location */}

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Label>our Location</Label>

                <span className="rounded-md bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-600">
                  EN
                </span>
              </div>

              <Controller
                name="info.about.location.en"
                control={control}
                render={({ field }) => (
                  <RichTextEditor
                    value={field.value}
                    onChange={field.onChange}
                    direction="ltr"
                    placeholder="Write your company location..."
                  />
                )}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-end gap-2">
                <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600">
                  AR
                </span>

                <Label>مكان الشركة</Label>
              </div>

              <Controller
                name="info.about.location.ar"
                control={control}
                render={({ field }) => (
                  <RichTextEditor
                    value={field.value}
                    onChange={field.onChange}
                    direction="rtl"
                    placeholder="اكتب مكان الشركة..."
                  />
                )}
              />
            </div>
          </div>
          {/* Working Hours */}

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Label>Working Hours</Label>

                <span className="rounded-md bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-600">
                  EN
                </span>
              </div>

              <Controller
                name="info.about.workingHours.en"
                control={control}
                render={({ field }) => (
                  <RichTextEditor
                    value={field.value}
                    onChange={field.onChange}
                    direction="ltr"
                    placeholder="Write your company Working Hours..."
                  />
                )}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-end gap-2">
                <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600">
                  AR
                </span>

                <Label>ساعات العمل</Label>
              </div>

              <Controller
                name="info.about.workingHours.ar"
                control={control}
                render={({ field }) => (
                  <RichTextEditor
                    value={field.value}
                    onChange={field.onChange}
                    direction="rtl"
                    placeholder="أكتب ساعات العمل ..."
                  />
                )}
              />
            </div>
          </div>
          {/*Footer Description */}

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Label>Footer Description</Label>

                <span className="rounded-md bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-600">
                  EN
                </span>
              </div>

              <Controller
                name="info.about.footerDescription.en"
                control={control}
                render={({ field }) => (
                  <RichTextEditor
                    value={field.value}
                    onChange={field.onChange}
                    direction="ltr"
                    placeholder="Write your Footer Description..."
                  />
                )}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-end gap-2">
                <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600">
                  AR
                </span>

                <Label>وصف اسفل الصفحة</Label>
              </div>

              <Controller
                name="info.about.footerDescription.ar"
                control={control}
                render={({ field }) => (
                  <RichTextEditor
                    value={field.value}
                    onChange={field.onChange}
                    direction="rtl"
                    placeholder="اكتب وصف اسفل الصفحة..."
                  />
                )}
              />
            </div>
          </div>
          {/* Rights */}

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Label>About Rights</Label>

                <span className="rounded-md bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-600">
                  EN
                </span>
              </div>

              <Controller
                name="info.about.rights.en"
                control={control}
                render={({ field }) => (
                  <RichTextEditor
                    value={field.value}
                    onChange={field.onChange}
                    direction="ltr"
                    placeholder="Write your Rights..."
                  />
                )}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-end gap-2">
                <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600">
                  AR
                </span>

                <Label> الحقوق</Label>
              </div>

              <Controller
                name="info.about.rights.ar"
                control={control}
                render={({ field }) => (
                  <RichTextEditor
                    value={field.value}
                    onChange={field.onChange}
                    direction="rtl"
                    placeholder="اكتب الحقوق..."
                  />
                )}
              />
            </div>
          </div>

          <Separator />

          {/* Story */}

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Label>Our Story</Label>

                <span className="rounded-md bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-600">
                  EN
                </span>
              </div>

              <Controller
                name="info.about.story.en"
                control={control}
                render={({ field }) => (
                  <RichTextEditor
                    value={field.value}
                    onChange={field.onChange}
                    direction="ltr"
                    placeholder="Tell your story..."
                  />
                )}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-end gap-2">
                <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600">
                  AR
                </span>

                <Label>قصتنا</Label>
              </div>

              <Controller
                name="info.about.story.ar"
                control={control}
                render={({ field }) => (
                  <RichTextEditor
                    value={field.value}
                    onChange={field.onChange}
                    direction="rtl"
                    placeholder="اكتب قصتنا..."
                  />
                )}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* =====================================================
          FEATURES
      ====================================================== */}

      <Card>
        <CardHeader>
          <SectionHeader
            title="Features"
            description="Highlight the main benefits and features of your store."
            buttonText="Add Feature "
            onAdd={() =>
              appendFeature({
                title: emptyLocalizedText(),
                description: emptyLocalizedText(),
              })
            }
          />
        </CardHeader>

        <CardContent className="space-y-4">
          {featureFields.length === 0 ? (
            <div className="rounded-lg border border-dashed p-10 text-center">
              <p className="text-sm text-muted-foreground">
                No features added yet.
              </p>

              <Button
                type="button"
                variant="outline"
                className="mt-4 cursor-pointer"
                onClick={() =>
                  appendFeature({
                    title: emptyLocalizedText(),
                    description: emptyLocalizedText(),
                  })
                }
              >
                <Plus className="mr-2 h-4 w-4" />
                Add your first feature
              </Button>
            </div>
          ) : (
            featureFields.map((field, index) => (
              <FeatureItem
                key={field.id}
                index={index}
                register={register}
                errors={errors}
                onRemove={() => removeFeature(index)}
                onMoveUp={() => moveFeature(index, index - 1)}
                onMoveDown={() => moveFeature(index, index + 1)}
                isFirst={index === 0}
                isLast={index === featureFields.length - 1}
              />
            ))
          )}
        </CardContent>
      </Card>

      {/* =====================================================
          WHY CHOOSE US
      ====================================================== */}

      <Card>
        <CardHeader>
          <SectionHeader
            title="Why Choose Us"
            description="Explain why customers should choose your store."
            buttonText="Add Reason"
            onAdd={() =>
              appendWhyChooseUs({
                icon: "BadgeCheck",
                title: emptyLocalizedText(),
                description: emptyLocalizedText(),
              })
            }
          />
        </CardHeader>

        <CardContent className="space-y-4">
          {whyChooseUsFields.length === 0 ? (
            <div className="rounded-lg border border-dashed p-10 text-center">
              <p className="text-sm text-muted-foreground">
                No reasons added yet.
              </p>

              <Button
                type="button"
                variant="outline"
                className="mt-4 cursor-pointer"
                onClick={() =>
                  appendWhyChooseUs({
                    icon: "BadgeCheck",
                    title: emptyLocalizedText(),
                    description: emptyLocalizedText(),
                  })
                }
              >
                <Plus className="mr-2 h-4 w-4" />
                Add your first reason
              </Button>
            </div>
          ) : (
            whyChooseUsFields.map((field, index) => (
              <IconItem
                key={field.id}
                type="whyChooseUs"
                index={index}
                control={control}
                register={register}
                errors={errors}
                onRemove={() => removeWhyChooseUs(index)}
                onMoveUp={() => moveWhyChooseUs(index, index - 1)}
                onMoveDown={() => moveWhyChooseUs(index, index + 1)}
                isFirst={index === 0}
                isLast={index === whyChooseUsFields.length - 1}
              />
            ))
          )}
        </CardContent>
      </Card>

      {/* =====================================================
          SHOPPING
      ====================================================== */}

      <Card>
        <CardHeader>
          <SectionHeader
            title="Shopping Information"
            description="Add information that helps customers understand the shopping experience."
            buttonText="Add Shopping Item "
            onAdd={() =>
              appendShopping({
                icon: "ShoppingBag",
                title: emptyLocalizedText(),
                description: emptyLocalizedText(),
              })
            }
          />
        </CardHeader>

        <CardContent className="space-y-4">
          {shoppingFields.length === 0 ? (
            <div className="rounded-lg border border-dashed p-10 text-center">
              <p className="text-sm text-muted-foreground">
                No shopping information added yet.
              </p>

              <Button
                type="button"
                variant="outline"
                className="mt-4 cursor-pointer"
                onClick={() =>
                  appendShopping({
                    icon: "ShoppingBag",
                    title: emptyLocalizedText(),
                    description: emptyLocalizedText(),
                  })
                }
              >
                <Plus className="mr-2 h-4 w-4" />
                Add your first item
              </Button>
            </div>
          ) : (
            shoppingFields.map((field, index) => (
              <IconItem
                key={field.id}
                type="shopping"
                index={index}
                control={control}
                register={register}
                errors={errors}
                onRemove={() => removeShopping(index)}
                onMoveUp={() => moveShopping(index, index - 1)}
                onMoveDown={() => moveShopping(index, index + 1)}
                isFirst={index === 0}
                isLast={index === shoppingFields.length - 1}
              />
            ))
          )}
        </CardContent>
      </Card>

      {/* =====================================================
          SAVE
      ====================================================== */}

      <Card className="sticky bottom-4 z-20 shadow-lg">
        <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {updateSuccess && (
              <p className="text-sm font-medium text-green-600">
                Settings updated successfully.
              </p>
            )}

            {updateError && (
              <p className="text-sm font-medium text-destructive">
                Failed to update settings.
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
            {updateLoading ? "Saving..." : "Save Information"}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
