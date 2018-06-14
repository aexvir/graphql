// @flow

import { GraphQLObjectType, GraphQLString, GraphQLList } from 'graphql';
import Location from '../../../../location/types/outputs/Location';
import type { GraphqlContextType } from '../../../../common/services/GraphqlContext';

export default new GraphQLObjectType({
  name: 'LoungeService',
  fields: {
    relevantAirports: {
      type: GraphQLList(
        new GraphQLObjectType({
          name: 'LoungeServiceRelevantAirports',
          fields: {
            whitelabelURL: {
              type: GraphQLString,
              resolve: async ({ provider, iata: iataCode }) => {
                if (provider === 'collinsons') {
                  return `https://www.loungepass.com/tp/kiwi/?airport=${iataCode}`;
                } else if (provider === 'loungebuddy') {
                  return `https://www.loungebuddy.com/${iataCode}`;
                }

                return null;
              },
            },

            location: {
              type: Location,
              resolve: (lounge, args: {}, context: GraphqlContextType) => {
                return context.dataLoader.location.loadById(lounge.iata);
              },
            },
          },
        }),
      ),
      resolve: arrayOfLounges => arrayOfLounges,
    },
  },
});
