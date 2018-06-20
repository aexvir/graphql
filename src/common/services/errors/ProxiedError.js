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
    +extensions: {|
      +proxy: ProxiedErrorValues,
    |},
  |};

  constructor(message: string, originStatusCode: string, originUrl: string) {
    super(message);
    this.extensions = {
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
