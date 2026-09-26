"use client";

import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";

const Filter = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
 const params = useParams
 ();
  const locale = (params.locale || 'en') as string
  const handleFilter = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("sort", value);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex items-center justify-end gap-2 text-sm text-gray-500 my-6" >
      <span>{locale === 'ar' ? 'ترتيب حسب:' : 'Sort by:'}</span>
      <select
        name="sort"
        id="sort"
        className="ring-1 ring-gray-200 shadow-md p-1 rounded-sm"
        onChange={(e) => handleFilter(e.target.value)}
      >
        <option value="newest">{locale === 'ar' ? 'الأحدث' : 'Newest'}</option>
        <option value="oldest">{locale === 'ar' ? 'الأقدم' : 'Oldest'}</option>
        <option value="asc">{locale === 'ar' ? 'السعر: من الأقل إلى الأعلى' : 'Price: Low to High'}</option>
        <option value="desc">{locale === 'ar' ? 'السعر: من الأعلى إلى الأقل' : 'Price: High to Low'}</option>
      </select>
    </div>
  );
};

export default Filter;
