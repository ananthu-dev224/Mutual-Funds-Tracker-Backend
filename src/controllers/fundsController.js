import Fund from '../models/Fund.js';
import FundLatestNav from '../models/FundLatestNav.js';
import { fetchLatestNav } from '../utils/mfApi.js';

// List/Search funds
export const listFunds = async (req, res) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (search) {
      query.schemeName = { $regex: search, $options: 'i' };
    }

    const skip = (page - 1) * limit;
    const funds = await Fund.find(query)
      .skip(skip)
      .limit(parseInt(limit, 10))
      .lean();

    const total = await Fund.countDocuments(query);

    res.json({
      success: true,
      data: {
        funds,
        pagination: {
          currentPage: parseInt(page, 10),
          totalPages: Math.ceil(total / limit),
          totalFunds: total,
          hasNext: skip + funds.length < total,
          hasPrev: page > 1
        }
      }
    });
  } catch (err) {
    console.error('listFunds error', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get fund details by schemeCode
export const getFundByCode = async (req, res) => {
  try {
    const schemeCode = parseInt(req.params.schemeCode, 10);
    const fund = await Fund.findOne({ schemeCode }).lean();

    if (!fund) {
      return res.status(404).json({ success: false, message: 'Fund not found' });
    }

    res.json({ success: true, data: fund });
  } catch (err) {
    console.error('getFundByCode error', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get latest NAV (check DB cache first, then API)
export const getFundNav = async (req, res) => {
  try {
    const schemeCode = parseInt(req.params.schemeCode, 10);

    // check cache
    const cached = await FundLatestNav.findOne({ schemeCode }).lean();
    if (cached) {
      return res.json({
        success: true,
        data: {
          schemeCode,
          currentNav: cached.nav,
          asOn: cached.date
        }
      });
    }

    // fallback: external API
    const latestNavObj = await fetchLatestNav(schemeCode);
    const nav = parseFloat(
      latestNavObj.nav ||
      latestNavObj.lastPrice ||
      latestNavObj.nav_value ||
      latestNavObj
    );

    res.json({
      success: true,
      data: {
        schemeCode,
        currentNav: nav,
        asOn: latestNavObj.date || null
      }
    });
  } catch (err) {
    console.error('getFundNav error', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
