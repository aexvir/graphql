// @flow

import { URL } from 'url';
import { fetchJson } from './JsonFetcher';

const prepareHeaders = (requestHeaders?: Object = {}) => ({
  'X-Client': 'graphql',
  'Content-Type': 'application/json',
  ...requestHeaders,
});

export async function get(
  absoluteApiUrl: string,
  token: ?string,
  requestHeaders?: Object = {},
): Promise<Object> {
  const urlObject = new URL(absoluteApiUrl);

  if (token != null) {
    urlObject.searchParams.append('token', token);
  }
  const headers = prepareHeaders(requestHeaders);

  return fetchJson(urlObject.toString(), 'GET', { headers });
}

export async function post(
  absoluteApiUrl: string,
  payload: Object,
  requestHeaders?: Object = {},
): Promise<Object> {
  const body = JSON.stringify(payload);
  const headers = prepareHeaders(requestHeaders);

  return fetchJson(absoluteApiUrl, 'POST', { body, headers });
}

export async function patch(
  absoluteApiUrl: string,
  payload: Object,
  requestHeaders?: Object = {},
): Promise<Object> {
  const body = JSON.stringify(payload);
  const headers = prepareHeaders(requestHeaders);

  return fetchJson(absoluteApiUrl, 'PATCH', { body, headers });
}
