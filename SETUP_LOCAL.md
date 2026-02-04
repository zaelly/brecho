# 🚀 Instruções para Rodar Localmente

## Backend (Node.js)

1. **Iniciar o backend:**
```bash
cd G:\brecho\backend
npm install
npm run dev
```
**Backend rodará em:** `http://localhost:4000`

## Frontend Admin (Painel do Vendedor)

1. **Verificar ambiente:**
```bash
cd G:\brecho\admin
cat .env
```

2. **Configurar .env:**
```env
VITE_API_URL=http://localhost:4000
```

3. **Iniciar o frontend:**
```bash
npm install
npm run dev
```
**Admin rodará em:** `http://localhost:5174`

## Frontend User (Loja)

1. **Configurar .env:**
```bash
cd G:\brecho\ClientUser
```

2. **Criar/editar .env:**
```env
VITE_API_URL=http://localhost:4000
```

3. **Iniciar:**
```bash
npm install
npm run dev
```
**Loja rodará em:** `http://localhost:5173`

## ✅ Acessar os Sistemas

- **Painel do Vendedor:** http://localhost:5174/login
- **Loja Online:** http://localhost:5173
- **Backend API:** http://localhost:4000

## 🔧 Testes

### Teste de API:
```bash
curl http://localhost:4000/
```

### Teste de Login no Admin:
1. Acesse http://localhost:5174/login
2. Cadastre-se ou faça login
3. Verifique se funciona sem erros de CORS

## ❌ Problemas Comuns

### "Unexpected token 'export'"
**Causa:** Arquivo .env configurado para produção com URL do Vercel  
**Solução:** Use `VITE_API_URL=http://localhost:4000`

### CORS errors
**Causa:** Backend não rodando ou URLs inconsistentes  
**Solução:** Inicie o backend e verifique as URLs

### "Failed to load resource: 404"
**Causa:** URL do backend incorreta  
**Solução:** Configure `VITE_API_URL=http://localhost:4000`

## 🎯 Para Deploy no Vercel

1. **Mudar URLs no .env:**
```env
VITE_API_URL=https://seu-backend.vercel.app
```

2. **Fazer deploy dos frontends**
3. **Fazer deploy do backend** (já configurado)