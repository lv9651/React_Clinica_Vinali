import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logo from '../assets/docmed.jpg';
import { useNavigate } from 'react-router-dom';
import Notification from '../Medico/Notification'; 
import { useLocation } from 'react-router-dom'; // 
const Especialidades = () => {
  const navigate = useNavigate();
  const [especialidades, setEspecialidades] = useState([]);
  const [filteredEspecialidades, setFilteredEspecialidades] = useState([]);
  const [selectedEspecialidad, setSelectedEspecialidad] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [colegioInfo, setColegioInfo] = useState(null);
  const [medicoHorarios, setMedicoHorarios] = useState({});
  const [selectedMedico, setSelectedMedico] = useState(null);
  const [selectedDia, setSelectedDia] = useState(null);
  const [selectedHora, setSelectedHora] = useState([]);
  const [horaSeleccionada, setHoraSeleccionada] = useState(null); // Estado para la hora seleccionada
  const [horamedsec ,setHormedicoDiv] = useState(null); 
  const [sucursales, setSucursales] = useState([]); // Estado para las sucursales
  const [selectedSucursal, setSelectedSucursal] = useState(null); 
  const [allEspecialidades, setAllEspecialidades] = useState([]);
  const [allMedicoHorarios, setAllMedicoHorarios] = useState({});
  const [notification, setNotification] = useState(null); 
  const [horaromed, setHorariomed] = useState(''); 
  const location = useLocation();  
  const { cli_codigo } = location.state || {};  
  let idhorariomedicoString;
  const formatTime = (timeString) => {
    const date = new Date(`1970-01-01T${timeString}Z`);
    let hours = date.getUTCHours();
    let minutes = date.getUTCMinutes();
    let period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${minutes} ${period}`;
  };



  useEffect(() => {
    const fetchEspecialidades = async () => {
      try {
        const response = await axios.get('https://localhost:7257/api/Medico');
        setEspecialidades(response.data);
        setFilteredEspecialidades(response.data);
      } catch (error) {
        console.error('Error al obtener las especialidades:', error);
      }
    };

    const fetchSucursales = async () => {
      try {
        const response = await axios.get('https://localhost:7257/api/Medico/buscarSucursal');
        setSucursales(response.data); // Guardar solo las sucursales
      } catch (error) {
        console.error('Error al obtener las sucursales:', error);
      }
    };

    fetchEspecialidades();
    fetchSucursales(); // Llamar a la API de sucursales
  }, []);

  const handleSelectEspecialidad = async (especialidad) => {
    setSelectedEspecialidad([]);
    setColegioInfo(null);
    setMedicoHorarios({});
    setSelectedDia(null);
    setSelectedHora([]);

    try {
      const response = await axios.get(`https://localhost:7257/api/Medico/buscar/${especialidad.descripcion}`);
      if (response.data && response.data.length > 0) {
        setSelectedEspecialidad(response.data);
        setAllEspecialidades(response.data);
        const colegio = response.data[0].numcolegiatura;
        const colegioResponse = await axios.get(`https://localhost:7257/api/Medico/buscardia/${colegio}`);
        setColegioInfo(colegioResponse.data);


        const horarios = {};
        for (const medico of response.data) {
          try {
            const horarioResponse = await axios.get(`https://localhost:7257/api/Medico/buscardia/${medico.numcolegiatura}`);
            horarios[medico.numcolegiatura] = horarioResponse.data || [];
          } catch (error) {
            console.error(`Error al obtener horarios de ${medico.nombres}:`, error);
          }
        }
        setMedicoHorarios(horarios);
        setAllMedicoHorarios(horarios);  
       
      } else {
        setSelectedEspecialidad([]);
      }
    } catch (error) {
      console.error('Error al buscar médicos por especialidad:', error);
    }
  };



  const handleSearch = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
    const filtered = especialidades.filter((especialidad) =>
      especialidad.descripcion.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredEspecialidades(filtered);
  };

  const groupDaysInRows = (horarios) => {
    const grouped = [];
    for (let i = 0; i < horarios.length; i += 3) {
      grouped.push(horarios.slice(i, i + 3));
    }
    return grouped;
  };

  const groupHoursInRows = (hours) => {
    const grouped = [];
    for (let i = 0; i < hours.length; i += 3) {
      grouped.push(hours.slice(i, i + 3));
    }
    return grouped;
  };

  const handleClickDia = async (idhorariomedico, fecha) => {
  
    const idhorariomedicoString = String(idhorariomedico);
    setHorariomed(idhorariomedicoString);


    
    try {
      const response = await axios.post('https://localhost:7257/api/Medico/buscardiahora', {
        fecha: fecha,
        colegio: idhorariomedicoString,
        idmodalidad: String(1)
      });

      

      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        const horariosDelDia = response.data.map((horario) => ({
          hora: formatTime(horario.horainicio),
          idhorariomedicodividido: horario.idhorariomedicodividido,
          idestado: horario.idestado,
          horainicio: horario.horainicio,
        }));

        setSelectedDia(fecha);
        setSelectedHora(horariosDelDia);
     
     

      } else {
        setSelectedDia(fecha);
        setSelectedHora([]);  // Limpiar las horas
        console.log("No se encontraron horarios disponibles para esta fecha.");
      }
    } catch (error) {
      console.error('Error al obtener las horas de inicio:', error);
      setSelectedDia(fecha);
      setSelectedHora([]);  // Limpiar las horas
    }
  };

  const handleSelectMedico = (medico) => {
    if (!selectedSucursal) {
      setNotification({
        message: `Obligatorio Seleccionar sucursal donde sera atendido`,
        type: 'error',
      });
  
      return; // Salir de la función sin continuar
    }
  
    setSelectedMedico(medico);
    setSelectedDia(null);
    setSelectedHora([]);
    setHoraSeleccionada(null);
    setHormedicoDiv(null);
  };

  const formatFecha = (fecha) => {
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', options);
  };



  const handleSelectHora = (hora,idhorariomeddiv) => {
  // Buscar la sucursal seleccionada para obtener su descripción
  const sucursalSeleccionada = sucursales.find(sucursal => sucursal.idsucursal === selectedSucursal);

  // Formatear la fecha seleccionada
  const fechaFormateada = selectedDia ? formatFecha(selectedDia) : '';




  // Crear el objeto con toda la información seleccionada
  const dataSeleccionada = {
    especialidad: selectedEspecialidad[0]?.descripcion, // Especialidad seleccionada
    medico: selectedMedico, // Médico seleccionado
    sucursal: sucursalSeleccionada ? sucursalSeleccionada.descripcion : '', // Descripción de la sucursal seleccionada
    idesucursal: sucursalSeleccionada ? sucursalSeleccionada.idsucursal : '',
    dia: fechaFormateada, // Día seleccionado formateado
    hora: hora, // Hora seleccionada
    idhorariomedicodividido: idhorariomeddiv, // Hora seleccionada
    idpaciente:cli_codigo,
    Horariomedic:horaromed 
  };

  // Navegar a Eleccion y pasar los datos como state
  navigate('/eleccion', { state: dataSeleccionada });
};
  const handleSelectSucursal = (event) => {
    const selectedSucursalValue = event.target.value;
    setSelectedSucursal(selectedSucursalValue); // Guardar la sucursal seleccionada
  
    // Si hay médicos en allEspecialidades, filtrar por la sucursal seleccionada
    if (allEspecialidades.length > 0) {
      const filteredMedicos = allEspecialidades.filter(medico => 
        medico.idsucursal === selectedSucursalValue
    
        
      );
      setSelectedEspecialidad(filteredMedicos);  // Actualizar los médicos filtrados
      
    }
      

   

    if (Object.keys(allMedicoHorarios).length > 0) {
      const filteredHorarios = {};
      for (const numcolegiatura in allMedicoHorarios) {
        const medicoHorariosList = allMedicoHorarios[numcolegiatura];
        
        // Filtrar los horarios de acuerdo a la sucursal (este es un ejemplo, ajusta la lógica a tu API y estructura)
        const filteredHorario = medicoHorariosList.filter(horario => {
    // Ver cada objeto de horario
          return horario.idsucursal === selectedSucursalValue;  // Verificar que 'idsucursal' sea la propiedad correcta
        });
     
        if (filteredHorario.length > 0) {
          filteredHorarios[numcolegiatura] = filteredHorario;
        }
      }
      setMedicoHorarios(filteredHorarios); // Actualizar los horarios filtrados
    }








  };

  return (

    
    <div className="container mt-5" style={{ display: 'flex', justifyContent: 'space-between' }}>
       {notification && (
    <Notification
      message={notification.message}
      type={notification.type}
      onClose={() => setNotification(null)} // Función para cerrar la notificación
    />
  )}
      <div style={{ flex: 1, marginRight: '20px' }}>
        <h3>Selecciona una Especialidad</h3>
        <input
          type="text"
          placeholder="Buscar especialidad..."
          value={searchTerm}
          onChange={handleSearch}
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '20px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            fontSize: '16px',
          }}
        />
        <div
          className="row"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '15px',
            maxHeight: '400px',
            overflowY: 'auto',
          }}
        >
          {filteredEspecialidades.map((especialidad, index) => (
            <div key={index} className="mb-4" style={{ breakInside: 'avoid' }}>
              <button
                className={`btn btn-outline-primary w-100 ${selectedEspecialidad?.descripcion === especialidad.descripcion ? 'active' : ''}`}
                onClick={() => handleSelectEspecialidad(especialidad)}
                style={{
                  height: '60px',
                  fontSize: '16px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '0 15px',
                  minHeight: '60px',
                  width: '100%',
                  boxSizing: 'border-box',
                }}
              >
                <i className="bi bi-heart-pulse-fill me-2"></i>
                {especialidad.descripcion}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', maxHeight: '500px' }}>
        {selectedEspecialidad.length > -1 ? (
          <div className="mt-4">
            <h5>Especialidad Seleccionada: {selectedEspecialidad[0]?.descripcion}</h5>

            <div className="mb-4">
              <label htmlFor="sucursal">Selecciona una Sucursal:</label>
              <select
                id="sucursal"
                value={selectedSucursal}
                onChange={handleSelectSucursal}
                style={{
                  width: '50%',
                  padding: '10px',
                  marginBottom: '20px',
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                  fontSize: '16px',
                }}
              >
                <option value="">Seleccione una sucursal</option>
                {sucursales.map((sucursal) => (
                  <option key={sucursal.idsucursal} value={sucursal.idsucursal}>
                    {sucursal.descripcion}
                  </option>
                ))}
              </select>
            </div>


            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(1, 1fr)',
                gap: '20px',
                maxHeight: '400px',
                overflowY: 'auto',
              }}
            >
              {selectedEspecialidad.map((medico, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: '#f8f9fa',
                    borderRadius: '8px',
                    padding: '15px',
                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '180px',
                    border: '1px solid #ddd',
                  }}
                >
                  {/* Imagen del doctor */}
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <img
                      src={logo}// Aquí puedes poner la URL o ruta de la imagen del doctor
                      alt="Doctor general"
                      style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        marginRight: '10px',
                      }}
                    />
                    <h6 style={{ fontWeight: 'bold', fontSize: '14px' }}>
                      <strong>Dr(a).:</strong> {medico.nombres} {medico.apellidopaterno} {medico.apellidomaterno}
                    </h6>
                  </div>

                  <ul style={{ fontSize: '14px', paddingLeft: '20px' }}>
                    <li><strong>Especialidad:</strong> {medico.descripcion}</li>
                    <li><strong>Colegiatura:</strong> {medico.numcolegiatura}</li>
                    <li><strong>Colegio:</strong> {medico.abreviatura}</li>
                  </ul>
                  <button
                    onClick={() => handleSelectMedico(medico)}
                    style={{
                      backgroundColor: '#28a745',
                      color: 'white',
                      padding: '10px',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      marginTop: '10px',
                    }}
                  >
                    Ver Disponibilidad
                  </button>
 

                  {/* Mostrar horarios solo si este es el médico seleccionado */}
                  {selectedMedico?.numcolegiatura === medico.numcolegiatura && (
                    <div style={{ marginTop: '1px' }}>
                      <h6><strong>Disponibilidad de Días:</strong></h6>
                      {medicoHorarios[medico.numcolegiatura] && medicoHorarios[medico.numcolegiatura].length > 0 ? (
                        <div>
                          <div
                            style={{
                              display: 'grid',
                              gridTemplateColumns: 'repeat(1, 1fr)',
                              gap: '1px',
                              marginTop: '1px',
                            }}
                          >
                            {groupDaysInRows(medicoHorarios[medico.numcolegiatura]).map((row, rowIndex) => (
                              <div key={rowIndex} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                {row.map((horario, index) => {
                                  const isSelected = selectedDia === horario.fecha; // Verifica si el día es seleccionado
                                

                                  return (
                                    
                                    <div
                                      key={index}
                                      style={{
                                        backgroundColor: '#f1f3f5',
                                        borderRadius: '8px',
                                        padding: '1px',
                                        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                                        textAlign: 'center',
                                        fontSize: '14px',
                                        color: '#333',
                                        backgroundColor: isSelected ? '#c3e6cb' : '#f1f3f5', // Resalta el día seleccionado
                                      }}
                                    >
                                      <div style={{ fontWeight: 'bold', color: '#495057' }}>
                                        {horario.nombreMes}
                                      </div>
                                      <button
                                        onClick={() => handleClickDia(horario.idhorariomedico, horario.fecha)}
                                        style={{
                                          backgroundColor: isSelected ? '#48ea6d' : '#eff7f9', // Resalta el botón del día seleccionado
                                          color: isSelected ? 'white' : '#419887',
                                          padding: '10px',
                                          borderRadius: '5px',
                                          border: 'none',
                                          cursor: 'pointer',
                                          textAlign: 'center',
                                        }}
                                      >
                                        {horario.numeroDia}
                                        <span style={{ display: 'none' }}>{horario.fecha}</span>
                                        <span style={{ display: 'none' }}>{horario.idhorariomedico}</span>
                                      </button>
                                      <div style={{ fontStyle: 'italic', color: '#6c757d' }}>
                                        {horario.nombreDia}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <p>No se han encontrado días disponibles.</p>
                      )}
                    </div>
                  )}

                  {/* Mostrar horarios seleccionados solo para el médico */}
                  {selectedDia && selectedHora.length > 0 && selectedMedico?.numcolegiatura === medico.numcolegiatura && (
                    <div
                      style={{
                        marginTop: '10px',
                        fontSize: '14px',
                        color: '#333',
                        fontWeight: 'bold',
                      }}
                    >
                      <h6><strong>Horarios disponibles:</strong></h6>
                      {selectedHora.length === 0 ? (
                        <p style={{ color: 'red' }}>No hay horarios disponibles para este día.</p>
                      ) : (
                        <ul style={{ listStyleType: 'none', padding: 0 }}>
                          {groupHoursInRows(selectedHora).map((row, index) => (
                            <li key={index} style={{ display: 'flex', justifyContent: 'space-between' }}>
                              {row.map((horaObj, idx) => {
                                const isOccupied = parseInt(horaObj.idestado) === 1; // Verifica si está ocupado
                                const isSelected = horaSeleccionada === horaObj.hora; // Verifica si es la hora seleccionada
                                const isidhorariomedicodiv = horamedsec === horaObj.idhorariomedicodividido; 
                       
                                return (
                                  <button
                                    key={idx}
                                    onClick={() => handleSelectHora(horaObj.hora,horaObj.idhorariomedicodividido)} // Cambiar hora seleccionada
                                    disabled={isOccupied}  // Deshabilitar el botón si idestado es 1
                                    style={{
                                      backgroundColor: isOccupied
                                        ? '#f8d7da'
                                        : isSelected
                                        ? '#c3e6cb' // Pintar de verde claro si está seleccionada
                                        : '#eff7f9',
                                      color: '#419887',
                                      padding: '10px 20px',
                                      borderRadius: '5px',
                                      border: 'none',
                                      cursor: isOccupied ? 'not-allowed' : 'pointer', // Cambiar cursor si está deshabilitado
                                      textAlign: 'center',
                                      fontSize: '14px',
                                      margin: '5px 0',
                                    }}
                                  >
                                    {horaObj.hora}
                                  </button>
                                );
                              })}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p>No se ha seleccionado una especialidad.</p>
        )}
      </div>
    </div>
  );
};

export default Especialidades;