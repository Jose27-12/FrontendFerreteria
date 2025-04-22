import React, { useState } from 'react';
import axios from 'axios';

function UsuarioTable({ usuarios, obtenerUsuarios }) {
  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [mensajeExito, setMensajeExito] = useState(false);

  const handleDeleteClick = (usuario) => {
    console.log("Usuario seleccionado para eliminar:", usuario);
    setUsuarioAEliminar(usuario);
    setMostrarConfirmacion(true);
  };

  

  const confirmarEliminacion = async () => {
    try {
      await axios.delete(`http://localhost:3000/api/usuarios/${usuarioAEliminar.id_Usuario}`);
      setMostrarConfirmacion(false);
      setMensajeExito(true);
      obtenerUsuarios();  // Refrescar la lista de usuarios después de eliminar uno
       // Para refrescar la lista

      setTimeout(() => {
        setMensajeExito(false);
      }, 800);
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
    }
  };

  return (
    <>
      {mensajeExito && (
        <div className="overlay">
          <div className="mensaje-exito">✅ Usuario eliminado correctamente</div>
        </div>
      )}

      {mostrarConfirmacion && (
        <div className="overlay">
          <div className="mensaje-exito">
            <p>
              ¿Estás seguro de que deseas eliminar al usuario{" "}
              <strong>{usuarioAEliminar?.nombre}</strong>?
            </p>
            <div className="botones-confirmacion">
              <button onClick={confirmarEliminacion}>Sí</button>
              <button onClick={() => setMostrarConfirmacion(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      <table className="usuario-table">
        <thead>
          <tr>
            <th>id</th>
            <th>Nombre</th>
            <th>Cargo</th>
            <th>Correo</th>
            <th>Teléfono</th>
            <th>Sede</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u, index) => (
            <tr key={index}>
              <td>{u.id_Usuario}</td>
              <td>{u.nombre}</td>
              <td>{u.Cargo}</td>
              <td>{u.usuario}</td>
              <td>{u.telefono || 'N/A'}</td>
              <td>{u.id_Sede}</td>
              <td>
              <button className="delete-btn" onClick={() => {
                  console.log(u);  // Verifica si contiene id_Usuario
                  handleDeleteClick(u);
                }}>
                  🗑️ Eliminar
              </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default UsuarioTable;
