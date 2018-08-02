// @flow

import resolver from '../BookingTimeline';

import type { Booking } from '../../Booking';
import type { Leg } from '../../../flight/Flight';

describe('resolver', () => {
  it('matches the snapshot', () => {
    expect(resolver(booking)).toEqual([
      {
        timestamp: new Date('2017-03-30T07:28:55.000Z'),
        type: 'BookedFlightTimelineEvent',
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
          authToken: 'token-lol',
        },
      },
      {
        timestamp: new Date('2017-03-30T07:28:55.000Z'),
        type: 'BookingConfirmedTimelineEvent',
      },
      {
        timestamp: new Date('2017-03-30T07:28:55.000Z'),
        type: 'PaymentConfirmedTimelineEvent',
      },
      {
        timestamp: new Date('2017-03-30T07:28:55.000Z'),
        type: 'DownloadInvoiceTimelineEvent',
        invoiceUrl: null,
        numberPassengers: 2,
        legs: [
          {
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
              authToken: 'token-lol',
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
              authToken: 'token-lol',
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
        ],
      },
      {
        timestamp: new Date('2017-03-30T07:28:55.000Z'),
        type: 'DownloadETicketTimelineEvent',
        ticketUrl:
          'https://skypicker-mailing.s3.amazonaws.com/2707/1490859068_E-ticket_passenger_and_1_more_e826fc3275a65a5db8808279d8fc7f8f.pdf?v=1490859069',
      },
      {
        timestamp: new Date('2017-09-06T20:10:00.000Z'),
        type: 'TimeToCheckinTimelineEvent',
      },
      {
        timestamp: new Date('2017-09-06T21:10:00.000Z'),
        type: 'CheckinClosingTimelineEvent',
      },
      {
        timestamp: new Date('2017-09-07T21:10:00.000Z'),
        type: 'NoMoreEditsTimelineEvent',
      },
      {
        timestamp: new Date('2017-09-09T17:10:00.000Z'),
        type: 'LeaveForAirportTimelineEvent',
      },
      {
        timestamp: new Date('2017-09-09T19:10:00.000Z'),
        type: 'AirportArrivalTimelineEvent',
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
          authToken: 'token-lol',
        },
      },
      {
        timestamp: new Date('2017-09-09T20:35:00.000Z'),
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
            authToken: 'token-lol',
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
            authToken: 'token-lol',
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
      },
      {
        timestamp: new Date('2017-09-09T20:40:00.000Z'),
        type: 'BoardingTimelineEvent',
        terminal: 'E',
      },
      {
        timestamp: new Date('2017-09-09T21:10:00.000Z'),
        type: 'DepartureTimelineEvent',
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
          authToken: 'token-lol',
        },
        duration: 80,
        airlineCode: 'VY',
        flightNumber: 8773,
      },
      {
        timestamp: new Date('2017-09-09T23:30:00.000Z'),
        type: 'ArrivalTimelineEvent',
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
          authToken: 'token-lol',
        },
      },
      {
        timestamp: new Date('2017-09-09T23:45:00.000Z'),
        type: 'TransportFromAirportTimelineEvent',
      },
    ]);
  });

  test("DownloadBoardingPassEvent should have timestamp 5 minutes earlier than BoardingEvent's", () => {
    const result = resolver(booking);

    const boardingEvent = result.find(
      event => event.type === 'BoardingTimelineEvent',
    );
    const downloadBPEvent = result.find(
      event => event.type === 'DownloadBoardingPassTimelineEvent',
    );

    if (boardingEvent && downloadBPEvent) {
      expect(boardingEvent.timestamp - downloadBPEvent.timestamp).toBe(
        5 * 60 * 1000,
      );
    }
  });
});

