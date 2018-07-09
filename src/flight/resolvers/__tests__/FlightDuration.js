// @flow

import FlightDurationInMinutes from '../FlightDuration';
import type { DepartureArrival } from '../../Flight';

let departure: DepartureArrival;
let arrival: DepartureArrival;

let nullDeparture: DepartureArrival;
let nullArrival: DepartureArrival;

beforeEach(() => {
  nullDeparture = {
    when: null,
    where: {
      code: 'string',
      cityName: 'string',
      cityId: 'string',
      terminal: 'string',
    },
  };

  nullArrival = nullDeparture;

  departure = {
    when: {
      local: new Date(), // not used
      utc: new Date('2017-12-29T13:20:00.000Z'),
    },
    where: {
      code: 'string',
      cityName: 'string',
      cityId: 'string',
      terminal: 'string',
    },
  };

  arrival = {
    when: {
      local: new Date(), // not used
      utc: new Date('2017-12-29T14:45:00.000Z'),
    },
    where: {
      code: 'string',
      cityName: 'string',
      cityId: 'string',
      terminal: 'string',
    },
  };
});

describe('Function dateDurationInMinutes', () => {
  it('should return duration in minutes', () => {
    expect(FlightDurationInMinutes(departure, arrival)).toBe(85);
  });

  it('should return null when arrival date is null', () => {
    expect(FlightDurationInMinutes(departure, nullArrival)).toBe(null);
  });

  it('should return null when departure date is null', () => {
    expect(FlightDurationInMinutes(nullDeparture, arrival)).toBe(null);
  });

  it('should return null when both dates are null', () => {
    expect(FlightDurationInMinutes(nullDeparture, nullArrival)).toBe(null);
  });

  it('should return null when departure date is after arrival date', () => {
    expect(FlightDurationInMinutes(arrival, departure)).toBe(null);
  });
});
