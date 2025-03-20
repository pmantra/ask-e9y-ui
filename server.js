import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();
const VITE_PORT = 5175;
const API_PORT = 8000;

// Add middleware to set the cookie for all responses
app.use((req, res, next) => {
  res.setHeader('Set-Cookie', 'ngrok-skip-browser-warning=true');
  next();
});

// Then your proxy middleware as before
app.use(
  '/api',
  createProxyMiddleware({
    target: `http://localhost:${API_PORT}`,
    changeOrigin: true,
  })
);

app.use(
  '/',
  createProxyMiddleware({
    target: `http://localhost:${VITE_PORT}`,
    changeOrigin: true,
  })
);

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Proxy server is running on http://localhost:${PORT}`);
});