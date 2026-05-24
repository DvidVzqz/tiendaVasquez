// components/SearchProductCard.tsx

import { Edit, Trash, ShoppingCart } from "lucide-react";
import type { Product } from "../interfaces/productInterface";


interface Props {
  product: Product;
  onEdit: () => void;
  onDelete: () => void;
  onAddToCart: () => void;
}

export default function SearchProductCard({
  product,
  onEdit,
  onDelete,
  onAddToCart,
}: Props) {
  return (
    <div className="bg-gray-950 border border-gray-800 rounded-2xl p-4 mb-3 flex items-center justify-between gap-4">
      {/* Info */}
      <div className="flex items-center gap-4">

        {product.supplier && (
          <img
            src={product.supplier.photo || "https://placehold.co/80x80"}
            className="w-16 h-16 rounded-xl object-cover"
          />
        )}
        <div>
          <h2 className="text-lg font-semibold">
            {product.name}
          </h2>

          {product.supplier && (
            <p className="text-sm text-gray-500">
              {product.supplier.name}
            </p>
          )}
        </div>
      </div>

      <div className="text-right">
        <p className="text-sm text-gray-400">
          Precio
        </p>

        <p className="text-2xl font-bold text-green-400">
          ${product.price.toFixed(2)}
        </p>
      </div>
      {/* Acciones */}
      <div className="flex gap-2">
        <button
          onClick={onAddToCart}
          className="px-3 py-2 text-green-600 text-sm rounded-lg border border-gray-700"
        >
          <ShoppingCart />
        </button>

        <button
          onClick={onEdit}
          className="px-3 py-2 text-yellow-600 rounded-lg border border-gray-700 text-sm"
        >
          <Edit />
        </button>

        {/* <button
          onClick={onDelete}
          className="px-3 py-2 text-red-600 rounded-lg border border-gray-700 text-sm"
        >
          <Trash />
        </button> */}
      </div>
    </div>
  );
}