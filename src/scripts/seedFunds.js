import 'dotenv/config';
import mongoose from 'mongoose';
import axios from 'axios';
import Fund from '../models/Fund.js';

const MONGO_URI = process.env.MONGO_URI;

async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('MongoDB connected for seeding');
  } catch (err) {
    console.error('Mongo connection error', err);
    process.exit(1);
  }
}

async function seedFunds() {
  try {
    await connectDB();

    console.log('Fetching fund list from api.mfapi.in...');
    const res = await axios.get('https://api.mfapi.in/mf');
    const fundList = res.data; // array of {schemeCode, schemeName}

    console.log(`Fetched ${fundList.length} funds. Seeding into DB...`);

    for (const fund of fundList) {
      if (!fund.schemeCode) continue;

      await Fund.updateOne(
        { schemeCode: fund.schemeCode },
        {
          schemeCode: fund.schemeCode,
          schemeName: fund.schemeName,
          fundHouse: fund.fundHouse || fund.amc || null,
        },
        { upsert: true }
      );
    }

    console.log('Seeding completed ✅');
    process.exit(0);
  } catch (err) {
    console.error('Seed error', err);
    process.exit(1);
  }
}

seedFunds();
