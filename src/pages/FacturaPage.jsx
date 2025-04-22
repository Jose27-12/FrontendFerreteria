import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Factura.css';

function FacturaPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) return <p>No hay datos para mostrar.</p>;

  const { cliente, productos, total, fecha } = state;

  return (
    <div className="factura-container">
      <h1>Factura</h1>
      <p><strong>Cliente:</strong> {cliente.nombre} {cliente.apellido}</p>
      <p><strong>Correo:</strong> {cliente.correo}</p>
      <p><strong>Teléfono:</strong> {cliente.telefono}</p>
      <p><strong>Dirección:</strong> {cliente.direccion}</p>
      <p><strong>Fecha:</strong> {fecha}</p>

      <table>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio Unitario</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((p, idx) => (
            <tr key={idx}>
              <td>{p.Nombre}</td>
              <td>{p.cantidad}</td>
              <td>${Number(p.Precio).toFixed(2)}</td>
              <td>${(Number(p.Precio) * p.cantidad).toFixed(2)}</td>

            </tr>
          ))}
        </tbody>
      </table>

      <h2>Total: ${total.toFixed(2)}</h2>

      <button onClick={() => navigate('/almacen')}>Volver</button>
    </div>
  );
}

export default FacturaPage;
