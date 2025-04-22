import { jsPDF } from "jspdf";

export const generarFacturaPDF = (factura) => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Factura de Compra", 70, 20);

  doc.setFontSize(12);
  let y = 40;
 
    // Agregar información de la factura
   
    doc.text(`ID Cliente: ${factura.id_Cliente}`, 20, y); y += 10;
    doc.text(`ID Empleado: ${factura.id_Empleado}`, 20, y); y += 10;
    doc.text(`ID Sede: ${localStorage.getItem('sede')}`, 20, y); y += 10; 
    doc.text(`Fecha: ${factura.fecha}`, 20, y); y += 10;
    doc.text(`Cliente: ${factura.nombre_cliente} ${factura.apellido}`, 20, y); y += 10;
    
    // Agregar teléfono y dirección
    doc.text(`Teléfono: ${factura.telefono}`, 20, y); y += 10;
    doc.text(`Dirección: ${factura.direccion}`, 20, y); y += 10;

    doc.text(`Producto: ${factura.nombre_producto}`, 20, y); y += 10;
    doc.text(`Cantidad: ${factura.cantidad}`, 20, y); y += 10;
    doc.text(`Precio Unitario: $${factura.precio_unitario.toLocaleString()}`, 20, y); y += 10;
    doc.text(`Total Factura: $${factura.total.toLocaleString()}`, 20, y); y += 20;

    doc.text("¡Gracias por su compra!", 70, y);

    doc.save(`Factura_${factura.id_Facturacion}.pdf`);
};
