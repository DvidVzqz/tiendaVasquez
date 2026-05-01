import React from "react";
import { getProduct } from "../api/products";

export default function Home() {
  const { data, isPending, error } = getProduct("SABRITAS");
  if (isPending) return <p>Cargando...</p>;
  return <div>Home</div>;
}



