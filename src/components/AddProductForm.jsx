import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar'; // Asegúrate de que la ruta sea correcta
import './AddProductForm.css'; // Asegúrate de tener un archivo CSS para estilos

function AddProductForm() {
  
  const sede = localStorage.getItem('sede');

  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');
  const [sedeSeleccionada, setSedeSeleccionada] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState(''); // 'exito' o 'error'
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificaciones, setNotificaciones] = useState([]);
  const cargo = localStorage.getItem('cargo'); // Obtener el cargo del usuario desde localStorage

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  }
  
  useEffect(() => {
    if (cargo !== 'Admin') {
      setSedeSeleccionada(sede);
    }
  }, [cargo, sede]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      nombre,
      precio: parseFloat(precio),
      stock: parseInt(stock),
      id_Sede: parseInt(sedeSeleccionada),
      id_Categoria: parseInt(categoriaSeleccionada),
    };

    if (!data.nombre || isNaN(data.precio) || isNaN(data.stock) || !data.id_Sede || !data.id_Categoria) {
      setMensaje('⚠️ Por favor completa todos los campos correctamente.');
      setTipoMensaje('error');
      return;
    }
    
    try {
      const res = await axios.post('http://localhost:3000/api/productos/agregar', data);
      if (res.data.success) {
        setMensaje('Producto agregado correctamente');
        setTipoMensaje('exito');

        setTimeout(() => {
          setMensaje('');
          setTipoMensaje('');
        }, 500);
        setNombre('');
        setPrecio('');
        setStock('');
        setCategoriaSeleccionada('');
        if (cargo === 'Admin') setSedeSeleccionada('');
      } else {
        setMensaje(' No se pudo agregar el producto');
        setTipoMensaje('error');

        setTimeout(() => {
          setMensaje('');
          setTipoMensaje('');
        }, 500);
      }
    } catch (err) {
      console.error('Error al enviar producto:', err);
      setMensaje(' Error al conectar con el servidor');
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
          <h2>Agregar Producto</h2>
          <input type="text" placeholder="Nombre del producto" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
          <input type="number" placeholder="Precio" value={precio} onChange={(e) => setPrecio(e.target.value)} required />
          <input type="number" placeholder="Stock" value={stock} onChange={(e) => setStock(e.target.value)} required />
  
          {cargo === 'Admin' && (
            <select value={sedeSeleccionada} onChange={(e) => setSedeSeleccionada(e.target.value)} required>
              <option value="">Seleccionar sede</option>
              <option value="1">Sede 1</option>
              <option value="2">Sede 2</option>
            </select>
          )}
  
          <select value={categoriaSeleccionada} onChange={(e) => setCategoriaSeleccionada(e.target.value)} required>
            <option value="">Seleccionar categoría</option>
            <option value="1">Categoría 1</option>
            <option value="2">Categoría 2</option>
            <option value="3">Categoría 3</option>
            <option value="4">Categoría 4</option>
          </select>
  
          <button type="submit">Guardar Producto</button>
        </form>
      </div>
    </div>
  );
}
export default AddProductForm;
