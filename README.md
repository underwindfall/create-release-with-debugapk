# create-release-with-debugapk
This is a github workflow action to create a release with an additional apk as an attachment. 

## Inputs

### GITHUB_TOKEN

**required**  used as deploy key

### tag_name
**required**  used as deploy key

### asset_path
**required**  used as give which place to get apk

### asset_name
**required**  used as display name

### asset_content_type 
**required**  used as assent type

## Outputs
### `id`
'The ID of the created Release'
### `html_url
'The URL users can navigate to in order to view the release'
### `browser_download_url`
'The URL users can navigate to in order to download the uploaded asset'

## Example Usage

```yaml
name: CI

on:
  push:
    branches: 
      - master

jobs:

  build:

    runs-on: ubuntu-18.04


    steps:

    - uses: actions/checkout@v2
      
    - name: Use Java8
      uses: actions/setup-java@v1
      with:
          java-version: 1.8

    - name: Build debug apk
      run: ./gradlew clean assembleDebug

    - name: Create release and upload apk
      uses: underwindfall/create-release-with-debugapk@V0.0.4
      env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      with:
        tag_name: v1.0.0
        asset_path: app/build/outputs/apk/debug/app-debug.apk
        asset_name: Example.apk
        asset_content_type: application/zip
```