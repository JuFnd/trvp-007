const { json } = require('express');

function sendResponse(res, req, status, body, errorMessage, handlerError, logger) {
  jsonResponse = JSON.stringify(body);
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
    logger.error(errorMessage, {
      method: req.method,
      status,
      path: req.path,
    });
  }
}

function getRequestBody(req, requestObject, logger) {
  return new Promise((resolve, reject) => {
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
  })
    .then(() => {})
    .catch(err => {
      sendResponse(req.res, req, 400, null, 'Bad Request', err, logger);
    });
}

function getCookie(name, value, path, httpOnly, expires) {
  return {
    name,
    value,
    path,
    expires,
    httpOnly,
  };
}

function randStringRunes(seed) {
  const symbols = [];
  const letterRunes = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

  for (let i = 0; i < seed; i++) {
    symbols[i] = letterRunes[Math.floor(Math.random() * letterRunes.length)];
  }

  return symbols.join('');
}

function randInt() {
  return Math.floor(Math.random() * 1000000000);
}

module.exports = {
    sendResponse,
    getRequestBody,
    getCookie,
    randStringRunes,
    randInt,
};