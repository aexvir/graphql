// @flow

import { ProxiedError } from '../ProxiedError';

let error;

beforeEach(() => {
  error = new ProxiedError('custom message', '123', 'http://a.b');
});

it('is throwable', () => {
  expect(() => {
    throw error;
  }).toThrow('custom message');
});

it('adds correct extensions', () => {
  expect(error.extensions).toMatchSnapshot();
});

it('returns proxy info', () => {
  expect(error.getProxyInfo()).toMatchSnapshot();
});
