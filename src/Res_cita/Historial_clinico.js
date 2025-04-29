import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { message } from 'antd';
import { UsuarioContext } from '../context/AuthContext';
import '../CSS/Historial_clinico.css'; // Asegúrate de importar el archivo CSS
import FormularioPaciente from '../Res_cita/FormularioPaciente';
import { BASE_URL } from '../Medico/config';  
const HistoricoClinico = () => {
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState(null); // Nuevo estado para almacenar el paciente seleccionado
  const { usuario } = useContext(UsuarioContext);

  // Función que maneja el clic en la fila de la tabla
  const handleRowClick = (cli_codigo) => {
    setSelectedPatient(cli_codigo);  // Guardamos el cli_codigo del paciente seleccionado
  };

  useEffect(() => {
    if (!usuario || !usuario.numeroDocumento) {
      message.error('No se encontró el número de documento del usuario.');
      setLoading(false);
      return;
    }

    const fetchHistorial = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/Medicos/buscapacientedependiente/${usuario.numeroDocumento}`);
        const data = response.data;

        if (data && data.length > 0) {
          setHistorial(data);  // Si hay datos, los guardamos en el estado
        } else {
          message.warning('No se encontraron registros de historial clínico.');  // Si data es [] o null, mostramos el mensaje
        }
      } catch (error) {
        console.error('Error al obtener el historial clínico:', error);
        message.error('Hubo un problema al consultar el historial clínico.');
      } finally {
        setLoading(false);
      }
    };

    fetchHistorial();
  }, [usuario]);

  return (
    <div className="historico-clinico-container">
      <h2>Historial Clínico del Paciente</h2>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div className="historial-lista">
          {historial.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Apellido Paterno</th>
                  <th>Apellido Materno</th>
                  <th>Celular</th>
                  <th>Número de Documento</th>
                  <th>Parentesco</th>
                </tr>
              </thead>
              <tbody>
                {historial.map((item, index) => (
                  <tr 
                    key={index} 
                    onClick={() => handleRowClick(item.cli_codigo)} 
                    className={selectedPatient === item.cli_codigo ? 'selected-row' : ''} // Condición para agregar clase
                  >
                    <td>{item.nombres}</td>
                    <td>{item.apePaterno}</td>
                    <td>{item.apeMaterno || 'No disponible'}</td>
                    <td>{item.celular}</td>
                    <td>{item.numdocumento}</td>
                    <td>{item.parentesco}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No se encontraron datos del historial clínico.</p>
          )}
        </div>
      )}

      {/* Mostrar el formulario solo si hay un paciente seleccionado */}
      {selectedPatient ? (
        <FormularioPaciente cli_codigo={selectedPatient} />
      ) : (
        <p>Seleccione un paciente para ver el formulario.</p>
      )}
    </div>
  );
};

export default HistoricoClinico;