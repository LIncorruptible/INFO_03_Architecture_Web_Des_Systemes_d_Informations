const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') })

const DB_NAME = process.env.DB_NAME;
const DB_PORT = process.env.DB_PORT;
const DB_HOST = process.env.DB_HOST;
const DB_USER_NAME = process.env.DB_USER_NAME;
const DB_USER_PASSWORD = process.env.DB_USER_PASSWORD;
const SECRET_KEY = process.env.SECRET_KEY;

const MONGO_URI = `mongodb://${DB_USER_NAME}:${DB_USER_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;

export { MONGO_URI, DB_NAME, DB_PORT, DB_HOST, DB_USER_NAME, DB_USER_PASSWORD, SECRET_KEY };