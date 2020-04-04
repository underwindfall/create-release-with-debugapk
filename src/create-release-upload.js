const core = require("@actions/core");
const { GitHub, context } = require("@actions/github");
const fs = require("fs");

async function createReleaseAndUpload() {
  try {
    // Get authenticated GitHub client (Ocktokit): https://github.com/actions/toolkit/tree/master/packages/github#usage
    const github = new GitHub(process.env.GITHUB_TOKEN);

    // Get owner and repo from context of payload that triggered the action
    const { owner, repo } = context.repo;

    // Get the inputs from the workflow file: https://github.com/actions/toolkit/tree/master/packages/core#inputsoutputs
    const tagName = core.getInput("tag_name", { required: true }).toString();

    // This removes the 'refs/tags' portion of the string, i.e. from 'refs/tags/v1.10.15' to 'v1.10.15'
    const tag = tagName.includes("refs/tags/")
      ? tagName.replace("refs/tags/", "")
      : tagName;
    const releaseInput = core
      .getInput("release_name", { required: false })
      .toString();
    let releaseInputName = "";
    if (releaseInput === undefined) {
      releaseInputName = `Release ${tag}`;
    } else {
      releaseInputName = releaseInput;
    }
    const releaseName = releaseInputName.includes("refs/tags/")
      ? releaseInputName.replace("refs/tags/", "")
      : releaseInputName;
    const body = core.getInput("body", { required: false });
    const draft = core.getInput("draft", { required: false }) === "true";
    const prerelease =
      core.getInput("prerelease", { required: false }) === "true";

    // Create a release
    // API Documentation: https://developer.github.com/v3/repos/releases/#create-a-release
    // Octokit Documentation: https://octokit.github.io/rest.js/#octokit-routes-repos-create-release
    const createReleaseResponse = await github.repos.createRelease({
      owner,
      repo,
      tag_name: tag,
      name: releaseName,
      body,
      draft,
      prerelease
    });

    // Get the ID, html_url, and upload URL for the created Release from the response
    const {
      data: { id: releaseId, html_url: htmlUrl, upload_url: uploadUrl }
    } = createReleaseResponse;

    // Set the output variables for use by other actions: https://github.com/actions/toolkit/tree/master/packages/core#inputsoutputs
    core.setOutput("id", releaseId);
    core.setOutput("html_url", htmlUrl);
    core.setOutput("upload_url", uploadUrl);
    const assetPath = core.getInput("asset_path", { required: true });
    const assetName = core.getInput("asset_name", { required: true });
    const assetContentType = core.getInput("asset_content_type", {
      required: true
    });
    console.log("uploadUrl", uploadUrl);
    // Determine content-length for header to upload asset
    const contentLength = filePath => fs.statSync(filePath).size;

    // Setup headers for API call, see Octokit Documentation: https://octokit.github.io/rest.js/#octokit-routes-repos-upload-release-asset for more information
    const headers = {
      "content-type": assetContentType,
      "content-length": contentLength(assetPath)
    };

    // Upload a release asset
    // API Documentation: https://developer.github.com/v3/repos/releases/#upload-a-release-asset
    // Octokit Documentation: https://octokit.github.io/rest.js/#octokit-routes-repos-upload-release-asset
    const uploadAssetResponse = await github.repos.uploadReleaseAsset({
      url: uploadUrl,
      headers,
      name: assetName,
      data: fs.readFileSync(assetPath)
    });

    // Get the browser_download_url for the uploaded release asset from the response
    const {
      data: { browser_download_url: browserDownloadUrl }
    } = uploadAssetResponse;

    // Set the output variable for use by other actions: https://github.com/actions/toolkit/tree/master/packages/core#inputsoutputs
    core.setOutput("browser_download_url", browserDownloadUrl);
  } catch (error) {
    core.setFailed(error.message);
  }
}

module.exports = createReleaseAndUpload;
