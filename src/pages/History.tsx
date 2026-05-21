import { useState } from "react";
import { useDebounce } from "../hooks/useDebounce";
import { searchSales } from "../api/sales";
import type { searchSaleSchema } from "../interfaces/salesInterface";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";

export default function History() {
    const [filters, setFilters] = useState<searchSaleSchema>({ });
    const debouncedFilters = useDebounce(filters, 500);

    const {
        datos: sales,
        isFetchingNextPage, loadMoreRef,
        isLoading, } = useInfiniteScroll({
            queryFn: ({ pageParam }) => searchSales({
                ...debouncedFilters,
                ...(pageParam ? { cursor: pageParam } : {}),
            }),
            queryKey: "sales-search",
            debouncedFilters
        });
    return (
        <div className="h-screen p-1 overflow-hidden flex flex-col">

            <div className="bg-black p-4 rounded-xl mb-1 grid grid-cols-1 md:grid-cols-4 gap-4">

                {/* Fecha inicio */}
                <input
                    type="date"
                    value={filters.startDate || ""}
                    onChange={(e) =>
                        setFilters((prev) => ({
                            ...prev,
                            startDate: e.target.value,
                        }))
                    }
                    className="bg-gray-900 rounded-lg px-3 py-2 outline-none"
                />

                {/* Fecha fin */}
                <input
                    type="date"
                    value={filters.endDate || ""}
                    onChange={(e) =>
                        setFilters((prev) => ({
                            ...prev,
                            endDate: e.target.value,
                        }))
                    }
                    className="bg-gray-900 rounded-lg px-3 py-2 outline-none"
                />

                {/* Total mínimo */}
                <input
                    type="number"
                    placeholder="Total mínimo"
                    value={filters.minTotal || ""}
                    onChange={(e) =>
                        setFilters((prev) => ({
                            ...prev,
                            minTotal: Number(e.target.value),
                        }))
                    }
                    className="bg-gray-900 rounded-lg px-3 py-2 outline-none"
                />

                {/* Total máximo */}
                <input
                    type="number"
                    placeholder="Total máximo"
                    value={filters.maxTotal || ""}
                    onChange={(e) =>
                        setFilters((prev) => ({
                            ...prev,
                            maxTotal: Number(e.target.value),
                        }))
                    }
                    className="bg-gray-900 rounded-lg px-3 py-2 outline-none"
                />
            </div>

            <div className="bg-black rounded-2xl shadow-md p-4 overflow-y-auto min-h-0 flex-1">
                {isLoading && (
                    <p>Cargando ventas...</p>
                )}

                {/* {sales.map((sale: any) => (
                    <SearchSaleCard
                        key={sale.id}
                        sale={sale}
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
                ))} */}

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