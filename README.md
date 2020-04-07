# create-release-with-debugapk
![Build and Check](https://github.com/underwindfall/create-release-with-debugapk/workflows/Build%20and%20Check/badge.svg)

This is a github workflow action to create a release with an additional apk as an attachment. 

## Inputs

### GITHUB_TOKEN

**required**  used as deploy key

### tag_name
**required**  tag version (such as v1.0.0 etc.)

### asset_path
**required**  used as give which place to get apk

### asset_name
**required**  used as display name

### asset_content_type 
**required**  used as assent type

## Outputs
### `id`
'The ID of the created Release'
### `html_url` 
'The URL users can navigate to in order to view the release'
### `browser_download_url`
'The URL users can navigate to in order to download the uploaded asset'

## Example Real Implementation
Here is a real implementation of creating release with debug apk by using this `Github Action` [PowerPermission Release Apk](https://github.com/underwindfall/PowerPermission/blob/master/.github/workflows/release.yml)

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

## License

```
MIT License

Copyright (c) 2020 Qifan Yang

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
