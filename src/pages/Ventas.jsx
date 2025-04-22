import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import './admin.css'; // Usa el mismo CSS que Almacen
import './notificaciones.css'; // Usa el mismo CSS que Almacen
import axios from 'axios';

function Ventas() {
  const [ventas, setVentas] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cargo, setCargo] = useState('');
  const [busqueda, setBusqueda] = useState('');
   const [notificaciones, setNotificaciones] = useState([]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    const storedCargo = localStorage.getItem('cargo');
    if (storedCargo) setCargo(storedCargo);

    fetch('http://localhost:3000/api/ventas')
      .then(res => res.json())
      .then(data => setVentas(data))
      .catch(error => {
        console.error('Error al cargar ventas:', error);
        alert('Error al cargar ventas');
      });
  }, []);

  // Obtener notificaciones de bajo stock
  useEffect(() => {
    const obtenerNotificaciones = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/productos/bajo-stock');
        setNotificaciones(response.data);
      } catch (error) {
        console.error('Error al obtener notificaciones:', error);
      }
    };

    obtenerNotificaciones();
    const intervalo = setInterval(obtenerNotificaciones, 60000); // Actualizar cada minuto

    return () => clearInterval(intervalo); // Limpiar intervalo cuando el componente se desmonte
  }, []);

  // Función para formatear precios al estilo colombiano
  const formatearPrecio = (precio) => {
    const numPrecio = Number(precio);
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(numPrecio);
  };

  // Filtro por búsqueda (cliente o producto)
  const ventasFiltradas = ventas.filter((venta) =>
    `${venta.nombre_cliente} ${venta.apellido} ${venta.nombre_producto}`.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="almacen-page">
      <Sidebar 
        cargo={cargo} 
        isOpen={sidebarOpen} 
        toggleSidebar={toggleSidebar} 
        cantidadNotificaciones={notificaciones.length}
      />
      <div className={`main-content ${sidebarOpen ? 'shifted' : ''}`}>
        <div className="header-productos">
          <h1>Ventas Realizadas</h1>
        </div>

        <input
          type="text"
          placeholder="Buscar cliente o producto..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="search-input"
        />

        {ventasFiltradas.length === 0 ? (
          <p>No hay ventas registradas.</p>
        ) : (
          <table className="ventas-table">
            <thead>
              <tr>
                <th>Factura</th>
                <th>Fecha</th>
                <th>Cliente</th>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio Unitario</th>
                <th>Total Factura</th>
              </tr>
            </thead>
            <tbody>
              {ventasFiltradas.map((venta, index) => (
                <tr key={index}>
                  <td>{venta.id_facturacion}</td>
                  <td>{new Date(venta.fecha).toLocaleDateString()}</td>
                  <td>{venta.nombre_cliente} {venta.apellido}</td>
                  <td>{venta.nombre_producto}</td>
                  <td>{venta.cantidad}</td>
                  <td>{formatearPrecio(venta.precio_unitario)}</td>
                  <td>{formatearPrecio(venta.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Ventas;
