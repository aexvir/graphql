// @flow

export const createLeg = (milliseconds: number) => ({
  arrival: {
    when: {
      utc: new Date(milliseconds),
    },
  },
});
