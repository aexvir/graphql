// @flow

import resolver, {
  generateBookedFlightEvent,
  generateBookingConfirmedEvent,
  generatePaymentConfirmedEvent,
  generateDownloadInvoiceEvent,
  generateDownloadETicketEvent,
  generateLeaveForAirportEvent,
  generateAirportArrivalEvent,
  generateBoardingEvent,
  generateDepartureEvent,
  generateArrivalEvent,
  generateTransportFromAirportEvent,
} from '../BookingTimeline';

describe('resolver', () => {
  const date = new Date('2018-05-03T14:10:57.000Z');
  it('generates BookedFlight event', () => {
    expect(
      resolver(
        // $FlowExpectedError: full Booking object is not needed for this test
        {
          created: date,
          arrival: {
            when: {
              local: new Date('2018-05-18T14:10:57.000Z'),
            },
            where: {
              cityName: 'Prague',
            },
          },
        },
      ),
    ).toContainEqual({
      timestamp: date,
      type: 'BookedFlightTimelineEvent',
      arrival: {
        when: {
          local: new Date('2018-05-18T14:10:57.000Z'),
        },
        where: {
          cityName: 'Prague',
        },
      },
    });
  });
  it('generates only BookedFlight and PaymentConfirmed event if status is not confirmed', () => {
    const res = resolver(
      // $FlowExpectedError: full Booking object is not needed for this test
      {
        created: date,
        status: 'cancelled',
        arrival: {
          when: {
            local: new Date('2018-05-18T14:10:57.000Z'),
          },
          where: {
            cityName: 'Prague',
          },
        },
      },
    );
    expect(res).toContainEqual({
      timestamp: date,
      type: 'BookedFlightTimelineEvent',
      arrival: {
        when: {
          local: new Date('2018-05-18T14:10:57.000Z'),
        },
        where: {
          cityName: 'Prague',
        },
      },
    });
    expect(res).toContainEqual({
      timestamp: date,
      type: 'PaymentConfirmedTimelineEvent',
    });
    expect(res).not.toContainEqual({
      timestamp: date,
      type: 'BookingConfirmedTimelineEvent',
    });
  });

  it('generates BookedFlight event and BookingConfirmed event if status confirmed', () => {
    const res = resolver(
      // $FlowExpectedError: full Booking object is not needed for this test
      {
        created: date,
        status: 'confirmed',
        arrival: {
          when: {
            local: new Date('2018-05-18T14:10:57.000Z'),
          },
          where: {
            cityName: 'Prague',
          },
        },
      },
    );
    expect(res).toContainEqual({
      timestamp: date,
      type: 'BookedFlightTimelineEvent',
      arrival: {
        when: {
          local: new Date('2018-05-18T14:10:57.000Z'),
        },
        where: {
          cityName: 'Prague',
        },
      },
    });
    expect(res).toContainEqual({
      timestamp: date,
      type: 'BookingConfirmedTimelineEvent',
    });
  });
});

describe('generateBookedFlightEvent', () => {
  const date = new Date('2018-05-03T14:10:57.000Z');
  it('returns BookedFlightEvent', () => {
    expect(
      // $FlowExpectedError: full Booking object is not needed for this test
      generateBookedFlightEvent({
        created: date,
        arrival: {
          when: {
            local: new Date('2018-05-18T14:10:57.000Z'),
          },
          where: {
            cityName: 'Prague',
          },
        },
      }),
    ).toEqual({
      timestamp: date,
      type: 'BookedFlightTimelineEvent',
      arrival: {
        when: {
          local: new Date('2018-05-18T14:10:57.000Z'),
        },
        where: {
          cityName: 'Prague',
        },
      },
    });
  });
});

