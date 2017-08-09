import querystring from 'querystring';

import BaseTask from './BaseTask';

const NUS_API_URL = 'http://nuslivinglab.nus.edu.sg/api_dev/api/';

/**
 * Outputs venue data for the school for one acad year.
 * By default outputs to:
 *   - venuesRaw.json
 */
export default class VenuesScraper extends BaseTask {
  scrape() {
    const query = querystring.stringify({
      name: '',
      output: 'json',
    });
    const url = `${NUS_API_URL}Dept?${query}`;
    const output = this.fetch(url);
    this.log.debug(`parsed ${output.length} venues`);
  }
}
