const chromeProvider = require('testcafe/lib/browser/provider/built-in/dedicated/chrome')

const fs = require('fs')

const JPEG_QUALITY = 100

module.exports = {
  ...chromeProvider,

  async takeScreenshot (browserId, screenshotPath, pageWidth, pageHeight, fullPage, format) {
    const { browserClient, config, emulatedDevicePixelRatio } = this.openedBrowsers[browserId]
    const client = await browserClient.getActiveClient()
    let viewportWidth = 0
    let viewportHeight = 0

    // Resize to full page.
    if (fullPage) {
      const { contentSize, visualViewport } = await client.Page.getLayoutMetrics()

      await client.Emulation.setDeviceMetricsOverride({
        width: Math.ceil(contentSize.width),
        height: Math.ceil(contentSize.height),
        deviceScaleFactor: emulatedDevicePixelRatio,
        mobile: config.mobile
      })

      viewportWidth = visualViewport.clientWidth
      viewportHeight = visualViewport.clientHeight
    }

    // Take screenshot.
    const screenshotFormat = (config.userArgs.match(/--screenshot-format=([^\s]*)/) || []).pop() || 'png'
    const screenshotData = (await client.Page.captureScreenshot({ format: screenshotFormat, quality: JPEG_QUALITY })).data

    // Resize back.
    if (fullPage) {
      if (config.emulation) {
        await client.Emulation.setDeviceMetricsOverride({
          width: config.width || viewportWidth,
          height: config.height || viewportHeight,
          deviceScaleFactor: emulatedDevicePixelRatio,
          mobile: config.mobile
        })
      } else {
        await client.Emulation.clearDeviceMetricsOverride()
      }
    }

    // Save to file.
    const imagePath = screenshotPath.replace(/\.png$/, `.${screenshotFormat}`)
    fs.writeFileSync(imagePath, screenshotData, 'base64')
  }
}
