// @flow

import { DateTime } from 'luxon';
import DataLoader from 'dataloader';
import stringify from 'json-stable-stringify';

import LoungesDataloader from './Lounges';

/**
 * This data-loader applies additional criteria in order to filter out
 * irrelevant lounges (because it's too late for example). It also returns
 * only one lounge per IATA
 */
export default new DataLoader(
  async (
    keys: $ReadOnlyArray<{|
      iataCode: string,
      departureDate: Date,
    |}>,
  ) => {
    const iataCodes = keys.map(key => key.iataCode);
    const loungesByIata = await LoungesDataloader.loadMany(iataCodes);

    return loungesByIata.map((lounges, index) => {
      const { departureDate } = keys[index];

      const relevantLounges = lounges.filter(lounge => {
        const diff = DateTime.fromJSDate(departureDate)
          .diff(DateTime.fromJSDate(new Date()), 'hours')
          .toObject().hours;

        // more than 24 hours to the departure? use 'collinsons' otherwise 'loungebuddy'
        if (diff > 24 && lounge.provider === 'collinsons') {
          return true;
        } else if (lounge.provider === 'loungebuddy') {
          return true;
        }

        return false;
      });

      return relevantLounges[0] || null; // we are interested only in the first one at this moment
    });
  },
  {
    cacheKeyFn: stringify,
  },
);
