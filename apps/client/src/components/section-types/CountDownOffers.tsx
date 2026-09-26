import { CountDownOffers } from "@shared/sections";

export default function CountdownOffers({ offers, title }: any) {
  return (
    <CountDownOffers
      offers={offers}
      title={title}
      apiUrl={process.env.NEXT_PUBLIC_URL}
    />
  );
}
