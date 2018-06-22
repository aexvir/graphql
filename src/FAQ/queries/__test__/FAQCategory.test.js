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
    const id = 'RkFRQ2F0ZWdvcnk6NzY='; // "Before booking"
    const resultsQuery = `query FAQSubcategories($id: ID!) { 
      FAQCategory(id: $id) {
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
    const id = 'RkFRQ2F0ZWdvcnk6ODg='; // "Baggage"
    const resultsQuery = `query FAQSubcategories($id: ID!) { 
      FAQCategory(id: $id) {
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
      FAQCategory(id: $id) {
        id
      }        
    }`;
    expect(await graphql(resultsQuery, { id })).toMatchSnapshot();
  });
});
