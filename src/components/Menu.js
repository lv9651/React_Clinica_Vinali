import React from 'react';
import { Link } from 'react-router-dom';
import '../CSS/Menu.css';

const Menu = () => {
  return (
    <nav className="menu">
      <ul>
        <li><Link to="/medicos">STAFF MEDICO</Link></li>
        <li><Link to="/citas">ESPECIALIDADES</Link></li>
        <li><Link to="/informacion">SERVICIOS</Link></li>
      </ul>
    </nav>
  );
};

export default Menu;