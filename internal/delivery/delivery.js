import express from 'express';
import utils from '../pkg/utils/utils.js';
import cookieParser from 'cookie-parser'; 

const { sendResponse, getRequestBody, getCookie } = utils;

class App {
  constructor(authService, billboardsService, logger) {
    this.app = express();
    this.logger = logger;
    this.billboardsService = billboardsService;
    this.authService = authService;

    this.app.use(cookieParser());
  }

  ping = (req, res) => {
    this.logger.info('Ping endpoint was called');
    sendResponse(res, req, 200, 'Pong!', null, null, this.logger);
  };

  signup = async (req, res) => {
    this.logger.info('Signup endpoint was called');
  
    const signupRequest = {};
    const error = await getRequestBody(req, signupRequest, this.logger);
    if (error) {
      return;
    }
  
    const found = await this.authService.findUserByLogin(signupRequest.login);
    if (found) {
      return sendResponse(res, req, 401, null, 'User already exists', null, this.logger);
    }
  
    try {
      await this.authService.createUserAccount(signupRequest.login, signupRequest.password);
    } catch (err) {
      if (err.message === 'Invalid login or password') {
        return sendResponse(res, req, 400, 'Invalid login or password', 'Invalid login or password', err, this.logger);
      }
      return sendResponse(res, req, 401, 'Invalid login or password', 'User already exists', err, this.logger);
    }
  
    const response = { login: signupRequest.login };
    sendResponse(res, req, 200, response, 'User signed up successfully', null, this.logger);
  };
  

  signin = async (req, res) => {
    this.logger.info('Signin endpoint was called');
  
    const signinRequest = {};
    const error = await getRequestBody(req, signinRequest, this.logger);
    if (error) {
      return;
    }
  
    const user = await this.authService.findUserAccount(signinRequest.login, signinRequest.password);
    if (!user) {
      return sendResponse(res, req, 401, null, 'Invalid login or password', null, this.logger);
    }
  
    const session = await this.authService.createSession(req.context, user.login);
  
    const authorizationCookie = getCookie('session_id', session.sid, '/', true, session.expiresAt);
    res.cookie(authorizationCookie.name, authorizationCookie.value, authorizationCookie.options);
    sendResponse(res, req, 200, null, 'Signin successful', null, this.logger);
  };
  

  logoutSession = async (req, res) => {
    this.logger.info('Logout endpoint was called');
  
    const session = req.cookies['session_id'];
    if (!session) {
      return sendResponse(res, req, 401, null, 'Session not found', null, this.logger);
    }
  
    const found = await this.authService.findActiveSession(req.context, session);
    if (!found) {
      return sendResponse(res, req, 401, null, 'Session not found', null, this.logger);
    }
  
    try {
      await this.authService.killSession(req.context, session);
    } catch (err) {
      return sendResponse(res, req, 500, null, 'Error killing session', err, this.logger);
    }
  
    res.clearCookie('session_id');
    sendResponse(res, req, 200, null, 'Logout successful', null, this.logger);
  };
  

  run(appConf) {
    this.app.get('/api/v1/ping', this.ping);
    this.app.post('/api/v1/signup', this.signup);
    this.app.post('/api/v1/signin', this.signin);
    this.app.get('/api/v1/logout', this.logoutSession);

    this.app.listen(appConf.appPort, appConf.address, () => {
      console.log(`Server is running on port ${appConf.appPort}`);
    });
  }
}

export default App;
