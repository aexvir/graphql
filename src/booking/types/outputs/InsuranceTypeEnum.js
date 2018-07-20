// @flow

import { GraphQLEnumType } from 'graphql';

const InsuranceTypeEnum = new GraphQLEnumType({
  name: 'InsuranceType',
  description: 'The possible insurance type values',
  values: {
    NONE: { value: 'none' },
    TRAVEL_BASIC: { value: 'travel_basic' },
    TRAVEL_PLUS: { value: 'travel_plus' },
  },
});

export default InsuranceTypeEnum;
