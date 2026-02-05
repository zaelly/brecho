# 🚀 Correção do Build no Vercel

## Problema: "vite: command not found"

### ✅ Soluções Aplicadas:

1. **Movi `vite` para dependencies** em ambos os frontends
2. **Criei arquivos vercel.json** para cada frontend
3. **Configurei build commands** corretos

## 📁 Arquivos Modificados:

### Admin (Vendedor)
- `package.json` - Vite movido para dependencies
- `vercel.json` - Configuração de build do Vercel

### ClientUser (Loja)
- `package.json` - Vite movido para dependencies  
- `vercel.json` - Configuração de build do Vercel

## 🔧 Configuração do vercel.json:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "installCommand": "npm install",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "VITE_API_URL": "https://brechobackend.vercel.app"
  }
}
```

## 🎯 Para Deploy:

### Backend:
```bash
cd G:\brecho\backend
vercel --prod
```

### Frontend Admin:
```bash
cd G:\brecho\admin
vercel --prod
```

### Frontend User:
```bash
cd G:\brecho\ClientUser
vercel --prod
```

## 🔄 Variáveis de Ambiente no Vercel:

Configure no dashboard do Vercel:
- `VITE_API_URL=https://brechobackend.vercel.app`

## 📋 Estrutura de Deploy:

1. **Backend**: `https://brechobackend.vercel.app`
2. **Admin**: `https://brechoadmin.vercel.app`  
3. **Client**: `https://brechoclient.vercel.app`

O build agora deve funcionar sem o erro "vite command not found"! 🎉