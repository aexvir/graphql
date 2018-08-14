// @flow

import DataLoader from 'dataloader';
import idx from 'idx';
import { get } from '../../common/services/HttpRequest';

export default function createCustomerSupportNumbersLoader() {
  return new DataLoader((countryLocales: $ReadOnlyArray<string>) =>
    batchLoad(countryLocales),
  );
}

async function batchLoad(
  countryLocales: $ReadOnlyArray<string>,
): Promise<Array<?Object>> {
  const customerSupportNumbers = await fetchCustomerSupportNumbers();
  return countryLocales.map(countryLocale => {
    const customerSupportNumber =
      customerSupportNumbers[countryLocale] || customerSupportNumbers.default;
    return customerSupportNumber !== undefined ? customerSupportNumber : null;
  });
}

async function fetchCustomerSupportNumbers() {
  const response = await get(
    'https://booking-api.skypicker.com/api/v0.1/configs/kiwicom',
  );
  const enabled = idx(response, _ => _.contacts.phones.enabled);

  if (enabled) {
    return idx(response, _ => _.contacts.phones.locales) || {};
  }
  return {};
}