describe('generateBookingConfirmedEvent', () => {
  const date = new Date('2018-05-03T14:10:57.000Z');
  it('returns BookingConfirmed event only when booking status is confirmed', () => {
    expect(
      // $FlowExpectedError: full Booking object is not needed for this test
      generateBookingConfirmedEvent({
        created: date,
        status: 'confirmed',
      }),
    ).toEqual({
      timestamp: date,
      type: 'BookingConfirmedTimelineEvent',
    });
    expect(
      // $FlowExpectedError: full Booking object is not needed for this test
      generateBookingConfirmedEvent({
        created: date,
        status: 'cancelled',
      }),
    ).toBe(null);
  });
});

describe('generatePaymentConfirmedEvent', () => {
  const date = new Date('2018-05-03T14:10:57.000Z');
  it('returns PaymentConfirmed event only when booking status is defined and not null', () => {
    expect(
      // $FlowExpectedError: full Booking object is not needed for this test
      generatePaymentConfirmedEvent({
        created: date,
        status: 'confirmed',
      }),
    ).toEqual({
      timestamp: date,
      type: 'PaymentConfirmedTimelineEvent',
    });
    expect(
      // $FlowExpectedError: full Booking object is not needed for this test
      generatePaymentConfirmedEvent({
        created: date,
        status: 'cancelled',
      }),
    ).toEqual({
      timestamp: date,
      type: 'PaymentConfirmedTimelineEvent',
    });
    expect(
      // $FlowExpectedError: full Booking object is not needed for this test
      generatePaymentConfirmedEvent({
        created: date,
      }),
    ).toBe(null);
    expect(
      // $FlowExpectedError: full Booking object is not needed for this test
      generatePaymentConfirmedEvent({
        created: date,
        status: null,
      }),
    ).toBe(null);
    expect(
      // $FlowExpectedError: full Booking object is not needed for this test
      generatePaymentConfirmedEvent({
        created: date,
        status: '',
      }),
    ).toBe(null);
  });
});

describe('generateDownloadInvoiceEvent', () => {
  const date = new Date('2018-05-03T14:10:57.000Z');
  it('returns DownloadInvoice event', () => {
    expect(
      // $FlowExpectedError: full Booking object is not needed for this test
      generateDownloadInvoiceEvent({
        created: date,
        passengers: [1],
        legs: [
          {
            departure: {
              where: {
                cityName: 'Prague',
              },
            },
            arrival: {
              where: { cityName: 'Brno' },
            },
          },
        ],
      }),
    ).toEqual({
      timestamp: date,
      type: 'DownloadInvoiceTimelineEvent',
      invoiceUrl: null,
      numberPassengers: 1,
      legs: [
        {
          departure: {
            where: {
              cityName: 'Prague',
            },
          },
          arrival: {
            where: { cityName: 'Brno' },
          },
        },
      ],
    });
    expect(
      // $FlowExpectedError: full Booking object is not needed for this test
      generateDownloadInvoiceEvent({
        created: date,
        assets: {
          invoiceUrl: 'http://somecoolurl',
        },
        passengers: [1],
        legs: [
          {
            departure: {
              where: {
                cityName: 'Prague',
              },
            },
            arrival: {
              where: { cityName: 'Brno' },
            },
          },
        ],
      }),
    ).toEqual({
      timestamp: date,
      type: 'DownloadInvoiceTimelineEvent',
      invoiceUrl: 'http://somecoolurl',
      numberPassengers: 1,
      legs: [
        {
          departure: {
            where: {
              cityName: 'Prague',
            },
          },
          arrival: {
            where: { cityName: 'Brno' },
          },
        },
      ],
    });
  });
});

describe('generateDownloadETicketEvent', () => {
  const date = new Date('2018-05-03T14:10:57.000Z');
  it('returns DownloadETicket event', () => {
    expect(
      // $FlowExpectedError: full Booking object is not needed for this test
      generateDownloadETicketEvent({
        created: date,
      }),
    ).toEqual({
      timestamp: date,
      type: 'DownloadETicketTimelineEvent',
      ticketUrl: null,
    });
    expect(
      // $FlowExpectedError: full Booking object is not needed for this test
      generateDownloadETicketEvent({
        created: date,
        assets: {
          ticketUrl: 'http://somecoolurl',
        },
      }),
    ).toEqual({
      timestamp: new Date('2018-05-03T14:10:57.000Z'),
      type: 'DownloadETicketTimelineEvent',
      ticketUrl: 'http://somecoolurl',
    });
  });
});

