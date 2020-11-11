import express from 'express';
import AccountController from '../controllers/account.js';

const router = express.Router();
const accountController = new AccountController();

router.get('/', async (req, res, next) => {
  try {
    await accountController.getAllAccounts(req, res);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    await accountController.getAllAccounts(req, res);
  } catch (error) {
    next(error);
  }
});

router.get('/:agency/:accountNumber', async (req, res, next) => {
  try {
    await accountController.getAccountByAgencyAndNumber(req, res);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    await accountController.createAccount(req, res);
  } catch (error) {
    next(error);
  }
});

router.patch('/deposit', async (req, res, next) => {
  try {
    await accountController.updateBalance(req, res);
  } catch (error) {
    next(error);
  }
});

router.patch('/withdraw', async (req, res, next) => {
  try {
    await accountController.updateBalance(req, res);
  } catch (error) {
    next(error);
  }
});

router.patch('/transfer', async (req, res, next) => {
  try {
    await accountController.transfer(req, res);
  } catch (error) {
    next(error);
  }
});

router.get('/balance/:agency/:accountNumber', async (req, res, next) => {
  try {
    await accountController.getBalance(req, res);
  } catch (error) {
    next(error);
  }
});

router.get('/meanBalance/:agency', async (req, res, next) => {
  try {
    await accountController.getMeanBalanceByAgency(req, res);
  } catch (error) {
    next(error);
  }
});

router.get('/minBalance/:limit', async (req, res, next) => {
  try {
    await accountController.getMinBalance(req, res);
  } catch (error) {
    next(error);
  }
});

router.get('/maxBalance/:limit', async (req, res, next) => {
  try {
    await accountController.getMaxBalance(req, res);
  } catch (error) {
    next(error);
  }
});

router.patch('/upgradeAgency', async (req, res, next) => {
  try {
    await accountController.upgradeAgency(req, res);
  } catch (error) {
    next(error);
  }
});

router.delete('/remove/:agency/:accountNumber', async (req, res, next) => {
  try {
    await accountController.deleteAccount(req, res);
  } catch (error) {
    next(error);
  }
});

router.use((err, req, res, next) => {
  global.logger.error(`${req.method} ${req.originalUrl} - ${err.message}`);
  res.status(400).send({ error: err.message });
});

export default router;
