

import { useCMS } from "../store";
import { type sliderFeaturedProductsProps } from "../Types";

import { SliderFeaturedProducts } from '@shared/sections'


interface sliderFeaturedProductsCompponentProps extends sliderFeaturedProductsProps {
    id: string;
}


export default function CMSfeaturedSliderProducts({ products, title, id, slider }: sliderFeaturedProductsCompponentProps) {
    const { selectedSection } = useCMS();
    const active = selectedSection?.id === id;
    const isEditable = !!active; // or pass editable prop
    return (
        <SliderFeaturedProducts isEditable={isEditable} products={products} title={title} slider={slider} apiUrl={import.meta.env.VITE_API_URL} />
    )
}