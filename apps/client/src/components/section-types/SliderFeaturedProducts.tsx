import { SliderFeaturedProducts } from '@shared/sections'



export default function featuredSliderProducts({ products, title, id, slider }: any) {
    return (
        <SliderFeaturedProducts products={products} title={title} slider={slider} apiUrl={process.env.NEXT_PUBLIC_API_URL} />

    )
}