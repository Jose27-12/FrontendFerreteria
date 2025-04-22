import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import ClienteTable from '../components/ClienteTable';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Asegúrate de importar axios para hacer las peticiones HTTP
import './admin.css';
import './notificaciones.css';

function Clientes() {
  const [busqueda, setBusqueda] = useState('');
  const [cargo, setCargo] = useState('');
  const [sede, setSede] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificaciones, setNotificaciones] = useState([]);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  }

  // Obtener datos de cargo y sede desde localStorage
  useEffect(() => {
    const storedCargo = localStorage.getItem('cargo');
    const storedSede = localStorage.getItem('sede');
    setCargo(storedCargo);
    setSede(storedSede);
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

  const navigate = useNavigate();

  return (
    <div className="almacen-page">
      <Sidebar 
        cargo={cargo} 
        isOpen={sidebarOpen} 
        toggleSidebar={toggleSidebar} 
        cantidadNotificaciones={notificaciones.length}
      />
      <div className={`main-content ${sidebarOpen ? 'shifted' : ''}`}>
        <h1>Clientes</h1>
        {/* Buscar cliente */}
        <input
            type="text"
            placeholder="Buscar Cliente..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
        /> 

        {/* Mostrar la tabla de clientes */}
        <ClienteTable busqueda={busqueda} cargo={cargo} sede={sede} />
      </div>
    </div>
  );
}

export default Clientes;
