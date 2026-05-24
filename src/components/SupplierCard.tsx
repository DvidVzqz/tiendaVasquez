import type { supplier } from "../interfaces/supplierInterface";

interface Props {
    supplier: supplier;
    onEdit: () => void;
    onReceive: () => void;
}

export default function SupplierCard({
    supplier,
    onEdit,
    onReceive,
}: Props) {

    return (
        <div
            className="bg-gray-950 border border-gray-800 rounded-2xl p-4 mb-3 flex items-center justify-between gap-4"
        >
            <div className="flex items-center gap-4">
                <img
                    src={supplier.photo || "https://placehold.co/80x80"}
                    className="w-16 h-16 rounded-xl object-cover"
                />
                <div>
                    <h3 className="font-semibold text-lg">
                        {supplier.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                        {supplier.createdAt}
                    </p>

                </div>
            </div>
            <div className="flex gap-2">
                <button
                    onClick={onEdit}
                    className="px-4 py-2 rounded-lg border border-gray-200"
                >
                    Editar
                </button>
                <button
                    onClick={onReceive}
                    
                    className="px-4 py-2 rounded-xl bg-gray-700 hover:bg-gray-800 transition"
                >
                    Recibir
                </button>
            </div>
        </div>
    );
}