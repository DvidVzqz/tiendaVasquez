import { createContext, useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { CartProduct } from "../interfaces/productInterface";
import { BaseModal } from "../components/UI/modal";
import { ShoppingBag } from "lucide-react";
import { getActiveCartIds, getCartStore } from "../hooks/useCartStore";
import { useBarcodeScanner } from "../hooks/useBarcodeScanner";
import { useMutation } from "@tanstack/react-query";
import { getProduct } from "../api/products";

interface SaleManagerContextType {
    openSaleSelector: (product: CartProduct) => void;
}

const SaleManagerContext = createContext<SaleManagerContextType | undefined>(undefined);

export function SaleManagerProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [productToAssign, setProductToAssign] = useState<CartProduct | null>(null);
    const [activeSales, setActiveSales] = useState<string[]>([]);
    const { mutate } = useMutation({
        mutationFn: getProduct,
        onSuccess: ({ data }) => {
            try {
                const pathParts = location.pathname.split("/");
                const currentSaleId = pathParts[1] === "home" ? pathParts[2] : null;

                if (currentSaleId) {
                    const store = getCartStore(currentSaleId);
                    store.getState().addProduct(data.data);
                } else {
                    openSaleSelector(data.data);
                }
            } catch (error) {
                console.error("Error al buscar el producto escaneado", error);
            }
        },
        onError: () => {
            console.error("Producto no encontrado");
        },
    });

    useBarcodeScanner({ onScan: mutate });
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (isOpen) {
            setActiveSales(getActiveCartIds());
        }
    }, [isOpen, location]);

    const openSaleSelector = (product: CartProduct) => {
        const existingSales = getActiveCartIds();
        if (existingSales.length === 1) {
            const targetId = existingSales[0];
            getCartStore(targetId).getState().addProduct(product);
            navigate(`/home/${targetId}`);
        } else {
            setProductToAssign(product);
            setIsOpen(true);
        }
    };

    const handleClose = () => {
        setIsOpen(false);
        setProductToAssign(null);
    };

    return (
        <SaleManagerContext.Provider value={{ openSaleSelector }}>
            {children}

            {/* MODAL GLOBAL REUTILIZABLE */}
            <BaseModal open={isOpen} onClose={handleClose}>
                <div className="flex flex-col gap-6 p-2 text-white">
                    <div>
                        <h2 className="text-2xl font-bold">Agregar a...</h2>
                        {productToAssign && (
                            <p className="text-sm text-gray-400 mt-1">
                                Selecciona la venta para: <span className="text-blue-400 font-semibold">{productToAssign.name}</span>
                            </p>
                        )}
                    </div>

                    {/* Form / Lista de ventas */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-64 overflow-y-auto pr-1">
                        {activeSales.length === 0 ? (
                            <p className="text-sm text-gray-400 col-span-2 text-center py-4">
                                No hay ventas activas en este momento. Crea una desde la barra lateral.
                            </p>
                        ) : (
                            activeSales.map((id, index) => (
                                <AddSale
                                    key={id}
                                    id={id}
                                    index={index}
                                    product={productToAssign}
                                    onSuccess={handleClose}
                                />
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-3 border-t border-gray-800 pt-4">
                        <button
                            onClick={handleClose}
                            className="px-5 py-3 rounded-xl bg-gray-700 hover:bg-gray-600 transition text-sm font-medium"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            </BaseModal>
        </SaleManagerContext.Provider>
    );
}

interface AddSaleProps {
    id: string;
    index: number;
    product: CartProduct | null;
    onSuccess: () => void;
}

function AddSale({ id, onSuccess, index, product }: AddSaleProps) {
    const navigate = useNavigate();
    const useCartStore = getCartStore(id);
    const { addProduct } = useCartStore();
    const handleSelectSale = () => {
        if (product) {
            addProduct(product);
            onSuccess();
            navigate(`/home/${id}`);
        }
    };
    return (
        <button
            onClick={handleSelectSale}
            className={`flex items-center gap-2 p-2 rounded-md text-sm transition-colors bg-gray-800 hover:bg-gray-700`}
        >
            <ShoppingBag size={14} />
            <span className="truncate">Venta #{index + 1} ({id})</span>
        </button>
    )
}
// Hook personalizado para usar este contexto cómodamente
export const useSaleManager = () => {
    const context = useContext(SaleManagerContext);
    if (!context) throw new Error("useSaleManager debe usarse dentro de un SaleManagerProvider");
    return context;
};