import fs from 'fs-extra';
import walkJsonDir from '../server/util/walkJsonDir';

jest.mock('fs-extra');

describe('walkJsonDir', () => {
  it('walks the api directory for relevant files', async () => {
    const mockFileSystem = {
      app: {
        api: {
          '2016-2017': {
            'modules.json': '["test"]',
          },
          '2017-2018': {
            'modules.json': '["test1"]',
          },
        },
      },
    };
    fs.setMock(mockFileSystem);
    const expected = {
      '2016-2017': ['test'],
      '2017-2018': ['test1'],
    };
    expect(await walkJsonDir('app/api', 'modules.json')).toEqual(expected);
  });
});
