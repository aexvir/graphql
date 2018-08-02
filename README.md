[![CircleCI](https://circleci.com/gh/kiwicom/graphql/tree/master.svg?style=svg)](https://circleci.com/gh/kiwicom/graphql/tree/master)

Production URL: https://graphql.kiwi.com/

[Join our chat over at Discord](https://discord.gg/Pq2q5a5) to get in touch with the community and Kiwi.com engineers.

# Install & Run GraphQL API server

Install:

```
git clone git@github.com:kiwicom/graphql.git
cd graphql
yarn install
```

Run:

```
yarn start
```

Server runs by default on `http://127.0.0.1:3000/`. In order to call every possible query you'll have to set environment variables in the `.env` file (check `.env-sample`).

**Information for Kiwi.com employees:** ask your colleagues how to get these environment variables. Try to ask someone from [this list](https://github.com/kiwicom/graphql/graphs/contributors).

# Run tests

```
yarn test         # unit and integration tests
yarn test-bc      # backward compatibility
yarn test-ci      # everything above + lints and typechecks (runs on the CI server)
```

# Deployment

```
CircleCI ---- triggers ---> VPN ---> production
   ^                         ^
   |                         |
   |                         |
   v                         |
 GitHub - - - - - - - - - - -`
```

We consider `master` branch to be stable and all green commits are being immediately deployed to the production. This is how it works:

1. CircleCI triggers deployment script in VPN
2. this script downloads tested commit and starts building it (see `scripts/build.sh`)
3. this build is added to the Docker image (see `Dockerfile` in this repo)
4. this new build is deployed using [kiwicom/crate](https://github.com/kiwicom/crane)

Detailed overview:

1. private deployer clones the repo and builds it like this:

```
git clone https://github.com/kiwicom/graphql.git .cache/graphql
cd .cache/graphql
git reset --hard $COMMIT_HASH
yarn install
sh ./scripts/build.sh
```

_TODO: we should run tests there as well, we should also test the build!_

2. build script will build the app into `.build` directory
3. this directory and `node_modules` are packed together into the Docker image and executed in production

# Directory structure

Tests should be close to the source code. We use this convention:

```
queries
├── __tests__
│    └── AllBookings.legs.test.js
│    └── AllBookings.test.js
└── AllBookings.js
```

It allows us to keep the test files close as well as not to bloat the source code folder with a lot of test files (one src file may have many test files). The `*.test.js` suffix is used only to distinguish between source and test quickly while using search in your editor.

Overall picture of this project:

```
src
├── booking
│    ├── queries                          # queries exposed to the client
│    │    ├── AllBookings.js
│    │    └── SingleBooking.js
│    ├── mutations (if exists)            # similar to queries
│    ├── dataloaders + API sanitizers     # classes to load data efficiently using Dataloader
│    ├── types
│    │    ├── outputs                     # definition of OUTPUT types exposed to the client
│    │    ├── inputs                      # definition of INPUT types exposed to the client
│    │    └── enums
│    ├── resolvers (if exists)            # more complicated resolvers and their logic
│    └── datasets                         # demo data used for testing purposes
├── flight
│    └── ditto
├── ...
└── common (contains shared services)
```

Motivations: there is point in time in every application where doing groups by generic "outputs" or "inputs" is not enough and it's becoming a mess. For this reason it's better to group application parts by responsibilities. With this structure the project is less flat and more deep.

# Design Style Guides

These style guides are not applied in this project correctly and it's wrong. However, this guide should help to integrate them and to improve overall design of this proxy.

## Localization

Send `Accept-Language` HTTP header with ISO locale string in format `language_territory` to get localised data, e.g. `en_US`, `cs_CZ`.

Some queries relies on input argument `Locale` or `Language`. There input parameters are now deprecated.

## Fetching Customer Bookings

There are currently three different types of bookings:

- "One way" is simply the trip from one place to another, `A -> B -> C`, e.g. flying from Prague to Barcelona, with possible stopovers
- "Return" is the trip to somewhere and back `A <-> B`, e.g. from Prague to Barcelona on July 1, and then back from Barcelona to Prague on July 14
- "Multicity" - is set of trips you will do over time from one place to another, booked at once. Basically it's array of "One way" bookings

As each type requires different shape of data to display such booking info optimally. Possible query using fragments could look like this:

```graphql
query ManageMyBooking {
  customerBookings {
    edges {
      node {
        id
        __typename
        ... on BookingOneWay {
          ...OneWayBooking
        }
        ... on BookingReturn {
          ...ReturnBooking
        }
        ... on BookingMulticity {
          ...MulticityBooking 
        }
      }
    }
  }
}
```

And then, based on `__typename`, you decide what fragment to use. Not familiar with this "inline fragments" syntax in GraphQL? [Check this...](https://graphql.org/learn/queries/#inline-fragments)

It's also very simple to fetch already filtered future and past bookings using `only` query argument:

```graphql
query ManageMyBooking {
  future: customerBookings(only: FUTURE) {
    ...IBookingFragment_future
  }
  past: customerBookings(only: PAST) {
    ...IBookingFragment_past
  }
}
```

This way you can fetch and render future and past bookings differently (even though they will probably share most of the logic). The same applies to one-way/return/multicity bookings - you can start rendering them differently but at the end you should reuse many components.

## Output Types

Every output type should provide relevant fields. This is basically why we are writing this proxy. It's good idea to write descriptions to every field because even though it may be obvious for you - it may significantly help others.

Because we are using Flow for type checking you should write these Flow types next to GraphQL output types:

```js
export type HotelCity = {|
  +name: string,
|};

export default new GraphQLObjectType({
  name: 'HotelCity',
  fields: {
    name: {
      type: GraphQLString,
      description: 'Name of the hotel.',
      resolve: ({ name }: HotelCity): string => name,
    },

    // ...
  },
});
```

Why you may ask? It's because in this case the Flow type defines the interface of the GraphQL type so no matter who is the ancestor of this type - the interface is clear and defined here. It's very good idea to write resolve functions even though they may seem useless (like in this case). It's because Flow is not clever enough and you may get into troubles: Let's say you want to return object for another GraphQL type (not string). In this case Flow is not able to check if the returned type from resolve function is correct unless you specify what are you actually returning. It's like checking if inputs and outputs of the resolve function are correct. This is the only way how to write GraphQL types safely. Example:

```js
export type HotelCity = {|
  +name: string,
|};

export default new GraphQLObjectType({
  name: 'HotelCity',
  fields: {
    name: {
      type: GraphQLString,
      description: 'Name of the hotel.',
      resolve: ({ name }: HotelCity) => -1, // return type is missing
    },
  },
});
```

Flow is happy but it's obviously wrong because GraphQL expects string (`GraphQLString`). It may trigger GraphQL error in more complicated situations (non-scalars). Luckily the Flow types are in the same file as GraphQL output type so you can import them easily:

```js
import GraphQLAddress, { type GraphQLAddress } from './GraphQLAddress';
```

## Data Loaders

We use data loaders to fetch all other resources in a clever way. They do not repeat the same query if not necessary so they behave like a ephemeral cache during one GraphQL request. Currently we are fetching data only from other REST endpoints but we may fetch them from database in the future.

You can read more about data loaders here: https://github.com/facebook/dataloader

Typing data loaders may by very complicated. They basically have input + output types and they are not closely related to the Flow types in GraphQL output types. It's because they are not tightly coupled and GraphQL type may have a lot of sources. Therefore in perfect world you should use Flow type for underlying API response and Flow type for sanitized data loader result. You can use [JSON to Flow](https://transform.now.sh/json-to-flow-types/) converter to create API response types. However you should always modify the result because it's not perfect. API may return errors, empty responses and so on:

```js
type ApiResponse = ValidResponse | ErrorResponse | NoResultResponse;

type ValidResponse = $ReadOnlyArray<{|
  +translations: $ReadOnlyArray<{|
    +language: string,
    +name: string,
  |}>,
  +location: {|
    +latitude: string,
    +longitude: string,
  |},
  +name: string,
  +country: string,
  +nr_hotels: number,
  +city_id: number,
|}>;

type NoResultResponse = [];

type ErrorResponse = {|
  +error: string,
|};
```

Sometimes it's convenient to use Flow types from GraphQL output type to annotate data loader result. It's not clean nor perfect but we allow this for now.

### Data Loaders Gotchas

Writing data loaders properly can be sometimes tricky. It's actually very easy to write data loader that doesn't work at all (and therefore it's good idea to write tests for every data loader). For example this is normal data loader implementation:

```js
const userLoader = new DataLoader(
  (keys: $ReadOnlyArray<strings>) => myBatchGetUsers(keys)
);
```

Nothing tricky or special here. But it gets complicated when we want to use object instead of scalars for the keys:

```js
const userLoader = new DataLoader(
  (keys: $ReadOnlyArray<{|
    +id: string,
    +additionalParameter: number,
  |}>) => myBatchGetUsers(keys)
);
```

This data loader won't work. It will always call a new URL because the object reference changed (even though the parameters are still the same). This will fix it:

```js
import stringify from 'json-stable-stringify';

const userLoader = new DataLoader(
  (keys: $ReadOnlyArray<{|
    +id: string,
    +additionalParameter: number,
  |}>) => myBatchGetUsers(keys),
  {
    cacheKeyFn: key => stringify(key),
  }
);
```

Implementation of the `cacheKeyFn` depends on the use-case. It's important to note that we do not use simple JSON stringify here because different object props order would generate different key even though the values are still the same.

# FAQ

## How can I distinguish between `null` as a value and `null` as a result of the error?

Common problem is to say whether this is an error or just a valid value returned from the API:

```json
{
  "data": {
    "currency": {
      "code": "usd",
      "format": null    // error? value?
    }
  }
}
```

It can be confusing because we allow `null` values everywhere and therefore you cannot rely on it. But there are valid cases where you need to work with this information in you application. Luckily, there are `errors` in the response:

```json
{
  "errors": [
    {
      "message": "My lovely error message for developers to fix it...",
      "locations": [{ "line": 4, "column": 5 }],
      "path": [
        "currency",
        "format"
      ]
    }
  ],
  "data": {
    "currency": {
      "code": "usd",
      "format": null
    }
  }
}
```

Do you see the `path`? That's your key. If you can find this among all the errors then you can be sure that the field actually failed. You can read more about it [in the specification](http://facebook.github.io/graphql/draft/#sec-Errors). Note that you cannot rely on the `errors` key itself. There may be many things going wrong so you always have to verify your path in the response.

# Requirements of a Relay-compliant GraphQL server

- [Cursor Connections Specification](https://facebook.github.io/relay/graphql/connections.htm)
- [Global Object Identification Specification](https://facebook.github.io/relay/graphql/objectidentification.htm)
- [Input Object Mutations Specification](https://facebook.github.io/relay/graphql/mutations.htm)

_Note: you don't have to use Relay as a client. We just like these design patterns but it's still client agnostic._
