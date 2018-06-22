// @flow

import { graphql, RestApiMock } from '../../../common/services/TestingTools';
import categories from '../../datasets/categories.json';

describe('FAQCategory', () => {
  beforeEach(() => {
    RestApiMock.onGet(
      'https://api.skypicker.com/knowledgebase/api/v1/categories/3',
    ).replyWithData(categories);
  });

  it('should return single FAQ category', async () => {
    const id = 'RkFRQ2F0ZWdvcnk6NDc='; // "Before the flight"
    const resultsQuery = `query FAQSubcategories($id: ID!) { 
      FAQCategory(language: en, id: $id) {
        id
        originalId
        title
        subcategories {
          id
        }
        FAQs {
          id
          title
        }
      }
    }`;
    expect(await graphql(resultsQuery, { id })).toMatchSnapshot();
  });

  it('should return ancestors for FAQ category', async () => {
    const id = 'RkFRQ2F0ZWdvcnk6NDM='; // "Searching for flights"
    const resultsQuery = `query FAQSubcategories($id: ID!) { 
      FAQCategory(language: en, id: $id) {
        id
        title
        ancestors {
          id
          title
          subcategories {
            id
            title
          }
        }
        FAQs {
          id
          title
        }  
      }      
    }`;
    expect(await graphql(resultsQuery, { id })).toMatchSnapshot();
  });

  it('should return error for non-existing category', async () => {
    const id = 'RkFRQ2F0ZWdvcnk6NjY2'; // non-existing category #666
    const resultsQuery = `query FAQSubcategories($id: ID!) { 
      FAQCategory(language: en, id: $id) {
        id
      }        
    }`;
    expect(await graphql(resultsQuery, { id })).toMatchSnapshot();
  });
});
