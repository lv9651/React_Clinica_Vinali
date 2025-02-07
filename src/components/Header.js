import React from 'react';
import { Link } from 'react-router-dom';
import '../CSS/Header.css';

// Importa la imagen de la carpeta src/assets
import logo from '../assets/Vinali.png';

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        {/* Usa la imagen importada */}
        <img src={logo} alt="Logo Clínica QF" className="logo-img" />
      </div>
      <div className="header-actions">
        <Link to="/reservar" className="btn-reservar">Reservar cita</Link>
      </div>
    </header>
  );
};

export default Header;