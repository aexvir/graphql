// @flow

import { RestApiMock } from '../../../common/services/TestingTools';
import CSNumberEnabledDataset from '../../datasets/csNumberEnabled.json';
import CSNumberDisabledDataset from '../../datasets/csNumberDisabled.json';
import createCustomerSupportNumberLoader from '../../../customerSupport/dataloaders/CustomerSupportNumber';

describe('Customer support number dataloader - enabled', () => {
  beforeEach(() => {
    RestApiMock.onGet(
      'https://booking-api.skypicker.com/api/v0.1/configs/kiwicom',
    ).replyWithData(CSNumberEnabledDataset);
  });

  it('should load customerSupportNumberLoader for valid locale territory', async () => {
    const customerSupportNumberLoader = createCustomerSupportNumberLoader();
    const customerSupportNumber = await customerSupportNumberLoader.load(
      'wonderland',
    );
    expect(customerSupportNumber).toEqual({
      number: '123 456789',
      id: 'wonderland',
      native_support: 'Support Available in English 24/7',
    });
  });

  it('should load default number for unknown locale territory', async () => {
    const customerSupportNumberLoader = createCustomerSupportNumberLoader();
    const customerSupportNumber = await customerSupportNumberLoader.load(
      'unknown territory',
    );
    expect(customerSupportNumber).toEqual({
      number: '123 666666',
      id: 'westeros',
      native_support: 'Support Available in English 24/7',
    });
  });
});

describe('Customer support number dataloader - disabled', () => {
  beforeEach(() => {
    RestApiMock.onGet(
      'https://booking-api.skypicker.com/api/v0.1/configs/kiwicom',
    ).replyWithData(CSNumberDisabledDataset);
  });
  it('should not load anything', async () => {
    const customerSupportNumberLoader = createCustomerSupportNumberLoader();
    const customerSupportNumber = await customerSupportNumberLoader.load(
      'wonderland',
    );
    expect(customerSupportNumber).toBe(null);
  });
});
