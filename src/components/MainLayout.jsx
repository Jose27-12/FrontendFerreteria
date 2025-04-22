// MainLayout.js
import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import axios from 'axios';

function MainLayout({ children, cargo }) {
  const [isOpen, setIsOpen] = useState(false);
  const [notificaciones, setNotificaciones] = useState([]);

  const toggleSidebar = () => setIsOpen(!isOpen);

  useEffect(() => {
    const obtenerNotificaciones = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/productos/bajo-stock');
        setNotificaciones(res.data);
      } catch (error) {
        console.error('Error al obtener notificaciones:', error);
      }
    };

    obtenerNotificaciones();
    const intervalo = setInterval(obtenerNotificaciones, 60000);
    return () => clearInterval(intervalo);
  }, []);

  return (
    <div className="main-layout">
      <Sidebar
        cargo={cargo}
        isOpen={isOpen}
        toggleSidebar={toggleSidebar}
        cantidadNotificaciones={notificaciones.length}
      />
      <div className={`main-content ${isOpen ? 'shifted' : ''}`}>
        {children}
      </div>
    </div>
  );
}

export default MainLayout;
