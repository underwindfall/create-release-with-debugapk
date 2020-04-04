const createRelease = require('./create-release');
const upload = require('./upload-apk');

if (require.main === module) {
  createRelease();
  upload();
}