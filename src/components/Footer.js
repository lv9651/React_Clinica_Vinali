// src/components/Footer.js
import React from 'react';

import '../CSS/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; 2024 Clínica QF. Todos los derechos reservados.</p>
        <div className="footer-links">
          <a href="/terminos">Términos y condiciones</a>
          <a href="/privacidad">Política de privacidad</a>
        </div>
        <p>Contacto: <a href="mailto:contacto@clinicaqf.com">contacto@clinicaqf.com</a></p>
      </div>
    </footer>
  );
};

export default Footer;