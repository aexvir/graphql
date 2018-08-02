// @flow

import {
  GraphQLInterfaceType,
  GraphQLInt,
  GraphQLString,
  GraphQLEnumType,
  GraphQLList,
  GraphQLBoolean,
} from 'graphql';
import { GraphQLDate } from 'graphql-iso-date';
import { DateTime } from 'luxon';

import { globalIdField } from '../../../common/services/OpaqueIdentifier';
import type { GraphqlContextType } from '../../../common/services/GraphqlContext';
import type { BookingAssets, BookingsItem } from '../../Booking';
import type { AllowedBaggage } from '../../Baggage';
import GraphQLAllowedBaggage from './AllowedBaggage';
import GraphQLInsurancePrice from './InsurancePrice';
import GraphQLBookingAssets from './BookingAssets';
import GraphQLBookingStatus from '../enums/BookingStatus';
import Price from '../../../common/types/outputs/Price';
import BookingDestinationImageURL from '../../resolvers/BookingDestinationImageURL';
import GraphQLBookedServices from './BookedService';

import Carrier, { getUniqueCarriers, type CarrierData } from './Carrier';
import BookingType from '../enums/BookingType';
import Passenger from './Passenger';
import GraphQLContactDetails from './BookingContactDetails';
import { isPastBooking } from '../../queries/AllBookingsFilters';
import Services from './services/Services';
import WhitelabeledServices from './services/WhitelabeledServices';
import BookingBaggage, { type BookingBaggageData } from './BookingBaggage';

export type BookingInterfaceData = BookingsItem;

