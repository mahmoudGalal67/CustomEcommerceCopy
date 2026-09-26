"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import Link from "next/link";

import useDebounce from "./useDebounce";
import { useGlobalSearchQuery } from "@/services/useGlobalSearchApi";

type SearchItemType = "product" | "order" | "user" | "category";

interface SearchItem {
  id: number | string;
  type: SearchItemType;
  title: string;
  url: string;
}

const searchIcons: Record<SearchItemType, string> = {
  product: "📦",
  order: "🛒",
  user: "👤",
  category: "🏷️",
};

export default function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounce(search);

  const { data = [] } = useGlobalSearchQuery(debouncedSearch, {
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    document.addEventListener("keydown", down);

    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="
          flex items-center gap-2
          h-10 px-4
          rounded-xl
          border
          bg-background
          hover:bg-muted
          transition
          mb-3
          ml-3
        "
      >
        <Search size={18} />

        <span>Search...</span>

        <kbd
          className="
            ml-auto
            rounded
            border
            px-2
            py-0.5
            text-xs
          "
        >
          Ctrl K
        </kbd>
      </button>

      {open && (
        <div
          className="fixed inset-0 bg-black/40 flex items-start justify-center pt-24 z-50"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-xl bg-muted rounded-xl shadow-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 border-b px-4 py-3">
              <Search size={18} className="text-gray-400" />

              <input
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search anything..."
                className="w-full outline-none text-sm"
              />
            </div>

            <div className="max-h-96 overflow-y-auto">
              {debouncedSearch.length < 2 ? (
                <p className="p-4 text-sm text-gray-400">
                  Type to start searching...
                </p>
              ) : data.length === 0 ? (
                <p className="p-4 text-sm text-gray-400">No results found</p>
              ) : (
                data.map((item: SearchItem) => (
                  <Link
                    href={`/${item.url}/edit`}
                    key={`${item.type}-${item.id}`}
                    onClick={() => {
                      setOpen(false);
                    }}
                    className="
                      flex items-center gap-3
                      px-4 py-1
                      cursor-pointer
                      hover:bg-gray-500
                    "
                  >
                    <span className="text-lg">{searchIcons[item.type]}</span>

                    <div>
                      <p className="text-sm font-medium">{item.title}</p>

                      <p className="text-xs text-gray-400">{item.type}</p>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
