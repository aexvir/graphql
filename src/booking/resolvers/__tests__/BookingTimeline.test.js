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
  generateNoMoreEditsEvent,
  generateBagDropEvent,
  generateBagPickupEvent,
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

  it('does not generate BagDrop and BagPickup events if numberCheckedBaggage is 0', () => {
    const res = resolver(
      // $FlowExpectedError: full Booking object is not needed for this test
      {
        departure: {
          when: {
            local: new Date('2018-05-18T14:10:57.000Z'),
          },
        },
        arrival: {
          when: {
            local: new Date('2018-05-18T18:10:57.000Z'),
          },
        },
        numberCheckedBaggage: 0,
      },
    );
    expect(res).not.toContainEqual({
      timestamp: new Date('2018-05-18T13:35:57.000Z'),
      type: 'BagDropTimelineEvent',
    });
    expect(res).not.toContainEqual({
      timestamp: new Date('2018-05-18T18:00:57.000Z'),
      type: 'BagPickupTimelineEvent',
    });
  });

  it('generates BagDrop and BagPickup events if numberCheckedBaggage is greater than 0', () => {
    const bookingOneWay = resolver(
      // $FlowExpectedError: full Booking object is not needed for this test
      {
        type: 'BookingOneWay',
        departure: {
          when: {
            local: new Date('2018-05-18T14:10:57.000Z'),
          },
        },
        arrival: {
          when: {
            local: new Date('2018-05-18T18:10:57.000Z'),
          },
        },
        legs: [
          {
            departure: {
              when: {
                local: new Date('2018-05-18T14:10:57.000Z'),
              },
            },
            arrival: {
              when: {
                local: new Date('2018-05-18T18:10:57.000Z'),
              },
            },
          },
        ],
        numberCheckedBaggage: 1,
      },
    );
    expect(bookingOneWay).toContainEqual({
      timestamp: new Date('2018-05-18T13:35:57.000Z'),
      type: 'BagDropTimelineEvent',
    });
    expect(bookingOneWay).toContainEqual({
      timestamp: new Date('2018-05-18T18:20:57.000Z'),
      type: 'BagPickupTimelineEvent',
    });

    const bookingReturn = resolver(
      // $FlowExpectedError: full Booking object is not needed for this test
      {
        type: 'BookingReturn',
        outbound: {
          departure: {
            when: {
              local: new Date('2018-05-18T14:10:57.000Z'),
            },
          },
          arrival: {
            when: {
              local: new Date('2018-05-18T18:10:57.000Z'),
            },
          },
          legs: [
            {
              departure: {
                when: {
                  local: new Date('2018-05-18T14:10:57.000Z'),
                },
              },
              arrival: {
                when: {
                  local: new Date('2018-05-18T18:10:57.000Z'),
                },
              },
            },
          ],
        },
        inbound: {
          departure: {
            when: {
              local: new Date('2018-05-20T14:10:57.000Z'),
            },
          },
          arrival: {
            when: {
              local: new Date('2018-05-20T18:10:57.000Z'),
            },
          },
          legs: [
            {
              departure: {
                when: {
                  local: new Date('2018-05-20T14:10:57.000Z'),
                },
              },
              arrival: {
                when: {
                  local: new Date('2018-05-20T18:10:57.000Z'),
                },
              },
            },
          ],
        },
        numberCheckedBaggage: 1,
      },
    );
    expect(bookingReturn).toContainEqual({
      timestamp: new Date('2018-05-18T13:35:57.000Z'),
      type: 'BagDropTimelineEvent',
    });
    expect(bookingReturn).toContainEqual({
      timestamp: new Date('2018-05-18T18:20:57.000Z'),
      type: 'BagPickupTimelineEvent',
    });
    expect(bookingReturn).toContainEqual({
      timestamp: new Date('2018-05-20T13:35:57.000Z'),
      type: 'BagDropTimelineEvent',
    });
    expect(bookingReturn).toContainEqual({
      timestamp: new Date('2018-05-20T18:20:57.000Z'),
      type: 'BagPickupTimelineEvent',
    });

    const bookingMulticity = resolver(
      // $FlowExpectedError: full Booking object is not needed for this test
      {
        type: 'BookingMulticity',
        trips: [
          {
            departure: {
              when: {
                local: new Date('2018-05-18T14:10:57.000Z'),
              },
            },
            arrival: {
              when: {
                local: new Date('2018-05-18T18:10:57.000Z'),
              },
            },
            legs: [
              {
                departure: {
                  when: {
                    local: new Date('2018-05-18T14:10:57.000Z'),
                  },
                },
                arrival: {
                  when: {
                    local: new Date('2018-05-18T18:10:57.000Z'),
                  },
                },
              },
            ],
          },
          {
            departure: {
              when: {
                local: new Date('2018-05-20T14:10:57.000Z'),
              },
            },
            arrival: {
              when: {
                local: new Date('2018-05-20T18:10:57.000Z'),
              },
            },
            legs: [
              {
                departure: {
                  when: {
                    local: new Date('2018-05-20T14:10:57.000Z'),
                  },
                },
                arrival: {
                  when: {
                    local: new Date('2018-05-20T18:10:57.000Z'),
                  },
                },
              },
            ],
          },
        ],
        numberCheckedBaggage: 1,
      },
    );
    expect(bookingMulticity).toContainEqual({
      timestamp: new Date('2018-05-18T13:35:57.000Z'),
      type: 'BagDropTimelineEvent',
    });
    expect(bookingMulticity).toContainEqual({
      timestamp: new Date('2018-05-18T18:20:57.000Z'),
      type: 'BagPickupTimelineEvent',
    });
    expect(bookingMulticity).toContainEqual({
      timestamp: new Date('2018-05-20T13:35:57.000Z'),
      type: 'BagDropTimelineEvent',
    });
    expect(bookingMulticity).toContainEqual({
      timestamp: new Date('2018-05-20T18:20:57.000Z'),
      type: 'BagPickupTimelineEvent',
    });
  });

  it('generates the right 2 BagDrop and 2 BagPickup events in case there is a recheckRequired between two legs', () => {
    const bookingOneWay = resolver(
      // $FlowExpectedError: full Booking object is not needed for this test
      {
        type: 'BookingOneWay',
        departure: {
          when: {
            local: new Date('2018-05-18T14:10:57.000Z'),
          },
        },
        arrival: {
          when: {
            local: new Date('2018-05-18T18:10:57.000Z'),
          },
        },
        legs: [
          {
            departure: {
              when: {
                local: new Date('2018-05-18T14:10:57.000Z'),
              },
            },
            arrival: {
              when: {
                local: new Date('2018-05-18T16:10:57.000Z'),
              },
            },
          },
          {
            departure: {
              when: {
                local: new Date('2018-05-18T17:10:57.000Z'),
              },
            },
            arrival: {
              when: {
                local: new Date('2018-05-18T18:10:57.000Z'),
              },
            },
            recheckRequired: true,
          },
        ],
        numberCheckedBaggage: 1,
      },
    );
    expect(bookingOneWay).toContainEqual({
      timestamp: new Date('2018-05-18T13:35:57.000Z'),
      type: 'BagDropTimelineEvent',
    });
    expect(bookingOneWay).toContainEqual({
      timestamp: new Date('2018-05-18T16:20:57.000Z'),
      type: 'BagPickupTimelineEvent',
    });
    expect(bookingOneWay).toContainEqual({
      timestamp: new Date('2018-05-18T16:35:57.000Z'),
      type: 'BagDropTimelineEvent',
    });
    expect(bookingOneWay).toContainEqual({
      timestamp: new Date('2018-05-18T18:20:57.000Z'),
      type: 'BagPickupTimelineEvent',
    });
  });

  it('generates only 1 BagDrop and 1 BagPickup events in case there is not recheckRequired between two legs', () => {
    const bookingOneWay = resolver(
      // $FlowExpectedError: full Booking object is not needed for this test
      {
        type: 'BookingOneWay',
        departure: {
          when: {
            local: new Date('2018-05-18T14:10:57.000Z'),
          },
        },
        arrival: {
          when: {
            local: new Date('2018-05-18T18:10:57.000Z'),
          },
        },
        legs: [
          {
            departure: {
              when: {
                local: new Date('2018-05-18T14:10:57.000Z'),
              },
            },
            arrival: {
              when: {
                local: new Date('2018-05-18T16:10:57.000Z'),
              },
            },
          },
          {
            departure: {
              when: {
                local: new Date('2018-05-18T17:10:57.000Z'),
              },
            },
            arrival: {
              when: {
                local: new Date('2018-05-18T18:10:57.000Z'),
              },
            },
            recheckRequired: false,
          },
        ],
        numberCheckedBaggage: 1,
      },
    );
    expect(bookingOneWay).toContainEqual({
      timestamp: new Date('2018-05-18T13:35:57.000Z'),
      type: 'BagDropTimelineEvent',
    });
    expect(bookingOneWay).not.toContainEqual({
      timestamp: new Date('2018-05-18T16:20:57.000Z'),
      type: 'BagPickupTimelineEvent',
    });
    expect(bookingOneWay).not.toContainEqual({
      timestamp: new Date('2018-05-18T16:35:57.000Z'),
      type: 'BagDropTimelineEvent',
    });
    expect(bookingOneWay).toContainEqual({
      timestamp: new Date('2018-05-18T18:20:57.000Z'),
      type: 'BagPickupTimelineEvent',
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

describe('generateNoMoreEditsEvent', () => {
  const date = new Date('2018-05-03T14:10:57.000Z');
  it('should return NoMoreEditsEvent if apiData.config.allowedToChange.flights is a number', () => {
    expect(
      // $FlowExpectedError: full Booking object is not needed for this test
      generateNoMoreEditsEvent({
        departure: {
          when: {
            local: date,
          },
        },
        allowedToChangeFlights: 48,
      }),
    ).toEqual({
      timestamp: new Date('2018-05-01T14:10:57.000Z'),
      type: 'NoMoreEditsTimelineEvent',
    });
  });
  it('should return NoMoreEditsEvent if apiData.config.allowedToChange.flights is null', () => {
    expect(
      // $FlowExpectedError: full Booking object is not needed for this test
      generateNoMoreEditsEvent({
        departure: {
          when: {
            local: date,
          },
        },
        allowedToChangeFlights: null,
      }),
    ).toBe(null);
  });
  it('should return NoMoreEditsEvent if apiData.config.allowedToChange.flights is not given', () => {
    expect(
      // $FlowExpectedError: full Booking object is not needed for this test
      generateNoMoreEditsEvent({
        departure: {
          when: {
            local: date,
          },
        },
      }),
    ).toBe(null);
  });
});

describe('generateBagDropEvent', () => {
  const date = new Date('2018-05-03T14:10:57.000Z');
  it('should return BagDropEvent with timestamp 35 minutes before departure time', () => {
    expect(
      // $FlowExpectedError: full Booking object is not needed for this test
      generateBagDropEvent({
        departure: {
          when: {
            local: date,
          },
        },
      }),
    ).toEqual({
      timestamp: new Date('2018-05-03T13:35:57.000Z'),
      type: 'BagDropTimelineEvent',
    });
  });
});

describe('generateBagPickupEvent', () => {
  const date = new Date('2018-05-03T14:10:57.000Z');
  it('should return BagPickupEvent with timestamp 10 minutes after arrival time', () => {
    expect(
      // $FlowExpectedError: full Booking object is not needed for this test
      generateBagPickupEvent({
        arrival: {
          when: {
            local: date,
          },
        },
      }),
    ).toEqual({
      timestamp: new Date('2018-05-03T14:20:57.000Z'),
      type: 'BagPickupTimelineEvent',
    });
  });
});
