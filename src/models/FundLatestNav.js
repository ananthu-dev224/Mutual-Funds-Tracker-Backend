import mongoose from 'mongoose';

const fundLatestNavSchema = new mongoose.Schema({
  schemeCode: { type: Number, required: true, unique: true, index: true },
  nav: { type: Number, required: true },
  date: { type: String }, // DD-MM-YYYY format
  updatedAt: { type: Date, default: Date.now }
});

const FundLatestNav = mongoose.model('FundLatestNav', fundLatestNavSchema);
export default FundLatestNav;
