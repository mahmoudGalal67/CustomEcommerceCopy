export type Order = {
    id: number;
    subtotal: number;
    order_id: number;
    status: "pending" | "processing" | "shipped" | "completed" | "cancelled";
    order: {
        name: string;
        email: string;
        phone: string;
        city: string;
        payment_status: "paid" | "pending" | "failed";
    };
    items: {
        id: number;
        variant: {
            product: { name: string };
        };
    }[];
};
