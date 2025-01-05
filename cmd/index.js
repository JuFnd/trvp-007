import App from '../internal/delivery/delivery.js';
import configs from '../configs/configs.js';
import logger from '../internal/pkg/logger/logger.js';
import AuthorizationService from '../internal/service/auth.js';
import createProfileStore from '../internal/store/authorizationStore.js'
import createSessionStore from '../internal/store/sessionStore.js'

async function main() {
  try {
    const redisConfig = await configs.parseRedisConfig('configs/yamls/redis.yaml');
    const postgresConfig = await configs.parsePostgresConfig('configs/yamls/postgres.yaml');
    const serviceConfig = await configs.parseServiceConfig('configs/yamls/service.yaml');

    const authStore = createProfileStore(postgresConfig)
    const sessionStore = createSessionStore(redisConfig);
    const authService = new AuthorizationService(authStore, sessionStore)
    const app = new App(authService, null, logger);
    app.run(serviceConfig);
  } catch (err) {
    console.error('Error start app:', err.message);
  }
}


main().catch(err => {
  console.error('Error starting the server:', err);
});
