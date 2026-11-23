import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Input, Button, Upload, message, Select } from 'antd';
import { UploadOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { BASE_URL } from '../Medico/config';

const tiposDisponibles = [
  { value: 'banner', label: '🎨 Banner Home' },
  { value: 'consulta', label: '💬 Consultas' },
  { value: 'sede', label: '📍 Sedes' },
  { value: 'testimonio', label: '⭐ Testimonios' },
  { value: 'tratamiento', label: '💆 Tratamientos' },
  { value: 'producto', label: '🧴 Productos' },
  { value: 'porque', label: '✨ ¿Por qué Vinali?' },
];

const FormContenido = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const tipoInicial = searchParams.get('tipo') || 'banner';

  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [tipo, setTipo] = useState(tipoInicial);
  const [imagenUrl, setImagenUrl] = useState('');
  const [subiendo, setSubiendo] = useState(false);
  const [cargando, setCargando] = useState(false);

  // ============================================================
  // 🧴 PACKS Y LISTAS DE PRECIO
  // ============================================================
  const [listasPrecio, setListasPrecio] = useState([]);
  const [cargandoListas, setCargandoListas] = useState(false);

  const [packs, setPacks] = useState([]);
  const [cargandoPacks, setCargandoPacks] = useState(false);

  const [idListaPrecioSeleccionada, setIdListaPrecioSeleccionada] = useState(null);
  const [idProductoSeleccionado, setIdProductoSeleccionado] = useState(null);

  // ============================================================
  // 📥 CARGAR LISTAS DE PRECIO (solo si tipo === 'producto')
  // ============================================================
  useEffect(() => {
    if (tipo === 'producto') {
      setCargandoListas(true);
      axios
        .get(`${BASE_URL}/api/CMS/listas-precio-web`)
        .then((res) => setListasPrecio(res.data))
        .catch(() => message.error('Error al cargar listas de precio'))
        .finally(() => setCargandoListas(false));
    }
  }, [tipo]);

  // ============================================================
  // 📥 CARGAR PACKS AL CAMBIAR LISTA DE PRECIO
  // ============================================================
  useEffect(() => {
    if (tipo !== 'producto') return;
    if (!idListaPrecioSeleccionada) {
      setPacks([]);
      return;
    }

    setCargandoPacks(true);
    axios
      .get(
        `${BASE_URL}/api/CMS/packs-con-precio-web?idListaPrecio=${idListaPrecioSeleccionada}`
      )
      .then((res) => setPacks(res.data))
      .catch(() => message.error('Error al cargar packs'))
      .finally(() => setCargandoPacks(false));
  }, [tipo, idListaPrecioSeleccionada]);

  // ============================================================
  // 📥 CARGAR DATOS SI ES EDICIÓN
  // ============================================================
  useEffect(() => {
    if (id) {
      axios.get(`${BASE_URL}/api/CMS/contenido/${id}`).then((res) => {
        const b = res.data;
        form.setFieldsValue(b);
        setImagenUrl(b.imagen || '');
        setTipo(b.tipo);

        // Si es producto, recuperar idProducto e idListaPrecio de Extra2/Extra3
        if (b.tipo === 'producto') {
          const idProd = parseInt(b.extra2);
          const idLista = parseInt(b.extra3);
          if (!isNaN(idProd)) setIdProductoSeleccionado(idProd);
          if (!isNaN(idLista)) setIdListaPrecioSeleccionada(idLista);
        }
      });
    }
  }, [id, form]);

  // ============================================================
  // 🎯 AL SELECCIONAR UN PACK → autocompletar título/precio/descripción
  // ============================================================
  const handleSeleccionarPack = (idProducto) => {
    const pack = packs.find((p) => p.idProducto === idProducto);
    if (!pack) return;

    setIdProductoSeleccionado(idProducto);

    form.setFieldsValue({
      titulo: pack.descripcion || '',
      descripcion: pack.descripcion || '',
      precio: pack.precio ? String(pack.precio) : '',
    });

    message.success(`Pack "${pack.descripcion}" seleccionado`);
  };

  const handleUpload = async (file) => {
    setSubiendo(true);
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await axios.post(`${BASE_URL}/api/CMS/upload`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setImagenUrl(res.data.url);
      message.success('Imagen subida');
    } catch (e) {
      message.error('Error al subir imagen');
    } finally {
      setSubiendo(false);
    }
  };

  const handleSubmit = async (values) => {
    setCargando(true);
    try {
      // ============================================================
      // 🧴 Para productos: guardamos idProducto (Extra2) e idListaPrecio (Extra3)
      // Para otros tipos: usamos los valores del form normalmente
      // ============================================================
      const esProducto = tipo === 'producto';

      const payload = {
        Tipo: tipo,
        Titulo: values.titulo,
        Subtitulo: values.subtitulo,
        Descripcion: values.descripcion,
        Imagen: imagenUrl,
        Enlace: values.enlace,
        Precio: values.precio ? parseFloat(values.precio) : null,
        Extra1: values.extra1,

        // 👇 Cuando es producto → guardamos los IDs en Extra2/Extra3
        Extra2: esProducto
          ? String(idProductoSeleccionado || '')
          : values.extra2,
        Extra3: esProducto
          ? String(idListaPrecioSeleccionada || '')
          : values.extra3,

        Orden: values.orden ? parseInt(values.orden) : 0,
      };

      if (id) {
        await axios.put(`${BASE_URL}/api/CMS/contenido/${id}`, payload);
        message.success('Actualizado');
      } else {
        await axios.post(`${BASE_URL}/api/CMS/contenido`, payload);
        message.success('Creado');
      }
      navigate(`/Res_cita/contenido?tipo=${tipo}`);
    } catch (e) {
      message.error('Error al guardar');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={{ padding: 30 }}>
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(`/Res_cita/contenido?tipo=${tipo}`)}
        style={{ marginBottom: 20 }}
      >
        Volver
      </Button>

      <h1>{id ? 'Editar' : 'Nuevo'} Contenido</h1>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        style={{ maxWidth: 700, background: 'white', padding: 30, borderRadius: 15 }}
      >
        <Form.Item label="Tipo">
          <Select
            value={tipo}
            onChange={setTipo}
            options={tiposDisponibles}
            disabled={!!id}
          />
        </Form.Item>

        {/* ============================================================ */}
        {/* 🧴 SECCIÓN EXCLUSIVA PARA PRODUCTOS (packs)                  */}
        {/* ============================================================ */}
        {tipo === 'producto' && (
          <>
            <Form.Item label="Lista de Precios" required>
              <Select
                showSearch
                placeholder="Selecciona una lista de precios"
                loading={cargandoListas}
                value={idListaPrecioSeleccionada}
                onChange={(val) => {
                  setIdListaPrecioSeleccionada(val);
                  setIdProductoSeleccionado(null); // reset pack al cambiar lista
                  setPacks([]);
                  form.setFieldsValue({
                    titulo: '',
                    descripcion: '',
                    precio: '',
                  });
                }}
                filterOption={(input, option) =>
                  option.label.toLowerCase().includes(input.toLowerCase())
                }
                options={listasPrecio.map((l) => ({
                  value: l.idListaPrecio,
                  label: l.descripcion,
                }))}
              />
            </Form.Item>

            <Form.Item label="Pack (idtipoproducto = 16)" required>
              <Select
                showSearch
                placeholder={
                  idListaPrecioSeleccionada
                    ? 'Busca un pack...'
                    : 'Primero elige una lista de precios'
                }
                disabled={!idListaPrecioSeleccionada}
                loading={cargandoPacks}
                value={idProductoSeleccionado}
                onChange={handleSeleccionarPack}
                filterOption={(input, option) =>
                  option.label.toLowerCase().includes(input.toLowerCase())
                }
                options={packs.map((p) => ({
                  value: p.idProducto,
                  label: `${p.descripcion} - S/ ${parseFloat(p.precio || 0).toFixed(2)}`,
                }))}
              />
            </Form.Item>
          </>
        )}

        <Form.Item name="titulo" label="Título">
          <Input size="large" />
        </Form.Item>

        <Form.Item name="subtitulo" label="Subtítulo">
          <Input size="large" />
        </Form.Item>

        <Form.Item name="descripcion" label="Descripción">
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item name="enlace" label="Enlace">
          <Input placeholder="/ReservarCita" />
        </Form.Item>

        {(tipo === 'producto' || tipo === 'tratamiento') && (
          <Form.Item name="precio" label="Precio">
            <Input type="number" placeholder="150.00" />
          </Form.Item>
        )}

        <Form.Item name="extra1" label="Extra 1">
          <Input
            placeholder={
              tipo === 'banner' ? 'Botón 1 - Texto' :
              tipo === 'sede' ? 'Teléfono' :
              tipo === 'testimonio' ? 'Estrellas (1-5)' :
              tipo === 'tratamiento' ? 'Categoría' :
              tipo === 'producto' ? 'Marca' :
              tipo === 'consulta' ? 'Icono (emoji)' :
              tipo === 'porque' ? 'Icono (emoji)' : 'Extra 1'
            }
          />
        </Form.Item>

        {/* 👇 Ocultamos Extra2/Extra3 cuando es producto porque se auto-rellenan */}
        {tipo !== 'producto' && (
          <>
            <Form.Item name="extra2" label="Extra 2">
              <Input
                placeholder={
                  tipo === 'banner' ? 'Botón 2 - Texto' : 'Extra 2'
                }
              />
            </Form.Item>

            <Form.Item name="extra3" label="Extra 3">
              <Input
                placeholder={
                  tipo === 'banner' ? 'Botón 2 - Enlace' : 'Extra 3'
                }
              />
            </Form.Item>
          </>
        )}

        {/* 👇 Para productos, mostramos de solo lectura qué se guardará */}
        {tipo === 'producto' && (
          <div
            style={{
              background: '#f0f9fb',
              padding: 15,
              borderRadius: 8,
              marginBottom: 20,
              fontSize: 13,
              color: '#1a2b47',
            }}
          >
            <strong>Se guardará en el contenido:</strong>
            <br />
            Extra2 (idProducto): <code>{idProductoSeleccionado || '—'}</code>
            <br />
            Extra3 (idListaPrecio): <code>{idListaPrecioSeleccionada || '—'}</code>
          </div>
        )}

        <Form.Item name="orden" label="Orden">
          <Input type="number" defaultValue={0} />
        </Form.Item>

        <Form.Item label="Imagen">
          <Upload
            beforeUpload={(f) => {
              handleUpload(f);
              return false;
            }}
            showUploadList={false}
            accept="image/*"
          >
            <Button icon={<UploadOutlined />} loading={subiendo}>
              {subiendo ? 'Subiendo...' : 'Subir imagen'}
            </Button>
          </Upload>
          {imagenUrl && (
            <div style={{ marginTop: 15 }}>
              <img
                src={imagenUrl}
                alt="preview"
                style={{ width: 250, borderRadius: 8 }}
              />
            </div>
          )}
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={cargando} size="large">
            {id ? 'Actualizar' : 'Crear'}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default FormContenido;