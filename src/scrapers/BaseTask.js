// @flow
import bunyan from 'bunyan';
import fs from 'fs-extra';

import config from '../config';

/**
 * Base class for all scraping tasks, contains useful utilities
 * such as logging and writing of files.
 *
 * @class BaseTask
 */
export default class BaseTask {
  constructor() {
    this.log = bunyan.createLogger({
      name: this.constructor.name,
      level: process.env.NODE_ENV === 'production' ? bunyan.INFO : bunyan.DEBUG,
    });
  }

  /**
   * Simple write function to the disk.
   *
   * @param {string} pathToWrite absolute path to write to
   * @param {Object} data json object to write
   * @param {bunyan} [log=this.log] logger, defaults to this.log
   * @memberof BaseTask
   */
  writeJson(pathToWrite: string, data: Object, log = this.log) {
    log.info(`saving to ${pathToWrite}`);
    fs.outputJson(pathToWrite, data, { spaces: config.jsonSpace });
  }
}
