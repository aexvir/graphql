// @flow

export async function get(absoluteApiUrl: string): Promise<Object> {
  const mockResponse = stackOfMockResponses.GET[absoluteApiUrl];
  if (mockResponse !== undefined) {
    return Promise.resolve(mockResponse);
  }

  const patterns = Object.keys(stackOfMockResponses.GET);
  const mockResponseRegex = matchRegex(absoluteApiUrl, patterns);
  if (mockResponseRegex !== undefined) {
    return Promise.resolve(stackOfMockResponses.GET[mockResponseRegex]);
  }

  throw new Error(`Data mock not found for path: ${absoluteApiUrl}`);
}

export async function post(absoluteApiUrl: string): Promise<Object> {
  const mockResponse = stackOfMockResponses.POST[absoluteApiUrl];
  if (mockResponse !== undefined) {
    return Promise.resolve(mockResponse);
  }

  const patterns = Object.keys(stackOfMockResponses.POST);
  const mockResponseRegex = matchRegex(absoluteApiUrl, patterns);
  if (mockResponseRegex !== undefined) {
    return Promise.resolve(stackOfMockResponses.POST[mockResponseRegex]);
  }

  throw new Error(`Data mock not found for path: ${absoluteApiUrl}`);
}

export async function patch(absoluteApiUrl: string): Promise<Object> {
  const mockResponse = stackOfMockResponses.PATCH[absoluteApiUrl];
  if (mockResponse !== undefined) {
    return Promise.resolve(mockResponse);
  }

  const patterns = Object.keys(stackOfMockResponses.PATCH);
  const mockResponseRegex = matchRegex(absoluteApiUrl, patterns);
  if (mockResponseRegex !== undefined) {
    return Promise.resolve(stackOfMockResponses.PATCH[mockResponseRegex]);
  }

  throw new Error(`Data mock not found for path: ${absoluteApiUrl}`);
}

const stackOfMockResponses: {
  [string]: Object,
} = {
  POST: {},
  GET: {},
  PATCH: {},
};

export function __setMockData(
  httpMethod: string,
  absoluteUrl: string,
  mockData: Object,
) {
  stackOfMockResponses[httpMethod][absoluteUrl] = mockData;
}

function matchRegex(url: string, patterns: string[]): ?string {
  return patterns.find(pattern => {
    const regexp = new RegExp(`^${pattern}$`);
    return regexp.test(url);
  });
}
