// @flow

import Leg from '../Leg';
import { evaluateResolver } from '../../../../common/services/TestingTools';

const fields = Leg.getFields();

it('Leg type should have valid fields', () => {
  expect(fields).toMatchSnapshot();
});

describe('boardingPass resolver', () => {
  it('returns null if no bookingId is passed in', async () => {
    const returnValue = await evaluateResolver(
      fields.boardingPass,
      {
        id: null,
        bookingId: null,
      },
      undefined,
      {},
    );
    expect(returnValue).toEqual(null);
  });

  it('returns correct value', async () => {
    const fakeBoardingPassData = {
      assets: {
        boardingPasses: {
          '32432424': 'https://very.real/boarding_pass.pdf',
        },
      },
    };
    const fakeContext = {
      dataLoader: {
        booking: {
          load: jest.fn(async () => fakeBoardingPassData),
        },
      },
    };
    const returnValue = await evaluateResolver(
      fields.boardingPass,
      {
        id: '32432424',
        bookingId: 'X324-324A24',
      },
      undefined,
      fakeContext,
    );
    expect(returnValue).toMatchSnapshot();
  });
});
