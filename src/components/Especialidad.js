import React from 'react';
import '../CSS/Especialidad.css'; // Asegúrate de que los estilos son los adecuados

const Especialidad = () => {
  // Datos de especialidades médicas, sus descripciones y las imágenes
  const especialidad = [
    {
      id: 1,
      nombre: 'Psicología',
      descripcion: 'En Vinali ofrecemos un servicio personalizado y cercano, por parte de profesionales acreditados y con experiencia clínica. Nuestro objetivo es ayudarle a evaluar de forma adecuada y constructiva sus problemas y conflictos y así poder superarlos.',
      imagen: '/endoc.jpg' // Asegúrate de que la ruta de la imagen sea correcta
    },
    {
      id: 2,
      nombre: 'Cardiología',
      descripcion: 'La cardiología es la especialidad médica que se encarga del diagnóstico y tratamiento de enfermedades del corazón y el sistema circulatorio. Los cardiólogos se enfocan en problemas como hipertensión, insuficiencia cardíaca, y enfermedades arteriales.',
      imagen: '/nutricion.jpg'
    },
    {
      id: 3,
      nombre: 'Pediatría',
      descripcion: 'La pediatría se enfoca en la atención médica de los niños, desde el nacimiento hasta la adolescencia. Los pediatras se encargan de diagnosticar y tratar enfermedades comunes en la infancia, así como de promover el bienestar general del niño.',
      imagen: '/psicologia.jpg'
    },
    {
      id: 4,
      nombre: 'Neurología',
      descripcion: 'La neurología es la especialidad médica que trata los trastornos del sistema nervioso, incluyendo el cerebro, la médula espinal y los nervios periféricos. Los neurólogos diagnostican enfermedades como Alzheimer, epilepsia, y migrañas.',
      imagen: '/medic.jpg'
    }
    // Puedes añadir más especialidades y descripciones aquí...
  ];

  return (
    <div className="especialidades-container">
      <h2>Especialidades Médicas</h2>
      <div className="especialidades-list">
        {especialidad.map((especialidad) => (
          <div key={especialidad.id} className="especialidad-card">
            <img src={especialidad.imagen} alt={especialidad.nombre} className="especialidad-imagen" />
            <div className="especialidad-info">
              <h3>{especialidad.nombre}</h3>
              <p>{especialidad.descripcion}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Especialidad;