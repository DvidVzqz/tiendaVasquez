import { useState } from "react";
import { useDebounce } from "../hooks/useDebounce";
import { getSale, searchSales } from "../api/sales";
import type { Sale, SaleTicket, searchSaleSchema } from "../interfaces/salesInterface";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import SaleCard from "../components/SaleCard";
import { BaseModal } from "../components/UI/modal";
import { useMutation } from "@tanstack/react-query";

export default function History() {
    const savedStoreName = localStorage.getItem("store_name");
    const [filters, setFilters] = useState<searchSaleSchema>({});
    const debouncedFilters = useDebounce(filters, 500);
    const [open, setOpen] = useState(false);
    const [sale, setSale] = useState<SaleTicket>({ comision: 0, createdAt: '', extra: 0, id: '', paymentMethod: 'CASH', total: 0, items: [] });

    const {
        datos: sales,
        isFetchingNextPage, loadMoreRef,
        isLoading, } = useInfiniteScroll<Sale>({
            queryFn: ({ pageParam }) => searchSales({
                ...debouncedFilters,
                ...(pageParam ? { cursor: pageParam } : {}),
            }),
            queryKey: "sales-search",
            debouncedFilters
        });
    const { mutate } = useMutation({
        mutationFn: getSale,
        onSuccess: ({ data }) => {
            console.log(data.data);
            setSale(data.data);
            setOpen(true);
        },
        onError: () => {
            console.error("Venta no encontrado");
        },
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
                    value={filters.endDate?.split('T')[0] || ""}
                    onChange={(e) =>
                        setFilters((prev) => ({
                            ...prev,
                            endDate: e.target.value + "T23:59:59",
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

                {sales.map(sale => (
                    <SaleCard
                        key={sale.id}
                        sale={sale}
                        onView={mutate}
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


            {/* MODAL */}
            <BaseModal open={open} onClose={() => { setOpen(false); }}>
                {/* HEADER */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <p className="text-lg">
                            Ticket # {sale.id.slice(0, 6)}
                        </p>

                        <p className="text-sm text-gray-400">
                            {new Date(sale.createdAt).toLocaleString()}
                        </p>
                    </div>
                    <p className="text-xl font-bold">
                        {savedStoreName}
                    </p>

                    <button
                        onClick={() => setOpen(false)}
                        className="text-gray-400 hover:text-white"
                    >
                        ✕
                    </button>
                </div>

                {/* ITEMS */}
                <div className="space-y-3 max-h-80 overflow-y-auto ">
                    {sale.items?.map((item, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between"
                        >
                            <div>
                                <p className="font-medium">
                                    {item.name ?? ''}
                                </p>

                                <p className="text-sm text-gray-400">
                                    {item.quantity} x ${item.price.toFixed(2)}
                                </p>
                            </div>

                            <p className="font-semibold">
                                ${item.subtotal.toFixed(2)}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="space-y-1 mt-1 border-t border-gray-800">
                    <div className="flex justify-between">
                        <span>
                            Subtotal
                        </span>
                        <span className="text-green-400">
                            ${sale.total.toFixed(2)}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span>
                            Ajuste
                        </span>
                        <span className="text-green-400">
                            ${sale.extra.toFixed(2)}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span>
                            Comisión
                        </span>
                        <span className="text-green-400">
                            ${sale.comision.toFixed(2)}
                        </span>
                    </div>
                </div>
                {/* FOOTER */}
                <div className="mt-1 border-t border-gray-800">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-lg font-bold">
                            Total
                        </span>

                        <span className="text-2xl font-bold text-green-400">
                            ${(sale.total + sale.extra + sale.comision).toFixed(2)}
                        </span>
                    </div>

                    {/* <button
                        onClick={() => console.log('Print')}
                        className="w-full bg-white text-black rounded-2xl py-3 font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition"
                    >
                        <Printer size={18} />
                        Imprimir ticket
                    </button> */}
                </div>
            </BaseModal>
        </div>
    );
}