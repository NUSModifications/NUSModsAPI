import path from 'path';

const fs = jest.genMockFromModule('fs-extra');

// This is a custom function that our tests can use during setup to specify
// what the files on the "mock" filesystem should look like when any of the
// `fs` APIs are used.
let mockFiles = {};
function setMockFiles(newMockFiles) {
  mockFiles = {};
  Object.keys(newMockFiles).forEach((file) => {
    const dir = path.dirname(file);
    if (!mockFiles[dir]) {
      mockFiles[dir] = [];
    }
    mockFiles[dir].push(path.basename(file));
  });
}

// A custom version of `readdir` that reads from the special mocked out
// file list set via setMockFiles
async function readdir(directoryPath) {
  return mockFiles[directoryPath] || [];
}

fs.setMockFiles = setMockFiles;
fs.readdir = readdir;

module.exports = fs;
