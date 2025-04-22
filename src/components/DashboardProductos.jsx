import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import axios from 'axios';

const DashboardProductos = () => {
  const [productos, setProductos] = useState([]);
  const [rango, setRango] = useState("diario");
  const [tipoProducto, setTipoProducto] = useState("mas-vendidos");  // Estado para controlar si son más o menos vendidos

  useEffect(() => {
    obtenerProductos();
  }, [rango, tipoProducto]);

  const obtenerProductos = async () => {
    const url = tipoProducto === 'mas-vendidos'
      ? `http://localhost:3000/api/productos-mas-vendidos?rango=${rango}`
      : `http://localhost:3000/api/productos-menos-vendidos?rango=${rango}`;
    
    try {
      const response = await axios.get(url);
      setProductos(response.data);
    } catch (error) {
      console.error("Error al obtener los productos:", error);
    }
  };

  const formatearPrecio = (precio) => {
    const numPrecio = Number(precio);
    if (isNaN(numPrecio)) {
      return "Precio inválido";
    }
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numPrecio);
  };

  const productosProcesados = productos.map(p => ({
    ...p,
    total_vendidos: Number(p.total_vendidos)
  }));

  return (
    <div className="dashboard">
      <h1>{tipoProducto === "mas-vendidos" ? "Top 8 Productos Más Vendidos" : "Top 8 Productos Menos Vendidos"} ({rango})</h1>

      {/* Selector para el rango de tiempo */}
      <select value={rango} onChange={(e) => setRango(e.target.value)}>
        <option value="diario">Diario</option>
        <option value="semanal">Semanal</option>
        <option value="mensual">Mensual</option>
      </select>

      {/* Selector para elegir entre más vendidos o menos vendidos */}
      <select value={tipoProducto} onChange={(e) => setTipoProducto(e.target.value)}>
        <option value="mas-vendidos">Más Vendidos</option>
        <option value="menos-vendidos">Menos Vendidos</option>
      </select>

      <div style={{ width: "100%", height: 250 }}>
        <ResponsiveContainer>
          <BarChart data={productosProcesados} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="nombre_producto" />
            <YAxis domain={[0, (dataMax) => Math.ceil(dataMax * 1.1)]} />
            <Tooltip />
            <Bar dataKey="total_vendidos" fill="#007bff" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Tabla de productos */}
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Producto</th>
            <th>Total Vendidos</th>
            <th>Ingresos</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{producto.nombre_producto}</td>
              <td>{producto.total_vendidos}</td>
              <td>
                {producto.ingresos !== null && !isNaN(producto.ingresos) 
                  ? formatearPrecio(producto.ingresos) 
                  : "$0"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DashboardProductos;
