import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { UsuarioContext } from '../context/AuthContext';
import Notification from '../Medico/Notification';
import { BASE_URL } from './config';
import {
  FaWhatsapp,
  FaArrowLeft,
  FaCreditCard,
  FaTrash,
} from 'react-icons/fa';

const Eleccion = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    especialidad,
    medico,
    sucursal,
    dia,
    hora,
    idesucursal,
    idhorariomedicodividido,
    idpaciente,
    Horariomedic,
    TipoModalidad,
    idtipoespecialidad,
    idprocedenciaregistro,
  } = location.state || {};

  const [selectedData] = useState({
    especialidad,
    medico,
    sucursal,
    dia,
    hora,
    idesucursal,
    idhorariomedicodividido,
    idpaciente,
    Horariomedic,
    TipoModalidad,
    idtipoespecialidad,
    idprocedenciaregistro,
  });

  const [trans, setTrans] = useState('');
  const [tipoPago, setTipoPago] = useState([]);
  const [documento, setDocumento] = useState('2');
  const [precioFijo, setPrecio] = useState(null);
  const [idprecioprod, setIdprecioprod] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [procesando, setProcesando] = useState(false);
  const [serviciosPendientes, setServiciosPendientes] = useState([]);
  const [productosCarrito, setProductosCarrito] = useState([]);
  const [notification, setNotification] = useState(null);

  const IGV = 0.18;
  const { usuario } = useContext(UsuarioContext);

  // ============================================================
  // 🔑 ID del paciente activo (solo para CITAS)
  // ============================================================
  const getIdActivo = () => {
    return (
      selectedData.idpaciente ||
      localStorage.getItem('idPacienteActivo') ||
      usuario?.usuarioID ||
      null
    );
  };

  // ============================================================
  // 🛒 CARGAR CARRITO (CITAS + PRODUCTOS)
  // ============================================================
  useEffect(() => {
    const idActivo = getIdActivo();

    if (idActivo) {
      const keyCitas = `serviciosPendientes_${idActivo}`;
      const citas = JSON.parse(localStorage.getItem(keyCitas) || '[]');
      setServiciosPendientes(citas);
    } else {
      setServiciosPendientes([]);
    }

    if (usuario?.usuarioID) {
      const keyProductos = `carritoProductos_${usuario.usuarioID}`;
      const productos = JSON.parse(localStorage.getItem(keyProductos) || '[]');
      setProductosCarrito(productos);
    } else {
      setProductosCarrito([]);
    }
  }, [idpaciente, usuario]);

  // ============================================================
  // 💳 CARGAR SCRIPT DE IZIPAY
  // ============================================================
  useEffect(() => {
    const loadIzipayScript = () => {
      if (window.Izipay) return;

    /*https://sandbox-checkout.izipay.pe/payments/v1/js/index.js*/
      const script = document.createElement('script');
      script.src = 'https://checkout.izipay.pe/payments/v1/js/index.js';
      script.async = true;
      script.onload = () => {};
      script.onerror = () => {
        console.error('Error al cargar el script de Izipay');
      };

      document.body.appendChild(script);
    };

    loadIzipayScript();
  }, []);

  // ============================================================
  // 🔒 BLOQUEAR SCROLL MIENTRAS SE PROCESA EL PAGO
  // ============================================================
  useEffect(() => {
    if (procesando) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [procesando]);

  // ============================================================
  // PASOS
  // ============================================================
  const pasos = [
    { numero: 1, label: '¿Qué necesitas?', activo: false, completado: true },
    { numero: 2, label: 'Elige especialista', activo: false, completado: true },
    { numero: 3, label: 'Elige sede', activo: false, completado: true },
    { numero: 4, label: 'Fecha y hora', activo: false, completado: true },
    { numero: 5, label: 'Tus datos', activo: true, completado: false },
    { numero: 6, label: 'Confirmación', activo: false, completado: false },
  ];

  // ============================================================
  // CÁLCULOS
  // ============================================================
  const calcularSubtotal = () => {
    if (selectedData.TipoModalidad === 2) return parseFloat(50);
    if (precioFijo === null || precioFijo === undefined || precioFijo === '') {
      return 0;
    }
    return parseFloat(precioFijo);
  };

  const calcularSubtotalServicios = () => {
    return serviciosPendientes
      .filter(
        (s) =>
          String(s.idhorariomedicodividido) !==
          String(selectedData.idhorariomedicodividido)
      )
      .reduce(
        (acc, s) => acc + parseFloat(s.precio || 0) * (s.cantidad || 1),
        0
      );
  };

  const calcularSubtotalProductos = () => {
    return productosCarrito.reduce(
      (acc, p) => acc + parseFloat(p.precio || 0) * (p.cantidad || 1),
      0
    );
  };

  const calcularTotal = () => {
    const base =
      documento === '1'
        ? calcularSubtotal() * (1 + IGV)
        : calcularSubtotal();
    return base + calcularSubtotalServicios() + calcularSubtotalProductos();
  };

  // ============================================================
  // CARGAR PRECIO
  // ============================================================
  useEffect(() => {
    if (selectedData.especialidad && selectedData.idesucursal) {
      obtenerTiposDePago();
    }
  }, []);

  function generateTransactionId() {
    const date = new Date();
    const day = addLeadingZero(date.getDate());
    const month = addLeadingZero(date.getMonth() + 1);
    const year = date.getFullYear().toString().slice(-2);
    const hour = addLeadingZero(date.getHours());
    const minutes = addLeadingZero(date.getMinutes());
    const seconds = addLeadingZero(date.getSeconds());
    return `${day}${month}${year}${hour}${minutes}${seconds}`;
  }

  function addLeadingZero(number) {
    return number < 10 ? `0${number}` : number.toString();
  }

  const obtenerTiposDePago = async () => {
    setCargando(true);
    const ListaPrecio = {
      especialidad: selectedData.especialidad,
      idsucursal: selectedData.idesucursal,
    };

    try {
      const response = await fetch(`${BASE_URL}/api/Medicos/ObtenerTipoPago`);
      const data = await response.json();
      setTipoPago(data);

      const responsee = await fetch(`${BASE_URL}/api/Medicos/buscarPrecio`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ListaPrecio),
      });

      const dataa = await responsee.json();

      let precioObj = null;
      if (Array.isArray(dataa) && dataa.length > 0) {
        precioObj = dataa[0];
      } else if (dataa && typeof dataa === 'object' && dataa.precio) {
        precioObj = dataa;
      }

      if (precioObj && precioObj.precio) {
        setPrecio(precioObj.precio);
        setIdprecioprod(precioObj.idprecioproducto);
      } else {
        setPrecio(null);
        setIdprecioprod(null);
      }
    } catch (error) {
      console.error('Error al obtener los tipos de pago:', error);
      setPrecio(null);
      setIdprecioprod(null);
    } finally {
      setCargando(false);
    }
  };

  // ============================================================
  // 🎯 AUTO-GUARDAR CITA ACTUAL
  // ============================================================
  useEffect(() => {
    if (cargando) return;
    if (!selectedData.idhorariomedicodividido) return;
    if (precioFijo === null || precioFijo === undefined) return;

    const idActivo = getIdActivo();
    if (!idActivo) return;

    const key = `serviciosPendientes_${idActivo}`;
    const guardados = JSON.parse(localStorage.getItem(key) || '[]');

    const yaExiste = guardados.some(
      (s) =>
        String(s.idhorariomedicodividido) ===
        String(selectedData.idhorariomedicodividido)
    );

    if (yaExiste) return;

    const now = new Date();
    const pad = (n, l = 2) => String(n).padStart(l, '0');
    const codigoUnico = `SRV-${now.getFullYear()}${pad(
      now.getMonth() + 1
    )}${pad(now.getDate())}-${pad(now.getHours())}${pad(
      now.getMinutes()
    )}${pad(now.getSeconds())}-${pad(
      Math.floor(Math.random() * 1000),
      3
    )}`;

    const nuevaCita = {
      codigoUnico,
      especialidad: selectedData.especialidad,
      medico: selectedData.medico,
      sucursal: selectedData.sucursal,
      idesucursal: selectedData.idesucursal,
      dia: selectedData.dia,
      hora: selectedData.hora,
      idhorariomedicodividido: selectedData.idhorariomedicodividido,
      Horariomedic: selectedData.Horariomedic,
      TipoModalidad: selectedData.TipoModalidad,
      idtipoespecialidad: selectedData.idtipoespecialidad,
      idprocedenciaregistro: selectedData.idprocedenciaregistro,
      idpaciente: selectedData.idpaciente,
      descripcion: selectedData.especialidad,
      precio: calcularSubtotal().toFixed(2),
      idprecioproducto: idprecioprod,
      cantidad: 1,
      fecha: new Date().toISOString(),
    };

    const actualizados = [...guardados, nuevaCita];
    localStorage.setItem(key, JSON.stringify(actualizados));
    setServiciosPendientes(actualizados);
    window.dispatchEvent(new Event('carritoActualizado'));
  }, [cargando, precioFijo, selectedData.idhorariomedicodividido]);

  // ============================================================
  // ➕ AGREGAR SERVICIO
  // ============================================================
  const agregarServicio = () => {
    if (procesando) return;
    const idActivo = getIdActivo();
    navigate('/S_per_familiar?tipo=1', {
      state: {
        cli_codigo: idActivo,
        tipo: TipoModalidad,
      },
    });
  };

  // ============================================================
  // 🗑️ ELIMINAR CITA AGREGADA
  // ============================================================
  const eliminarServicio = (codigoUnico) => {
    if (procesando) return;
    if (!window.confirm('¿Seguro que deseas eliminar esta cita?')) return;

    const idActivo = getIdActivo();
    if (!idActivo) return;

    const key = `serviciosPendientes_${idActivo}`;
    const actualizados = serviciosPendientes.filter(
      (s) => s.codigoUnico !== codigoUnico
    );
    localStorage.setItem(key, JSON.stringify(actualizados));
    setServiciosPendientes(actualizados);
    window.dispatchEvent(new Event('carritoActualizado'));

    setNotification({
      message: 'Cita eliminada correctamente.',
      type: 'success',
    });
  };

  // ============================================================
  // 🗑️ ELIMINAR CITA ACTUAL
  // ============================================================
  const eliminarCitaActual = () => {
    if (procesando) return;
    if (
      !window.confirm(
        '¿Seguro que deseas eliminar esta cita? Volverás a elegir especialista.'
      )
    )
      return;

    const idActivo = getIdActivo();
    if (!idActivo) return;

    const key = `serviciosPendientes_${idActivo}`;
    const guardados = JSON.parse(localStorage.getItem(key) || '[]');
    const filtrados = guardados.filter(
      (s) =>
        String(s.idhorariomedicodividido) !==
        String(selectedData.idhorariomedicodividido)
    );
    localStorage.setItem(key, JSON.stringify(filtrados));
    setServiciosPendientes(filtrados);

    window.dispatchEvent(new Event('carritoActualizado'));

    navigate('/medico', {
      state: {
        cli_codigo: idActivo,
        tipo: TipoModalidad,
      },
    });
  };

  // ============================================================
  // 🛍️ EDITAR PRODUCTOS
  // ============================================================
  const aumentarCantidad = (idProducto) => {
    if (procesando) return;
    if (!usuario?.usuarioID) return;
    const key = `carritoProductos_${usuario.usuarioID}`;

    const actualizados = productosCarrito.map((p) =>
      p.idProducto === idProducto ? { ...p, cantidad: p.cantidad + 1 } : p
    );

    localStorage.setItem(key, JSON.stringify(actualizados));
    setProductosCarrito(actualizados);
    window.dispatchEvent(new Event('carritoActualizado'));
  };

  const disminuirCantidad = (idProducto) => {
    if (procesando) return;
    if (!usuario?.usuarioID) return;
    const key = `carritoProductos_${usuario.usuarioID}`;

    const actualizados = productosCarrito.map((p) =>
      p.idProducto === idProducto && p.cantidad > 1
        ? { ...p, cantidad: p.cantidad - 1 }
        : p
    );

    localStorage.setItem(key, JSON.stringify(actualizados));
    setProductosCarrito(actualizados);
    window.dispatchEvent(new Event('carritoActualizado'));
  };

  const eliminarProducto = (idProducto) => {
    if (procesando) return;
    if (!window.confirm('¿Eliminar este producto?')) return;
    if (!usuario?.usuarioID) return;

    const key = `carritoProductos_${usuario.usuarioID}`;

    const actualizados = productosCarrito.filter(
      (p) => p.idProducto !== idProducto
    );

    localStorage.setItem(key, JSON.stringify(actualizados));
    setProductosCarrito(actualizados);
    window.dispatchEvent(new Event('carritoActualizado'));

    setNotification({
      message: 'Producto eliminado.',
      type: 'success',
    });
  };

  // ============================================================
  // 💳 REALIZAR PAGO (IZIPAY)
  // ============================================================
  const realizarPago = async () => {
    if (procesando) return;
    if (totalItems === 0 || cargando) return;

    setProcesando(true);

    const transactionId = Date.now().toString();
    setTrans(transactionId);

    // 🧊 Congelamos el monto para que no cambie a mitad del proceso
    const montoFinal = calcularTotal().toFixed(2);

    const telefonoUsuario =
      usuario.telefono && usuario.telefono.trim() !== ''
        ? usuario.telefono
        : usuario.celular && usuario.celular.trim() !== ''
        ? usuario.celular
        : '999999999';

    // ✅ orderNumber = transactionId (12 dígitos)
    // const orderNumber = `${selectedData.Horariomedic}${selectedData.idhorariomedicodividido}${usuario.usuarioID}`;
    const orderNumber = transactionId;







    const paymentData = {
      transactionId: transactionId,
      paymentType: 'CONTADO',
      amount: montoFinal,
      orderNumber: orderNumber,
      creditAvailable: 0,
      firstName: usuario.nombres,
      lastName: usuario.apellidoPaterno,
      email: usuario.correo,
      phoneNumber: telefonoUsuario,
      street: 'los olivos',
      documentNumber: usuario.numeroDocumento,
    };

    try {
      setNotification({ message: 'Procesando tu reserva...', type: 'info' });

      const response = await fetch(`${BASE_URL}/api/Payment/process-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData),
      });

      const data = await response.json();

      if (data.code === '00' && data.response.token !== '') {
        const token = data.response.token;

        if (window.Izipay) {
          const checkout = new window.Izipay({
            config: {
              transactionId: transactionId,
              action: 'pay',
              merchantCode: '4081990',

              /*4004353*/
              order: {
                orderNumber: orderNumber,
                currency: 'PEN',
                amount: montoFinal,
                processType: 'AT',
                payMethod: "CARD,QR,YAPE_CODE,PAGO_PUSH",
                merchantBuyerId: usuario.numeroDocumento,
                dateTimeTransaction: (Date.now() * 1000).toString(),
              },
              billing: {
                firstName: usuario.nombres,
                lastName: usuario.apellidoPaterno,
                email: usuario.correo,
                phoneNumber: telefonoUsuario,
                street: '1295 Charleston Road',
                city: 'Mountain View',
                state: 'LIMA',
                country: 'US',
                postalCode: '94043',
                documentType: 'DNI',
                document: usuario.numeroDocumento,
              },
            },
          });

          checkout.LoadForm({
            authorization: token,
            keyRSA: 'YOUR_RSA_KEY', // Aquí va tu clave pública RSA
            callbackResponse: async (response) => {
              if (response.code === '00'&& response.response.order[0].codeAuth!=='') {
                try {
                  const carritoFinal = [...serviciosPendientes];

                  await GuardarPago(carritoFinal, montoFinal);
                  await EnviarReservaCompleta(carritoFinal, montoFinal);

                  // Limpiar citas
                  const idActivo = getIdActivo();
                  if (idActivo) {
                    localStorage.removeItem(`serviciosPendientes_${idActivo}`);
                    localStorage.removeItem(`totalCarrito_${idActivo}`);
                  }

                  // Limpiar productos
                  if (usuario?.usuarioID) {
                    localStorage.removeItem(
                      `carritoProductos_${usuario.usuarioID}`
                    );
                  }

                  window.dispatchEvent(new Event('carritoActualizado'));

                  const metodoPagoFinal = 'Tarjeta (Izipay)';

                  setTimeout(() => {
                    navigate('/confirmacion', {
                      state: {
                        totalPagado: montoFinal,
                        metodoPago: metodoPagoFinal,
                        telefono: telefonoUsuario,
                        servicios: carritoFinal,
                        productos: productosCarrito,
                      },
                    });
                  }, 500);
                } catch (error) {
                  console.error('Error al registrar la reserva:', error);
                  setNotification({
                    message: 'Hubo un problema al registrar tu reserva.',
                    type: 'error',
                  });
                } finally {
                  setProcesando(false);
                }
              } else {
                setNotification({
                  message: `Error en el pago: ${response.message}`,
                  type: 'error',
                });
                setProcesando(false);
              }
            },
          });
        } else {
          setNotification({
            message: 'El SDK de Izipay no está cargado.',
            type: 'error',
          });
          setProcesando(false);
        }
      } else {
        setNotification({
          message: `Error en el proceso: ${data.message}`,
          type: 'error',
        });
        setProcesando(false);
      }
    } catch (error) {
      console.error('Error al procesar el pago:', error);
      setNotification({
        message: 'Hubo un problema al procesar el pago.',
        type: 'error',
      });
      setProcesando(false);
    }
  };

  const closeNotification = () => setNotification(null);

  // ============================================================
  // 📧 ENVIAR RESERVA COMPLETA
  // ============================================================
  const EnviarReservaCompleta = async (carritoFinal, montoFinal) => {
    const codigoReserva = `VIN-${new Date().getFullYear()}-${String(
      new Date().getMonth() + 1
    ).padStart(2, '0')}${String(new Date().getDate()).padStart(
      2,
      '0'
    )}-${Math.floor(1000 + Math.random() * 9000)}`;

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const generarCodigoProducto = () => {
      let cod = 'PRD-';
      for (let i = 0; i < 6; i++) {
        cod += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return cod;
    };

    const citas = carritoFinal.map((s) => ({
      codigo: s.codigoUnico,
      especialidad: s.especialidad || s.descripcion || '',
      medico: `${s.medico?.nombres || ''} ${
        s.medico?.apellidopaterno || ''
      } ${s.medico?.apellidomaterno || ''}`.trim(),
      sucursal: s.sucursal || '',
      dia: s.dia || '',
      hora: s.hora || '',
      precio: parseFloat(s.precio || 0),
    }));

    const productos = productosCarrito.map((p) => ({
      codigo: generarCodigoProducto(),
      descripcion: p.descripcion,
      cantidad: p.cantidad || 1,
      precio: parseFloat(p.precio || 0),
      subtotal: parseFloat(p.precio || 0) * (p.cantidad || 1),
    }));

    const telefonoUsuarioFinal = () => {
      if (usuario.telefono && usuario.telefono.trim() !== '')
        return usuario.telefono;
      if (usuario.celular && usuario.celular.trim() !== '')
        return usuario.celular;
      return '999999999';
    };

    const payload = {
      Nombre: `${usuario.nombres || ''} ${
        usuario.apellidoPaterno || ''
      }`.trim(),
      Email: usuario.correo || '',
      Telefono: telefonoUsuarioFinal(),
      CodigoReserva: codigoReserva,
      MetodoPago: 'Tarjeta (Izipay)',
      TotalPagado: parseFloat(montoFinal),
      Citas: citas,
      Productos: productos,
    };

    try {
      await fetch(`${BASE_URL}/api/Citas/enviar-reserva-completa`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.error('Error al enviar reserva completa:', error);
    }
  };

  // ============================================================
  // 💾 GUARDAR PAGO
  // ============================================================
  const GuardarPago = async (carrito, montoFinal) => {
    const detalle = [];

    carrito.forEach((s) => {
      detalle.push({
        idprecioproducto: s.idprecioproducto || idprecioprod,
        precio: parseFloat(s.precio).toFixed(2),
        cantidad: s.cantidad || 1,
        idhorariomedicodividido: s.idhorariomedicodividido,
        idtipoespecialidad: s.idtipoespecialidad || 1,
        idprocedenciaregistro: s.idprocedenciaregistro || 5,
        idesucursal: s.idesucursal,
      });
    });

    productosCarrito.forEach((p) => {
      detalle.push({
        idprecioproducto: p.idProducto,
        idpack: p.idProducto,
        precio: parseFloat(p.precio).toFixed(2),
        cantidad: p.cantidad || 1,
        idesucursal: selectedData.idesucursal || 1,
      });
    });

    const totalGeneral = montoFinal;

    const ventaData = {
      IdSucursal: selectedData.idesucursal || usuario.idSucursal || 1,
      IdDocumentoTributario: documento === '1' ? 1 : 2,
      JsonVenta: JSON.stringify([
        {
          idcliente: usuario.usuarioID,
          total: totalGeneral,
          textomoneda: 'PEN',
          nombretabla: 'Citas.Cita',
        },
      ]),
      Json: JSON.stringify([
        {
          idprocedenciaregistro: selectedData.idprocedenciaregistro || 5,
          idorigencita: 5,
          idtipoespecialidad: selectedData.idtipoespecialidad || 1,
        },
      ]),
      JsonVentaPago: JSON.stringify([
        {
          idtipopago: tipoPago[0]?.codigo || 1,
          idtipotarjeta: 2,
          importe: totalGeneral,
        },
      ]),
      JsonVentaDetalle: JSON.stringify(detalle),
      UsuarioManipula: 32,
      IdCita: selectedData.idcita,
      idpaciente: selectedData.idpaciente || usuario.usuarioID,
      IdHorarioMedicoDividido: selectedData.idhorariomedicodividido,
    };

    try {
      const response = await fetch(`${BASE_URL}/api/Ventas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ventaData),
      });

      const data = await response.json();

      if (data.message === 'Venta creada exitosamente.') {
        try {
          await fetch(
            `${BASE_URL}/api/Venta/EnviarJsonVentaNubefact/${data.idVenta}`,
            { method: 'GET', headers: { 'Content-Type': 'application/json' } }
          );
        } catch (error) {
          console.warn('Error Nubefact:', error);
        }
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error al registrar la venta:', error);
      throw error;
    }
  };

  // ============================================================
  // ARRAY DE TODAS LAS CITAS
  // ============================================================
  const citaActualYaGuardada = serviciosPendientes.some(
    (s) =>
      String(s.idhorariomedicodividido) ===
      String(selectedData.idhorariomedicodividido)
  );

  const todasLasCitas = [
    ...(!citaActualYaGuardada && selectedData.especialidad
      ? [
          {
            esActual: true,
            codigoUnico: null,
            especialidad: selectedData.especialidad,
            medico: selectedData.medico,
            sucursal: selectedData.sucursal,
            dia: selectedData.dia,
            hora: selectedData.hora,
            precio: calcularSubtotal(),
          },
        ]
      : []),
    ...serviciosPendientes.map((s) => ({
      esActual:
        String(s.idhorariomedicodividido) ===
        String(selectedData.idhorariomedicodividido),
      codigoUnico: s.codigoUnico,
      especialidad: s.especialidad || s.descripcion,
      medico: s.medico,
      sucursal: s.sucursal,
      dia: s.dia,
      hora: s.hora,
      precio: parseFloat(s.precio || 0),
    })),
  ];

  const totalItems = todasLasCitas.length + productosCarrito.length;

  // ============================================================
  // 🔄 OVERLAY DE CARGA GLOBAL
  // ============================================================
  const LoadingOverlay = () =>
    procesando ? (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(3px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '20px',
          color: 'white',
          fontFamily: "'Poppins', 'Segoe UI', sans-serif",
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            border: '5px solid rgba(255,255,255,0.25)',
            borderTopColor: '#34b8c5',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <p style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>
          Procesando tu pago...
        </p>
        <p style={{ fontSize: '13px', opacity: 0.8, margin: 0 }}>
          No cierres ni recargues esta ventana
        </p>
      </div>
    ) : null;

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div
      style={{
        display: 'flex',
        gap: '25px',
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '25px 20px',
        fontFamily: "'Poppins', 'Segoe UI', sans-serif",
        background: '#f5f7fa',
        minHeight: 'calc(100vh - 200px)',
      }}
    >
      {/* 🛡️ Keyframe del spinner */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* 🛡️ OVERLAY GLOBAL DE CARGA */}
      <LoadingOverlay />

      {/* SIDEBAR IZQUIERDO */}
      <aside
        style={{
          flex: '0 0 240px',
          background: 'white',
          borderRadius: '16px',
          padding: '25px 20px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
          height: 'fit-content',
          position: 'sticky',
          top: '100px',
        }}
      >
        <h3
          style={{
            fontSize: '15px',
            fontWeight: 700,
            color: '#1a2b47',
            marginBottom: '20px',
            paddingBottom: '12px',
            borderBottom: '1px solid #e2e8f0',
          }}
        >
          Reserva tu cita
        </h3>

        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 25px 0' }}>
          {pasos.map((paso) => (
            <li
              key={paso.numero}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 0',
                color: paso.completado
                  ? '#34b8c5'
                  : paso.activo
                  ? '#1a2b47'
                  : '#a0aec0',
                fontWeight: paso.completado || paso.activo ? 600 : 400,
                fontSize: '13px',
              }}
            >
              <span
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  border: paso.completado
                    ? '2px solid #34b8c5'
                    : paso.activo
                    ? '2px solid #34b8c5'
                    : '2px solid #e2e8f0',
                  background: paso.completado
                    ? '#34b8c5'
                    : paso.activo
                    ? '#34b8c5'
                    : 'transparent',
                  color:
                    paso.completado || paso.activo ? 'white' : '#a0aec0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  fontWeight: 600,
                  flexShrink: 0,
                }}
              >
                {paso.completado ? '✓' : paso.numero}
              </span>
              <span>{paso.label}</span>
            </li>
          ))}
        </ul>

        <div
          style={{
            background: '#34b8c5',
            color: 'white',
            padding: '18px',
            borderRadius: '12px',
          }}
        >
          <h4 style={{ margin: '0 0 6px 0', fontSize: '14px' }}>
            ¿Necesitas ayuda?
          </h4>
          <p style={{ margin: '3px 0', fontSize: '12px', opacity: 0.95 }}>
            Escríbenos por WhatsApp
          </p>
          <p style={{ fontSize: '11px', opacity: 0.85, marginTop: '6px' }}>
            Lunes a domingo
            <br />
            8:00 a.m. - 9:00 p.m.
          </p>
          <a
            href="https://wa.me/51993805070"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              width: '100%',
              background: 'white',
              color: '#34b8c5',
              padding: '9px',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '12px',
              textDecoration: 'none',
              marginTop: '12px',
            }}
          >
            <FaWhatsapp /> WhatsApp
          </a>
        </div>
      </aside>

      {/* CONTENIDO CENTRAL */}
      <div style={{ flex: 1 }}>
        <button
          onClick={() => {
            if (!procesando) navigate(-1);
          }}
          disabled={procesando}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            padding: '10px 18px',
            color: '#1a2b47',
            fontWeight: 600,
            fontSize: '13px',
            cursor: procesando ? 'not-allowed' : 'pointer',
            opacity: procesando ? 0.6 : 1,
            marginBottom: '20px',
          }}
        >
          <FaArrowLeft /> Volver
        </button>

        <h1
          style={{
            fontSize: '22px',
            fontWeight: 700,
            color: '#1a2b47',
            marginBottom: '6px',
          }}
        >
          Confirma y paga
        </h1>
        <p
          style={{
            fontSize: '13px',
            color: '#718096',
            marginBottom: '20px',
          }}
        >
          Revisa los datos y elige tu método de pago.
        </p>

        {/* RESUMEN */}
        <div
          style={{
            background: 'white',
            borderRadius: '16px',
            padding: '25px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
            marginBottom: '20px',
          }}
        >
          <h3
            style={{
              fontSize: '15px',
              color: '#1a2b47',
              marginBottom: '18px',
              fontWeight: 700,
            }}
          >
            📋 Resumen de tu carrito ({totalItems})
          </h3>

          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}
          >
            {todasLasCitas.map((cita, index) => (
              <div
                key={`cita-${index}`}
                style={{
                  background: cita.esActual ? '#f0f9fb' : '#f8fafc',
                  borderRadius: '12px',
                  padding: '18px',
                  border: cita.esActual
                    ? '2px solid #34b8c5'
                    : '1px solid #e2e8f0',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '12px',
                    paddingBottom: '10px',
                    borderBottom: '1px dashed #cbd5e0',
                  }}
                >
                  <span
                    style={{
                      fontSize: '11px',
                      color: cita.esActual ? '#1a3a5c' : '#34b8c5',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                    }}
                  >
                    {cita.esActual ? '⭐ Cita actual' : `Cita agregada ${index}`}
                  </span>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '16px',
                        color: '#1a3a5c',
                        fontWeight: 800,
                      }}
                    >
                      S/ {parseFloat(cita.precio || 0).toFixed(2)}
                    </span>
                    <button
                      onClick={() =>
                        cita.esActual
                          ? eliminarCitaActual()
                          : eliminarServicio(cita.codigoUnico)
                      }
                      disabled={procesando}
                      style={{
                        background: 'transparent',
                        color: procesando ? '#cbd5e0' : '#dc2626',
                        border: 'none',
                        padding: '4px',
                        borderRadius: '6px',
                        cursor: procesando ? 'not-allowed' : 'pointer',
                        display: 'flex',
                      }}
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '10px',
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontSize: '9px',
                        color: '#a0aec0',
                        margin: 0,
                        textTransform: 'uppercase',
                        fontWeight: 700,
                      }}
                    >
                      Especialidad
                    </p>
                    <p
                      style={{
                        fontSize: '12px',
                        color: '#1a2b47',
                        margin: '2px 0 0 0',
                        fontWeight: 600,
                      }}
                    >
                      {cita.especialidad}
                    </p>
                  </div>

                  <div>
                    <p
                      style={{
                        fontSize: '9px',
                        color: '#a0aec0',
                        margin: 0,
                        textTransform: 'uppercase',
                        fontWeight: 700,
                      }}
                    >
                      Sede
                    </p>
                    <p
                      style={{
                        fontSize: '12px',
                        color: '#1a2b47',
                        margin: '2px 0 0 0',
                        fontWeight: 600,
                      }}
                    >
                      {cita.sucursal}
                    </p>
                  </div>

                  <div style={{ gridColumn: '1 / -1' }}>
                    <p
                      style={{
                        fontSize: '9px',
                        color: '#a0aec0',
                        margin: 0,
                        textTransform: 'uppercase',
                        fontWeight: 700,
                      }}
                    >
                      Especialista
                    </p>
                    <p
                      style={{
                        fontSize: '12px',
                        color: '#1a2b47',
                        margin: '2px 0 0 0',
                        fontWeight: 600,
                      }}
                    >
                      Dr(a). {cita.medico?.nombres}{' '}
                      {cita.medico?.apellidopaterno}{' '}
                      {cita.medico?.apellidomaterno}
                    </p>
                  </div>

                  <div>
                    <p
                      style={{
                        fontSize: '9px',
                        color: '#a0aec0',
                        margin: 0,
                        textTransform: 'uppercase',
                        fontWeight: 700,
                      }}
                    >
                      Fecha
                    </p>
                    <p
                      style={{
                        fontSize: '12px',
                        color: '#1a2b47',
                        margin: '2px 0 0 0',
                        fontWeight: 600,
                      }}
                    >
                      {cita.dia}
                    </p>
                  </div>

                  <div>
                    <p
                      style={{
                        fontSize: '9px',
                        color: '#a0aec0',
                        margin: 0,
                        textTransform: 'uppercase',
                        fontWeight: 700,
                      }}
                    >
                      Hora
                    </p>
                    <p
                      style={{
                        fontSize: '12px',
                        color: '#1a2b47',
                        margin: '2px 0 0 0',
                        fontWeight: 600,
                      }}
                    >
                      {cita.hora}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* PRODUCTOS */}
            {productosCarrito.length > 0 && (
              <div style={{ marginTop: '15px' }}>
                <h4
                  style={{
                    fontSize: '13px',
                    color: '#1a2b47',
                    marginBottom: '12px',
                    fontWeight: 700,
                  }}
                >
                  🛍️ Productos
                </h4>

                {productosCarrito.map((p) => (
                  <div
                    key={`prod-${p.idProducto}`}
                    style={{
                      background: '#fff7ed',
                      borderRadius: '12px',
                      padding: '15px',
                      border: '1px solid #fed7aa',
                      marginBottom: '10px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '15px',
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p
                          style={{
                            fontSize: '13px',
                            fontWeight: 700,
                            color: '#1a2b47',
                            margin: 0,
                          }}
                        >
                          {p.descripcion}
                        </p>
                        <p
                          style={{
                            fontSize: '11px',
                            color: '#718096',
                            margin: '4px 0 0 0',
                          }}
                        >
                          S/ {parseFloat(p.precio).toFixed(2)} c/u
                        </p>
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        <button
                          onClick={() => disminuirCantidad(p.idProducto)}
                          disabled={p.cantidad <= 1 || procesando}
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '6px',
                            border: '1px solid #e2e8f0',
                            background: 'white',
                            cursor:
                              p.cantidad <= 1 || procesando
                                ? 'not-allowed'
                                : 'pointer',
                            fontWeight: 700,
                            color:
                              p.cantidad <= 1 || procesando
                                ? '#cbd5e0'
                                : '#1a2b47',
                          }}
                        >
                          −
                        </button>
                        <span
                          style={{
                            minWidth: '24px',
                            textAlign: 'center',
                            fontWeight: 700,
                            fontSize: '13px',
                          }}
                        >
                          {p.cantidad}
                        </span>
                        <button
                          onClick={() => aumentarCantidad(p.idProducto)}
                          disabled={procesando}
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '6px',
                            border: '1px solid #e2e8f0',
                            background: 'white',
                            cursor: procesando ? 'not-allowed' : 'pointer',
                            fontWeight: 700,
                            color: procesando ? '#cbd5e0' : '#1a2b47',
                          }}
                        >
                          +
                        </button>
                        <span
                          style={{
                            fontSize: '14px',
                            fontWeight: 800,
                            color: '#1a3a5c',
                            minWidth: '80px',
                            textAlign: 'right',
                          }}
                        >
                          S/ {(parseFloat(p.precio) * p.cantidad).toFixed(2)}
                        </span>
                        <button
                          onClick={() => eliminarProducto(p.idProducto)}
                          disabled={procesando}
                          style={{
                            background: 'transparent',
                            color: procesando ? '#cbd5e0' : '#dc2626',
                            border: 'none',
                            cursor: procesando ? 'not-allowed' : 'pointer',
                            padding: '4px',
                          }}
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {totalItems === 0 && (
              <p
                style={{
                  textAlign: 'center',
                  color: '#a0aec0',
                  padding: '30px',
                  fontSize: '13px',
                }}
              >
                Tu carrito está vacío.
              </p>
            )}
          </div>
        </div>

        {/* PAGO */}
        {totalItems > 0 && (
          <div
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: '25px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
            }}
          >
            <h3
              style={{
                fontSize: '15px',
                color: '#1a2b47',
                marginBottom: '18px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <FaCreditCard /> Pago en línea
            </h3>

            {cargando ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '30px',
                  color: '#718096',
                }}
              >
                Cargando precio...
              </div>
            ) : (
              <div>
                <label
                  style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#1a2b47',
                    display: 'block',
                    marginBottom: '8px',
                  }}
                >
                  Tipo de Documento
                </label>
                <select
                  value={documento}
                  onChange={(e) => setDocumento(e.target.value)}
                  disabled={procesando}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    fontSize: '13px',
                    marginBottom: '20px',
                    outline: 'none',
                    fontFamily: "'Poppins', 'Segoe UI', sans-serif",
                    cursor: procesando ? 'not-allowed' : 'pointer',
                    opacity: procesando ? 0.6 : 1,
                  }}
                >
                  <option value="2">Boleta</option>
                  <option value="1">Factura</option>
                </select>

                <div
                  style={{
                    background: '#f8fafc',
                    borderRadius: '12px',
                    padding: '18px',
                    marginBottom: '20px',
                  }}
                >
                  {todasLasCitas.map((cita, i) => (
                    <div
                      key={`det-cita-${i}`}
                      style={{
                        paddingBottom: '10px',
                        borderBottom: '1px dashed #cbd5e0',
                        marginBottom: '10px',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          marginBottom: '3px',
                        }}
                      >
                        <span
                          style={{
                            fontSize: '11px',
                            color: cita.esActual ? '#1a3a5c' : '#34b8c5',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                          }}
                        >
                          {cita.esActual ? 'Cita actual' : `Cita ${i}`}
                        </span>
                        <span
                          style={{
                            fontSize: '14px',
                            color: '#1a3a5c',
                            fontWeight: 800,
                          }}
                        >
                          S/ {parseFloat(cita.precio || 0).toFixed(2)}
                        </span>
                      </div>
                      <p
                        style={{
                          fontSize: '12px',
                          color: '#1a2b47',
                          margin: '2px 0',
                          fontWeight: 600,
                        }}
                      >
                        {cita.especialidad} — {cita.sucursal}
                      </p>
                      <p
                        style={{
                          fontSize: '11px',
                          color: '#718096',
                          margin: '2px 0 0 0',
                        }}
                      >
                        📅 {cita.dia} — 🕐 {cita.hora}
                      </p>
                    </div>
                  ))}

                  {productosCarrito.map((p) => (
                    <div
                      key={`det-prod-${p.idProducto}`}
                      style={{
                        paddingBottom: '10px',
                        borderBottom: '1px dashed #cbd5e0',
                        marginBottom: '10px',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          marginBottom: '3px',
                        }}
                      >
                        <span
                          style={{
                            fontSize: '11px',
                            color: '#ea580c',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                          }}
                        >
                          🛍️ Producto
                        </span>
                        <span
                          style={{
                            fontSize: '14px',
                            color: '#1a3a5c',
                            fontWeight: 800,
                          }}
                        >
                          S/{' '}
                          {(parseFloat(p.precio) * p.cantidad).toFixed(2)}
                        </span>
                      </div>
                      <p
                        style={{
                          fontSize: '12px',
                          color: '#1a2b47',
                          margin: '2px 0',
                          fontWeight: 600,
                        }}
                      >
                        {p.descripcion}
                      </p>
                      <p
                        style={{
                          fontSize: '11px',
                          color: '#718096',
                          margin: '2px 0 0 0',
                        }}
                      >
                        {p.cantidad} x S/ {parseFloat(p.precio).toFixed(2)}
                      </p>
                    </div>
                  ))}

                  {documento === '1' && (
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginTop: '12px',
                        paddingTop: '12px',
                        borderTop: '1px dashed #cbd5e0',
                      }}
                    >
                      <span style={{ fontSize: '13px', color: '#718096' }}>
                        IGV (18%)
                      </span>
                      <span
                        style={{
                          fontSize: '13px',
                          color: '#1a2b47',
                          fontWeight: 600,
                        }}
                      >
                        S/ {(calcularSubtotal() * IGV).toFixed(2)}
                      </span>
                    </div>
                  )}

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      paddingTop: '12px',
                      borderTop: '2px solid #cbd5e0',
                      marginTop: '12px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '15px',
                        color: '#1a2b47',
                        fontWeight: 700,
                      }}
                    >
                      TOTAL A PAGAR
                    </span>
                    <span
                      style={{
                        fontSize: '20px',
                        color: '#1a3a5c',
                        fontWeight: 800,
                      }}
                    >
                      S/ {calcularTotal().toFixed(2)}
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px',
                  }}
                >
                  <button
                    onClick={realizarPago}
                    disabled={totalItems === 0 || cargando || procesando}
                    style={{
                      background:
                        totalItems === 0 || cargando || procesando
                          ? '#cbd5e0'
                          : '#34b8c5',
                      color: 'white',
                      border: 'none',
                      padding: '14px 20px',
                      borderRadius: '10px',
                      fontWeight: 700,
                      fontSize: '14px',
                      cursor:
                        totalItems === 0 || cargando || procesando
                          ? 'not-allowed'
                          : 'pointer',
                    }}
                  >
                    {procesando
                      ? 'Procesando...'
                      : `💳 Pagar S/ ${calcularTotal().toFixed(2)}`}
                  </button>

                  <button
                    onClick={agregarServicio}
                    disabled={procesando}
                    style={{
                      background: 'white',
                      color: procesando ? '#cbd5e0' : '#34b8c5',
                      border: `2px solid ${
                        procesando ? '#cbd5e0' : '#34b8c5'
                      }`,
                      padding: '14px 20px',
                      borderRadius: '10px',
                      fontWeight: 700,
                      fontSize: '14px',
                      cursor: procesando ? 'not-allowed' : 'pointer',
                    }}
                  >
                    ➕ Agregar servicio
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* SIDEBAR DERECHO */}
      <aside
        style={{
          flex: '0 0 260px',
          background: 'white',
          borderRadius: '16px',
          padding: '25px 20px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
          height: 'fit-content',
          position: 'sticky',
          top: '100px',
        }}
      >
        <h3
          style={{
            fontSize: '15px',
            fontWeight: 700,
            color: '#1a2b47',
            marginBottom: '18px',
            paddingBottom: '12px',
            borderBottom: '1px solid #e2e8f0',
          }}
        >
          Tu carrito ({totalItems})
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {todasLasCitas.map((cita, i) => (
            <div
              key={`side-cita-${i}`}
              style={{
                borderLeft: cita.esActual
                  ? '3px solid #34b8c5'
                  : '3px solid #cbd5e0',
                paddingLeft: '12px',
              }}
            >
              <p
                style={{
                  fontSize: '10px',
                  color: cita.esActual ? '#34b8c5' : '#a0aec0',
                  margin: 0,
                  textTransform: 'uppercase',
                  fontWeight: 700,
                }}
              >
                {cita.esActual ? '⭐ Cita actual' : `Cita ${i}`}
              </p>
              <p
                style={{
                  fontSize: '13px',
                  color: '#1a2b47',
                  margin: '4px 0 0 0',
                  fontWeight: 600,
                }}
              >
                {cita.especialidad}
              </p>
              <p
                style={{
                  fontSize: '11px',
                  color: '#718096',
                  margin: '2px 0 0 0',
                }}
              >
                📅 {cita.dia}, {cita.hora}
              </p>
            </div>
          ))}

          {productosCarrito.map((p) => (
            <div
              key={`side-prod-${p.idProducto}`}
              style={{
                borderLeft: '3px solid #ea580c',
                paddingLeft: '12px',
              }}
            >
              <p
                style={{
                  fontSize: '10px',
                  color: '#ea580c',
                  margin: 0,
                  textTransform: 'uppercase',
                  fontWeight: 700,
                }}
              >
                🛍️ Producto
              </p>
              <p
                style={{
                  fontSize: '13px',
                  color: '#1a2b47',
                  margin: '4px 0 0 0',
                  fontWeight: 600,
                }}
              >
                {p.descripcion}
              </p>
              <p
                style={{
                  fontSize: '11px',
                  color: '#718096',
                  margin: '2px 0 0 0',
                }}
              >
                {p.cantidad} x S/ {parseFloat(p.precio).toFixed(2)}
              </p>
            </div>
          ))}

          {totalItems === 0 && (
            <p
              style={{
                fontSize: '12px',
                color: '#a0aec0',
                textAlign: 'center',
                padding: '20px 0',
              }}
            >
              Carrito vacío
            </p>
          )}

          {totalItems > 0 && (
            <div
              style={{
                background: '#f0f9fb',
                borderRadius: '10px',
                padding: '15px',
                marginTop: '10px',
              }}
            >
              <p
                style={{
                  fontSize: '10px',
                  color: '#a0aec0',
                  margin: 0,
                  textTransform: 'uppercase',
                  fontWeight: 600,
                }}
              >
                Total a pagar
              </p>
              <p
                style={{
                  fontSize: '22px',
                  color: '#1a3a5c',
                  margin: '4px 0 0 0',
                  fontWeight: 800,
                }}
              >
                S/ {calcularTotal().toFixed(2)}
              </p>
            </div>
          )}
        </div>
      </aside>

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={closeNotification}
        />
      )}
    </div>
  );
};

export default Eleccion;