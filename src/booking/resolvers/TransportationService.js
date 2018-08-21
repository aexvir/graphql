// @flow

import idx from 'idx';
import { flatten } from 'ramda';

import type { BookingsItem } from '../Booking';
import type { GraphqlContextType } from '../../common/services/GraphqlContext';

type AncestorType = {|
  +booking: BookingsItem,
|};

const getLocationsFromLegs = async (legs, dataLoader) => {
  const legCodes = legs.map(leg => leg.arrival.where.code);
  const locations = await dataLoader.location.loadMany(legCodes);

  return locations.map(location => {
    const leg = legs.find(
      leg => leg.arrival.where.code === location.locationId,
    );
    return {
      location,
      date: idx(leg, _ => _.arrival.when.local),
    };
  });
};

const resolveMulticityTrips = async (booking: BookingsItem, dataLoader) => {
  const trips = idx(booking, _ => _.trips) || [];
  const promises = trips.map(trip =>
    getLocationsFromLegs(trip.legs, dataLoader),
  );

  const locations = await Promise.all(promises);

  return flatten(locations);
};

const resolveReturnTrip = async (booking: BookingsItem, dataLoader) => {
  const outbound = idx(booking.outbound, _ => _.legs) || [];
  const inbound = idx(booking.inbound, _ => _.legs) || [];

  const locations = await Promise.all([
    getLocationsFromLegs(outbound, dataLoader),
    getLocationsFromLegs(inbound, dataLoader),
  ]);

  return flatten(locations);
};

export default async function TransportationService(
  { booking }: AncestorType,
  _: mixed,
  { dataLoader }: GraphqlContextType,
) {
  const departureLocation = await dataLoader.location.loadById(
    booking.departure.where.code,
  );
  const departureDate = idx(booking.departure, _ => _.when.local);
  const departure = { location: departureLocation, date: departureDate };

  let locations = [];

  if (booking.trips) {
    locations = await resolveMulticityTrips(booking, dataLoader);
  } else if (booking.outbound && booking.inbound) {
    locations = await resolveReturnTrip(booking, dataLoader);
  } else if (booking.legs) {
    locations = await getLocationsFromLegs(booking.legs, dataLoader);
  }
  return [departure, ...locations];
}
