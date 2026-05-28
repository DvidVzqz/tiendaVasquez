import type { SaleVenta, searchSaleSchema } from "../interfaces/salesInterface";
import api from "./client";

export function postSale(sale: SaleVenta) {
  return api.post("/sale/", sale);
}

export function getSale(id: string) {
  return api.get(`/sale/ticket/${id}`);
}

export async function searchSales({ limit = 20, ...params }: searchSaleSchema) {
  const { data } = await api.get("/sale/search", {
    params: { ...params, limit },
  });

  return data;
}