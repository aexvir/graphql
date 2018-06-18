// @flow

import { get, post } from '../HttpRequest';
import { ProxiedError } from '../errors/ProxiedError';

jest.mock('node-fetch');

beforeEach(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
  process.env.NODE_ENV = 'production';
});

afterEach(() => {
  jest.resetAllMocks();
  process.env.NODE_ENV = 'test';
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
  it('resolves URL with token', async () => {
    expect(await get('https://path/to/api', 't/ok"en')).toMatchSnapshot();
  });

  it('resolves URL without token', async () => {
    expect(await get('https://path/to/api')).toMatchSnapshot();
  });

  it('resolves URL with query string and token', async () => {
    expect(
      await get('https://path/to/api?locale=en', 'randomToken'),
    ).toMatchSnapshot();
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

  it('contains proper user agent header', async () => {
    const resp = await get('https://path/to/api');
    expect(resp.options.headers['X-Client']).toEqual('graphql');
  });
});

describe('POST request', () => {
  it('should throw exception in test environment', async () => {
    process.env.NODE_ENV = 'test';
    await expect(post('https://path/to/api', {})).rejects.toBeError(
      'HttpRequest should never be called in test environment. Have you forgotten to mock "https://path/to/api" with fake data response?',
    );
  });
});

describe('POST request in production', () => {
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

  it('adds default content type header', async () => {
    expect(await post('https://path/to/api', {})).toMatchSnapshot();
  });

  it('supports custom content type header', async () => {
    expect(
      await post(
        'https://path/to/api',
        {},
        { 'Content-Type': 'application/soap+xml' },
      ),
    ).toMatchSnapshot();
  });

  it('supports custom headers', async () => {
    expect(
      await post(
        'https://path/to/api',
        {},
        {
          'Content-Type': 'application/soap+xml',
          'X-Custom-A': 'Value A',
          'X-Custom-B': 'Value B',
        },
      ),
    ).toMatchSnapshot();
  });

  it('stringify payload', async () => {
    expect(
      await post('https://path/to/api', {
        email: 'john@example.com',
        password: 123456,
      }),
    ).toMatchSnapshot();
  });

  it('contains proper user agent header', async () => {
    const resp = await get('https://path/to/api');
    expect(resp.options.headers['X-Client']).toEqual('graphql');
  });
});
