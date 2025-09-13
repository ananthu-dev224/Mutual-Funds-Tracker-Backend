import express from 'express';
import auth from '../middlewares/auth.js';
import {
  addFund,
  listPortfolio,
  portfolioValue,
  portfolioHistory,
  removeFund,
} from '../controllers/portfolioController.js';

const router = express.Router();

router.post('/add', auth, addFund);
router.get('/list', auth, listPortfolio);
router.get('/value', auth, portfolioValue);
router.get('/history', auth, portfolioHistory);
router.delete('/remove/:schemeCode', auth, removeFund);

export default router;
