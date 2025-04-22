import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import UsuarioTable from '../components/UsuarioTable';
import { FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Asegúrate de importar axios para hacer las peticiones HTTP
import './admin.css';


function Usuarios() {
  const [busqueda, setBusqueda] = useState('');
  const [cargo, setCargo] = useState('');
  const [sede, setSede] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [notificaciones, setNotificaciones] = useState([]);

  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Obtener datos de los usuarios
  const fetchUsuarios = async () => {
    try {
      const storedSede = localStorage.getItem('sede');
      const response = await fetch(`http://localhost:3000/api/usuarios?id_Sede=${storedSede}`);
      if (!response.ok) {
        throw new Error('Error al obtener los usuarios');
      }
      const data = await response.json();
      setUsuarios(data);
    } catch (error) {
      console.error(error);
    }
  };

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

  // Obtener el cargo y sede del localStorage
  useEffect(() => {
    const storedCargo = localStorage.getItem('cargo');
    const storedSede = localStorage.getItem('sede');
    if (storedCargo) setCargo(storedCargo);
    if (storedSede) setSede(storedSede);

    fetchUsuarios(); // Llama a la función cuando el componente se monta
  }, []);

  const buscarUsuario = async (nombre) => {
    console.log("Buscando usuario con nombre:", nombre);  // Agregar un log para ver el valor de 'nombre'
    try {
      const response = await fetch(`http://localhost:3000/api/usuarios/buscar?nombre=${nombre}`);
      if (!response.ok) {
        throw new Error('Error al buscar el usuario');
      }
      const data = await response.json();
      console.log("Datos de usuarios encontrados:", data);  // Ver los datos recibidos
      setUsuarios(data);  // Actualizar el estado con los resultados
    } catch (error) {
      console.error('Error al buscar usuarios:', error);
    }
  };

  // Función que se ejecuta cada vez que cambia la búsqueda
  const handleSearchChange = (event) => {
    setBusqueda(event.target.value);  // Actualiza el valor de busqueda
    buscarUsuario(event.target.value);  // Llama a la función de búsqueda con el nuevo valor
  };

  const usuariosFiltrados = usuarios.filter((usuario) =>
    `${usuario.Nombre} ${usuario.Apellido}`.toLowerCase().includes(busqueda.toLowerCase())
  );

  

  return (
    <div className="almacen-page">
      <Sidebar 
        cargo={cargo} 
        isOpen={sidebarOpen} 
        toggleSidebar={toggleSidebar} 
        cantidadNotificaciones={notificaciones.length} // Pasamos la cantidad de notificaciones
      />
      <div className={`main-content ${sidebarOpen ? 'shifted' : ''}`}>
        <div className="header-productos">
          <h1>Usuarios</h1>
        </div>

        <input
          type="text"
          placeholder="Buscar usuario..."
          value={busqueda}
          onChange={handleSearchChange} 
          className="search-input"
        />

        {/* Mostrar la tabla de usuarios */}
        <UsuarioTable usuarios={usuariosFiltrados} obtenerUsuarios={fetchUsuarios} />
      </div>
    </div>
  );
}

export default Usuarios;
