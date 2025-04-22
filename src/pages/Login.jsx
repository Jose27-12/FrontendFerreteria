// src/pages/Login.jsx
import React, { useState } from 'react';
import './Login.css';
import { MdEmail, MdLock } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:3000/api/auth/login', {
        usuario,
        contrasena
      });
      
      if (res.data.success) {
        localStorage.setItem('cargo', res.data.cargo);      
        localStorage.setItem('sede', res.data.id_Sede);
        localStorage.setItem('correo', usuario); // Guardar el correo en localStorage
        navigate('/almacen');
      } else {
        alert('Credenciales inválidas');
      }

    } catch (error) {
      console.error(error);
      alert('Error en el servidor');
    }
  };

  return (
    <div className="login-container">
      <h2>INICIO DE SESION</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <label>
          <div className="input-with-icon">
            <MdEmail className="icon"/>
            <input
            className=''
              type="text"
              placeholder="correo@example.com"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              required
            />
          </div>
        </label>

        <label>
          <div className="input-with-icon">
            <MdLock className="icon"/>
            <input
            className='input-password'
              type="password"
              placeholder="Tu contraseña"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              required
            />
          </div>
        </label>

        <button type="submit" className='btn-login'>INICIAR</button>

        <div className="login-links">
          <a href="/register">Regístrate</a>
          <a href="/forgot-password">¿Olvidaste tu clave?</a>
        </div>
      </form>
    </div>
  );
};

export default Login;
