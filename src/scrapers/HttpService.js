import path from 'path';
import fs from 'fs-extra';
import { URL, URLSearchParams } from 'url';
import normalizeUrl from 'normalize-url';
import sanitizeFilename from 'sanitize-filename';
import axios from 'axios';
import bunyan from 'bunyan';

import config from '../../config';

const log = bunyan.createLogger({
  name: 'HttpService',
  level: process.env.NODE_ENV === 'production' ? bunyan.INFO : bunyan.DEBUG,
});

/**
 * Converts url string to equivalent valid filename.
 */
function getCacheFilePath(urlStr, params) {
  const cachePath = config.defaults.cachePath;
  const url = new URL(urlStr);
  console.log(url);
  const normalizedUrl = normalizeUrl(urlStr, { removeDirectoryIndex: true });
  // https://nodejs.org/docs/latest/api/url.html#url_url_strings_and_url_objects
  const { hostname, pathname, search } = new URL(normalizedUrl);
  const pathArray = [cachePath, hostname, pathname];

  if (!search) {
    pathArray.push('index.html');
  } else {
    const readableSearchString = decodeURIComponent(search);
    pathArray.push(sanitizeFilename(readableSearchString));
  }
  return path.join(...pathArray);
}

/**
 * Gets the time the file was last modified if it exists, null otherwise.
 */
async function getFileModifiedTime(cachedPath, urlStr) {
  try {
    const stats = await fs.stat(cachedPath);
    if (stats.isFile()) {
      return stats.mtime;
    }
    log.error(`${cachedPath} is not a file`);
  } catch (err) {
    log.debug(`no cached file for ${urlStr}`);
  }
  return null;
}

const HttpService = axios.create({
  validateStatus: status => status >= 200 && (status < 300 && status !== 304),
});

HttpService.interceptors.request.use(async (request) => {
  // Only cache GET requests
  if (request.method === 'get') {
    let url = request.url;
    if (request.params) {
      url += `?${new URLSearchParams(request.params).toString()}`;
    }

    const { maxCacheAge = config.defaults.maxCacheAge } = request;


    const cachedFilePath = getCacheFilePath(url);
    const modifiedTime = await getFileModifiedTime(cachedFilePath, url);

    const isCachedFileValid = modifiedTime && modifiedTime > Date.now() - maxCacheAge * 1000;

    if (maxCacheAge === -1 || isCachedFileValid) {
      request.isCached = true;
      request.data = await fs.readFile(cachedFilePath, 'utf8');
      // Set the request adapter to send the cached response and prevent the request from actually running
      request.adapter = () => Promise.resolve({
        data: request.data,
        status: request.status,
        statusText: request.statusText,
        headers: request.headers,
        config: request,
        request,
      });
    }
  }
  return request;
});

HttpService.interceptors.response.use((response) => {
  const { params, isCached = false } = response.config;
  let { url } = response.config;
  if (params) {
    url += `?${new URLSearchParams(params).toString()}`;
  }
  if (isCached) {
    return response;
  }
  const cachedFilePath = getCacheFilePath(url);
  fs.outputFile(cachedFilePath, response.data);
  return response;
});

export default HttpService;
export { getCacheFilePath, getFileModifiedTime };

HttpService('https://www.example.com', { params: { x: 'ouch' }, lel: 'lol' })
  .then((res) => {
    console.log(res.data.slice(0, 15));
  })
  .catch((error) => {
    console.error(error);
  });
