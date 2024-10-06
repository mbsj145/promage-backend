process.env.NODE_ENV = process.env.NODE_ENV || 'development';

import path from 'path';
import express from 'express';
import {Config} from './interfaces';

let mongoConfig;

if (process.env.NODE_ENV === 'localhost') {
    mongoConfig = require('./localhost').default;
} else if (process.env.NODE_ENV === 'development') {
    mongoConfig = require('./development').default;
} else if (process.env.NODE_ENV === 'production') {
    mongoConfig = require('./production').default;
} else {
    throw new Error('NODE_ENV is not set or is invalid');
}


// Export the config object based on the NODE_ENV
export const configEnvironment: Config = {
  env: process.env.NODE_ENV,

  // Frontend path to server
  assets: express.static(path.join(__dirname, '../../public')),
  view: path.normalize(path.join(__dirname, '../../public/index.html')),

  // Server port
  port: process.env.PORT || 4000,

  // Server IP
  ip: process.env.IP || '0.0.0.0',

  // Should we populate the DB with sample data?
  seedDB: true,

  // MongoDB configuration
  mongo:mongoConfig,
};