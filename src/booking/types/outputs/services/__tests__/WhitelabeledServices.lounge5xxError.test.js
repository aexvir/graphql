// @flow

import WhitelabeledServices from '../WhitelabeledServices';
import { evaluateResolver } from '../../../../../common/services/TestingTools';
import { ProxiedError as mockProxiedError } from '../../../../../common/services/errors/ProxiedError';

const fields = WhitelabeledServices.getFields();

jest.mock('../../../../dataloaders/Lounges', () => ({
  loadMany: () =>
    Promise.reject(
      new mockProxiedError('error message', '500', 'original URL'),
    ),
}));

it('returns null for 404 errors', async () => {
  await expect(
    evaluateResolver(fields.lounge, {
      booking: {
        legs: [
          {
            departure: { where: { code: 'PRG' } },
            arrival: { where: { code: 'LHR' } },
          },
        ],
      },
    }),
  ).rejects.toBeError('error message');
});
