import React, { useContext, useEffect, useState, useRef } from "react";
import { UsuarioContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../Medico/config";
import { FaUserMd, FaSpa, FaCut, FaFlask } from "react-icons/fa";

const Bienvenida = () => {
  const { usuario } = useContext(UsuarioContext);
  const navigate = useNavigate();
  const carouselRef = useRef(null);

  const [banner, setBanner] = useState(null);
  const [sedes, setSedes] = useState([]);
  const [tratamientos, setTratamientos] = useState([]);
  const [productos, setProductos] = useState([]);
  const [testimonios, setTestimonios] = useState([]);
  const [promociones, setPromociones] = useState([]);
  const [consultas, setConsultas] = useState([]);

  // ============================================================
  // 🛍️ AGREGAR PRODUCTO AL CARRITO
  // ============================================================
  const handleAgregarProducto = (producto) => {
    if (!usuario?.usuarioID) {
      alert('Inicia sesión para agregar productos al carrito.');
      navigate('/');
      return;
    }

    if (!producto.extra2) {
      alert('Este producto no está configurado correctamente.');
      return;
    }

    const idUsuario = usuario.usuarioID;
    const key = `carritoProductos_${idUsuario}`;
    const existentes = JSON.parse(localStorage.getItem(key) || '[]');

    const nuevoProducto = {
      idContenido: producto.idContenido,
      idProducto: parseInt(producto.extra2),
      idListaPrecio: parseInt(producto.extra3 || 1),
      descripcion: producto.titulo,
      precio: parseFloat(producto.precio || 0),
      imagen: producto.imagen,
      cantidad: 1,
    };

    const yaExiste = existentes.find(
      (p) => p.idProducto === nuevoProducto.idProducto
    );

    const actualizados = yaExiste
      ? existentes.map((p) =>
          p.idProducto === nuevoProducto.idProducto
            ? { ...p, cantidad: p.cantidad + 1 }
            : p
        )
      : [...existentes, nuevoProducto];

    localStorage.setItem(key, JSON.stringify(actualizados));
    window.dispatchEvent(new Event('carritoActualizado'));

    navigate('/eleccion');
  };

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [resSedes, resTrat, resProd, resTest, resBanner, resPromo, resCons] = await Promise.all([
          axios.get(`${BASE_URL}/api/CMS/contenido?tipo=sede`).catch(() => ({ data: [] })),
          axios.get(`${BASE_URL}/api/CMS/contenido?tipo=tratamiento`).catch(() => ({ data: [] })),
          axios.get(`${BASE_URL}/api/CMS/contenido?tipo=producto`).catch(() => ({ data: [] })),
          axios.get(`${BASE_URL}/api/CMS/contenido?tipo=testimonio`).catch(() => ({ data: [] })),
          axios.get(`${BASE_URL}/api/CMS/contenido?tipo=banner`).catch(() => ({ data: [] })),
          axios.get(`${BASE_URL}/api/CMS/contenido?tipo=promocion`).catch(() => ({ data: [] })),
          axios.get(`${BASE_URL}/api/CMS/contenido?tipo=consulta`).catch(() => ({ data: [] })),
        ]);

        setSedes(resSedes.data);
        setTratamientos(resTrat.data);
        setProductos(resProd.data);
        setTestimonios(resTest.data);
        if (resBanner.data.length > 0) setBanner(resBanner.data[0]);
        setPromociones(resPromo.data);
        setConsultas(resCons.data);
      } catch (error) {
        console.error("Error al cargar datos del Home:", error);
      }
    };

    cargarDatos();
  }, []);

  const scrollIzquierda = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollDerecha = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <div style={{
      fontFamily: "'Poppins', 'Segoe UI', sans-serif",
      color: '#2d3748',
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '20px'
    }}>

      {/* ============================================================ */}
      {/* FILA 1: HERO + SEDES + TESTIMONIO                             */}
      {/* ============================================================ */}
      <section style={{
        display: 'flex',
        gap: '30px',
        marginBottom: '20px',
        alignItems: 'stretch'
      }}>

        {/* HERO (55%) */}
        {banner ? (
          <div style={{
            flex: '0 0 55%',
            position: 'relative',
            borderRadius: '25px',
            overflow: 'hidden',
            minHeight: '500px',
            background: 'linear-gradient(135deg, #f0f9fb 0%, #e0f2f5 100%)'
          }}>
            {banner.imagen && (
              <img
                src={banner.imagen}
                alt="Hero"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center right',
                  zIndex: 0
                }}
              />
            )}

            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'linear-gradient(to right, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.75) 55%, rgba(255,255,255,0.1) 100%)',
              zIndex: 1
            }}></div>

            <div style={{
              position: 'relative',
              zIndex: 2,
              padding: '40px',
              maxWidth: '420px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              minHeight: '500px'
            }}>
              {banner.subtitulo && (
                <p style={{
                  color: '#718096',
                  fontSize: '12px',
                  letterSpacing: '2px',
                  fontWeight: 600,
                  marginBottom: '15px'
                }}>{banner.subtitulo}</p>
              )}

              <h1 style={{
                fontSize: '32px',
                fontWeight: 800,
                lineHeight: 1.15,
                color: '#1a3a5c',
                marginBottom: '15px'
              }}>{banner.titulo}</h1>

              {banner.descripcion && (
                <p style={{
                  fontSize: '13px',
                  color: '#4a5568',
                  lineHeight: 1.6,
                  marginBottom: '20px'
                }}>{banner.descripcion}</p>
              )}

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {banner.extra1 && (
                  <button
                    style={{
                      background: '#1a3a5c',
                      color: 'white',
                      padding: '11px 22px',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: 600,
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                    onClick={() => navigate(banner.enlace || '/ReservarCita')}
                  >
                    {banner.extra1}
                  </button>
                )}

                {banner.extra2 && (
                  <button
                    style={{
                      background: 'white',
                      color: '#1a3a5c',
                      padding: '11px 22px',
                      border: '2px solid #1a3a5c',
                      borderRadius: '8px',
                      fontWeight: 600,
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                    onClick={() => navigate(banner.extra3 || '/tratamientos')}
                  >
                    {banner.extra2}
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div style={{
            flex: '0 0 55%',
            background: '#f0f9fb',
            borderRadius: '25px',
            padding: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '500px',
            color: '#999'
          }}>
            Cargando banner...
          </div>
        )}

        {/* COLUMNA DERECHA (45%): SEDES + TESTIMONIO */}
        <div style={{
          flex: '0 0 45%',
          display: 'flex',
          flexDirection: 'column',
          gap: '15px'
        }}>

          {/* SEDES */}
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '15px'
            }}>
              <h2 style={{
                fontSize: '20px',
                fontWeight: 700,
                color: '#1a2b47',
                margin: 0
              }}>Sedes cerca de ti</h2>
              <a href="/sedes" style={{
                color: '#1a2b47',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '13px'
              }}>Ver todas →</a>
            </div>

            <div style={{ position: 'relative' }}>

              {sedes.length > 3 && (
                <button
                  onClick={scrollIzquierda}
                  style={{
                    position: 'absolute',
                    left: '-15px',
                    top: '45%',
                    transform: 'translateY(-50%)',
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '16px',
                    color: '#1a2b47',
                    zIndex: 10
                  }}
                >‹</button>
              )}

              <div
                ref={carouselRef}
                style={{
                  display: 'flex',
                  gap: '12px',
                  overflowX: 'auto',
                  scrollBehavior: 'smooth',
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                  width: '100%'
                }}
              >
                {sedes.length > 0 ? (
                  sedes.slice(0, 3).map((sede) => (
                    <div
                      key={sede.idContenido}
                      style={{
                        flex: '0 0 calc(33.333% - 8px)',
                        background: '#ffffff',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                        cursor: 'pointer',
                        transition: 'transform 0.3s',
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      {sede.imagen ? (
                        <img
                          src={sede.imagen}
                          alt={sede.titulo}
                          style={{
                            width: '100%',
                            height: '130px',
                            objectFit: 'contain',
                            background: '#f0f9fb',
                            display: 'block'
                          }}
                        />
                      ) : (
                        <div style={{
                          width: '100%',
                          height: '130px',
                          background: '#e8eef5',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#a0aec0',
                          fontSize: '11px'
                        }}>Sin imagen</div>
                      )}
                      <p style={{
                        padding: '10px',
                        fontWeight: 600,
                        textAlign: 'center',
                        color: '#1a2b47',
                        fontSize: '12px',
                        margin: 0,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>{sede.titulo}</p>
                    </div>
                  ))
                ) : (
                  <p style={{ color: '#999', fontStyle: 'italic', padding: '20px' }}>
                    No hay sedes disponibles.
                  </p>
                )}
              </div>

              {sedes.length > 3 && (
                <button
                  onClick={scrollDerecha}
                  style={{
                    position: 'absolute',
                    right: '-15px',
                    top: '45%',
                    transform: 'translateY(-50%)',
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '16px',
                    color: '#1a2b47',
                    zIndex: 10
                  }}
                >›</button>
              )}
            </div>
          </div>

          {/* TESTIMONIO */}
          {testimonios.length > 0 && (
            <div style={{
              display: 'flex',
              background: '#f0f9fb',
              borderRadius: '20px',
              overflow: 'hidden',
              flex: 1
            }}>
              <div style={{
                flex: '1 1 60%',
                padding: '25px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                <p style={{
                  fontSize: '14px',
                  fontStyle: 'italic',
                  color: '#2d3748',
                  marginBottom: '15px',
                  lineHeight: 1.6
                }}>"{testimonios[0].descripcion}"</p>
                <div style={{
                  color: '#34b8c5',
                  fontSize: '16px',
                  marginBottom: '10px'
                }}>{'★'.repeat(parseInt(testimonios[0].extra1) || 5)}</div>
                <p style={{ fontSize: '14px', color: '#1a3a5c', margin: 0 }}>
                  <strong>{testimonios[0].titulo}</strong>
                </p>
                <p style={{ fontSize: '12px', color: '#718096', margin: '3px 0 0' }}>
                  Paciente Vinali
                </p>
              </div>
              <div style={{
                flex: '0 0 40%',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <img
                  src={testimonios[0].imagen || '/assets/testimonio-default.jpg'}
                  alt="Paciente"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center'
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ============================================================ */}
      {/* FILA 2: PROMOCIÓN                                             */}
      {/* ============================================================ */}
      {promociones.length > 0 && (
        <section style={{
          position: 'relative',
          borderRadius: '25px',
          overflow: 'hidden',
          marginBottom: '50px',
          minHeight: '280px',
          background: 'linear-gradient(135deg, #b8e6ec 0%, #7dd3db 100%)'
        }}>
          {promociones[0].imagen && (
            <img
              src={promociones[0].imagen}
              alt={promociones[0].titulo}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
                zIndex: 0
              }}
            />
          )}

          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(to right, rgba(26, 58, 92, 0.85) 0%, rgba(26, 58, 92, 0.5) 50%, rgba(26, 58, 92, 0.1) 100%)',
            zIndex: 1
          }}></div>

          <div style={{
            position: 'relative',
            zIndex: 2,
            padding: '40px',
            maxWidth: '500px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            minHeight: '280px'
          }}>
            <h2 style={{
              fontSize: '28px',
              fontWeight: 800,
              color: 'white',
              marginBottom: '15px',
              lineHeight: 1.2
            }}>{promociones[0].titulo}</h2>

            <p style={{
              fontSize: '14px',
              color: 'white',
              lineHeight: 1.6,
              marginBottom: '22px',
              opacity: 0.95
            }}>{promociones[0].descripcion}</p>

            <button
              onClick={() => navigate(promociones[0].enlace || '/cuestionario')}
              style={{
                background: 'white',
                color: '#1a3a5c',
                padding: '13px 30px',
                border: 'none',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '14px',
                cursor: 'pointer',
                letterSpacing: '0.5px',
                alignSelf: 'flex-start'
              }}
            >
              {promociones[0].extra1 || 'COMENZAR AHORA'}
            </button>
          </div>
        </section>
      )}

      {/* ============================================================ */}
      {/* FILA 3: CONSULTAS (4 tarjetas con íconos)                     */}
      {/* ============================================================ */}
      {consultas.length > 0 && (
        <section style={{ marginBottom: '50px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '20px'
          }}>
            {consultas.slice(0, 4).map((consulta) => (
              <div
                key={consulta.idContenido}
                onClick={() => navigate(consulta.enlace || '/ReservarCita')}
                style={{
                  background: 'white',
                  borderRadius: '15px',
                  padding: '25px',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                  cursor: 'pointer',
                  transition: 'transform 0.3s',
                  textAlign: 'center'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{
                  fontSize: '40px',
                  marginBottom: '15px',
                  color: '#1a3a5c',
                  display: 'flex',
                  justifyContent: 'center'
                }}>
                  {consulta.titulo?.includes('Dermatológica') ? (
                    <FaUserMd size={45} />
                  ) : consulta.titulo?.includes('Faciales') ? (
                    <FaSpa size={45} />
                  ) : consulta.titulo?.includes('capilar') ? (
                    <FaCut size={45} />
                  ) : consulta.titulo?.includes('Productos') ? (
                    <FaFlask size={45} />
                  ) : (
                    <FaUserMd size={45} />
                  )}
                </div>
                <h4 style={{
                  fontSize: '15px',
                  color: '#1a2b47',
                  marginBottom: '10px',
                  fontWeight: 700
                }}>{consulta.titulo}</h4>
                <p style={{
                  fontSize: '12px',
                  color: '#718096',
                  lineHeight: 1.5,
                  margin: 0
                }}>{consulta.descripcion}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ============================================================ */}
      {/* FILA 4: CLUB VINALI                                           */}
      {/* ============================================================ */}
      <section style={{ marginBottom: '50px' }}>
        <div style={{
          display: 'flex',
          gap: '30px',
          alignItems: 'stretch'
        }}>
          <div style={{
            flex: '1 1 50%',
            padding: '40px',
            background: '#f0f9fb',
            borderRadius: '20px'
          }}>
            <h3 style={{
              fontSize: '28px',
              color: '#1a3a5c',
              marginBottom: '15px',
              lineHeight: 1.3
            }}>
              Únete a <br /><span style={{ color: '#34b8c5' }}>Club Vinali</span>
            </h3>
            <p style={{
              color: '#4a5568',
              marginBottom: '25px',
              lineHeight: 1.6,
              fontSize: '14px'
            }}>
              Acumula puntos, accede a beneficios exclusivos y recibe sorpresas pensadas para ti.
            </p>
            <button
              style={{
                background: '#1a3a5c',
                color: 'white',
                padding: '12px 28px',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '14px',
                cursor: 'pointer'
              }}
              onClick={() => navigate('/club')}
            >
              CONOCER CLUB
            </button>
          </div>

          <div style={{
            flex: '1 1 50%',
            background: 'linear-gradient(135deg, #1a3a5c 0%, #2d5a7a 100%)',
            color: 'white',
            padding: '40px',
            borderRadius: '20px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <div style={{ fontSize: '56px', fontWeight: 800, lineHeight: 1 }}>1,280</div>
            <p style={{ fontSize: '14px', opacity: 0.8, margin: '8px 0' }}>Puntos</p>
            <p style={{ fontSize: '15px', margin: '10px 0' }}>
              Nivel <strong>Vitalidad</strong>
            </p>
            <p style={{ fontSize: '12px', opacity: 0.7, margin: '10px 0' }}>
              Te faltan 220 puntos para subir a Armonía
            </p>
            <div style={{
              background: 'rgba(255,255,255,0.2)',
              height: '8px',
              borderRadius: '4px',
              marginTop: '15px',
              overflow: 'hidden'
            }}>
              <div style={{
                background: '#34b8c5',
                height: '100%',
                width: '85%',
                borderRadius: '4px'
              }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* FILA 5: PRODUCTOS DESTACADOS                                  */}
      {/* ============================================================ */}
      <section style={{ marginBottom: '60px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '25px'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 700,
            color: '#1a2b47',
            margin: 0
          }}>Productos destacados</h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '20px'
        }}>
          {productos.length > 0 ? (
            productos.slice(0, 4).map((producto) => (
              <div
                key={producto.idContenido}
                style={{
                  background: 'white',
                  borderRadius: '15px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                  padding: '20px',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <div style={{
                  width: '100%',
                  height: '150px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '15px'
                }}>
                  <img
                    src={producto.imagen || '/assets/producto-default.jpg'}
                    alt={producto.titulo}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain'
                    }}
                  />
                </div>
                <h4 style={{
                  fontSize: '14px',
                  color: '#1a3a5c',
                  marginBottom: '5px'
                }}>{producto.titulo}</h4>
                <p style={{
                  fontSize: '12px',
                  color: '#718096',
                  marginBottom: '5px'
                }}>{producto.extra1}</p>
                <p style={{
                  fontSize: '16px',
                  color: '#1a3a5c',
                  fontWeight: 700,
                  marginBottom: '15px'
                }}>
                  S/ {parseFloat(producto.precio || 0).toFixed(2)}
                </p>
                <button
                  onClick={() => handleAgregarProducto(producto)}
                  style={{
                    background: '#1a3a5c',
                    color: 'white',
                    padding: '9px 20px',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: 600,
                    fontSize: '12px',
                    cursor: 'pointer',
                    width: '100%',
                    marginTop: 'auto'
                  }}
                >
                  AGREGAR
                </button>
              </div>
            ))
          ) : (
            <p style={{ color: '#999', fontStyle: 'italic' }}>
              No hay productos disponibles por el momento.
            </p>
          )}
        </div>
      </section>

      {/* ============================================================ */}
      {/* FILA 6: ¿POR QUÉ ELEGIR VINALI?                               */}
      {/* ============================================================ */}
      <section style={{ marginBottom: '60px', textAlign: 'center' }}>
        <h2 style={{
          fontSize: '26px',
          color: '#1a3a5c',
          marginBottom: '40px'
        }}>¿Por qué elegir Vinali?</h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '25px'
        }}>
          <div>
            <div style={{ fontSize: '42px', marginBottom: '15px' }}>👨‍⚕️</div>
            <h4 style={{ fontSize: '14px', color: '#1a3a5c', marginBottom: '8px' }}>
              Especialistas Certificados
            </h4>
            <p style={{ fontSize: '12px', color: '#718096', lineHeight: 1.5 }}>
              Profesionales en constante capacitación.
            </p>
          </div>
          <div>
            <div style={{ fontSize: '42px', marginBottom: '15px' }}>🌟</div>
            <h4 style={{ fontSize: '14px', color: '#1a3a5c', marginBottom: '8px' }}>
              Enfoque integral
            </h4>
            <p style={{ fontSize: '12px', color: '#718096', lineHeight: 1.5 }}>
              Cuidado de piel, cabello y bienestar en un solo lugar.
            </p>
          </div>
          <div>
            <div style={{ fontSize: '42px', marginBottom: '15px' }}>🔬</div>
            <h4 style={{ fontSize: '14px', color: '#1a3a5c', marginBottom: '8px' }}>
              Tecnología Avanzada
            </h4>
            <p style={{ fontSize: '12px', color: '#718096', lineHeight: 1.5 }}>
              Equipos de última generación.
            </p>
          </div>
          <div>
            <div style={{ fontSize: '42px', marginBottom: '15px' }}>🤝</div>
            <h4 style={{ fontSize: '14px', color: '#1a3a5c', marginBottom: '8px' }}>
              Acompañamiento Personalizado
            </h4>
            <p style={{ fontSize: '12px', color: '#718096', lineHeight: 1.5 }}>
              Te acompañamos en cada paso de tu camino.
            </p>
          </div>
          <div>
            <div style={{ fontSize: '42px', marginBottom: '15px' }}>✨</div>
            <h4 style={{ fontSize: '14px', color: '#1a3a5c', marginBottom: '8px' }}>
              Resultados visibles
            </h4>
            <p style={{ fontSize: '12px', color: '#718096', lineHeight: 1.5 }}>
              Planes diseñados para ti y tus objetivos.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* FILA 7: TRATAMIENTOS DESTACADOS                               */}
      {/* ============================================================ */}
      <section style={{ marginBottom: '60px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '25px'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 700,
            color: '#1a2b47',
            margin: 0
          }}>Tratamientos destacados</h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '20px'
        }}>
          {tratamientos.length > 0 ? (
            tratamientos.slice(0, 4).map((tratamiento) => (
              <div
                key={tratamiento.idContenido}
                style={{
                  background: 'white',
                  borderRadius: '15px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                  padding: '18px',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <div style={{
                  width: '100%',
                  height: '160px',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  marginBottom: '15px',
                  background: '#f0f9fb'
                }}>
                  <img
                    src={tratamiento.imagen || '/assets/tratamiento-default.jpg'}
                    alt={tratamiento.titulo}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      objectPosition: 'center'
                    }}
                  />
                </div>
                <h4 style={{
                  fontSize: '15px',
                  color: '#1a3a5c',
                  marginBottom: '8px'
                }}>{tratamiento.titulo}</h4>
                <p style={{
                  fontSize: '12px',
                  color: '#718096',
                  lineHeight: 1.5,
                  marginBottom: '10px',
                  flex: 1
                }}>{tratamiento.descripcion}</p>
                <p style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  color: '#1a3a5c',
                  marginBottom: '12px'
                }}>S/ {tratamiento.precio}</p>
                <button
                  onClick={() => navigate('/ReservarCita')}
                  style={{
                    background: '#1a3a5c',
                    color: 'white',
                    padding: '9px 18px',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: 600,
                    fontSize: '12px',
                    cursor: 'pointer',
                    width: '100%',
                    marginTop: 'auto'
                  }}
                >
                  Reservar cita →
                </button>
              </div>
            ))
          ) : (
            <p style={{ color: '#999', fontStyle: 'italic' }}>
              No hay tratamientos disponibles por el momento.
            </p>
          )}
        </div>
      </section>

      {/* ============================================================ */}
      {/* FILA 8: RESERVA SEGURA                                        */}
      {/* ============================================================ */}
      <section style={{ paddingBottom: '40px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '25px',
          background: '#f0f9fb',
          padding: '30px 40px',
          borderRadius: '20px'
        }}>
          <div style={{ fontSize: '50px' }}>🛡️</div>
          <div>
            <h3 style={{
              fontSize: '20px',
              color: '#1a3a5c',
              marginBottom: '8px'
            }}>Reserva segura y confiable</h3>
            <p style={{
              fontSize: '14px',
              color: '#4a5568',
              margin: 0
            }}>
              Tus datos están protegidos. Pagos 100% seguros y atención de calidad garantizada.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Bienvenida;