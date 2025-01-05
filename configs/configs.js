import { promises } from 'fs';
import { load } from 'js-yaml';

class DbPsxConfig {
  constructor(user, password, dbname, host, port, sslmode, maxOpenConns, timer) {
    this.user = user;
    this.password = password;
    this.dbname = dbname;
    this.host = host;
    this.port = port;
    this.sslmode = sslmode;
    this.maxOpenConns = maxOpenConns;
    this.timer = timer;
  }
}

class DbRedisCfg {
  constructor(host, password, dbNumber, timer) {
    this.host = host;
    this.password = password;
    this.dbNumber = dbNumber;
    this.timer = timer;
  }
}

class DbService {
  constructor(address, appPort, connectionType) {
    this.address = address;
    this.appPort = appPort;
    this.connectionType = connectionType;
  }
}

async function parseRedisConfig(path) {
  try {
    const file = await promises.readFile(path, 'utf8');
    const config = load(file); 
    return new DbRedisCfg(config.host, config.password, config.db, config.timer);
  } catch (err) {
    throw new Error(`Error reading Redis config file: ${err.message}`);
  }
}

async function parsePostgresConfig(path) {
  try {
    const file = await promises.readFile(path, 'utf8');
    const config = load(file); 
    return new DbPsxConfig(config.user, config.password, config.dbname, config.host, config.port, config.sslmode, config.max_open_conns, config.timer);
  } catch (err) {
    throw new Error(`Error reading Postgres config file: ${err.message}`);
  }
}

async function parseServiceConfig(path) {
  try {
    const file = await promises.readFile(path, 'utf8');
    const config = load(file); 
    return new DbService(config.address, config.app_port, config.connection_type);
  } catch (err) {
    throw new Error(`Error reading Service config file: ${err.message}`);
  }
}

export default {
  DbPsxConfig,
  DbRedisCfg,
  DbService,
  parseRedisConfig,
  parsePostgresConfig,
  parseServiceConfig,
};
