import React, { useId, useState } from 'react';
import { toast } from 'react-toastify';

const SimpleCloudinaryUpload = ({ 
  onImageUpload, 
  currentImage = null, 
  label = "Selecionar Imagem",
  multiple = false 
}) => {
  const inputId = useId();
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleFileSelect = async (event) => {
    const files = Array.from(event.target.files);
    
    if (files.length === 0) return;

    // Validações simples
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        toast.error('Apenas imagens!');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Máximo 5MB por imagem!');
        return;
      }
    }

    setUploading(true);
    
    // Preview
    if (files.length > 0) {
      setPreview(URL.createObjectURL(files[0]));
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL;

      if (multiple) {
        // Upload múltiplo (galeria) - envia cada arquivo separadamente
        const uploadPromises = files.map(file => {
          const formData = new FormData();
          formData.append('gallery', file);
          return fetch(`${apiUrl}/api/upload/upload-product-files`, {
            method: 'POST',
            body: formData
          }).then(res => res.json());
        });

        const results = await Promise.all(uploadPromises);
        const urls = results.flatMap(r => r.gallery || []).filter(Boolean);
        onImageUpload(urls);
        toast.success(`${urls.length} imagens enviadas!`);
      } else {
        // Upload único (thumbnail)
        const formData = new FormData();
        formData.append('thumbnail', files[0]);
        const response = await fetch(`${apiUrl}/api/upload/upload-product-files`, {
          method: 'POST',
          body: formData
        });
        const result = await response.json();
        if (result.thumbnail) {
          onImageUpload(result.thumbnail);
          toast.success('Imagem enviada!');
        } else {
          throw new Error(result.message || 'Erro no upload');
        }
      }
    } catch (error) {
      console.error('Erro no upload:', error);
      toast.error('Erro ao enviar imagem!');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="simple-upload">
      {/* Preview */}
      <div className="preview-container">
        {preview || currentImage ? (
          multiple && Array.isArray(currentImage) ? (
            <div className="preview-grid">
              {currentImage.map((img, i) => (
                <img key={i} src={img} alt={`Preview ${i}`} 
                  style={{ width: '80px', height: '80px', objectFit: 'cover', margin: '2px' }} />
              ))}
              {preview && (
                <img src={preview} alt="New preview" 
                  style={{ width: '80px', height: '80px', objectFit: 'cover', margin: '2px' }} />
              )}
            </div>
          ) : (
            <img 
              src={preview || currentImage} 
              alt="Preview" 
              style={{ width: '200px', height: '200px', objectFit: 'cover', borderRadius: '8px' }}
            />
          )
        ) : (
          <div style={{
            width: '200px', height: '200px', 
            border: '2px dashed #ccc', borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#999', fontSize: '14px'
          }}>
            Nenhuma imagem
          </div>
        )}
      </div>

      {/* Botão de upload */}
      <div>
        <input
          type="file"
          id={inputId}
          accept="image/*"
          multiple={multiple}
          onChange={handleFileSelect}
          disabled={uploading}
          style={{ display: 'none' }}
        />
        <label
          htmlFor={inputId}
          style={{
            display: 'inline-block',
            padding: '12px 20px',
            background: uploading ? '#ccc' : '#007bff',
            color: 'white',
            borderRadius: '6px',
            cursor: uploading ? 'not-allowed' : 'pointer',
            marginTop: '10px'
          }}
        >
          {uploading ? 'Enviando...' : label}
        </label>
      </div>
    </div>
  );
};

export default SimpleCloudinaryUpload;