// Configuração do Cloudinary
export const cloudinaryConfig = {
  cloudName: 'dj8aysbhb',
  apiKey: '871965672473696'
};

// Função para gerar URLs otimizadas do Cloudinary
export const getCloudinaryImageUrl = (publicId, options = {}) => {
  if (!publicId) return '';
  
  const {
    width,
    height,
    crop = 'fill',
    quality = 'auto',
    format = 'auto'
  } = options;

  const baseUrl = `https://res.cloudinary.com/${cloudinaryConfig.cloudName}/image/upload`;
  
  const transformations = [];
  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  transformations.push(`c_${crop}`);
  transformations.push(`q_${quality}`);
  transformations.push(`f_${format}`);
  
  const transformationString = transformations.join(',');
  
  return `${baseUrl}/${transformationString}/${publicId}`;
};

// Função para extrair public_id de uma URL do Cloudinary
export const extractPublicId = (url) => {
  if (!url || !url.includes('cloudinary.com')) return null;
  
  try {
    const matches = url.match(/\/upload\/(?:v\d+\/)?(.+)$/);
    return matches ? matches[1] : null;
  } catch (error) {
    console.error('Erro ao extrair public_id:', error);
    return null;
  }
};

// Função para gerar URL de thumbnail
export const getThumbnailUrl = (publicId, size = 200) => {
  return getCloudinaryImageUrl(publicId, {
    width: size,
    height: size,
    crop: 'thumb'
  });
};