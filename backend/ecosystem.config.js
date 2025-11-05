module.exports = {
  apps: [
    {
      name: 'amazon-backend',
      script: 'dist/main.js',
      instances: 'max',
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
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
