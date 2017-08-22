import { getCacheFilePath, getFileModifiedTime } from './HttpService';

jest.mock('fs');
jest.mock('../../config.js', () => ({
  defaults: {
    cachePath: 'testBase',
  },
}));

describe('getCacheFilePath', () => {
  const getFilePath = urlStr => getCacheFilePath(urlStr, 'testBase');

  it('should output root to domain with index.html', () => {
    expect(getFilePath('https://www.example.com')).toBe('testBase/example.com/index.html');
    expect(getFilePath('https://www.example.com/test')).toBe('testBase/example.com/test/index.html');
  });

  it('should normalize url', () => {
    const expectedOutput = 'testBase/example.com/index.html';
    expect(getFilePath('https://www.example.com')).toBe(expectedOutput);
    expect(getFilePath('https://www.example.com:80')).toBe(expectedOutput);
    expect(getFilePath('http://www.example.com')).toBe(expectedOutput);
    expect(getFilePath('http://example.com/')).toBe(expectedOutput);
    expect(getFilePath('//example.com/')).toBe(expectedOutput);
    expect(getFilePath('http://example.com/index.html')).toBe(expectedOutput);
    expect(getFilePath('http://www.example.com/#context')).toBe(expectedOutput);
    expect(getFilePath('//www.example.com/?a=1&b=2')).toBe(getFilePath('//www.example.com/?b=2&a=1'));
  });

  it('should output queries to file savable format', () => {
    expect(getFilePath('https://www.example.com/?query="test"&x="test"')).toBe('testBase/example.com/query=test&x=test');
    expect(getFilePath('https://www.example.com/?query=123')).toBe('testBase/example.com/query=123');
    expect(getFilePath('https://www.example.com/?<te>')).toBe('testBase/example.com/te');
  });

  it('should split subpaths to many different subfolders', () => {
    expect(getFilePath('https://www.example.com/test/?query="test"')).toBe('testBase/example.com/test/query=test');
    expect(getFilePath('https://www.example.com/1/2/?query=123')).toBe('testBase/example.com/1/2/query=123');
    expect(getFilePath('https://www.example.com/1/2/hex')).toBe('testBase/example.com/1/2/hex/index.html');
  });
});

describe('getFileModifiedTime', () => {
  require('fs').stat = () => ({
    isFile: () => true,
    mtime: Date.now(),
  });

  it('should output the modified time of a file', () => {
    expect(getFileModifiedTime('__mocks__/fixtures/test1.pdf'));
  });
});
