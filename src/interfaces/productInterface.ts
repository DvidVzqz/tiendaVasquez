export interface productSchema {
  name: string;
  price: number;
  type: "UNIT" | "WEIGHT";
  stock: number;
  code: string;
  supplierId: string | null;
}

export interface searchProductSchema {
  supplierId: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  name: string | null;
}
