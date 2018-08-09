// @flow

import Flight from '../Flight';
import LocationDataloader from '../../../location/dataloaders/Location';
import LocationsDataloader from '../../../location/dataloaders/Locations';

jest.mock('../../../location/dataloaders/Location');
jest.mock('../../../location/dataloaders/Locations');

const mockCalledEndpoints = [];

jest.mock('../../../common/services/HttpRequest', () => {
  const HttpRequest = jest.genMockFromModule(
    '../../../common/services/HttpRequest',
  );
  HttpRequest.get = (url: string) => {
    mockCalledEndpoints.push(url);
    return Promise.resolve({ data: ['something'] });
  };
  return HttpRequest;
});

it('calls the same URL only once', async () => {
  const dataloader = new Flight(
    new LocationDataloader(),
    new LocationsDataloader(),
  );

  // first call
  await dataloader.load({
    from: [{ location: 'PRG' }],
    to: [{ location: 'BRQ' }],
    dateFrom: new Date('2020-12-30'),
    dateTo: new Date('2020-12-30'),
    returnFrom: new Date('2020-12-30'),
    returnTo: new Date('2020-12-30'),
    typeFlight: 'return',
    currency: null,
    adults: null,
    locale: null,
    filters: null,
  });

  // second call (different)
  await dataloader.load({
    from: [{ location: 'PRG' }],
    to: [{ location: 'LON' }],
    dateFrom: new Date('2020-12-30'),
    dateTo: new Date('2020-12-30'),
    returnFrom: new Date('2020-12-30'),
    returnTo: new Date('2020-12-30'),
    typeFlight: 'return',
    currency: null,
    adults: null,
    locale: null,
    filters: null,
  });

  // third call (same as the first one)
  await dataloader.load({
    from: [{ location: 'PRG' }],
    to: [{ location: 'BRQ' }],
    dateFrom: new Date('2020-12-30'),
    dateTo: new Date('2020-12-30'),
    returnFrom: new Date('2020-12-30'),
    returnTo: new Date('2020-12-30'),
    typeFlight: 'return',
    currency: null,
    adults: null,
    locale: null,
    filters: null,
  });

  expect(mockCalledEndpoints).toEqual([
    'https://api.skypicker.com/flights?' +
      'flyFrom=PRG&' +
      'to=BRQ&' +
      'dateFrom=30%2F12%2F2020&' +
      'dateTo=30%2F12%2F2020&' +
      'returnFrom=30%2F12%2F2020&' +
      'returnTo=30%2F12%2F2020&' +
      'typeFlight=return&' +
      'vehicle_type=aircraft%2Cbus%2Ctrain&' +
      'v=3',
    'https://api.skypicker.com/flights?' +
      'flyFrom=PRG&' +
      'to=LON&' +
      'dateFrom=30%2F12%2F2020&' +
      'dateTo=30%2F12%2F2020&' +
      'returnFrom=30%2F12%2F2020&' +
      'returnTo=30%2F12%2F2020&' +
      'typeFlight=return&' +
      'vehicle_type=aircraft%2Cbus%2Ctrain&' +
      'v=3',
  ]);
});
