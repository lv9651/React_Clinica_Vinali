import React, { useContext } from 'react';
import { UsuarioContext } from '../context/AuthContext'; // Asegúrate de importar el contexto
import '../CSS/Bienvenido.css';
import fondoImagen from '../assets/telederma.png'; // Importar la imagen aquí

const Bienvenida = () => {
  const { usuario } = useContext(UsuarioContext); // Obtener los datos del usuario desde el contexto

  return (
    <div 
      className="bienvenida-container"
      style={{ backgroundImage: `url(${fondoImagen})` }} // Usar la imagen importada
    >
      {usuario ? (
        <h2>¡Bienvenido, {usuario.nombres} {usuario.apellidoPaterno}!</h2>
      ) : (
        <h2>¡Bienvenido!</h2>
      )}
      <p>¡Continúa cuidando tu salud y la de toda tu familia!</p>
    </div>
  );
};

export default Bienvenida;