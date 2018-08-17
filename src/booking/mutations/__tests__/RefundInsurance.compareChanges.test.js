// @flow

import { compareChanges } from '../RefundInsurance';

const currentPassengers = [
  {
    id: 123,
    firstname: 'chatbot',
    lastname: 'test',
    insuranceType: 'travel_basic',
    title: 'mr',
    birthday: '1985-01-01',
    nationality: 'us',
    travelDocument: { idNumber: '1', expiration: new Date() },
    travelInfo: [],
    pkpasses: null,
  },
  {
    id: 1234,
    firstname: 'chatbot',
    lastname: 'test',
    insuranceType: 'travel_plus',
    title: 'mr',
    birthday: '1985-01-01',
    nationality: 'us',
    travelDocument: { idNumber: '2', expiration: new Date() },
    travelInfo: [],
    pkpasses: null,
  },
];

describe('compareChanges', () => {
  it('should return the changes', () => {
    const newPassengers = [
      {
        passengerId: 123,
        insuranceType: 'TRAVEL_PLUS',
      },
    ];

    expect(compareChanges(currentPassengers, newPassengers)).toEqual([
      {
        passengerId: 123,
        from: 'travel_basic',
        to: 'travel_plus',
      },
    ]);
  });
  it('should throw error if passengerId cannot be found', () => {
    const newPassengers = [
      {
        passengerId: 123689,
        insuranceType: 'TRAVEL_PLUS',
      },
    ];

    expect(() => compareChanges(currentPassengers, newPassengers)).toThrow(
      new Error('Passenger could not be found'),
    );
  });
  it('should throw error if insuranceType is not TRAVEL_PLUS, TRAVEL_BASIC or NONE', () => {
    const newPassengers = [
      {
        passengerId: 123,
        insuranceType: 'something',
      },
    ];

    expect(() => {
      // $FlowAllowNextLineInThisTest (intentionally incompatible parameter)
      compareChanges(currentPassengers, newPassengers);
    }).toThrow(new Error("Passenger's insurance could not be found"));
  });
});
