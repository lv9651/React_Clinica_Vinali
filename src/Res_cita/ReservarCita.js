import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { message } from 'antd';
import { UsuarioContext } from '../context/AuthContext'; // Importa el contexto
import '../CSS/ReservarCita.css';

const ReservarCita = () => {
  const { setUser, usuario } = useContext(UsuarioContext); // Accede a setUser desde el contexto
  const [documento, setDocumento] = useState(''); // El DNI o documento
  const [clave, setClave] = useState(''); // La clave
  const [mensajeError, setMensajeError] = useState(''); // Mensaje de error
  const [esInvitado, setEsInvitado] = useState(false); // Controlar si accede como invitado
  const [cargando, setCargando] = useState(false); // Indicador de carga
  const navigate = useNavigate(); // Redirección a otras rutas

  // Manejo del inicio de sesión
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevenimos el comportamiento por defecto del formulario
    
    // Validamos si ambos campos están llenos
    if (!documento || !clave) {
      setMensajeError('Por favor ingresa tu número de documento y clave.');
      return;
    }

    setCargando(true); // Activamos el indicador de carga

    try {
      // Hacemos la solicitud al backend para autenticar al usuario con DNI y clave
      const response = await axios.post('https://localhost:7257/api/Usuario/autenticar', {
        documento,
        clave
      });

      if (response.data.Mensaje) {
        // Si la respuesta contiene los datos del usuario (o un token)
        setMensajeError(response.data.Mensaje);
        if (response.data.Mensaje === "Por favor, actualice sus datos.") {
          // Redirigir al formulario de actualización de datos
          navigate('/Registro_Act_datos', { state: { documento: documento } });
        }
      } else {
        // Si la respuesta no tiene los datos de autenticación, mostramos un error
        const userData = response.data;
        console.log(response.data);
       // Guardamos los datos del usuario en el contexto global (o localStorage si prefieres)
       setUser(userData); // Usamos el contexto para almacenar los datos del usuario
       setMensajeError('');
       message.success('Ingreso Exitoso!');
     
       // Redirigimos al menú principal de la aplicación
       navigate('/bienvenida');
      }
    } catch (error) {
      // Si ocurre un error con la solicitud, mostramos un mensaje de error
      console.error('Error al intentar iniciar sesión: ', error);
      message.error('Clave incorrecta');
    } finally {
      setCargando(false); // Desactivamos el indicador de carga
    }
  };


  // Manejar el acceso como in;vitado
  const handleAccederComoInvitado = () => {
    setEsInvitado(true);
    console.log('Accediendo como invitado');
  };

  // Redirigir al registro
  const handleIrARegistro = () => {
    navigate('/registrarse'); // Redirige a la página de registro
  };

  // Si el usuario ya está autenticado, redirigir directamente
  if (usuario) {
    navigate('/menu'); // Si ya está logueado, redirigir automáticamente al menú
  }

  return (
    <div className="reservar-cita-container">
      <div className="reservar-cita-background">
        {/* Fondo de la empresa, puedes poner una imagen de fondo o un color */}
      </div>

      <div className="reservar-cita-form-container">
        <h2>Iniciar Sesion</h2>

        {!esInvitado ? (
          <>
            <form onSubmit={handleLogin} className="login-form">
              <div>
                <label htmlFor="documento">Número de Documento</label>
                <input 
                  type="text" 
                  id="documento" 
                  value={documento} 
                  onChange={(e) => setDocumento(e.target.value)} 
                  required
                />
              </div>

              <div>
                <label htmlFor="clave">Clave</label>
                <input 
                  type="password" 
                  id="clave" 
                  value={clave} 
                  onChange={(e) => setClave(e.target.value)} 
                  required
                />
              </div>

              {mensajeError && <p className="error-message">{mensajeError}</p>}

              <div className="form-actions">
                <button type="submit" disabled={cargando}>
                  {cargando ? 'Iniciando sesión...' : 'Iniciar sesión'}
                </button>
              </div>
            </form>

            <div className="opciones">
              <a href="/recuperar-clave">¿Olvidaste tu contraseña?</a>
             {/*  <button className="btn-invitado" onClick={handleAccederComoInvitado}>
                Acceder como invitado
              </button>

              {/* Botón para redirigir al registro */}
              <button className="btn-registrarme" onClick={handleIrARegistro}>
                Quiero registrarme
              </button>
            </div>
          </>
        ) : (
          // Si el usuario accede como invitado
          <div>
            <p>Bienvenido, has accedido como invitado. Ahora puedes reservar tu cita.</p>
            <button onClick={() => setEsInvitado(false)}>Cerrar sesión como invitado</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservarCita;