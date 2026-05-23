export interface supplierSchema {
  name: string;
  photo?: string;
}
export interface supplier extends supplierSchema {
  id: string;
  _count?: { products: number }
  createdAt: string;
}

export interface searchsupplierSchema {
  name?: string;
  cursor?: string;
  limit?: number;
}