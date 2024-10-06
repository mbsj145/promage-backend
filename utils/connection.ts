import mongoose from 'mongoose';
import { configEnvironment } from '../config/environment';

function getConnection(): void {
  mongoose.connect(configEnvironment.mongo.db_url as string);

  mongoose.connection.on('connected', () => console.log('Mongoose default connected'));

  mongoose.connection.on('error', (err) => console.log('Mongoose default connection error: ' + err));

  mongoose.connection.on('disconnected', () => {
    console.log('Mongoose default connection disconnected');
  });

}

export { getConnection };