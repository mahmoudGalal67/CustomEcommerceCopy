import { Input } from "@/components/ui/input";

interface LocalizedInputProps {
  value?: {
    en?: string;
    ar?: string;
  };

  onChange: (value: { en: string; ar: string }) => void;

  placeholder?: string;
}

export function LocalizedInput({
  value,
  onChange,
  placeholder,
}: LocalizedInputProps) {
  return (
    <div className="space-y-2">
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-500">
          English
        </label>

        <Input
          value={value?.en ?? ""}
          placeholder={placeholder}
          onChange={(e) =>
            onChange({
              en: e.target.value,
              ar: value?.ar ?? "",
            })
          }
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-gray-500">
          العربية
        </label>

        <Input
          dir="rtl"
          value={value?.ar ?? ""}
          placeholder={placeholder}
          onChange={(e) =>
            onChange({
              en: value?.en ?? "",
              ar: e.target.value,
            })
          }
        />
      </div>
    </div>
  );
}

interface LocalizedTextareaProps {
  value?: {
    en?: string;
    ar?: string;
  };
  placeholder?: string;
  onChange: (value: { en: string; ar: string }) => void;
}

export function LocalizedTextarea({
  value,
  onChange,
  placeholder,
}: LocalizedTextareaProps) {
  return (
    <div className="space-y-2">
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-500">
          English
        </label>

        <textarea
          className="min-h-24 w-full rounded-md border p-2 text-sm"
          placeholder={placeholder}
          value={value?.en ?? ""}
          onChange={(e) =>
            onChange({
              en: e.target.value,
              ar: value?.ar ?? "",
            })
          }
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-gray-500">
          العربية
        </label>

        <textarea
          dir="rtl"
          className="min-h-24 w-full rounded-md border p-2 text-sm"
          placeholder={placeholder}
          value={value?.ar ?? ""}
          onChange={(e) =>
            onChange({
              en: value?.en ?? "",
              ar: e.target.value,
            })
          }
        />
      </div>
    </div>
  );
}
