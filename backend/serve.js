const app = require('./api/index'); // Aponta para o seu código principal
const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`✅ Servidor Local Rodando em http://localhost:${port}`);
});