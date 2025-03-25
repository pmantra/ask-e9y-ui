// src/config.ts
interface Config {
  API_URL: string;
  APP_ENV: string;
}

const config: Config = {
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  APP_ENV: import.meta.env.VITE_APP_ENV || 'development'
};

export default config; 