// @flow

import { evaluateResolver } from '../../../../../common/services/TestingTools';
import TransportationServiceRelevantLocations from '../TransportationServiceRelevantLocations';

const fields = TransportationServiceRelevantLocations.getFields();

it('should work', () => {
  expect(
    evaluateResolver(fields.whitelabelURL, {
      location: { locationId: 'OSL' },
      date: new Date(2018, 1, 1, 19, 25),
    }),
  ).toMatchInlineSnapshot(
    `"https://kiwi.rideways.com/?date=2018-02-01&pickup=OSL&utm_source=kiwi&utm_medium=startpart&utm_campaign=mobileappconfpage&time=19:25"`,
  );
});
