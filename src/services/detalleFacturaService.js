export const crearDetalleFactura = async (detalleFactura) => {
  console.log("🛠 Enviando detalle de factura:", detalleFactura);
  const response = await fetch('http://localhost:3000/api/detalle_factura', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(detalleFactura),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("❌ Respuesta del backend:", detalleFactura, errorData);
    throw new Error("Error al crear detalle de factura");
  }

  return await response.json();
};
