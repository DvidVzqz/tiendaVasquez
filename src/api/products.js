import api from "./client";
import { useQuery } from "@tanstack/react-query";

export function getProductos() {
  const { data, isPending, error } = useQuery({
    queryKey: ["getProductos"],
    queryFn: () => api.get("/producto"),
  });
  if (isPending) return <span>Cargando...</span>;
  if (error) return <span>Oops!</span>;

  return (
    <ul>
      {data.map((t) => (
        <li key={t.id}>{t.title}</li>
      ))}
    </ul>
  );
}

export const crearProducto = (data) => api.post("/product", data);

export const modProducto = (data) => api.post("/product/modificar", data);

export const delProducto = (data) => api.post("/product/eliminar", data);
