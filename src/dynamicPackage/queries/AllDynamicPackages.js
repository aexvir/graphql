// @flow

import { GraphQLNonNull } from 'graphql';
import { connectionArgs, connectionDefinitions } from 'graphql-relay';
import { connectionFromArray } from '../../common/services/ArrayConnection';
import Currency from '../../common/types/enums/Currency';

import GraphQLDynamicPackage from '../types/outputs/DynamicPackage';
import GraphQLSimpleSearchInput from '../types/inputs/SimpleSearchInput';

import type { GraphqlContextType } from '../../common/services/GraphqlContext';

const { connectionType: DynamicPackagesConnection } = connectionDefinitions({
  nodeType: GraphQLDynamicPackage,
});

export default {
  type: DynamicPackagesConnection,
  description:
    'All dynamic packages. Dynamic package is a combination of return flight ' +
    'and accommodation in hotel. It saves time and also the price should be ' +
    'better then buying flight and acommodation separately.',
  args: {
    simpleSearch: {
      type: new GraphQLNonNull(GraphQLSimpleSearchInput),
    },
    currency: {
      type: Currency,
      description: 'An ISO-4217 currency code.',
    },
    ...connectionArgs,
  },
  resolve: async (
    ancestor: mixed,
    { simpleSearch, currency, ...pagination }: Object,
    { dataLoader, locale }: GraphqlContextType,
  ) => {
    const packages = await dataLoader.dynamicPackages.load({
      currency,
      language: locale.language,
      ...simpleSearch,
    });
    return connectionFromArray(packages, pagination);
  },
};
