import { useState } from 'react';
import { toast } from 'react-toastify';

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/brecho-reverto/image/upload';
const UPLOAD_PRESET = 'brecho_uploads'; 

const ImageUploader = ({ onImageUpload, currentImage = null, label = "Selecionar Imagem" }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validações
    if (!file.type.startsWith('image/')) {
      toast.error('Selecione apenas arquivos de imagem!');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
      toast.error('Arquivo muito grande! Máximo 5MB');
      return;
    }

    setUploading(true);
    setPreview(URL.createObjectURL(file));

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', UPLOAD_PRESET);

      const response = await fetch(CLOUDINARY_URL, {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.secure_url) {
        onImageUpload({
          url: result.secure_url,
          public_id: result.public_id
        });
        toast.success('Imagem enviada com sucesso!');
      } else {
        throw new Error(result.error?.message || 'Erro no upload');
      }
    } catch (error) {
      console.error('Erro no upload:', error);
      toast.error('Erro ao enviar imagem!');
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="image-uploader">
      <div className="image-preview-container">
        {preview || currentImage ? (
          <img 
            src={preview || currentImage} 
            alt="Preview" 
            style={{ 
              width: '200px', 
              height: '200px', 
              objectFit: 'cover',
              borderRadius: '8px'
            }}
          />
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
              color: '#999'
            }}
          >
            Sem imagem
          </div>
        )}
      </div>

      <div className="upload-controls">
        <input
          type="file"
          id={`image-upload-${Math.random()}`}
          accept="image/*"
          onChange={handleFileSelect}
          disabled={uploading}
          style={{ display: 'none' }}
        />
        <label 
          htmlFor={`image-upload-${Math.random()}`}
          style={{
            display: 'inline-block',
            padding: '10px 20px',
            background: uploading ? '#ccc' : '#007bff',
            color: 'white',
            cursor: uploading ? 'not-allowed' : 'pointer',
            borderRadius: '4px',
            textAlign: 'center'
          }}
        >
          {uploading ? 'Enviando...' : label}
        </label>
      </div>
    </div>
  );
};

export default ImageUploader;