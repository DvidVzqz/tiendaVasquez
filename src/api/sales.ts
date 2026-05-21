import type { salesSchema, searchSaleSchema } from "../interfaces/salesInterface";
import api from "./client";
import { useQuery } from "@tanstack/react-query";


export function setSale(sale: salesSchema) {
  return useQuery({
    queryKey: ["setSale"],
    queryFn: () => api.post("/sale/", sale),
  });
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