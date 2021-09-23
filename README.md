TestCafe browser provider for Chrome with customizable screenshot format

## Background

* Chrome's [`Page.captureScreenshot()`](https://chromedevtools.github.io/devtools-protocol/tot/Page/#method-captureScreenshot) is on average three times faster for JPEG and WebP opposed to PNG. This has significant benefits when comparing screenshots for a large test suite.
* TestCafe's PNG postprocessing is slow ([original issue here](https://github.com/DevExpress/testcafe/issues/3932)).

## Solution

* Using JPEG or WebP formats in Chrome and ignoring TestCafe's postprocessing significantly improves performance.
* JPEG quality is set 100 to minimise the artifacts. Artifacts should not matter much for JPEG to JPEG comparison on the same platform. The comparison should be always done on the same environment (e.g. in Docker).
* Fragment screenshots are not supported.

## Usage

Install:
```bash
npm install testcafe-browser-provider-chromex
```

Run:
```bash
testcafe chromex:chrome --screenshot-format=<format> my-test.js
# Where the format is one of: jpeg, webp or png (default).
```
