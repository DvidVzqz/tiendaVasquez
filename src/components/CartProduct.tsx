import type { CartProduct } from "../interfaces/productInterface";


interface Props {
  product: CartProduct;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
}

export default function ProductCard({
  product,
  onIncrease,
  onDecrease,
  onRemove,
}: Props) {
  const total = product.price * product.quantity;

  return (
    <div className="flex items-center justify-between bg-gray-800 shadow-md rounded-xl p-4 mb-3">
      {/* Info */}
      <div className="flex flex-col">
        <h2 className="text-lg font-semibold">{product.name}</h2>
        <p className="text-sm text-gray-400">
          Precio unitario: ${product.price.toFixed(2)}
        </p>
        <p className="text-sm font-medium">
          Total: ${total.toFixed(2)}
        </p>
      </div>

      {/* Controles */}
      <div className="flex items-center gap-3">
        <button
          onClick={onDecrease}
          className="px-3 py-1 bg-gray-900 hover:bg-gray-700 rounded-lg"
        >
          -
        </button>

        <span className="min-w-[30px] text-center">
          {product.quantity}
        </span>

        <button
          onClick={onIncrease}
          className="px-3 py-1 bg-gray-900 hover:bg-gray-700 rounded-lg"
        >
          +
        </button>
      </div>

      {/* Acciones */}
      <div className="flex flex-col items-end gap-2">
        <button
          onClick={onRemove}
          className="text-red-500 hover:text-red-700 text-sm"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}