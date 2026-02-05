// Middleware de tratamento de erros para debug
const errorHandler = (err, req, res, next) => {
  console.error('Erro detalhado:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    origin: req.get('Origin'),
    headers: req.headers
  });
  
  // Erro de CORS específico
  if (err.message.includes('Não permitido pelo CORS')) {
    return res.status(403).json({
      success: false,
      message: 'Origem não permitida',
      origin: req.get('Origin'),
      allowedOrigins: [
        'http://localhost:5173',
        'http://localhost:3000',
        'http://localhost:5174',
        'https://brechobackend.vercel.app',
        'https://brechoadmin.vercel.app'
      ]
    });
  }
  
  res.status(500).json({
    success: false,
    message: 'Erro interno do servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
};

module.exports = errorHandler;