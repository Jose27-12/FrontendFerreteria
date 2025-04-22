import React, { useState, useEffect } from "react";
import axios from "axios";

const Clientes = ({ busqueda, cargo, sede }) => {
  const [clientes, setClientes] = useState([]);
  const [clienteAEliminar, setClienteAEliminar] = useState(null);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [mensajeExito, setMensajeExito] = useState(false);

  const [editandoId, setEditandoId] = useState(null);
  const [datosEditados, setDatosEditados] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    direccion: "",
    correo: "",
  });

  const obtenerClientes = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/clientes");
      setClientes(response.data);
    } catch (error) {
      console.error("Error al obtener clientes:", error);
    }
  };

  useEffect(() => {
    obtenerClientes();
  }, []);

  const handleDelete = (id, nombre, apellido) => {
    setClienteAEliminar({ id, nombre, apellido});
    setMostrarConfirmacion(true);
  };

  const confirmarEliminacion = async () => {
    try {
        await axios.delete(`http://localhost:3000/api/clientes/eliminar/${clienteAEliminar.id}`);
        
        setMensajeExito(true);
        setMostrarConfirmacion(false);
        setClienteAEliminar(null);
        obtenerClientes();
        setTimeout(() => setMensajeExito(false), 500);
        } catch (error) {
        console.error("Error al eliminar cliente:", error);
    }
  };

  const manejarEditarClick = (cliente) => {
    // Aquí puedes manejar la lógica para editar el cliente
    console.log("Editar cliente:", cliente);
    setEditandoId(cliente.id_Cliente);
    setDatosEditados({
      nombre: cliente.Nombre,
      apellido: cliente.Apellido,
      telefono: cliente.Telefono,
      direccion: cliente.Direccion,
      correo: cliente.Correo,
    });
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
  };
  
  const guardarCambios = async () => {
    try {
      await axios.put(`http://localhost:3000/api/clientes/editar/${editandoId}`, {
        nombre: datosEditados.nombre,
        apellido: datosEditados.apellido,
        telefono: datosEditados.telefono,
        direccion: datosEditados.direccion,
        correo: datosEditados.correo,
      });
      setEditandoId(null);
      obtenerClientes(); // Recarga la lista
    } catch (error) {
      console.error("Error al guardar cambios:", error);
    }
  };

  return (
    <>
      {mensajeExito && (
        <div className="overlay">
          <div className="mensaje-exito">✅ Cliente eliminado correctamente</div>
        </div>
      )}

      {mostrarConfirmacion && (
        <div className="overlay">
          <div className="mensaje-exito">
            <p>
              ¿Estás seguro de que deseas eliminar al cliente <br />{" "}
              <strong> {clienteAEliminar.nombre} {clienteAEliminar.apellido}</strong>?
            </p>
            <div className="botones-confirmacion">
              <button onClick={confirmarEliminacion}>Sí</button>
              <button onClick={() => setMostrarConfirmacion(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

        {/* Modal de edición */}
        {editandoId !== null && (
          <div className="overlay">
            <div className=" modal-edicion">
              <h2>Editar Cliente</h2>
              <label>Nombre:</label>
              <input
                type="text"
                value={datosEditados.nombre}
                onChange={(e) => setDatosEditados({ ...datosEditados, nombre: e.target.value })}
                placeholder="Nombre"
              />
            <label>Apellido:</label>
              <input
                type="text"
                value={datosEditados.apellido}
                onChange={(e) => setDatosEditados({ ...datosEditados, apellido: e.target.value })}
                placeholder="Apellido"
              />
                <label>Teléfono:</label>
              <input
                type="text"
                value={datosEditados.telefono}
                onChange={(e) => setDatosEditados({ ...datosEditados, telefono: e.target.value })}
                placeholder="Teléfono"
              />
                <label>Dirección:</label>
              <input
                type="text"
                value={datosEditados.direccion}
                onChange={(e) => setDatosEditados({ ...datosEditados, direccion: e.target.value })}
                placeholder="Dirección"
              />
                <label>Correo:</label>
              <input
                type="email"
                value={datosEditados.correo}
                onChange={(e) => setDatosEditados({ ...datosEditados, correo: e.target.value })}
                placeholder="Correo"
              />
              <div className="botones-modal">
                <button onClick={guardarCambios}>💾 Guardar Cambios</button>
                <button onClick={cancelarEdicion}>❌ Cancelar</button>
              </div>
            </div>
          </div>
        )}

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Teléfono</th>
            <th>Dirección</th>
            <th>Correo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientes
            .filter((cliente) =>
              `${cliente.Nombre} ${cliente.Apellido}`
                .toLowerCase()
                .includes(busqueda.toLowerCase())
            )
            .map((cliente) => (
              <tr key={cliente.id_Cliente}>
                <td>{cliente.id_Cliente}</td>
                <td>{cliente.Nombre}</td>
                <td>{cliente.Apellido}</td>
                <td>{cliente.Telefono}</td>
                <td>{cliente.Direccion}</td>
                <td>{cliente.Correo}</td>
                <td>

                   <button
                        className="edit-btn"
                        onClick={() => manejarEditarClick(cliente)}
                    >
                        ✏️
                    </button> 
                  <button
                    className="delete-btn"
                    onClick={() =>
                      handleDelete(cliente.id_Cliente, cliente.Nombre , cliente.Apellido)
                    }
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
};

export default Clientes;
