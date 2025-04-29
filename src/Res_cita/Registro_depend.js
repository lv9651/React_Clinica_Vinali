import React, { useState, useContext } from 'react';
import { message, Spin } from 'antd';
import axios from 'axios';
import '../CSS/Registro.css';
import { useNavigate } from 'react-router-dom';
import { UsuarioContext } from '../context/AuthContext';
import { BASE_URL } from '../Medico/config';

const Registro = () => {
  // Estados del formulario
  const [iddocumento, setTipoDocumento] = useState('');
  const [numdocumento, setNumeroDocumento] = useState('');
  const [nombres, setNombres] = useState('');
  const [apePaterno, setApellidoPaterno] = useState('');
  const [apeMaterno, setApellidoMaterno] = useState('');
  const [Celular, setTelefono] = useState('');
  const { usuario } = useContext(UsuarioContext);
  const [loading, setLoading] = useState(false);
  const [parentesco, setParentesco] = useState('');
  
  const navigate = useNavigate();  // Hook para redirigir

  const goBack = () => {
    navigate('/S_per_familiar');
  };

  const handleRegistroSubmit = async (e) => {
    e.preventDefault();

    // Validación de datos
    if (!iddocumento || !numdocumento || !nombres || !apePaterno || !apeMaterno || 
      !Celular || !parentesco) {
      message.error("Por favor, completa todos los campos.");
      return;
    }

    // Datos a enviar
    const datosRegistro = {
      iddocumento,
      numdocumento,
      nombres,
      apePaterno,
      apeMaterno,
      Celular,
      parentesco,
      dni_ce: usuario.numeroDocumento,
    };

    const payload = {
      Json: JSON.stringify([datosRegistro]),  // Convertimos el objeto en un string JSON
    };

    try {
      setLoading(true);
      const response = await axios.post(`${BASE_URL}/api/Medicos/insertar-familiar`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      message.success(`Registro correcto!`);
      navigate('/S_per_familiar'); // Redirigir tras éxito

    } catch (error) {
      console.error('Error al registrar: ', error);
      if (error.response) {
        let errorMessage = error.response.data;
        message.error(errorMessage);  // Mostrar mensaje de error exacto
      } else if (error.request) {
        message.error('No se pudo conectar con el servidor. Inténtelo de nuevo.');
      } else {
        message.error('Ocurrió un error desconocido. Inténtalo más tarde.');
      }
    } finally {
      setLoading(false); // Desactivar indicador de carga
    }
  };

  return (
    <div className="registro_depend-container">
      <div className="registro_depend-form-container">
        <h3>Registro de Familiar</h3>

        <form onSubmit={handleRegistroSubmit} className="registro_depend-form">
          <div className="registro_depend-form-group">
            <label htmlFor="parentesco">Parentesco</label>
            <select 
              id="parentesco" 
              value={parentesco} 
              onChange={(e) => setParentesco(e.target.value)} 
              required
            >
              <option value="">Selecciona un parentesco</option>
              <option value="Madre">Madre</option>
              <option value="Padre">Padre</option>
              <option value="Hermano">Hermano</option>
              <option value="Hermana">Hermana</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          <div className="registro_depend-form-group">
            <label htmlFor="tipoDocumento">Tipo de Documento</label>
            <select 
              id="tipoDocumento" 
              value={iddocumento} 
              onChange={(e) => setTipoDocumento(e.target.value)} 
              required
            >
              <option value="">Selecciona un tipo de documento</option>
              <option value="1">DNI</option>
              <option value="3">RUC</option>
              <option value="4">Pasaporte</option>
              <option value="5">Otro</option>
            </select>
          </div>

          <div className="registro_depend-form-group">
            <label htmlFor="documento">Número de Documento</label>
            <input 
              type="text" 
              id="documento" 
              value={numdocumento} 
              onChange={(e) => setNumeroDocumento(e.target.value)} 
              required
            />
          </div>

          <div className="registro_depend-form-group">
            <label htmlFor="nombres">Nombres</label>
            <input 
              type="text" 
              id="nombres" 
              value={nombres} 
              onChange={(e) => setNombres(e.target.value)} 
              required
            />
          </div>

          <div className="registro_depend-form-group">
            <label htmlFor="apellidoPaterno">Apellido Paterno</label>
            <input 
              type="text" 
              id="apellidoPaterno" 
              value={apePaterno} 
              onChange={(e) => setApellidoPaterno(e.target.value)} 
              required
            />
          </div>

          <div className="registro_depend-form-group">
            <label htmlFor="apellidoMaterno">Apellido Materno</label>
            <input 
              type="text" 
              id="apellidoMaterno" 
              value={apeMaterno} 
              onChange={(e) => setApellidoMaterno(e.target.value)} 
              required
            />
          </div>

          <div className="registro_depend-form-group">
            <label htmlFor="telefono">Nro Celular</label>
            <input 
              type="text" 
              id="telefono" 
              value={Celular} 
              onChange={(e) => setTelefono(e.target.value)} 
              required
            />
          </div>

          <div className="registro_depend-form-actions">
            <button type="submit" disabled={loading}>
              {loading ? <Spin size="small" /> : 'Registrarme'}
            </button>

            <button type="button" className="registro_depend-button-back" onClick={goBack}>
              Atrás
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Registro;