import React, { useState } from 'react';

const AppointmentForm = () => {
  const [medico, setMedico] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Reserva creada:', { medico, fecha, hora });
  };

  return (
    <div className="appointment-form">
      <h2>Reservar Cita</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Médico:
          <input
            type="text"
            value={medico}
            onChange={(e) => setMedico(e.target.value)}
            placeholder="Seleccionar médico"
            required
          />
        </label>
        <label>
          Fecha:
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            required
          />
        </label>
        <label>
          Hora:
          <input
            type="time"
            value={hora}
            onChange={(e) => setHora(e.target.value)}
            required
          />
        </label>
        <button type="submit">Confirmar Reserva</button>
      </form>
    </div>
  );
};

export default AppointmentForm;