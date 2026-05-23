export interface productSchema {
  name: string;
  price: number;
  realName: string | null;
  realPrice: number | null;
  type: "UNIT" | "WEIGHT";
  stock: number;
  code: string;
  supplierId: string | null;
}

export interface searchProductSchema {
  supplierId?: string;
  minPrice?: number;
  maxPrice?: number;
  name?: string;
  cursor?: string;
  limit?: number;
  type?: "UNIT" | "WEIGHT" | null;
}

export interface Product extends productSchema {
  id: string,
  supplier?: {
    id: string;
    name: string;
  };
}

export interface CartProduct extends Product {
  quantity: number;
}