const booking: Booking = {
  id: 2707251,
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
    authToken: 'token-lol',
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
    authToken: 'token-lol',
  },
  legs: [
    {
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
        authToken: 'token-lol',
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
        authToken: 'token-lol',
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
  ],
  price: {
    amount: 74.61,
    currency: 'USD',
  },
  created: new Date('2017-03-30T07:28:55.000Z'),
  authToken: 'b206db64-718f-4608-babb-0b8abe6e1b9d',
  status: 'confirmed',
  type: 'BookingOneWay',
  passengerCount: 2,
  passengers: [
    {
      id: 4095455,
      firstname: 'chatbot',
      lastname: 'test',
      insuranceType: 'none',
      title: 'mr',
      birthday: '1985-01-01',
      nationality: 'us',
      travelDocument: {
        idNumber: '1234578098',
        expiration: new Date('2019-02-14'),
      },
      pkpasses: null,
      travelInfo: [
        {
          visa: [
            {
              status: 'critical',
              timestamp: 1447710495,
              info:
                '<div class="content"><p>\n</p><p>Visa required.</p>\n\n<h3>Additional information:</h3>\n<p>\n</p><p>\n</p><p>Schengen visa is also valid for French Guiana, French West Indies and Reunion, provided endorsed "Also valid for French territories being in observation ofthe respective French territories".</p>\n\n<p>\nVisitors are required to hold proof of sufficient funds to cover their stay and documents required for their next destination. \n</p>\n\n</div>',
              country: 'FR',
            },
          ],
        },
      ],
    },
    {
      id: 4095456,
      firstname: 'TEST',
      lastname: 'TEST',
      insuranceType: 'none',
      title: 'mr',
      birthday: '1985-01-01',
      nationality: 'us',
      pkpasses: null,
      travelDocument: {
        idNumber: '12345',
        expiration: new Date('2019-02-13'),
      },
      travelInfo: [
        {
          visa: [
            {
              status: 'critical',
              timestamp: 1447710495,
              info:
                '<div class="content"><p>\n</p><p>Visa required.</p>\n\n<h3>Additional information:</h3>\n<p>\n</p><p>\n</p><p>Schengen visa is also valid for French Guiana, French West Indies and Reunion, provided endorsed "Also valid for French territories being in observation ofthe respective French territories".</p>\n\n<p>\nVisitors are required to hold proof of sufficient funds to cover their stay and documents required for their next destination. \n</p>\n\n</div>',
              country: 'FR',
            },
          ],
        },
      ],
    },
  ],
  allowedBaggage: {
    additionalBaggage: [
      {
        price: {
          amount: 23.65,
          currency: 'EUR',
        },
        quantity: 1,
      },
      {
        price: {
          amount: 47.3,
          currency: 'EUR',
        },
        quantity: 2,
      },
    ],
    cabin: [
      {
        height: 20,
        length: 55,
        width: 40,
        weight: 10,
        note: null,
      },
      {
        height: null,
        length: null,
        width: null,
        weight: null,
        note: null,
      },
    ],
    checked: [
      {
        height: 79,
        length: 250,
        width: 112,
        weight: 23,
        note: 'max 180cm (length + width + height)',
      },
    ],
  },
  assets: {
    ticketUrl:
      'https://skypicker-mailing.s3.amazonaws.com/2707/1490859068_E-ticket_passenger_and_1_more_e826fc3275a65a5db8808279d8fc7f8f.pdf?v=1490859069',
    invoiceUrl: null,
    boardingPasses: [
      {
        boardingPassUrl: 'https://very.real/pass.pdf',
        flightNumber: '315289498',
        availableAt: '2017-09-02',
        pkpasses: [],
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
            authToken: 'token-lol',
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
            authToken: 'token-lol',
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
      },
      {
        boardingPassUrl: 'https://very.real/all.pdf',
        flightNumber: 'all',
        availableAt: '2017-09-02',
        pkpasses: [],
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
            authToken: 'token-lol',
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
            authToken: 'token-lol',
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
      },
    ],
    legs: [
      {
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
          authToken: 'token-lol',
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
          authToken: 'token-lol',
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
    ],
  },
  bookedServices: [
    {
      category: 'bags',
      status: 'expired',
    },
    {
      category: 'bags',
      status: 'expired',
    },
    {
      category: 'bags',
      status: 'expired',
    },
  ],
  contactDetails: {
    phone: '+1 000',
    email: 'kiwicomtester@gmail.com',
  },
  allowedToChangeFlights: 48,
  onlineCheckinIsAvailable: true,
  insurancePrices: [
    {
      type: 'travel_basic',
      price: {
        amount: 49.2,
        currency: 'EUR',
      },
    },
    {
      type: 'travel_plus',
      price: {
        amount: 120.95,
        currency: 'EUR',
      },
    },
  ],
};

const leg: Leg = {
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
    authToken: 'token-lol',
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
    authToken: 'token-lol',
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
};

export { booking, leg };
