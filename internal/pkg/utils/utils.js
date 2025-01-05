import { createHash } from 'crypto';

const sendResponse = (res, req, status, body, errorMessage, handlerError, logger) => {
  const jsonResponse = JSON.stringify(body);
  res.setHeader('Content-Type', 'application/json');
  res.status(status).send(jsonResponse);

  if (handlerError) {
    logger.error(errorMessage, {
      method: req.method,
      status,
      path: req.path,
      error: handlerError.message,
    });
  } else {
    logger.info(errorMessage, {
      method: req.method,
      status,
      path: req.path,
    });
  }
};

const getRequestBody = async (req, requestObject, logger) => {
  try {
    await new Promise((resolve, reject) => {
      let body = [];
      req.on('data', chunk => {
        body.push(chunk);
      });

      req.on('end', () => {
        try {
          body = JSON.parse(Buffer.concat(body).toString());
          Object.assign(requestObject, body);
          resolve();
        } catch (err) {
          reject(err);
        }
      });
    });
  } catch (err_1) {
    sendResponse(req.res, req, 400, null, 'Bad Request', err_1, logger);
  }
};

const getCookie = (name, value, path, httpOnly, expiresAt) => {
  return {
    name,
    value,
    options: {
      path,
      httpOnly,
      expires: expiresAt,
    },
  };
};

const randStringRunes = (seed) => {
  const symbols = [];
  const letterRunes = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

  for (let i = 0; i < seed; i++) {
    symbols[i] = letterRunes[Math.floor(Math.random() * letterRunes.length)];
  }

  return symbols.join('');
};

const randInt = () => {
  return Math.floor(Math.random() * 1000000000);
};

export default {
  sendResponse,
  getRequestBody,
  getCookie,
  randStringRunes,
  randInt,
};