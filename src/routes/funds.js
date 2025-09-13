import express from 'express';
import { listFunds, getFundByCode, getFundNav } from '../controllers/fundsController.js';

const router = express.Router();

router.get('/', listFunds);                // /api/funds?search=icici
router.get('/:schemeCode', getFundByCode); // /api/funds/152075
router.get('/:schemeCode/nav', getFundNav); // /api/funds/152075/nav

export default router;
