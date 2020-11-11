import dotenv from 'dotenv-safe';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const DBUSER = process.env.DBUSER;
const DBPASS = process.env.DBPASS;
const PORT = process.env.PORT;

const settings = {
  db: {
    name: 'my-bank',
    url: `mongodb+srv://${DBUSER}:${DBPASS}@cluster0.wthbt.mongodb.net/my-bank?retryWrites=true&w=majority`,
  },
  app: {
    name: process.env.npm_package_name,
    port: PORT,
    endpoint: 'http://localhost:3000',
  },
  log: {
    level: 'silly',
    path: './src/logs',
  },
};

export default settings;
