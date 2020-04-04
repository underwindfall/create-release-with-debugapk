const createRelease = require("./create-release");
const upload = require("./upload-asset");


if (require.main === module) {
  const url = createRelease();
  upload(url);
}

