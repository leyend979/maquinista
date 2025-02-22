import React, { useState, useEffect, useRef } from 'react';
import Modal from './Modal';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ImageUpload from './imagenUpload';

const CollectionModal = ({ onSubmit, initialData = null, onClose }) => {
  const [nombre, setNombre] = useState('');
  const [imagenUrl, setImagenUrl] = useState('');
  const [secciones, setSecciones] = useState([{ tituloSecundario: '', contenido: '' }]);

  useEffect(() => {
    if (initialData) {
      setNombre(initialData.nombre);
      setImagenUrl(initialData.imagenUrl || '');

      try {
        const contenidoParsed = JSON.parse(initialData.contenido);
        if (Array.isArray(contenidoParsed)) {
          setSecciones(contenidoParsed);
        } else {
          setSecciones([{ tituloSecundario: '', contenido: contenidoParsed }]);
        }
      } catch (error) {
        console.warn('El contenido no tiene formato JSON, usando fallback');
        setSecciones([{ tituloSecundario: '', contenido: '' }]);
      }
    }
  }, [initialData]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!nombre) return;

    const contenidoEstructurado = JSON.stringify(secciones);
    onSubmit({ nombre, contenido: contenidoEstructurado, imagenUrl });

    onClose();
  };

  const handleChangeSeccion = (index, key, value) => {
    const updatedSecciones = [...secciones];
    updatedSecciones[index][key] = value;
    setSecciones(updatedSecciones);
  };

  const handleAddSeccion = () => {
    setSecciones([...secciones, { tituloSecundario: '', contenido: '' }]);
  };

  const handleRemoveSeccion = (index) => {
    if (secciones.length > 1) {
      setSecciones(secciones.filter((_, i) => i !== index));
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose}>
      <h3>{initialData ? 'Editar Colección' : 'Agregar Nueva Colección'}</h3>
      <form onSubmit={handleFormSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Título Global:</label><br/>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>

        {/* Secciones dinámicas */}
        {secciones.map((seccion, index) => (
          <div key={index} style={{ marginBottom: '1rem', border: '1px solid #ddd', padding: '1rem', borderRadius: '5px' }}>
            <label>Título Secundario (opcional):</label><br/>
            <input
              type="text"
              value={seccion.tituloSecundario}
              onChange={(e) => handleChangeSeccion(index, 'tituloSecundario', e.target.value)}
              style={{ width: '100%', padding: '0.5rem' }}
            />

            <label>Contenido:</label><br/>
            <ReactQuill
              value={seccion.contenido}
              onChange={(value) => handleChangeSeccion(index, 'contenido', value)}
            />

            {secciones.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveSeccion(index)}
                style={{ backgroundColor: 'red', color: 'white', padding: '0.5rem', marginTop: '0.5rem' }}
              >
                Eliminar sección
              </button>
            )}
          </div>
        ))}

        <button type="button" onClick={handleAddSeccion} style={{ marginTop: '1rem', backgroundColor: '#007bff', color: 'white', padding: '0.5rem 1rem' }}>
          + Agregar Sección
        </button>

        <ImageUpload onUpload={setImagenUrl} />
        {imagenUrl && (
          <div style={{ marginTop: '1rem' }}>
            <p>Vista previa:</p>
            <img src={imagenUrl} alt="Vista previa" style={{ maxWidth: '100%', height: 'auto' }} />
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button onClick={onClose} type="button" style={{ backgroundColor: 'red', color: 'white', padding: '0.5rem 1rem' }}>
            Cancelar
          </button>
          <button type="submit" style={{ backgroundColor: 'green', color: 'white', padding: '0.5rem 1rem' }}>
            Guardar
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CollectionModal;





