import React, { useState } from 'react';
import './Register.css';
import axios from 'axios';
import { FaUser, FaEnvelope, FaLock, FaPhone } from 'react-icons/fa';

const Register = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    contraseña: '',
    telefono: '',
    cargo: '',
    id_Sede: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

    const handleSubmit = async () => {
      try {
      const response = await axios.post('http://localhost:3000/api/auth/register', formData);
      alert(response.data.mensaje);
    } catch (error) {
      console.error('Error al registrar:', error);
      alert('Error al registrar');
    } 
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>REGÍSTRATE YA!</h2>

        <div className="input-group">
          <input type="text" name="nombre" placeholder="Nombre" onChange={handleChange} />
          <FaUser />
        </div>

        <div className="input-group">
          <input type="email" name="correo" placeholder="Correo" onChange={handleChange} />
          <FaEnvelope />
        </div>

        <div className="input-group">
          <input type="password" name="contraseña" placeholder="Contraseña" onChange={handleChange} />
          <FaLock />
        </div>

        <div className="input-group">
          <input type="text" name="telefono" placeholder="Teléfono" onChange={handleChange} />
          <FaPhone />
        </div>

        <div className="input-group">
          <select name="cargo" onChange={handleChange} defaultValue="">
            <option value="" disabled>Seleccione un cargo    ▼</option>
            <option value="Vendedor">Vendedor</option>
            <option value="Inventario">Inventario</option>
          </select>
        </div>

        <div className="input-group">
          <select name="id_Sede" onChange={handleChange} defaultValue="">
            <option value="" disabled>Seleccione una sede ▼</option>
            <option value="1">Sede 1</option>
            <option value="2">Sede 2</option>
          </select>
        </div>

        <button className="register-button" onClick={handleSubmit}>REGISTRAR</button>

        <p className="register-footer">
          Ya tienes cuenta? <a href="/">Click aquí</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
