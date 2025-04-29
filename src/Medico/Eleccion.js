import React, { useState, useEffect,useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { UsuarioContext } from '../context/AuthContext';
import Notification from '../Medico/Notification'; 
import { BASE_URL } from './config'; 
import '../CSS/Eleccion.css'; 

const Eleccion = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { especialidad, medico, sucursal, dia, hora ,idesucursal,idhorariomedicodividido,idpaciente,Horariomedic,TipoModalidad} = location.state || {};

  const [selectedData, setSelectedData] = useState({
    especialidad,
    medico,
    sucursal,
    dia,
    hora,
    idesucursal,
    idhorariomedicodividido,idpaciente,Horariomedic,TipoModalidad
  });
  const [trans, setTrans] = useState('')
  const [tipoPago, setTipoPago] = useState([]);
  const [mostrarSelect, setMostrarSelect] = useState(false);
  const [documento, setDocumento] = useState('2'); // Guardar el tipo de documento
  const [precioFijo, setPrecio] = useState('2'); 
  const [idprecioprod, setIdprecioprod] = useState('2'); 

  const IGV = 0.18; // IGV del 18%
  const { user, logout ,dni, setUser,usuario} = useContext(UsuarioContext);
  const [notification, setNotification] = useState(null); 
  
  const calcularSubtotal = () => {
    if(selectedData.TipoModalidad===2){
      const precioDecimal = parseFloat(50);  // Convertir a número decimal
      return precioDecimal; 
    }
    const precioDecimal = parseFloat(precioFijo);  // Convertir a número decimal
    return precioDecimal;  // Subtotal es igual al precio convertido
  };


 
  const calcularTotal = () => {
    if (documento === '1') {
      return calcularSubtotal() * (1 + IGV); // Aplica el IGV si es Factura
    }
    return calcularSubtotal(); // Total igual al subtotal si es Boleta
  };

  // Cargar el script de Izipay solo una vez
  useEffect(() => {
    const loadIzipayScript = () => {
      // Verificar si Izipay ya está cargado
      if (window.Izipay) {
        {/*  console.log("Izipay ya está cargado");*/}
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.izipay.pe/payments/v1/js/index.js';

       {/*https://sandbox-checkout.izipay.pe/payments/v1/js/index.js*/}

   
      script.async = true;
      script.onload = () => {
       {/*   console.log("Izipay SDK cargado correctamente");*/}
      };
      script.onerror = () => {
        console.error("Error al cargar el script de Izipay");
      };

      document.body.appendChild(script);
    };

    loadIzipayScript();
  }, []); // El array vacío asegura que esto solo se ejecute una vez al montar el componente



  function generateTransactionId() {
    const date = new Date();

    // Obtener día, mes, año, hora, minutos y segundos
    const day = addLeadingZero(date.getDate());
    const month = addLeadingZero(date.getMonth() + 1); // Los meses en JavaScript son 0-indexados
    const year = date.getFullYear().toString().slice(-2); // Últimos dos dígitos del año
    const hour = addLeadingZero(date.getHours());
    const minutes = addLeadingZero(date.getMinutes());
    const seconds = addLeadingZero(date.getSeconds());

    // Construir el transactionId
    const transactionId = `${day}${month}${year}${hour}${minutes}${seconds}`;
    return transactionId;
}

function addLeadingZero(number) {
    return number < 10 ? `0${number}` : number.toString();
}








  const obtenerTiposDePago = async () => {

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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ListaPrecio),
      });
  
      const dataa = await responsee.json();
      
      setPrecio(dataa[0].precio);
      setIdprecioprod(dataa[0].idprecioproducto);

      console.log(dataa[0].idprecioproducto);


     


      setMostrarSelect(true);
    } catch (error) {
      console.error('Error al obtener los tipos de pago:', error);
      alert('Hubo un error al cargar los tipos de pago.');
    }
  };

  const realizarPago = async () => {
    const transactionId=generateTransactionId() ;
    setTrans(transactionId); 
    const paymentData = {
      transactionId: transactionId,
      paymentType: "CONTADO",
      amount: calcularTotal().toFixed(2),
      orderNumber:  `${selectedData.Horariomedic}${selectedData.idhorariomedicodividido}${usuario.usuarioID}`,
      creditAvailable: 0,
      firstName: usuario.nombres ,
      lastName: usuario.apellidoPaterno,
      email: usuario.correo,
      phoneNumber:usuario.telefono,
      street: "los olivos",
      documentNumber: usuario.numeroDocumento,
    };

   

    try {
      const response = await fetch(`${BASE_URL}/api/Payment/process-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      const data = await response.json();
   
  
      if (data.code === "00" && data.message === "OK") {
        {/*  console.log('Obtener proceso éxito');
        console.log('Respuesta del servidor:', data);
*/}
        // Aquí se obtiene el token y se carga el formulario de Izipay
        const token = data.response.token; // Asegúrate de que tu API devuelve el token aquí
      
        if (window.Izipay) {
          const checkout = new window.Izipay({
            config: {
              transactionId: transactionId,
              action: 'pay',
              merchantCode: '4079862',
              
              //4007701
              order: {
                orderNumber:  `${selectedData.Horariomedic}${selectedData.idhorariomedicodividido}${usuario.usuarioID}`,
                currency: 'PEN',
                amount: calcularTotal().toFixed(2),
                processType: 'AT',
                merchantBuyerId: '4079862',
                dateTimeTransaction: '1670258741603000',
              },
              billing: {
                firstName: usuario.nombres,
                lastName: usuario.apellidoPaterno,
                email: usuario.correo,
                phoneNumber: usuario.telefono,
                street: "los olivos",
                city: 'Lima',
                state: 'Lima',
                country: 'PE',
                postalCode: '15038',
                documentType: 'DNI',
                document:usuario.numeroDocumento,
              }
            }
          });

          checkout.LoadForm({
            authorization: token,
            keyRSA: 'YOUR_RSA_KEY', // Aquí va tu clave pública RSA
            callbackResponse: (response) => {
       
              if (response.code === '00') {
                setNotification({
                  
                  message: 'Pago realizado con éxito',
                  type: 'success',

                });
                GuardarPago();
                EnviarRegistroUsuario();
                navigate('/Cita_cliente')
              } else {
                setNotification({
                  message: `Error en el pago: ${response.message}`,
                  type: 'error',
                });
              }
            },
          });
        }
      } else {
        setNotification({
          message: `Error en el proceso: ${data.message}`,
          type: 'error',
        });
      }
    } catch (error) {
    
      
      setNotification({
        message: 'Hubo un problema al procesar el pago.',
        type: 'error',
      });
    }
  };

  const closeNotification = () => {
    setNotification(null); // Cierra la notificación
  };



  
  const EnviarRegistroUsuario = async () => {


    // Crear el cuerpo de la solicitud con la estructura que la API requiere
    const ventaData = {
      especialidad: selectedData.especialidad, // Debes tomar el ID de sucursal de los datos seleccionados
      medico:  `${selectedData.medico?.nombres} ${selectedData.medico?.apellidopaterno} ${selectedData.medico?.apellidomaterno}`,
      sucursal:selectedData.sucursal,
      dia:selectedData.dia,
      hora:selectedData.hora,
      email:usuario.correo,
      Nombre: `${usuario.nombres} ${usuario.apellidoPaterno}`



    };
  
    try {
      // Llamada a la API para procesar el pago y registrar la venta
      const response = await fetch(`${BASE_URL}/api/Citas/enviar-detalles-cita`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ventaData),
      });
  
      const data = await response.json();
   
      
      
    
    } catch (error) {
      console.error('Error al registrar la venta:', error);
    
    }
  };

  const GuardarPago = async () => {


    // Crear el cuerpo de la solicitud con la estructura que la API requiere
    const ventaData = {
      IdSucursal: selectedData.idesucursal, // Debes tomar el ID de sucursal de los datos seleccionados
      IdDocumentoTributario: documento === '1' ? 1 : 2, // Establecer el tipo de documento (Factura o Boleta)
      JsonVenta: JSON.stringify([{
        idcliente: usuario.usuarioID,  // Asegúrate de tener el id del cliente
        total: calcularTotal().toFixed(2),
        textomoneda: 'PEN',  // Suponiendo que el pago es en soles, puedes ajustarlo si es en USD u otra moneda
        nombretabla: 'Citas.Cita'  // Este campo parece ser estático según tu API
      }]),
      Json: JSON.stringify([{
        idprocedenciaregistro: 5,  // Asegúrate de que estos valores estén definidos correctamente en tu contexto
        idorigencita: 5,           // Similar con estos campos
        idtipoespecialidad: 1      // Ajusta según el tipo de especialidad
      }]),
      JsonVentaPago: JSON.stringify([{
        idtipopago: tipoPago[0]?.codigo,  // Asegúrate de que `tipoPago` esté correctamente inicializado
        idtipotarjeta: 2,                 // Este es un ejemplo, puedes obtener el valor adecuado
        importe: calcularTotal().toFixed(2)
      }]),
      JsonVentaDetalle: JSON.stringify([{
        idprecioproducto: idprecioprod,  // Este es un ejemplo, ajusta al producto correcto si es necesario
        precio: calcularSubtotal().toFixed(2)
      }]),
      UsuarioManipula: 32,  // El id del usuario que maneja la venta
      IdCita: selectedData.idcita, 
      idpaciente: selectedData.idpaciente, // Asegúrate de obtener este valor correctamente
      IdHorarioMedicoDividido: selectedData.idhorariomedicodividido  // Asegúrate de tener el valor correcto
    };
  
    try {
      // Llamada a la API para procesar el pago y registrar la venta
      const response = await fetch(`${BASE_URL}/api/Ventas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ventaData),
      });
  
      const data = await response.json();
  
      
      if (data.message==='Venta creada exitosamente.') {
       

        


        try {
          // Obtener el ID de la venta recién creada
          const idVenta = data.idVenta;
          
          // Llamar a la segunda API con el ID de la venta
          const responseNubefact = await fetch(`${BASE_URL}/api/Venta/EnviarJsonVentaNubefact/${idVenta}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            // Agrega body si necesitas enviar datos adicionales
          });
      
          if (!responseNubefact.ok) {
            throw new Error('Error al enviar a Nubefact');
          }
      
          const resultNubefact = await responseNubefact.json();
          setNotification({
            message: 'Venta registrada y enviada a Nubefact exitosamente',
            type: 'success',
          });
          
        } catch (error) {
          setNotification({
            message: 'Venta registrada pero hubo un problema al enviar a Nubefact',
            type: 'warning', // o 'error' según prefieras
          });
        }









      
       
      } else {
        setNotification({
          message: `Error al registrar la venta: ${data.message}`,
          type: 'error',
        });
      }
    } catch (error) {
     
      setNotification({
        message: 'Hubo un problema al registrar la venta.',
        type: 'error',
      });
    }
  };

  return (
    <div className="container mt-5" style={{ display: 'flex', justifyContent: 'space-between' }}>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={closeNotification}
        />
      )}

      <div className="container mt-0" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div className="row justify-content-center" style={{ flex: 1 }}>
          <div className="col-md-20">
            <div className="card shadow-lg p-4 border-0 rounded-4">
              <div className="d-flex justify-content-start mb-4">
                <button
                  className="btn btn-primary"
                  onClick={() => navigate(-1)}
                  style={{
                    padding: '12px 10px',
                    fontSize: '1.2rem',
                    borderRadius: '25px',
                    boxShadow: '0px 4px 10px rgba(0, 123, 255, 0.1)',
                    transition: 'background-color 0.3s ease, transform 0.2s ease',
                  }}
                  onMouseEnter={(e) => (e.target.style.transform = 'scale(1.05)')}
                  onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
                >
                  Volver Atrás
                </button>
              </div>

              <h3 className="mb-4 text-center" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '900' }}>
                Lo que has escogido hasta el momento
              </h3>

              {/* Mostrar datos seleccionados */}
              {[{ label: 'Especialidad', value: selectedData.especialidad, icon: 'heart-pulse-fill' },
                { label: 'Médico', value: `Dr(a). ${selectedData.medico?.nombres} ${selectedData.medico?.apellidopaterno} ${selectedData.medico?.apellidomaterno}`, icon: 'person-fill' },
                { label: 'Sucursal', value: selectedData.sucursal, icon: 'building' },
                { label: 'Día', value: selectedData.dia, icon: 'calendar-date' },
                { label: 'Hora', value: selectedData.hora, icon: 'clock' }].map((item, index) => (
                  <div key={index} className="card mb-3 border-0 rounded-3" style={{ backgroundColor: '#f9f9f9' }}>
                    <div className="row align-items-center">
                      <div className="col-10">
                        <span style={{ fontSize: '1.3rem', fontWeight: '600', color: '#333' }}>{item.label}:</span>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12">
                        <span
                          style={{
                            fontSize: '1.25rem',
                            color: '#555',
                            padding: '8px 12px',
                            border: '2px solid #007BFF',
                            borderRadius: '8px',
                            backgroundColor: '#f1faff',
                            display: 'inline-flex',
                            alignItems: 'center',
                          }}
                        >
                          <i
                            className={`bi bi-${item.icon}`}
                            style={{
                              fontSize: '1.5rem',
                              color: '#007BFF',
                              marginRight: '8px',
                            }}
                          ></i>
                          {item.value}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

            </div>
          </div>
        </div>
      </div>

      {/* Mostrar el formulario de pago */}
      <div className="col-md-3 col-12" style={{ marginLeft: '0' }}>
  <div className="card shadow p-4 border-0 rounded-4 text-center">
          <h4 className="mb-3" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '700', color: '#333' }}>
            Pago en Línea
          </h4>
          <p style={{ fontSize: '1rem', color: '#555' }}>Confirma tu cita con un pago seguro.</p>
          <button
            className="btn btn-success mb-3"
            style={{
              padding: '12px 20px',
              fontSize: '1.2rem',
              borderRadius: '25px',
              boxShadow: '0px 4px 10px rgba(40, 167, 69, 0.2)',
              transition: 'background-color 0.3s ease, transform 0.2s ease',
            }}
            onMouseEnter={(e) => (e.target.style.transform = 'scale(1.05)')}
            onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
            onClick={obtenerTiposDePago}
          >
            Pago en Linea
          </button>

          {mostrarSelect && (
            <div>
              <label style={{ fontWeight: '600', fontSize: '1.1rem', color: '#555' }}>
                Tipo de Documento:
              </label>
              <select
                className="form-select mt-2"
                value={documento}
                onChange={(e) => setDocumento(e.target.value)}
              >
                <option value="2">Boleta</option>
                <option value="1">Factura</option>
              </select>

              <div className="mt-4">
                <p style={{ fontSize: '1rem', color: '#555', fontWeight: '600' }}>
                  Subtotal: S/ {calcularSubtotal().toFixed(2)}
                </p>
                {documento === '1' && (
                  <p style={{ fontSize: '1rem', color: '#555', fontWeight: '600' }}>
                    IGV (18%): S/ {(calcularSubtotal() * IGV).toFixed(2)}
                  </p>
                )}
                <p style={{ fontSize: '1.2rem', fontWeight: '700', color: '#333' }}>
                  Total: S/ {calcularTotal().toFixed(2)}
                </p>
                <button
                  className="btn btn-primary"
                  style={{
                    padding: '12px 20px',
                    fontSize: '1.2rem',
                    borderRadius: '25px',
                    boxShadow: '0px 4px 10px rgba(0, 123, 255, 0.2)',
                    backgroundColor: '#28a745',
                    border: 'none',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.05)';
                    e.target.style.backgroundColor = '#218838';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.backgroundColor = '#28a745';
                  }}
                  onClick={realizarPago}
                >
                  Pagar S/ {calcularTotal().toFixed(2)}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Eleccion;