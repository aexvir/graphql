/* eslint-disable flowtype/require-valid-file-annotation */

import resolver from '../WhitelabelCarRental';

const testLegs = [
  {
    arrival: {
      where: { code: 'LEG_ARR_CODE_1' },
    },
  },
  {
    arrival: {
      where: { code: 'LEG_ARR_CODE_2' },
    },
  },
];

const testTrip = {
  arrival: {
    when: {
      utc: new Date('3000-12-20'),
    },
  },
  departure: {
    when: {
      utc: new Date('2000-12-20'),
    },
  },
  legs: testLegs,
};

const testBooking = {
  ...testTrip,
  outbound: {
    ...testTrip,
    legs: testLegs,
  },
  inbound: {
    ...testTrip,
    legs: [...testLegs].reverse(),
  },
  trips: [testTrip, testTrip],
};

it('returns correct response for one way booking', async () => {
  await expect(
    resolver({
      booking: {
        ...testBooking,
        type: 'BookingOneWay',
      },
    }),
  ).resolves.toMatchSnapshot();
});

it('returns correct response for return booking', async () => {
  await expect(
    resolver({
      booking: {
        ...testBooking,
        type: 'BookingReturn',
      },
    }),
  ).resolves.toMatchSnapshot();
});

it('returns correct response for multicity booking', async () => {
  await expect(
    resolver({
      booking: {
        ...testBooking,
        type: 'BookingMulticity',
      },
    }),
  ).resolves.toMatchSnapshot();
});
