import express from 'express';

export interface MongoOptions {
  db_url: string | undefined;
  options: {
    useNewUrlParser: boolean;
    useUnifiedTopology: boolean;
  };
  debug: boolean;
}

export interface Config {
  env: string;
  assets: express.RequestHandler;
  view: string;
  port: number | string;
  ip: string;
  seedDB: boolean;
  mongo: MongoOptions;
}