// @flow

import fetch from 'node-fetch';
import Logger from '../services/Logger';
import { ProxiedError } from './errors/ProxiedError';

export async function fetchJson(
  url: string,
  method: string = 'GET',
  options?: Object = {},
): Promise<any> {
  if (process.env.NODE_ENV === 'test') {
    throw new Error(
      `HttpRequest should never be called in test environment. Have you forgotten to mock "${url}" with fake data response?`,
    );
  }
  if (typeof url !== 'string') {
    throw new Error(
      `Relative API URL should be typeof 'string', '${typeof url}' given.`,
    );
  }

  const reqOptions = {
    ...options,
    method,
  };

  Logger.info(`${method} ${url}`);

  const response = await fetch(url, reqOptions);

  if (response.status >= 300) {
    throw new ProxiedError(response.statusText, response.status, url);
  }
  if (response.status === 204) {
    // response.json is undefined if there is no body
    return null;
  }
  return response.json();
}
