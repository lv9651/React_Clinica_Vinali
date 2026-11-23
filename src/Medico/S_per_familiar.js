import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { message } from 'antd';
import { UsuarioContext } from '../context/AuthContext';
import { FaUser, FaUsers, FaWhatsapp, FaArrowRight } from 'react-icons/fa';
import { BASE_URL } from './config';

const S_per_familiar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { usuario } = useContext(UsuarioContext);
  const queryParams = new URLSearchParams(location.search);
  const tipo = queryParams.get('tipo') || '1';

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [dependientes, setDependientes] = useState([]);
  const [loading, setLoading] = useState(false);

  // ============================================================
  // PASOS DEL WIZARD
  // ============================================================
  const pasos = [
    { numero: 1, label: '¿Qué necesitas?', activo: true },
    { numero: 2, label: 'Elige sede', activo: false },
    { numero: 3, label: 'Elige especialista', activo: false },
    { numero: 4, label: 'Fecha y hora', activo: false },
    { numero: 5, label: 'Tus datos', activo: false },
    { numero: 6, label: 'Confirmación', activo: false },
  ];

  // ============================================================
  // RESERVA PARA MÍ
  // ============================================================
  const reservaParaMi = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/api/Medicos/buscar_idpaciente/${usuario.numeroDocumento}`);
      const data = response.data;

      if (data && data.length > 0) {
        const cli_codigo = data[0].cli_codigo;
        navigate('/Medico', { state: { cli_codigo, tipo } });
      } else {
        message.warning('No se encontró información del paciente.');
      }
    } catch (error) {
      console.error('Error al obtener información del paciente:', error);
      message.error('Hubo un problema al consultar los datos del paciente.');
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // RESERVA PARA FAMILIAR
  // ============================================================
  const reservaParaFamiliar = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/api/Medicos/buscar_dependiente/${usuario.numeroDocumento}`);
      const data = response.data;

      if (data && data.length > 0) {
        setDependientes(data);
      } else {
        setDependientes([]);
        message.warning('No se encontraron dependientes. Puedes registrar uno nuevo.');
      }
    } catch (error) {
      console.error('Error al obtener dependientes:', error);
      message.error('Hubo un problema al consultar los dependientes.');
    } finally {
      setLoading(false);
    }
    setMostrarFormulario(true);
  };

  const redirectToRegistro = () => {
    navigate('/Registro_depend');
  };

  const handleDependienteClick = (cli_codigo) => {
    navigate('/Medico', { state: { cli_codigo, tipo } });
  };

  return (
    <div style={{
      display: 'flex',
      gap: '30px',
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '30px 20px',
      fontFamily: "'Poppins', 'Segoe UI', sans-serif"
    }}>

      {/* ============================================================ */}
      {/* SIDEBAR IZQUIERDO: PASOS                                      */}
      {/* ============================================================ */}
      <aside style={{
        flex: '0 0 280px',
        background: 'white',
        borderRadius: '20px',
        padding: '30px 25px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
        height: 'fit-content',
        position: 'sticky',
        top: '100px'
      }}>
        <h3 style={{
          fontSize: '18px',
          fontWeight: 700,
          color: '#1a2b47',
          marginBottom: '25px',
          paddingBottom: '15px',
          borderBottom: '2px solid #f0f9fb'
        }}>Reserva tu cita</h3>

        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 30px 0' }}>
          {pasos.map((paso) => (
            <li key={paso.numero} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 0',
              color: paso.activo ? '#1a3a5c' : '#a0aec0',
              fontWeight: paso.activo ? 600 : 400,
              fontSize: '14px'
            }}>
              <span style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                border: paso.activo ? '2px solid #34b8c5' : '2px solid #e2e8f0',
                background: paso.activo ? '#34b8c5' : 'transparent',
                color: paso.activo ? 'white' : '#a0aec0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '13px',
                fontWeight: 600,
                flexShrink: 0
              }}>{paso.numero}</span>
              <span>{paso.label}</span>
            </li>
          ))}
        </ul>

        {/* Ayuda */}
        <div style={{
          background: '#34b8c5',
          color: 'white',
          padding: '20px',
          borderRadius: '15px',
          marginBottom: '20px'
        }}>
          <h4 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>¿Necesitas ayuda?</h4>
          <p style={{ margin: '4px 0', fontSize: '13px', opacity: 0.95 }}>Escríbenos por WhatsApp</p>
          <p style={{ fontSize: '12px', opacity: 0.85, marginTop: '8px' }}>Lunes a domingo<br />8:00 a.m. - 9:00 p.m.</p>
          <a
            href="https://wa.me/51993805070"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              width: '100%',
              background: 'white',
              color: '#34b8c5',
              padding: '10px',
              borderRadius: '10px',
              fontWeight: 600,
              fontSize: '13px',
              textDecoration: 'none',
              marginTop: '15px'
            }}
          >
            <FaWhatsapp /> WhatsApp
          </a>
        </div>

        {/* Reserva segura */}
        <div style={{
          background: '#f8fafc',
          padding: '20px',
          borderRadius: '15px',
          border: '1px solid #e2e8f0'
        }}>
          <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#1a2b47' }}>🛡️ Reserva 100% segura</h4>
          <p style={{ margin: 0, fontSize: '12px', color: '#718096', lineHeight: 1.5 }}>
            Tus datos están protegidos y no serán compartidos.
          </p>
        </div>
      </aside>

      {/* ============================================================ */}
      {/* CONTENIDO PRINCIPAL                                            */}
      {/* ============================================================ */}
      <main style={{
        flex: 1,
        background: 'white',
        borderRadius: '20px',
        padding: '40px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)'
      }}>

        <h1 style={{
          fontSize: '32px',
          fontWeight: 800,
          color: '#1a2b47',
          marginBottom: '10px'
        }}>¿Para quién es la cita?</h1>
        <p style={{
          fontSize: '15px',
          color: '#718096',
          marginBottom: '40px'
        }}>Selecciona si la reserva es para ti o para un familiar.</p>

        {/* Opciones */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '25px',
          marginBottom: '40px'
        }}>

          {/* Para mí */}
          <div
            onClick={reservaParaMi}
            style={{
              background: '#f8fafc',
              border: '2px solid #e2e8f0',
              borderRadius: '20px',
              padding: '40px 25px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#34b8c5';
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 10px 25px rgba(52, 184, 197, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e2e8f0';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ color: '#34b8c5', marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
              <FaUser size={50} />
            </div>
            <h3 style={{ fontSize: '20px', color: '#1a2b47', marginBottom: '10px', fontWeight: 700 }}>
              Para mí
            </h3>
            <p style={{ fontSize: '14px', color: '#718096', marginBottom: '25px', lineHeight: 1.5 }}>
              Agenda tu cita con tu propio perfil.
            </p>
            <button style={{
              background: '#1a3a5c',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '10px',
              fontWeight: 600,
              fontSize: '14px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              Seleccionar <FaArrowRight />
            </button>
          </div>

          {/* Para familiar */}
          <div
            onClick={reservaParaFamiliar}
            style={{
              background: '#f8fafc',
              border: '2px solid #e2e8f0',
              borderRadius: '20px',
              padding: '40px 25px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#34b8c5';
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 10px 25px rgba(52, 184, 197, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e2e8f0';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ color: '#34b8c5', marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
              <FaUsers size={50} />
            </div>
            <h3 style={{ fontSize: '20px', color: '#1a2b47', marginBottom: '10px', fontWeight: 700 }}>
              Para un familiar
            </h3>
            <p style={{ fontSize: '14px', color: '#718096', marginBottom: '25px', lineHeight: 1.5 }}>
              Agenda una cita para un dependiente.
            </p>
            <button style={{
              background: '#1a3a5c',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '10px',
              fontWeight: 600,
              fontSize: '14px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              Seleccionar <FaArrowRight />
            </button>
          </div>
        </div>

        {/* ============================================================ */}
        {/* DEPENDIENTES (solo si eligió "Para un familiar")              */}
        {/* ============================================================ */}
        {mostrarFormulario && (
          <div style={{ marginTop: '40px', paddingTop: '40px', borderTop: '2px solid #f0f9fb' }}>
            <h3 style={{ fontSize: '20px', color: '#1a2b47', marginBottom: '20px' }}>
              Selecciona al familiar:
            </h3>

            {loading ? (
              <p>Cargando dependientes...</p>
            ) : dependientes.length > 0 ? (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '25px' }}>
                  {dependientes.map((dep) => (
                    <button
                      key={dep.cli_codigo}
                      onClick={() => handleDependienteClick(dep.cli_codigo)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '20px',
                        background: '#f8fafc',
                        border: '2px solid #e2e8f0',
                        borderRadius: '15px',
                        padding: '20px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        width: '100%',
                        transition: 'all 0.3s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#34b8c5';
                        e.currentTarget.style.background = '#f0f9fb';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#e2e8f0';
                        e.currentTarget.style.background = '#f8fafc';
                      }}
                    >
                      <div style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        background: '#34b8c5',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <FaUser size={24} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: '16px', color: '#1a2b47', margin: '0 0 5px 0' }}>
                          {dep.nombres} {dep.apePaterno} {dep.apeMaterno}
                        </h4>
                        <p style={{ fontSize: '13px', color: '#718096', margin: 0 }}>
                          Parentesco: {dep.parentesco}
                        </p>
                      </div>
                      <FaArrowRight style={{ color: '#a0aec0', fontSize: '18px' }} />
                    </button>
                  ))}
                </div>

                <button
                  onClick={redirectToRegistro}
                  style={{
                    background: 'white',
                    color: '#1a3a5c',
                    border: '2px dashed #cbd5e0',
                    padding: '15px 25px',
                    borderRadius: '12px',
                    fontWeight: 600,
                    fontSize: '14px',
                    cursor: 'pointer',
                    width: '100%',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#34b8c5';
                    e.currentTarget.style.color = '#34b8c5';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#cbd5e0';
                    e.currentTarget.style.color = '#1a3a5c';
                  }}
                >
                  + Agregar nuevo dependiente
                </button>
              </>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '40px 20px',
                background: '#f8fafc',
                borderRadius: '15px'
              }}>
                <p style={{ color: '#718096', marginBottom: '20px' }}>
                  No se encontraron dependientes registrados.
                </p>
                <button
                  onClick={redirectToRegistro}
                  style={{
                    background: 'white',
                    color: '#1a3a5c',
                    border: '2px dashed #cbd5e0',
                    padding: '15px 25px',
                    borderRadius: '12px',
                    fontWeight: 600,
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  + Registrar nuevo dependiente
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default S_per_familiar;