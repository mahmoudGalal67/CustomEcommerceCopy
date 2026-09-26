"use client";

import { useState } from "react";
import { ChevronDown, LayoutDashboard, Plus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import type { LinkType } from "@/cms/Types";
import { useCMS } from "@/cms/store";

export default function Sidebar({ pageLinks }: { pageLinks: LinkType[] }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { createPage } = useCMS();

  const handleCreatePage = () => {
    createPage();

    navigate(`/admin/AddStaticPage`);
  };

  return (
    <aside>
      <div className="space-y-1">
        <div>
          {/* MENU BUTTON */}
          <button
            onClick={() => setOpen(!open)}
            className="
              w-full flex items-center justify-between
              px-2 py-2 rounded-xl
              text-sm
              hover:bg-zinc-100 dark:hover:bg-zinc-800
              transition-all
            "
          >
            <div className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4 shrink-0" />

              <span>Pages</span>
            </div>

            <ChevronDown
              className={`
                h-4 w-4 transition-transform duration-300
                ${open ? "rotate-180" : ""}
              `}
            />
          </button>

          {/* CHILDREN */}
          <div
            className={`
              grid transition-all duration-300 ease-in-out
              ${
                open
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              }
            `}
          >
            <div className="overflow-hidden">
              <div className="ml-3 space-y-1 pt-1">
                {pageLinks?.map((pageLink) => (
                  <Link
                    key={pageLink.id}
                    to={`/admin/StaticPages/${pageLink.id}`}
                    className="
                    block px-3 py-2 rounded-xl
                    text-sm
                    hover:bg-zinc-100 dark:hover:bg-zinc-800
                    transition-all cursor-pointer
                  "
                  >
                    {pageLink.title?.en}
                  </Link>
                ))}
                <button
                  onClick={handleCreatePage}
                  className=" flex items-center gap-2
                     px-3 py-2 rounded-xl
                    text-sm
                    hover:bg-zinc-100 dark:hover:bg-zinc-800
                    transition-all cursor-pointer"
                >
                  <span>Add Page</span>
                  <Plus className="h-4 w-4 shrink-0" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
