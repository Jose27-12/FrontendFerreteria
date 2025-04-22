import React, { useState } from 'react';
import axios from 'axios';
import './ForgotPassword.css'; // Asegúrate de importar el CSS
import { Link } from 'react-router-dom'; // Importa Link para las rutas

const ForgotPassword = () => {
  const [correo, setCorreo] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    try {
      const res = await axios.post('http://localhost:3000/api/auth/recuperar-contrasena', { correo });
      if (res.data.success) {
        setMensaje('Te hemos enviado un correo para restablecer tu contraseña.');
      } else {
        setMensaje('Correo no encontrado.');
      }
    } catch (error) {
      console.error(error);
      setMensaje('Hubo un error al enviar el correo.');
    }
    setCargando(false);
  };

  return (
    <div className="forgot-password-container">
      <h2>Recuperar Contraseña</h2>
      <form onSubmit={handleSubmit} className="forgot-password-form">
        <label>
          Ingresa tu correo electrónico:
          <input
            type="email"
            placeholder="correo@example.com"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
        </label>
        <button type="submit" disabled={cargando}>
          {cargando ? 'Enviando...' : 'Enviar correo de recuperación'}
        </button>
      </form>
      {mensaje && <p className="mensaje">{mensaje}</p>}
      
      {/* Enlaces para iniciar sesión y registrarse */}
      <div className="login-links">
        <p>
          ¿Ya tienes cuenta?<Link to="/login"><br/>Iniciar sesión</Link>
        </p>
        <p>
          ¿No tienes cuenta?<Link to="/register"><br/>Registrarse</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
