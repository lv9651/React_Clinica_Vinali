import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, message, Space, Popconfirm, Select } from 'antd';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { BASE_URL } from '../Medico/config';

const tiposDisponibles = [
  { value: 'banner', label: '🎨 Banner Home' },
  { value: 'consulta', label: '💬 Consultas' },
  { value: 'sede', label: '📍 Sedes' },
  { value: 'testimonio', label: '⭐ Testimonios' },
  { value: 'tratamiento', label: '💆 Tratamientos' },
  { value: 'producto', label: '🧴 Productos' },
  { value: 'porque', label: '✨ ¿Por qué Vinali?' },
  { value: 'promocion', label: '📢 Promociones' }, 
];

const ListaContenido = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tipoActual = searchParams.get('tipo') || 'banner';

  const [contenido, setContenido] = useState([]);
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const cargar = async (tipo) => {
    setCargando(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/CMS/contenido?tipo=${tipo}`);
      setContenido(res.data);
    } catch (e) {
      message.error('Error al cargar');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargar(tipoActual);
  }, [tipoActual]);

  const handleTipoChange = (nuevoTipo) => {
    setSearchParams({ tipo: nuevoTipo });
  };

  const handleEliminar = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/api/CMS/contenido/${id}`);
      message.success('Eliminado');
      cargar(tipoActual);
    } catch (e) {
      message.error('Error al eliminar');
    }
  };

  const columnas = [
    { title: 'ID', dataIndex: 'idContenido', width: 60 },
    {
      title: 'Imagen',
      dataIndex: 'imagen',
      render: (img) =>
        img ? (
          <img
            src={img}
            alt="contenido"
            style={{ width: 80, height: 50, objectFit: 'cover', borderRadius: 6 }}
          />
        ) : (
          <span style={{ color: '#999' }}>Sin imagen</span>
        ),
    },
    { title: 'Título', dataIndex: 'titulo' },
    { title: 'Descripción', dataIndex: 'descripcion' },
    {
      title: 'Acciones',
      key: 'acc',
      render: (_, r) => (
        <Space>
          <Button
            type="primary"
            onClick={() => navigate(`/Res_cita/contenido/editar/${r.idContenido}?tipo=${tipoActual}`)}
          >
            Editar
          </Button>
          <Popconfirm
            title="¿Eliminar?"
            onConfirm={() => handleEliminar(r.idContenido)}
            okText="Sí"
            cancelText="No"
          >
            <Button danger>Eliminar</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 30 }}>
      {/* ============================================================ */}
      {/* BOTÓN VOLVER AL DASHBOARD                                    */}
      {/* ============================================================ */}
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/Res_cita/Dashboard')}
        style={{ marginBottom: 20 }}
      >
        Volver al Dashboard
      </Button>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1>Gestionar Contenido</h1>
        <Link to={`/Res_cita/contenido/crear?tipo=${tipoActual}`}>
          <Button type="primary" size="large">
            + Nuevo
          </Button>
        </Link>
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={{ marginRight: 10, fontWeight: 600 }}>Tipo:</label>
        <Select
          value={tipoActual}
          onChange={handleTipoChange}
          style={{ width: 250 }}
          size="large"
          options={tiposDisponibles}
        />
      </div>

      <Table
        dataSource={contenido}
        columns={columnas}
        rowKey="idContenido"
        loading={cargando}
      />
    </div>
  );
};

export default ListaContenido;