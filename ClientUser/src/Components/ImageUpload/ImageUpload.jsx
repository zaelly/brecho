import React, { useState } from 'react';
import { getCloudinaryImageUrl } from '../../utils/cloudinary';

const ImageUpload = ({ 
  onImageUpload, 
  currentImage = null, 
  onImageDelete,
  maxSize = 5 * 1024 * 1024, // 5MB
  acceptedFormats = ['image/jpeg', 'image/png', 'image/webp']
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validações
    if (!acceptedFormats.includes(file.type)) {
      setError('Formato de arquivo inválido. Use JPEG, PNG ou WebP.');
      return;
    }

    if (file.size > maxSize) {
      setError('Arquivo muito grande. Máximo 5MB.');
      return;
    }

    setError('');
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('product', file);

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/upload`, {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        onImageUpload({
          url: result.image_url,
          public_id: result.public_id
        });
      } else {
        setError(result.message || 'Erro no upload');
      }
    } catch (error) {
      console.error('Erro no upload:', error);
      setError('Erro ao conectar com o servidor');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async () => {
    if (!currentImage?.public_id) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/upload/${currentImage.public_id}`,
        { method: 'DELETE' }
      );

      const result = await response.json();
      if (result.success) {
        onImageDelete();
      }
    } catch (error) {
      console.error('Erro ao deletar imagem:', error);
    }
  };

  return (
    <div className="image-upload">
      {/* Imagem atual */}
      {currentImage && (
        <div className="current-image">
          <img 
            src={currentImage.url} 
            alt="Imagem atual" 
            style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover' }}
          />
          <button 
            type="button" 
            onClick={handleDeleteImage}
            style={{ 
              background: '#ff4444', 
              color: 'white', 
              border: 'none', 
              padding: '5px 10px', 
              cursor: 'pointer',
              marginTop: '5px'
            }}
          >
            Remover
          </button>
        </div>
      )}

      {/* Upload */}
      <div className="upload-area">
        <input
          type="file"
          id="image-upload"
          accept={acceptedFormats.join(',')}
          onChange={handleFileSelect}
          disabled={uploading}
          style={{ display: 'none' }}
        />
        <label 
          htmlFor="image-upload"
          style={{
            display: 'inline-block',
            padding: '10px 20px',
            background: uploading ? '#ccc' : '#007bff',
            color: 'white',
            cursor: uploading ? 'not-allowed' : 'pointer',
            borderRadius: '4px'
          }}
        >
          {uploading ? 'Enviando...' : 'Selecionar Imagem'}
        </label>
      </div>

      {/* Erro */}
      {error && (
        <div style={{ color: 'red', marginTop: '10px', fontSize: '14px' }}>
          {error}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;