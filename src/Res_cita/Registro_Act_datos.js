import React, { useState, useEffect } from 'react';
import '../CSS/Registro.css';
import logo from '../assets/Vinali.png';
import axios from 'axios';
import { message, Spin } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { BASE_URL } from '../Medico/config';

const extraerMensaje = (data) => {
  if (!data) return 'Error desconocido';
  if (typeof data === 'string') return data;
  if (data.Mensaje && typeof data.Mensaje === 'string') return data.Mensaje;
  if (data.mensaje && typeof data.mensaje === 'string') return data.mensaje;
  if (data.title && typeof data.title === 'string') return data.title;
  return 'Error desconocido';
};

const Registro_act = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    documento,
    idCliente,
    email,
    nombres: nombresGoogle,
    apePaterno: apePaternoGoogle,
    apeMaterno: apeMaternoGoogle,
    celular: celularGoogle,
    modo
  } = location.state || {};

  const [tipoDocumento, setTipoDocumento] = useState('DNI');
  const [numDocumento, setNumDocumento] = useState(documento || '');
  const [nombres, setNombres] = useState(nombresGoogle || '');
  const [apellidoPaterno, setApellidoPaterno] = useState(apePaternoGoogle || '');
  const [apellidoMaterno, setApellidoMaterno] = useState(apeMaternoGoogle || '');
  const [telefono, setTelefono] = useState(celularGoogle || '');
  const [correo, setCorreo] = useState(email || '');
  const [direccion, setDireccion] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [repetirContrasena, setRepetirContrasena] = useState('');
  const [aceptoTerminos, setAceptoTerminos] = useState(false);
  const [autorizacionDatos, setAutorizacionDatos] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [loading, setLoading] = useState(false);
  const [mensajeError, setMensajeError] = useState('');

  const claveObligatoria = modo !== 'completar';

  const titulo = modo === 'activar'
    ? 'Activa tu cuenta'
    : modo === 'completar'
      ? 'Completa tus datos'
      : 'Actualización de datos';

  const handleRepetirContrasenaChange = (e) => {
    setRepetirContrasena(e.target.value);
    setPasswordsMatch(e.target.value === contrasena);
  };

  useEffect(() => {
    if (contrasena && repetirContrasena) {
      setPasswordsMatch(contrasena === repetirContrasena);
    }
  }, [contrasena, repetirContrasena]);

  const handleRegistroSubmit = async (e) => {
    e.preventDefault();
    setMensajeError('');

    if (claveObligatoria) {
      if (!contrasena || !repetirContrasena || contrasena !== repetirContrasena) {
        setMensajeError('Las contraseñas no coinciden o están vacías.');
        return;
      }
    } else {
      if (contrasena || repetirContrasena) {
        if (contrasena !== repetirContrasena) {
          setMensajeError('Las contraseñas no coinciden.');
          return;
        }
      }
    }

    if (!aceptoTerminos || !autorizacionDatos) {
      setMensajeError('Debes aceptar los términos y autorizar el uso de datos.');
      return;
    }

    setLoading(true);

    try {
      // MODO 'activar'
      if (modo === 'activar') {
        const payload = {
          numDocumento: numDocumento,
          nuevaClave: contrasena,
          email: correo,
          celular: telefono
        };

        const response = await axios.post(
          `${BASE_URL}/api/Usuarios/activar-cuenta`,
          payload,
          { headers: { 'Content-Type': 'application/json' } }
        );

        if (response.data.Accion === 'OK') {
          message.success('¡Cuenta activada exitosamente!');
          navigate('/bienvenida');
        } else {
          const msg = extraerMensaje(response.data);
          message.error(msg);
          setMensajeError(msg);
        }
        return;
      }

      // MODO 'completar'
      if (modo === 'completar') {
        const response = await axios.post(
          `${BASE_URL}/api/Usuarios/vincular-google-pos`,
          {
            email: correo,
            numDocumentoPOS: numDocumento,
            nombres: nombres,
            apePaterno: apellidoPaterno,
            apeMaterno: apellidoMaterno,
            celular: telefono,
            direccion: direccion,
            fechaNacimiento: fechaNacimiento || null,
            clave: contrasena || null
          },
          { headers: { 'Content-Type': 'application/json' } }
        );

        if (response.data.Accion === 'OK') {
          message.success(
            contrasena
              ? '¡Datos guardados! Ahora puedes entrar con DNI o con Google.'
              : '¡Datos guardados! Puedes entrar con Google.'
          );
          navigate('/bienvenida');
        } else {
          const msg = extraerMensaje(response.data);
          message.error(msg);
          setMensajeError(msg);
        }
        return;
      }

      // MODO undefined → Registro nuevo
      const datosRegistro = {
        numDocumento: numDocumento,
        nombres: nombres,
        apePaterno: apellidoPaterno,
        apeMaterno: apellidoMaterno,
        email: correo,
        celular: telefono,
        clave: contrasena,
        idDocumento: tipoDocumento === 'DNI' ? 1 : 2
      };

      const response = await axios.post(
        `${BASE_URL}/api/Usuarios/registrar`,
        datosRegistro,
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.data.Accion === 'OK') {
        message.success('¡Registro exitoso!');
        navigate('/bienvenida');
      } else {
        const msg = extraerMensaje(response.data);
        message.error(msg);
        setMensajeError(msg);
      }

    } catch (error) {
      console.error('Error al procesar la solicitud: ', error);
      let errorMessage = 'Error desconocido';
      if (error.response) {
        errorMessage = extraerMensaje(error.response.data);
      } else if (error.request) {
        errorMessage = 'No se pudo conectar con el servidor.';
      } else {
        errorMessage = error.message || 'Error desconocido';
      }
      message.error(errorMessage);
      setMensajeError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleAtrasClick = () => {
    navigate(-1);
  };

  return (
    <div className="reservar-cita-container">
      <div className="reservar-cita-background"></div>

      <div className="reservar-cita-form-container">
        <div className="logo-container">
          <img src={logo} alt="Logo de la empresa" className="logo-imagen" />
        </div>

        <h3>{titulo}</h3>

        {modo === 'activar' && (
          <p className="modo-info">
            Tu cuenta ya existe. Crea una contraseña para activarla.
          </p>
        )}
        {modo === 'completar' && (
          <p className="modo-info">
            Completa tus datos. También puedes crear una contraseña para
            entrar con tu DNI (opcional).
          </p>
        )}

        <form onSubmit={handleRegistroSubmit} className="registro-form">
          {/* Tipo y Número de Documento */}
          <div className="form-row">
            <div>
              <label htmlFor="tipoDocumento">Tipo de Documento</label>
              <select
                id="tipoDocumento"
                value={tipoDocumento}
                onChange={(e) => setTipoDocumento(e.target.value)}
                disabled={modo === 'activar'}
              >
                <option value="DNI">DNI</option>
                <option value="RUC">RUC</option>
                <option value="CE">Carné de Extranjería</option>
              </select>
            </div>
            <div>
              <label htmlFor="numDocumento">Nro de Documento</label>
              <input
                type="text"
                id="numDocumento"
                value={numDocumento}
                onChange={(e) => setNumDocumento(e.target.value)}
                required
                disabled={modo === 'activar'}
              />
            </div>
          </div>

          {/* Nombres y Apellido Paterno */}
          <div className="form-row">
            <div>
              <label htmlFor="nombres">Nombres</label>
              <input
                type="text"
                id="nombres"
                value={nombres}
                onChange={(e) => setNombres(e.target.value)}
                required
                disabled={modo === 'activar'}
              />
            </div>
            <div>
              <label htmlFor="apellidoPaterno">Apellido Paterno</label>
              <input
                type="text"
                id="apellidoPaterno"
                value={apellidoPaterno}
                onChange={(e) => setApellidoPaterno(e.target.value)}
                disabled={modo === 'activar'}
              />
            </div>
          </div>

          {/* Apellido Materno y Celular */}
          <div className="form-row">
            <div>
              <label htmlFor="apellidoMaterno">Apellido Materno</label>
              <input
                type="text"
                id="apellidoMaterno"
                value={apellidoMaterno}
                onChange={(e) => setApellidoMaterno(e.target.value)}
                disabled={modo === 'activar'}
              />
            </div>
            <div>
              <label htmlFor="telefono">Nro Celular</label>
              <input
                type="text"
                id="telefono"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="form-row">
            <div>
              <label htmlFor="correo">Email</label>
              <input
                type="email"
                id="correo"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Dirección */}
          <div className="form-row">
            <div>
              <label htmlFor="direccion">Dirección</label>
              <input
                type="text"
                id="direccion"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
              />
            </div>
          </div>

          {/* Fecha Nacimiento */}
          <div className="form-row">
            <div>
              <label htmlFor="fechaNacimiento">Fecha de Nacimiento</label>
              <input
                type="date"
                id="fechaNacimiento"
                value={fechaNacimiento}
                onChange={(e) => setFechaNacimiento(e.target.value)}
              />
            </div>
          </div>

          {/* Contraseña - Opcional en modo completar */}
          <div className="form-row">
            <div>
              <label htmlFor="contrasena">
                Contraseña {modo === 'completar' && '(opcional)'}
              </label>
              <input
                type="password"
                id="contrasena"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                required={claveObligatoria}
              />
            </div>
            <div>
              <label htmlFor="repetirContrasena">
                Repetir Contraseña {modo === 'completar' && '(opcional)'}
              </label>
              <input
                type="password"
                id="repetirContrasena"
                value={repetirContrasena}
                onChange={handleRepetirContrasenaChange}
                required={claveObligatoria}
              />
              {!passwordsMatch && <label className="error-message">Las contraseñas no coinciden.</label>}
            </div>
          </div>

          {mensajeError && typeof mensajeError === 'string' && (
            <p className="error-message">{mensajeError}</p>
          )}

          {/* Checkboxes */}
          <div className="form-row">
            <div>
              <label>
                <input
                  type="checkbox"
                  checked={aceptoTerminos}
                  onChange={(e) => setAceptoTerminos(e.target.checked)}
                />
                Acepto los términos y condiciones y la política de privacidad.
              </label>
            </div>
            <div>
              <label>
                <input
                  type="checkbox"
                  checked={autorizacionDatos}
                  onChange={(e) => setAutorizacionDatos(e.target.checked)}
                />
                Autorizo el uso de mis datos personales.
              </label>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={handleAtrasClick} className="boton-atras">Atrás</button>
            <button type="submit" disabled={loading}>
              {loading ? <Spin size="small" /> : (
                modo === 'activar' ? 'Activar cuenta' :
                modo === 'completar' ? 'Guardar datos' :
                'Registrarme'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Registro_act;