const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:8080'
  ];
  
  module.exports = {
    corsOptions: {
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
      optionsSuccessStatus: 200
    }
  };