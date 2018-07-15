// @flow

import algoliasearch from 'algoliasearch';

export default class Algolia {
  client: algoliasearch;

  constructor(appId: string, apiKey: string) {
    this.client = new algoliasearch(appId, apiKey);
  }

  async listIndexes(): Promise<Object[]> {
    const resp = await this.client.listIndexes();
    return resp.items;
  }

  async setupIndex(indexName: string, supportedLangs: string[]) {
    const index = this.client.initIndex(indexName);

    const clearing = await index.clearIndex();
    await index.waitTask(clearing.taskID);

    const settings = await index.setSettings({
      searchableAttributes: [
        'name',
        supportedLangs.map(lang => `name_${lang}`).join(','),
        'city_id',
      ],
      customRanking: ['desc(nr_hotels)'],
    });
    return index.waitTask(settings.taskID);
  }

  async uploadData(indexName: string, data: Object[]) {
    const index = this.client.initIndex(indexName);
    const inserting = await index.addObjects(data);
    return index.waitTask(inserting.taskID);
  }
}
