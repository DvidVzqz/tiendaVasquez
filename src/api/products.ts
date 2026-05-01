import type { productSchema, searchProductSchema } from "../interfaces/productInterface";
import api from "./client";
import { useQuery } from "@tanstack/react-query";

export function getProduct(codigo: string) {
  return useQuery({
    queryKey: ["getProduct"],
    queryFn: () =>
      api.get("/product/", {
        params: {
          code: codigo,
        },
      }),
  });
}

export function setProduct(product: productSchema) {
  return useQuery({
    queryKey: ["setProduct"],
    queryFn: () => api.post("/product/", product),
  });
}

export function searchProduct(params: searchProductSchema) {
  return useQuery({
    queryKey: ["searchProduct"],
    queryFn: () =>
      api.get("/product/search/", {
        params,
      }),
  });
}
