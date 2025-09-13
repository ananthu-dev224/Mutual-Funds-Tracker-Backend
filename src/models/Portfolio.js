import mongoose from 'mongoose';

const portfolioSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  schemeCode: { type: Number, required: true, index: true },
  units: { type: Number, required: true, min: 0 },
  purchaseDate: { type: Date, required: true },
  purchaseNav: { type: Number },        // NAV at time of purchase
  investedAmount: { type: Number }      // units * purchaseNav
}, { timestamps: true });

const Portfolio = mongoose.model('Portfolio', portfolioSchema);
export default Portfolio;
