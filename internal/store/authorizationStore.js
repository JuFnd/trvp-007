import Pg from 'pg';
const { Pool } = Pg;

class ProfileRelationalStore {
  constructor(pool) {
    this.pool = pool;
  }

  async createUser(login, password) {
    const client = await this.pool.connect();

    try {
      await client.query('BEGIN');

      const insertProfileQuery = `
        INSERT INTO profile (login, password)
        VALUES ($1, $2)
      `;

      await client.query(insertProfileQuery, [
        login,
        password,
      ]);

      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      throw new Error(`Error creating user: ${err.message}`);
    } finally {
      client.release();
    }
  }

  async findUser(login) {
    const client = await this.pool.connect();
    try {
      const result = await client.query('SELECT login FROM profile WHERE login = $1', [login]);
      return result.rowCount > 0;
    } catch (err) {
      throw new Error(`Error finding user: ${err.message}`);
    } finally {
      client.release();
    }
  }

  async getUser(login, password) {
    const client = await this.pool.connect();
    try {
      const result = await client.query(`
        SELECT login FROM profile
        WHERE login = $1 AND password = $2
      `, [login, password]);

      if (result.rowCount === 0) {
        return null;
      }

      return { login: result.rows[0].login };
    } catch (err) {
      throw new Error(`Error getting user: ${err.message}`);
    } finally {
      client.release();
    }
  }

  async getUserProfileId(login) {
    const client = await this.pool.connect();
    try {
      const result = await client.query('SELECT id FROM profile WHERE login = $1', [login]);
      if (result.rowCount === 0) {
        throw new Error(`Profile ID not found for login: ${login}`);
      }
      return result.rows[0].id;
    } catch (err) {
      throw new Error(`Error getting user profile ID: ${err.message}`);
    } finally {
      client.release();
    }
  }

  async getUserRole(id) {
    const client = await this.pool.connect();
    try {
      const result = await client.query('SELECT role FROM profile WHERE id = $1', [id]);
      if (result.rowCount === 0) {
        throw new Error(`Role not found for user ID: ${id}`);
      }
      return result.rows[0].role;
    } catch (err) {
      throw new Error(`Error getting user role: ${err.message}`);
    } finally {
      client.release();
    }
  }
}

const createProfileStore = (config) => {
  const pool = new Pool({
    user: config.user,
    host: config.host,
    database: config.dbname,
    password: config.password,
    port: config.port,
    max: config.maxOpenConns || 10,
  });

  return new ProfileRelationalStore(pool);
};

export default createProfileStore;
