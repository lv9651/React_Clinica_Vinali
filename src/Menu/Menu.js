import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { UsuarioContext } from '../context/AuthContext';
import {
  FaShoppingCart,
  FaUser,
  FaBars,
  FaTimes,
  FaWhatsapp,
  FaEnvelope,
} from 'react-icons/fa';
import logo from '../assets/Vinali.png';
import '../CSS/Menu.css';

const MainLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { usuario, logout } = useContext(UsuarioContext);
  const [menuAbierto, setMenuAbierto] = useState(false);

  // ============================================================
  // 🛒 CANTIDAD DE ITEMS EN EL CARRITO
  // ============================================================
  const [cantidadCarrito, setCantidadCarrito] = useState(0);

  const calcularTotalCarrito = () => {
    if (!usuario?.usuarioID) return 0;

    const keysCitas = Object.keys(localStorage).filter((k) =>
      k.startsWith('serviciosPendientes_')
    );
    let totalCitas = 0;
    keysCitas.forEach((k) => {
      try {
        const items = JSON.parse(localStorage.getItem(k) || '[]');
        totalCitas += items.length;
      } catch (e) {}
    });

    const productos = JSON.parse(
      localStorage.getItem(`carritoProductos_${usuario.usuarioID}`) || '[]'
    );
    const totalProductos = productos.reduce(
      (acc, p) => acc + (p.cantidad || 1),
      0
    );

    return totalCitas + totalProductos;
  };

  useEffect(() => {
    setCantidadCarrito(calcularTotalCarrito());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuario, location]);

  useEffect(() => {
    const handleUpdate = () => {
      setCantidadCarrito(calcularTotalCarrito());
    };

    window.addEventListener('carritoActualizado', handleUpdate);
    return () =>
      window.removeEventListener('carritoActualizado', handleUpdate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuario]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleMenu = () => setMenuAbierto(!menuAbierto);

  const handleCarritoClick = () => {
    if (!usuario?.usuarioID) {
      navigate('/Bienvenida');
      return;
    }

    const keysCitas = Object.keys(localStorage).filter((k) =>
      k.startsWith('serviciosPendientes_')
    );
    let citas = [];
    for (const k of keysCitas) {
      try {
        const items = JSON.parse(localStorage.getItem(k) || '[]');
        if (items.length > 0) {
          citas = items;
          break;
        }
      } catch (e) {}
    }

    const productos = JSON.parse(
      localStorage.getItem(`carritoProductos_${usuario.usuarioID}`) || '[]'
    );

    if (citas.length === 0 && productos.length === 0) {
      alert('Tu carrito está vacío.');
      return;
    }

    if (citas.length > 0) {
      const ultimaCita = citas[citas.length - 1];
      navigate('/eleccion', {
        state: {
          especialidad: ultimaCita.especialidad,
          medico: ultimaCita.medico,
          sucursal: ultimaCita.sucursal,
          idesucursal: ultimaCita.idesucursal,
          idtipoespecialidad: ultimaCita.idtipoespecialidad,
          idprocedenciaregistro: ultimaCita.idprocedenciaregistro,
          dia: ultimaCita.dia,
          hora: ultimaCita.hora,
          idhorariomedicodividido: ultimaCita.idhorariomedicodividido,
          idpaciente: ultimaCita.idpaciente,
          Horariomedic: ultimaCita.Horariomedic,
          TipoModalidad: ultimaCita.TipoModalidad,
        },
      });
    } else {
      navigate('/eleccion');
    }
  };

  return (
    <div className="main-layout">
      {/* HEADER */}
      <header className="main-header">
        <div className="header-inner">
          <Link to="/Bienvenida" className="header-logo-link">
            <img src={logo} alt="Vinali" className="header-logo" />
          </Link>

          <button className="menu-toggle" onClick={toggleMenu}>
            {menuAbierto ? <FaTimes /> : <FaBars />}
          </button>

          <nav className={`header-nav ${menuAbierto ? 'open' : ''}`}>
            <Link to="/Bienvenida" className="nav-item" onClick={toggleMenu}>
              Inicio
            </Link>
            <Link
              to="/S_per_familiar?tipo=1"
              className="nav-item"
              onClick={toggleMenu}
            >
              Reserva tu cita
            </Link>
            <Link to="/tratamientos" className="nav-item" onClick={toggleMenu}>
              Tratamiento
            </Link>
            <Link to="/club" className="nav-item" onClick={toggleMenu}>
              Club Vinali
            </Link>
            <Link to="/mis-citas" className="nav-item" onClick={toggleMenu}>
              Mis citas
            </Link>
            <Link to="/mi-cuenta" className="nav-item" onClick={toggleMenu}>
              Mi cuenta
            </Link>
          </nav>

          <div className="header-actions">
            {/* 🛒 CARRITO CON BADGE */}
            <button
              className="action-btn icon-only"
              onClick={handleCarritoClick}
              style={{ position: 'relative' }}
              title={
                cantidadCarrito > 0
                  ? `Tienes ${cantidadCarrito} item${
                      cantidadCarrito > 1 ? 's' : ''
                    } en el carrito`
                  : 'Carrito vacío'
              }
            >
              <FaShoppingCart />

              {cantidadCarrito > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-6px',
                    background: '#dc2626',
                    color: 'white',
                    borderRadius: '50%',
                    minWidth: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: 700,
                    border: '2px solid white',
                    padding: '0 4px',
                  }}
                >
                  {cantidadCarrito}
                </span>
              )}
            </button>

            <div
              className="user-menu"
              onClick={handleLogout}
              title="Cerrar sesión"
            >
              <FaUser className="user-icon" />
              <span className="user-name">
                {usuario
                  ? `${usuario.nombres} ${usuario.apellidoPaterno || ''}`
                  : 'Invitado'}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="main-content">{children}</main>

      <footer className="main-footer">
        <div className="footer-inner">
          <div className="footer-item">
            <FaWhatsapp size={18} />
            <span>
              WhatsApp: <strong>993 805 070</strong>
            </span>
          </div>
          <div className="footer-item">
            <FaEnvelope size={18} />
            <span>
              Correo: <strong>contacto@vinali.pe</strong>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;