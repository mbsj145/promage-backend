import { Application } from 'express';

export default (app: Application): void => {
    app.use('/api/v1', require('../api/user'));
};