

import { useCMS } from "../store";
import { type CategorySecation } from "../Types";
import { CategorySection } from '@shared/sections'

interface CateggoryProductsCompponentProps extends CategorySecation {
    id: string;
}

export default function CMSCategorySecation({ category, title, id, limit }: CateggoryProductsCompponentProps) {
    const { selectedSection } = useCMS();
    const active = selectedSection?.id === id;
    const isEditable = !!active; // or pass editable prop
    return (
        <CategorySection isEditable={isEditable} category={category} title={title} limit={limit} apiUrl={import.meta.env.VITE_API_URL} />
    )
}