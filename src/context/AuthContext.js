// src/context/UsuarioContext.js
import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Crear un contexto para la información del usuario
const UsuarioContext = createContext();

const UsuarioProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();
  // Recuperar los datos del usuario desde el localStorage si existen
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('usuario'));
    if (storedUser) {
      setUsuario(storedUser);
    }
  }, []);

  // Actualizar el estado de usuario y guardarlo en el localStorage
  const setUser = (userData) => {
    setUsuario(userData);
    localStorage.setItem('usuario', JSON.stringify(userData)); // Guardar usuario en el almacenamiento local
    
  };

  // Eliminar el usuario (logout)
  const logout = () => {
    setUsuario(null);
    localStorage.removeItem('usuario'); // Limpiar localStorage
    navigate('/');
  };

  return (
    <UsuarioContext.Provider value={{ usuario, setUser, logout }}>
      {children}
    </UsuarioContext.Provider>
  );
};

export { UsuarioContext, UsuarioProvider };