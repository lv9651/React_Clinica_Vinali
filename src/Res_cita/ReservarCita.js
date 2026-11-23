import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { message } from 'antd';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { UsuarioContext } from '../context/AuthContext';
import '../CSS/ReservarCita.css';
import { BASE_URL } from '../Medico/config';

const GOOGLE_CLIENT_ID = '1087917180114-b9a2605875uhdrf73sobq0oiv4buvm4p.apps.googleusercontent.com';

const ReservarCita = () => {
  const { setUser, usuario } = useContext(UsuarioContext);
  const [documento, setDocumento] = useState('');
  const [clave, setClave] = useState('');
  const [mensajeError, setMensajeError] = useState('');
  const [esInvitado, setEsInvitado] = useState(false);
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  // ============================================================
  // LOGIN CON DNI + CLAVE
  // ============================================================
const handleLogin = async (e) => {
  e.preventDefault();

  if (!documento || !clave) {
    setMensajeError('Por favor ingresa tu número de documento y clave.');
    return;
  }

  setCargando(true);
  setMensajeError('');

  try {
    const response = await axios.post(`${BASE_URL}/api/Usuarios/autenticar`, {
      documento,
      clave
    });

    const data = response.data;

    if (data.Accion === 'NUEVO_REGISTRO') {
      message.info('No encontramos tu cuenta. Por favor regístrate.');
      navigate('/registrarse', { state: { documento } });
      return;
    }

    if (data.Accion === 'ACTIVAR_CUENTA') {
      message.info('Tu cuenta ya existe. Crea una contraseña para activarla.');
      navigate('/Registro_Act_datos', {
        state: {
          modo: 'activar',
          idCliente: data.idCliente,
          documento: data.numeroDocumento || documento,
          email: data.email || '',
          nombres: data.nombres || '',
          apePaterno: data.apellidoPaterno || '',
          apeMaterno: data.apellidoMaterno || '',
          celular: data.celular || data.telefono || ''
        }
      });
      return;
    }

    if (data.Accion === 'USAR_GOOGLE') {
      setMensajeError('Tu cuenta está vinculada a Google. Usa el botón "Iniciar sesión con Google".');
      message.warning('Por favor usa el botón de Google para ingresar.');
      return;
    }

    if (data.Accion === 'CLAVE_INCORRECTA') {
      setMensajeError('La clave ingresada es incorrecta.');
      return;
    }

    if (data.Accion === 'CUENTA_INACTIVA') {
      setMensajeError('Tu cuenta está inactiva. Contacta con soporte.');
      return;
    }

    // ✅ BLOQUE MODIFICADO
    if (data.usuarioID) {
      setUser(data);
      setMensajeError('');
      message.success('¡Ingreso Exitoso!');

      if (data.origen === 'USUARIO_CMS') {
        localStorage.setItem('adminToken', 'token-' + data.usuarioID);
        localStorage.setItem('adminRol', data.idrol);
        localStorage.setItem('adminNombre', data.nombres);
        localStorage.setItem('adminUsername', data.username);
        navigate('/Res_cita/dashboard');
      } else if (data.origen === 'USUARIO_GENERAL') {
        navigate('/dashboardmedico');
      } else {
        navigate('/bienvenida');
      }
      return;
    }

    setMensajeError(data.Mensaje || 'Error inesperado.');

  } catch (error) {
    console.error('Error al iniciar sesión: ', error);
    message.error('Error de conexión con el servidor');
  } finally {
    setCargando(false);
  }
};

  // ============================================================
  // LOGIN CON GOOGLE
  // ============================================================
  const handleGoogleSuccess = async (credentialResponse) => {
    setCargando(true);
    setMensajeError('');

    try {
      const response = await axios.post(`${BASE_URL}/api/Usuarios/google-login`, {
        token: credentialResponse.credential
      });

      const data = response.data;

      // CASO 1: Login exitoso (email ya existe)
      if (data.usuarioID) {
        setUser(data);
        message.success('¡Ingreso con Google Exitoso!');

        if (data.requiereCompletarDatos === 1) {
          navigate('/Registro_Act_datos', {
            state: {
              modo: 'completar',
              idCliente: data.usuarioID,
              email: data.correo || '',
              nombres: data.nombres || '',
              apePaterno: data.apellidoPaterno || '',
              apeMaterno: data.apellidoMaterno || '',
              celular: data.celular || ''
            }
          });
        } else {
          navigate('/bienvenida');
        }
        return;
      }

      // CASO 2: Email no existe → pedir datos SIN crear cuenta
      if (data.Accion === 'COMPLETAR_DATOS') {
        message.info('Completa tus datos para continuar.');
        navigate('/Registro_Act_datos', {
          state: {
            modo: 'completar',
            email: data.correo || '',
            nombres: data.nombres || '',
            apePaterno: data.apellidoPaterno || '',
            apeMaterno: data.apellidoMaterno || '',
            celular: ''
          }
        });
        return;
      }

      setMensajeError(data.Mensaje || 'Error al iniciar sesión con Google');
      message.error(data.Mensaje || 'Error al iniciar sesión con Google');
    } catch (error) {
      console.error('Error en login Google:', error);
      message.error('Error al conectar con Google');
    } finally {
      setCargando(false);
    }
  };

  const handleGoogleError = () => {
    message.error('Error al iniciar sesión con Google');
  };

  const handleIrARegistro = () => {
    navigate('/registrarse');
  };

  const handleRecuperarClave = () => {
    navigate('/recuperar-clave');
  };

  return (
    <div className="reservar-cita-container">
      <div className="reservar-cita-background"></div>

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

            <div className="google-login" style={{ marginTop: '15px', display: 'flex', justifyContent: 'center' }}>
              <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  text="continue_with"
                  shape="rectangular"
                  theme="outline"
                  size="large"
                />
              </GoogleOAuthProvider>
            </div>

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
            <p>Bienvenido, has accedido como invitado.</p>
            <button onClick={() => setEsInvitado(false)}>Cerrar sesión como invitado</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservarCita;