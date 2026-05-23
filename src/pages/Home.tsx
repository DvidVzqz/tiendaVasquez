// 823703800360
import { useReducer, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { getProduct } from "../api/products";
import ProductCard from "../components/CartProduct";
import type { CartProduct } from "../interfaces/productInterface";
import { postSale } from "../api/sales";

type CartAction =
  | { type: "ADD_PRODUCT"; payload: CartProduct }
  | { type: "INCREASE"; payload: string }
  | { type: "DECREASE"; payload: string }
  | { type: "REMOVE"; payload: string }
  | { type: "REMOVE_ALL"; };

function cartReducer(
  state: CartProduct[],
  action: CartAction
) {
  switch (action.type) {
    case "ADD_PRODUCT": {
      const exists = state.find(
        p => p.code === action.payload.code
      );

      if (exists) {
        return state.map(p =>
          p.code === action.payload.code
            ? {
              ...p,
              quantity: p.quantity + 1,
            }
            : p
        );
      }

      return [
        ...state,
        {
          ...action.payload,
          quantity: 1,
        },
      ];
    }

    case "INCREASE":
      return state.map(p =>
        p.code === action.payload
          ? {
            ...p,
            quantity: p.quantity + 1,
          }
          : p
      );

    case "DECREASE":
      return state.map(p =>
        p.code === action.payload &&
          p.quantity > 1
          ? {
            ...p,
            quantity: p.quantity - 1,
          }
          : p
      );

    case "REMOVE":
      return state.filter(
        p => p.code !== action.payload
      );

    case "REMOVE_ALL":
      return [];

    default:
      return state;
  }
}

export default function Home() {
  const [code, setCode] = useState("");
  const [calculator, setCalculator] = useState("");

  const [cart, dispatch] = useReducer(
    cartReducer,
    []
  );

  const productMutation = useMutation({
    mutationFn: getProduct,

    onSuccess: ({ data }) => {
      dispatch({
        type: "ADD_PRODUCT",
        payload: data.data,
      });

      setCode("");
    },
    onError: () => {
      console.error("Producto no encontrado");
    },
  });

  const saleMutation = useMutation({
    mutationFn: postSale,

    onSuccess: () => {
      dispatch({ type: "REMOVE_ALL" });
    },
    onError: () => {
      console.error("Venta no registrada");
    },
  });

  const handleSearch = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!code.trim()) return;

    productMutation.mutate(code);
  };

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

  const total = subtotal + extra;

  const addCalculatorValue = (
    value: string
  ) => {
    setCalculator(prev => prev + value);
  };

  const handleSubmit = () => {
    saleMutation.mutate({ paymentMethod: "CASH", extra, items: cart.map(x => ({ productId: x.id, quantity: x.quantity })) });
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
                dispatch({
                  type: "INCREASE",
                  payload: product.code,
                })
              }
              onDecrease={() =>
                dispatch({
                  type: "DECREASE",
                  payload: product.code,
                })
              }
              onRemove={() =>
                dispatch({
                  type: "REMOVE",
                  payload: product.code,
                })
              }
            />
          ))}
        </div>
      </div>

      {/* 💰 PANEL DERECHO */}
      <div className="col-span-3 flex flex-col gap-1">
        <form
          onSubmit={handleSearch}
          className="flex p-3 bg-black rounded-2xl shadow-md gap-1 w-full"
        >
          <input
            type="text"
            value={code}
            onChange={(e) =>
              setCode(e.target.value)
            }
            placeholder="Buscar"
            className="min-w-0 border rounded-lg px-3 py-2"
          />

          <button
            type="submit"
            className="bg-blue-500 px-4 rounded-lg"
          >
            Agregar
          </button>
        </form>

        {/* 💰 Totales */}
        <div className="bg-black rounded-2xl shadow-md p-6 flex-1 flex flex-col justify-between">
          <div className="space-y-3">
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

            <div className="border-t border-gray-700 pt-4 flex justify-between text-2xl font-bold">
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
                className="min-w-0 border rounded-lg px-3 py-2 text-right"
              />

              <button
                onClick={() =>
                  setCalculator(prev =>
                    prev.slice(0, -1)
                  )
                }
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