export const commonFields = {
  id: globalIdField(),

  databaseId: {
    type: GraphQLInt,
    description:
      'Unique number identifying the booking in communication with support.',
    resolve: ({ id }: BookingInterfaceData): number => id,
  },

  type: {
    type: BookingType,
    deprecationReason:
      'Manual type is not necessary. Use "__typename" instead.',
    resolve: ({ type }: BookingInterfaceData) => type,
  },

  status: {
    type: GraphQLBookingStatus,
    resolve: ({ status }: BookingInterfaceData): string => status,
  },

  price: {
    type: Price,
    description: 'Total price of the whole booking.',
    resolve: ({ price }: BookingInterfaceData) => price,
  },

  bookingDate: {
    type: GraphQLDate,
    description: 'Date of the booking creation',
    resolve: ({ created }: BookingInterfaceData): Date =>
      DateTime.fromJSDate(created, { zone: 'UTC' }).toISODate(),
  },

  allowedBaggage: {
    type: GraphQLAllowedBaggage,
    deprecationReason: 'Use "baggage" field instead.',
    resolve: async (
      { id, authToken }: BookingInterfaceData,
      params: Object,
      { dataLoader }: GraphqlContextType,
    ): Promise<AllowedBaggage> => {
      const { allowedBaggage } = await dataLoader.singleBooking.load({
        id,
        authToken,
      });
      return allowedBaggage;
    },
  },

  baggage: {
    type: new GraphQLList(BookingBaggage),
    resolve: async (
      { id }: BookingInterfaceData,
      params: Object,
      { dataLoader }: GraphqlContextType,
    ): Promise<$ReadOnlyArray<BookingBaggageData>> => {
      return dataLoader.bags.load(id);
    },
  },

  assets: {
    type: GraphQLBookingAssets,
    description: 'Static assets related to this booking.',
    resolve: async (
      { id, authToken }: BookingInterfaceData,
      params: Object,
      { dataLoader }: GraphqlContextType,
    ): Promise<BookingAssets> => {
      const { assets } = await dataLoader.singleBooking.load({
        id,
        authToken,
      });
      return assets;
    },
  },

  passengers: {
    type: new GraphQLList(Passenger),
    resolve: async (
      { id, authToken }: BookingInterfaceData,
      args: Object,
      { dataLoader }: GraphqlContextType,
    ) => {
      const { passengers } = await dataLoader.singleBooking.load({
        id,
        authToken,
      });
      return passengers;
    },
  },

  passengerCount: {
    type: GraphQLInt,
    resolve: (booking: BookingInterfaceData): number => booking.passengerCount,
  },

  destinationImageUrl: {
    type: GraphQLString,
    args: {
      dimensions: {
        type: new GraphQLEnumType({
          name: 'BookingDestinationImageDimensions',
          values: {
            _1200x628: { value: '1200x628' },
            _1280x720: { value: '1280x720' },
            _220x165: { value: '220x165' },
            _275x250: { value: '275x250' },
            _300x165: { value: '300x165' },
            _375x165: { value: '375x165' },
            _600x330: { value: '600x330' },
            _600x600: { value: '600x600' },
            _610x251: { value: '610x251' },
          },
        }),
        defaultValue: '600x600',
      },
    },
    resolve: BookingDestinationImageURL,
  },

  carriers: {
    type: new GraphQLList(Carrier),
    description: 'List of carriers involved in the booking.',
    resolve: async (
      { legs }: BookingInterfaceData,
      args: Object,
      { dataLoader }: GraphqlContextType,
    ): Promise<Iterator<CarrierData>> => {
      const carriers = await Promise.all(
        legs.map(({ airlineCode }) => dataLoader.airline.load(airlineCode)),
      );

      return getUniqueCarriers(carriers);
    },
  },

  directAccessURL: {
    type: GraphQLString,
    description:
      'You can use this link to access one particular booking directly WITHOUT PASSWORD. Use it carefully.',
    args: {
      deeplinkTo: {
        type: new GraphQLEnumType({
          name: 'DirectAccessURLValues',
          values: {
            CHANGE_TRIP: { value: 'change-trip' },
            INSURANCE: { value: 'insurance' },
            SEATING: { value: 'seating' },
            // MEALS are deprecated (?)
            PETS: { value: 'travelling-with-pets' },
            ASSISTANCE: { value: 'special-assistance' },
            SPORT_EQUIPMENT: { value: 'sports-equipment' },
            MUSICAL_EQUIPMENT: { value: 'musical-equipment' },
            HOTELS: { value: 'hotels' },
            CAR_RENTS: { value: 'car-rental' },
            REFUND: { value: 'refund-application' },
            BAGS: { value: 'bags' },
            EDIT_PASSENGERS: { value: 'passengers' },
            CANCEL: { value: 'cancel-booking' },
            PENDING_SERVICES: { value: 'pending-services' },
            VALIDATE_PAYMENT: { value: 'validate-payment' },
            TRAVEL_DOCUMENTS: { value: 'completion' },
            PAYMENT: { value: 'payment' },
          },
        }),
      },
    },
    resolve: (
      { id, authToken }: BookingInterfaceData,
      args: { deeplinkTo?: string },
    ): string => {
      const baseURL = `https://kiwi.com/content/manage/${id}/${authToken}`;
      if (args.deeplinkTo !== undefined) {
        return baseURL + '?deeplink=' + args.deeplinkTo;
      }
      return baseURL;
    },
  },

  bookedServices: {
    type: new GraphQLList(GraphQLBookedServices),
    resolve: async (
      { id, authToken }: BookingInterfaceData,
      args: Object,
      { dataLoader }: GraphqlContextType,
    ) => {
      const { bookedServices } = await dataLoader.singleBooking.load({
        id,
        authToken,
      });
      return bookedServices;
    },
  },

  contactDetails: {
    type: GraphQLContactDetails,
    resolve: async (
      { id, authToken }: BookingInterfaceData,
      args: Object,
      { dataLoader }: GraphqlContextType,
    ) => {
      const { contactDetails } = await dataLoader.singleBooking.load({
        id,
        authToken,
      });
      return contactDetails;
    },
  },

  isPastBooking: {
    type: GraphQLBoolean,
    resolve: (data: BookingInterfaceData) => isPastBooking(data),
  },

  availableServices: {
    type: Services,
    description: 'All services provided directly by Kiwi.com.',
    resolve: (booking: BookingInterfaceData) => ({
      booking,
    }),
  },

  availableWhitelabeledServices: {
    type: WhitelabeledServices,
    description: 'All services provided via whitelabels.',
    resolve: (booking: BookingInterfaceData) => ({
      booking,
    }),
  },

  onlineCheckinIsAvailable: {
    type: GraphQLBoolean,
    resolve: async (
      { id, authToken }: BookingInterfaceData,
      args: Object,
      { dataLoader }: GraphqlContextType,
    ) => {
      const { onlineCheckinIsAvailable } = await dataLoader.singleBooking.load({
        id,
        authToken,
      });
      return onlineCheckinIsAvailable;
    },
  },

  insurancePrices: {
    type: new GraphQLList(GraphQLInsurancePrice),
    resolve: async (
      { id, authToken }: BookingInterfaceData,
      args: Object,
      { dataLoader }: GraphqlContextType,
    ) => {
      const { insurancePrices } = await dataLoader.singleBooking.load({
        id,
        authToken,
      });
      return insurancePrices;
    },
  },
  authToken: {
    type: GraphQLString,
    resolve: ({ authToken }: BookingInterfaceData): string => authToken,
  },
};

export default new GraphQLInterfaceType({
  name: 'BookingInterface',
  resolveType: ({ type }) => type,
  fields: commonFields,
});
