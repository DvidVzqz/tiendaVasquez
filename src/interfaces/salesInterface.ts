import type { Product } from "./productInterface";

export interface salesSchema {
    extra: number,
}
export interface searchSaleSchema {
    startDate?: string;
    endDate?: string;
    minTotal?: number;
    maxTotal?: number;
    cursor?: string;
    limit?: number;
}
export interface Sale extends salesSchema {
    total: number,
    createdAt: string;
    paymentMethod: "CARD" | "CASH",
    items?: {
        productId: string,
        quantity: number,
        price: number,
        subtotal: number,
        product?: Product
    }[];
}
export interface SaleVenta extends salesSchema {
    paymentMethod: "CARD" | "CASH",
    items: {
        productId: string,
        quantity: number,
    }[];
}