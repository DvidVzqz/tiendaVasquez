import { useState } from "react";
import SearchProductCard from "../components/SearchProductCard";
import type { CartProduct, Product, searchProductSchema } from "../interfaces/productInterface";
import { searchProducts } from "../api/products";
import { useDebounce } from "../hooks/useDebounce";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { SupplierSelect } from "../components/SupplierSelect";
import { useSaleManager } from "../contexts/SaleManagerContext";
import { useProductContext } from "../contexts/ProductContext";
import { useParams } from "react-router-dom";

export default function Search() {
    const { type = 'UNIT' } = useParams();
    const { openSaleSelector } = useSaleManager();
    const { reset, setOpenForm, setValues, setCallback } = useProductContext();
    const [filters, setFilters] = useState<searchProductSchema>({});

    const debouncedFilters = useDebounce(filters, 500);
    const {
        datos: products,
        isFetchingNextPage, loadMoreRef,
        isLoading, refetch } = useInfiniteScroll<Product>({
            queryFn: ({ pageParam }) => searchProducts({
                ...debouncedFilters,
                type: type as "UNIT" | "WEIGHT",
                ...(pageParam ? { cursor: pageParam } : {}),
            }),
            queryKey: `products-search-${type}`,
            debouncedFilters
        });

    setCallback(() => refetch());

    return (
        <div className="h-screen p-1 overflow-hidden flex flex-col">

            {/* Filtros */}
            <div className="bg-black p-4 rounded-xl mb-1 grid grid-cols-1 md:grid-cols-4 gap-4">
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

                {/* Proveedor */}
                <SupplierSelect
                    selectedSupplierId={filters.supplierId || ""}
                    onSelectSupplier={(id) => {
                        setFilters(prev => {
                            const { supplierId, ...rest } = prev;
                            return { ...rest, ...(id ? { supplierId: id } : {}) };
                        });
                    }}
                />

                {/* Precios */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {/* Precio mínimo */}
                    <input
                        type="number"
                        placeholder="Mínimo"
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
                        placeholder="Máximo"
                        value={filters.maxPrice || ""}
                        onChange={(e) =>
                            setFilters((prev) => ({
                                ...prev,
                                maxPrice: Number(e.target.value),
                            }))
                        }
                        className="bg-gray-900 rounded-lg px-3 py-2 outline-none"
                    />
                </div>

                {/* Type */}
                {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <select
                        value={filters.type || ""}
                        onChange={(e) =>
                            setFilters((prev) => ({
                                ...prev,
                                type: e.target.value == "" ? null : (e.target.value as "UNIT" | "WEIGHT"),
                            }))
                        }
                        className="bg-gray-900 rounded-lg px-3 py-2 outline-none"
                    >
                        <option value="">Todos</option>
                        <option key="UNIT" value="UNIT">Unidad</option>
                        <option key="WEIGHT" value="WEIGHT">Peso</option>
                    </select> 
                </div> */}
                <button
                    onClick={() => {
                        reset();
                        setOpenForm(true);
                    }}
                    className="bg-gray-700 text-white px-5 py-3 rounded-xl font-medium hover:opacity-90 transition"
                >
                    Nuevo
                </button>
            </div>

            {/* Productos */}
            <div className="bg-black rounded-2xl shadow-md p-4 overflow-y-auto min-h-0 flex-1">
                {isLoading && (
                    <p>Cargando productos...</p>
                )}

                {products.map(product => (
                    <SearchProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={() => {
                            openSaleSelector({ ...product as CartProduct });
                        }}
                        onEdit={() => {
                            setValues(product);
                            setOpenForm(true);
                        }}
                        onDelete={() => {
                            console.log("Eliminar");
                        }}
                    />
                ))}

                <div
                    ref={loadMoreRef}
                    className="h-10 flex items-center justify-center"
                >
                    {isFetchingNextPage && (
                        <p>Cargando más...</p>
                    )}
                </div>
            </div>

        </div>
    );
}
