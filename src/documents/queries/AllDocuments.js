// @flow

import { connectionArgs, connectionDefinitions } from 'graphql-relay';

import documents from '../datasets/documents';

import { connectionFromArray } from '../../common/services/ArrayConnection';
import GraphQLDocumentInterface from '../types/outputs/DocumentInterface';

const { connectionType: AllDocumentsConnection } = connectionDefinitions({
  nodeType: GraphQLDocumentInterface,
});

export default {
  type: AllDocumentsConnection,
  description: 'Search for the urls of public documents',
  args: connectionArgs,
  resolve: (ancestor: mixed, args: Object) => {
    return connectionFromArray(documents, args);
  },
};
