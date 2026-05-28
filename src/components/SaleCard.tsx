import { Eye } from "lucide-react";
import type { Sale } from "../interfaces/salesInterface";

interface Props {
    sale: Sale;
    onView: (id: string) => void;
}

export default function SaleCard({
    sale,
    onView,
}: Props) {

    return (
        <div className="bg-gray-950 border border-gray-800 rounded-2xl p-4 mb-3 flex items-center justify-between gap-4">
            {/* INFO */}
            <div className="flex flex-col">
                <span className="text-lg font-bold">
                    #{sale.id.slice(0, 6)}
                </span>

                <span className="text-sm text-gray-400">
                    {new Date(sale.createdAt).toLocaleString()}
                </span>

                <span className="text-sm text-gray-500">
                    Método de pago: {sale.paymentMethod || "N/A"}
                </span>
            </div>

            {/* TOTAL */}
            <div className="text-right">
                <p className="text-sm text-gray-400">
                    Total
                </p>

                <p className="text-2xl font-bold text-green-400">
                    ${(sale.total + sale.extra + sale.comision).toFixed(2)}
                </p>
            </div>

            {/* ACTIONS */}
            <button
                onClick={() => onView(sale.id)}
                className="h-12 w-12 flex items-center justify-center rounded-xl bg-gray-700 hover:bg-gray-800 transition"
            >
                <Eye size={20} />
            </button>
        </div>
    );
}