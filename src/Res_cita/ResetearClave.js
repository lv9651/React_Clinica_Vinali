import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { message, Input, Button, Form, Card } from 'antd';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { BASE_URL } from '../Medico/config';

const ResetearClave = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [nuevaClave, setNuevaClave] = useState('');
  const [repetirClave, setRepetirClave] = useState('');
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      message.error('Token no válido. Solicita un nuevo enlace.');
      setTimeout(() => navigate('/recuperar-clave'), 3000);
    }
  }, [token, navigate]);

  const handleResetear = async () => {
    if (!nuevaClave || nuevaClave !== repetirClave) {
      message.error('Las contraseñas no coinciden o están vacías.');
      return;
    }

    setCargando(true);

    try {
      const response = await axios.post(
        `${BASE_URL}/api/Usuarios/resetear-clave`,
        { token: token, nuevaClave: nuevaClave },
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.data.Accion === 'OK') {
        message.success('¡Contraseña actualizada! Ya puedes iniciar sesión.');
        setTimeout(() => navigate('/'), 2000);
      } else {
        message.error(response.data.Mensaje || 'Error al cambiar contraseña.');
      }
    } catch (error) {
      console.error('Error al resetear: ', error);
      const mensajeError =
        error.response?.data?.Mensaje ||
        error.response?.data?.mensaje ||
        'Token inválido o expirado.';
      message.error(mensajeError);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ textAlign: 'center' }}>Nueva Contraseña</h2>

      <Card style={{ marginTop: '20px' }}>
        <p style={{ textAlign: 'center' }}>
          Ingresa tu nueva contraseña.
        </p>

        <Form layout="vertical">
          <Form.Item label="Nueva Contraseña">
            <Input.Password
              value={nuevaClave}
              onChange={(e) => setNuevaClave(e.target.value)}
              placeholder="Nueva contraseña"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item label="Repetir Contraseña">
            <Input.Password
              value={repetirClave}
              onChange={(e) => setRepetirClave(e.target.value)}
              placeholder="Repetir contraseña"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Button
            type="primary"
            block
            onClick={handleResetear}
            loading={cargando}
            style={{ backgroundColor: '#1D6DF6', borderColor: '#1D6DF6' }}
          >
            {cargando ? 'Cambiando...' : 'Cambiar contraseña'}
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default ResetearClave;