// @flow

type ProxiedErrorValues = {|
  +statusCode: string,
  +url: string,
|};

/**
 * This exception is thrown if origin server does NOT respond with HTTP status code 200.
 */
class ProxiedError extends Error {
  extensions: {|
    +_proxy: ProxiedErrorValues,
    +extensions: {|
      +proxy: ProxiedErrorValues,
    |},
  |};

  constructor(message: string, originStatusCode: string, originUrl: string) {
    super(message);
    this.extensions = {
      _proxy: {
        // note: this is deprecated and will be removed
        statusCode: originStatusCode,
        url: originUrl,
      },
      extensions: {
        proxy: {
          statusCode: String(originStatusCode),
          url: originUrl,
        },
      },
    };
  }
}

export { ProxiedError };
