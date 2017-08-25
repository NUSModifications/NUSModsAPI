// @flow
import querystring from 'querystring';
import R from 'ramda';

import BaseTask from './BaseTask';

const NUS_API_URL = 'http://nuslivinglab.nus.edu.sg/api_dev/api/';
const FIELDS = [];
const MAX_INSERT_SIZE = 999 / 4;

/**
 * Outputs venue data for the school for one acad year.
 * By default outputs to:
 *   - venuesRaw.json
 */
export default class VenuesScraper extends BaseTask {
  async process(existingRows, currentRows) {
    if (!currentRows.length) {
      throw new Error('No data found');
    }
    const transaction = await this.getTransaction();

    const map = {};
    currentRows.forEach((row) => {
      map[row.name] = row;
    });

    const transactions = [];
    const transact = ({ name }) => this.db.table('venues').transacting(transaction).where({ name });
    existingRows.forEach((row) => {
      const currentRow = map[row.name];
      if (!currentRow) {
        // Content is no longer present
        transactions.push(transact(row).delete());
      } else if (!R.equals(currentRow, row)) {
        // Content is different
        transactions.push(transact(row).update(currentRow));
      }
      // Content is exactly the same, do nothing
      delete map[row.name];
    });

    return Promise.all(transactions)
      // Whatever remains must be new data
      .then(() => this.db.batchInsert('venues', Object.values(map), MAX_INSERT_SIZE))
      .then(transaction.commit)
      .catch(transaction.rollback);
  }

  async scrape() {
    const query = querystring.stringify({
      name: '',
      output: 'json',
    });
    const url = `${NUS_API_URL}Dept?${query}`;
    const response = await this.http.get(url);
    const currentVenues = response.data.map(this.convertToRow);
    const existingVenues = await this.db.table('venues').where({ school_id: 1 }).select(FIELDS);

    return this.process(existingVenues, currentVenues);
  }

  convertToRow(venue) {
    // The api is terribly named, name is not unique,
    // while code is more arguably more suitable as the name
    // and dept are not departments when they
    // can be owned by clubs and external vendors
    const { roomcode: name, roomname: type, dept: owned_by, ...extraProps } = venue;

    if (Object.keys(extraProps).length) {
      this.log.warn('Found extra properties', extraProps);
    }

    return {
      school_id: 1,
      name,
      type,
      owned_by,
    };
  }
}
