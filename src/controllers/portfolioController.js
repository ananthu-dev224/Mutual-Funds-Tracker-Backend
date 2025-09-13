import Portfolio from '../models/Portfolio.js';
import mongoose from 'mongoose';
import {
  fetchNavHistory,
  fetchLatestNav,
  findNavByDate
} from '../utils/mfApi.js';

// Helper: convert Date → DD-MM-YYYY
function toDmY(date) {
  const d = new Date(date);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

// ADD fund (now fetch NAV at purchase date)
export const addFund = async (req, res) => {
  try {
    const userId = req.user.id;
    const { schemeCode, units, purchaseDate } = req.body;

    if (!schemeCode || !units || units <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid input' });
    }

    const pDate = purchaseDate ? new Date(purchaseDate) : new Date();

    // try to get NAV on purchase date
    let purchaseNav = null;
    try {
      const history = await fetchNavHistory(schemeCode);
      purchaseNav = findNavByDate(history, toDmY(pDate));
    } catch (err) {
      console.warn('NAV fetch failed for purchaseDate', err.message);
    }

    const investedAmount = purchaseNav ? units * purchaseNav : null;

    const portfolio = await Portfolio.create({
      userId: new mongoose.Types.ObjectId(userId),
      schemeCode,
      units,
      purchaseDate: pDate,
      purchaseNav,
      investedAmount
    });

    res.status(201).json({
      success: true,
      message: 'Fund added successfully',
      portfolio
    });
  } catch (err) {
    console.error('addFund error', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// LIST (just shows holdings)
export const listPortfolio = async (req, res) => {
  try {
    const userId = req.user.id;
    const items = await Portfolio.find({ userId }).lean();
    res.json({ success: true, data: { totalHoldings: items.length, holdings: items } });
  } catch (err) {
    console.error('listPortfolio error', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// VALUE (current portfolio value + profit/loss)
export const portfolioValue = async (req, res) => {
  try {
    const userId = req.user.id;
    const items = await Portfolio.find({ userId }).lean();

    let totalInvestment = 0;
    let currentValue = 0;
    const holdings = [];

    for (const it of items) {
      if (it.investedAmount != null) {
        totalInvestment += it.investedAmount;
      }

      let currentNav = null;
      let cVal = null;
      try {
        const latest = await fetchLatestNav(it.schemeCode);
        currentNav = parseFloat(latest.nav || latest.nav_value || latest.lastPrice || latest);
        cVal = currentNav ? it.units * currentNav : null;
        if (cVal) currentValue += cVal;
      } catch (err) {
        console.warn('Latest NAV fetch failed', err.message);
      }

      holdings.push({
        schemeCode: it.schemeCode,
        units: it.units,
        purchaseDate: it.purchaseDate,
        purchaseNav: it.purchaseNav,
        investedAmount: it.investedAmount,
        currentNav,
        currentValue: cVal,
        profitLoss: (cVal && it.investedAmount) ? (cVal - it.investedAmount) : null
      });
    }

    const profitLoss = currentValue - totalInvestment;
    const profitLossPercent = totalInvestment ? (profitLoss / totalInvestment) * 100 : null;

    res.json({
      success: true,
      data: {
        totalInvestment,
        currentValue,
        profitLoss,
        profitLossPercent,
        asOn: new Date().toISOString(),
        holdings
      }
    });
  } catch (err) {
    console.error('portfolioValue error', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// HISTORY (portfolio value over date range)
export const portfolioHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    let { startDate, endDate } = req.query;

    const end = endDate ? new Date(endDate) : new Date();
    const start = startDate ? new Date(startDate) : new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);

    const items = await Portfolio.find({ userId }).lean();

    // Build date array
    const dates = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      dates.push(toDmY(new Date(d)));
    }

    // Fetch history for each scheme
    const histories = {};
    for (const it of items) {
      if (!histories[it.schemeCode]) {
        try {
          histories[it.schemeCode] = await fetchNavHistory(it.schemeCode);
        } catch (err) {
          histories[it.schemeCode] = null;
        }
      }
    }

    // Compute value per date
    const data = dates.map(dateStr => {
      let totalValue = 0;
      for (const it of items) {
        const hist = histories[it.schemeCode];
        if (!hist) continue;
        const nav = findNavByDate(hist, dateStr);
        if (nav) totalValue += it.units * nav;
      }
      return { date: dateStr, totalValue };
    });

    res.json({ success: true, data });
  } catch (err) {
    console.error('portfolioHistory error', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// REMOVE
export const removeFund = async (req, res) => {
  try {
    const userId = req.user.id;
    const schemeCode = parseInt(req.params.schemeCode, 10);
    const removed = await Portfolio.findOneAndDelete({ userId, schemeCode });
    if (!removed) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, message: 'Fund removed successfully' });
  } catch (err) {
    console.error('removeFund error', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
