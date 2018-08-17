// @flow

import CustomerSupportNumber from '../CustomerSupportNumber';

it('CustomerSupportNumber type should have valid fields', () => {
  expect(CustomerSupportNumber.getFields()).toMatchSnapshot();
});
