import { useState, useRef, useEffect } from "react";
import { useDebounce } from "../hooks/useDebounce";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import type { CartProduct } from "../interfaces/productInterface";
import { searchProducts } from "../api/products";

interface props {
    onSelectProduct: (product: CartProduct) => void;
}

export const SearchProductInput = ({ onSelectProduct }: props) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);
    const debouncedSearch = useDebounce(searchQuery, 500);

    const {
        datos: products,
        isFetchingNextPage,
        loadMoreRef,
        isLoading
    } = useInfiniteScroll<CartProduct>({
        queryFn: ({ pageParam }) => searchProducts({
            name: debouncedSearch,
            limit: 10,
            ...(pageParam ? { cursor: pageParam } : {}),
        }),
        queryKey: "products-search",
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

    return (
        <div ref={dropdownRef} className="relative inline-block text-white w-full">
            <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsOpen(!isOpen)}
                placeholder="Buscar producto..."
                className="w-full bg-gray-950 text-sm rounded-md px-3 py-1.5 outline-none text-white placeholder-gray-500 border border-gray-800 focus:border-gray-700"
            />

            {isOpen && (
                <div className="absolute z-50 mt-1 w-full bg-gray-900 border border-gray-800 rounded-lg shadow-xl overflow-hidden">

                    <ul className="max-h-60 overflow-y-auto custom-scrollbar">
                        {isLoading && (
                            <li className="px-3 py-2 text-xs text-gray-500 text-center">Cargando...</li>
                        )}

                        {products.map((product) => (
                            <li
                                key={product.id}
                                onClick={() => {
                                    onSelectProduct(product);
                                    setIsOpen(false);
                                }}
                                className={`px-3 py-2 text-sm hover:bg-gray-800 cursor-pointer truncate`}
                            >
                                {product.name}
                            </li>
                        ))}

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