import utils from '../pkg/utils/utils.js';
import errors from '../pkg/errors/errors.js';

const { hashPassword, randStringRunes } = utils;
const { ErrNotFound, ErrEntityAlreadyExist } = errors;

class AuthorizationService {
  constructor(authorizationStore, sessionStore) {
    this.authorizationStore = authorizationStore;
    this.sessionStore = sessionStore;
  }

  async signin(ctx, req) {
    const { login, password } = req;

    const user = await this.authorizationStore.getUser({
      login,
      password: password,
    });

    if (!user) {
      throw ErrNotFound;
    }

    const newSession = {
      login,
      sid: randStringRunes(32),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    };

    const sessionAdded = await this.sessionStore.addSession(ctx, newSession);
    if (!sessionAdded) {
      throw ErrEntityAlreadyExist;
    }

    return { session: newSession, user };
  }

  async authCheck(ctx, sessionId) {
    const isActive = await this.sessionStore.checkActiveSession(ctx, sessionId);
    if (!isActive) {
      return [false, null];
    }

    const login = await this.sessionStore.getUserLogin(ctx, sessionId);
    const users = await this.authorizationStore.listUsers({ logins: [login] });

    if (users.length === 0) {
      throw ErrNotFound;
    }

    return [isActive, users[0]];
  }

  async logout(ctx, sessionId) {
    const isActive = await this.sessionStore.checkActiveSession(ctx, sessionId);
    if (!isActive) {
      throw new Error('Not authorized');
    }

    const result = await this.sessionStore.deleteSession(ctx, sessionId);
    return result;
  }

  async signup(ctx, req) {
    const { login, password } = req;

    const user = await this.authorizationStore.createUser(login, password);

    return user;
  }

  async listUsers(ctx, filter) {
    const users = await this.authorizationStore.listUsers({
      ids: filter.ids,
      logins: filter.logins,
      roles: filter.roles,
    });

    return users;
  }

  async getRoleByToken(ctx, sessionId) {
    const login = await this.sessionStore.getUserLogin(ctx, sessionId);
    const users = await this.authorizationStore.listUsers({ logins: [login] });

    if (users.length === 0) {
      return 'unknown';
    }

    return users[0].role;
  }

  // New methods based on the Go Core struct

  async createSession(ctx, login) {
    const newSession = {
      login,
      sid: randStringRunes(32),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    };

    const sessionAdded = await this.sessionStore.addSession(ctx, newSession);
    if (!sessionAdded) {
      throw new Error('Session already exists');
    }

    return newSession;
  }

  async killSession(ctx, sessionId) {
    const result = await this.sessionStore.deleteSession(ctx, sessionId);
    if (!result) {
      throw new Error('Failed to kill session');
    }
    return true;
  }

  async findActiveSession(ctx, sessionId) {
    const isActive = await this.sessionStore.checkActiveSession(ctx, sessionId);
    return isActive;
  }

  async createUserAccount(login, password) {
    const matched = /^[a-zA-Z0-9_]{3,20}$/.test(login);
    if (!matched) {
      throw new Error('Invalid login format');
    }

    const userCreated = await this.authorizationStore.createUser(login, password);

    return userCreated;
  }

  async findUserByLogin(ctx, login) {
    const found = await this.authorizationStore.findUser(login);
    return found;
  }

  async findUserAccount(login, password) {
    const user = await this.authorizationStore.getUser(login, password);
    return user;
  }

  async getUserId(ctx, sessionId) {
    const login = await this.sessionStore.getUserLogin(ctx, sessionId);
    const userId = await this.authorizationStore.getUserProfileId(login);
    return userId;
  }

  async getUserRole(ctx, userId) {
    const role = await this.authorizationStore.getUserRole(userId);
    return role;
  }
}

export default AuthorizationService;
