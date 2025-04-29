import React, { useContext, useEffect, useState } from "react";
import { UsuarioContext } from "../context/AuthContext";
import { Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { BASE_URL } from "../Medico/config";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Bienvenida = () => {
  const { usuario } = useContext(UsuarioContext);
  const [imagenes, setImagenes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const obtenerImagenes = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/Medicos/ObtenerImageBanner`);
        setImagenes(response.data);
      } catch (error) {
        console.error("Error al obtener las imágenes:", error);
      }
    };

    obtenerImagenes();
  }, []);

  useEffect(() => {
    if (imagenes.length > 0) {
      const interval = setInterval(() => {
        setIndex((prevIndex) => (prevIndex + 1) % imagenes.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [imagenes]);

  const handleImageClick = (imagen) => {
    if (imagen.rutaurl) {
      window.open(imagen.rutaurl, "_blank");
    } else {
      setSelectedImage(imagen);
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedImage(null);
  };

  const prevImage = () => {
    setIndex((prevIndex) => (prevIndex - 1 + imagenes.length) % imagenes.length);
  };

  const nextImage = () => {
    setIndex((prevIndex) => (prevIndex + 1) % imagenes.length);
  };

  return (
    <div className="bienvenida-container" style={{ textAlign: "center" }}>
      <h2>
        ¡Bienvenido, {usuario ? `${usuario.nombres} ${usuario.apellidoPaterno}` : "Visitante"}!
      </h2>
      <p>¡Continúa cuidando tu salud y la de toda tu familia!</p>

      {/* Aquí se establece el tamaño de la imagen */}
      <div style={{ marginTop: "20px", width: "100%", position: "relative" }}>
        {imagenes.length > 0 && (
          <>
            <img
              src={`data:image/jpeg;base64,${imagenes[index].imagenbyte}`}
              alt={`Imagen ${index + 1}`}
              onClick={() => handleImageClick(imagenes[index])}
              style={{
                width: "1103px", // Mantiene el tamaño fijo en pantallas grandes
                height: "400px", // Mantiene el tamaño fijo en pantallas grandes
                objectFit: "cover", // Mantiene la proporción y cubre todo el área
                cursor: "pointer",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              }}
            />
            
            {/* Botones de navegación */}
            <button
              onClick={prevImage}
              style={{
                position: "absolute",
                top: "50%",
                left: "10px",
                transform: "translateY(-50%)",
                background: "rgba(0, 0, 0, 0.5)",
                color: "white",
                border: "none",
                padding: "10px",
                borderRadius: "50%",
                cursor: "pointer",
              }}
            >
              <FaChevronLeft size={20} />
            </button>
            
            <button
              onClick={nextImage}
              style={{
                position: "absolute",
                top: "50%",
                right: "10px",
                transform: "translateY(-50%)",
                background: "rgba(0, 0, 0, 0.5)",
                color: "white",
                border: "none",
                padding: "10px",
                borderRadius: "50%",
                cursor: "pointer",
              }}
            >
              <FaChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {/* Modal de imagen seleccionada */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Body className="d-flex justify-content-center align-items-center">
          {selectedImage && selectedImage.imagenbyte ? (
            <img
              src={`data:image/jpeg;base64,${selectedImage.imagenbyte}`}
              alt="Imagen ampliada"
              className="img-fluid"
              style={{
                width: "400px",  // Tamaño fijo para la imagen ampliada
                height: "400px", 
                objectFit: "cover",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              }}
            />
          ) : (
            <p>Imagen no disponible</p>
          )}
        </Modal.Body>
      </Modal>

      {/* Estilos para dispositivos móviles usando media queries */}
      <style>
        {`
          @media (max-width: 768px) {
            .bienvenida-container img {
              width: 100% !important;  /* La imagen ocupa todo el ancho disponible */
              height: auto !important; /* Ajusta la altura automáticamente */
            }
          }
        `}
      </style>
    </div>
  );
};

export default Bienvenida;