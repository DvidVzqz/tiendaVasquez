export type paymentMethodType = "CARD" | "CASH";
export interface salesSchema {
    extra: number,
    comision: number,
    paymentMethod: paymentMethodType,
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
    id: string,
    total: number,
    createdAt: string | Date;
}
export interface SaleTicket extends Sale {
    items: {
        name: string,
        quantity: number,
        price: number,
        subtotal: number,
    }[];
}
export interface SaleVenta extends salesSchema {
    items: {
        productId: string,
        quantity: number,
    }[];
}
