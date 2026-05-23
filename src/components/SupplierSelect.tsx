import { useState, useRef, useEffect } from "react";
import { useDebounce } from "../hooks/useDebounce"; // Ajusta la ruta de tu debounce
import { useInfiniteScroll } from "../hooks/useInfiniteScroll"; // Ajusta tu ruta
import { searchSuppliers } from "../api/suppliers";

interface SupplierSelectProps {
    bg?: string;
    allowNull?: boolean;
    selectedSupplierId: string;
    onSelectSupplier: (id: string | null) => void;
}

export const SupplierSelect = ({ selectedSupplierId, bg, allowNull = true, onSelectSupplier }: SupplierSelectProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);

    const debouncedSearch = useDebounce(searchQuery, 500);

    const {
        datos: suppliers,
        isFetchingNextPage,
        loadMoreRef,
        isLoading
    } = useInfiniteScroll<{ id: string; name: string }>({
        queryFn: ({ pageParam }) => searchSuppliers({
            name: debouncedSearch, // Ajusta esta clave según pida tu backend (name, query, etc.)
            ...(pageParam ? { cursor: pageParam } : {}),
        }),
        queryKey: "suppliers-search",
        debouncedFilters: { search: debouncedSearch }
    });

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const currentSupplier = suppliers.find(s => s.id === selectedSupplierId);

    return (
        <div ref={dropdownRef} className="relative inline-block text-white">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`${bg || "bg-gray-900"} w-full rounded-lg px-3 py-3 text-left flex justify-between items-center outline-none border border-transparent focus:border-gray-700`}
            >
                <span className="truncate">
                    {selectedSupplierId ? currentSupplier?.name || "Proveedor seleccionado" : "Todos los proveedores"}
                </span>
                <span className="text-gray-400 text-xs">▼</span>
            </button>

            {isOpen && (
                <div className="absolute z-50 mt-1 w-full bg-gray-900 border border-gray-800 rounded-lg shadow-xl overflow-hidden">
                    <div className="p-2 border-b border-gray-800">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Buscar proveedor..."
                            className="w-full bg-gray-950 text-sm rounded-md px-3 py-1.5 outline-none text-white placeholder-gray-500 border border-gray-800 focus:border-gray-700"
                            autoFocus
                        />
                    </div>

                    <ul className="max-h-60 overflow-y-auto custom-scrollbar">
                        {allowNull && (
                            <li
                                onClick={() => {
                                    onSelectSupplier(null);
                                    setIsOpen(false);
                                }}
                                className="px-3 py-2 text-sm text-gray-400 hover:bg-gray-800 cursor-pointer"
                            >
                                Todos los proveedores
                            </li>
                        )}

                        {isLoading && (
                            <li className="px-3 py-2 text-xs text-gray-500 text-center">Cargando...</li>
                        )}

                        {suppliers.map((supplier) => (
                            <li
                                key={supplier.id}
                                onClick={() => {
                                    onSelectSupplier(supplier.id);
                                    setIsOpen(false);
                                }}
                                className={`px-3 py-2 text-sm hover:bg-gray-800 cursor-pointer truncate ${selectedSupplierId === supplier.id ? "bg-gray-800 text-blue-400 font-medium" : ""
                                    }`}
                            >
                                {supplier.name}
                            </li>
                        ))}

                        {/* Div de control para tu IntersectionObserver (Infinite Scroll) */}
                        <div ref={loadMoreRef} className="h-4 w-full flex items-center justify-center p-2">
                            {isFetchingNextPage && (
                                <span className="text-xs text-gray-500 animate-pulse">Cargando más...</span>
                            )}
                        </div>
                    </ul>
                </div>
            )}
        </div>
    );
};