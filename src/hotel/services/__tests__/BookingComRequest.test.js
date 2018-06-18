// @flow

import { get } from '../BookingComRequest';
import { ProxiedError } from '../../../common/services/errors/ProxiedError';

jest.mock('node-fetch');

beforeEach(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
  process.env.NODE_ENV = 'production';
  process.env.BOOKING_COM_TOKEN = 'booking_com_token';
});

afterEach(() => {
  jest.resetAllMocks();
  process.env.NODE_ENV = 'test';
  delete process.env.BOOKING_COM_TOKEN;
});

describe('GET request', () => {
  it('should throw exception in test environment', async () => {
    process.env.NODE_ENV = 'test';
    await expect(get('https://path/to/api')).rejects.toBeError(
      'HttpRequest should never be called in test environment. Have you forgotten to mock "https://path/to/api" with fake data response?',
    );
  });
});

describe('GET request in production', () => {
  it('sets authorization header', async () => {
    expect(await get('https://path/to/api')).toMatchSnapshot();
  });

  it('throws exception during invalid return status code', async () => {
    expect.assertions(3);

    try {
      await get('https://path/to/api?status=500');
    } catch (error) {
      expect(error).toBeInstanceOf(ProxiedError);
      expect(error.message).toBe('Status Text');
      expect(error.extensions).toMatchSnapshot();
    }
  });
});
