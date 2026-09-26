'use client'

import { CategorySection } from '@shared/sections'


export default function ClientCategorySecation({ category, title, limit }: any) {
    return (
        <CategorySection category={category} title={title} limit={limit} apiUrl={process.env.NEXT_PUBLIC_API_URL} />
    )
}