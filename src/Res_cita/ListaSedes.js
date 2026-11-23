import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, message, Space, Popconfirm } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../Medico/config';

const ListaSedes = () => {
  const [sedes, setSedes] = useState([]);
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const cargarSedes = async () => {
    setCargando(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/CMS/sedes`);
      setSedes(res.data);
    } catch (error) {
      message.error('Error al cargar sedes');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarSedes();
  }, []);

  const handleEliminar = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/api/CMS/sedes/${id}`);
      message.success('Sede eliminada');
      cargarSedes();
    } catch (error) {
      message.error('Error al eliminar');
    }
  };

  const columnas = [
    { title: 'ID', dataIndex: 'idSede', key: 'idSede', width: 80 },
    {
      title: 'Imagen',
      dataIndex: 'imagen',
      key: 'imagen',
      render: (img) => img
        ? <img src={img} alt="sede" style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 6 }} />
        : <span style={{ color: '#999' }}>Sin imagen</span>
    },
    { title: 'Nombre', dataIndex: 'nombre', key: 'nombre' },
    { title: 'Dirección', dataIndex: 'direccion', key: 'direccion' },
    { title: 'Teléfono', dataIndex: 'telefono', key: 'telefono' },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (_, record) => (
        <Space>
          <Button type="primary" onClick={() => navigate(`/Res_cita/editar/${record.idSede}`)}>
            Editar
          </Button>
          <Popconfirm
            title="¿Eliminar esta sede?"
            onConfirm={() => handleEliminar(record.idSede)}
            okText="Sí"
            cancelText="No"
          >
            <Button danger>Eliminar</Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1>Gestión de Sedes</h1>
        <Link to="/CMS/crear">
          <Button type="primary" size="large">+ Nueva Sede</Button>
        </Link>
      </div>
      <Table dataSource={sedes} columns={columnas} rowKey="idSede" loading={cargando} />
    </div>
  );
};

export default ListaSedes;