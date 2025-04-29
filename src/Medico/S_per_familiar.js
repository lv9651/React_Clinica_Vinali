import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // Para redirección
import axios from 'axios'; // Para hacer peticiones HTTP
import { message } from 'antd'; // Usamos Ant Design para mostrar mensajes de error
import '../CSS/Select_paciente.css'; // Asegúrate de que esta ruta esté correcta
import { UsuarioContext } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';
import { TiPointOfInterest } from 'react-icons/ti';
import { BASE_URL } from './config'; 

const S_per_familiar = () => {
  const location = useLocation();
  const [mostrarFormulario, setMostrarFormulario] = useState(false); // Estado para mostrar formulario
  const [dependientes, setDependientes] = useState([]); // Estado para los dependientes
  const [loading, setLoading] = useState(false); // Estado para controlar el indicador de carga
  const navigate = useNavigate();
  const { usuario } = useContext(UsuarioContext);
  const queryParams = new URLSearchParams(location.search);
  const tipo = queryParams.get('tipo');  

  // Función para redirigir a Medico.js
  const reservaParaMi = async () => {
    setLoading(true);  // Habilitar el indicador de carga

    try {
      // Realizamos la consulta a la API de paciente usando el dni del usuario
      const response = await axios.get(`${BASE_URL}/api/Medicos/buscar_idpaciente/${usuario.numeroDocumento}`);
      const data = response.data;  // Obtén los datos del paciente

      if (data) {
        // Redirigimos a /Medico pasando los datos como 'state'
        const cli_codigo = data[0].cli_codigo;
        navigate('/Medico', { state: { cli_codigo, tipo } }); 
      } else {
        message.warning('No se encontró información del paciente.');
      }
    } catch (error) {
      console.error('Error al obtener información del paciente:', error);
      message.error('Hubo un problema al consultar los datos del paciente.');
    } finally {
      setLoading(false);  // Desactivar el indicador de carga
    }
  };

  // Función que se ejecuta cuando se hace clic en "Reserva para Familiar"
  const reservaParaFamiliar = async () => {
    setLoading(true);  // Habilitar el indicador de carga

    try {
      // Realizamos la consulta a la API de dependientes usando el número de documento del usuario
      const response = await axios.get(`${BASE_URL}/api/Medicos/buscar_dependiente/${usuario.numeroDocumento}`);
      const data = response.data;

      if (data && data.length > 0) {
        setDependientes(data); // Establecemos los dependientes encontrados
      } else {
        setDependientes([]); // Si no hay dependientes, lo dejamos vacío
        message.warning('No se encontraron dependientes. Puedes registrar uno nuevo.');
      }
    } catch (error) {
      console.error('Error al obtener dependientes:', error);
      message.error('Hubo un problema al consultar los dependientes.');
    } finally {
      setLoading(false);  // Desactivar el indicador de carga
    }

    setMostrarFormulario(true);  // Muestra el formulario de registro
  };

  // Redirigir al formulario para registrar un nuevo dependiente
  const redirectToRegistro = () => {
    navigate('/Registro_depend');  // Redirige a la página de registro de dependiente
  };

  // Función para manejar el clic en un dependiente
  const handleDependienteClick = (cli_codigo) => {
    // Redirige a la página Medico y pasa el cli_codigo correspondiente
    navigate('/Medico', { state: { cli_codigo, tipo } });
  };

  return (
    <div className="reserva-cita-container">
      <h2>Reserva tu Cita {tipo === '1' ? '(PRESENCIAL)' : tipo === '2' ? '(Teleconsulta)' : ''}</h2>

      <div className="contenedor">
        {/* Contenedor de botones a la izquierda */}
        <div className="menu">
          <button onClick={reservaParaMi} className="button-main">
            Reserva para mí {tipo === '1' ? '(PRESENCIAL)' : tipo === '2' ? '(Teleconsulta)' : ''}
          </button>
          <button onClick={reservaParaFamiliar} className="button-main">
            Reserva para familiar {tipo === '1' ? '(PRESENCIAL)' : tipo === '2' ? '(Teleconsulta)' : ''}
          </button>
        </div>

        {/* Mostrar formulario para familiar */}
        <div className="formulario">
          {mostrarFormulario && (
            <div className="dependientes-container">
              <h3>Dependientes Encontrados:</h3>

              {/* Mostrar los dependientes si existen */}
              {dependientes.length > 0 ? (
                <div>
                  <ul className="dependientes-list">
                    {dependientes.map((dep) => (
                      <button 
                        key={dep.cli_codigo} 
                        className="dependiente-button"
                        onClick={() => handleDependienteClick(dep.cli_codigo)} // Al hacer clic, se pasa el cli_codigo
                      >
                        {dep.nombres} {dep.apePaterno} {dep.apeMaterno} <br/><br/>
                        <span>Parentesco: {dep.parentesco}</span>
                      </button>
                    ))}
                  </ul>

                  <div className="agregar-dependiente">
                    <button onClick={redirectToRegistro} className="button-registrar">Agregar nuevo dependiente</button>
                  </div>
                </div>
              ) : (
                <div className="no-dependientes">
                  <p>No se encontraron dependientes.</p>
                  <button onClick={redirectToRegistro} className="button-registrar">Registrar Nuevo Dependiente</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default S_per_familiar;