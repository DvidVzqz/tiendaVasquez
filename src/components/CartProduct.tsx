import { Trash } from "lucide-react";
import type { CartProduct } from "../interfaces/productInterface";


interface Props {
  product: CartProduct;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
  onSetQuantity: (quantity: number) => void;
}

export default function ProductCard({
  product,
  onIncrease,
  onDecrease,
  onRemove,
  onSetQuantity,
}: Props) {
  let total = 0;
  if (product.type == "WEIGHT")
    total = (product.quantity * product.price) / 1000;
  else
    total = product.price * product.quantity;

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

          <p className="text-sm text-gray-400">
            Precio: ${product.price.toFixed(2)}
          </p>
          <p className="text-sm font-medium">
            Total: ${total.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Controles */}
      {product.type === "WEIGHT" ? (
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm text-gray-400">Peso:</span>

          <input
            type="number"
            placeholder="1000"
            value={product.quantity}
            onChange={(e) => onSetQuantity(Number(e.target.value))}
            className="bg-gray-900 rounded-lg px-3 py-2 outline-none"
            step="5"
            min="0"
          />
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <button
            onClick={onDecrease}
            className="px-3 py-1 bg-gray-700 hover:bg-gray-800 rounded-lg"
          >
            -
          </button>

          <span className="min-w-[30px] text-center">
            {product.quantity}
          </span>

          <button
            onClick={onIncrease}
            className="px-3 py-1 bg-gray-700 hover:bg-gray-800 rounded-lg"
          >
            +
          </button>
        </div>
      )}

      {/* Acciones */}
      <div className="flex flex-col items-end gap-2">
        <button
          onClick={onRemove}
          className="px-3 py-2 text-red-500 hover:text-red-700 text-sm rounded-lg border border-gray-700"
        >
          <Trash />
        </button>
      </div>
    </div>
  );
}