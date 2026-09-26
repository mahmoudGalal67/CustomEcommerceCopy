"use client";

import { useEffect, useRef, useState } from "react";
import {
  Check,
  ChevronRight,
  Command,
  LayoutGrid,
  Search,
  Sparkles,
  X,
} from "lucide-react";

import { SECTION_REGISTRY } from "./section-types/registry";
import type { SectionType } from "./Types";

interface AddSectionModalProps {
  onSelect: (type: SectionType) => void;
  onClose: () => void;
}

export default function AddSectionModal({
  onSelect,
  onClose,
}: AddSectionModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const [search, setSearch] = useState("");

  /* -------------------------------------------------------------- */
  /* Close on outside click + ESC                                   */
  /* -------------------------------------------------------------- */

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    }

    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  /* -------------------------------------------------------------- */
  /* Filter sections                                                */
  /* -------------------------------------------------------------- */

  const filteredCategories = Object.entries(SECTION_REGISTRY)
    .map(([category, sections]) => {
      const filteredSections = sections.filter((section) =>
        section.label.toLowerCase().includes(search.toLowerCase()),
      );

      return [category, filteredSections] as const;
    })
    .filter(([, sections]) => sections.length > 0);

  const totalSections = Object.values(SECTION_REGISTRY).reduce(
    (total, sections) => total + sections.length,
    0,
  );

  /* -------------------------------------------------------------- */

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* ========================================================== */}
      {/* BACKDROP                                                   */}
      {/* ========================================================== */}

      <div
        className="
          absolute inset-0
          bg-slate-950/70
          backdrop-blur-md
          animate-[backdropIn_250ms_ease-out]
        "
      />

      {/* ========================================================== */}
      {/* MODAL                                                      */}
      {/* ========================================================== */}

      <div
        ref={modalRef}
        className="
          relative
          flex
          w-full
          max-w-2xl
          max-h-[88vh]
          flex-col
          overflow-hidden
          rounded-3xl
          border
          border-white/60
          bg-white
          shadow-[0_30px_100px_rgba(0,0,0,0.25)]
          animate-[modalIn_400ms_cubic-bezier(0.16,1,0.3,1)]
          dark:border-slate-700
          dark:bg-slate-950
        "
      >
        {/* ======================================================== */}
        {/* AMBIENT BACKGROUND                                       */}
        {/* ======================================================== */}

        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="
              absolute
              -right-32
              -top-32
              h-72
              w-72
              rounded-full
              bg-blue-500/10
              blur-3xl
            "
          />

          <div
            className="
              absolute
              -bottom-32
              -left-32
              h-72
              w-72
              rounded-full
              bg-violet-500/10
              blur-3xl
            "
          />

          <div
            className="
              absolute
              left-1/2
              top-0
              h-40
              w-40
              -translate-x-1/2
              rounded-full
              bg-cyan-400/5
              blur-3xl
            "
          />
        </div>

        {/* ======================================================== */}
        {/* HEADER                                                   */}
        {/* ======================================================== */}

        <div className="relative shrink-0 border-b border-slate-100 px-6 pb-5 pt-6 dark:border-slate-800">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              {/* Icon */}

              <div
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-2xl
                  bg-gradient-to-br
                  from-blue-500
                  to-violet-600
                  text-white
                  shadow-lg
                  shadow-blue-500/20
                "
              >
                <LayoutGrid className="h-6 w-6" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Add Section
                  </h2>

                  <span
                    className="
                      inline-flex
                      items-center
                      gap-1
                      rounded-full
                      border
                      border-blue-100
                      bg-blue-50
                      px-2
                      py-0.5
                      text-[10px]
                      font-semibold
                      uppercase
                      tracking-wider
                      text-blue-600
                      dark:border-blue-900
                      dark:bg-blue-950
                      dark:text-blue-400
                    "
                  >
                    <Sparkles className="h-3 w-3" />
                    Builder
                  </span>
                </div>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Choose a section to add to your page
                </p>
              </div>
            </div>

            {/* Close */}

            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="
                group
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-xl
                text-slate-400
                transition-all
                duration-200
                hover:bg-slate-100
                hover:text-slate-700
                active:scale-90
                dark:hover:bg-slate-800
                dark:hover:text-white
              "
            >
              <X className="h-5 w-5 transition-transform duration-200 group-hover:rotate-90" />
            </button>
          </div>

          {/* ====================================================== */}
          {/* SEARCH                                                  */}
          {/* ====================================================== */}

          <div className="relative mt-5">
            <Search
              className="
                pointer-events-none
                absolute
                left-4
                top-1/2
                h-4
                w-4
                -translate-y-1/2
                text-slate-400
              "
            />

            <input
              ref={searchRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search sections..."
              className="
                h-11
                w-full
                rounded-xl
                border
                border-slate-200
                bg-slate-50
                pl-11
                pr-20
                text-sm
                text-slate-800
                outline-none
                transition-all
                placeholder:text-slate-400
                focus:border-blue-400
                focus:bg-white
                focus:ring-4
                focus:ring-blue-500/10
                dark:border-slate-800
                dark:bg-slate-900
                dark:text-white
                dark:focus:border-blue-500
                dark:focus:bg-slate-900
              "
            />

            <div
              className="
                absolute
                right-3
                top-1/2
                flex
                -translate-y-1/2
                items-center
                gap-1
                rounded-lg
                border
                border-slate-200
                bg-white
                px-2
                py-1
                text-[10px]
                font-medium
                text-slate-400
                dark:border-slate-700
                dark:bg-slate-800
              "
            >
              <Command className="h-3 w-3" />
              <span>K</span>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* CONTENT                                                  */}
        {/* ======================================================== */}

        <div className="relative flex-1 overflow-y-auto px-6 py-6">
          {filteredCategories.length === 0 ? (
            /* Empty search */

            <div
              className="
                flex
                min-h-[260px]
                flex-col
                items-center
                justify-center
                text-center
              "
            >
              <div
                className="
                  flex
                  h-16
                  w-16
                  items-center
                  justify-center
                  rounded-2xl
                  bg-slate-100
                  text-slate-400
                  dark:bg-slate-900
                "
              >
                <Search className="h-7 w-7" />
              </div>

              <h3 className="mt-4 font-semibold text-slate-800 dark:text-white">
                No sections found
              </h3>

              <p className="mt-1 text-sm text-slate-400">
                Try searching for another section
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {filteredCategories.map(([category, sections], categoryIndex) => (
                <section key={category}>
                  {/* Category heading */}

                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />

                      <h3
                        className="
                            text-xs
                            font-bold
                            uppercase
                            tracking-[0.14em]
                            text-slate-500
                            dark:text-slate-400
                          "
                      >
                        {category}
                      </h3>
                    </div>

                    <span
                      className="
                          rounded-full
                          bg-slate-100
                          px-2
                          py-0.5
                          text-[10px]
                          font-semibold
                          text-slate-400
                          dark:bg-slate-900
                        "
                    >
                      {sections.length}
                    </span>
                  </div>

                  {/* Section cards */}

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {sections.map((sec, index) => {
                      const Icon = sec.icon;
                      return (
                        <button
                          key={sec.type}
                          type="button"
                          onClick={() => onSelect(sec.type as SectionType)}
                          style={{
                            animationDelay: `${
                              categoryIndex * 70 + index * 45
                            }ms`,
                          }}
                          className="
                              group
                              relative
                              overflow-hidden
                              rounded-2xl
                              border
                              border-slate-200
                              bg-white
                              p-4
                              text-left
                              opacity-0
                              shadow-sm
                              transition-all
                              duration-300
                              animate-[cardIn_450ms_cubic-bezier(0.16,1,0.3,1)_forwards]
                              hover:-translate-y-1
                              hover:border-blue-300
                              hover:shadow-xl
                              hover:shadow-blue-500/10
                              active:translate-y-0
                              active:scale-[0.98]
                              dark:border-slate-800
                              dark:bg-slate-900/80
                              dark:hover:border-blue-700
                            "
                        >
                          {/* Hover glow */}

                          <div
                            className="
                                pointer-events-none
                                absolute
                                -right-10
                                -top-10
                                h-24
                                w-24
                                rounded-full
                                bg-blue-500/10
                                opacity-0
                                blur-2xl
                                transition-opacity
                                duration-500
                                group-hover:opacity-100
                              "
                          />

                          <div className="relative flex items-center gap-3">
                            {/* Section icon */}

                            <div
                              className="
                                  flex
                                  h-11
                                  w-11
                                  shrink-0
                                  items-center
                                  justify-center
                                  rounded-xl
                                  bg-gradient-to-br
                                  from-slate-100
                                  to-slate-50
                                  text-slate-500
                                  transition-all
                                  duration-300
                                  group-hover:scale-110
                                  group-hover:from-blue-50
                                  group-hover:to-violet-50
                                  group-hover:text-blue-600
                                  dark:from-slate-800
                                  dark:to-slate-900
                                  dark:text-slate-400
                                  dark:group-hover:from-blue-950
                                  dark:group-hover:to-violet-950
                                  dark:group-hover:text-blue-400
                                "
                            >
                              {<Icon className="h-5 w-5" />}
                            </div>

                            {/* Text */}

                            <div className="min-w-0 flex-1">
                              <p
                                className="
                                    truncate
                                    text-sm
                                    font-semibold
                                    text-slate-800
                                    transition-colors
                                    group-hover:text-blue-600
                                    dark:text-slate-100
                                    dark:group-hover:text-blue-400
                                  "
                              >
                                {sec.label}
                              </p>

                              <p className="mt-0.5 text-xs text-slate-400">
                                Add to page
                              </p>
                            </div>

                            {/* Arrow */}

                            <div
                              className="
                                  flex
                                  h-8
                                  w-8
                                  shrink-0
                                  items-center
                                  justify-center
                                  rounded-lg
                                  text-slate-300
                                  transition-all
                                  duration-300
                                  group-hover:translate-x-1
                                  group-hover:bg-blue-50
                                  group-hover:text-blue-500
                                  dark:group-hover:bg-blue-950
                                "
                            >
                              <ChevronRight className="h-4 w-4" />
                            </div>
                          </div>

                          {/* Bottom progress line */}

                          <div
                            className="
                                absolute
                                bottom-0
                                left-0
                                h-[2px]
                                w-0
                                bg-gradient-to-r
                                from-blue-500
                                to-violet-500
                                transition-all
                                duration-500
                                group-hover:w-full
                              "
                          />
                        </button>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* FOOTER                                                   */}
        {/* ======================================================== */}

        <div
          className="
            relative
            flex
            shrink-0
            items-center
            justify-between
            border-t
            border-slate-100
            bg-slate-50/70
            px-6
            py-3
            dark:border-slate-800
            dark:bg-slate-900/50
          "
        >
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Check className="h-3.5 w-3.5 text-emerald-500" />

            <span>{totalSections} sections available</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              rounded-lg
              px-3
              py-1.5
              text-xs
              font-medium
              text-slate-500
              transition-colors
              hover:bg-white
              hover:text-slate-800
              dark:hover:bg-slate-800
              dark:hover:text-white
            "
          >
            Cancel
          </button>
        </div>
      </div>

      {/* ========================================================== */}
      {/* ANIMATIONS                                                 */}
      {/* ========================================================== */}

      <style>{`
        @keyframes backdropIn {
          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }
        }

        @keyframes modalIn {
          from {
            opacity: 0;
            transform: translateY(24px) scale(0.96);
            filter: blur(6px);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
        }

        @keyframes cardIn {
          from {
            opacity: 0;
            transform: translateY(12px) scale(0.97);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}
