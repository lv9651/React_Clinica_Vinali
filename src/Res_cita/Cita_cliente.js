import React, { useState, useEffect, useContext } from 'react';
import { UsuarioContext } from '../context/AuthContext';  // Asegúrate de importar el contexto
import '../CSS/Cita_cliente.css'; 

const BuscarCita = () => {
  const [cita, setCita] = useState([]);  // Para almacenar la respuesta de la API
  const [loading, setLoading] = useState(true);  // Para mostrar un mensaje de carga
  const [error, setError] = useState(null);  // Para manejar errores en la llamada a la API
  const { usuario } = useContext(UsuarioContext);  // Obtenemos el valor de 'usuario' desde el contexto

  // Verifica si los datos de usuario son válidos antes de hacer la solicitud
  useEffect(() => {
    // Verifica si el usuario y numeroDocumento están disponibles


    const fetchCita = async () => {
      try {
      
        const response = await fetch(`https://localhost:7257/api/Medico/buscarcita/${usuario.usuarioID}`);
     
        if (!response.ok) {
          throw new Error('Error en la llamada a la API');
        }
        
        const data = await response.json();  // Convertir la respuesta en formato JSON
        setCita(data);  // Guardar la respuesta en el estado
     // Establecer la carga en false cuando la respuesta se reciba
      } catch (error) {
        setError(error.message);  // Si ocurre un error, guardar el mensaje de error
       // También establecer la carga en false si hay un error
      }
    };

    fetchCita();
  }, [usuario]);  // Dependemos de 'usuario', así que la llamada a la API se vuelve a ejecutar si cambia el usuario



  return (
    <div className="table-container">
      <h2>Detalles de la Cita</h2>
      <table className="cita-table">
        <thead>
          <tr>
            <th>Serie</th>
            <th>Documento</th>
            <th>Total</th>
            <th>Subtotal</th>
            <th>Local</th>
            <th>Medico</th>
            <th>Fecha Registro</th>
            <th>Hora</th>
            <th>Especialidad</th>
        
          </tr>
        </thead>
        <tbody>
          {cita.map((item, index) => (
            <tr key={index}>
              <td>{item.serie}</td>
              <td>{item.numdocumento}</td>
              <td>{item.total}</td>
              <td>{item.subtotal}</td>
              <td>{item.descripcion}</td>
              <td>{`${item.nombres} ${item.apellidopaterno} ${item.apellidomaterno}`}</td>
              <td>{new Date(item.fechacreacion).toLocaleString()}</td>
              <td>{item.horainicio}</td>
              <td>{item.especialidad}</td>
            
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BuscarCita;