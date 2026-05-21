import type { Product } from "./productInterface";

export interface salesSchema {
    total: number
    createdAt: string | Date;
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
    items?: {
        productId: string,
        quantity: number,
        price: number,
        subtotal: number,
        product?: Product
    };
}