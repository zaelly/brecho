# Configuração de Imagens com Cloudinary

Este projeto está configurado para usar o Cloudinary para armazenamento e gerenciamento de imagens, otimizado para funcionar no Vercel.

## Configurações Realizadas

### Backend (Node.js)
- ✅ Cloudinary instalado e configurado
- ✅ Rota `/upload` para upload de imagens
- ✅ Rota `DELETE /upload/:public_id` para deletar imagens
- ✅ Configuração de transformações automáticas (qualidade, formato)

### Frontend (React)
- ✅ Utilitário Cloudinary para gerar URLs otimizadas
- ✅ Componente `ImageUpload` para upload de imagens
- ✅ Componente `Item` atualizado com URLs otimizadas
- ✅ Configuração de proxy no Vite

## Variáveis de Ambiente

### Backend (.env)
```
VITE_API_URL=http://localhost:4000
MONGO_URI=mongodb://localhost:27017/brecho
EMAIL_USER=seu_email@gmail.com
EMAIL_PASS=sua_senha_app
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:4000
VITE_CLOUDINARY_CLOUD_NAME=dj8aysbhb
VITE_CLOUDINARY_API_KEY=871965672473696
```

## Como Usar

### 1. Upload de Imagem
```javascript
import ImageUpload from './Components/ImageUpload/ImageUpload';

const handleImageUpload = (imageData) => {
  console.log('Imagem enviada:', imageData.url);
  // Salvar no banco de dados
};

<ImageUpload 
  onImageUpload={handleImageUpload}
  currentImage={currentImageData}
  onImageDelete={handleDelete}
/>
```

### 2. URLs Otimizadas
```javascript
import { getCloudinaryImageUrl, getThumbnailUrl } from './utils/cloudinary';

// Imagem completa otimizada
const optimizedUrl = getCloudinaryImageUrl(publicId, {
  width: 800,
  height: 600,
  quality: 'auto',
  format: 'auto'
});

// Thumbnail
const thumbnailUrl = getThumbnailUrl(publicId, 200);
```

### 3. Deploy no Vercel
1. Configure as variáveis de ambiente no Vercel Dashboard
2. Atualize `VITE_API_URL` para a URL do backend no Vercel
3. As imagens do Cloudinary funcionarão automaticamente

## Vantagens da Configuração

- ✅ **Otimização automática**: Qualidade e formato ajustados automaticamente
- ✅ **Lazy loading**: Carregamento preguiçoso de imagens
- ✅ **Transformações dinâmicas**: Redimensionamento em tempo real
- ✅ **CDN global**: Distribuição rápida de conteúdo
- ✅ **Backup automático**: Segurança contra perda de imagens
- ✅ **Compatível com Vercel**: Funciona perfeitamente em deploy

## Estrutura de Arquivos

```
backend/
├── config/
│   └── cloudinary.js
├── api/
│   └── index.js (atualizado)
└── .env.example

frontend/
├── src/
│   ├── utils/
│   │   └── cloudinary.js
│   └── Components/
│       └── ImageUpload/
│           └── ImageUpload.jsx
└── .env.example
```

## URLs do Cloudinary

As URLs terão o formato:
```
https://res.cloudinary.com/dj8aysbhb/image/upload/
  w_800,h_600,c_fill,q_auto,f_auto/brecho/products/public_id
```

Onde:
- `dj8aysbhb` é seu cloud name
- `brecho/products` é a pasta no Cloudinary
- `public_id` é o identificador único da imagem