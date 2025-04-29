import React, { useState } from 'react';
import '../CSS/Registro.css';  // Asegúrate de agregar los estilos necesarios
import logo from '../assets/Vinali.png';
import axios from 'axios';  // Importamos axios
import { message, Spin } from 'antd';  // Importamos Spin de Ant Design
import { useNavigate } from 'react-router-dom'; // Importamos useNavigate para la redirección
import { useLocation } from 'react-router-dom';
import { BASE_URL } from '../Medico/config'; 
const Registro_act = () => {
  const location = useLocation(); // Obtener el estado de la navegación
  const { documento } = location.state || {}; 

  const [nombres, setNombres] = useState('');
  const [apellidoPaterno, setApellidoPaterno] = useState('');
  const [apellidoMaterno, setApellidoMaterno] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');

  const [contrasena, setContrasena] = useState('');
  const [repetirContrasena, setRepetirContrasena] = useState('');
  const [aceptoTerminos, setAceptoTerminos] = useState(false);
  const [autorizacionDatos, setAutorizacionDatos] = useState(false);

  const [passwordsMatch, setPasswordsMatch] = useState(true); // Estado para verificar si las contraseñas coinciden
  const [loading, setLoading] = useState(false); // Estado para controlar el indicador de carga

  const navigate = useNavigate();  // Hook para la redirección

  // Manejo del cambio en el campo de repetir contraseña
  const handleRepetirContrasenaChange = (e) => {
    setRepetirContrasena(e.target.value);
    setPasswordsMatch(e.target.value === contrasena); // Verifica si las contraseñas coinciden
  };
  console.log(documento);

  const handleRegistroSubmit = async (e) => {
    e.preventDefault();  // Evita el comportamiento predeterminado del formulario

    // Validación de datos
    if (
    !contrasena || !repetirContrasena || contrasena !== repetirContrasena || 
      !aceptoTerminos || !autorizacionDatos
    ) {
      message.error("Por favor, completa todos los campos y acepta los términos y condiciones.");
      return;
    }

    // Datos a enviar
    const datosRegistro = {
      
      dni:documento,
      nombre:nombres,
      apePat:apellidoPaterno,
      apeMat:apellidoMaterno,
      celular:telefono,
      email:correo,
      clave:contrasena,
      aceptTer:aceptoTerminos,
      Aut:autorizacionDatos,
    };
    const payload = {
      json: JSON.stringify(datosRegistro)  // Convertimos el objeto en un string JSON
    };
    try {
      setLoading(true); // Activar el estado de carga
      // Realizamos la llamada a la API usando axios
      const response = await axios.post(`${BASE_URL}/api/Medicos/Act_cli_Vin`, payload, {
        headers: {
          'Content-Type': 'application/json', // Indicamos que estamos enviando datos en formato JSON
        },
      });

      // Si la respuesta es exitosa, procesamos la respuesta
      message.success(`Actualizacion correcto!`);

      // Redirigir al usuario a la página de reservas si el registro es exitoso
      navigate('/');  // Asegúrate de que esta ruta esté configurada en tu aplicación

    } catch (error) {
      console.error('Error al registrar: ', error);

      // Verificar el contenido de la respuesta de error (esto es para depuración)
      console.log('Error response:', error.response);  // Esto nos ayudará a ver lo que estamos recibiendo de la API.

      // Manejo de error cuando hay respuesta desde la API
      if (error.response) {
        let errorMessage = error.response.data;
        console.log('Mensaje de error del servidor:', errorMessage);

        if (errorMessage && errorMessage.startsWith("Internal server error:")) {
          errorMessage = errorMessage.replace("Internal server error:", "").trim();
        }

        message.error(errorMessage);  // Mostrar el mensaje exacto del error enviado por el API
      } else if (error.request) {
        console.error('Error de red: ', error.request);
        message.error('No se pudo conectar con el servidor. Por favor, inténtelo de nuevo.');
      } else {
        console.error('Error desconocido: ', error.message);
        message.error('Ocurrió un error desconocido. Inténtalo más tarde.');
      }
    } finally {
      setLoading(false); // Desactivar el estado de carga después de que se haya completado la solicitud
    }
  };

  // Función para retroceder a la página anterior
  const handleAtrasClick = () => {
    window.history.back(); // Vuelve a la página anterior
  };

 
  return (
    <div className="reservar-cita-container">
      <div className="reservar-cita-background">
        {/* Fondo se mantiene */}
      </div>

      <div className="reservar-cita-form-container">
        <div className="logo-container">
          <img src={logo} alt="Logo de la empresa" className="logo-imagen" />
        </div>
        <h3>Actualizacion de datos</h3>

        <form onSubmit={handleRegistroSubmit} className="registro-form">
          {/* Tipo de Documento y Nro de Documento */}
        

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
              {/* Mostrar mensaje de error si las contraseñas no coinciden */}
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
                Autorizo el uso de mis datos personales para recibir información relacionada a la oferta de servicios médicos de Clínica Vinali.
              </label>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={handleAtrasClick} className="boton-atras">Atrás</button>
            <button type="submit" disabled={loading}>  {/* Deshabilitar el botón mientras carga */}
              {loading ? <Spin size="small" /> : 'Registrarme'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Registro_act;