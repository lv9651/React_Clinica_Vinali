import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Menu from './components/Menu';
import Footer from './components/Footer';
import Content from './components/Content';
import ReservarCita from './Res_cita/ReservarCita';  // Importar la página de reservar cita
import NoLayout from './components/NoLayout';  // Importar el layout sin Header ni Footer
import RecuperarClave from './Res_cita/RecuperarClave';
import CitaCliente from './Res_cita/Cita_cliente';
import Registro from './Res_cita/Registro';
import Reg_Act_datos from './Res_cita/Registro_Act_datos';
import Registrodepen from './Res_cita/Registro_depend';
import MenuG from './Menu/Menu';
import Medico from './Medico/Medico';
import Perfamiliar from './Medico/S_per_familiar';
import Eleccion from './Medico/Eleccion';
import Medicos from './components/Medicos';
import Especialidad from './components/Especialidad';
import Bienvenida from './components/Bienvenida';
import Hist_Clinico from './Res_cita/Historial_clinico';

import { UsuarioProvider } from './context/AuthContext'; // Importar el proveedor del contexto

import './App.css';

const App = () => {
  return (
    <Router>
      <div className="app">
        {/* Envolvemos las rutas que requieren el contexto dentro de UsuarioProvider */}
        <UsuarioProvider>
          <Routes>
            {/* Las rutas principales con Header y Footer */}
         
            
            {/*<Route path="/Medicos" element={<><Header /><Menu /><Medicos/><Footer /></>} />
            <Route path="/informacion" element={<><Header /><Menu /><div><h2>Información</h2><p>Contamos con una sólida infraestructura, equipada con tecnología moderna y con personal altamente comprometido.</p></div><Footer /></>} />
            <Route path="/citas" element={<><Header /><Menu /><Especialidad/><Footer /></>} />*/}
            
            {/* Página de reserva de cita sin Header ni Footer */}
            <Route path="/" element={<NoLayout><ReservarCita /></NoLayout>} />
            
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
            
          </Routes>
        </UsuarioProvider>
      </div>
    </Router>
  );
};

export default App;