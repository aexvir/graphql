// @flow

import idx from 'idx';
import { DateTime, Interval } from 'luxon';

import type { BookingsItem } from '../Booking';

type AncestorType = {|
  +booking: BookingsItem,
|};

type RoomsConfiguration = {|
  +adultsCount: number,
  +children: $ReadOnlyArray<{|
    +age: number,
  |}>,
|};

export type RelevantLocationType = {|
  +code: string,
  +checkin: ?Date | null,
  +checkout: ?Date | null,
|};

export type RelevantLocationData = {|
  +roomsConfiguration: RoomsConfiguration,
  +relevantLocationData: $ReadOnlyArray<RelevantLocationType>,
|};

const getMulticityData = trips => {
  return trips.map((trip, index) => {
    const nextTrip = trips[index + 1];
    return {
      code: trip.arrival.where.code,
      checkin: idx(trip, _ => _.arrival.when.utc),
      checkout: idx(nextTrip, _ => _.departure.when.utc) || null,
    };
  });
};

const getReturnData = (inbound, outbound) => {
  return [
    {
      code: outbound.arrival.where.code,
      checkin: idx(outbound, _ => _.arrival.when.utc),
      checkout: idx(inbound, _ => _.departure.when.utc),
    },
    {
      code: inbound.arrival.where.code,
      checkin: idx(inbound, _ => _.arrival.when.utc),
      checkout: null,
    },
  ];
};

const getRoomsConfiguration = passengers => {
  return passengers.reduce(
    (acc, passenger) => {
      const birthday = DateTime.fromString(
        passenger.birthday,
        'yyyy-LL-dd',
      ).toJSDate();
      const age = Interval.fromDateTimes(
        birthday,
        DateTime.utc().toJSDate(),
      ).count('years');

      if (age >= 18) {
        return {
          ...acc,
          adultsCount: acc.adultsCount + 1,
        };
      }
      return {
        ...acc,
        children: [...acc.children, { age }],
      };
    },
    { adultsCount: 0, children: [] },
  );
};

export default ({ booking }: AncestorType): RelevantLocationData | null => {
  let relevantLocationData = [];
  const roomsConfiguration = getRoomsConfiguration(booking.passengers);

  if (booking.trips) {
    relevantLocationData = getMulticityData(booking.trips);
  } else if (booking.outbound && booking.inbound) {
    relevantLocationData = getReturnData(booking.inbound, booking.outbound);
  } else if (booking.arrival) {
    relevantLocationData = [
      {
        code: booking.arrival.where.code,
        checkin: idx(booking, _ => _.arrival.when.utc),
        checkout: null,
      },
    ];
  }
  return {
    roomsConfiguration,
    relevantLocationData,
  };
};
