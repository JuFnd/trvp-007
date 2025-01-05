import App from '../internal/delivery/delivery.js';
import configs from '../configs/configs.js';

async function main() {
  try {
    const app = new App(null);
    const redisConfig = await configs.parseRedisConfig('configs/yamls/redis.yaml');
    const postgresConfig = await configs.parsePostgresConfig('configs/yamls/postgres.yaml');
    const serviceConfig = await configs.parseServiceConfig('configs/yamls/service.yaml');

    console.log('Redis Config:', redisConfig);
    console.log('Postgres Config:', postgresConfig);
    console.log('Service Config:', serviceConfig);
    app.run(serviceConfig);
  } catch (err) {
    console.error('Error parsing configuration files:', err.message);
  }
}


main().catch(err => {
  console.error('Error starting the server:', err);
});
