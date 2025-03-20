// fix.js
const fs = require('fs');
const path = require('path');

// Make sure tsconfig.node.json exists in the root
if (!fs.existsSync('tsconfig.node.json')) {
  console.log('Creating tsconfig.node.json');
  fs.writeFileSync('tsconfig.node.json', JSON.stringify({
    "compilerOptions": {
      "composite": true,
      "skipLibCheck": true,
      "module": "ESNext",
      "moduleResolution": "bundler",
      "allowSyntheticDefaultImports": true
    },
    "include": ["vite.config.ts"]
  }, null, 2));
}

// Create temporary config file if needed
if (!fs.existsSync('src/config.js')) {
  console.log('Creating config.js');
  fs.writeFileSync('src/config.js', `
const config = {
  API_URL: import.meta.env.VITE_API_URL || 'https://your-railway-app.up.railway.app'
};

export default config;
  `);
}

console.log('Fix script completed');