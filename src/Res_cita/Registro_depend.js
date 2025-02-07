import React, { useState,useContext } from 'react';
import { message, Spin } from 'antd';  // Importamos Spin de Ant Design
import axios from 'axios';  // Para hacer las peticiones HTTP
import '../CSS/Registro.css';  // Asegúrate de agregar los estilos necesarios
import { useNavigate } from 'react-router-dom'; // Para redirigir a otra ruta
import { UsuarioContext } from '../context/AuthContext'; 
const Registro = () => {
  // Estados del formulario
  const [iddocumento, setTipoDocumento] = useState('');
  const [numdocumento, setNumeroDocumento] = useState('');
  const [nombres, setNombres] = useState('');
  const [apePaterno, setApellidoPaterno] = useState('');
  const [apeMaterno, setApellidoMaterno] = useState('');
  const [Celular, setTelefono] = useState('');
    const { usuario } = useContext(UsuarioContext);

  const [loading, setLoading] = useState(false); // Estado para controlar el indicador de carga
  const [parentesco, setParentesco] = useState(''); // Estado para el combo de parentesco

  const navigate = useNavigate();  // Hook para la redirección

  // Verificación de contraseñas

  // Enviar formulario de registro
  const goBack = () => {
    navigate('/S_per_familiar');  // Redirige a la página de ReservaCita
  };
  const handleRegistroSubmit = async (e) => {
    e.preventDefault();  // Evita el comportamiento predeterminado del formulario

    // Validación de datos
    if (
      !iddocumento || !numdocumento || !nombres || !apePaterno || !apeMaterno || 
      !Celular ||  !parentesco
    ) {
      message.error("Por favor, completa todos los campos y acepta los términos y condiciones.");
      return;
    }

    // Datos a enviar
    const datosRegistro = {
      iddocumento,
      numdocumento,
      nombres,
      apePaterno,
      apeMaterno,
      Celular,
      parentesco,
      dni_ce:usuario.numeroDocumento
    };
    const payload = {
      Json: JSON.stringify([datosRegistro])  // Convertimos el objeto en un string JSON
    };

    try {
      setLoading(true); // Activar el estado de carga
      // Realizamos la llamada a la API usando axios
      const response = await axios.post('https://localhost:7257/api/Medico/insertar-familiar', payload, {
        headers: {
          'Content-Type': 'application/json', // Indicamos que estamos enviando datos en formato JSON
        },
      });

      // Si la respuesta es exitosa, procesamos la respuesta
      message.success(`Registro correcto!`);

      // Redirigir al usuario a la página de reservas si el registro es exitoso
      navigate('/S_per_familiar'); // Asegúrate de que esta ruta esté configurada en tu aplicación

    } catch (error) {
      console.error('Error al registrar: ', error);

      // Manejo de error cuando hay respuesta desde la API
      if (error.response) {
        let errorMessage = error.response.data;
        message.error(errorMessage);  // Mostrar el mensaje exacto del error enviado por el API
      } else if (error.request) {
        message.error('No se pudo conectar con el servidor. Por favor, inténtelo de nuevo.');
      } else {
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
        <h3>Registro de Familiar</h3>

        <form onSubmit={handleRegistroSubmit} className="registro-form">
          {/* Tipo de Documento y Nro de Documento */}
            {/* Parentesco - ComboBox */}
            <div className="form-row">
            <div>
              <label htmlFor="parentesco">Parentesco</label>
              <select 
                id="parentesco" 
                value={parentesco} 
                onChange={(e) => setParentesco(e.target.value)} 
                required
              >
                <option value="">Selecciona un parentesco</option>
                <option value="Madre">Madre</option>
                <option value="Padre">Padre</option>
                <option value="Hermano">Hermano</option>
                <option value="Hermana">Hermana</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div>
              <label htmlFor="tipoDocumento">Tipo de Documento</label>
              <select 
                id="tipoDocumento" 
                value={iddocumento} 
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
                value={numdocumento} 
                onChange={(e) => setNumeroDocumento(e.target.value)} 
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
                value={apePaterno} 
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
                value={apeMaterno} 
                onChange={(e) => setApellidoMaterno(e.target.value)} 
                required
              />
            </div>
            <div>
              <label htmlFor="telefono">Nro Celular</label>
              <input 
                type="text" 
                id="telefono" 
                value={Celular} 
                onChange={(e) => setTelefono(e.target.value)} 
                required
              />
            </div>
          </div>

          {/* Email y Contraseña */}

        
          {/* Aceptación de términos y autorización de datos */}
          <div className="form-actions">
            <button type="submit" disabled={loading}>  
              {loading ? <Spin size="small" /> : 'Registrarme'}
            </button>

            <button type="button" className="button-back" onClick={goBack}>
          Atrás
        </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Registro;