import React, { useState, useEffect} from "react";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import "./Configuracion.css"; // Asegúrate de tener el CSS correspondiente para el diseño
import { useNavigate } from "react-router-dom";

const Configuracion = ({ onLogout }) => {
  const [nuevaContrasena, setNuevaContrasena] = useState("");
  const [confirmarContrasena, setConfirmarContrasena] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargo, setCargo] = useState(localStorage.getItem("cargo"));
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificaciones, setNotificaciones] = useState([]);
  const [sede, setSede] = useState('');
  
  



  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  }

  const cerrarSesion = () => {
    localStorage.clear(); // 👈 Limpia la sesión
    if (onLogout) onLogout();
    navigate("/login"); // 👈 Redirige al login
  };
  // Obtener datos de cargo
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

  const cambiarContrasena = async () => {
    // Verificar que las contraseñas coinciden
    if (nuevaContrasena !== confirmarContrasena) {
      setMensaje("Las contraseñas no coinciden.");
      return;
    }
  
    // Obtener el correo del usuario desde localStorage
    const usuario = localStorage.getItem("correo"); // Obtener correo guardado en localStorage
    
    // Si el correo no está disponible en localStorage, mostrar un mensaje de error
    if (!usuario) {
      setMensaje("No se encontró el correo del usuario.");
      return;
    }
  
    try {
      console.log("Datos enviados:", {
        correo: usuario,
        nuevaContrasena
      });
  
      // Realizar la solicitud PUT para cambiar la contraseña
      const response = await axios.put("http://localhost:3000/api/auth/cambiar-contrasena", {
        correo: usuario,  // Enviar correo del usuario
        nuevaContrasena: nuevaContrasena,  // Enviar nueva contraseña
      });
  
      // Manejar la respuesta del servidor
      if (response.data.success) {
        setMensaje("Contraseña actualizada correctamente.");
        setNuevaContrasena("");  // Limpiar el campo de la nueva contraseña
        setConfirmarContrasena("");  // Limpiar el campo de confirmación de la contraseña
      } else {
        setMensaje("Error al actualizar la contraseña.");
      }
    } catch (error) {
      console.error("Error al cambiar contraseña:", error);
      setMensaje("Error en la solicitud.");
    }
  };
  
  

  return (
    <div className="almacen-page">
      <Sidebar 
        cargo={cargo} 
        isOpen={sidebarOpen} 
        toggleSidebar={toggleSidebar} 
        cantidadNotificaciones={notificaciones.length}
      />
    <div className={`configuracion ${sidebarOpen ? 'shifted' : ''}`}>
      <h2>Configuración</h2>

      <div className="cambiar-password">
        <h3>Cambiar contraseña</h3>
        <input
        className="input-password"
          type="password"
          placeholder="Nueva contraseña"
          value={nuevaContrasena}
          onChange={(e) => setNuevaContrasena(e.target.value)}
        />
        <input
        className=""
          type="password"
          placeholder="Confirmar contraseña"
          value={confirmarContrasena}
          onChange={(e) => setConfirmarContrasena(e.target.value)}
        />
        <button className="btn-actualizar" onClick={cambiarContrasena}>Actualizar</button>
        {mensaje && <p>{mensaje}</p>}
      </div>

      <hr />

      <button onClick={cerrarSesion} style={{ marginTop: "20px", backgroundColor: "red", color: "white" }}>
        Cerrar sesión
      </button>
    </div>
    </div>
  );
};

export default Configuracion;
