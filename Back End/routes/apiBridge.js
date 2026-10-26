'use strict';

// Loads an ES-module API handler from "Front End/api/<name>.js" and exposes it as Express middleware.

const path = require('path');
const { pathToFileURL } = require('url');

const API_DIR = path.resolve(__dirname, '..', '..', 'Front End', 'api');

function loadApiHandler(name) {
  let modulePromise = null;
  return (req, res, next) => {
    modulePromise = modulePromise || import(pathToFileURL(path.join(API_DIR, `${name}.js`)).href);
    modulePromise
      .then((mod) => mod.default(req, res))
      .catch((err) => {
        modulePromise = null;
        next(err);
      });
  };
}

module.exports = { loadApiHandler };
