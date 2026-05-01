import type { salesSchema } from "../interfaces/salesInterface";
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
      api.get(`/sale/search/${id}`)
  });
}
