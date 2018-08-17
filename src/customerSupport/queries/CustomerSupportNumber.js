// @flow

import GraphQLCustomerSupportNumber from '../types/outputs/CustomerSupportNumber';
import type { GraphqlContextType } from '../../common/services/GraphqlContext';

export default {
  type: GraphQLCustomerSupportNumber,
  description: 'Get customer support number for your locale',
  resolve: async (
    ancestor: mixed,
    args: Object,
    { dataLoader, locale }: GraphqlContextType,
  ) => {
    const customerSupportNumber = await dataLoader.customerSupportNumber.load(
      locale.territory.toLocaleLowerCase(),
    );

    return customerSupportNumber;
  },
};
