// @flow

import AvailableLoungesDataloader from '../AvailableLounges';

jest.mock('../Lounges', () => ({
  loadMany: () =>
    Promise.resolve([
      [],
      [],
      [
        {
          airport: 'Katowice',
          terminal: 'Terminal B',
          iata: 'KTW',
          loungeName: ' Schengen',
          loungeCode: 'null',
          provider: 'loungebuddy',
        },
        {
          airport: 'Katowice',
          terminal: 'Terminal A',
          iata: 'KTW', // this one is going to be ignored because we already have one KTW IATA
          loungeName: ' Non-Schengen',
          loungeCode: 'null',
          provider: 'loungebuddy',
        },
      ],
      [
        {
          airport: 'Skavsta',
          terminal: 'Comfort Lounge',
          iata: 'NYO',
          loungeName: 'NYOZSKA',
          loungeCode: 'None',
          provider: 'collinsons', // this one is going to be ignored because it's too late for collinsons
        },
      ],
      [],
    ]),
}));

it('loads lounges correctly', async () => {
  // this must be first
  await expect(
    AvailableLoungesDataloader.loadMany([
      { iataCode: 'PRG', departureDate: new Date(2) },
      { iataCode: 'LHR', departureDate: new Date(3) },
      { iataCode: 'unknown1', departureDate: new Date(10) },
      { iataCode: 'unknown2', departureDate: new Date(10) },
      { iataCode: 'unknown3', departureDate: new Date(10) },
    ]),
  ).resolves.toEqual([
    // it must return the same amount values (5 inputs)
    null,
    null,
    {
      airport: 'Katowice',
      iata: 'KTW',
      loungeCode: 'null',
      loungeName: ' Schengen',
      provider: 'loungebuddy',
      terminal: 'Terminal B',
    },
    null,
    null,
  ]);
});
