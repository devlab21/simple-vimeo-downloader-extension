# Simple Vimeo Downloader extension for Google Chrome

From time to time you may need to download video from Vimeo. The main reason for this is offline viewing or viewing with modify options for example playback speed. To solve this requirement current extension inject Simple Vimeo Downloader buttons directly in Vimeo player.

The main implementation concepts:
* provide injection only on user demand
* minimal permissions required

## Used calls to Google Chrome extension API

* [tabs.insertCSS](https://developer.chrome.com/extensions/tabs#method-insertCSS)
* [tabs.executeScript](https://developer.chrome.com/extensions/tabs#method-executeScript)
* [extension.getURL](https://developer.chrome.com/extensions/extension#method-getURL)
