import React, { useEffect } from 'react';

const Notification = ({ message, type, onClose }) => {
  // Cerrar el mensaje después de 4 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000); // Cerrar después de 4 segundos

    return () => clearTimeout(timer); // Limpiar el timer si el componente se desmonta
  }, [onClose]);

  return (
    <div
      className={`notification ${type}`}
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '10px 15px',
        backgroundColor: 'white', // Fondo blanco para el mensaje
        color: 'black', // Texto en negro para el mensaje
        borderRadius: '5px',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column', // El contenido sigue apilado
        fontSize: '14px',
        minWidth: '250px',
        maxWidth: '300px',
        animation: 'fadeIn 0.5s, fadeOut 2s 2.5s', // Animación de entrada y salida
        whiteSpace: 'normal', // Permite el salto de línea
        wordWrap: 'break-word', // Ajuste de palabras largas
      }}
    >
      {/* Contenedor para el título y la "X", con fondo naranja */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          backgroundColor: '#FFA500', // Fondo naranja para el título
          color: 'white', // Texto en blanco para el título
          padding: '5px 10px',
          borderTopLeftRadius: '5px',
          borderTopRightRadius: '5px',
        }}
      >
        {/* Título de la notificación */}
        <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
          Advertencia
        </span>

        {/* Botón de cierre */}
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '18px',
            cursor: 'pointer',
            padding: '0',
          }}
        >
          ×
        </button>
      </div>

      {/* Mensaje de la notificación, con fondo blanco */}
      <span
        style={{
          wordWrap: 'break-word',
          lineHeight: '1.5', // Mejor legibilidad
          padding: '10px', // Añadimos padding al mensaje
        }}
      >
        {message}
      </span>
    </div>
  );
};

export default Notification;