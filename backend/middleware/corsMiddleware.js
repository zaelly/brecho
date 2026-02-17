const cors = require("cors");

// Middleware CORS reutilizável
const corsMiddleware = (allowedOrigins = []) => {
  return cors({
    origin: function (origin, callback) {
      // Permitir requisições sem origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.includes(origin)) {
        console.log('CORS permitido para origem:', origin);
        callback(null, true);
      } else {
        console.log('Origem NÃO permitida pelo CORS:', origin);
        console.log('Origens permitidas:', allowedOrigins);
        callback(new Error('Não permitido pelo CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'auth-token', 'auth-token-seller'],
    credentials: true,
    optionsSuccessStatus: 200,
    preflightContinue: false
  });
};

module.exports = corsMiddleware;