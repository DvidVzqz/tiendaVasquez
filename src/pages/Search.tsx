import { useState } from "react";
import SearchProductCard from "../components/SearchProductCard";
import type { CartProduct, Product, productSchema, searchProductSchema } from "../interfaces/productInterface";
import { postProduct, putProduct, searchProducts } from "../api/products";
import { useDebounce } from "../hooks/useDebounce";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { SupplierSelect } from "../components/SupplierSelect";
import { BaseModal } from "../components/UI/modal";
import { useFormulario } from "../hooks/useFormulario";
import { Input } from "../components/UI/Input";
import { Controller } from "react-hook-form";
import { updateProductInAllCarts } from "../hooks/useCartStore";
import { useSaleManager } from "../contexts/SaleManagerContext";

export default function Search() {
    const { openSaleSelector } = useSaleManager();
    const [filters, setFilters] = useState<searchProductSchema>({});
    const [openForm, setOpenForm] = useState(false);

    const debouncedFilters = useDebounce(filters, 500);
    const {
        datos: products,
        isFetchingNextPage, loadMoreRef,
        isLoading, refetch } = useInfiniteScroll<Product>({
            queryFn: ({ pageParam }) => searchProducts({
                ...debouncedFilters,
                ...(pageParam ? { cursor: pageParam } : {}),
            }),
            queryKey: "products-search",
            debouncedFilters
        });

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
                refetch();
                if (data.data) updateProductInAllCarts(data.data as CartProduct);
                setOpenForm(false);
            },
        },
        { defaultValues: { type: 'UNIT' } },
    );

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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Type */}
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

                        {/* Nombre real */}
                        <Input
                            label="Nombre real"
                            control={control}
                            errors={errors}
                            name="realName"
                            placeholder="Opcional"
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

                        {/* Precio real */}
                        <Input
                            label="Precio real"
                            control={control}
                            errors={errors}
                            name="realPrice"
                            type="number"
                            step="0.01"
                            placeholder="$0.00"
                            rules={{
                                required: 'Campo requerido',
                            }}
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

                        {/* Proveedor */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm text-gray-300">
                                Proveedor
                            </label>

                            <Controller
                                control={control}
                                name={"supplierId"}
                                rules={{
                                    required: 'Campo requerido',
                                }}
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
        </div>
    );
}
