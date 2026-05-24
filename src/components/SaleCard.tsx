import { Eye, Printer } from "lucide-react";
import { useState } from "react";
import type { Sale } from "../interfaces/salesInterface";


interface Props {
    sale: Sale;
    onPrint?: (sale: Sale) => void;
}

export default function SaleCard({
    sale,
    onPrint,
}: Props) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <div className="bg-gray-950 border border-gray-800 rounded-2xl p-4 mb-3 flex items-center justify-between gap-4">
                {/* INFO */}
                <div className="flex flex-col">
                    {/* <span className="text-lg font-bold">
                        #{sale.id}
                    </span> */}

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
                        ${(sale.total + sale.extra).toFixed(2)}
                    </p>
                </div>

                {/* ACTIONS */}
                <button
                    onClick={() => setOpen(true)}
                    className="h-12 w-12 flex items-center justify-center rounded-xl bg-gray-700 hover:bg-gray-800 transition"
                >
                    <Eye size={20} />
                </button>
            </div>

            {/* MODAL */}
            {open && (
                <div
                    className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
                    onClick={() => setOpen(false)}
                >
                    <div
                        className="bg-gray-950 w-full max-w-md rounded-3xl p-6 border border-gray-800"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* HEADER */}
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-xl font-bold">
                                    Ticket #
                                </h2>

                                <p className="text-sm text-gray-400">
                                    {new Date(
                                        sale.createdAt
                                    ).toLocaleString()}
                                </p>
                            </div>

                            <button
                                onClick={() => setOpen(false)}
                                className="text-gray-400 hover:text-white"
                            >
                                ✕
                            </button>
                        </div>

                        {/* ITEMS */}
                        <div className="space-y-3 max-h-80 overflow-y-auto">
                            {sale.items?.map((item) => (
                                <div
                                    key={item.productId}
                                    className="flex items-center justify-between border-b border-gray-800 pb-2"
                                >
                                    <div>
                                        <p className="font-medium">
                                            {item.product?.name ?? ''}
                                        </p>

                                        <p className="text-sm text-gray-400">
                                            {item.quantity} x $
                                            {item.price.toFixed(2)}
                                        </p>
                                    </div>

                                    <p className="font-semibold">
                                        $
                                        {(
                                            item.quantity *
                                            item.price
                                        ).toFixed(2)}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* FOOTER */}
                        <div className="mt-6 border-t border-gray-800 pt-4">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-lg font-bold">
                                    Total
                                </span>

                                <span className="text-2xl font-bold text-green-400">
                                    ${sale.total.toFixed(2)}
                                </span>
                            </div>

                            <button
                                onClick={() => onPrint?.(sale)}
                                className="w-full bg-white text-black rounded-2xl py-3 font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition"
                            >
                                <Printer size={18} />
                                Imprimir ticket
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}