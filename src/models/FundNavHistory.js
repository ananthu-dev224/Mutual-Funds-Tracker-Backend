import mongoose from 'mongoose';

const fundNavHistorySchema = new mongoose.Schema({
  schemeCode: { type: Number, required: true, index: true },
  nav: { type: Number, required: true },
  date: { type: String }, // DD-MM-YYYY
  createdAt: { type: Date, default: Date.now }
});

// index for fast date queries
fundNavHistorySchema.index({ schemeCode: 1, date: -1 });

const FundNavHistory = mongoose.model('FundNavHistory', fundNavHistorySchema);
export default FundNavHistory;
