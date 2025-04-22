import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import ProveedorTable from '../components/ProveedorTable'; // Cambié ProductTable por ProveedorTable
import { FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Asegúrate de importar axios para hacer las peticiones HTTP
import './admin.css';
import './notificaciones.css';

function Proveedor() {
  const [busqueda, setBusqueda] = useState('');
  const [cargo, setCargo] = useState('');
  const [sede, setSede] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificaciones, setNotificaciones] = useState([]);
    const [proveedores, setProveedores] = useState([]); // Estado para almacenar los proveedores

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    const storedCargo = localStorage.getItem('cargo');
    const storedSede = localStorage.getItem('sede');
    if (storedCargo) setCargo(storedCargo);
    if (storedSede) setSede(storedSede);
  }, []);

  


  const navigate = useNavigate();
  //obtener proveedores desde el backend
    const fetchProveedores = async () => {
        try {
        const response = await axios.get(`http://localhost:3000/api/proveedores`);
        setProveedores(response.data);
        } catch (error) {
        console.error('Error al obtener proveedores:', error);
        }
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
    <div className="almacen-page">
      <Sidebar 
        cargo={cargo} 
        isOpen={sidebarOpen} 
        toggleSidebar={toggleSidebar} 
        cantidadNotificaciones={notificaciones.length}
      />
      <div className={`main-content ${sidebarOpen ? 'shifted' : ''}`}>
        <div className="header-proveedores">
          <h1>Proveedores</h1>
        </div>

        <input
          type="text"
          placeholder="Buscar proveedor..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="search-input"
        />
        
        {cargo && cargo !== 'Vendedor' && (
          <button className="add-product-btn" onClick={() => navigate('/agregar-proveedor')}>
            <FaPlus /> Agregar Proveedor
          </button>
        )}
        
        <ProveedorTable
            busqueda={busqueda}
            cargo={cargo}
            idSede={sede}
            proveedores={proveedores} // 👈 pasa esta prop
           
        />


      </div>
    </div>
  );
}

export default Proveedor;
