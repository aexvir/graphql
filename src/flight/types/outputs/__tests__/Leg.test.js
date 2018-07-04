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
        boardingPasses: [
          {
            boardingPassUrl: 'https://very.real/boarding_pass.pdf',
            flightNumber: '32432424',
            availableAt: null,
            leg: null,
          },
          {
            boardingPassUrl: 'https://very.fake/boarding_pass.pdf',
            flightNumber: '12344321',
            availableAt: null,
            leg: null,
          },
        ],
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
    expect(returnValue).toEqual({
      boardingPassUrl: 'https://very.real/boarding_pass.pdf',
      flightNumber: '32432424',
      availableAt: null,
      leg: null,
    });
  });

  it('handles undefined boardingPasses value', async () => {
    const fakeBoardingPassData = {
      assets: {},
    };
    const fakeContext = {
      dataLoader: {
        booking: {
          load: jest.fn(async () => {
            fakeBoardingPassData;
          }),
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
    expect(returnValue).toEqual(null);
  });
});
