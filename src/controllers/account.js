import accountModel from '../models/account.js';

const OPERATION_TYPE = {
  withdraw: 1,
  deposit: 2,
};

export class AccountController {
  async createAccount(req, res) {
    try {
      const account = await new accountModel(req.body).save();
      res.send(account);
    } catch (error) {
      logger.error('Unable create account - ' + error);
    }
  }

  async getAllAccounts(req, res) {
    try {
      const accounts = await accountModel.find({});
      res.send(accounts);
    } catch (error) {
      throw new Error('Unable to retrieve accounts - ' + error);
    }
  }

  async findAccountByAgencyAndNumber(agency, accountNumber) {
    const condition = { agency, accountNumber };
    const account = await accountModel.findOne(condition).exec();
    if (account == null) {
      throw new Error(
        `Agency ${agency} or account ${accountNumber} not exist.`
      );
    }
    return account;
  }

  async getAccountByAgencyAndNumber(req, res) {
    try {
      const { agency, accountNumber } = req.params;

      let account = await this.findAccountByAgencyAndNumber(
        agency,
        accountNumber
      );
      res.send(account);
    } catch (error) {
      throw new Error(error);
    }
  }

  async findAccountByNumber(accountNumber) {
    const condition = { accountNumber };
    const account = await accountModel.findOne(condition).exec();
    if (account == null) {
      throw new Error(`Account ${accountNumber} not exist.`);
    }
    return account;
  }

  async updateBalance(req, res) {
    try {
      const { agency, accountNumber, value } = req.body;

      if (!agency || !accountNumber || !value) {
        throw new Error(
          'Required fields are missing. [agency, accountNumber, value]'
        );
      }

      if (value <= 0) {
        throw new Error('Value must be greater than zero.');
      }

      let account = await this.findAccountByAgencyAndNumber(
        agency,
        accountNumber
      );

      let newBalance = 0;
      if (req.url === '/deposit') {
        newBalance = account.balance + value;
      }

      if (req.url === '/withdraw') {
        if (account.balance < value) {
          throw new Error('Insufficient balance');
        }
        newBalance = account.balance - value - 1;
      }

      const condition = { agency, accountNumber };
      const update = { balance: newBalance };
      const options = { useFindAndModify: false, new: true };
      account = await accountModel
        .findOneAndUpdate(condition, update, options)
        .exec();

      res.send(account);
    } catch (error) {
      throw new Error(error);
    }
  }

  async getBalance(req, res) {
    try {
      const { agency, accountNumber } = req.params;
      const account = await this.findAccountByAgencyAndNumber(
        agency,
        accountNumber
      );
      res.send({ balance: account.balance });
    } catch (error) {
      throw new Error(error);
    }
  }

  async getMeanBalanceByAgency(req, res) {
    try {
      const agency = parseInt(req.params.agency);
      console.log(agency);
      const meanBalance = await accountModel.aggregate([
        {
          $match: { agency: agency },
        },
        {
          $group: {
            _id: { agency: '$agency' },
            balance: { $avg: '$balance' },
          },
        },
      ]);
      res.send(meanBalance);
    } catch (error) {
      throw new Error(error);
    }
  }

  async getMinBalance(req, res) {
    try {
      const limit = parseInt(req.params.limit);
      const minBalance = await accountModel.aggregate([
        {
          $group: {
            _id: {
              agency: '$agency',
              accountNumber: '$accountNumber',
            },
            balance: { $min: '$balance' },
          },
        },
        {
          $limit: limit,
        },
        {
          $sort: { balance: 1 },
        },
      ]);

      res.send(minBalance);
    } catch (error) {
      throw new Error(error);
    }
  }

  async getMaxBalance(req, res) {
    try {
      const limit = parseInt(req.params.limit);
      const maxBalance = await accountModel.aggregate([
        {
          $group: {
            _id: {
              agency: '$agency',
              accountNumber: '$accountNumber',
              name: '$name',
            },
            balance: { $max: 'balance' },
          },
        },
        {
          $limit: limit,
        },
        {
          $sort: { balance: -1 },
        },
      ]);

      res.send(maxBalance);
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteAccount(req, res) {
    try {
      const { agency, accountNumber } = req.params;
      const condition = { agency, accountNumber };
      const account = await accountModel.findOneAndDelete(condition).exec();
      if (account == null) {
        throw new Error(
          `Unable delete account ${accountNumber} from agency ${agency}`
        );
      }
      const activeAccounts = await accountModel.aggregate([
        {
          $match: { agency: parseInt(agency) },
        },
        { $count: 'accountNumber' },
      ]);
      res.send({
        agency: parseInt(agency),
        totalActiveAccounts: activeAccounts[0].accountNumber,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async transfer(req, res) {
    try {
      const { accountNumberSource, accountNumberTarget, value } = req.body;

      if (!accountNumberSource || !accountNumberTarget || !value) {
        throw new Error(
          'Required fields are missing. [accountNumberSource, accountNumberTarget, value]'
        );
      }

      if (value <= 0) {
        throw new Error('Value must be greater than zero.');
      }

      let accountSource = await this.findAccountByNumber(accountNumberSource);
      let accountTarget = await this.findAccountByNumber(accountNumberTarget);

      if (accountSource.balance < value) {
        throw new Error('Unable to process transaction. Insufficient balance');
      }

      let newBalanceSource = accountSource.balance - value;
      if (accountSource.agency !== accountTarget.agency) {
        newBalanceSource -= 8;
      }
      const newBalanceTarget = accountTarget.balance + value;

      const updateSource = { balance: newBalanceSource };
      const updateTarget = { balance: newBalanceTarget };
      const options = { useFindAndModify: false, new: true };
      accountSource = await accountModel.findByIdAndUpdate(
        accountSource.id,
        updateSource,
        options
      );
      accountTarget = await accountModel.findByIdAndUpdate(
        accountTarget.id,
        updateTarget,
        options
      );

      res.send({ accountSource, accountTarget });
    } catch (error) {
      throw new Error(error);
    }
  }

  async upgradeAgency(req, res) {
    try {
      const limit = parseInt(req.params.limit);
      const maxBalanceByAgency = await accountModel.aggregate([
        {
          $group: {
            _id: { agency: '$agency' },
            maxBalance: { $max: '$balance' },
          },
        },
      ]);

      res.send(maxBalanceByAgency);
    } catch (error) {
      throw new Error(error);
    }
  }
}

export default AccountController;
