import type { SaleVenta, searchSaleSchema } from "../interfaces/salesInterface";
import api from "./client";
import { useQuery } from "@tanstack/react-query";

export function postSale(sale: SaleVenta) {
  return api.post("/sale/", sale);
}

export function getSale(id: string) {
  return useQuery({
    queryKey: ["getSale"],
    queryFn: () =>
      api.get(`/sale/ticket/${id}`)
  });
}

export async function searchSales({ limit = 20, ...params }: searchSaleSchema) {
  const { data } = await api.get("/sale/search", {
    params: { ...params, limit },
  });

  return data;
}