// @flow

import Location from '../Location';
import { evaluateResolver } from '../../../../common/services/TestingTools';

const fields = Location.getFields();

it('resolves to the correct URL', () => {
  expect(
    evaluateResolver(fields.countryFlagURL, {
      country: {
        locationId: 'CZ',
      },
    }),
  ).toBe('https://images.kiwi.com/flags/32x32/cz.png');

  expect(
    evaluateResolver(fields.countryFlagURL, {
      locationId: 'DE',
      type: 'country',
      country: null,
    }),
  ).toBe('https://images.kiwi.com/flags/32x32/de.png');

  expect(
    evaluateResolver(fields.countryFlagURL, {
      country: {
        // we expect here that every country flag exists
        locationId: 'anything',
      },
    }),
  ).toBe('https://images.kiwi.com/flags/32x32/anything.png');
});

it('resolves to the URL even during failure', () => {
  expect(
    evaluateResolver(fields.countryFlagURL, {
      country: undefined, // underlying API or ancestor type probably failed
    }),
  ).toBe('https://images.kiwi.com/flags/32x32/anywhere.png');
});
