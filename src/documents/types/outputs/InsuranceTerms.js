// @flow

import { GraphQLObjectType } from 'graphql';
import DocumentInterface, { commonFields } from './DocumentInterface';

export default new GraphQLObjectType({
  name: 'InsuranceTerms',
  description: 'Insurance Terms and Conditions document',
  interfaces: [DocumentInterface],
  fields: {
    ...commonFields,
  },
});
