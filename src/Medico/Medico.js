import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logo from '../assets/docmed.jpg';
import { useNavigate } from 'react-router-dom';
import Notification from '../Medico/Notification';
import { useLocation } from 'react-router-dom';
import { BASE_URL } from './config';
import {
  FaWhatsapp,
  FaArrowLeft,
  FaCalendarAlt,
  FaClock,
  FaUserMd,
  FaArrowRight,
} from 'react-icons/fa';

const Medico = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ============================================================
  // ESTADOS
  // ============================================================
  const [especialidades, setEspecialidades] = useState([]);
  const [filteredEspecialidades, setFilteredEspecialidades] = useState([]);
  const [selectedEspecialidad, setSelectedEspecialidad] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [medicoHorarios, setMedicoHorarios] = useState({});
  const [selectedMedico, setSelectedMedico] = useState(null);
  const [selectedDia, setSelectedDia] = useState(null);
  const [selectedHora, setSelectedHora] = useState([]);
  const [horaSeleccionada, setHoraSeleccionada] = useState(null);
  const [horamedsec, setHormedicoDiv] = useState(null);
  const [sucursales, setSucursales] = useState([]);
  const [selectedSucursal, setSelectedSucursal] = useState(null);
  const [selectedSucse, setSelectedSucse] = useState(null);
  const [allEspecialidades, setAllEspecialidades] = useState([]);
  const [allMedicoHorarios, setAllMedicoHorarios] = useState({});
  const [notification, setNotification] = useState(null);
  const [horaromed, setHorariomed] = useState('');

  const { cli_codigo } = location.state || {};
  const { tipo } = location.state || {};
    const { citaParaGuardar  } = location.state || {};
  const { servicioPendiente } = location.state || {};
  const [avisoServicio, setAvisoServicio] = useState(
    servicioPendiente || null
  );

  // ============================================================
  // PASOS
  // ============================================================
  const pasos = [
    { numero: 1, label: '¿Qué necesitas?', activo: false },
    { numero: 2, label: 'Elige especialista', activo: true },
    { numero: 3, label: 'Elige sede', activo: true },
    { numero: 4, label: 'Fecha y hora', activo: false },
    { numero: 5, label: 'Tus datos', activo: false },
    { numero: 6, label: 'Confirmación', activo: false },
  ];

  // ============================================================
  // HELPERS
  // ============================================================
  const formatTime = (timeString) => {
    const date = new Date(`1970-01-01T${timeString}Z`);
    let hours = date.getUTCHours();
    let minutes = date.getUTCMinutes();
    let period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${minutes} ${period}`;
  };

  const formatFecha = (fecha) => {
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', options);
  };

  // ============================================================
  // CARGAR ESPECIALIDADES
  // ============================================================
  useEffect(() => {
    const fetchEspecialidades = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/Medicos`);
        setEspecialidades(response.data);
        setFilteredEspecialidades(response.data);
      } catch (error) {
        console.error('Error al obtener las especialidades:', error);
      }
    };
    fetchEspecialidades();
  }, []);

  useEffect(() => {
  if (cli_codigo) {
    console.log('🛒 Guardando idPacienteActivo:', cli_codigo);
    localStorage.setItem('idPacienteActivo', cli_codigo);
  }
}, [cli_codigo]);
  // ============================================================
  // SELECCIONAR ESPECIALIDAD
  // ============================================================
  const handleSelectEspecialidad = async (especialidad) => {
    setSelectedEspecialidad([]);
    setMedicoHorarios({});
    setSelectedDia(null);
    setSelectedHora([]);
    setSelectedMedico(null);
    setSelectedSucursal(null);
    setSelectedSucse(null);

    try {
      const response = await axios.get(
        `${BASE_URL}/api/Medicos/buscarSucursal?especialidad=${especialidad.descripcion}`
      );
      setSucursales(response.data);
    } catch (error) {
      console.error('Error al obtener las sucursales:', error);
      setSucursales([]);
    }

    try {
      const response = await axios.get(
        `${BASE_URL}/api/Medicos/buscar/${especialidad.descripcion}`
      );
      if (response.data && response.data.length > 0) {
        setSelectedEspecialidad(response.data);
        setAllEspecialidades(response.data);

        const horarios = {};
        for (const medico of response.data) {
          try {
            const horarioResponse = await axios.get(
              `${BASE_URL}/api/Medicos/buscardia/${medico.numcolegiatura}`
            );
            horarios[medico.numcolegiatura] = horarioResponse.data || [];
          } catch (error) {
            console.error(
              `Error al obtener horarios de ${medico.nombres}:`,
              error
            );
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

  // ============================================================
  // BUSCAR
  // ============================================================
  const handleSearch = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
    const filtered = especialidades.filter((especialidad) =>
      especialidad.descripcion.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredEspecialidades(filtered);
  };

  // ============================================================
  // SELECCIONAR SUCURSAL (comparaciones con String)
  // ============================================================
  const handleSelectSucursal = (event) => {
    const selectedSucursalValue = event.target.value;
    setSelectedSucursal(selectedSucursalValue);

    const sucursalSel = sucursales.find(
      (sucursal) => String(sucursal.idsucursal) === String(selectedSucursalValue)
    );
    setSelectedSucse(sucursalSel ? sucursalSel.descripcion : '');

    if (allEspecialidades.length > 0) {
      const filteredMedicos = allEspecialidades.filter(
        (medico) => String(medico.idsucursal) === String(selectedSucursalValue)
      );
      setSelectedEspecialidad(filteredMedicos);
    }

    if (Object.keys(allMedicoHorarios).length > 0) {
      const filteredHorarios = {};
      for (const numcolegiatura in allMedicoHorarios) {
        const medicoHorariosList = allMedicoHorarios[numcolegiatura];
        const filteredHorario = medicoHorariosList.filter(
          (horario) => String(horario.idsucursal) === String(selectedSucursalValue)
        );
        if (filteredHorario.length > 0) {
          filteredHorarios[numcolegiatura] = filteredHorario;
        }
      }
      setMedicoHorarios(filteredHorarios);
    }
  };

  // ============================================================
  // SELECCIONAR MÉDICO
  // ============================================================
  const handleSelectMedico = (medico) => {
    if (!selectedSucursal) {
      setNotification({
        message: `Obligatorio seleccionar sucursal donde será atendido`,
        type: 'error',
      });
      return;
    }
    setSelectedMedico(medico);
    setSelectedDia(null);
    setSelectedHora([]);
    setHoraSeleccionada(null);
    setHormedicoDiv(null);
  };

  // ============================================================
  // SELECCIONAR DÍA
  // ============================================================
  const handleClickDia = async (idhorariomedico, fecha) => {
    const idhorariomedicoString = String(idhorariomedico);
    setHorariomed(idhorariomedicoString);

    try {
      const response = await axios.post(
        `${BASE_URL}/api/Medicos/buscardiahora`,
        {
          fecha: fecha,
          colegio: idhorariomedicoString,
          idmodalidad: String(tipo),
        }
      );

      if (
        response.data &&
        Array.isArray(response.data) &&
        response.data.length > 0
      ) {
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
        setSelectedHora([]);
      }
    } catch (error) {
      console.error('Error al obtener las horas de inicio:', error);
      setSelectedDia(fecha);
      setSelectedHora([]);
    }
  };

  // ============================================================
  // SELECCIONAR HORA
  // ============================================================
  const handleSelectHora = (hora, idhorariomeddiv) => {
    setHoraSeleccionada(hora);
    setHormedicoDiv(idhorariomeddiv);
  };

  // ============================================================
  // CONTINUAR → IR A ELECCION
  // ============================================================
  const handleContinuar = () => {
    if (!selectedMedico || !selectedDia || !horaSeleccionada) {
      setNotification({
        message: 'Selecciona especialista, día y hora.',
        type: 'error',
      });
      return;
    }

    // 👇 comparación con String
    const sucursalSeleccionada = sucursales.find(
      (sucursal) => String(sucursal.idsucursal) === String(selectedSucursal)
    );
    const fechaFormateada = selectedDia ? formatFecha(selectedDia) : '';

    const especialidadSeleccionada = especialidades.find(
      (e) => e.descripcion === selectedEspecialidad[0]?.descripcion
    );

    const dataSeleccionada = {
      especialidad: selectedEspecialidad[0]?.descripcion,
      medico: selectedMedico,
      sucursal: sucursalSeleccionada ? sucursalSeleccionada.descripcion : '',
      idesucursal: sucursalSeleccionada ? sucursalSeleccionada.idsucursal : '',
      idtipoespecialidad: especialidadSeleccionada?.idespecialidad,
      idprocedenciaregistro: selectedEspecialidad[0]?.idprocedenciaregistro,
      dia: fechaFormateada,
      hora: horaSeleccionada,
      idhorariomedicodividido: horamedsec,
      idpaciente: cli_codigo,
      Horariomedic: horaromed,
      TipoModalidad: tipo,
    };

    navigate('/eleccion', { state: dataSeleccionada });
  };

  return (
    <div
      style={{
        display: 'flex',
        gap: '25px',
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '25px 20px',
        fontFamily: "'Poppins', 'Segoe UI', sans-serif",
        background: '#f5f7fa',
        minHeight: 'calc(100vh - 200px)',
      }}
    >
      {/* SIDEBAR IZQUIERDO: PASOS */}
      <aside
        style={{
          flex: '0 0 240px',
          background: 'white',
          borderRadius: '16px',
          padding: '25px 20px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
          height: 'fit-content',
          position: 'sticky',
          top: '100px',
        }}
      >
        <h3
          style={{
            fontSize: '15px',
            fontWeight: 700,
            color: '#1a2b47',
            marginBottom: '20px',
            paddingBottom: '12px',
            borderBottom: '1px solid #e2e8f0',
          }}
        >
          Reserva tu cita
        </h3>

        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 25px 0' }}>
          {pasos.map((paso) => (
            <li
              key={paso.numero}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 0',
                color: paso.activo ? '#1a2b47' : '#a0aec0',
                fontWeight: paso.activo ? 600 : 400,
                fontSize: '13px',
              }}
            >
              <span
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  border: paso.activo
                    ? '2px solid #34b8c5'
                    : '2px solid #e2e8f0',
                  background: paso.activo ? '#34b8c5' : 'transparent',
                  color: paso.activo ? 'white' : '#a0aec0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  fontWeight: 600,
                  flexShrink: 0,
                }}
              >
                {paso.numero}
              </span>
              <span>{paso.label}</span>
            </li>
          ))}
        </ul>

        <div
          style={{
            background: '#34b8c5',
            color: 'white',
            padding: '18px',
            borderRadius: '12px',
          }}
        >
          <h4 style={{ margin: '0 0 6px 0', fontSize: '14px' }}>
            ¿Necesitas ayuda?
          </h4>
          <p style={{ margin: '3px 0', fontSize: '12px', opacity: 0.95 }}>
            Escríbenos por WhatsApp
          </p>
          <p style={{ fontSize: '11px', opacity: 0.85, marginTop: '6px' }}>
            Lunes a domingo
            <br />
            8:00 a.m. - 9:00 p.m.
          </p>
          <a
            href="https://wa.me/51993805070"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              width: '100%',
              background: 'white',
              color: '#34b8c5',
              padding: '9px',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '12px',
              textDecoration: 'none',
              marginTop: '12px',
            }}
          >
            <FaWhatsapp /> WhatsApp
          </a>
        </div>
      </aside>

      {/* CONTENIDO CENTRAL */}
      <div style={{ flex: 1 }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            padding: '10px 18px',
            color: '#1a2b47',
            fontWeight: 600,
            fontSize: '13px',
            cursor: 'pointer',
            marginBottom: '20px',
          }}
        >
          <FaArrowLeft /> Volver
        </button>

        <h1
          style={{
            fontSize: '22px',
            fontWeight: 700,
            color: '#1a2b47',
            marginBottom: '6px',
          }}
        >
          Elige tu especialista
        </h1>
        <p
          style={{
            fontSize: '13px',
            color: '#718096',
            marginBottom: '20px',
          }}
        >
          Selecciona al profesional con quien deseas atenderte.
        </p>

        {/* AVISO DE SERVICIO AGREGADO */}
        {avisoServicio && (
          <div
            style={{
              background: '#dcfce7',
              border: '1px solid #16a34a',
              color: '#166534',
              borderRadius: '12px',
              padding: '12px 16px',
              marginBottom: '20px',
              fontSize: '13px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            ✅ Servicio agregado con código:{' '}
            <strong>{avisoServicio.codigoUnico}</strong>
          </div>
        )}

        {/* FILTROS DE ESPECIALIDAD */}
        <div
          style={{
            background: 'white',
            borderRadius: '16px',
            padding: '15px 20px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
            marginBottom: '20px',
          }}
        >
          <input
            type="text"
            placeholder="Buscar especialidad..."
            value={searchTerm}
            onChange={handleSearch}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              fontSize: '13px',
              outline: 'none',
              marginBottom: '12px',
              fontFamily: "'Poppins', 'Segoe UI', sans-serif",
            }}
          />
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {filteredEspecialidades.slice(0, 8).map((especialidad, index) => {
              const isSelected =
                selectedEspecialidad[0]?.descripcion ===
                especialidad.descripcion;
              return (
                <button
                  key={index}
                  onClick={() => handleSelectEspecialidad(especialidad)}
                  style={{
                    background: isSelected ? '#34b8c5' : 'white',
                    color: isSelected ? 'white' : '#1a2b47',
                    border: isSelected
                      ? '1px solid #34b8c5'
                      : '1px solid #e2e8f0',
                    borderRadius: '20px',
                    padding: '6px 14px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {especialidad.descripcion}
                </button>
              );
            })}
          </div>
        </div>

        {/* GRID DE 2 COLUMNAS */}
        {selectedEspecialidad.length > 0 && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '20px',
            }}
          >
            {/* COLUMNA IZQUIERDA: MÉDICOS */}
            <div
              style={{
                background: 'white',
                borderRadius: '16px',
                padding: '20px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '15px',
                }}
              >
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: '#34b8c5',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '12px',
                  }}
                >
                  3
                </div>
                <h3
                  style={{
                    fontSize: '15px',
                    color: '#1a2b47',
                    margin: 0,
                    fontWeight: 700,
                  }}
                >
                  Elige tu especialista
                </h3>
              </div>

              {selectedEspecialidad.length > 0 && (
                <div style={{ marginBottom: '18px' }}>
                  <label
                    style={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#1a2b47',
                      display: 'block',
                      marginBottom: '8px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    📍 Sede
                  </label>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: '8px',
                      maxHeight: '140px',
                      overflowY: 'auto',
                      paddingRight: '5px',
                    }}
                  >
                    {sucursales.map((sucursal) => {
                      // 👇 comparación con String
                      const isSelected =
                        String(selectedSucursal) === String(sucursal.idsucursal);
                      return (
                        <button
                          key={sucursal.idsucursal}
                          onClick={() =>
                            handleSelectSucursal({
                              target: { value: sucursal.idsucursal },
                            })
                          }
                          style={{
                            background: isSelected ? '#34b8c5' : 'white',
                            color: isSelected ? 'white' : '#1a2b47',
                            border: isSelected
                              ? '1px solid #34b8c5'
                              : '1px solid #e2e8f0',
                            borderRadius: '8px',
                            padding: '10px 12px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: 600,
                            textAlign: 'center',
                            transition: 'all 0.2s',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                          onMouseEnter={(e) => {
                            if (!isSelected) {
                              e.currentTarget.style.borderColor = '#34b8c5';
                              e.currentTarget.style.background = '#f0f9fb';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isSelected) {
                              e.currentTarget.style.borderColor = '#e2e8f0';
                              e.currentTarget.style.background = 'white';
                            }
                          }}
                        >
                          {sucursal.descripcion}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  maxHeight: '450px',
                  overflowY: 'auto',
                }}
              >
                {selectedEspecialidad.map((medico, index) => {
                  const isSelected =
                    selectedMedico?.numcolegiatura === medico.numcolegiatura;
                  return (
                    <div
                      key={index}
                      onClick={() => handleSelectMedico(medico)}
                      style={{
                        background: isSelected ? '#f0f9fb' : '#f8fafc',
                        borderRadius: '12px',
                        padding: '15px',
                        border: isSelected
                          ? '1px solid #34b8c5'
                          : '1px solid #e2e8f0',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                        }}
                      >
                        <img
                          src={logo}
                          alt="Doctor"
                          style={{
                            width: '50px',
                            height: '50px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: isSelected
                              ? '2px solid #34b8c5'
                              : '2px solid #e2e8f0',
                          }}
                        />
                        <div style={{ flex: 1 }}>
                          <h4
                            style={{
                              fontSize: '14px',
                              color: '#1a2b47',
                              margin: '0 0 3px 0',
                              fontWeight: 700,
                            }}
                          >
                            Dr(a). {medico.nombres} {medico.apellidopaterno}
                          </h4>
                          <p
                            style={{
                              fontSize: '12px',
                              color: '#718096',
                              margin: '0 0 2px 0',
                            }}
                          >
                            {medico.descripcion}
                          </p>
                          <p
                            style={{
                              fontSize: '11px',
                              color: '#34b8c5',
                              margin: 0,
                              fontWeight: 600,
                            }}
                          >
                            ⭐ 4.9 (128 reseñas)
                          </p>
                        </div>
                        {isSelected && (
                          <div
                            style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '50%',
                              background: '#34b8c5',
                              color: 'white',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '12px',
                              fontWeight: 700,
                            }}
                          >
                            ✓
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* COLUMNA DERECHA: FECHA Y HORA */}
            <div
              style={{
                background: 'white',
                borderRadius: '16px',
                padding: '20px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '15px',
                }}
              >
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: '#34b8c5',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '12px',
                  }}
                >
                  4
                </div>
                <h3
                  style={{
                    fontSize: '15px',
                    color: '#1a2b47',
                    margin: 0,
                    fontWeight: 700,
                  }}
                >
                  Selecciona fecha y hora
                </h3>
              </div>

              {selectedMedico ? (
                <div>
                  <div style={{ marginBottom: '20px' }}>
                    <p
                      style={{
                        fontSize: '12px',
                        fontWeight: 600,
                        color: '#1a2b47',
                        marginBottom: '10px',
                      }}
                    >
                      <FaCalendarAlt /> Días disponibles
                    </p>

                    {medicoHorarios[selectedMedico.numcolegiatura] &&
                    medicoHorarios[selectedMedico.numcolegiatura].length >
                      0 ? (
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(3, 1fr)',
                          gap: '8px',
                        }}
                      >
                        {medicoHorarios[selectedMedico.numcolegiatura].map(
                          (horario, idx) => (
                            <button
                              key={idx}
                              onClick={() =>
                                handleClickDia(
                                  horario.idhorariomedico,
                                  horario.fecha
                                )
                              }
                              style={{
                                background:
                                  selectedDia === horario.fecha
                                    ? '#34b8c5'
                                    : 'white',
                                color:
                                  selectedDia === horario.fecha
                                    ? 'white'
                                    : '#1a2b47',
                                border:
                                  selectedDia === horario.fecha
                                    ? '1px solid #34b8c5'
                                    : '1px solid #e2e8f0',
                                borderRadius: '10px',
                                padding: '10px 8px',
                                cursor: 'pointer',
                                textAlign: 'center',
                              }}
                            >
                              <div
                                style={{
                                  fontSize: '10px',
                                  opacity: 0.8,
                                  textTransform: 'uppercase',
                                }}
                              >
                                {horario.nombreMes}
                              </div>
                              <div
                                style={{
                                  fontSize: '18px',
                                  fontWeight: 700,
                                  lineHeight: 1.2,
                                }}
                              >
                                {horario.numeroDia}
                              </div>
                              <div
                                style={{
                                  fontSize: '10px',
                                  textTransform: 'capitalize',
                                }}
                              >
                                {horario.nombreDia}
                              </div>
                            </button>
                          )
                        )}
                      </div>
                    ) : (
                      <p style={{ fontSize: '12px', color: '#718096' }}>
                        No hay días disponibles.
                      </p>
                    )}
                  </div>

                  {selectedDia && (
                    <div>
                      <p
                        style={{
                          fontSize: '12px',
                          fontWeight: 600,
                          color: '#1a2b47',
                          marginBottom: '10px',
                        }}
                      >
                        <FaClock /> Horarios disponibles
                      </p>

                      {selectedHora.length > 0 ? (
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            gap: '8px',
                          }}
                        >
                          {selectedHora.map((horaObj, idx) => {
                            const isOccupied =
                              parseInt(horaObj.idestado) === 1;
                            return (
                              <button
                                key={idx}
                                onClick={() =>
                                  handleSelectHora(
                                    horaObj.hora,
                                    horaObj.idhorariomedicodividido
                                  )
                                }
                                disabled={isOccupied}
                                style={{
                                  background: isOccupied
                                    ? '#f8d7da'
                                    : horaSeleccionada === horaObj.hora
                                    ? '#34b8c5'
                                    : 'white',
                                  color: isOccupied
                                    ? '#999'
                                    : horaSeleccionada === horaObj.hora
                                    ? 'white'
                                    : '#1a3a5c',
                                  border:
                                    '1px solid ' +
                                    (isOccupied
                                      ? '#f8d7da'
                                      : horaSeleccionada === horaObj.hora
                                      ? '#34b8c5'
                                      : '#e2e8f0'),
                                  borderRadius: '8px',
                                  padding: '10px',
                                  cursor: isOccupied
                                    ? 'not-allowed'
                                    : 'pointer',
                                  fontSize: '13px',
                                  fontWeight: 600,
                                  textAlign: 'center',
                                }}
                              >
                                {horaObj.hora}
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <p style={{ fontSize: '12px', color: '#718096' }}>
                          No hay horarios disponibles para este día.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '60px 20px',
                    color: '#a0aec0',
                  }}
                >
                  <FaUserMd
                    size={50}
                    style={{ marginBottom: '15px', opacity: 0.3 }}
                  />
                  <p style={{ fontSize: '13px', margin: 0 }}>
                    Selecciona un especialista para ver su disponibilidad
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* SIDEBAR DERECHO: RESUMEN */}
      <aside
        style={{
          flex: '0 0 260px',
          background: 'white',
          borderRadius: '16px',
          padding: '25px 20px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
          height: 'fit-content',
          position: 'sticky',
          top: '100px',
        }}
      >
        <h3
          style={{
            fontSize: '15px',
            fontWeight: 700,
            color: '#1a2b47',
            marginBottom: '18px',
            paddingBottom: '12px',
            borderBottom: '1px solid #e2e8f0',
          }}
        >
          Resumen de tu cita
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <p
              style={{
                fontSize: '10px',
                color: '#a0aec0',
                margin: 0,
                textTransform: 'uppercase',
                fontWeight: 600,
              }}
            >
              Especialidad
            </p>
            <p
              style={{
                fontSize: '13px',
                color: '#1a2b47',
                margin: '3px 0 0 0',
                fontWeight: 500,
              }}
            >
              {selectedEspecialidad[0]?.descripcion || 'Por seleccionar'}
            </p>
          </div>

          <div>
            <p
              style={{
                fontSize: '10px',
                color: '#a0aec0',
                margin: 0,
                textTransform: 'uppercase',
                fontWeight: 600,
              }}
            >
              Sede
            </p>
            <p
              style={{
                fontSize: '13px',
                color: '#1a2b47',
                margin: '3px 0 0 0',
                fontWeight: 500,
              }}
            >
              {selectedSucse || 'Por seleccionar'}
            </p>
          </div>

          <div>
            <p
              style={{
                fontSize: '10px',
                color: '#a0aec0',
                margin: 0,
                textTransform: 'uppercase',
                fontWeight: 600,
              }}
            >
              Especialista
            </p>
            <p
              style={{
                fontSize: '13px',
                color: '#1a2b47',
                margin: '3px 0 0 0',
                fontWeight: 500,
              }}
            >
              {selectedMedico
                ? `Dr(a). ${selectedMedico.nombres} ${selectedMedico.apellidopaterno}`
                : 'Por seleccionar'}
            </p>
          </div>

          <div>
            <p
              style={{
                fontSize: '10px',
                color: '#a0aec0',
                margin: 0,
                textTransform: 'uppercase',
                fontWeight: 600,
              }}
            >
              Fecha y hora
            </p>
            <p
              style={{
                fontSize: '13px',
                color: '#1a2b47',
                margin: '3px 0 0 0',
                fontWeight: 500,
              }}
            >
              {selectedDia ? formatFecha(selectedDia) : 'Por seleccionar'}
              {horaSeleccionada ? `, ${horaSeleccionada}` : ''}
            </p>
          </div>
        </div>

        <button
          onClick={handleContinuar}
          disabled={!selectedMedico || !selectedDia || !horaSeleccionada}
          style={{
            width: '100%',
            background:
              selectedMedico && selectedDia && horaSeleccionada
                ? '#1a3a5c'
                : '#cbd5e0',
            color: 'white',
            border: 'none',
            padding: '13px',
            borderRadius: '10px',
            fontWeight: 700,
            fontSize: '13px',
            cursor:
              selectedMedico && selectedDia && horaSeleccionada
                ? 'pointer'
                : 'not-allowed',
            marginTop: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          CONTINUAR <FaArrowRight />
        </button>
      </aside>

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
};

export default Medico;