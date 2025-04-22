import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx'; // Aquí importas tu componente principal de la app
import { CartProvider } from './context/CartContext'; // Aquí importas el contexto para el carrito

// Aquí renderizas tu aplicación, envolviendo App en CartProvider
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CartProvider>
      <App />
    </CartProvider>
  </StrictMode>
);
