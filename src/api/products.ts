import type { productSchema, searchProductSchema } from "../interfaces/productInterface";
import api from "./client";
import { useQuery } from "@tanstack/react-query";

export const getProduct = async (code: string) => {
  return api.get("/product/", { params: { code } });
};

export const postProduct = async (product: productSchema) => {
  return api.post("/product/", product);
};

export function putProduct(id: string, product: productSchema) {
  return api.put(`/product/${id}`, product);
}
export function setProduct(product: productSchema) {
  return useQuery({
    queryKey: ["setProduct"],
    queryFn: () => api.post("/product/", product),
  });
}

export async function searchProducts({ limit = 20, ...params }: searchProductSchema) {
  const { data } = await api.get("/product/search", {
    params: { ...params, limit },
  });

  return data;
}