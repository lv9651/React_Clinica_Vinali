import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  FaWhatsapp,
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaUserMd,
  FaStethoscope,
  FaCheckCircle,
  FaCopy,
} from 'react-icons/fa';

const Confirmacion = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    totalPagado,
    metodoPago,
    servicios = [],
    productos = [],
  } = location.state || {};

  // ============================================================
  // ARMAR LISTA DE CITAS (SOLO desde servicios)
  // ============================================================
  const citasConCodigo = servicios.map((s) => ({
    esActual: false,
    tipo: 'cita',
    codigoReserva: s.codigoUnico,
    especialidad: s.especialidad || s.descripcion,
    medico: s.medico,
    sucursal: s.sucursal,
    dia: s.dia,
    hora: s.hora,
    precio: parseFloat(s.precio || 0),
  }));

  // ============================================================
  // ARMAR LISTA DE PRODUCTOS CON CÓDIGO ÚNICO
  // ============================================================
  const productosConCodigo = useMemo(() => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return productos.map((p) => {
      let codigo = 'PRD-';
      for (let i = 0; i < 6; i++) {
        codigo += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return {
        esActual: false,
        tipo: 'producto',
        codigoReserva: codigo,
        descripcion: p.descripcion,
        cantidad: p.cantidad || 1,
        precio: parseFloat(p.precio || 0),
        subtotal: parseFloat(p.precio || 0) * (p.cantidad || 1),
        imagen: p.imagen,
      };
    });
  }, [productos]);

  // ============================================================
  // ⭐ CÁLCULO DE PUNTOS CLUB VINALI
  // ============================================================
  // Regla: 1 punto por cada S/ 1.00 gastado.
  // Cambia PUNTOS_POR_SOL según tu regla de negocio:
  //   - 1    → 1 punto por S/ 1
  //   - 0.1  → 1 punto por S/ 10
  //   - 0.5  → 1 punto por S/ 2
  const PUNTOS_POR_SOL = 1;

  const puntosGanados = useMemo(() => {
    const total = parseFloat(totalPagado || 0);
    if (!total || isNaN(total)) return 0;
    return Math.floor(total * PUNTOS_POR_SOL);
  }, [totalPagado]);

  const totalCitas = citasConCodigo.length;
  const totalProductos = productosConCodigo.length;
  const totalItems = totalCitas + totalProductos;

  const copiarCodigo = (codigo) => {
    navigator.clipboard.writeText(codigo);
    alert(`Código ${codigo} copiado`);
  };

  // ============================================================
  // PASOS DEL WIZARD
  // ============================================================
  const pasos = [
    { numero: 1, label: '¿Qué necesitas?', activo: true, completado: true },
    { numero: 2, label: 'Elige especialista', activo: true, completado: true },
    { numero: 3, label: 'Elige sede', activo: true, completado: true },
    { numero: 4, label: 'Fecha y hora', activo: true, completado: true },
    { numero: 5, label: 'Tus datos', activo: true, completado: true },
    { numero: 6, label: 'Confirmación', activo: true, completado: true },
  ];

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
      {/* SIDEBAR IZQUIERDO */}
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
                color: '#1a2b47',
                fontWeight: 600,
                fontSize: '13px',
              }}
            >
              <span
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: '#34b8c5',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                ✓
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
        {/* Éxito */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: '#dcfce7',
              color: '#16a34a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              fontSize: '40px',
            }}
          >
            <FaCheckCircle />
          </div>

          <h1
            style={{
              fontSize: '26px',
              fontWeight: 800,
              color: '#1a2b47',
              marginBottom: '10px',
            }}
          >
            {totalCitas > 0
              ? '¡Tus citas han sido reservadas con éxito!'
              : '¡Tu compra ha sido confirmada!'}
          </h1>

          <p
            style={{
              fontSize: '14px',
              color: '#718096',
              marginBottom: '25px',
            }}
          >
            Hemos enviado la confirmación a tu correo electrónico y por
            WhatsApp.
          </p>
        </div>

        {/* ============================================================ */}
        {/* CÓDIGOS DE RESERVA                                            */}
        {/* ============================================================ */}
        <div
          style={{
            background: 'white',
            borderRadius: '16px',
            padding: '25px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
            marginBottom: '20px',
          }}
        >
          <h3
            style={{
              fontSize: '15px',
              color: '#1a2b47',
              marginBottom: '6px',
              fontWeight: 700,
            }}
          >
            🎫 Códigos de reserva
          </h3>
          <p
            style={{
              fontSize: '11px',
              color: '#718096',
              marginBottom: '18px',
            }}
          >
            {totalCitas > 0 &&
              `${totalCitas} cita${totalCitas !== 1 ? 's' : ''}`}
            {totalCitas > 0 && totalProductos > 0 && ' + '}
            {totalProductos > 0 &&
              `${totalProductos} producto${
                totalProductos !== 1 ? 's' : ''
              }`}
          </p>

          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
          >
            {/* CITAS */}
            {citasConCodigo.map((cita, i) => (
              <div
                key={`cita-${i}`}
                style={{
                  background: '#f0f9fb',
                  color: '#1a2b47',
                  borderRadius: '12px',
                  padding: '18px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '12px',
                  border: '1px solid #cdeef3',
                }}
              >
                <div>
                  <p
                    style={{
                      fontSize: '10px',
                      margin: 0,
                      opacity: 0.9,
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      fontWeight: 600,
                      color: '#34b8c5',
                    }}
                  >
                    Cita {i + 1}
                  </p>
                  <p
                    style={{
                      fontSize: '18px',
                      fontWeight: 800,
                      margin: '4px 0 0 0',
                      letterSpacing: '0.5px',
                      fontFamily: 'monospace',
                      color: '#1a2b47',
                    }}
                  >
                    {cita.codigoReserva}
                  </p>
                  <p
                    style={{
                      fontSize: '11px',
                      margin: '4px 0 0 0',
                      color: '#718096',
                    }}
                  >
                    {cita.especialidad} — {cita.sucursal}
                  </p>
                </div>
                <button
                  onClick={() => copiarCodigo(cita.codigoReserva)}
                  style={{
                    background: '#e0f2f7',
                    border: 'none',
                    color: '#34b8c5',
                    borderRadius: '8px',
                    padding: '10px 12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '11px',
                    fontWeight: 600,
                    flexShrink: 0,
                  }}
                >
                  <FaCopy /> Copiar
                </button>
              </div>
            ))}

            {/* PRODUCTOS */}
            {productosConCodigo.map((prod, i) => (
              <div
                key={`prod-${i}`}
                style={{
                  background: '#fff7ed',
                  color: '#1a2b47',
                  borderRadius: '12px',
                  padding: '18px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '12px',
                  border: '1px solid #fed7aa',
                }}
              >
                <div>
                  <p
                    style={{
                      fontSize: '10px',
                      margin: 0,
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      fontWeight: 600,
                      color: '#ea580c',
                    }}
                  >
                    🛍️ Producto {i + 1}
                  </p>
                  <p
                    style={{
                      fontSize: '18px',
                      fontWeight: 800,
                      margin: '4px 0 0 0',
                      letterSpacing: '0.5px',
                      fontFamily: 'monospace',
                      color: '#1a2b47',
                    }}
                  >
                    {prod.codigoReserva}
                  </p>
                  <p
                    style={{
                      fontSize: '11px',
                      margin: '4px 0 0 0',
                      color: '#718096',
                    }}
                  >
                    {prod.descripcion} x {prod.cantidad}
                  </p>
                </div>
                <button
                  onClick={() => copiarCodigo(prod.codigoReserva)}
                  style={{
                    background: '#fff1e6',
                    border: 'none',
                    color: '#ea580c',
                    borderRadius: '8px',
                    padding: '10px 12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '11px',
                    fontWeight: 600,
                    flexShrink: 0,
                  }}
                >
                  <FaCopy /> Copiar
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ============================================================ */}
        {/* DETALLE                                                       */}
        {/* ============================================================ */}
        <div
          style={{
            background: 'white',
            borderRadius: '16px',
            padding: '25px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
            marginBottom: '20px',
          }}
        >
          <h3
            style={{
              fontSize: '15px',
              color: '#1a2b47',
              marginBottom: '18px',
              fontWeight: 700,
            }}
          >
            📋 Detalle de tu reserva ({totalItems})
          </h3>

          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}
          >
            {/* CITAS */}
            {citasConCodigo.map((cita, i) => (
              <div
                key={`det-cita-${i}`}
                style={{
                  background: '#f8fafc',
                  borderRadius: '12px',
                  padding: '18px',
                  border: '1px solid #e2e8f0',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '12px',
                    paddingBottom: '10px',
                    borderBottom: '1px dashed #cbd5e0',
                  }}
                >
                  <span
                    style={{
                      fontSize: '11px',
                      color: '#34b8c5',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Cita {i + 1}
                  </span>
                  <span
                    style={{
                      fontSize: '10px',
                      color: '#34b8c5',
                      fontFamily: 'monospace',
                      fontWeight: 600,
                    }}
                  >
                    {cita.codigoReserva}
                  </span>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '10px',
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontSize: '9px',
                        color: '#a0aec0',
                        margin: 0,
                        textTransform: 'uppercase',
                        fontWeight: 700,
                      }}
                    >
                      Especialidad
                    </p>
                    <p
                      style={{
                        fontSize: '12px',
                        color: '#1a2b47',
                        margin: '2px 0 0 0',
                        fontWeight: 600,
                      }}
                    >
                      {cita.especialidad}
                    </p>
                  </div>

                  <div>
                    <p
                      style={{
                        fontSize: '9px',
                        color: '#a0aec0',
                        margin: 0,
                        textTransform: 'uppercase',
                        fontWeight: 700,
                      }}
                    >
                      Sede
                    </p>
                    <p
                      style={{
                        fontSize: '12px',
                        color: '#1a2b47',
                        margin: '2px 0 0 0',
                        fontWeight: 600,
                      }}
                    >
                      {cita.sucursal}
                    </p>
                  </div>

                  <div style={{ gridColumn: '1 / -1' }}>
                    <p
                      style={{
                        fontSize: '9px',
                        color: '#a0aec0',
                        margin: 0,
                        textTransform: 'uppercase',
                        fontWeight: 700,
                      }}
                    >
                      Especialista
                    </p>
                    <p
                      style={{
                        fontSize: '12px',
                        color: '#1a2b47',
                        margin: '2px 0 0 0',
                        fontWeight: 600,
                      }}
                    >
                      Dr(a). {cita.medico?.nombres}{' '}
                      {cita.medico?.apellidopaterno}{' '}
                      {cita.medico?.apellidomaterno}
                    </p>
                  </div>

                  <div>
                    <p
                      style={{
                        fontSize: '9px',
                        color: '#a0aec0',
                        margin: 0,
                        textTransform: 'uppercase',
                        fontWeight: 700,
                      }}
                    >
                      📅 Fecha
                    </p>
                    <p
                      style={{
                        fontSize: '12px',
                        color: '#1a2b47',
                        margin: '2px 0 0 0',
                        fontWeight: 600,
                      }}
                    >
                      {cita.dia}
                    </p>
                  </div>

                  <div>
                    <p
                      style={{
                        fontSize: '9px',
                        color: '#a0aec0',
                        margin: 0,
                        textTransform: 'uppercase',
                        fontWeight: 700,
                      }}
                    >
                      🕐 Hora
                    </p>
                    <p
                      style={{
                        fontSize: '12px',
                        color: '#1a2b47',
                        margin: '2px 0 0 0',
                        fontWeight: 600,
                      }}
                    >
                      {cita.hora}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* PRODUCTOS */}
            {productosConCodigo.map((prod, i) => (
              <div
                key={`det-prod-${i}`}
                style={{
                  background: '#fff7ed',
                  borderRadius: '12px',
                  padding: '18px',
                  border: '1px solid #fed7aa',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '12px',
                    paddingBottom: '10px',
                    borderBottom: '1px dashed #fed7aa',
                  }}
                >
                  <span
                    style={{
                      fontSize: '11px',
                      color: '#ea580c',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    🛍️ Producto {i + 1}
                  </span>
                  <span
                    style={{
                      fontSize: '10px',
                      color: '#ea580c',
                      fontFamily: 'monospace',
                      fontWeight: 600,
                    }}
                  >
                    {prod.codigoReserva}
                  </span>
                </div>

                <p
                  style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    color: '#1a2b47',
                    margin: 0,
                  }}
                >
                  {prod.descripcion}
                </p>
                <p
                  style={{
                    fontSize: '12px',
                    color: '#718096',
                    margin: '5px 0 0 0',
                  }}
                >
                  {prod.cantidad} x S/ {prod.precio.toFixed(2)} = S/{' '}
                  {prod.subtotal.toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          {totalCitas > 0 && (
            <p
              style={{
                fontSize: '12px',
                color: '#718096',
                margin: '18px 0 0 0',
                paddingTop: '15px',
                borderTop: '1px solid #e2e8f0',
              }}
            >
              Llega 15 minutos antes de cada cita para brindarte una mejor
              atención.
            </p>
          )}
        </div>

        {/* ============================================================ */}
        {/* TOTAL PAGADO                                                  */}
        {/* ============================================================ */}
        <div
          style={{
            background: 'white',
            borderRadius: '16px',
            padding: '25px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
            marginBottom: '20px',
          }}
        >
          <h3
            style={{
              fontSize: '15px',
              color: '#1a2b47',
              marginBottom: '15px',
              fontWeight: 700,
            }}
          >
            Total pagado
          </h3>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <p
                style={{
                  fontSize: '28px',
                  color: '#1a3a5c',
                  margin: 0,
                  fontWeight: 800,
                }}
              >
                S/ {totalPagado}
              </p>
              <p
                style={{
                  fontSize: '12px',
                  color: '#718096',
                  margin: '5px 0 0 0',
                }}
              >
                Método de pago: {metodoPago}
              </p>
            </div>
            <div
              style={{
                background: '#dcfce7',
                color: '#16a34a',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 700,
              }}
            >
              Pago aprobado ✓
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* QUÉ SIGUE                                                     */}
        {/* ============================================================ */}
        {totalCitas > 0 && (
          <div
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: '25px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
              marginBottom: '20px',
            }}
          >
            <h3
              style={{
                fontSize: '15px',
                color: '#1a2b47',
                marginBottom: '18px',
                fontWeight: 700,
              }}
            >
              ¿Qué sigue?
            </h3>

            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}
            >
              <div style={{ display: 'flex', gap: '12px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: '#f0f9fb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#34b8c5',
                    flexShrink: 0,
                  }}
                >
                  <FaCalendarAlt />
                </div>
                <div>
                  <p
                    style={{
                      fontSize: '13px',
                      color: '#1a2b47',
                      margin: 0,
                      fontWeight: 600,
                    }}
                  >
                    Te esperamos
                  </p>
                  <p
                    style={{
                      fontSize: '12px',
                      color: '#718096',
                      margin: '3px 0 0 0',
                    }}
                  >
                    Llega 15 minutos antes de cada cita.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: '#f0f9fb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#34b8c5',
                    flexShrink: 0,
                  }}
                >
                  <FaStethoscope />
                </div>
                <div>
                  <p
                    style={{
                      fontSize: '13px',
                      color: '#1a2b47',
                      margin: 0,
                      fontWeight: 600,
                    }}
                  >
                    Prepara tu consulta
                  </p>
                  <p
                    style={{
                      fontSize: '12px',
                      color: '#718096',
                      margin: '3px 0 0 0',
                    }}
                  >
                    Si tienes exámenes o fotos, tráelos contigo el día de tu
                    cita.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: '#f0f9fb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#34b8c5',
                    flexShrink: 0,
                  }}
                >
                  <FaUserMd />
                </div>
                <div>
                  <p
                    style={{
                      fontSize: '13px',
                      color: '#1a2b47',
                      margin: 0,
                      fontWeight: 600,
                    }}
                  >
                    Reagenda fácil
                  </p>
                  <p
                    style={{
                      fontSize: '12px',
                      color: '#718096',
                      margin: '3px 0 0 0',
                    }}
                  >
                    Si necesitas cambiar alguna cita, puedes hacerlo desde
                    "Mis citas".
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* CLUB VINALI                                                   */}
        {/* ============================================================ */}
        <div
          style={{
            background: 'linear-gradient(135deg, #1a3a5c 0%, #2d5a7a 100%)',
            color: 'white',
            borderRadius: '16px',
            padding: '25px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
          }}
        >
          <h3
            style={{
              fontSize: '15px',
              color: 'white',
              marginBottom: '12px',
              fontWeight: 700,
            }}
          >
            Acumula puntos con Club Vinali
          </h3>

          {puntosGanados > 0 ? (
            <p style={{ fontSize: '13px', margin: '0 0 15px 0', opacity: 0.9 }}>
              Ya sumaste <strong>{puntosGanados} puntos</strong> por tus
              reservas.
            </p>
          ) : (
            <p style={{ fontSize: '13px', margin: '0 0 15px 0', opacity: 0.9 }}>
              Realiza tu primera compra para empezar a acumular puntos.
            </p>
          )}

          <button
            style={{
              background: 'white',
              color: '#1a3a5c',
              border: 'none',
              padding: '12px 25px',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            Conoce tus beneficios
          </button>
        </div>
      </div>

      {/* SIDEBAR DERECHO */}
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
          Tu reserva ({totalItems})
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* CITAS */}
          {citasConCodigo.map((cita, i) => (
            <div
              key={`side-cita-${i}`}
              style={{
                borderLeft: '3px solid #34b8c5',
                paddingLeft: '12px',
              }}
            >
              <p
                style={{
                  fontSize: '10px',
                  color: '#34b8c5',
                  margin: 0,
                  textTransform: 'uppercase',
                  fontWeight: 700,
                }}
              >
                Cita {i + 1}
              </p>
              <p
                style={{
                  fontSize: '13px',
                  color: '#1a2b47',
                  margin: '4px 0 0 0',
                  fontWeight: 600,
                }}
              >
                {cita.especialidad}
              </p>
              <p
                style={{
                  fontSize: '11px',
                  color: '#718096',
                  margin: '2px 0 0 0',
                }}
              >
                Dr(a). {cita.medico?.nombres}{' '}
                {cita.medico?.apellidopaterno}
              </p>
              <p
                style={{
                  fontSize: '11px',
                  color: '#718096',
                  margin: '2px 0 0 0',
                }}
              >
                📍 {cita.sucursal}
              </p>
              <p
                style={{
                  fontSize: '11px',
                  color: '#718096',
                  margin: '2px 0 0 0',
                }}
              >
                📅 {cita.dia}, {cita.hora}
              </p>
              <p
                style={{
                  fontSize: '10px',
                  color: '#34b8c5',
                  margin: '4px 0 0 0',
                  fontFamily: 'monospace',
                  fontWeight: 600,
                }}
              >
                {cita.codigoReserva}
              </p>
            </div>
          ))}

          {/* PRODUCTOS */}
          {productosConCodigo.map((prod, i) => (
            <div
              key={`side-prod-${i}`}
              style={{
                borderLeft: '3px solid #ea580c',
                paddingLeft: '12px',
              }}
            >
              <p
                style={{
                  fontSize: '10px',
                  color: '#ea580c',
                  margin: 0,
                  textTransform: 'uppercase',
                  fontWeight: 700,
                }}
              >
                🛍️ Producto {i + 1}
              </p>
              <p
                style={{
                  fontSize: '13px',
                  color: '#1a2b47',
                  margin: '4px 0 0 0',
                  fontWeight: 600,
                }}
              >
                {prod.descripcion}
              </p>
              <p
                style={{
                  fontSize: '11px',
                  color: '#718096',
                  margin: '2px 0 0 0',
                }}
              >
                {prod.cantidad} x S/ {prod.precio.toFixed(2)}
              </p>
              <p
                style={{
                  fontSize: '10px',
                  color: '#ea580c',
                  margin: '4px 0 0 0',
                  fontFamily: 'monospace',
                  fontWeight: 600,
                }}
              >
                {prod.codigoReserva}
              </p>
            </div>
          ))}

          <div
            style={{
              background: '#dcfce7',
              borderRadius: '10px',
              padding: '15px',
              marginTop: '10px',
              textAlign: 'center',
            }}
          >
            <p
              style={{
                fontSize: '11px',
                color: '#16a34a',
                margin: 0,
                fontWeight: 700,
              }}
            >
              ✓{' '}
              {totalCitas > 0 &&
                `${totalCitas} cita${totalCitas !== 1 ? 's' : ''}`}
              {totalCitas > 0 && totalProductos > 0 && ' + '}
              {totalProductos > 0 &&
                `${totalProductos} producto${
                  totalProductos !== 1 ? 's' : ''
                }`}{' '}
              confirmado{totalItems > 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Confirmacion;