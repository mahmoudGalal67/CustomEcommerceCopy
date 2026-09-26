"use client";

import {
  useRouter,
  usePathname,
  useSearchParams,
  useParams,
} from "next/navigation";
import { Search } from "lucide-react";
import { useState } from "react";

const SearchBar = ({ dict }: { dict: any }) => {
  const params = useParams();
  const locale = (params.locale || "en") as string;
  const router = useRouter();

  const [value, setValue] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const params = new URLSearchParams();
      params.set("search", value || "");

      // Force navigate to /products
      router.push(`/${locale}/products?${params.toString()}`, {
        scroll: false,
      });
    }
  };

  return (
    <div className="hidden sm:flex items-center gap-2 rounded-md ring-1 ring-gray-200 px-2 py-1 shadow-md">
      <Search className="w-4 h-4 text-gray-500" />
      <input
        id="search"
        placeholder={dict.Navbar.search}
        className="text-sm outline-0"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown} // 🔑 handle Enter press
      />
    </div>
  );
};

export default SearchBar;
