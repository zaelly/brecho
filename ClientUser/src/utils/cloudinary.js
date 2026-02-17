// Configurações do Cloudinary
export const cloudinaryConfig = {
  cloudName: 'brecho-reverto',
  apiKey: '871965672473696'
};

// Função para gerar URLs otimizadas do Cloudinary
export const getCloudinaryImageUrl = (url, options = {}) => {
  if (!url) return '';
  
  // Se for uma URL completa do Cloudinary, extrair o public_id
  const cloudinaryBaseUrl = `https://res.cloudinary.com/${cloudinaryConfig.cloudName}/image/upload/`;
  let publicId = url;
  
  if (url.includes(cloudinaryBaseUrl)) {
    publicId = url.replace(cloudinaryBaseUrl, '');
  }
  
  const {
    width,
    height,
    crop = 'fill',
    quality = 'auto',
    format = 'auto'
  } = options;

  const transformations = [];
  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  transformations.push(`c_${crop}`);
  transformations.push(`q_${quality}`);
  transformations.push(`f_${format}`);
  
  const transformationString = transformations.join(',');
  
  return `https://res.cloudinary.com/${cloudinaryConfig.cloudName}/image/upload/${transformationString}/${publicId}`;
};

// Função para extrair public_id de uma URL do Cloudinary
export const extractPublicId = (url) => {
  if (!url || !url.includes('cloudinary.com')) return null;
  
  try {
    const cloudinaryRegex = /\/upload\/(?:v\d+\/)?(.+)$/;
    const matches = url.match(cloudinaryRegex);
    return matches ? matches[1] : null;
  } catch (error) {
    console.error('Erro ao extrair public_id:', error);
    return null;
  }
};

// Função para gerar URL de thumbnail
export const getThumbnailUrl = (url, size = 300) => {
  if (!url) return '';
  
  // Se já for do Cloudinary, otimizar
  if (url.includes('cloudinary.com')) {
    return getCloudinaryImageUrl(url, {
      width: size,
      height: size,
      crop: 'thumb'
    });
  }
  
  return url;
};

// Função para gerar URLs de gallery otimizadas
export const getGalleryUrls = (gallery = [], options = {}) => {
  const {
    width = 400,
    height = 300,
    quality = 'auto'
  } = options;
  
  return gallery.map(url => getCloudinaryImageUrl(url, {
    width,
    height,
    crop: 'fill',
    quality
  }));
};