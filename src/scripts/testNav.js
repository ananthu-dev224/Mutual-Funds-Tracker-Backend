import 'dotenv/config';
import { fetchNavHistory, fetchLatestNav, findNavByDate } from '../utils/mfApi.js';

// For Testing

async function run() {
  const schemeCode = 152075; 
  console.log(`Fetching NAV history for scheme ${schemeCode}...`);
  const history = await fetchNavHistory(schemeCode);
  console.log('First 3 history entries:', history.data.slice(0, 3));

  console.log('Fetching latest NAV...');
  const latest = await fetchLatestNav(schemeCode);
  console.log('Latest NAV:', latest);

  const dateStr = '12-09-2025';
  const navOnDate = findNavByDate(history, dateStr);
  console.log(`NAV on ${dateStr}:`, navOnDate);
}

run().catch(err => console.error(err));
