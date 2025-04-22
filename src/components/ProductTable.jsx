import { useState, useEffect } from "react";
import axios from "axios";

const Productos = ({ busqueda, cargo, idSede, carrito, setCarrito }) => {
  const [productos, setProductos] = useState([]);
  const [productoAEliminar, setProductoAEliminar] = useState(null);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [mensajeExito, setMensajeExito] = useState(false);

  const [editandoId, setEditandoId] = useState(null);
  const [datosEditados, setDatosEditados] = useState({
    nombre: "",
    precio: "",
    stock: "",
  });

  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [mostrarModalCarrito, setMostrarModalCarrito] = useState(false);

  useEffect(() => {
    if (idSede || cargo === "Admin") {
      obtenerProductos(); // Cargar productos al iniciar el componente
    }
    if (cargo === "Admin") {
      setCarrito([]); // Reiniciar carrito si es vendedor
    }
  }, [idSede, cargo]); // Dependiendo tanto de idSede como de cargo

  const obtenerProductos = async () => {
    try {
      let params = {}; // Parámetros por defecto (vacío)

      if (cargo !== "Admin") {
        // Si no es Admin, filtrar por sede
        params = { sede: idSede };
      }

      const response = await axios.get("http://localhost:3000/api/productos", {
        params, // Enviar parámetros condicionalmente
      });
      setProductos(response.data);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  };

  const formatearPrecio = (precio) => {
    const numPrecio = Number(precio);
    if (isNaN(numPrecio)) {
      return "Precio inválido";
    }
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numPrecio);
  };

  const handleDelete = (id, nombre) => {
    setProductoAEliminar({ id, nombre });
    setMostrarConfirmacion(true);
  };

  const confirmarEliminacion = async () => {
    try {
      await axios.delete(`http://localhost:3000/api/productos/eliminar/${productoAEliminar.id}`);
      setMostrarConfirmacion(false);
      setMensajeExito(true);
      obtenerProductos();

      setTimeout(() => {
        setMensajeExito(false);
      }, 900);
    } catch (error) {
      console.error("Error al eliminar producto:", error);
    }
  };

  const manejarEditarClick = (producto) => {
    setEditandoId(producto.id_Producto);
    setDatosEditados({
      nombre: producto.Nombre,
      precio: producto.Precio,
      stock: producto.Stock,
    });
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
  };

  const manejarAgregarCarrito = (producto) => {
    setProductoSeleccionado(producto);
    setCantidad(1); // Reinicia cantidad por defecto
    setMostrarModalCarrito(true);
  };

  const confirmarAgregarCarrito = () => {
    if (cantidad <= 0 || cantidad > productoSeleccionado.Stock) {
      alert("Cantidad inválida.");
      return;
    }

    // Añadir al carrito
    setCarrito((prevCarrito) => {
      const existente = prevCarrito.find(
        (p) => p.id_Producto === productoSeleccionado.id_Producto
      );
      if (existente) {
        return prevCarrito.map((p) =>
          p.id_Producto === productoSeleccionado.id_Producto
            ? { ...p, cantidad: p.cantidad + cantidad }
            : p
        );
      } else {
        return [...prevCarrito, { ...productoSeleccionado, cantidad }];
      }
    });

    console.log("Carrito actualizado:", carrito); // Depuración

    // Reducir stock del producto
    setProductos((prevProductos) =>
      prevProductos.map((p) =>
        p.id_Producto === productoSeleccionado.id_Producto
          ? { ...p, Stock: p.Stock - cantidad }
          : p
      )
    );

    // Cerrar modal
    setMostrarModalCarrito(false);
    setProductoSeleccionado(null);
  };

  const guardarCambios = async () => {
    try {
      await axios.put(`http://localhost:3000/api/productos/editar/${editandoId}`, {
        nombre: datosEditados.nombre,
        precio: datosEditados.precio,
        stock: datosEditados.stock,
      });
      setEditandoId(null);
      obtenerProductos();
    } catch (error) {
      console.error("Error al guardar cambios:", error);
    }
  };

  return (
    <>
      {mensajeExito && (
        <div className="overlay">
          <div className="mensaje-exito">✅ Producto eliminado correctamente</div>
        </div>
      )}

      {mostrarConfirmacion && (
        <div className="overlay">
          <div className="mensaje-exito">
            <p>
              ¿Estás seguro de que deseas eliminar el producto{" "}
              <strong>{productoAEliminar.nombre}</strong>?
            </p>
            <div className="botones-confirmacion">
              <button onClick={confirmarEliminacion}>Sí</button>
              <button onClick={() => setMostrarConfirmacion(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {editandoId !== null && (
        <div className="overlay">
          <div className="modal-edicion">
            <h3>Editar producto</h3>
            <label>Nombre:</label>
            <input
              type="text"
              value={datosEditados.nombre}
              onChange={(e) =>
                setDatosEditados({ ...datosEditados, nombre: e.target.value })
              }
            />
            <label>Precio:</label>
            <input
              type="number"
              value={datosEditados.precio}
              onChange={(e) =>
                setDatosEditados({ ...datosEditados, precio: e.target.value })
              }
            />
            <label>Stock:</label>
            <input
              type="number"
              value={datosEditados.stock}
              onChange={(e) =>
                setDatosEditados({ ...datosEditados, stock: e.target.value })
              }
            />
            <div className="botones-modal">
              <button onClick={guardarCambios}>💾 Guardar</button>
              <button onClick={cancelarEdicion}>❌ Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {mostrarModalCarrito && productoSeleccionado && (
        <div className="overlay">
          <div className="modal-edicion">
            <h3>Agregar al carrito</h3>
            <p><strong>{productoSeleccionado.Nombre}</strong></p>
            <label>Cantidad (máx {productoSeleccionado.Stock}):</label>
            <input
              type="number"
              value={cantidad}
              min="1"
              max={productoSeleccionado.Stock}
              onChange={(e) => setCantidad(Number(e.target.value))}
            />
            <div className="botones-modal">
              <button onClick={confirmarAgregarCarrito}>✅ Agregar</button>
              <button onClick={() => setMostrarModalCarrito(false)}>❌ Cancelar</button>
            </div>
          </div>
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Sede</th>
            <th>Producto</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos
            .filter((producto) => {
              if (!busqueda) return true;
              const busquedaLower = busqueda.toLowerCase();
              return producto.Nombre.toLowerCase().includes(busquedaLower);
            })
            .map((producto) => (
              <tr key={producto.id_Producto}>
                <td>{producto.id_Producto}</td>
                <td>{producto.id_Sede}</td>
                <td>{producto.Nombre}</td>
                <td>{formatearPrecio(producto.Precio)}</td>
                <td>{producto.Stock}</td>
                <td>
                  {cargo === "Vendedor" ? (
                    <button className="sell-btn" onClick={() => manejarAgregarCarrito(producto)}>
                      🛒 añadir
                    </button>
                  ) : (
                    <>
                      <button
                        className="edit-btn"
                        onClick={() => manejarEditarClick(producto)}
                      >
                        ✏️
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() =>
                          handleDelete(producto.id_Producto, producto.Nombre)
                        }
                      >
                        🗑️
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </>
  );
};

export default Productos;