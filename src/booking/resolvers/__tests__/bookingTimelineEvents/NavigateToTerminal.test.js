// @flow

import generateNavigateToTerminalEvent from '../../bookingTimeline/navigateToTerminal';
import type { Leg } from '../../../../flight/Flight';

const leg: Leg = {
  id: 'some-id',
  recheckRequired: false,
  isReturn: false,
  flightNo: 123345,
  departure: {
    when: {
      utc: new Date('2018-05-18T14:10:57.000Z'),
      local: new Date('2018-05-18T16:10:57.000+02:00'),
    },
    where: {
      code: 'CODE',
      cityName: 'My city',
      cityId: '1234',
      terminal: null,
    },
  },
  arrival: {
    when: {
      utc: new Date('2018-05-18T18:10:57.000Z'),
      local: new Date('2018-05-18T20:10:57.000+02:00'),
    },
    where: {
      code: 'CODE2',
      cityName: 'My city 2',
      cityId: '12345',
      terminal: null,
    },
  },
  airlineCode: 'airlineCode',
  vehicleType: 'AIRCRAFT',
  guarantee: false,
  boardingPass: {
    flightNumber: '1234562231',
    boardingPassUrl: null,
  },
  boardingPassAvailableAt: null,
  vehicle: { manufacturer: 'manufacturer', model: 'model' },
  operatingAirline: {
    iata: 'iata',
    name: 'operatingAirlineName',
  },
  pnr: '0986544',
};

describe('generateNavigateToTerminal', () => {
  it('should return null if departure.local is null', () => {
    expect(
      generateNavigateToTerminalEvent({
        ...leg,
        departure: {
          ...leg.departure,
          when: null,
        },
      }),
    ).toBe(null);
  });
  it('should return the right event if departure.local is available', () => {
    expect(generateNavigateToTerminalEvent(leg)).toEqual({
      type: 'NavigateToTerminalTimelineEvent',
      timestamp: new Date('2018-05-18T14:50:57.000+02:00'),
    });
  });
});
