// src/config.js
const config = {
    API_URL: process.env.VITE_API_URL || 'http://localhost:8000',
    APP_ENV: process.env.VITE_APP_ENV || 'development'
  };
  
  export default config;