describe('generateLeaveForAirportEvent', () => {
  const date = new Date('2018-05-03T14:10:57.000Z');
  it('returns LeaveForAirport event if departure.when.local is set', () => {
    const leaveForAirportDate = new Date('2018-05-03T10:10:57.000Z'); // date - 4 hours
    expect(
      // $FlowExpectedError: full Booking object is not needed for this test
      generateLeaveForAirportEvent({
        departure: {
          when: {
            local: date,
          },
        },
      }),
    ).toEqual({
      timestamp: leaveForAirportDate,
      type: 'LeaveForAirportTimelineEvent',
    });
  });
  it('returns null if departure.when.local is not set', () => {
    expect(
      // $FlowExpectedError: full Booking object is not needed for this test
      generateLeaveForAirportEvent({}),
    ).toBe(null);
  });
});

describe('generateAirportArrivalEvent', () => {
  const date = new Date('2018-05-03T14:10:57.000Z');
  it('returns AirportArrival event if departure.when.local is set', () => {
    const airportArrivalDate = new Date('2018-05-03T12:10:57.000Z'); // date - 2 hours
    expect(
      // $FlowExpectedError: full Booking object is not needed for this test
      generateAirportArrivalEvent({
        departure: {
          when: {
            local: date,
          },
        },
      }),
    ).toEqual({
      timestamp: airportArrivalDate,
      type: 'AirportArrivalTimelineEvent',
      departure: {
        when: {
          local: date,
        },
      },
    });
  });
  it('returns null if departure.when.local is not set', () => {
    expect(
      // $FlowExpectedError: full Booking object is not needed for this test
      generateAirportArrivalEvent({}),
    ).toBe(null);
  });
  it('returns AirportArrival event if departure.when.local is set with city name if departure.where.cityName is set', () => {
    const airportArrivalDate = new Date('2018-05-03T12:10:57.000Z'); // date - 2 hours
    expect(
      // $FlowExpectedError: full Booking object is not needed for this test
      generateAirportArrivalEvent({
        departure: {
          when: {
            local: date,
          },
          where: {
            cityName: 'Prague',
          },
        },
      }),
    ).toEqual({
      timestamp: airportArrivalDate,
      type: 'AirportArrivalTimelineEvent',
      departure: {
        when: {
          local: date,
        },
        where: {
          cityName: 'Prague',
        },
      },
    });
  });
});

describe('generateBoardingEvent', () => {
  const date = new Date('2018-05-03T14:10:57.000Z');
  it('returns Boarding event if departure.when.local is set', () => {
    const boardingDate = new Date('2018-05-03T13:40:57.000Z'); // date - 30 minutes
    expect(
      // $FlowExpectedError: full Booking object is not needed for this test
      generateBoardingEvent({
        departure: {
          when: {
            local: date,
          },
        },
      }),
    ).toEqual({
      timestamp: boardingDate,
      type: 'BoardingTimelineEvent',
      gate: 'gate number',
    });
  });
  it('returns null if departure.when.local is not set', () => {
    expect(
      // $FlowExpectedError: full Booking object is not needed for this test
      generateBoardingEvent({}),
    ).toBe(null);
  });
});

