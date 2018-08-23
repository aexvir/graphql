// @flow

import MockDate from 'mockdate';

import WhitelabeledServices from '../WhitelabeledServices';
import { evaluateResolver } from '../../../../../common/services/TestingTools';

const fields = WhitelabeledServices.getFields();

MockDate.set('2018-01-01');

jest.mock('luxon', () => ({
  DateTime: {
    fromString: input => ({
      toJSDate: () => new Date(input),
    }),
    utc: () => ({
      toJSDate: () => new Date(),
    }),
  },
  Interval: {
    fromDateTimes: birthday => {
      const birthdayYear = birthday.getFullYear();
      const todayYear = 2018;
      return {
        count: () => todayYear - birthdayYear,
      };
    },
  },
}));

it('returns only the relevant cities for multicity', () => {
  expect(
    evaluateResolver(
      fields.hotel,
      {
        booking: {
          passengers: [{ birthday: '1984-01-01' }],
          trips: [
            {
              departure: { where: { code: 'PRG' }, when: { utc: new Date() } },
              arrival: { where: { code: 'LHR' }, when: { utc: new Date() } },
            },
            {
              departure: { where: { code: 'LHR' }, when: { utc: new Date() } },
              arrival: { where: { code: 'OSL' }, when: { utc: new Date() } },
            },
          ],
        },
      },
      { departureTime: new Date(1) },
    ),
  ).toEqual({
    relevantLocationData: [
      {
        checkin: new Date(),
        checkout: new Date(),
        code: 'LHR',
      },
      {
        checkin: new Date(),
        checkout: null,
        code: 'OSL',
      },
    ],
    roomsConfiguration: {
      adultsCount: 1,
      children: [],
    },
  });
});

it('returns only the relevant cities for return', () => {
  expect(
    evaluateResolver(
      fields.hotel,
      {
        booking: {
          passengers: [{ birthday: '1984-01-01' }],
          inbound: {
            departure: { where: { code: 'PRG' }, when: { utc: new Date() } },
            arrival: { where: { code: 'LHR' }, when: { utc: new Date() } },
          },
          outbound: {
            departure: { where: { code: 'LHR' }, when: { utc: new Date() } },
            arrival: { where: { code: 'PRG' }, when: { utc: new Date() } },
          },
        },
      },
      { departureTime: new Date(1) },
    ),
  ).toEqual({
    relevantLocationData: [
      {
        checkin: new Date(),
        checkout: new Date(),
        code: 'PRG',
      },
      {
        checkin: new Date(),
        checkout: null,
        code: 'LHR',
      },
    ],
    roomsConfiguration: {
      adultsCount: 1,
      children: [],
    },
  });
});

it('returns only the relevant cities for one way', () => {
  expect(
    evaluateResolver(
      fields.hotel,
      {
        booking: {
          passengers: [{ birthday: '1984-01-01' }],
          departure: { where: { code: 'PRG' }, when: { utc: new Date() } },
          arrival: { where: { code: 'LHR' }, when: { utc: new Date() } },
        },
      },
      { departureTime: new Date(1) },
    ),
  ).toEqual({
    relevantLocationData: [
      {
        checkin: new Date(),
        checkout: null,
        code: 'LHR',
      },
    ],
    roomsConfiguration: {
      adultsCount: 1,
      children: [],
    },
  });
});

it('set roomsConfiguration correctly', () => {
  expect(
    evaluateResolver(
      fields.hotel,
      {
        booking: {
          passengers: [
            { birthday: '1984-01-01' },
            { birthday: '2015-01-01' },
            { birthday: '1982-01-01' },
            { birthday: '2001-01-01' },
          ],
          departure: { where: { code: 'PRG' }, when: { utc: new Date() } },
          arrival: { where: { code: 'LHR' }, when: { utc: new Date() } },
        },
      },
      { departureTime: new Date(1) },
    ),
  ).toEqual({
    relevantLocationData: [
      {
        checkin: new Date(),
        checkout: null,
        code: 'LHR',
      },
    ],
    roomsConfiguration: {
      adultsCount: 2,
      children: [{ age: 3 }, { age: 17 }],
    },
  });
});
