import React from 'react';
import '../CSS/Medico.css';

const Medicos = () => {
  // Datos estáticos de médicos
  const medicos = [
    {
      id: 1,
      nombre: 'Dra. Stephanie Amelia del Pila Susano Silva',
      especialidad: 'Medicina General',
      foto: '/Elizabeth.jpg' ,
      CMP: '065447'// Ruta de la imagen
    },
    {
      id: 2,
      nombre: 'Dra. Elizabeth Elena Arena Silvera',
      especialidad: 'Pediatría',
      foto: '/Els.jpg',
       CMP: '069411'
    },
    {
      id: 3,
      nombre: 'Dr. Stephanie Amelia del Pila Susano Silva',
      especialidad: 'Neurología',
      foto: '/Elizabeth.jpg',
      CMP: '065447'
    },
    {
      id: 3,
      nombre: 'Dr. Elizabeth Elena Arena Silvera',
      especialidad: 'Neurología',
      foto: '/Els.jpg',
      CMP: '069411'
    }
,
    {
      id: 3,
      nombre: 'Dr. Carlos López',
      especialidad: 'Neurología',
      foto: '/Elizabeth.jpg',
      CMP: '065447'
    }
    // Puedes añadir más médicos estáticos aquí...
  ];

  return (
    <div className="medicos-container">
      <h2>Lista de Médicos</h2>
      <div className="medicos-list">
        {medicos.map((medico) => (
          <div key={medico.id} className="medico-card">
            <img src={medico.foto} alt={medico.nombre} className="medico-foto" />
            <h3>{medico.nombre}</h3>
            <p>Especialidad: {medico.especialidad}</p>
            <p>CMP: {medico.CMP}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Medicos;