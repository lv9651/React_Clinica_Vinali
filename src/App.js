import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ReservarCita from './Res_cita/ReservarCita';
import NoLayout from './components/NoLayout';
import RecuperarClave from './Res_cita/RecuperarClave';
import CitaCliente from './Res_cita/Cita_cliente';
import Registro from './Res_cita/Registro';
import Reg_Act_datos from './Res_cita/Registro_Act_datos';
import Registrodepen from './Res_cita/Registro_depend';
import MenuG from './Menu/Menu';
import Medico from './Medico/Medico';
import Perfamiliar from './Medico/S_per_familiar';
import Eleccion from './Medico/Eleccion';
import Bienvenida from './components/Bienvenida';
import Hist_Clinico from './Res_cita/Historial_clinico';
import DashboardMedico from './Res_cita/DashboardMedico'; 
import { UsuarioProvider } from './context/AuthContext'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const App = () => {
  return (
    <div className="app">
      {/* Envolvemos las rutas que requieren el contexto dentro de UsuarioProvider */}
      <UsuarioProvider>
        <Routes>
          {/* Las rutas principales con Header y Footer */}
          
          {/* Página de reserva de cita sin Header ni Footer */}
          <Route path="/ReservarCita" element={<ReservarCita />} />
      <Route path="/" element={<Navigate to="/ReservarCita" replace />} />
      

          {/* Rutas con diferentes componentes */}
          <Route path="/recuperar-clave" element={<RecuperarClave />} />
          <Route path="/registrarse" element={<Registro />} /> 
          <Route path="/Registro_Act_datos" element={<Reg_Act_datos/>} /> 
          <Route path="/menu" element={<MenuG />} />
          <Route path="/Medico" element={<MenuG><Medico /></MenuG>} />
          <Route path="/Eleccion" element={<MenuG><Eleccion /></MenuG>} />
          <Route path="/Bienvenida" element={<MenuG><Bienvenida /></MenuG>} /> 
          <Route path="/Cita_cliente" element={<MenuG><CitaCliente /></MenuG>} />
          <Route path="/S_per_familiar" element={<MenuG><Perfamiliar /></MenuG>} />
          <Route path="/Registro_depend" element={<MenuG><Registrodepen /></MenuG>} />
          <Route path="/Historial_clinico" element={<MenuG><Hist_Clinico /></MenuG>} />
                 <Route path="/dashboardmedico" element={<DashboardMedico />} />
        </Routes>
      </UsuarioProvider>
    </div>
  );
};

export default App;