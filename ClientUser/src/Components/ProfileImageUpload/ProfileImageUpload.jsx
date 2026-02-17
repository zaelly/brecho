import React, { useId, useState } from 'react';
import { toast } from 'react-toastify';

const ProfileImageUpload = ({ 
  currentImage = null, 
  onUploadSuccess,
  label = "Selecionar Foto de Perfil"
}) => {
  const inputId = useId();
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validações
    if (!file.type.startsWith('image/')) {
      toast.error('Apenas imagens!');
      return;
    }
    if (file.size > 3 * 1024 * 1024) { // 3MB para perfil
      toast.error('Máximo 3MB!');
      return;
    }

    setUploading(true);
    setPreview(URL.createObjectURL(file));

    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const token = localStorage.getItem('auth-token');

      const formData = new FormData();
      formData.append('profile', file);

      const response = await fetch(`${apiUrl}/api/upload/upload-profile-image`, {
        method: 'POST',
        headers: {
          'auth-token': token
        },
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Foto de perfil atualizada!');
        onUploadSuccess && onUploadSuccess(result.image_url);
      } else {
        throw new Error(result.message || 'Erro ao salvar no perfil');
      }
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao fazer upload!');
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="profile-image-upload">
      <div className="current-profile-image">
        {preview || currentImage ? (
          <img
            src={preview || currentImage}
            alt="Profile"
            style={{
              width: '150px',
              height: '150px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '3px solid #007bff'
            }}
          />
        ) : (
          <div
            style={{
              width: '150px',
              height: '150px',
              borderRadius: '50%',
              border: '3px dashed #ccc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#999',
              fontSize: '14px'
            }}
          >
            Sem Foto
          </div>
        )}
      </div>

      <div className="upload-button">
        <input
          type="file"
          id={inputId}
          accept="image/*"
          onChange={handleFileSelect}
          disabled={uploading}
          style={{ display: 'none' }}
        />
        <label
          htmlFor={inputId}
          style={{
            display: 'inline-block',
            padding: '10px 20px',
            background: uploading ? '#ccc' : '#007bff',
            color: 'white',
            borderRadius: '20px',
            cursor: uploading ? 'not-allowed' : 'pointer',
            marginTop: '15px',
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
              <i className="fa-solid fa-camera"></i> {label}
            </span>
          )}
        </label>
      </div>
    </div>
  );
};

export default ProfileImageUpload;