import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../CSS/Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [nombre, setNombre] = useState('');
  const [rol, setRol] = useState('');

  useEffect(() => {
    const nombreGuardado = localStorage.getItem('adminNombre');
    const rolGuardado = localStorage.getItem('adminRol');

    if (!nombreGuardado) {
      navigate('/admin/login');
      return;
    }

    setNombre(nombreGuardado);
    setRol(
      rolGuardado === '1' ? 'Administrador' :
      rolGuardado === '2' ? 'Editor' : 'Operador'
    );
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminRol');
    localStorage.removeItem('adminNombre');
    localStorage.removeItem('adminUsername');
    navigate('/');
  };

  // ============================================================
  // MENÚ LATERAL
  // ============================================================
  const menuItems = [
    { path: '/Res_cita/dashboard', label: '📊 Dashboard' },
    { path: '/Res_cita/contenido?tipo=banner', label: '🎨 Banner Home' },
    { path: '/Res_cita/contenido?tipo=consulta', label: '💬 Consultas' },
    { path: '/Res_cita/contenido?tipo=sede', label: '📍 Sedes' },
    { path: '/Res_cita/contenido?tipo=testimonio', label: '⭐ Testimonios' },
    { path: '/Res_cita/contenido?tipo=tratamiento', label: '💆 Tratamientos' },
    { path: '/Res_cita/contenido?tipo=producto', label: '🧴 Productos' },
    { path: '/Res_cita/contenido?tipo=porque', label: '✨ ¿Por qué Vinali?' },
     { path: '/Res_cita/contenido?tipo=promocion', label: '📢 Promociones' },
  ];

  // ============================================================
  // FUNCIÓN PARA DETECTAR EL ITEM ACTIVO
  // ============================================================
  const esActivo = (item) => {
    // Dashboard
    if (item.path === '/Res_cita/dashboard') {
      return location.pathname === '/Res_cita/dashboard';
    }

    // Items con ?tipo=
    if (item.path.includes('?tipo=')) {
      const tipoItem = item.path.split('?tipo=')[1];
      const tipoActual = new URLSearchParams(location.search).get('tipo');
      return location.pathname.includes('/contenido') && tipoItem === tipoActual;
    }

    // Otros
    return location.pathname === item.path;
  };

  // ============================================================
  // TARJETAS
  // ============================================================
  const tarjetas = [
    { icono: '🎨', titulo: 'Banner Home', ruta: '/Res_cita/contenido?tipo=banner', color: '#9f7aea' },
    { icono: '💬', titulo: 'Consultas', ruta: '/Res_cita/contenido?tipo=consulta', color: '#f6ad55' },
    { icono: '📍', titulo: 'Sedes', ruta: '/Res_cita/contenido?tipo=sede', color: '#34b8c5' },
    { icono: '⭐', titulo: 'Testimonios', ruta: '/Res_cita/contenido?tipo=testimonio', color: '#68d391' },
    { icono: '💆', titulo: 'Tratamientos', ruta: '/Res_cita/contenido?tipo=tratamiento', color: '#1a3a5c' },
    { icono: '🧴', titulo: 'Productos', ruta: '/Res_cita/contenido?tipo=producto', color: '#ed8936' },
    { icono: '✨', titulo: '¿Por qué Vinali?', ruta: '/Res_cita/contenido?tipo=porque', color: '#805ad5' },
  ];

  return (
    <div className="admin-layout">
      {/* SIDEBAR */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h2>Vinali Admin</h2>
        </div>

        <nav className="admin-nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={esActivo(item) ? 'active' : ''}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <p>👤 {nombre}</p>
          <button onClick={handleLogout}>Cerrar sesión</button>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="admin-content">
        <div className="dashboard-container">
          <div className="dashboard-header">
            <div>
              <h1>¡Bienvenido, {nombre}!</h1>
              <p>Rol: <strong>{rol}</strong></p>
            </div>
            <div className="dashboard-fecha">
              {new Date().toLocaleDateString('es-PE', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>

          <div className="dashboard-tarjetas">
            {tarjetas.map((tarjeta) => (
              <div
                key={tarjeta.titulo}
                className="dashboard-tarjeta"
                onClick={() => navigate(tarjeta.ruta)}
                style={{ borderLeft: `5px solid ${tarjeta.color}` }}
              >
                <div className="tarjeta-icono" style={{ color: tarjeta.color }}>
                  {tarjeta.icono}
                </div>
                <div className="tarjeta-info">
                  <h3>{tarjeta.titulo}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;