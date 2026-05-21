

export default function Dashboard() {
    return (
        <div className="h-screen p-1 flex flex-col">


            <div className="overflow-y-auto min-h-0 flex-1">

            <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-3">
                <div>
                    <h1 className="text-xl font-bold text-gray-800">
                        Dashboard
                    </h1>
                </div>

                <div className="flex gap-2">
                    <button className="px-4 py-2 rounded-xl bg-black text-white">
                        Hoy
                    </button>

                    <button className="px-4 py-2 rounded-xl bg-black shadow">
                        Semana
                    </button>

                    <button className="px-4 py-2 rounded-xl bg-black shadow">
                        Mes
                    </button>

                    <button className="px-4 py-2 rounded-xl bg-black shadow">
                        Año
                    </button>
                </div>
            </header>
                <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2 mb-3">

                    <div className="bg-black rounded-2xl shadow p-5">
                        <p className="text-gray-500 text-sm mb-2">
                            Ventas Totales
                        </p>

                        <h2 className="text-3xl font-bold text-gray-800">
                            $12,540
                        </h2>

                        <span className="text-green-500 text-sm">
                            +12% vs ayer
                        </span>
                    </div>

                    <div className="bg-black rounded-2xl shadow p-5">
                        <p className="text-gray-500 text-sm mb-2">
                            Número de Ventas
                        </p>

                        <h2 className="text-3xl font-bold text-gray-800">
                            38
                        </h2>

                        <span className="text-gray-500 text-sm">
                            ventas registradas
                        </span>
                    </div>

                    <div className="bg-black rounded-2xl shadow p-5">
                        <p className="text-gray-500 text-sm mb-2">
                            Ticket Promedio
                        </p>

                        <h2 className="text-3xl font-bold text-gray-800">
                            $330
                        </h2>

                        <span className="text-gray-500 text-sm">
                            promedio por venta
                        </span>
                    </div>

                    <div className="bg-black rounded-2xl shadow p-5">
                        <p className="text-gray-500 text-sm mb-2">
                            Productos Vendidos
                        </p>

                        <h2 className="text-3xl font-bold text-gray-800">
                            145
                        </h2>

                        <span className="text-gray-500 text-sm">
                            artículos vendidos
                        </span>
                    </div>
                </section>

                <section className="grid grid-cols-1 xl:grid-cols-3 gap-2 mb-3">

                    <div className="xl:col-span-2 bg-black rounded-2xl shadow p-5">

                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-gray-800">
                                Ventas del Día
                            </h2>

                            <button className="text-sm text-gray-500">
                                Ver detalles
                            </button>
                        </div>

                        <div className="h-80 flex items-center justify-center border rounded-xl bg-gray-50">
                            <span className="text-gray-400">
                                Aquí irá la gráfica
                            </span>
                        </div>
                    </div>

                    <div className="bg-black rounded-2xl shadow p-5">

                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-gray-800">
                                Poco Stock
                            </h2>

                            <button className="text-sm text-gray-500">
                                Ver inventario
                            </button>
                        </div>

                        <div className="space-y-3">

                            <div className="flex items-center justify-between p-3 rounded-xl bg-red-50">
                                <div>
                                    <p className="font-semibold text-gray-800">
                                        Coca Cola 600ml
                                    </p>

                                    <p className="text-sm text-gray-500">
                                        Stock bajo
                                    </p>
                                </div>

                                <span className="text-red-500 font-bold text-lg">
                                    2
                                </span>
                            </div>

                            <div className="flex items-center justify-between p-3 rounded-xl bg-yellow-50">
                                <div>
                                    <p className="font-semibold text-gray-800">
                                        Sabritas
                                    </p>

                                    <p className="text-sm text-gray-500">
                                        Quedan pocas piezas
                                    </p>
                                </div>

                                <span className="text-yellow-500 font-bold text-lg">
                                    5
                                </span>
                            </div>

                            <div className="flex items-center justify-between p-3 rounded-xl bg-red-50">
                                <div>
                                    <p className="font-semibold text-gray-800">
                                        Galletas Oreo
                                    </p>

                                    <p className="text-sm text-gray-500">
                                        Producto agotado
                                    </p>
                                </div>

                                <span className="text-red-500 font-bold text-lg">
                                    0
                                </span>
                            </div>

                        </div>
                    </div>
                </section>

                <section className="grid grid-cols-1 xl:grid-cols-2 gap-2">

                    <div className="bg-black rounded-2xl shadow p-5">

                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-gray-800">
                                Productos Más Vendidos
                            </h2>

                            <button className="text-sm text-gray-500">
                                Ver más
                            </button>
                        </div>

                        <div className="space-y-4">

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-semibold text-gray-800">
                                        Coca Cola 600ml
                                    </p>

                                    <p className="text-sm text-gray-500">
                                        35 ventas
                                    </p>
                                </div>

                                <span className="font-bold text-gray-700">
                                    #1
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-semibold text-gray-800">
                                        Sabritas Original
                                    </p>

                                    <p className="text-sm text-gray-500">
                                        28 ventas
                                    </p>
                                </div>

                                <span className="font-bold text-gray-700">
                                    #2
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-semibold text-gray-800">
                                        Marlboro Rojo
                                    </p>

                                    <p className="text-sm text-gray-500">
                                        20 ventas
                                    </p>
                                </div>

                                <span className="font-bold text-gray-700">
                                    #3
                                </span>
                            </div>

                        </div>
                    </div>

                    <div className="bg-black rounded-2xl shadow p-5">

                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-gray-800">
                                Últimas Ventas
                            </h2>

                            <button className="text-sm text-gray-500">
                                Ver historial
                            </button>
                        </div>

                        <div className="overflow-auto">

                            <table className="w-full">

                                <thead>
                                    <tr className="text-left border-b">
                                        <th className="pb-3 text-gray-500 font-medium">
                                            Folio
                                        </th>

                                        <th className="pb-3 text-gray-500 font-medium">
                                            Hora
                                        </th>

                                        <th className="pb-3 text-gray-500 font-medium">
                                            Total
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>

                                    <tr className="border-b">
                                        <td className="py-3 font-medium">
                                            #152
                                        </td>

                                        <td className="py-3 text-gray-500">
                                            2:33 PM
                                        </td>

                                        <td className="py-3 font-bold text-green-600">
                                            $250
                                        </td>
                                    </tr>

                                    <tr className="border-b">
                                        <td className="py-3 font-medium">
                                            #151
                                        </td>

                                        <td className="py-3 text-gray-500">
                                            2:10 PM
                                        </td>

                                        <td className="py-3 font-bold text-green-600">
                                            $120
                                        </td>
                                    </tr>

                                    <tr>
                                        <td className="py-3 font-medium">
                                            #150
                                        </td>

                                        <td className="py-3 text-gray-500">
                                            1:40 PM
                                        </td>

                                        <td className="py-3 font-bold text-green-600">
                                            $520
                                        </td>
                                    </tr>

                                </tbody>

                            </table>

                        </div>
                    </div>

                </section>
            </div>
        </div>
    );
}