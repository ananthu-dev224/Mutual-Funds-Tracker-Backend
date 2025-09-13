import Fund from '../models/Fund.js';

// List/Search funds
export const listFunds = async (req, res) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (search) {
      query.schemeName = { $regex: search, $options: 'i' }; // case-insensitive
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

// Get fund by schemeCode
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
