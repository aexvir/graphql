// @flow

import WhitelabeledServices from '../WhitelabeledServices';
import { evaluateResolver } from '../../../../../common/services/TestingTools';

const fields = WhitelabeledServices.getFields();

const booking = {
  departure: {
    when: {
      local: new Date(1),
    },
    where: {
      code: 'OSL',
    },
  },
};

const context = {
  dataLoader: {
    location: {
      loadMany: async codes => {
        return codes.map(code => ({ locationId: code }));
      },
      loadById: async code => {
        return code;
      },
    },
  },
};

it('returns only the relevant locations for multicity', async () => {
  const res = await evaluateResolver(
    fields.transportation,
    {
      booking: {
        ...booking,
        trips: [
          {
            departure: { where: { code: 'PRG' } },
            arrival: { where: { code: 'LHR' } },
            legs: [
              {
                arrival: {
                  where: {
                    code: 'BCN',
                  },
                  when: {
                    local: new Date(2),
                  },
                },
              },
            ],
          },
          {
            departure: { where: { code: 'LHR' } },
            arrival: { where: { code: 'OSL' } },
            legs: [
              {
                arrival: {
                  where: { code: 'OSL' },
                  when: { local: new Date(2) },
                },
              },
            ],
          },
        ],
      },
    },
    { departureTime: new Date(1) },
    context,
  );
  expect(res).toMatchInlineSnapshot(`
Array [
  Object {
    "date": 1970-01-01T00:00:00.001Z,
    "location": "OSL",
  },
  Object {
    "date": 1970-01-01T00:00:00.002Z,
    "location": Object {
      "locationId": "BCN",
    },
  },
  Object {
    "date": 1970-01-01T00:00:00.002Z,
    "location": Object {
      "locationId": "OSL",
    },
  },
]
`);
});

it('returns only the relevant locations for return', async () => {
  const res = await evaluateResolver(
    fields.transportation,
    {
      booking: {
        ...booking,
        outbound: {
          departure: { where: { code: 'PRG' } },
          arrival: { where: { code: 'LHR' } },
          legs: [
            {
              arrival: {
                where: {
                  code: 'BCN',
                },
                when: {
                  local: new Date(2),
                },
              },
            },
          ],
        },
        inbound: {
          departure: { where: { code: 'LHR' } },
          arrival: { where: { code: 'OSL' } },
          legs: [
            {
              arrival: { where: { code: 'OSL' }, when: { local: new Date(2) } },
            },
          ],
        },
      },
    },
    { departureTime: new Date(1) },
    context,
  );
  expect(res).toMatchInlineSnapshot(`
Array [
  Object {
    "date": 1970-01-01T00:00:00.001Z,
    "location": "OSL",
  },
  Object {
    "date": 1970-01-01T00:00:00.002Z,
    "location": Object {
      "locationId": "BCN",
    },
  },
  Object {
    "date": 1970-01-01T00:00:00.002Z,
    "location": Object {
      "locationId": "OSL",
    },
  },
]
`);
});

it('returns only the relevant locations for one way', async () => {
  const res = await evaluateResolver(
    fields.transportation,
    {
      booking: {
        ...booking,
        legs: [
          {
            arrival: {
              where: {
                code: 'BCN',
              },
              when: {
                local: new Date(2),
              },
            },
          },
        ],
      },
    },
    { departureTime: new Date(1) },
    context,
  );
  expect(res).toMatchInlineSnapshot(`
Array [
  Object {
    "date": 1970-01-01T00:00:00.001Z,
    "location": "OSL",
  },
  Object {
    "date": 1970-01-01T00:00:00.002Z,
    "location": Object {
      "locationId": "BCN",
    },
  },
]
`);
});
