import type { Sale } from "../interfaces/salesInterface";

interface Props {
  sale: Sale;
  onEdit: () => void;
  onDelete: () => void;
  onAddToCart: () => void;
}

export default function SearchSaleCard({
  sale,
  onEdit,
  onDelete,
  onAddToCart,
}: Props) {
  sale.createdAt = new Date(sale.createdAt);
  return (
    <div className="flex items-center justify-between bg-gray-800 shadow-md rounded-xl p-4 mb-3">
      {/* Info */}
      <div className="flex flex-col">
        <h2 className="text-lg font-semibold">
          Total: {sale.total.toFixed(2)}
        </h2>

        <p className="text-sm text-gray-400">
          Fecha: {sale.createdAt.toLocaleDateString()} {sale.createdAt.toLocaleTimeString()}
        </p>
      </div>

      {/* Acciones */}
      <div className="flex gap-2">
        <button
          onClick={onAddToCart}
          className="px-3 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm"
        >
          Ver
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