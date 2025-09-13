import Portfolio from '../models/Portfolio.js';
import mongoose from 'mongoose';

// ADD fund to portfolio
export const addFund = async (req, res) => {
  try {
    const userId = req.user.id;
    const { schemeCode, units, purchaseDate } = req.body;

    if (!schemeCode || !units || units <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid input' });
    }

    const pDate = purchaseDate ? new Date(purchaseDate) : new Date();

    // store without NAV for now (we’ll add NAV fetch logic later)
    const portfolio = await Portfolio.create({
      userId: new mongoose.Types.ObjectId(userId),
      schemeCode,
      units,
      purchaseDate: pDate,
    });

    res.status(201).json({
      success: true,
      message: 'Fund added to portfolio successfully',
      portfolio,
    });
  } catch (err) {
    console.error('addFund error', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// LIST all portfolio holdings for user
export const listPortfolio = async (req, res) => {
  try {
    const userId = req.user.id;
    const items = await Portfolio.find({ userId }).lean();

    res.json({
      success: true,
      data: { totalHoldings: items.length, holdings: items },
    });
  } catch (err) {
    console.error('listPortfolio error', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// VALUE (aggregate portfolio value) — stub, we’ll add NAV logic later
export const portfolioValue = async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        totalInvestment: 0,
        currentValue: 0,
        profitLoss: 0,
        profitLossPercent: 0,
        asOn: new Date().toISOString(),
        holdings: [],
      },
    });
  } catch (err) {
    console.error('portfolioValue error', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// HISTORY (portfolio value over time) — stub
export const portfolioHistory = async (req, res) => {
  try {
    res.json({
      success: true,
      data: [],
    });
  } catch (err) {
    console.error('portfolioHistory error', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// REMOVE a fund from portfolio
export const removeFund = async (req, res) => {
  try {
    const userId = req.user.id;
    const schemeCode = parseInt(req.params.schemeCode, 10);

    const removed = await Portfolio.findOneAndDelete({ userId, schemeCode });
    if (!removed) {
      return res.status(404).json({ success: false, message: 'Fund not found' });
    }

    res.json({ success: true, message: 'Fund removed from portfolio successfully' });
  } catch (err) {
    console.error('removeFund error', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
