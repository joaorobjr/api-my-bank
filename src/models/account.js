import mongoose from 'mongoose';

const accountSchema = mongoose.Schema({
  agency: {
    type: Number,
    required: true,
  },
  accountNumber: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
    required: true,
    min: 0,
  },
});

const accountModel = mongoose.model('accounts', accountSchema);

accountModel.schema.path('balance').validate((value) => {
  return value > 0;
}, 'Balance value cannot be less than zero');

export default accountModel;
