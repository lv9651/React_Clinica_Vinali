import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UsuarioContext } from '../context/AuthContext';
import { BASE_URL } from '../Medico/config';
import {
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaUserMd,
  FaBox,
  FaArrowLeft,
  FaWhatsapp,
  FaHistory,
  FaCheckCircle,
  FaChevronRight,
} from 'react-icons/fa';

const MisCitas = () => {
  const navigate = useNavigate();
  const { usuario } = useContext(UsuarioContext);

  const [items, setItems] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtro, setFiltro] = useState('todas');

  // ============================================================
  // 📥 CARGAR DATOS
  // ============================================================
  useEffect(() => {
    if (!usuario?.usuarioID) {
      setCargando(false);
      return;
    }

    const cargar = async () => {
      try {
        setCargando(true);
        const res = await fetch(
          `${BASE_URL}/api/CMS/mis-citas/${usuario.usuarioID}`
        );
        const data = await res.json();
        setItems(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error al cargar mis citas:', error);
        setItems([]);
      } finally {
        setCargando(false);
      }
    };

    cargar();
  }, [usuario]);

  // ============================================================
  // FILTROS
  // ============================================================
  const itemsFiltrados = items.filter((it) => {
    if (filtro === 'citas') return it.tipo === 'CITA';
    if (filtro === 'productos') return it.tipo === 'PRODUCTO';
    return true;
  });

  const totalCitas = items.filter((i) => i.tipo === 'CITA').length;
  const totalProductos = items.filter((i) => i.tipo === 'PRODUCTO').length;

  const totalGastado = items.reduce(
    (acc, i) => acc + parseFloat(i.total || 0),
    0
  );

  // ============================================================
  // FORMATOS
  // ============================================================
  const formatearFecha = (fecha) => {
    if (!fecha) return '';
    const d = new Date(fecha);
    return d.toLocaleDateString('es-PE', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatearHora = (hora) => {
    if (!hora) return '';
    const partes = String(hora).split(':');
    if (partes.length < 2) return hora;
    let h = parseInt(partes[0], 10);
    const m = partes[1];
    const period = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${h}:${m} ${period}`;
  };

  // ============================================================
  // RENDER
  // ============================================================
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
      {/* ============================================================ */}
      {/* SIDEBAR IZQUIERDO                                            */}
      {/* ============================================================ */}
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
          maxHeight: 'calc(100vh - 140px)',
          overflowY: 'auto',
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
          Mi cuenta
        </h3>

        {/* Datos del usuario */}
        {usuario && (
          <div
            style={{
              background: '#f0f9fb',
              borderRadius: '10px',
              padding: '15px',
              marginBottom: '20px',
            }}
          >
            <p
              style={{
                fontSize: '13px',
                fontWeight: 700,
                color: '#1a2b47',
                margin: 0,
              }}
            >
              {usuario.nombres} {usuario.apellidoPaterno}
            </p>
            <p
              style={{
                fontSize: '11px',
                color: '#718096',
                margin: '4px 0 0 0',
              }}
            >
              {usuario.correo}
            </p>
          </div>
        )}

        {/* Filtros */}
        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 25px 0' }}>
          {[
            { key: 'todas', label: 'Todas', count: items.length, icon: <FaHistory /> },
            { key: 'citas', label: 'Mis citas', count: totalCitas, icon: <FaCalendarAlt /> },
            { key: 'productos', label: 'Mis productos', count: totalProductos, icon: <FaBox /> },
          ].map((f) => (
            <li
              key={f.key}
              onClick={() => setFiltro(f.key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 12px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: filtro === f.key ? 700 : 500,
                color: filtro === f.key ? '#1a2b47' : '#718096',
                background: filtro === f.key ? '#f0f9fb' : 'transparent',
                marginBottom: '4px',
                transition: 'all 0.2s',
              }}
            >
              <span
                style={{
                  width: '20px',
                  color: filtro === f.key ? '#34b8c5' : '#a0aec0',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                {f.icon}
              </span>
              <span style={{ flex: 1 }}>{f.label}</span>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: filtro === f.key ? '#34b8c5' : '#a0aec0',
                  background: filtro === f.key ? 'white' : '#f0f9fb',
                  padding: '2px 8px',
                  borderRadius: '10px',
                }}
              >
                {f.count}
              </span>
            </li>
          ))}
        </ul>

        {/* WhatsApp */}
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

      {/* ============================================================ */}
      {/* CONTENIDO CENTRAL — CON SCROLL                                */}
      {/* ============================================================ */}
      <div
        style={{
          flex: 1,
          maxHeight: 'calc(100vh - 140px)',
          overflowY: 'auto',
          paddingRight: '5px',
        }}
      >
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
            fontSize: '24px',
            fontWeight: 800,
            color: '#1a2b47',
            marginBottom: '6px',
          }}
        >
          Mis citas y compras
        </h1>
        <p
          style={{
            fontSize: '13px',
            color: '#718096',
            marginBottom: '25px',
          }}
        >
          Historial completo de tus reservas y productos adquiridos.
        </p>

        {/* LISTA */}
        {cargando ? (
          <div
            style={{
              textAlign: 'center',
              padding: '60px',
              color: '#718096',
              background: 'white',
              borderRadius: '16px',
            }}
          >
            Cargando...
          </div>
        ) : itemsFiltrados.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '80px 20px',
              background: 'white',
              borderRadius: '16px',
              color: '#a0aec0',
            }}
          >
            <FaCalendarAlt
              size={50}
              style={{ marginBottom: '15px', opacity: 0.3 }}
            />
            <p style={{ fontSize: '14px', margin: 0 }}>
              No tienes{' '}
              {filtro === 'citas'
                ? 'citas'
                : filtro === 'productos'
                ? 'productos'
                : 'registros'}{' '}
              por el momento.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '15px',
            }}
          >
            {itemsFiltrados.map((item, i) => {
              const esCita = item.tipo === 'CITA';
              return (
                <div
                  key={`${item.tipo}-${item.idVenta}-${i}`}
                  style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '22px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                    borderLeft: esCita
                      ? '4px solid #34b8c5'
                      : '4px solid #ea580c',
                    transition: 'all 0.2s',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow =
                      '0 8px 20px rgba(0, 0, 0, 0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow =
                      '0 2px 8px rgba(0, 0, 0, 0.04)';
                  }}
                >
                  {/* HEADER */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '18px',
                      paddingBottom: '14px',
                      borderBottom: '1px dashed #e2e8f0',
                      flexWrap: 'wrap',
                      gap: '10px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                      }}
                    >
                      {/* Icono circular */}
                      <div
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '50%',
                          background: esCita ? '#f0f9fb' : '#fff7ed',
                          color: esCita ? '#34b8c5' : '#ea580c',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '18px',
                          flexShrink: 0,
                        }}
                      >
                        {esCita ? <FaCalendarAlt /> : <FaBox />}
                      </div>

                      <div>
                        <p
                          style={{
                            fontSize: '10px',
                            color: esCita ? '#34b8c5' : '#ea580c',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            margin: 0,
                          }}
                        >
                          {esCita ? 'Cita médica' : 'Producto'}
                        </p>
                        <p
                          style={{
                            fontSize: '16px',
                            fontWeight: 800,
                            color: '#1a2b47',
                            margin: '4px 0 0 0',
                          }}
                        >
                          {esCita ? item.especialidad : item.producto}
                        </p>
                        <p
                          style={{
                            fontSize: '11px',
                            color: '#a0aec0',
                            margin: '2px 0 0 0',
                            fontFamily: 'monospace',
                          }}
                        >
                          {item.serie && item.numDocumento !== '00000000'
                            ? `${item.serie}-${item.numDocumento}`
                            : `#${item.idVenta}`}
                        </p>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <p
                        style={{
                          fontSize: '10px',
                          color: '#a0aec0',
                          margin: 0,
                          textTransform: 'uppercase',
                          fontWeight: 600,
                        }}
                      >
                        Total
                      </p>
                      <p
                        style={{
                          fontSize: '22px',
                          fontWeight: 800,
                          color: '#1a3a5c',
                          margin: '2px 0 0 0',
                        }}
                      >
                        S/ {parseFloat(item.total || 0).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* DETALLE */}
                  {esCita ? (
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns:
                          'repeat(auto-fit, minmax(180px, 1fr))',
                        gap: '15px',
                      }}
                    >
                      <InfoItem
                        label="Especialista"
                        value={`Dr(a). ${item.nombres} ${item.apellidoPaterno} ${item.apellidoMaterno}`}
                        icon={<FaUserMd />}
                      />
                      <InfoItem
                        label="Sede"
                        value={item.sucursal}
                        icon={<FaMapMarkerAlt />}
                      />
                      <InfoItem
                        label="Fecha"
                        value={formatearFecha(item.fechaCreacion)}
                        icon={<FaCalendarAlt />}
                      />
                      <InfoItem
                        label="Hora"
                        value={formatearHora(item.horaInicio)}
                        icon={<FaClock />}
                      />
                    </div>
                  ) : (
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns:
                          'repeat(auto-fit, minmax(180px, 1fr))',
                        gap: '15px',
                      }}
                    >
                      <InfoItem
                        label="Cantidad"
                        value={item.cantidad}
                        icon={<FaBox />}
                      />
                      <InfoItem
                        label="Comprado el"
                        value={formatearFecha(item.fechaVenta)}
                        icon={<FaCalendarAlt />}
                      />
                      <InfoItem
                        label="Estado"
                        value="Confirmado"
                        icon={<FaCheckCircle />}
                        color="#16a34a"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* SIDEBAR DERECHO                                              */}
      {/* ============================================================ */}
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
          maxHeight: 'calc(100vh - 140px)',
          overflowY: 'auto',
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
          Resumen
        </h3>

        <div
          style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}
        >
          {/* Citas */}
          <div
            style={{
              background: '#f0f9fb',
              borderRadius: '12px',
              padding: '15px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '6px',
              }}
            >
              <FaCalendarAlt color="#34b8c5" size={14} />
              <p
                style={{
                  fontSize: '11px',
                  color: '#34b8c5',
                  margin: 0,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                Citas
              </p>
            </div>
            <p
              style={{
                fontSize: '24px',
                fontWeight: 800,
                color: '#1a3a5c',
                margin: '4px 0 0 0',
              }}
            >
              {totalCitas}
            </p>
          </div>

          {/* Productos */}
          <div
            style={{
              background: '#fff7ed',
              borderRadius: '12px',
              padding: '15px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '6px',
              }}
            >
              <FaBox color="#ea580c" size={14} />
              <p
                style={{
                  fontSize: '11px',
                  color: '#ea580c',
                  margin: 0,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                Productos
              </p>
            </div>
            <p
              style={{
                fontSize: '24px',
                fontWeight: 800,
                color: '#1a3a5c',
                margin: '4px 0 0 0',
              }}
            >
              {totalProductos}
            </p>
          </div>

          {/* Total gastado */}
          <div
            style={{
              background: 'linear-gradient(135deg, #1a3a5c 0%, #2d5a7a 100%)',
              color: 'white',
              borderRadius: '12px',
              padding: '18px',
              textAlign: 'center',
            }}
          >
            <p
              style={{
                fontSize: '10px',
                margin: 0,
                opacity: 0.9,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontWeight: 600,
              }}
            >
              Total gastado
            </p>
            <p
              style={{
                fontSize: '28px',
                fontWeight: 800,
                margin: '6px 0 0 0',
              }}
            >
              S/ {totalGastado.toFixed(2)}
            </p>
          </div>

          {/* Nueva reserva */}
          <button
            onClick={() => navigate('/S_per_familiar?tipo=1')}
            style={{
              background: 'white',
              color: '#34b8c5',
              border: '2px solid #34b8c5',
              padding: '12px',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            Reservar nueva cita <FaChevronRight size={11} />
          </button>
        </div>
      </aside>
    </div>
  );
};

// ============================================================
// SUB-COMPONENTE: InfoItem
// ============================================================
const InfoItem = ({ label, value, icon, color }) => (
  <div>
    <p
      style={{
        fontSize: '9px',
        color: '#a0aec0',
        margin: 0,
        textTransform: 'uppercase',
        fontWeight: 700,
        letterSpacing: '0.5px',
      }}
    >
      {label}
    </p>
    <p
      style={{
        fontSize: '13px',
        color: color || '#1a2b47',
        margin: '4px 0 0 0',
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
      }}
    >
      {icon && (
        <span style={{ color: color || '#34b8c5', fontSize: '11px' }}>
          {icon}
        </span>
      )}
      {value}
    </p>
  </div>
);

export default MisCitas;