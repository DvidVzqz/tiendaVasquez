import api from "./client";

export interface DashboardData {
  sales: {
    total: number;
    count: number;
    extra: number;
    average: number;
    totalProductsSold: number;
    lastSales: Array<{
      id: string;
      total: number;
      extra: number;
      paymentMethod: "CARD" | "CASH";
      createdAt: string;
      items: Array<{
        productName: string;
        quantity: number;
        price: number;
        subtotal: number;
      }>;
    }>;
    byPaymentMethod: Array<{ method: "CARD" | "CASH"; count: number; total: number }>;
    dailyBreakdown: Array<{ date: string; count: number; total: number; extra: number }>;
  };
  products: {
    topSelling: Array<{ productId: string; name: string; quantity: number; revenue: number }>;
    lowStock: Array<{ id: string; name: string; stock: number; type: "UNIT" | "WEIGHT" }>;
    countByType: Record<string, number>;
  };
  suppliers: {
    total: number;
    withProducts: number;
  };
}

export async function getDashboard(startDate: string, endDate: string) {
  const { data } = await api.get("report/dashboard", {
    params: { startDate, endDate },
  });
  return data.data as DashboardData;
}
