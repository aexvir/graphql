// @flow

import { GraphQLObjectType } from 'graphql';
import idx from 'idx';

import TransportationService from './TransportationService';
import CarRentalService from './CarRentalService';
import LoungeService from './LoungeService';
import ParkingService from './ParkingService';
import HotelService from './HotelService';
import ParkingServiceAvailability from './ParkingServiceAvailability';
import AvailableLoungesDataloader from '../../../dataloaders/AvailableLounges';
import WhitelabelCarRentalResolver from '../../../resolvers/WhitelabelCarRental';
import TransportationServiceResolver from '../../../resolvers/TransportationService';
import { ProxiedError } from '../../../../common/services/errors/ProxiedError';
import type { BookingsItem } from '../../../Booking';

type AncestorType = {|
  +booking: BookingsItem,
|};

type RelevantLocationCodes = {|
  +relevantLocationCodes: $ReadOnlyArray<string>,
|};

export default new GraphQLObjectType({
  name: 'WhitelabeledServices',
  fields: {
    lounge: {
      type: LoungeService,
      resolve: async ({ booking }: AncestorType) => {
        // we are interested in every unique IATA of the airport
        const iataMap = new Map();

        booking.legs.map(({ departure, arrival }) => {
          const departureDate = idx(departure, _ => _.when.utc) || new Date();
          iataMap.set(departure.where.code, departureDate);
          iataMap.set(arrival.where.code, departureDate);
        });

        // let's try to load all lounges by IATA codes to see where is the
        // lounge actually available
        let loungesByIata;

        try {
          loungesByIata = await AvailableLoungesDataloader.loadMany(
            Array.from(iataMap).map(([iataCode, departureDate]) => ({
              iataCode,
              departureDate,
            })),
          );
        } catch (error) {
          if (error instanceof ProxiedError) {
            const { statusCode } = error.getProxyInfo();
            // lounges API returns 404 (and therefore exception is thrown)
            // when there are no lounges available (should be 200)
            // see: https://lounges-api.skypicker.com/lounges?iata=XJV,ZDN
            if (statusCode === '404') {
              return null;
            }
          }
          throw error;
        }

        const relevantLounges = loungesByIata.filter(Boolean);
        if (relevantLounges.length === 0) {
          return null;
        }
        return relevantLounges;
      },
    },

    parking: {
      type: ParkingService,
      resolve: ({ booking }: AncestorType) => {
        // we are interested only in the IATA of the departure (you are leaving your car there)
        const iataCode = booking.departure.where.code;

        if (ParkingServiceAvailability[iataCode] === true) {
          return {
            iataCode: iataCode,
            fromDate: idx(booking, _ => _.departure.when.utc) || new Date(),
            toDate: idx(booking, _ => _.arrival.when.utc) || new Date(),
          };
        }
        return null;
      },
    },

    carRental: {
      type: CarRentalService,
      resolve: WhitelabelCarRentalResolver,
    },

    hotel: {
      type: HotelService,
      resolve: ({ booking }: AncestorType): RelevantLocationCodes => {
        let relevantLocationCodes = [];

        if (booking.trips) {
          relevantLocationCodes = booking.trips.map(
            trip => trip.arrival.where.code,
          );
        } else if (booking.outbound && booking.inbound) {
          relevantLocationCodes = [
            booking.outbound.arrival.where.code,
            booking.inbound.arrival.where.code,
          ];
        } else if (booking.arrival) {
          relevantLocationCodes = [booking.arrival.where.code];
        }
        return {
          relevantLocationCodes,
        };
      },
    },
    transportation: {
      type: TransportationService,
      resolve: TransportationServiceResolver,
    },
  },
});
