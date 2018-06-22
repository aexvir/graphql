// @flow

import { graphql, RestApiMock } from '../../../common/services/TestingTools';
import categories from '../../datasets/categories.json';
import FAQArticle41 from '../../datasets/FAQArticle-41.json';
import FAQArticle43 from '../../datasets/FAQArticle-43.json';
import FAQArticle44 from '../../datasets/FAQArticle-44.json';

describe('allFAQCategories', () => {
  beforeEach(() => {
    RestApiMock.onGet(
      'https://api.skypicker.com/knowledgebase/api/v1/categories/3',
    ).replyWithData(categories);
    RestApiMock.onGet(
      'https://api.skypicker.com/knowledgebase/api/v1/articles/41',
    ).replyWithData(FAQArticle41);
    RestApiMock.onGet(
      'https://api.skypicker.com/knowledgebase/api/v1/articles/43',
    ).replyWithData(FAQArticle43);
    RestApiMock.onGet(
      'https://api.skypicker.com/knowledgebase/api/v1/articles/44',
    ).replyWithData(FAQArticle44);
  });

  it('should return list of categories with subcategories and related FAQs', async () => {
    const resultsQuery = `{ 
      allFAQCategories {
        edges {
          node {
            id
            title
            subcategories {
              id
            }
            FAQs {
              id
              title
              content
            }  
          }
        }
      }        
    }`;
    expect(await graphql(resultsQuery)).toMatchSnapshot();
  });

  it('should return list of categories related to only one section of FAQ', async () => {
    const resultsQuery = `{ 
      allFAQCategories(section: BEFORE_BOOKING) {
        edges {
          node {
            id
            title
            subcategories {
              id
            }
            FAQs {
              id
              title
              content
            }  
          }
        }
      }        
    }`;
    expect(await graphql(resultsQuery)).toMatchSnapshot();
  });
});
