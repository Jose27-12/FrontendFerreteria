export const crearFactura = async (id_Cliente, id_Sede, Fecha, Total, cliente, productos) => {
  try {
    const response = await fetch('http://localhost:3000/api/facturas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id_cliente: id_Cliente,
        id_sede: id_Sede,
        fecha: Fecha,
        total: Total,
        cliente: cliente,
        productos: productos,
      }),
    });

    if (!response.ok) {
      const errorDetails = await response.text(); // Capturamos detalles de error
      throw new Error(`Error al crear factura: ${errorDetails}`);
    }

    const facturaData = await response.json();
    return facturaData; // Devuelve la factura creada
  } catch (error) {
    console.error('Error en crear factura:', error);
    throw error; // Propaga el error
  }
};
