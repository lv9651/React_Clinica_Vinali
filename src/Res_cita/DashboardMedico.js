import React, { useState, useContext, useEffect } from "react";
import { UsuarioContext } from "../context/AuthContext";
import "../CSS/DashboardMedico.css";
import { BASE_URL } from '../Medico/config'; 
const DashboardMedico = () => {
  const [menuActivo, setMenuActivo] = useState("reporte");
  const [horarios, setHorarios] = useState([]);
  const [consultas, setConsultas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const { usuario, logout } = useContext(UsuarioContext);

  // Llamada a la API de horarios
  useEffect(() => {
    if (menuActivo === "horario" && usuario?.usuarioID) {
      setLoading(true);
      fetch(
        `${BASE_URL}/api/HorarioMedico/ListarHorarioMedicoxIdMedico/${usuario.usuarioID}`
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.mensaje === "OK" && data.objeto) {
            const horariosParseados = JSON.parse(data.objeto);
            setHorarios(horariosParseados);
          } else {
            setHorarios([]);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error al cargar horarios:", err);
          setLoading(false);
        });
    }
  }, [menuActivo, usuario]);

  // Llamada a la API para el reporte de consultas
  const obtenerReporte = () => {
    const fechaInicioSinHora = new Date(fechaInicio).toISOString().split("T")[0];
    const fechaFinSinHora = new Date(fechaFin).toISOString().split("T")[0];

    if (!fechaInicio || !fechaFin) {
      alert("Por favor, seleccione un rango de fechas.");
      return;
    }

    setLoading(true);

    const url = `${BASE_URL}/api/Medicos/consultas?fechaInicio=${fechaInicioSinHora}&fechaFin=${fechaFinSinHora}&usuarioId=${usuario.usuarioID}`;
    console.log("URL de la API:", url);

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        console.log("Datos recibidos:", JSON.stringify(data, null, 2));

        if (Array.isArray(data) && data.length > 0) {
          const consultasFiltradas = data.filter((consulta) => {
            const fechaConsultaSinHora = consulta.fecha.split("T")[0];
            return (
              fechaConsultaSinHora >= fechaInicioSinHora &&
              fechaConsultaSinHora <= fechaFinSinHora
            );
          });
          setConsultas(consultasFiltradas);
        } else {
          setConsultas([]);
        }

        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar consultas:", err);
        setLoading(false);
      });
  };

  const renderContenido = () => {
    switch (menuActivo) {
      case "reporte":
        return (
          <div className="reporte-container">
            <h2>📊 Reporte de Consultas</h2>

            {/* Selector de fechas */}
            <div className="fecha-selector">
              <label htmlFor="fechaInicio">Fecha Inicio:</label>
              <input
                type="date"
                id="fechaInicio"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
              />
              <label htmlFor="fechaFin">Fecha Fin:</label>
              <input
                type="date"
                id="fechaFin"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
              />
            </div>

            {/* Botón para obtener el reporte */}
            <button className="obtener-reporte-btn" onClick={obtenerReporte}>
              Obtener Reporte
            </button>

            {/* Mostrar el reporte */}
            {loading ? (
              <p className="loading-text">⏳ Cargando consultas...</p>
            ) : consultas.length > 0 ? (
              <table className="tabla-consultas">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Sede</th>
                    <th>Médico</th>
                    <th>Turno</th>
                    <th>Pago Turno</th>
                    <th>Consultas</th>
                    <th>Cant. Proc.</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {consultas.map((consulta, index) => {
                    const fecha = new Date(
                      consulta.fecha
                    ).toLocaleDateString("es-PE");
                    const pagoTurno = parseFloat(
                      consulta.pagO_TURNO
                    ).toLocaleString("es-PE", {
                      style: "currency",
                      currency: "PEN",
                    });
                    const total = parseFloat(consulta.total).toLocaleString(
                      "es-PE",
                      {
                        style: "currency",
                        currency: "PEN",
                      }
                    );

                    return (
                      <tr key={index}>
                        <td>{fecha}</td>
                        <td>{consulta.sede}</td>
                        <td>{consulta.medico}</td>
                        <td>{consulta.turno}</td>
                        <td>{pagoTurno}</td>
                        <td>{consulta.n_CONSULTAS}</td>
                        <td>{consulta.canT_PROC}</td>
                        <td>{total}</td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="5" style={{ textAlign: "right", fontWeight: "bold" }}>
                      Totales:
                    </td>
                    <td style={{ fontWeight: "bold" }}>
                      {consultas.reduce((sum, c) => sum + (c.n_CONSULTAS || 0), 0)}
                    </td>
                    <td style={{ fontWeight: "bold" }}>
                      {consultas.reduce((sum, c) => sum + (c.canT_PROC || 0), 0)}
                    </td>
                    <td style={{ fontWeight: "bold" }}>
                      {consultas
                        .reduce(
                          (sum, c) => sum + (parseFloat(c.total) || 0),
                          0
                        )
                        .toLocaleString("es-PE", {
                          style: "currency",
                          currency: "PEN",
                        })}
                    </td>
                  </tr>
                </tfoot>
              </table>
            ) : (
              <p className="empty-text">
                😅 No hay consultas registradas en este rango de fechas.
              </p>
            )}
          </div>
        );

      case "horario":
        return (
          <div className="reporte-container">
            <h2>🕒 Horario del Médico</h2>
            {loading ? (
              <p className="loading-text">⏳ Cargando horario...</p>
            ) : horarios.length > 0 ? (
              <table className="tabla-horarios">
                <thead>
                  <tr>
                    <th>Modalidad</th>
                    <th>Fecha</th>
                    <th>Hora Inicio</th>
                    <th>Hora Fin</th>
                  </tr>
                </thead>
                <tbody>
                  {horarios.map((h) => {
                    const fecha = new Date(h.fechainicio).toLocaleDateString();
                    const horaInicio = new Date(
                      h.fechainicio
                    ).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    });
                    const horaFin = new Date(h.fechafin).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    });

                    return (
                      <tr key={h.idhorariomedico}>
                        <td>
                          <span
                            className={`badge ${
                              h.modalidad === "PRESENCIAL"
                                ? "badge-presencial"
                                : "badge-virtual"
                            }`}
                          >
                            {h.modalidad}
                          </span>
                        </td>
                        <td>{fecha}</td>
                        <td>{horaInicio}</td>
                        <td>{horaFin}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <p className="empty-text">
                😅 No hay horarios registrados para este médico.
              </p>
            )}
          </div>
        );

      default:
        return <h2>Selecciona una opción del menú</h2>;
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div>
          <h1 className="titulo">🏥 Dashboard Médico</h1>
          {usuario && (
            <p className="bienvenida">
              👋 Bienvenido, <strong>{usuario.nombres || "Usuario"}</strong>
            </p>
          )}

          <nav>
            <button
              className={`menu-btn ${menuActivo === "horario" ? "activo" : ""}`}
              onClick={() => setMenuActivo("horario")}
            >
              🕒 Horario
            </button>

            <button
              className={`menu-btn ${menuActivo === "reporte" ? "activo" : ""}`}
              onClick={() => setMenuActivo("reporte")}
            >
              📊 Reporte
            </button>
          </nav>
        </div>

        {/* Botón cerrar sesión */}
        <button className="logout-btn" onClick={logout}>
          🚪 Cerrar Sesión
        </button>
      </aside>

      {/* Contenido principal */}
      <main className="contenido">{renderContenido()}</main>
    </div>
  );
};

export default DashboardMedico;