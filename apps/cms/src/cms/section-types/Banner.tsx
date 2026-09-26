

import { useCMS } from "../store";

import { type BannerProps } from "../Types";


import { Banner } from '@shared/sections'

interface BannerCompponentProps extends BannerProps {
    id: string;
}


export default function CMSBanner({ slides, id }: BannerCompponentProps) {
    const { selectedSection } = useCMS();
    const active = selectedSection?.id === id;
    const isEditable = !!active; // or pass editable prop

    return (
        <Banner slides={slides} isEditable={isEditable} apiUrl={import.meta.env.VITE_API_URL} />
    )
}