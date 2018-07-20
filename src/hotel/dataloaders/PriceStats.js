// @flow

import DataLoader from 'dataloader';
import { DateTime, Interval } from 'luxon';

import type { SearchParameters } from './flow/SearchParameters';
import {
  prepareRequestParameters,
  prepareRoomsRequestParameters,
} from '../services/ParametersFormatter';
import { queryWithParameters } from '../../../config/application';
import { get } from '../services/BookingComRequest';

function getNightsFromCheckinToCheckout(checkinDate: Date, checkoutDate: Date) {
  const checkin = DateTime.fromJSDate(checkinDate);
  const checkout = DateTime.fromJSDate(checkoutDate);
  const interval = Interval.fromDateTimes(checkin, checkout);
  return interval.length('days');
}

const PriceStats = async (
  searchParams: SearchParameters,
  boundary: 'MAX' | 'MIN',
) => {
  // Price filter should not affect search stats max and min price
  const parameters = {
    ...prepareRequestParameters(searchParams),
    min_price: undefined,
    max_price: undefined,
  };

  const absoluteUrl = queryWithParameters(
    'https://distribution-xml.booking.com/2.0/json/hotelAvailability',
    {
      ...parameters,
      ...prepareRoomsRequestParameters(searchParams.roomsConfiguration),
      order_dir: boundary === 'MAX' ? 'desc' : 'asc',
      order_by: 'price',
      currency: 'EUR', // current limitation, price filter range works only with EUR
      rows: 1,
      offset: 0,
    },
  );
  const response = await get(absoluteUrl);
  const nights = getNightsFromCheckinToCheckout(
    searchParams.checkin,
    searchParams.checkout,
  );

  return response.result.map(hotel => Math.round(hotel.price / nights));
};

export default new DataLoader(
  async (keys): Promise<Array<number>> => {
    return Promise.all(
      keys.map(({ searchParams, boundary }) =>
        PriceStats(searchParams, boundary),
      ),
    );
  },
);
