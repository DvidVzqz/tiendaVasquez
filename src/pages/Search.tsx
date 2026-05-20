import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import SearchFilters from "../components/SearchFilters";
import SearchProductCard from "../components/SearchProductCard";
import type { searchProductSchema } from "../interfaces/productInterface";
import { searchProducts } from "../api/products";
import { useDebounce } from "../hooks/useDebounce";

export default function Search() {
    const [filters, setFilters] = useState<searchProductSchema>({ name: "", supplierId: "" });
    const debouncedFilters = useDebounce(filters, 500);

    const {
        data: data = [],
        isLoading,
    } = useQuery({
        queryKey: ["products-search", debouncedFilters],
        queryFn: () => searchProducts(debouncedFilters),
        enabled: !!debouncedFilters.name,
    });

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">
                Buscar Productos
            </h1>

            {/* Filtros */}
            <SearchFilters
                filters={filters}
                setFilters={setFilters}
            />

            {/* Loading */}
            {isLoading && (
                <p>Cargando productos...</p>
            )}

            {/* Lista */}
            <div className="flex flex-col">
                {data.map((product: any) => (
                    <SearchProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={() => {
                            console.log("Agregar");
                        }}
                        onEdit={() => {
                            console.log("Editar");
                        }}
                        onDelete={() => {
                            console.log("Eliminar");
                        }}
                    />
                ))}
            </div>
        </div>
    );
}