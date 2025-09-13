// utils/mfApi.js
import axios from 'axios';
import { retryWithBackoff } from './backoff.js';

const BASE = 'https://api.mfapi.in';

// Fetch all funds
export async function fetchFundList() {
  return retryWithBackoff(async () => {
    const res = await axios.get(`${BASE}/mf`);
    return res.data; // usually an array of funds
  });
}

// Fetch NAV history for a fund
export async function fetchNavHistory(schemeCode) {
  return retryWithBackoff(async () => {
    const res = await axios.get(`${BASE}/mf/${schemeCode}`);
    return res.data; // object with "data" array of {date, nav}
  });
}

// Fetch latest NAV for a fund
export async function fetchLatestNav(schemeCode) {
  return retryWithBackoff(async () => {
    const res = await axios.get(`${BASE}/mf/${schemeCode}/latest`);
    if (res.data && res.data.data) {
      if (Array.isArray(res.data.data)) {
        return res.data.data[0]; // first item
      } else {
        return res.data.data;
      }
    }
    return res.data; // fallback
  });
}

// Find NAV for a specific date (DD-MM-YYYY) inside history data
export function findNavByDate(historyData, dateStr) {
  if (!historyData || !historyData.data) return null;
  const entry = historyData.data.find(e => e.date === dateStr);
  if (!entry) return null;
  return parseFloat(entry.nav.replace(/,/g, ''));
}
