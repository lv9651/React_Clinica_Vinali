import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { message } from 'antd';
import { UsuarioContext } from '../context/AuthContext';
import '../CSS/ReservarCita.css';
import { BASE_URL } from '../Medico/config';

const ReservarCita = () => {
  const { setUser, usuario } = useContext(UsuarioContext);
  const [documento, setDocumento] = useState('');
  const [clave, setClave] = useState('');
  const [mensajeError, setMensajeError] = useState('');
  const [esInvitado, setEsInvitado] = useState(false);
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  // Manejo del inicio de sesión
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!documento || !clave) {
      setMensajeError('Por favor ingresa tu número de documento y clave.');
      return;
    }

    setCargando(true);

    try {
      const response = await axios.post(`${BASE_URL}/api/Usuarios/autenticar`, {
        documento,
        clave
      });

      if (response.data.Mensaje) {
        setMensajeError(response.data.Mensaje);

        if (response.data.Mensaje === "Por favor, actualice sus datos.") {
          navigate('/Registro_Act_datos', { state: { documento: documento } });
        }

      } else {
        const userData = response.data;

        setUser(userData);
        setMensajeError('');
        message.success('Ingreso Exitoso!');

        // Redireccionar según el origen
        if (userData.origen === 'USUARIO_GENERAL') {
          navigate('/dashboardmedico'); // Ruta para médicos
        } else {
          navigate('/bienvenida'); // Ruta para pacientes u otros usuarios
        }
      }
    } catch (error) {
      console.error('Error al intentar iniciar sesión: ', error);
      message.error('Clave incorrecta');
    } finally {
      setCargando(false);
    }
  };

  // Manejar el acceso como invitado
  const handleAccederComoInvitado = () => {
    setEsInvitado(true);
    console.log('Accediendo como invitado');
  };

  const handleIrARegistro = () => {
    navigate('/registrarse');
  };

  const handleRecuperarClave = () => {
    navigate('/recuperar-clave');
  };

  // Si el usuario ya está autenticado, redirigir directamente
  if (usuario) {
    if (usuario.origen === 'USUARIO_GENERAL') {
      navigate('/dashboardmedico');
    } else {
      navigate('/bienvenida');
    }
    return null; // Para evitar que se siga renderizando el formulario
  }

  return (
    <div className="reservar-cita-container">
      <div className="reservar-cita-background">
        {/* Fondo de la empresa */}
      </div>

      <div className="reservar-cita-form-container">
        <h2>Bienvenidos</h2>

        {!esInvitado ? (
          <>
            <form onSubmit={handleLogin} className="login-form">
              <div>
                <input 
                  type="text" 
                  id="documento" 
                  value={documento} 
                  onChange={(e) => setDocumento(e.target.value)} 
                  required
                  placeholder="Número de Documento" 
                />
              </div>

              <div>
                <input 
                  type="password" 
                  id="clave" 
                  value={clave} 
                  onChange={(e) => setClave(e.target.value)} 
                  required
                  placeholder="Contraseña" 
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
              <button className="btn-contra" onClick={handleRecuperarClave}>
                ¿Olvidaste tu contraseña?
              </button>
              <button className="btn-registrarme" onClick={handleIrARegistro}>
                Quiero registrarme
              </button>
            </div>
          </>
        ) : (
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

