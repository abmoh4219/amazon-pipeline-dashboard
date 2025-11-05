const path = require('path');

module.exports = {
  apps: [
    {
      name: 'amazon-backend',
      script: './dist/main.js',
      cwd: __dirname,
      instances: 1,  // Use 1 instance for now, can be increased later
      exec_mode: 'fork',  // Changed from cluster to fork for better debugging
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: './logs/error.log',
      out_file: './logs/out.log',
      merge_logs: true,
      env: {
        NODE_ENV: 'production',
        PORT: 10000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 10000
      }
    }
  ]
};
