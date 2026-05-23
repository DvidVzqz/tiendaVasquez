import { useState } from "react";
import { useDebounce } from "../hooks/useDebounce";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import SupplierCard from "../components/SupplierCard";
import { useFormulario } from "../hooks/useFormulario";
import { postSupplier, putSupplier, searchSuppliers } from "../api/suppliers";
import { Input } from "../components/UI/Input";
import type { searchsupplierSchema, supplier } from "../interfaces/supplierInterface";
import { BaseModal } from "../components/UI/modal";

export default function Suppliers() {
    const [filters, setFilters] = useState<searchsupplierSchema>({});
    const [openForm, setOpenForm] = useState(false);

    const debouncedFilters = useDebounce(filters, 500);
    const {
        datos: suppliers,
        isFetchingNextPage,
        loadMoreRef,
        refetch,
        isLoading
    } = useInfiniteScroll<supplier>({
        queryFn: ({ pageParam }) => searchSuppliers({
            ...debouncedFilters,
            ...(pageParam ? { cursor: pageParam } : {}),
        }),
        queryKey: "suppliers-search",
        debouncedFilters
    });

    const {
        useForm: {
            control,
            setValue,
            setValues,
            reset,
            clearErrors,
            watch,
            formState: { errors },
        },
        onSubmit,
    } = useFormulario(
        {
            mutationFn: data => {
                const form = new FormData();
                form.append('name', data['name'] ?? "");
                if (data['photo'] && data['photo'] instanceof File) form.append('photo', data['photo']);

                return data.id ? putSupplier(data.id, form) : postSupplier(form);
            },
            onSuccess() {
                refetch();
                setOpenForm(false);
            },
        },
        { defaultValues: { name: "" } },
    );

    return (
        <div className="h-screen flex flex-col p-1 gap-2">

            <div className="bg-black rounded-2xl shadow-md p-4 flex gap-2">
                <input
                    type="text"
                    placeholder="Buscar proveedor..."
                    value={filters.name || ""}
                    onChange={(e) =>
                        setFilters((prev) => ({
                            ...prev,
                            name: e.target.value,
                        }))
                    }
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-white"
                />
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

            <div className="flex-1 bg-black rounded-2xl shadow-md overflow-hidden p-2">
                {isLoading && (
                    <p>Cargando proveedores...</p>
                )}


                {suppliers.map(supplier => (
                    <SupplierCard
                        key={supplier.id}
                        supplier={supplier}
                        onEdit={() => {
                            setValues(supplier);
                            setOpenForm(true);
                        }}
                        onReceive={() => { }}
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
            <BaseModal open={openForm} onClose={() => {
                setOpenForm(false);
                clearErrors();
            }}>
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {watch("id") ? "Editar" : "Nuevo"} proveedor
                    </h2>
                    <p className="text-gray-500 mt-1">
                        Completa la información del proveedor
                    </p>
                </div>

                <div className="flex flex-col gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Foto del proveedor
                        </label>
                        <div
                            className="border-2 border-dashed border-gray-300 rounded-2xl p-8 flex flex-col items-center justify-center gap-4"
                        >
                            <img
                                src={watch("photo") ? (watch("photo") instanceof File ? URL.createObjectURL(watch("photo")) : watch("photo")) : "https://placehold.co/120x120"}
                                className="w-28 h-28 rounded-2xl object-cover"
                            />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) setValue('photo', e.target.files[0]);
                                }}
                            />
                        </div>
                    </div>
                    <div>
                        <Input
                            label="Nombre proveedor"
                            control={control}
                            errors={errors}
                            name="name"
                            rules={{
                                required: 'Campo requerido',
                            }}
                        />
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => {
                                setOpenForm(false);
                                clearErrors();
                            }}
                            className="px-5 py-3 rounded-xl border border-gray-200 hover:opacity-90 transition"
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            onClick={onSubmit}
                            className="px-5 py-3 rounded-xl bg-green-700 text-white hover:opacity-90 transition"
                        >
                            Guardar proveedor
                        </button>
                    </div>
                </div>
            </BaseModal>
        </div>
    );
}