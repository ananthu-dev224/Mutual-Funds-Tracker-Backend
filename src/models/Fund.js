import mongoose from 'mongoose';

const fundSchema = new mongoose.Schema({
  schemeCode: { type: Number, required: true, unique: true, index: true },
  schemeName: { type: String, required: true },
  isinGrowth: { type: String },
  isinDivReinvestment: { type: String },
  fundHouse: { type: String },
  schemeType: { type: String },
  schemeCategory: { type: String }
}, { timestamps: true });

const Fund = mongoose.model('Fund', fundSchema);
export default Fund;
