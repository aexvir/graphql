// @flow

import generateDownloadBoardingPassEvent from '../../bookingTimeline/downloadBoardingPass';
import { leg } from '../BookingTimeline.test';

describe('generateDownloadBoardingPassEvent', () => {
  it('returns DownloadBoardingPass event', () => {
    expect(generateDownloadBoardingPassEvent(leg)).toEqual({
      timestamp: new Date('2017-09-09T21:10:00.000Z'),
      type: 'DownloadBoardingPassTimelineEvent',
      leg: {
        id: '315289498',
        bookingId: 2707251,
        recheckRequired: false,
        isReturn: false,
        flightNo: 8773,
        boardingPassAvailableAt: '2017-09-02',
        departure: {
          when: {
            utc: new Date('2017-09-09T20:10:00.000Z'),
            local: new Date('2017-09-09T21:10:00.000Z'),
          },
          where: {
            code: 'LGW',
            cityName: 'London',
            cityId: 'london_gb',
            terminal: 'E',
          },
          bid: 2707251,
        },
        arrival: {
          when: {
            utc: new Date('2017-09-09T21:30:00.000Z'),
            local: new Date('2017-09-09T23:30:00.000Z'),
          },
          where: {
            code: 'CDG',
            cityName: 'Paris',
            cityId: 'paris_fr',
            terminal: '2',
          },
          bid: 2707251,
        },
        airlineCode: 'VY',
        guarantee: false,
        operatingAirline: {
          iata: 'VY',
          name: 'Vueling',
        },
        pnr: 'chat',
        vehicle: {
          manufacturer: 'Airbus',
          model: 'A320',
        },
        vehicleType: 'AIRCRAFT',
      },
    });
  });
});
