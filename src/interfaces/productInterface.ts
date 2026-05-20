export interface productSchema {
  name: string;
  price: number;
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
}

export interface CartProduct extends productSchema {
  quantity: number;
}

export interface Product extends productSchema {
  supplier?: {
    id: string;
    name: string;
  };
}
