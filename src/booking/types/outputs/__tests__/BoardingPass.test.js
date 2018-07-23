// @flow

import BoardingPass from '../BoardingPass';
import { evaluateResolver } from '../../../../common/services/TestingTools';

describe('Boarding pass', () => {
  it('should have valid fields', () => {
    // $FlowExpectedError: Missing types for jest 23.x.x https://github.com/flow-typed/flow-typed/issues/2264
    expect(BoardingPass.getFields()).toMatchInlineSnapshot(`
Object {
  "availableAt": Object {
    "args": Array [],
    "description": "The date when the boarding pass will be available for download",
    "isDeprecated": false,
    "name": "availableAt",
    "reslove": [Function],
    "type": "Date",
  },
  "boardingPassUrl": Object {
    "args": Array [],
    "isDeprecated": false,
    "name": "boardingPassUrl",
    "resolve": [Function],
    "type": "String",
  },
  "flightNumber": Object {
    "args": Array [],
    "isDeprecated": false,
    "name": "flightNumber",
    "resolve": [Function],
    "type": "String",
  },
  "leg": Object {
    "args": Array [],
    "description": "The leg for the boarding pass",
    "isDeprecated": false,
    "name": "leg",
    "resolve": [Function],
    "type": "Leg",
  },
  "pkpasses": Object {
    "args": Array [],
    "description": "pkpasses connected to the boarding pass",
    "isDeprecated": false,
    "name": "pkpasses",
    "resolve": [Function],
    "type": "[Pkpass]",
  },
}
`);
  });

  it('resolves empty array correctly', () => {
    const pkpasses = BoardingPass.getFields().pkpasses;
    expect(
      evaluateResolver(pkpasses, {
        pkpasses: [],
      }),
    ).toBe(null);
  });
});
