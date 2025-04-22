import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ProveedorTable({ busqueda, cargo, idSede }) {
  const [proveedores, setProveedores] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [mensajeExito, setMensajeExito] = useState(false);

  const [datosEditados, setDatosEditados] = useState({
    nombre: "",
    telefono: "",
    direccion: "",
  });

  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
  const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);
  const [idProveedorEliminar, setIdProveedorEliminar] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerProveedores = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/proveedores`);
        setProveedores(response.data);
      } catch (error) {
        console.error('Error al obtener proveedores:', error);
      }
    };
    obtenerProveedores();
  }, []);

  const manejarEditarClick = (proveedor) => {
    setEditandoId(proveedor.id_Proveedor);
    setDatosEditados({
      nombre: proveedor.Nombre,
      telefono: proveedor.Telefono,
      direccion: proveedor.Direccion,
    });
    setMostrarModalEdicion(true);
  };

  const cancelarEdicion = () => {
    setMostrarModalEdicion(false);
    setEditandoId(null);
  };

  const guardarCambios = async () => {
    try {
      await axios.put(`http://localhost:3000/api/proveedores/${editandoId}`, {
        nombre: datosEditados.nombre,
        telefono: datosEditados.telefono,
        direccion: datosEditados.direccion,
      });

      setMostrarModalEdicion(false);
      setEditandoId(null);
      setMensaje("Proveedor actualizado correctamente.");
      setTimeout(() => setMensaje(""), 3000); // Borrar mensaje después de 3 segundos
      const response = await axios.get(`http://localhost:3000/api/proveedores`);
      setProveedores(response.data);
    } catch (error) {
      console.error("Error al guardar cambios:", error);
      setMensaje("Error al actualizar proveedor.");
      setTimeout(() => setMensaje(""), 3000); // Borrar mensaje después de 3 segundos
    }
  };

  const confirmarEliminacion = (id) => {
    setIdProveedorEliminar(id);
    setMostrarModalEliminar(true);
  };

  const cancelarEliminacion = () => {
    setMostrarModalEliminar(false);
    setIdProveedorEliminar(null);
  };

  const handleDeleteProveedor = async () => {
    if (idProveedorEliminar) {
      try {
        await axios.delete(`http://localhost:3000/api/proveedores/${idProveedorEliminar}`);
        setMostrarModalEliminar(false);
        setIdProveedorEliminar(null);
        setMensajeExito(true);
        setTimeout(() => setMensajeExito(false), 700); // Borrar mensaje después de 2 segundos
        const response = await axios.get(`http://localhost:3000/api/proveedores`);
        setProveedores(response.data);
      } catch (error) {
        console.error("Error al eliminar proveedor:", error);
        setMensaje("Error al eliminar proveedor.");
        setTimeout(() => setMensaje(""), 900); // Borrar mensaje después de 3 segundos
      }
    }
  };

  return (
    <>
      {mensajeExito && (
        <div className="overlay">
          <div className="mensaje-exito">✅ Proveedor eliminado correctamente</div>
        </div>
      )}
  
      {/* Modal para editar proveedor */}
      {mostrarModalEdicion && (
        <div className="overlay">
          <div className="modal-edicion">
            <h3>Editar Proveedor</h3>
            <label>Nombre:</label>
            <input
              type="text"
              value={datosEditados.nombre}
              onChange={(e) =>
                setDatosEditados({ ...datosEditados, nombre: e.target.value })
              }
            />
            <label>Teléfono:</label>
            <input
              type="text"
              value={datosEditados.telefono}
              onChange={(e) =>
                setDatosEditados({ ...datosEditados, telefono: e.target.value })
              }
            />
            <label>Dirección:</label>
            <input
              type="text"
              value={datosEditados.direccion}
              onChange={(e) =>
                setDatosEditados({ ...datosEditados, direccion: e.target.value })
              }
            />
            <div className="botones-modal">
              <button className="btn-guardar" onClick={guardarCambios}>💾 Guardar</button>
              <button className="btn-cancelar" onClick={cancelarEdicion}>❌ Cancelar</button>
            </div>
          </div>
        </div>
      )}
  
      {/* Modal para eliminar proveedor */}
      {mostrarModalEliminar && (
        <div className="overlay">
          <div className="modal-edicion">
            <h3>¿Estás seguro de eliminar este proveedor?</h3>
            <div className="botones-modal">
              <button className="btn-guardar" onClick={handleDeleteProveedor}>✅ Confirmar</button>
              <button className="btn-cancelar" onClick={cancelarEliminacion}>❌ Cancelar</button>
            </div>
          </div>
        </div>
      )}
  
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Teléfono</th>
            <th>Dirección</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {proveedores
            .filter((proveedor) =>
              `${proveedor.Nombre}`.toLowerCase().includes(busqueda.toLowerCase())
            )
            .map((proveedor) => (
              <tr key={proveedor.id_Proveedor}>
                <td>{proveedor.id_Proveedor}</td>
                <td>{proveedor.Nombre}</td>
                <td>{proveedor.Telefono}</td>
                <td>{proveedor.Direccion}</td>
                <td>
                  <button
                    className="edit-btn"
                    onClick={() => manejarEditarClick(proveedor)}
                  >
                    ✏️
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => confirmarEliminacion(proveedor.id_Proveedor)}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </>
  );
}

export default ProveedorTable;
