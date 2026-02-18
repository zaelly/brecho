// Funcao para extrair cloud_name e path de uma URL do Cloudinary
const parseCloudinaryUrl = (url) => {
  if (!url || !url.includes('cloudinary.com')) return null;

  const match = url.match(/res\.cloudinary\.com\/([^/]+)\/image\/upload\/(.*)/);
  if (!match) return null;

  return {
    cloudName: match[1],
    path: match[2]
  };
};

// Funcao para gerar URLs otimizadas do Cloudinary
export const getCloudinaryImageUrl = (url, options = {}) => {
  if (!url) return '';

  const parsed = parseCloudinaryUrl(url);
  if (!parsed) return url;

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

  // Remover transformacoes existentes do path (ex: v1234567/folder/file.jpg)
  let cleanPath = parsed.path;
  // Se ja tem transformacoes (contem coisas como w_xxx,h_xxx), remover
  const versionMatch = cleanPath.match(/(v\d+\/.+)/);
  if (versionMatch) {
    cleanPath = versionMatch[1];
  }

  return `https://res.cloudinary.com/${parsed.cloudName}/image/upload/${transformationString}/${cleanPath}`;
};

// Funcao para extrair public_id de uma URL do Cloudinary
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

// Funcao para gerar URL de thumbnail
export const getThumbnailUrl = (url, size = 300) => {
  if (!url) return '';

  if (url.includes('cloudinary.com')) {
    return getCloudinaryImageUrl(url, {
      width: size,
      height: size,
      crop: 'thumb'
    });
  }

  return url;
};

// Funcao para gerar URLs de gallery otimizadas
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
