import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import './Checkout.css';
import { useCart } from '../context/CartContext';
import { crearFactura } from '../services/facturaService';
import { crearDetalleFactura } from '../services/detalleFacturaService'
import { generarFacturaPDF } from '../utils/generarFacturaPDF';

function Checkout() {
  const navigate = useNavigate();
  const { carrito, formatearPrecio } = useCart();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mensajeExito, setMensajeExito] = useState(false);
  const [productos, setProductos] = useState([]); // Estado para los productos
  const cargo = localStorage.getItem('cargo');


  const total = carrito.reduce((acc, item) => acc + item.Precio * item.cantidad, 0);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const [cliente, setCliente] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    direccion: '',
    correo: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCliente({ ...cliente, [name]: value });
  };

  const confirmarCompra = async () => {

    // 1. Crear cliente en la base de datos
    try {
      const clienteRes = await fetch('http://localhost:3000/api/clientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cliente)
      });
  
      if (!clienteRes.ok) throw new Error('Error al crear cliente');
      const clienteData = await clienteRes.json();
      const id_cliente = clienteData.id_cliente;
      const id_sede = localStorage.getItem('sede');
  

      // 2. Registrar la venta en la base de datos
      
        await fetch('http://localhost:3000/api/ventas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id_Cliente: id_cliente,
            Fecha: new Date().toISOString().split('T')[0],
            Total: total
          })
        });


      // 3. Crear factura y los productos en la base de datos
      const productosFormateados = carrito.map((producto) => ({
        
        id_producto: producto.id_Producto,

        cantidad: producto.cantidad,
        precio_unitario: producto.Precio
      }));
      
  
      const facturaData = await crearFactura(
        id_cliente,
        id_sede,
        new Date().toISOString().split('T')[0],
        total,
        cliente,
        productosFormateados
      );
      
      const id_Facturacion = facturaData.id_Facturacion;


  

        // 4. Crear detalles de la factura
        for (let producto of carrito) {
          await fetch('http://localhost:3000/api/detalle-factura', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id_Facturacion: id_Facturacion,
              id_Producto: producto.id_Producto,
              Cantidad: producto.cantidad,
              Precio_Unitario: producto.Precio
            })
          });
        
        
      await fetch(`http://localhost:3000/api/productos/${producto.id_Producto}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({cantidad: producto.stock - producto.cantidad})
});  
      }

      const facturaParaPDF = {
        
        id_Cliente: clienteData.id_cliente,
        id_Producto: carrito.map(p => p.id_Producto).join(', '),
        id_Empleado: localStorage.getItem('correo'),
        
        id_Sede: localStorage.getItem('sede'),
        fecha: new Date().toISOString().split('T')[0],
        nombre_cliente: cliente.nombre,
        apellido: cliente.apellido,
        telefono: cliente.telefono,  
        direccion: cliente.direccion, 
        nombre_producto: carrito.map(p => p.Nombre).join(', '),
        cantidad: carrito.reduce((acc, p) => acc + p.cantidad, 0),
        precio_unitario: carrito[0].Precio,
        total: total
      };
      
      generarFacturaPDF(facturaParaPDF);
      await notificarInventario(carrito, clienteData);

      
  
      setMensajeExito('✅ ¡Factura y detalles creados exitosamente! Redirigiendo a almacén...');
      console.log('Factura creada:', facturaData);
  
      
      setTimeout(() => {
        navigate('/almacen');
      }, 900);
  
    } catch (error) {
      console.error('Error al procesar la compra:', error);
      alert('Ocurrió un error al procesar la compra');
    }


    
  };
  
  const notificarInventario = async (productos, cliente) => {
    try {
      const mensaje = `Nueva orden para entregar. Cliente: ${cliente.nombre} ${cliente.apellido}. Productos a entregar: ${productos.map((p) => `${p.Nombre} (Cantidad: ${p.cantidad})`).join(', ')}`;
  
      await fetch('http://localhost:3000/api/notificaciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mensaje,
          Cargo: 'Inventario',
          id_cliente: cliente.id_cliente,
          productos: productos
        })
      });
  
      console.log('Notificación enviada al inventario');
    } catch (error) {
      console.error('Error al enviar notificación al inventario:', error);
    }
  };
  
  

  return (
    <div className="checkout-page">
      <Sidebar cargo={cargo} isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={`checkout-container ${sidebarOpen ? 'shifted' : ''}`}>
          {mensajeExito && (
          <div className="mensaje-exito">
            {mensajeExito}
          </div>
        )}

        
        <h1>Resumen de Compra</h1>

        {/* Formulario del cliente */}
        <h2>Datos del Cliente</h2>
        <form className="formulario-cliente">
          <input
            name="nombre"
            placeholder="Nombre"
            onChange={handleChange}
            required
          />
          <input
            name="apellido"
            placeholder="Apellido"
            onChange={handleChange}
            required
          />
          <input
            name="telefono"
            placeholder="Teléfono"
            onChange={handleChange}
            required
          />
          <input
            name="direccion"
            placeholder="Dirección"
            onChange={handleChange}
            required
          />
          <input
            name="correo"
            placeholder="Correo electrónico"
            onChange={handleChange}
            required
          />
        </form>

        {/* Lista de productos en carrito */}
        {carrito.length === 0 ? (
          <p>El carrito está vacío.</p>
        ) : (
          <ul className="checkout-list">
            {carrito.map((producto) => (
              <li key={producto.id_Producto} className="checkout-item">
                <span>{producto.Nombre}</span>
                <span>Cantidad: {producto.cantidad}</span>
                <span>Subtotal: {formatearPrecio(producto.Precio * producto.cantidad)}</span>
              </li>
            ))}
          </ul>
        )}

        <h2 className="checkout-total">Total: {formatearPrecio(total)}</h2>

        <div className="checkout-buttons">
          <button className="btn-confirm" onClick={confirmarCompra}>Confirmar Compra</button>
          <button 
              className="btn-back" 
              onClick={() => {
                navigate(-1); 
              }}
            >
              Volver
          </button>

        </div>
      </div>
    </div>
  );
}

export default Checkout;
