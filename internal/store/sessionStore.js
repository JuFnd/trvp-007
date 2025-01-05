import Redis from 'ioredis';

class SessionStore {
  constructor(redisClient) {
    this.redisClient = redisClient;
  }

  async addSession(ctx, session) {
    try {
      await this.redisClient.set(session.sid, session.login, 'EX', 86400);
      return true;
    } catch (err) {
      throw new Error(`Error adding session: ${err.message}`);
    }
  }

  async checkActiveSession(ctx, sid) {
    try {
      const result = await this.redisClient.get(sid);
      return result !== null;
    } catch (err) {
      throw new Error(`Error checking active session: ${err.message}`);
    }
  }

  async getUserLogin(ctx, sid) {
    try {
      const value = await this.redisClient.get(sid);
      if (value === null) {
        throw new Error('Session not found');
      }
      return value;
    } catch (err) {
      throw new Error(`Error getting user login: ${err.message}`);
    }
  }

  async deleteSession(ctx, sid) {
    try {
      const result = await this.redisClient.del(sid);
      return result > 0;
    } catch (err) {
      throw new Error(`Error deleting session: ${err.message}`);
    }
  }
}

const createSessionStore = (config) => {
  const redisClient = new Redis({
    host: config.host,
    port: config.port,
    password: config.password,
    db: config.dbNumber,
  });

  return new SessionStore(redisClient);
};

export default createSessionStore;
