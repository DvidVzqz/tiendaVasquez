// 823703800360
import { useMutation } from "@tanstack/react-query";
import ProductCard from "../components/CartProduct";
import { postSale } from "../api/sales";
import { getCartStore } from "../hooks/useCartStore";
import { useParams } from "react-router-dom";
import { SearchProductInput } from "../components/SearchProductInput";
import type { paymentMethodType } from "../interfaces/salesInterface";

export default function Home() {
  const { saleId = "base" } = useParams();
  const useCartStore = getCartStore(saleId);
  const savedCommission = Number(localStorage.getItem("card_commission"));

  const {
    cart,
    calculator,
    paymentMethod,
    setPaymentMethod,
    setCalculator,
    addProduct,
    increase,
    decrease,
    remove,
    clear,
  } = useCartStore();

  const saleMutation = useMutation({
    mutationFn: postSale,
    onSuccess: clear,
    onError: () => {
      console.error("Venta no registrada");
    },
  });

  // 🔥 Eval calculadora
  const extra = (() => {
    try {
      return calculator
        ? Function(`"use strict"; return (${calculator})`)()
        : 0;
    } catch {
      return 0;
    }
  })();

  const totalItems = cart.reduce((acc, p) => acc + p.quantity, 0);
  const subtotal = cart.reduce((acc, p) => acc + p.price * p.quantity, 0);
  const comision = paymentMethod == "CARD" ? ((subtotal + extra) * (savedCommission / 100)) : 0;
  const total = subtotal + extra + comision;

  const addCalculatorValue = (value: string) => setCalculator(calculator + value);

  const handleSubmit = () => {
    if (total <= 0) return;
    saleMutation.mutate({ paymentMethod, extra, comision, items: cart.map(x => ({ productId: x.id, quantity: x.quantity })) });
  }

  return (
    <div className="h-screen flex-1 grid grid-cols-12 gap-1 p-1 overflow-hidden">
      {/* 🛒 PRODUCTOS */}
      <div className="col-span-9 bg-black rounded-2xl shadow-md p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          Productos
        </h2>

        <div className="space-y-3">
          {cart.map(product => (
            <ProductCard
              key={product.code}
              product={product}
              onIncrease={() =>
                increase(product.code)
              }
              onDecrease={() =>
                decrease(product.code)
              }
              onRemove={() =>
                remove(product.code)
              }
            />
          ))}
        </div>
      </div>

      {/* 💰 PANEL DERECHO */}
      <div className="col-span-3 flex flex-col gap-1">
        <div className="flex p-2 bg-black rounded-2xl shadow-md gap-1 w-full">
          <SearchProductInput onSelectProduct={addProduct} />
        </div>

        {/* 💰 Totales */}
        <div className="bg-black rounded-2xl shadow-md p-4 flex-1 flex flex-col justify-between">
          <div className="flex gap-2 items-center">
            <span>Tipo:</span>
            <select
              value={paymentMethod}
              onChange={(e) => { setPaymentMethod(e.target.value as paymentMethodType) }}
              className="bg-gray-900 rounded-lg px-3 py-2 outline-none w-full"
            >
              <option key="CASH" value="CASH">EFECTIVO</option>
              <option key="CARD" value="CARD">TARJETA</option>
            </select>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>Productos</span>
              <span>{totalItems}</span>
            </div>

            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>
                ${subtotal.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Ajuste</span>
              <span>
                ${extra.toFixed(2)}
              </span>
            </div>

            {paymentMethod == 'CARD' &&
              <div className="flex justify-between">
                <span>Comisión</span>
                <span>
                  ${comision.toFixed(2)}
                </span>
              </div>
            }

            <div className="border-t border-gray-700 pt-2 flex justify-between text-xl font-bold">
              <span>Total</span>
              <span>
                ${total.toFixed(2)}
              </span>
            </div>
          </div>

          {/* 🧮 Calculadora */}
          <div className="space-y-3 py-2">
            <div className="flex gap-2 mb-4">
              <input
                value={calculator}
                readOnly
                className="min-w-0 border rounded-lg px-3 py-2 text-right  w-full"
              />
              <button
                onClick={() => setCalculator(calculator.slice(0, -1))}
                className="px-4 rounded-lg bg-red-500 hover:bg-red-600 font-bold text-xl"
              >
                ←
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {["7", "8", "9", "/", "4", "5", "6", "*", "1", "2", "3", "-", "0", ".", "C", "+",].map(btn => (
                <button
                  key={btn}
                  onClick={() => {
                    if (btn === "C") {
                      setCalculator("");
                      return;
                    }
                    addCalculatorValue(btn);
                  }}
                  className="bg-gray-900 hover:bg-gray-700 rounded-xl h-11 text-xl font-bold"
                >
                  {btn}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={handleSubmit}
            className="w-full mt-6 bg-green-500 hover:bg-green-600 rounded-xl py-4 text-xl font-bold">
            Cobrar
          </button>
        </div>
      </div>
    </div>
  );
}