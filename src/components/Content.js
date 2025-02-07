// src/components/Content.js
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ReservarCita from '../Res_cita/ReservarCita';

const Content = () => {
  return (
    <div className="content">
      <Routes>
        <Route path="/medicos" element={<div><h2>Lista de Médicos</h2><p>Contenido sobre los médicos.</p></div>} />
        <Route path="/citas" element={<div><h2>Mis Citas</h2><p>Contenido sobre las citas del usuario.</p></div>} />
        <Route path="/informacion" element={<div><h2>Información</h2><p>Información sobre la clínica.</p></div>} />
        <Route path="/reservar" element={<ReservarCita />} />
      </Routes>
    </div>
  );
};

export default Content;