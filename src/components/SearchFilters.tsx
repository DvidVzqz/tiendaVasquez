import type { searchProductSchema } from "../interfaces/productInterface";



interface Props {
  filters: searchProductSchema;
  setFilters: React.Dispatch<
    React.SetStateAction<searchProductSchema>
  >;
}

export default function SearchFilters({
  filters,
  setFilters,
}: Props) {
  return (
    <div className="bg-gray-800 p-4 rounded-xl mb-4 grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Nombre */}
      <input
        type="text"
        placeholder="Buscar producto..."
        value={filters.name || ""}
        onChange={(e) =>
          setFilters((prev) => ({
            ...prev,
            name: e.target.value,
          }))
        }
        className="bg-gray-900 rounded-lg px-3 py-2 outline-none"
      />

      {/* Precio mínimo */}
      <input
        type="number"
        placeholder="Precio mínimo"
        value={filters.minPrice || ""}
        onChange={(e) =>
          setFilters((prev) => ({
            ...prev,
            minPrice: Number(e.target.value),
          }))
        }
        className="bg-gray-900 rounded-lg px-3 py-2 outline-none"
      />

      {/* Precio máximo */}
      <input
        type="number"
        placeholder="Precio máximo"
        value={filters.maxPrice || ""}
        onChange={(e) =>
          setFilters((prev) => ({
            ...prev,
            maxPrice: Number(e.target.value),
          }))
        }
        className="bg-gray-900 rounded-lg px-3 py-2 outline-none"
      />

      {/* Proveedor */}
      <select
        value={filters.supplierId || ""}
        onChange={(e) =>
          setFilters((prev) => ({
            ...prev,
            supplierId: e.target.value,
          }))
        }
        className="bg-gray-900 rounded-lg px-3 py-2 outline-none"
      >
        <option value="">
          Todos los proveedores
        </option>

        {/* {suppliersMock.map((supplier) => (
          <option
            key={supplier.id}
            value={supplier.id}
          >
            {supplier.name}
          </option>
        ))} */}
      </select>
    </div>
  );
}