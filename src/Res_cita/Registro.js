import React, { useState } from 'react';
import '../CSS/Registroform.css';
import logo from '../assets/Vinali.png';
import axios from 'axios';
import { message, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../Medico/config';

const Registro = () => {
  const [tipoDocumento, setTipoDocumento] = useState('');
  const [numeroDocumento, setDocumento] = useState('');
  const [nombres, setNombres] = useState('');
  const [apellidoPaterno, setApellidoPaterno] = useState('');
  const [apellidoMaterno, setApellidoMaterno] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [repetirContrasena, setRepetirContrasena] = useState('');
  const [aceptoTerminos, setAceptoTerminos] = useState(false);
  const [autorizacionDatos, setAutorizacionDatos] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRepetirContrasenaChange = (e) => {
    setRepetirContrasena(e.target.value);
    setPasswordsMatch(e.target.value === contrasena);
  };

  const handleRegistroSubmit = async (e) => {
    e.preventDefault();
    if (contrasena !== repetirContrasena) {
      message.error("Las contraseñas no coinciden.");
      return;
    }

    if (
      !tipoDocumento || !numeroDocumento || !nombres || !apellidoPaterno || !apellidoMaterno || 
      !telefono || !correo || !contrasena || !repetirContrasena || 
      !aceptoTerminos || !autorizacionDatos
    ) {
      message.error("Por favor, completa todos los campos y acepta los términos y condiciones.");
      return;
    }

    const datosRegistro = {
      tipoDocumento,
      numeroDocumento,
      nombres,
      apellidoPaterno,
      apellidoMaterno,
      telefono,
      correo,
      contrasena,
      aceptoTerminos,
      autorizacionDatos,
    };

    try {
      setLoading(true);
      const response = await axios.post(`${BASE_URL}/api/Usuarios`, datosRegistro, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      message.success(`Registro correcto!`);
      navigate('/');
    } catch (error) {
      console.error('Error al registrar: ', error);
      message.error('Ocurrió un error al registrar al usuario.');
    } finally {
      setLoading(false);
    }
  };

  const handleAtrasClick = () => {
    window.history.back();
  };

  return (
    <div className="registro-cliente-container">
      <div className="registro-cliente-background"></div>
      <div className="registro-cliente-form-container">
        <div className="logo-container">
          <img src={logo} alt="Logo de la empresa" className="logo-imagen" />
        </div>
        <h3>Registro de Usuario</h3>
        <form onSubmit={handleRegistroSubmit} className="registro-form">
          {/* Tipo de Documento y Nro de Documento */}
          <div className="form-row">
            <div>
              <label htmlFor="tipoDocumento">Tipo de Documento</label>
              <select 
                id="tipoDocumento" 
                value={tipoDocumento} 
                onChange={(e) => setTipoDocumento(e.target.value)} 
                required
              >
                <option value="">Selecciona un tipo de documento</option>
                <option value="1">DNI</option>
                <option value="3">RUC</option>
                <option value="4">Pasaporte</option>
                <option value="5">Otro</option>
              </select>
            </div>
            <div>
              <label htmlFor="documento">Número de Documento</label>
              <input 
                type="text" 
                id="documento" 
                value={numeroDocumento} 
                onChange={(e) => setDocumento(e.target.value)} 
                required
              />
            </div>
          </div>

          {/* Nombres, Apellido Paterno, Apellido Materno */}
          <div className="form-row">
            <div>
              <label htmlFor="nombres">Nombres</label>
              <input 
                type="text" 
                id="nombres" 
                value={nombres} 
                onChange={(e) => setNombres(e.target.value)} 
                required
              />
            </div>
            <div>
              <label htmlFor="apellidoPaterno">Apellido Paterno</label>
              <input 
                type="text" 
                id="apellidoPaterno" 
                value={apellidoPaterno} 
                onChange={(e) => setApellidoPaterno(e.target.value)} 
                required
              />
            </div>
          </div>

          {/* Apellido Materno y Nro de Celular */}
          <div className="form-row">
            <div>
              <label htmlFor="apellidoMaterno">Apellido Materno</label>
              <input 
                type="text" 
                id="apellidoMaterno" 
                value={apellidoMaterno} 
                onChange={(e) => setApellidoMaterno(e.target.value)} 
                required
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

          {/* Email y Contraseña */}
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

          {/* Contraseña y Repetir Contraseña */}
          <div className="form-row">
            <div>
              <label htmlFor="contrasena">Contraseña</label>
              <input 
                type="password" 
                id="contrasena" 
                value={contrasena}  
                onChange={(e) => setContrasena(e.target.value)} 
                required
              />
            </div>
            <div>
              <label htmlFor="repetirContrasena">Repetir Contraseña</label>
              <input 
                type="password" 
                id="repetirContrasena" 
                value={repetirContrasena} 
                onChange={handleRepetirContrasenaChange} 
                required
              />
              {!passwordsMatch && <label className="error-message">Las contraseñas no coinciden.</label>}
            </div>
          </div>

          {/* Aceptación de términos y autorización de datos */}
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
                Autorizo el uso de mis datos personales para recibir información relacionada a la oferta de servicios médicos.
              </label>
            </div>
          </div>

          <div className="registro-cliente-form-actions">
            <button type="button" onClick={handleAtrasClick} className="boton-atras">Atrás</button>
            <button type="submit" disabled={loading}>
              {loading ? <Spin size="small" /> : 'Registrarme'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Registro;