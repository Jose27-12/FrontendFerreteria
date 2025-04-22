import React, { useState, useEffect, use } from 'react';
import Sidebar from '../components/Sidebar';
import './notificaciones.css';
import axios from 'axios';
import MainLayout from '../components/MainLayout';



function Notificaciones() {
  const [notificaciones, setNotificaciones] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cargo, setCargo] = useState('');
  const [sede, setSede] = useState('');

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
  

  return (
    <div className="notificaciones-page">
      <Sidebar cargo={cargo} isOpen={sidebarOpen} toggleSidebar={toggleSidebar} 
      cantidadNotificaciones={notificaciones.length}/>
      <div className={`main-content ${sidebarOpen ? 'shifted' : ''}`}>
        <h1>Notificaciones</h1>
        <div className="notificaciones-container">
          <ul>
          {notificaciones.map((producto) => (
        <li key={producto.id_Producto} className="notificacion">
            ⚠️ {producto.Nombre} tiene solo {producto.Stock} unidades en stock de la sede {producto.id_Sede}.
        </li>
))}

          </ul>
        </div>
      </div>
    </div>
  );
}

export default Notificaciones;
