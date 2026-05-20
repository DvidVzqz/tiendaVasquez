// components/SearchProductCard.tsx

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
    <div className="flex items-center justify-between bg-gray-800 shadow-md rounded-xl p-4 mb-3">
      {/* Info */}
      <div className="flex flex-col">
        <h2 className="text-lg font-semibold">
          {product.name}
        </h2>

        <p className="text-sm text-gray-400">
          ${product.price.toFixed(2)}
        </p>

        {product.supplier && (
          <p className="text-sm text-gray-500">
            {product.supplier.name}
          </p>
        )}
      </div>

      {/* Acciones */}
      <div className="flex gap-2">
        <button
          onClick={onAddToCart}
          className="px-3 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm"
        >
          Agregar
        </button>

        <button
          onClick={onEdit}
          className="px-3 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-sm"
        >
          Editar
        </button>

        <button
          onClick={onDelete}
          className="px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}