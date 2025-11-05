module.exports = {
  apps: [{
    name: 'amazon-backend',
    script: 'dist/main.js',
    instances: 1,
    exec_mode: 'fork',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    error_file: '/app/logs/error.log',
    out_file: '/app/logs/out.log',
    merge_logs: true,
    env: {
      NODE_ENV: 'production',
      PORT: 10000
    }
  }]
};
