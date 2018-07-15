// @flow

import fs from 'fs';
import Algolia from './Algolia';
import BookingCom from './BookingCom';
import { supportedLangs } from '../../src/hotel/services/AlgoliaHelper';

require('dotenv').config();

/* eslint no-console: "off" */

const isDryRun = process.argv.includes('--dry-run');
const {
  ALGOLIA_APP_ID,
  ALGOLIA_ADMIN_API_KEY,
  BOOKING_COM_TOKEN,
} = process.env;
if (!ALGOLIA_APP_ID || !ALGOLIA_ADMIN_API_KEY || !BOOKING_COM_TOKEN) {
  throw new Error(
    `ENV vars ALGOLIA_APP_ID, ALGOLIA_ADMIN_API_KEY and BOOKING_COM_TOKEN must be set!`,
  );
}

(async () => {
  try {
    const algolia = new Algolia(ALGOLIA_APP_ID, ALGOLIA_ADMIN_API_KEY);
    const booking = new BookingCom(BOOKING_COM_TOKEN, supportedLangs);

    console.log('Fetching cities from Booking.com (1000 per API call)');
    const allCities = await booking.fetchAllCities();
    if (isDryRun) {
      fs.writeFileSync('./allCities.json', JSON.stringify(allCities, null, 2));
    }

    const topCities = booking.sortCities(allCities).slice(0, 10000); // 10k is Algolia free plan limit
    if (isDryRun) {
      fs.writeFileSync('./topCities.json', JSON.stringify(topCities, null, 2));
      console.log('Data saved into allCities.json and topCities.json');
    }

    if (!isDryRun) {
      console.log('Setup Algolia index and upload data');
      await algolia.setupIndex('cities', supportedLangs);
      await algolia.uploadData('cities', topCities);
    }

    console.log('Fetch list of indexes from Algolia:');
    const indexes = await algolia.listIndexes();
    console.log(indexes);
  } catch (ex) {
    console.error(ex);
  }
})();
