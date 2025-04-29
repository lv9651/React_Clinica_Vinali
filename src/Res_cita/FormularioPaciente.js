import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../CSS/FormularioPaciente.css';
import { BASE_URL } from '../Medico/config';  

const FormularioPaciente = ({ cli_codigo }) => {
  const [paciente, setPaciente] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPacienteDetails = async () => {
      setLoading(true);  // Asegúrate de que la carga se inicia correctamente al cambiar cli_codigo
      try {
        const response = await axios.get(`${BASE_URL}/api/Medicos/buscarhistorialMedico/${cli_codigo}`);
        const data = response.data;

        if (Array.isArray(data) && data.length > 0) {
          setPaciente(data[0]); // Asumiendo que siempre esperamos un solo objeto
        } else {
          setPaciente(null); // Si no se encuentran datos, reinicia el estado
          console.log('No se encontraron detalles para este paciente.');
        }
      } catch (error) {
        console.error('Error al obtener los detalles del paciente:', error);
        setPaciente(null); // Resetea el estado en caso de error
      } finally {
        setLoading(false);  // Termina el loading, independientemente del resultado
      }
    };

    if (cli_codigo) {
      fetchPacienteDetails();  // Solo haz la llamada cuando cli_codigo esté disponible
    }
  }, [cli_codigo]);

  // Si está cargando, muestra el mensaje de carga
  if (loading) return <p>Cargando detalles del paciente...</p>;

  // Si no hay datos para mostrar
  if (!paciente) return <p>No se encontraron detalles para este paciente.</p>;

  return (
    <div className="formulario-paciente">
      <h3>Detalles del Historial Clínico</h3>
      <form>
        <label>Código de Historial:</label>
        <input type="text" value={paciente.codigohistorial || 'No disponible'} disabled />
        
        <label>Peso:</label>
        <input type="text" value={paciente.peso || 'No disponible'} disabled />

        <label>Talla:</label>
        <input type="text" value={paciente.talla || 'No disponible'} disabled />

        <label>Frecuencia Cardíaca:</label>
        <input type="text" value={paciente.frecuenciacardiaca || 'No disponible'} disabled />

        <label>Frecuencia Rítmica:</label>
        <input type="text" value={paciente.frecuenciaritmica || 'No disponible'} disabled />

        <label>Presión Arterial:</label>
        <input type="text" value={paciente.presionarterial || 'No disponible'} disabled />

        <label>Temperatura:</label>
        <input type="text" value={paciente.temperatura || 'No disponible'} disabled />

        <label>Antecedentes Personales:</label>
        <textarea value={paciente.antecedentespersonales || 'No disponible'} disabled />

        <label>Antecedentes Familiares:</label>
        <textarea value={paciente.antecedentesfamiliares || 'No disponible'} disabled />

        <label>Antecedentes Epidemiológicos:</label>
        <textarea value={paciente.antecedentesepidemeologicos || 'No disponible'} disabled />

        <label>Antecedentes Quirúrgicos:</label>
        <textarea value={paciente.antecedentesquirurgicos || 'No disponible'} disabled />

        <label>Otros Antecedentes:</label>
        <textarea value={paciente.antecedentesotros || 'No disponible'} disabled />

        <label>Tipo de Sangre:</label>
        <input type="text" value={paciente.idtiposangre || 'No disponible'} disabled />

        <label>Patología:</label>
        <textarea value={paciente.patologia || 'No disponible'} disabled />

        <label>Alergia:</label>
        <textarea value={paciente.alergia || 'No disponible'} disabled />

        <label>Farmacoterapia:</label>
        <textarea value={paciente.farmacoterapia || 'No disponible'} disabled />

        <label>Apoderado:</label>
        <input type="text" value={paciente.apoderado || 'No disponible'} disabled />

        <label>Número de Documento del Apoderado:</label>
        <input type="text" value={paciente.numdocumentoapoderado || 'No disponible'} disabled />
      </form>
    </div>
  );
};

export default FormularioPaciente;