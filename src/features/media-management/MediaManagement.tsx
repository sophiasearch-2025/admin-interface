import { useState } from "react";
import "./MediaManegment.css";

const MediaManagement = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="media-container">
      <div className="media-header"> 
        <h1 className="media-title">Medios de Prensa</h1>
        <div className="media-actions">
          <button className="media-btn" onClick={() => setShowModal(true)}>
            Agregar Medio
          </button>
          <button className="media-btn">Borrar todo</button>
        </div>
      </div>
      <div className="media-table-container">
      <table className="media-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>URL</th>
              <th>Paí­s</th>
              <th>Categorí­a</th>
              <th>Descripción</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 50 }).map((_, idx) => (
              <tr key={idx}>
                <td>Jaime</td>
                <td>Jaime</td>
                <td>Jaime</td>
                <td>Jaime</td>
                <td>Jaime</td>
              </tr>
            ))}
          </tbody>
      </table>
      </div>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <form className="media-form">
              <input type="text" placeholder="Nombre medio" />
              <input type="text" placeholder="URL" />
              <input type="text" placeholder="Paí­s" />
              <input type="text" placeholder="Categorí­a" />
              <input type="text" placeholder="Descripción" />
              <button className="media-btn" onClick={() => setShowModal(false)}>
                Guardar
              </button>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                Cerrar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaManagement;