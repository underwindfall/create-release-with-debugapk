const createRelease = require('./create-release');
const upload = require('./upload-asset');

if (require.main === module) {
  createRelease();
  upload();
}