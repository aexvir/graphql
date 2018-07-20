// @flow

import { GraphQLObjectType } from 'graphql';
import InsuranceTypeEnum from './InsuranceTypeEnum';
import GraphQLPrice from '../../../common/types/outputs/Price';

import type { InsurancePrice } from '../../Booking';
import type { Price } from '../../../common/types/Price';

export default new GraphQLObjectType({
  name: 'InsurancePrice',
  fields: {
    price: {
      type: GraphQLPrice,
      resolve: ({ price }: InsurancePrice): Price | null => price,
    },

    insuranceType: {
      type: InsuranceTypeEnum,
      description: 'Insurance type',
      resolve: ({ type }: InsurancePrice) => type,
    },
  },
});
