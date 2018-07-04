// @flow

import type { Price } from '../common/types/Price';

export type DepartureArrival = {|
  when: ?{|
    // null if doesn't exist
    utc: Date, // UTC +0
    local: Date, // UTC != 0
  |},
  where: {|
    code: string,
    cityName: string,
    cityId: string,
  |},
|};

export type Flight = {|
  id: string,
  airlines: Array<string>,
  arrival: DepartureArrival,
  departure: DepartureArrival,
  legs: Array<Leg>,
  price: Price,
  bookingToken: string,
  passengers: number,
|};

export type VehicleType = 'BUS' | 'TRAIN' | 'AIRCRAFT';

export type BoardingPass = {|
  flightNumber: string,
  boardingPassUrl: ?string,
|};

export type Leg = {|
  id: string,
  recheckRequired: boolean,
  isReturn: boolean,
  flightNo: number,
  departure: DepartureArrival,
  arrival: DepartureArrival,
  airlineCode: string,
  vehicleType: ?VehicleType,
  bookingId?: number,
  guarantee: boolean,
  boardingPass?: BoardingPass,
  boardingPassAvailableAt?: ?string,
|};

export type Airline = {|
  name: string,
  logoUrl: string,
  code: string,
  isLowCost: boolean,
|};
