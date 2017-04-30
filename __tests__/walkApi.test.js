import fs from 'fs-extra';
import walkApi from '../server/util/walkApi';

jest.mock('fs-extra');

describe('walkApi', () => {
  const MOCK_FILE_INFO = {
    '2016-2017/modules': '',
    '2015-2016/modules': '',
  };
  beforeEach(() => {
    // Set up some mocked out file info before each test
    fs.setMockFiles(MOCK_FILE_INFO);
  });

  it('walks the api directory for relevant files', async () => {
    expect(await walkApi('')).toEqual([]);
  });
});