describe('generateDepartureEvent', () => {
  const date = new Date('2018-06-22T05:00:00.000Z');
  it('returns Departure event if departure.when.local is set', () => {
    const departureDate = date;
    expect(
      // $FlowExpectedError: full Booking object is not needed for this test
      generateDepartureEvent({
        departure: {
          when: {
            local: departureDate,
            utc: departureDate,
          },
        },
        arrival: {
          when: {
            local: new Date('2018-06-22T08:00:00.000Z'),
            utc: new Date('2018-06-22T08:00:00.000Z'),
          },
        },
        airlineCode: 'FR',
        flightNo: 1111,
      }),
    ).toEqual({
      timestamp: departureDate,
      type: 'DepartureTimelineEvent',
      arrival: {
        when: {
          local: new Date('2018-06-22T08:00:00.000Z'),
          utc: new Date('2018-06-22T08:00:00.000Z'),
        },
      },
      duration: 180,
      airlineCode: 'FR',
      flightNumber: 1111,
    });
  });
  it('returns null if departure.when.local is not set', () => {
    expect(
      // $FlowExpectedError: full Booking object is not needed for this test
      generateDepartureEvent({}),
    ).toBe(null);
  });
  it('returns Departure event if departure.when.local is set with city name if departure.where.cityName is set', () => {
    const departureDate = date;
    expect(
      // $FlowExpectedError: full Booking object is not needed for this test
      generateDepartureEvent({
        departure: {
          when: {
            local: departureDate,
            utc: departureDate,
          },
        },
        arrival: {
          when: {
            local: new Date('2018-06-22T08:00:00.000Z'),
            utc: new Date('2018-06-22T08:00:00.000Z'),
          },
          where: {
            cityName: 'Prague',
          },
        },
      }),
    ).toEqual({
      timestamp: departureDate,
      type: 'DepartureTimelineEvent',
      arrival: {
        when: {
          local: new Date('2018-06-22T08:00:00.000Z'),
          utc: new Date('2018-06-22T08:00:00.000Z'),
        },
        where: {
          cityName: 'Prague',
        },
      },
      duration: 180,
    });
  });
});

describe('generateArrivalEvent', () => {
  const date = new Date('2018-05-03T14:10:57.000Z');
  it('returns Arrival event if arrival.when.local is set', () => {
    const arrivalDate = date;
    expect(
      // $FlowExpectedError: full Booking object is not needed for this test
      generateArrivalEvent({
        arrival: {
          when: {
            local: date,
          },
        },
      }),
    ).toEqual({
      timestamp: arrivalDate,
      type: 'ArrivalTimelineEvent',
      arrival: {
        when: {
          local: date,
        },
      },
    });
  });
  it('returns null if arrival.when.local is not set', () => {
    expect(
      // $FlowExpectedError: full Booking object is not needed for this test
      generateArrivalEvent({}),
    ).toBe(null);
  });
  it('returns Arrival event if arrival.when.local is set with city name if arrival.where.cityName is set', () => {
    const arrivalDate = date;
    expect(
      // $FlowExpectedError: full Booking object is not needed for this test
      generateArrivalEvent({
        arrival: {
          when: {
            local: date,
          },
          where: {
            cityName: 'Prague',
          },
        },
      }),
    ).toEqual({
      timestamp: arrivalDate,
      type: 'ArrivalTimelineEvent',
      arrival: {
        when: {
          local: date,
        },
        where: {
          cityName: 'Prague',
        },
      },
    });
  });
});

describe('generateTransportFromAirportEvent', () => {
  const date = new Date('2018-05-03T14:10:57.000Z');
  it('returns TransportFromAirport event if arrival.when.local is set', () => {
    const arrivalDate = new Date('2018-05-03T14:25:57.000Z'); // date + 15 minutes
    expect(
      // $FlowExpectedError: full Booking object is not needed for this test
      generateTransportFromAirportEvent({
        arrival: {
          when: {
            local: date,
          },
        },
      }),
    ).toEqual({
      timestamp: arrivalDate,
      type: 'TransportFromAirportTimelineEvent',
    });
  });
  it('returns null if arrival.when.local is not set', () => {
    expect(
      // $FlowExpectedError: full Booking object is not needed for this test
      generateTransportFromAirportEvent({}),
    ).toBe(null);
  });
});
