import styled from 'styled-components';

// Contenedor principal
export const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
    background-color: #f4f4f4;
`;

// Título
export const Title = styled.h1`
    font-size: 24px;
    color: #333;
    margin-bottom: 20px;
`;

// Lista de especialidades
export const EspecialidadesList = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
    margin-bottom: 20px;
`;

// Botones de especialidades
export const EspecialidadButton = styled.button`
    padding: 10px 20px;
    font-size: 16px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
    &:hover {
        background-color: #0056b3;
    }
`;

// Lista de médicos
export const MedicosList = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
    margin-bottom: 20px;
`;

// Botones de médicos
export const MedicoButton = styled.button`
    padding: 10px 20px;
    font-size: 16px;
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
    &:hover {
        background-color: #218838;
    }
`;

// Lista de sucursales
export const SucursalesList = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
    margin-bottom: 20px;
`;

// Botones de sucursales
export const SucursalButton = styled.button`
    padding: 10px 20px;
    font-size: 16px;
    background-color: #ffc107;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
    &:hover {
        background-color: #e0a800;
    }
`;

// Lista de horarios
export const HorariosList = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
    margin-bottom: 20px;
`;

// Botones de horarios
export const HoraButton = styled.button`
    padding: 10px 20px;
    font-size: 16px;
    background-color: #17a2b8;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
    &:hover {
        background-color: #117a8b;
    }
`;

// Botón de confirmación
export const SubmitButton = styled.button`
    padding: 15px 30px;
    font-size: 18px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
    &:hover {
        background-color: #0056b3;
    }
`;

// Media Queries para adaptabilidad en móviles
export const MediaQuery = styled.div`
    @media (max-width: 768px) {
        ${Title} {
            font-size: 20px;
        }

        ${EspecialidadesList}, ${MedicosList}, ${SucursalesList}, ${HorariosList} {
            flex-direction: column;
        }

        ${EspecialidadButton}, ${MedicoButton}, ${SucursalButton}, ${HoraButton}, ${SubmitButton} {
            width: 100%;
            padding: 15px;
            margin: 5px 0;
        }
    }
`;