import express from 'express';
import { listFunds, getFundByCode } from '../controllers/fundsController.js';

const router = express.Router();

// GET /api/funds?search=icici&page=1&limit=20
router.get('/', listFunds);

// GET /api/funds/:schemeCode
router.get('/:schemeCode', getFundByCode);

export default router;
