import express from 'express';
import logger from './services/logger.service.js';
import accountRouter from './routers/account.js';

global.logger = logger;

const app = express();
app.use(express.json());

app.use('/account', accountRouter);

export default app;
