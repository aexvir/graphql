// @flow

import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLEnumType,
  GraphQLInt,
  GraphQLList,
} from 'graphql';
import { GraphQLDateTime } from 'graphql-iso-date';
import { uniq } from 'ramda';

import type { Passenger } from '../../Booking';
import GraphQLVisa from './Visa';
import GraphQLPkpass from './Pkpass';

const InsuranceTypeEnum = new GraphQLEnumType({
  name: 'InsuranceType',
  description: 'The possible insurance type values',
  values: {
    NONE: { value: 'none' },
    TRAVEL_BASIC: { value: 'travel_basic' },
    TRAVEL_PLUS: { value: 'travel_plus' },
  },
});

const TravelDocumentType = new GraphQLObjectType({
  name: 'TravelDocument',
  description: 'Travel document info',
  fields: {
    idNumber: {
      type: GraphQLString,
    },
    expiration: {
      type: GraphQLDateTime,
      resolve: ({ expiration }): ?Date =>
        expiration ? new Date(expiration * 1000) : null,
    },
  },
});

export default new GraphQLObjectType({
  name: 'Passenger',
  description: 'The passengers associated with the booking',
  fields: () => ({
    databaseId: {
      type: GraphQLInt,
      resolve: ({ id }: Passenger) => id,
    },
    firstname: {
      type: GraphQLString,
    },
    lastname: {
      type: GraphQLString,
    },
    fullName: {
      type: GraphQLString,
      resolve: ({ firstname, lastname }: Passenger) =>
        [firstname, lastname].filter(word => word != null).join(' '),
    },
    insuranceType: {
      type: InsuranceTypeEnum,
      resolve: ({ insuranceType }: Passenger) => {
        switch (insuranceType) {
          case 'skysilver': // Skysilver is deprecated, the same as travel basic
            return 'travel_basic';
          case 'skygold': // Skygold is deprecated, the same as travel plus
            return 'travel_plus';
          default:
            return insuranceType;
        }
      },
    },
    title: {
      type: GraphQLString,
    },
    birthday: {
      type: GraphQLDateTime,
      resolve: ({ birthday }: Passenger): Date => new Date(birthday),
    },
    nationality: {
      type: GraphQLString,
    },
    travelDocument: {
      type: TravelDocumentType,
    },
    visaInformation: {
      type: GraphQLVisa,
      description: 'Visa information for the passenger',
      resolve: ({ travelInfo }: Passenger) => {
        const requiredIn = [];
        const warningIn = [];
        const okIn = [];

        // Split visainformation into the 3 possible categories
        travelInfo.forEach(item => {
          item.visa.forEach(visaItem => {
            switch (visaItem.status) {
              case 'critical':
                requiredIn.push(visaItem.country);
                break;
              case 'notice':
                warningIn.push(visaItem.country);
                break;
              case 'ok':
                okIn.push(visaItem.country);
                break;
              default:
                break;
            }
          });
        });

        return {
          requiredIn: uniq(requiredIn),
          warningIn: uniq(warningIn),
          okIn: uniq(okIn),
        };
      },
    },
    pkpasses: {
      type: new GraphQLList(GraphQLPkpass),
      description: 'Url needed for apple wallet integration',
      deprecationReason: 'Use pkpass under boarding pass instead',
    },
  }),
});
