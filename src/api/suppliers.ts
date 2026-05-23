import type { searchsupplierSchema } from "../interfaces/supplierInterface";
import api from "./client";


export function postSupplier(supplier: FormData) {
  return api.post("/supplier/", supplier, {
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  });
}
export function putSupplier(id: string, supplier: FormData) {
  return api.put(`/supplier/${id}`, supplier, {
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  });
}

// export function getSupplier(id: string) {
//   return api.get(`/supplier/${id}`);
// }

export async function searchSuppliers({ limit = 20, ...params }: searchsupplierSchema) {
  const { data } = await api.get("/supplier/search", {
    params: { ...params, limit },
  });

  return data;
}