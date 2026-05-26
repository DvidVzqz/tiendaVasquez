import { useState, useMemo } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
import { useQuery } from "@tanstack/react-query";
import { getDashboard, type DashboardData } from "../api/reports";

type Preset = "today" | "week" | "month" | "year";

const PRESET_LABELS: Record<Preset, string> = {
  today: "Hoy",
  week: "Semana",
  month: "Mes",
  year: "Año",
};

function getDateRange(preset: Preset) {
  const now = new Date();
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
  let start: Date;
  switch (preset) {
    case "today":
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case "week": {
      start = new Date(now);
      start.setDate(now.getDate() - now.getDay());
      start.setHours(0, 0, 0, 0);
      break;
    }
    case "month":
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case "year":
      start = new Date(now.getFullYear(), 0, 1);
      break;
  }
  return { startDate: start.toISOString(), endDate: endOfDay.toISOString() };
}

const currency = (n: number) =>
  "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const time = (iso: string) =>
  new Date(iso).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" });

export default function Dashboard() {
  const [preset, setPreset] = useState<Preset>("today");
  const { startDate, endDate } = useMemo(() => getDateRange(preset), [preset]);

  const { data, isLoading, isError } = useQuery<DashboardData>({
    queryKey: ["dashboard", startDate, endDate],
    queryFn: () => getDashboard(startDate, endDate),
  });

  return (
    <div className="h-screen p-1 flex flex-col">
      <div className="overflow-y-auto min-h-0 flex-1">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-3">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
          </div>

          <div className="flex gap-2">
            {(Object.keys(PRESET_LABELS) as Preset[]).map((key) => (
              <button
                key={key}
                onClick={() => setPreset(key)}
                className={`px-4 py-2 rounded-xl ${
                  preset === key ? "bg-gray-700 text-white" : "bg-black text-gray-300"
                } shadow`}
              >
                {PRESET_LABELS[key]}
              </button>
            ))}
          </div>
        </header>

        {isLoading && (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">Cargando dashboard...</p>
          </div>
        )}

        {isError && (
          <div className="flex items-center justify-center h-64">
            <p className="text-red-500">Error al cargar el dashboard</p>
          </div>
        )}

        {data && (
          <>
            <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2 mb-3">
              <StatCard label="Ventas Totales" value={currency(data.sales.total)} />
              <StatCard label="Número de Ventas" value={String(data.sales.count)} />
              <StatCard label="Ticket Promedio" value={currency(data.sales.average)} />
              <StatCard label="Productos Vendidos" value={String(data.sales.totalProductsSold)} />
            </section>

            <section className="grid grid-cols-1 xl:grid-cols-3 gap-2 mb-3">
              <div className="xl:col-span-2 bg-black rounded-2xl shadow p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-800">Ventas {(preset === 'today' ? 'de '  : 'por ') + PRESET_LABELS[preset]}</h2>
                </div>

                {data.sales.dailyBreakdown.length > 0 ? (
                  <div className="h-72">
                  <Bar
                    data={{
                      labels: data.sales.dailyBreakdown.map((d) =>
                        new Date(d.date).toLocaleDateString("es-MX", { weekday: "short", day: "numeric" })
                      ),
                      datasets: [
                        {
                          label: "Total",
                          data: data.sales.dailyBreakdown.map((d) => d.total),
                          backgroundColor: "#3B82F6",
                          borderRadius: 6,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { display: false },
                        tooltip: {
                          backgroundColor: "#1F2937",
                          titleColor: "#F3F4F6",
                          bodyColor: "#F3F4F6",
                          callbacks: {
                            title: (items) => {
                              const idx = items[0].dataIndex;
                              return new Date(data.sales.dailyBreakdown[idx].date).toLocaleDateString(
                                "es-MX",
                                { weekday: "long", day: "numeric", month: "short" }
                              );
                            },
                            label: (ctx) => `Total: ${currency(ctx.raw as number)}`,
                          },
                        },
                      },
                      scales: {
                        x: {
                          ticks: { color: "#9CA3AF" },
                          grid: { display: false },
                        },
                        y: {
                          ticks: { color: "#9CA3AF" },
                          grid: { color: "#374151" },
                        },
                      },
                    }}
                  />
                  </div>
                ) : (
                  <div className="h-80 flex items-center justify-center border rounded-xl bg-gray-50">
                    <span className="text-gray-400">Sin datos en este período</span>
                  </div>
                )}
              </div>

              <div className="bg-black rounded-2xl shadow p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-800">Poco Stock</h2>
                </div>

                <div className="space-y-3">
                  {data.products.lowStock.length === 0 && (
                    <p className="text-gray-500 text-sm">
                      Todos los productos tienen stock suficiente
                    </p>
                  )}

                  {data.products.lowStock.map((p) => (
                    <div
                      key={p.id}
                      className={`flex items-center justify-between p-3 rounded-xl ${
                        p.stock === 0 ? "bg-red-50" : "bg-yellow-50"
                      }`}
                    >
                      <div>
                        <p className="font-semibold text-gray-800">{p.name}</p>
                        <p className="text-sm text-gray-500">
                          {p.stock === 0 ? "Producto agotado" : `Quedan ${p.stock} piezas`}
                        </p>
                      </div>
                      <span
                        className={`font-bold text-lg ${
                          p.stock === 0 ? "text-red-500" : "text-yellow-500"
                        }`}
                      >
                        {p.stock}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="grid grid-cols-1 xl:grid-cols-2 gap-2 mb-3">
              <div className="bg-black rounded-2xl shadow p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-800">Productos Más Vendidos</h2>
                </div>

                <div className="space-y-4">
                  {data.products.topSelling.map((p, i) => (
                    <div key={p.productId} className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-800">{p.name}</p>
                        <p className="text-sm text-gray-500">{p.quantity} vendidos</p>
                      </div>
                      <span className="font-bold text-gray-700">#{i + 1}</span>
                    </div>
                  ))}

                  {data.products.topSelling.length === 0 && (
                    <p className="text-gray-500 text-sm">Sin ventas en este período</p>
                  )}
                </div>
              </div>

              <div className="bg-black rounded-2xl shadow p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-800">Últimas Ventas</h2>
                </div>

                {data.sales.lastSales.length > 0 ? (
                  <div className="overflow-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left border-b">
                          <th className="pb-3 text-gray-500 font-medium">Folio</th>
                          <th className="pb-3 text-gray-500 font-medium">Hora</th>
                          <th className="pb-3 text-gray-500 font-medium">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.sales.lastSales.map((sale) => (
                          <tr key={sale.id} className="border-b">
                            <td className="py-3 font-medium">#{sale.id.slice(0, 6)}</td>
                            <td className="py-3 text-gray-500">{time(sale.createdAt)}</td>
                            <td className="py-3 font-bold text-green-600">
                              {currency(sale.total)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">Sin ventas en este período</p>
                )}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-black rounded-2xl shadow p-5">
      <p className="text-gray-500 text-sm mb-2">{label}</p>
      <h2 className="text-3xl font-bold text-gray-800">{value}</h2>
    </div>
  );
}
