
import { CountDownOffers } from '@shared/sections'

export default function CountdownOffers({ offers, title }: any) {

    return (
        <CountDownOffers offers={offers} title={title} apiUrl={import.meta.env.VITE_API_URL} />
    );
}
