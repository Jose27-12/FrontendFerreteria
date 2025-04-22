import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Almacen from './pages/Almacen';
import Clientes from './pages/Clientes';
import AddProductForm from './components/AddProductForm';
import Checkout from './pages/Checkout';
import FacturaPage from './pages/FacturaPage';
import Usuario from './pages/Usuario';
import Ventas from './pages/Ventas';
import Notificaciones from './pages/Notificaciones';
import Proveedor from './pages/Proveedor';
import AddProveedorForm from './components/AddProveedorForm';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Configuracion from './pages/Configuracion';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/almacen" element={<Almacen />} />
        <Route path="/agregar-producto" element={<AddProductForm />} />
        <Route path="/clientes" element={<Clientes/>} />
        <Route path="/checkout" element={<Checkout/>} />
        <Route path="/factura" element={<FacturaPage />} />
        <Route path='/Usuario' element={<Usuario />} />
        <Route path='/ventas' element={<Ventas />} />
        <Route path='/notificaciones' element={<Notificaciones />} />
        <Route path='/proveedor' element={<Proveedor />} />
        <Route path='/agregar-proveedor' element={<AddProveedorForm />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/configuracion' element={<Configuracion />} />
        {/* Agregar más rutas según sea necesario */}

      </Routes>
    </Router>
  );
}

export default App;
