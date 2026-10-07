import { createContext, useContext, useRef, useState } from "react";
import { useFormulario } from "../hooks/useFormulario";
import { postProduct, putProduct } from "../api/products";
import type { CartProduct, productSchema } from "../interfaces/productInterface";
import { updateProductInAllCarts } from "../hooks/useCartStore";
import { Input } from "../components/UI/Input";
import { Controller, type UseFormSetValues } from "react-hook-form";
import { SupplierSelect } from "../components/SupplierSelect";
import { BaseModal } from "../components/UI/modal";

interface ProductContextType {
    reset: () => void;
    setOpenForm: (e: boolean) => void;
    setValues: UseFormSetValues<any>;
    setCallback: (callback: (data: CartProduct | null) => void) => void;
}

const ProductContext = createContext<ProductContextType>({
    reset: () => { },
    setOpenForm: () => { },
    setValues: () => { },
    setCallback: () => { },
});

export const useProductContext = () => useContext(ProductContext);

export function ProductProvider({ children }: { children: React.ReactNode; }) {
    const callbackRef = useRef<((data: CartProduct | null) => void) | null>(null);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const setCallback = (callback: (data: CartProduct | null) => void) => { callbackRef.current = callback; };

    const [openForm, setOpenForm] = useState(false);
    const {
        useForm: {
            control,
            setValues,
            reset,
            clearErrors,
            watch,
            formState: { errors },
        },
        onSubmit,
    } = useFormulario(
        {
            mutationFn: data => data.id ? putProduct(data.id, data as productSchema) : postProduct(data as productSchema),
            onSuccess({ data }) {
                callbackRef.current?.(data.data as CartProduct);
                if (data.data) updateProductInAllCarts(data.data as CartProduct);
                setOpenForm(false);
            },
        },
        { defaultValues: { type: 'UNIT', stock: 1 } },
    );
    return (
        <ProductContext.Provider value={{ reset, setOpenForm, setValues, setCallback }}>
            {children}

            {/* Modal de productos */}
            <BaseModal open={openForm} onClose={() => {
                setOpenForm(false);
                clearErrors();
            }}>
                <div className="flex flex-col gap-6">
                    {/* Header */}
                    <div>
                        <h2 className="text-2xl font-bold">
                            {watch("id") ? "Editar" : "Nuevo"} Producto
                        </h2>

                        <p className="text-gray-400 text-sm mt-1">
                            Completa la información del
                            producto
                        </p>
                    </div>

                    {/* Form */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        {/* Código */}
                        <Input
                            label="Código"
                            control={control}
                            errors={errors}
                            name="code"
                            placeholder="Ej. 750123456"
                            rules={{
                                required: 'Campo requerido',
                            }}
                        />

                        {/* Nombre */}
                        <Input
                            label="Nombre"
                            control={control}
                            errors={errors}
                            name="name"
                            placeholder="Coca Cola 600ml"
                            rules={{
                                required: 'Campo requerido',
                            }}
                        />

                        {/* Tipo */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm text-gray-300">
                                Tipo
                            </label>
                            <Controller
                                control={control}
                                name={"type"}
                                rules={{
                                    required: 'Campo requerido',
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <select
                                        onChange={onChange}
                                        onBlur={onBlur}
                                        value={value}
                                        className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
                                    >
                                        <option value="UNIT">
                                            Por unidad
                                        </option>

                                        <option value="WEIGHT">
                                            Por peso
                                        </option>
                                    </select>
                                )}
                            />

                            <p>{!!errors["type"] && (errors["type"].message) as string}</p>
                        </div>

                        {/* Precio */}
                        <Input
                            label="Precio de venta"
                            control={control}
                            errors={errors}
                            name="price"
                            step="0.01"
                            placeholder="$0.00"
                            type="number"
                            rules={{
                                required: 'Campo requerido',
                            }}
                        />

                        {/*---------------------------- Avanzados */}

                        {/* Opciones avanzadas */}
                        <div className="md:col-span-2 border-t border-gray-700 pt-4">

                            <button
                                type="button"
                                onClick={() => setShowAdvanced(prev => !prev)}
                                className="w-full flex items-center justify-between text-left group"
                            >
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-200 group-hover:text-white transition">
                                        Opciones avanzadas
                                    </h3>

                                    <p className="text-xs text-gray-500 mt-1">
                                        Proveedor, nombre real, precio real y stock
                                    </p>
                                </div>

                                <span
                                    className={`text-gray-400 transition-transform duration-200 ${showAdvanced ? "rotate-180" : ""
                                        }`}
                                >
                                    ▼
                                </span>
                            </button>

                            {showAdvanced && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">

                                    {/* Proveedor */}
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm text-gray-300">
                                            Proveedor
                                        </label>

                                        <Controller
                                            control={control}
                                            name={"supplierId"}
                                            render={({ field: { value, onChange } }) => (
                                                <SupplierSelect
                                                    bg="bg-gray-800"
                                                    allowNull={false}
                                                    selectedSupplierId={value}
                                                    onSelectSupplier={(id) => onChange(id)}
                                                />
                                            )} />

                                        <p>{!!errors["supplierId"] && (errors["supplierId"].message) as string}</p>
                                    </div>

                                    {/* Nombre real */}
                                    <Input
                                        label="Nombre real"
                                        control={control}
                                        errors={errors}
                                        name="realName"
                                        placeholder="Opcional"
                                    />

                                    {/* Precio real */}
                                    <Input
                                        label="Precio real"
                                        control={control}
                                        errors={errors}
                                        name="realPrice"
                                        type="number"
                                        step="0.01"
                                        placeholder="$0.00"
                                    />

                                    {/* Stock */}
                                    <Input
                                        label="Stock inicial"
                                        control={control}
                                        errors={errors}
                                        name="stock"
                                        type="number"
                                        step="1"
                                        placeholder="0"
                                        rules={{
                                            required: 'Campo requerido',
                                        }}
                                    />
                                </div>
                            )}
                        </div>


                    </div>
                    {/* Footer */}
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={() => {
                                setOpenForm(false);
                                clearErrors();
                            }}
                            className="px-5 py-3 rounded-xl bg-gray-700 hover:bg-gray-600 transition"
                        >
                            Cancelar
                        </button>

                        <button
                            className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 transition"
                            onClick={() => {
                                clearErrors();
                                onSubmit();
                            }}
                        >
                            Guardar producto
                        </button>
                    </div>
                </div>
            </BaseModal>
        </ProductContext.Provider>
    )
}