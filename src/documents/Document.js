// @flow

export type DocumentType = 'InsuranceTerms';

export type Document = {|
  +type: DocumentType,
  +urls: {
    +default: string,
    +[languageCode: string]: string,
  },
|};
