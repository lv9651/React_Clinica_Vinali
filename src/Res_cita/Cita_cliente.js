import React, { useState, useEffect, useContext } from "react";
import { UsuarioContext } from "../context/AuthContext";
import "../CSS/Cita_cliente.css";
import { BASE_URL } from "../Medico/config";
import { pdf } from '@react-pdf/renderer';
import RecetaPDF from "./RecetaPDF";

const BuscarCita = () => {
  const [cita, setCita] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recetas, setRecetas] = useState({});
  const [loadingRecetas, setLoadingRecetas] = useState({});
  const { usuario } = useContext(UsuarioContext);

  useEffect(() => {
    const fetchCita = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/Medicos/buscarcita/${usuario.usuarioID}`);
        if (!response.ok) {
          throw new Error("Error en la llamada a la API");
        }
        const data = await response.json();
        setCita(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCita();
  }, [usuario]);

  const parseJsonString = (jsonString) => {
    try {
      return jsonString ? JSON.parse(jsonString) : [];
    } catch (error) {
      console.error("Error parsing JSON string:", jsonString, error);
      return [];
    }
  };

  const openPdfInNewTab = async (recetaData) => {
    try {
      // Crear el PDF como blob
      const blob = await pdf(<RecetaPDF receta={recetaData} />).toBlob();
      
      // Crear URL para el blob
      const pdfUrl = URL.createObjectURL(blob);
      
      // Abrir en nueva pestaña
      const newWindow = window.open(pdfUrl, '_blank');
      
      // Verificar si el navegador bloqueó la ventana emergente
      if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        throw new Error("El navegador bloqueó la ventana emergente. Por favor, permite ventanas emergentes para este sitio.");
      }
      
      // Liberar memoria después de 100ms
      setTimeout(() => URL.revokeObjectURL(pdfUrl), 100);
      
    } catch (error) {
      console.error("Error al generar el PDF:", error);
      setError(`Error al generar el PDF: ${error.message}`);
    }
  };

  const handleDownloadReceta = async (idCita) => {
    // Si ya tenemos los datos, usarlos directamente
    if (recetas[idCita]) {
      await openPdfInNewTab(recetas[idCita]);
      return;
    }

    setLoadingRecetas(prev => ({ ...prev, [idCita]: true }));
    setError(null);

    try {
      // Paso 1: Obtener el idReceta
      const idRecetaResponse = await fetch(`${BASE_URL}/api/Medicos/por-cita/${idCita}`);
      if (!idRecetaResponse.ok) throw new Error("Error obteniendo ID de receta");
      
      const idRecetaData = await idRecetaResponse.json();
      
      if (!idRecetaData || idRecetaData.length === 0) {
        throw new Error("No se encontró receta para esta cita");
      }

      const idReceta = idRecetaData[0].idReceta;

      // Paso 2: Obtener los datos completos de la receta
      const recetaResponse = await fetch(
        `${BASE_URL}/api/Cita/ObtenerDatosRecetaxIdReceta_FormatoReceta/${idReceta}`
      );
      
      if (!recetaResponse.ok) throw new Error("Error obteniendo detalles de la receta");
      
      const responseData = await recetaResponse.json();

      if (!responseData.objeto) {
        throw new Error("Formato de respuesta inesperado");
      }

      // Parsear el string JSON que viene dentro de 'objeto'
      const recetaData = parseJsonString(responseData.objeto)[0];

      // Formatear los datos para el PDF
      const formattedReceta = {
        paciente: {
          nombre: recetaData.paciente,
          documento: recetaData.documento,
          telefono: recetaData.telefono,
          edad: recetaData.edad,
          peso: recetaData.peso
        },
        diagnostico: recetaData.diagnostico,
        fechaEmision: recetaData.fechaemision,
        fechaVencimiento: recetaData.fechavencimiento,
        medico: {
          nombre: recetaData.medico,
          cmp: recetaData.cmp,
          rne: recetaData.rne
        },
        productos: parseJsonString(recetaData.productos),
        componentes: parseJsonString(recetaData.componentes),
        recomendaciones: recetaData.recomendaciones,
        interconsulta: recetaData.interconsulta,
        servicios: recetaData.servicios,
        proximacita: recetaData.proximacita
      };

      // Guardar los datos en el estado
      setRecetas(prev => ({ ...prev, [idCita]: [formattedReceta] }));
      
      // Abrir el PDF en nueva pestaña
      await openPdfInNewTab([formattedReceta]);
      
    } catch (error) {
      console.error("Error al obtener receta:", error);
      setError(error.message);
    } finally {
      setLoadingRecetas(prev => ({ ...prev, [idCita]: false }));
    }
  };

  return (
    <div>
      <div className="table-container">
        <h2>Detalles de la Cita</h2>
        {error && <div className="error-message">{error}</div>}
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
              <th>Receta</th>
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
                <td>
                  <button 
                    onClick={() => handleDownloadReceta(item.idcita)}
                    disabled={loadingRecetas[item.idcita]}
                    className="download-button"
                  >
                    {loadingRecetas[item.idcita] ? 'Cargando...' : 'Ver Receta'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BuscarCita;