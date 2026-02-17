import React, { useState } from 'react';
import { toast } from 'react-toastify';

const CloudinaryImageUploader = ({ 
  onImageUpload, 
  currentImage = null, 
  label = "Selecionar Imagem",
  multiple = false 
}) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleFileSelect = async (event) => {
    const files = Array.from(event.target.files);
    
    if (files.length === 0) return;

    // Validações
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        toast.error('Selecione apenas arquivos de imagem!');
        return;
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB
        toast.error(`Arquivo ${file.name} muito grande! Máximo 5MB`);
        return;
      }
    }

    setUploading(true);
    
    // Mostrar preview do primeiro arquivo
    if (files.length > 0) {
      setPreview(URL.createObjectURL(files[0]));
    }

    try {
      const uploadPromises = files.map(file => uploadToCloudinary(file));
      const results = await Promise.all(uploadPromises);

      if (multiple) {
        onImageUpload(results);
        toast.success(`${results.length} imagens enviadas com sucesso!`);
      } else {
        onImageUpload(results[0]);
        toast.success('Imagem enviada com sucesso!');
      }
    } catch (error) {
      console.error('Erro no upload:', error);
      toast.error('Erro ao enviar imagem!');
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'brecho_unsigned'); // Preset unsigned

    const response = await fetch(
      'https://api.cloudinary.com/v1_1/brecho-reverto/image/upload',
      {
        method: 'POST',
        body: formData
      }
    );

    const result = await response.json();

    if (!result.secure_url) {
      throw new Error(result.error?.message || 'Erro no upload');
    }

    return {
      url: result.secure_url,
      public_id: result.public_id,
      file: file // Keep the file for form submission
    };
  };

  return (
    <div className="cloudinary-image-uploader">
      <div className="image-preview-container">
        {preview || currentImage?.url || currentImage ? (
          <div className="preview-grid">
            {multiple && Array.isArray(currentImage) ? (
              currentImage.map((img, index) => (
                <img
                  key={index}
                  src={img.url || img}
                  alt={`Preview ${index}`}
                  style={{
                    width: '100px',
                    height: '100px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    margin: '5px'
                  }}
                />
              ))
            ) : (
              <img
                src={preview || currentImage?.url || currentImage}
                alt="Preview"
                style={{
                  width: '200px',
                  height: '200px',
                  objectFit: 'cover',
                  borderRadius: '8px'
                }}
              />
            )}
          </div>
        ) : (
          <div
            style={{
              width: '200px',
              height: '200px',
              border: '2px dashed #ccc',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#999',
              flexDirection: 'column'
            }}
          >
            <i className="fa-solid fa-cloud-arrow-up" style={{ fontSize: '32px', marginBottom: '10px' }}></i>
            <span>Sem imagem</span>
          </div>
        )}
      </div>

      <div className="upload-controls">
        <input
          type="file"
          id={`image-upload-${Math.random()}`}
          accept="image/*"
          multiple={multiple}
          onChange={handleFileSelect}
          disabled={uploading}
          style={{ display: 'none' }}
        />
        <label
          htmlFor={`image-upload-${Math.random()}`}
          style={{
            display: 'inline-block',
            padding: '12px 24px',
            background: uploading ? '#ccc' : '#007bff',
            color: 'white',
            cursor: uploading ? 'not-allowed' : 'pointer',
            borderRadius: '6px',
            textAlign: 'center',
            transition: 'background 0.3s'
          }}
          onMouseOver={(e) => !uploading && (e.target.style.background = '#0056b3')}
          onMouseOut={(e) => !uploading && (e.target.style.background = '#007bff')}
        >
          {uploading ? (
            <span>
              <i className="fa-solid fa-spinner fa-spin"></i> Enviando...
            </span>
          ) : (
            <span>
              <i className="fa-solid fa-upload"></i> {label}
            </span>
          )}
        </label>
      </div>
    </div>
  );
};

export default CloudinaryImageUploader;