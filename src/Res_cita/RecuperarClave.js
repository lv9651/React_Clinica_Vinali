import React, { useState } from 'react';
import axios from 'axios';
import { message, Input, Button, Form, Card, Spin } from 'antd';  // Usamos Ant Design para los componentes
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../Medico/config';  
const RecuperarClave = () => {
  const [dni, setdni] = useState('');
  const [codigo, setCodigo] = useState('');
  const [nuevaContraseña, setNuevaContrasena] = useState('');
  const [repetirContrasena, setRepetirContrasena] = useState('');
  const [fase, setFase] = useState('enviarCodigo');  // Estado que determina en qué fase estamos: 'enviarCodigo' o 'cambiarContrasena'
  const [codigoValido, setCodigoValido] = useState(false); // Estado para saber si el código es válido
  const [cargando, setCargando] = useState(false); // Estado para manejar la carga del código
  const navigate = useNavigate();
  // Enviar el código de recuperación al correo
  const handleEnviarCodigo = async () => {
    if (!dni) {
      message.error('Por favor ingresa un número de identidad.');
      return;
    }
  
    setCargando(true); // Activamos el estado de carga

    try {
      // Enviar el DNI como un string directamente (sin un objeto JSON)
      await axios.post(
        `${BASE_URL}/api/Usuarios/recuperar-correo `,
        JSON.stringify( dni ), // Enviamos el DNI en un objeto JSON
        {
          headers: {
            'Content-Type': 'application/json'  // El tipo de contenido sigue siendo JSON
          }
        }
      );
      message.success('Se ha enviado un código a tu correo.');
      setFase('verificarCodigo');
    } catch (error) {
      console.error('Error al enviar código: ', error.response || error);
      message.error('Documento no registrado.');
    } finally {
      setCargando(false); // Desactivamos el estado de carga una vez completada la solicitud
    }
  };

  // Verificar el código y permitir cambiar la contraseña
  const handleVerificarCodigo = async () => {
    if (!codigo) {
      message.error('Por favor ingresa el código recibido.');
      return;
    }
    try {
      const response = await axios.post(`${BASE_URL}/api/Usuarios/validar-codigo`, { dni, codigo });
      if (response.data) {
        setCodigoValido(true);
        message.success('Código validado correctamente. Ahora puedes cambiar tu contraseña.');
        setFase('cambiarContrasena');
      } else {
        message.error('El código ingresado no es válido. Intenta de nuevo.');
      }
    } catch (error) {
      console.error('Error al verificar código: ', error);
      message.error('Hubo un error al verificar el código. Inténtalo más tarde.');
    }
  };

  // Cambiar la contraseña
  const handleCambiarContrasena = async () => {
    if (!nuevaContraseña || nuevaContraseña !== repetirContrasena) {
      message.error('Las contraseñas no coinciden o están vacías.');
      return;
    }
    try {
      await axios.post(`${BASE_URL}/api/Usuarios/cambiar-clave`, { dni, nuevaContraseña });
      message.success('Tu contraseña ha sido cambiada exitosamente.');
      navigate('/'); 
    } catch (error) {
      console.error('Error al cambiar la contraseña: ', error);
      message.error('Hubo un error al cambiar la contraseña. Inténtalo más tarde.');
    }
  };

  return (
    <div className="container" style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ textAlign: 'center' }}>Recuperar Contraseña</h2>

      <Card style={{ marginTop: '20px' }}>
        <p style={{ textAlign: 'center' }}>Introduce tu número de identidad para recuperar tu contraseña.</p>

        {/* Fase 1: Enviar código */}
        {fase === 'enviarCodigo' && (
          <Form layout="vertical">
            <Form.Item label="Número de Identidad">
              <Input 
                value={dni} 
                onChange={(e) => setdni(e.target.value)} 
                placeholder="Número de identidad" 
                style={{ width: '100%' }} 
              />
            </Form.Item>
            <Button 
              type="primary" 
              block 
              onClick={handleEnviarCodigo} 
              style={{ backgroundColor: '#34e1b2', borderColor: '#1D6DF6' }} // Cambié el color de fondo y borde
              loading={cargando}  // Mostramos el indicador de carga cuando está cargando
            >
              {cargando ? 'Enviando código...' : 'Enviar código'}
            </Button>
          </Form>
        )}

        {/* Fase 2: Verificar código */}
        {fase === 'verificarCodigo' && (
          <Form layout="vertical">
            <Form.Item label="Código recibido">
              <Input 
                value={codigo} 
                onChange={(e) => setCodigo(e.target.value)} 
                placeholder="Código recibido" 
                style={{ width: '100%' }} 
              />
            </Form.Item>
            <Button 
              type="primary" 
              block 
              onClick={handleVerificarCodigo} 
              style={{ backgroundColor: '#1D6DF6', borderColor: '#1D6DF6' }} // Cambié el color de fondo y borde
            >
              Verificar código
            </Button>
          </Form>
        )}

        {/* Fase 3: Cambiar contraseña */}
        {fase === 'cambiarContrasena' && codigoValido && (
          <Form layout="vertical">
            <Form.Item label="Nueva contraseña">
              <Input.Password 
                value={nuevaContraseña} 
                onChange={(e) => setNuevaContrasena(e.target.value)} 
                placeholder="Nueva contraseña" 
                style={{ width: '100%' }} 
              />
            </Form.Item>
            <Form.Item label="Repetir nueva contraseña">
              <Input.Password 
                value={repetirContrasena} 
                onChange={(e) => setRepetirContrasena(e.target.value)} 
                placeholder="Repetir nueva contraseña" 
                style={{ width: '100%' }} 
              />
            </Form.Item>
            <Button 
              type="primary" 
              block 
              onClick={handleCambiarContrasena} 
              style={{ backgroundColor: '#daa519', borderColor: '#1D6DF6' }} // Cambié el color de fondo y borde
            >
              Cambiar contraseña
            </Button>
          </Form>
        )}
      </Card>
    </div>
  );
};

export default RecuperarClave;