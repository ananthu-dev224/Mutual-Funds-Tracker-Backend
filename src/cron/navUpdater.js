// cron/navUpdater.js
import cron from 'node-cron';
import Portfolio from '../models/Portfolio.js';
import FundLatestNav from '../models/FundLatestNav.js';
import FundNavHistory from '../models/FundNavHistory.js';
import { fetchLatestNav } from '../utils/mfApi.js';

export function startNavUpdater() {
  // run every day at midnight IST
  cron.schedule('0 0 * * *', async () => {
    console.log('⏳ Starting daily NAV update...');

    try {
      // get all unique schemeCodes in user portfolios
      const schemeCodes = await Portfolio.distinct('schemeCode');

      for (const sc of schemeCodes) {
        try {
          const latest = await fetchLatestNav(sc);

          const nav = parseFloat(
            latest.nav ||
            latest.lastPrice ||
            latest.nav_value ||
            latest
          );
          const date = latest.date || latest.asOn || null;

          if (!nav || isNaN(nav)) {
            console.warn(`⚠️ NAV missing/invalid for scheme ${sc}`);
            continue;
          }

          // update latest NAV
          await FundLatestNav.findOneAndUpdate(
            { schemeCode: sc },
            { schemeCode: sc, nav, date, updatedAt: new Date() },
            { upsert: true }
          );

          // insert into history
          await FundNavHistory.updateOne(
            { schemeCode: sc, date },
            { schemeCode: sc, nav, date },
            { upsert: true }
          );

          console.log(`✅ Updated NAV for ${sc} → ${nav} (${date})`);
          await new Promise(r => setTimeout(r, 300)); // small delay between API calls
        } catch (err) {
          console.error(`❌ Failed NAV update for ${sc}:`, err.message);
        }
      }

      console.log('🎉 Daily NAV update completed');
    } catch (err) {
      console.error('❌ NAV update job failed:', err.message);
    }
  }, {
    timezone: 'Asia/Kolkata'
  });
}
