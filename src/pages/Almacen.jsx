import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import ProductTable from '../components/ProductTable';
import { FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext'; // 👈 Importas el contexto
import './admin.css';
import './notificaciones.css';
import axios from 'axios'; // Asegúrate de importar axios para hacer las peticiones HTTP


function Almacen() {
  const [busqueda, setBusqueda] = useState('');
  const [cargo, setCargo] = useState('');
  const [sede, setSede] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { carrito, setCarrito } = useCart(); // 👈 Obtienes datos del contexto
  const [mostrarCarrito, setMostrarCarrito] = useState(false);
  const [notificaciones, setNotificaciones] = useState([]);


  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    const storedCargo = localStorage.getItem('cargo');
    const storedSede = localStorage.getItem('sede');
    if (storedCargo) setCargo(storedCargo);
    if (storedSede) setSede(Number(storedSede));

  }
  , []);

  useEffect(() => {
    const obtenerNotificaciones = async () => {
      try {
        const storedSede = localStorage.getItem('sede');
        const sedeUsuario = storedSede ? Number(storedSede) : null;
  
        const response = await axios.get('http://localhost:3000/api/productos/bajo-stock');
  
        const productosFiltrados = sedeUsuario
          ? response.data.filter(producto => Number(producto.id_Sede) === sedeUsuario)
          : response.data;
  
        setNotificaciones(productosFiltrados);
      } catch (error) {
        console.error('Error al obtener notificaciones:', error);
      }
    };
  
    obtenerNotificaciones();
    const intervalo = setInterval(obtenerNotificaciones, 60000); // cada 60 segundos
  
    return () => clearInterval(intervalo);
  }, []);

  const navigate = useNavigate();

  // Define la función formatearPrecio aquí
  const formatearPrecio = (precio) => {
    const numPrecio = Number(precio);
    if (isNaN(numPrecio)) return '$0';
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numPrecio);
  };

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
        <h1>Productos</h1>
        {cargo === 'Vendedor' && (
        <button className="carrito-icono" onClick={() => setMostrarCarrito(true)}>
          🛒 ({carrito.reduce((acc, item) => acc + item.cantidad, 0)})
        </button>
        )}
      </div>

      <input
        type="text"
        placeholder="Buscar producto..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="search-input"
      />
      
        {cargo && cargo !== 'Vendedor' && (
          <button className="add-product-btn" onClick={() => navigate('/agregar-producto')}>
            <FaPlus /> Agregar Producto
          </button>
        )}
        <ProductTable
          busqueda={busqueda}
          cargo={cargo}
          idSede={sede}
          carrito={carrito}
          setCarrito={setCarrito}
          formatearPrecio={formatearPrecio}
        />


        {/* 🔽🔽 Aquí agregas el carrito/modal justo antes de cerrar el main-content 🔽🔽 */}
      {mostrarCarrito && (
        <div className="overlay">
          <div className="modal-edicion">
            <h3>🛒 Carrito</h3>
            {carrito.length === 0 ? (
              <p>El carrito está vacío.</p>
            ) : (
              <ul>
                {carrito.map((producto) => (
                  <li key={producto.id_Producto}>
                     {producto.Nombre} - cantidad: {producto.cantidad}  - subtotal: {formatearPrecio(producto.Precio * producto.cantidad)}
                  </li>
                ))}
              </ul>
            )}
            <button className='btn-cerrar' onClick={() => setMostrarCarrito(false)}>Cerrar</button>
            <button className='btn-vaciar' onClick={() => setCarrito([])}>Vaciar Carrito</button>
            <button className='btn-finalizar' onClick={() => navigate('/Checkout')}>Finalizar Compra</button>
            
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

export default Almacen;
