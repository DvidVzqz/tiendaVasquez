import { useEffect, useState } from "react";

export default function Settings() {
    const [storeName, setStoreName] = useState("");
    const [apiUrl, setApiUrl] = useState("");
    const [cardCommission, setCardCommission] = useState("");

    useEffect(() => {
        const savedStoreName = localStorage.getItem("store_name");
        const savedApiUrl = localStorage.getItem("api_url");
        const savedCommission = localStorage.getItem("card_commission");

        if (savedStoreName) setStoreName(savedStoreName);
        if (savedApiUrl) setApiUrl(savedApiUrl);
        if (savedCommission) setCardCommission(savedCommission);
    }, []);

    const handleSave = () => {
        localStorage.setItem("store_name", storeName);
        localStorage.setItem("api_url", apiUrl);
        localStorage.setItem("card_commission", cardCommission);

        alert("Configuración guardada");
    };

    return (
        <div className="h-screen p-1 overflow-hidden flex flex-col justify-between">

            <div>
                <h1 className="text-2xl font-bold">
                    Configuración
                </h1>
                <p className="text-gray-500 text-sm">
                    Ajustes generales del sistema
                </p>
            </div>
            <div className="bg-black rounded-2xl shadow-md p-6 space-y-6">
                <div className="space-y-4">
                    <div>
                        <label className="block mb-1 text-sm font-medium">
                            Nombre de la tienda
                        </label>

                        <input
                            type="text"
                            value={storeName}
                            onChange={(e) => setStoreName(e.target.value)}
                            placeholder="Tienda Vasquez"
                            className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium">
                            Dirección de la API
                        </label>

                        <input
                            type="text"
                            value={apiUrl}
                            onChange={(e) => setApiUrl(e.target.value)}
                            placeholder="http://192.168.1.10:3000"
                            className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium">
                            Comisión por pago con tarjeta (%)
                        </label>

                        <input
                            type="number"
                            step="0.1"
                            value={cardCommission}
                            onChange={(e) => setCardCommission(e.target.value)}
                            placeholder="3.5"
                            className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                        />
                    </div>
                </div>
            </div>
            <button
                onClick={handleSave}
                className="w-full bg-black text-white rounded-xl py-3 font-medium hover:opacity-90 transition"
            >
                Guardar configuración
            </button>
        </div>
    );
}