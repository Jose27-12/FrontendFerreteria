import React, { useState, useEffect, use } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar'; // Asegúrate de tener este componente
import './AddProductForm.css'; // Puedes renombrarlo si quieres algo como AddProveedorForm.css
import { useNavigate } from 'react-router-dom';

function AddProveedorForm() {
  const sede = localStorage.getItem('sede');
  const cargo = localStorage.getItem('cargo');
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [sedeSeleccionada, setSedeSeleccionada] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [notificaciones, setNotificaciones] = useState([]);
  const [tipoMensaje, setTipoMensaje] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate(); // Para redirigir luego de guardar

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    if (cargo !== 'Admin') {
      setSedeSeleccionada(sede); // Si no es admin, la sede es fija
    }
  }, [cargo, sede]);

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
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      nombre,
      telefono,
      direccion,
      id_Sede: parseInt(sedeSeleccionada),
    };

    if (!data.nombre || !data.telefono || !data.direccion || !data.id_Sede) {
      setMensaje('⚠️ Por favor completa todos los campos correctamente.');
      setTipoMensaje('error');
      return;
    }

    try {
      const res = await axios.post('http://localhost:3000/api/proveedores/agregar', data);
      if (res.data.success) {
        setMensaje('✅ Proveedor agregado correctamente.');
        setTipoMensaje('exito');

        // Limpiar y redirigir después de un par de segundos
        setTimeout(() => {
          setMensaje('');
          setTipoMensaje('');
          navigate('/proveedor'); // Vuelve a la lista
        }, 2000);

        setNombre('');
        setTelefono('');
        setDireccion('');
      }
    } catch (err) {
      console.error('Error al agregar proveedor:', err);
      setMensaje('❌ Error al conectar con el servidor.');
      setTipoMensaje('error');
    }
  };

  return (
    <div className="main-layout">
      <Sidebar 
        cargo={cargo} 
        isOpen={sidebarOpen} 
        toggleSidebar={toggleSidebar} 
        cantidadNotificaciones={notificaciones.length}
      />
      <div className={`add-product-container ${sidebarOpen ? 'shifted' : ''}`}>
        {mensaje && (
          <div className={`mensaje-feedback ${tipoMensaje}`}>
            {mensaje}
          </div>
        )}

        <form className="add-product-form" onSubmit={handleSubmit}>
          <h2>Agregar Proveedor</h2>

          <input
            type="text"
            placeholder="Nombre del proveedor"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Teléfono"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Dirección"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            required
          />

          <button type="submit">Guardar Proveedor</button>
        </form>
      </div>
    </div>
  );
}

export default AddProveedorForm;
