'use client'

import { useGetProductsQuery } from '@/services/ProductsApi';



export default function CategorySecation({ isEditable, category, title, limit, apiUrl }: any) {
    const { data: FilteredPRoducts } = useGetProductsQuery({ category: category, limit: limit });
    return (
        <section className={isEditable ? "pointer-events-none" : "my-2"}>
            <div className="bg-white">
                <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900">{title}</h2>

                    <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                        {FilteredPRoducts?.data?.map((item: any) => (
                            <div key={item.id} className="group relative">
                                <img
                                    alt={item.imageAlt}
                                    src={item.base_images ? `${apiUrl}/storage/${item.base_images[0]}` : `${apiUrl}/storage/${item.variants[0].images[0].file_path}`}
                                    className="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80"
                                />
                                <div className="mt-4 flex justify-between">
                                    <div>
                                        <h3 className="text-sm text-gray-700">
                                            <span aria-hidden="true" className="absolute inset-0" />
                                            {item.translations[0].name}
                                        </h3>
                                        <p className="mt-1 text-sm text-gray-500">{item.translations[0].description}</p>
                                    </div>
                                    <p className="text-sm font-medium text-gray-900">$ {item.base_price !== '0.00' ? item.base_price : item.variants[0]?.price} </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}