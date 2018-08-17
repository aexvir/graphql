// @flow

import WhitelabeledServices from '../WhitelabeledServices';
import { evaluateResolver } from '../../../../../common/services/TestingTools';

const fields = WhitelabeledServices.getFields();

it('returns only the relevant cities for multicity', () => {
  expect(
    evaluateResolver(
      fields.hotel,
      {
        booking: {
          trips: [
            {
              departure: { where: { code: 'PRG' } },
              arrival: { where: { code: 'LHR' } },
            },
            {
              departure: { where: { code: 'LHR' } },
              arrival: { where: { code: 'OSL' } },
            },
          ],
        },
      },
      { departureTime: new Date(1) },
    ),
  ).toEqual({ relevantLocationCodes: ['LHR', 'OSL'] });
});

it('returns only the relevant cities for return', () => {
  expect(
    evaluateResolver(
      fields.hotel,
      {
        booking: {
          inbound: {
            departure: { where: { code: 'PRG' } },
            arrival: { where: { code: 'LHR' } },
          },
          outbound: {
            departure: { where: { code: 'LHR' } },
            arrival: { where: { code: 'PRG' } },
          },
        },
      },
      { departureTime: new Date(1) },
    ),
  ).toEqual({ relevantLocationCodes: ['PRG', 'LHR'] });
});

it('returns only the relevant cities for one way', () => {
  expect(
    evaluateResolver(
      fields.hotel,
      {
        booking: {
          departure: { where: { code: 'PRG' } },
          arrival: { where: { code: 'LHR' } },
        },
      },
      { departureTime: new Date(1) },
    ),
  ).toEqual({ relevantLocationCodes: ['LHR'] });
});
