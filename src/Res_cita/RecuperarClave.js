import React, { useState } from 'react';
import axios from 'axios';
import { message, Input, Button, Form, Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../Medico/config';

const RecuperarClave = () => {
  const [email, setEmail] = useState('');
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const handleEnviarEnlace = async () => {
    if (!email) {
      message.error('Por favor ingresa tu correo electrónico.');
      return;
    }

    setCargando(true);

    try {
      const response = await axios.post(
        `${BASE_URL}/api/Usuarios/recuperar-clave`,
        { email: email },
        { headers: { 'Content-Type': 'application/json' } }
      );

      // ✅ Leer ambos casos: 'Mensaje' (mayúscula) y 'mensaje' (minúscula)
      const mensajeRespuesta = response.data?.Mensaje
                            || response.data?.mensaje
                            || 'Se envió un correo con las instrucciones.';

      message.success(mensajeRespuesta);

      setTimeout(() => navigate('/'), 3000);

    } catch (error) {
      console.error('Error al enviar correo: ', error);

      // ✅ Extraer mensaje de error de forma robusta
      const mensajeError =
        error.response?.data?.Mensaje ||
        error.response?.data?.mensaje ||
        error.response?.data?.Detalle ||
        (typeof error.response?.data === 'string' ? error.response.data : null) ||
        'Correo no registrado.';

      message.error(mensajeError);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ textAlign: 'center' }}>Recuperar Contraseña</h2>

      <Card style={{ marginTop: '20px' }}>
        <p style={{ textAlign: 'center' }}>
          Introduce tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
        </p>

        <Form layout="vertical">
          <Form.Item label="Correo Electrónico">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tucorreo@gmail.com"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Button
            type="primary"
            block
            onClick={handleEnviarEnlace}
            loading={cargando}
            style={{ backgroundColor: '#1D6DF6', borderColor: '#1D6DF6' }}
          >
            {cargando ? 'Enviando enlace...' : 'Enviar enlace de recuperación'}
          </Button>

          <Button
            type="link"
            block
            onClick={() => navigate('/')}
            style={{ marginTop: '10px' }}
          >
            Volver al inicio de sesión
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default RecuperarClave;