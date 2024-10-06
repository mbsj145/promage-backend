import { config } from 'dotenv';
config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
};