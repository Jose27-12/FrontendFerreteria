import React, { useEffect } from 'react';
import DashboardProductos from '../components/DashboardProductos';
import Sidebar from '../components/Sidebar';
;
import './Dashboard.css'; // Asegúrate de tener el CSS correspondiente para el diseño

import axios from 'axios'; // Asegúrate de importar axios para hacer las peticiones HTTP

function Dashboard() {
  const [cargo, setCargo] = React.useState('');
  const [sede, setSede] = React.useState('');
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [notificaciones, setNotificaciones] = React.useState([]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Obtener datos de cargo y sede desde localStorage
  React.useEffect(() => {
    const storedCargo = localStorage.getItem('cargo');
    const storedSede = localStorage.getItem('sede');
    setCargo(storedCargo);
    setSede(storedSede);
  }, []);

  // Obtener notificaciones desde localStorage
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


  return (
    <div className="dashboard-page">
      <Sidebar 
        cargo={cargo}
        isOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        cantidadNotificaciones={notificaciones.length}
      />
      <div className={`dashboard-contenido ${sidebarOpen ? "shifted" : ""}`}>
        <div className={`dashboard ${sidebarOpen ? "shifted" : ""}`}>
          <DashboardProductos />
        </div>
      </div>
    </div>
  );
  
  
}

export default Dashboard;
