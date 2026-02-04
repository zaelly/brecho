# Solução para CORS - README

## Problema de CORS Identificado

O erro está acontecendo porque:
1. O frontend está rodando em `http://localhost:5174` (Admin)
2. Tentando acessar `https://brechoadmin.vercel.app/api/products/seller/allproducts`
3. O servidor backend não está configurado para aceitar requisições entre origens diferentes

## Soluções Aplicadas

### 1. ✅ Headers CORS no Backend
Adicionei headers CORS em todas as rotas principais:
- `/api/users/*`
- `/api/sellers/*` 
- `/api/products/*`

### 2. ✅ Configuração do vercel.json
Adicionei headers globais para CORS no arquivo de configuração do Vercel.

### 3. ✅ Middleware CORS Customizado
Criei middleware específico para cada rota com debug logging.

## Testes

### ✅ Backend Local (Recomendado)
```bash
# Terminal 1: Backend local
cd G:\brecho\backend
npm run dev

# Terminal 2: Frontend Admin
cd G:\brecho\admin
npm run dev
```

**URL do frontend:** http://localhost:5174  
**URL do backend:** http://localhost:4000

### ✅ Teste com servidor CORS isolado
```bash
cd G:\brecho\backend
node test-cors-server.js
```

## Comandos para Debug

### Teste da rota com curl:
```bash
curl -X GET "http://localhost:4000/api/products/seller/allproducts" \
  -H "Origin: http://localhost:5174" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: auth-token-seller"
```

### Teste no navegador:
```javascript
fetch('http://localhost:4000/api/products/seller/allproducts', {
  headers: {
    'Origin': 'http://localhost:5174',
    'auth-token-seller': 'seu_token_aqui'
  }
})
.then(res => res.json())
.then(data => console.log(data))
.catch(err => console.error(err));
```

## Resolução dos Erros

### Erro: "No 'Access-Control-Allow-Origin' header"
**Causa:** Backend não enviou header CORS  
**Solução:** Headers configurados em todas as rotas

### Erro: "preflight request doesn't pass"
**Causa:** Requisição OPTIONS não respondida corretamente  
**Solução:** Middleware OPTIONS implementado

## Recomendação Final

**Use o backend local durante o desenvolvimento!**

1. **Backend:** `npm run dev` (porta 4000)
2. **Frontend Admin:** Mude a URL para `http://localhost:4000` nas configurações
3. **Frontend User:** Mude a URL para `http://localhost:4000` nas configurações

Isso evita problemas de CORS e facilita o debug!