/**
 * pm2 process definition for production (VPS). Used by scripts/deploy.sh via
 * `pm2 startOrReload`, so the runtime environment is pinned here rather than
 * inherited from whichever shell happened to run the deploy.
 */
module.exports = {
  apps: [
    {
      name: "stratoform",
      cwd: __dirname,
      script: "node_modules/.bin/next",
      args: "start -H 127.0.0.1 -p 3004",
      env: {
        NODE_ENV: "production",
        NEXT_DIST_DIR: ".next-build",
        NEXT_TELEMETRY_DISABLED: "1",
      },
    },
  ],
};
