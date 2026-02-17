<<<<<<< HEAD
// Configurações do Cloudinary
export const cloudinaryConfig = {
  cloudName: 'brecho-reverto',
=======
// Configuração do Cloudinary
export const cloudinaryConfig = {
  cloudName: 'dj8aysbhb',
>>>>>>> dcadcf6228dda8625a0f05152a88b14399d4e70d
  apiKey: '871965672473696'
};

// Função para gerar URLs otimizadas do Cloudinary
<<<<<<< HEAD
export const getCloudinaryImageUrl = (url, options = {}) => {
  if (!url) return '';
  
  // Se for uma URL completa do Cloudinary, extrair o public_id
  const cloudinaryBaseUrl = `https://res.cloudinary.com/${cloudinaryConfig.cloudName}/image/upload/`;
  let publicId = url;
  
  if (url.includes(cloudinaryBaseUrl)) {
    publicId = url.replace(cloudinaryBaseUrl, '');
  }
=======
export const getCloudinaryImageUrl = (publicId, options = {}) => {
  if (!publicId) return '';
>>>>>>> dcadcf6228dda8625a0f05152a88b14399d4e70d
  
  const {
    width,
    height,
    crop = 'fill',
    quality = 'auto',
    format = 'auto'
  } = options;

<<<<<<< HEAD
=======
  const baseUrl = `https://res.cloudinary.com/${cloudinaryConfig.cloudName}/image/upload`;
  
>>>>>>> dcadcf6228dda8625a0f05152a88b14399d4e70d
  const transformations = [];
  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  transformations.push(`c_${crop}`);
  transformations.push(`q_${quality}`);
  transformations.push(`f_${format}`);
  
  const transformationString = transformations.join(',');
  
<<<<<<< HEAD
  return `https://res.cloudinary.com/${cloudinaryConfig.cloudName}/image/upload/${transformationString}/${publicId}`;
=======
  return `${baseUrl}/${transformationString}/${publicId}`;
>>>>>>> dcadcf6228dda8625a0f05152a88b14399d4e70d
};

// Função para extrair public_id de uma URL do Cloudinary
export const extractPublicId = (url) => {
  if (!url || !url.includes('cloudinary.com')) return null;
  
  try {
<<<<<<< HEAD
    const cloudinaryRegex = /\/upload\/(?:v\d+\/)?(.+)$/;
    const matches = url.match(cloudinaryRegex);
=======
    const matches = url.match(/\/upload\/(?:v\d+\/)?(.+)$/);
>>>>>>> dcadcf6228dda8625a0f05152a88b14399d4e70d
    return matches ? matches[1] : null;
  } catch (error) {
    console.error('Erro ao extrair public_id:', error);
    return null;
  }
};

// Função para gerar URL de thumbnail
<<<<<<< HEAD
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
=======
export const getThumbnailUrl = (publicId, size = 200) => {
  return getCloudinaryImageUrl(publicId, {
    width: size,
    height: size,
    crop: 'thumb'
  });
>>>>>>> dcadcf6228dda8625a0f05152a88b14399d4e70d
};