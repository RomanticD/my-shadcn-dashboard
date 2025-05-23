module.exports = {
  apps: [
    {
      name: 'my-shadcn-dashboard',
      script: 'npm',
      args: 'start',
      cwd: '/home/junyi/my-shadcn-dashboard',
      max_memory_restart: '5G',
      env: {
        NODE_ENV: 'production',
        NODE_OPTIONS: '--max-old-space-size=1024',
        PORT: 3221
      },
      autorestart: true,
      watch: false,
      max_restarts: 10,
      restart_delay: 4000,
      error_file: 'logs/err.log',
      out_file: 'logs/out.log',
      log_file: 'logs/combined.log',
      time: true
    }
  ]
};
