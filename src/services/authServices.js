const API_URL = 'http://localhost:3000/api'; // cambia la URL según tu backend

export const registerUser = async (userData) => {
  try {
    const res = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return await res.json();
  } catch (error) {
    console.error('Error al registrar:', error);
    return { error: 'Ocurrió un error al registrar.' };
  }
};
