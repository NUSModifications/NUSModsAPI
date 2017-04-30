import fs from 'fs-extra';

async function walkApi(folderPath) {
  const dir = await fs.readdir(folderPath);
  return dir;
}

export default walkApi;
