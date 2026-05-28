import { create, type Mutate, type StoreApi, type UseBoundStore } from "zustand";
import { persist } from "zustand/middleware";
import type { CartProduct } from "../interfaces/productInterface";
import type { paymentMethodType } from "../interfaces/salesInterface";

interface CartStore {
    cart: CartProduct[];
    calculator: string;
    paymentMethod: paymentMethodType,
    setPaymentMethod: (paymentMethod: paymentMethodType) => void;
    setCalculator: (cal: string) => void;
    addProduct: (product: CartProduct) => void;
    increase: (code: string) => void;
    decrease: (code: string) => void;
    remove: (code: string) => void;
    clear: () => void;
}
const stores: Record<string, UseBoundStore<Mutate<StoreApi<CartStore>, any>>> = {};

export const getCartStore = (id: string) => {

    if (!stores[id])
        stores[id] = create<CartStore>()(
            persist(
                (set) => ({
                    cart: [],
                    calculator: "",
                    paymentMethod: "CASH",
                    setPaymentMethod: (paymentMethod) => set(() => ({ paymentMethod })),
                    setCalculator: (cal) => set(() => ({ calculator: cal })),
                    addProduct: (product) =>
                        set((state) => {
                            const exists = state.cart.find(p => p.code === product.code);

                            if (exists) {
                                return {
                                    cart: state.cart.map(p =>
                                        p.code === product.code
                                            ? { ...p, quantity: p.quantity + 1 } : p
                                    ),
                                };
                            }

                            return {
                                cart: [...state.cart, { ...product, quantity: 1, },],
                            };
                        }),

                    increase: (code) =>
                        set((state) => ({
                            cart: state.cart.map(p =>
                                p.code === code
                                    ? { ...p, quantity: p.quantity + 1, } : p
                            ),
                        })),

                    decrease: (code) =>
                        set((state) => ({
                            cart: state.cart.map(p =>
                                p.code === code &&
                                    p.quantity > 1
                                    ? { ...p, quantity: p.quantity - 1, } : p
                            ),
                        })),

                    remove: (code) =>
                        set((state) => ({ cart: state.cart.filter(p => p.code !== code), })),

                    clear: () => set({ cart: [], calculator: "" }),
                }),

                { name: id, }
            )
        )

    return stores[id];
};

export const getActiveCartIds = () => {
    const ids: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key) continue;
        try {
            const item = localStorage.getItem(key);
            if (item && item.includes('"state"') && item.includes('"cart"')) {
                ids.push(key);
                if (!stores[key]) {
                    getCartStore(key);
                }
            }
        } catch (e) {
        }
    }

    return ids;
};

export const deleteCartStore = (id: string) => {
    localStorage.removeItem(id);
    if (stores[id]) {
        delete stores[id];
    }
};

export const updateProductInAllCarts = (updatedProduct: CartProduct) => {
    const activeIds = getActiveCartIds();

    activeIds.forEach((id) => {
        const useCartStore = getCartStore(id);

        const storeApi = useCartStore;
        const { cart } = storeApi.getState();

        const productExists = cart.some((p) => p.code === updatedProduct.code);

        if (productExists) {
            const newCart = cart.map((p) =>
                p.code === updatedProduct.code
                    ? { ...p, ...updatedProduct, quantity: p.quantity }
                    : p
            );
            storeApi.setState({ cart: newCart });
        }
    });
};