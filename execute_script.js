(function () {
  function isLogoToSidedockElemenAdded(sidedockElement) {
    return document.querySelector(".__svd-logo__") !== null;
  }

  function logoToSidedockElemenAdd(sidedockElement) {
    var svdLogo = document.createElement('div');
    svdLogo.classList.add('box', '__svd-logo__');
    svdLogo.innerHTML = "<img src='" + injectIconURL + "'/>";
    sidedockElement.appendChild(svdLogo);
  }

  function logoFromSidedockElemenDel(sidedockElement) {
    document.querySelector(".__svd-logo__").remove();
  }

  function downloadOptionsFromVimeoJSONToSidedockElemenAdd(vimeoJSON, sidedockElement) {
    var vimeoDownloadArray = vimeoJSON.request.files.progressive;
    vimeoDownloadArray.sort(vimeoDownloadCompare).reverse();
    vimeoDownloadArray.forEach(function (e) {
      var element = document.createElement('div');
      element.classList.add('box', '__svd-download__');
      element.innerHTML = "<a download href='" + e.url + "' target='_blank' title='Download " + e.quality + " with " + e.fps + "fps'><button class='rounded-box'>" + e.quality + "</button></a>";
      sidedockElement.appendChild(element);
    });
  }

  function vimeoDownloadCompare(a, b) {
    aquality = parseInt(a.quality);
    afps = a.fps;
    bquality = parseInt(b.quality);
    bfps = b.fps;
    if (aquality === bquality) {
      if (afps === bfps) {
        return 0;
      } else if (afps < bfps) {
        return -1;
      } else {
        return 1;
      }
    } else if (aquality < bquality) {
      return -1;
    } else {
      return 1;
    }
  }

  var injectIconURL = chrome.extension.getURL("inject_icon.svg");

  var vimeoSite = false;
  var vimeoSiteMatch = /:\/\/vimeo\.com.*\/(\d+).*/g.exec(document.URL);
  if (vimeoSiteMatch !== null) {
    vimeoSite = true;
    var vimeoSiteVideoId = vimeoSiteMatch[1];
  }

  if (window === top) {
    if (vimeoSite) {
      console.log('Inject Simple Vimeo Downloader Button into vimeo player on vimeo site');
    } else {
      console.log('Inject Simple Vimeo Downloader Button into vimeo player on embed site');
    }
  }

  var sidedockElement = document.querySelector(".controls-wrapper > .sidedock, .vp-controls-wrapper > .vp-sidedock");
  if (sidedockElement === null) {
    console.log('  vimeo player is absent on [' + document.URL + ']');
    return { status: 'player-absent' };
  } else {
    if (isLogoToSidedockElemenAdded(sidedockElement)) {
      console.log('  already injected in vimeo player on [' + document.URL + ']');
      return { status: 'already-injected' };
    } else {
      logoToSidedockElemenAdd(sidedockElement);

      if (vimeoSite) {
        var httpRequest = new XMLHttpRequest();
        var videoConfigURL = 'https://player.vimeo.com/video/' + vimeoSiteVideoId + '/config';
        httpRequest.open('GET', videoConfigURL);
        httpRequest.onreadystatechange = function () {
          if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === 200) {
              var vimeoJSON = JSON.parse(httpRequest.responseText);
              downloadOptionsFromVimeoJSONToSidedockElemenAdd(vimeoJSON, sidedockElement);
              console.log('  successful injected in vimeo player on [' + document.URL + '] with video title - ' + vimeoJSON.video.title);
            } else {
              logoFromSidedockElemenDel(sidedockElement);
              console.log('  AJAX request to [' + videoConfigURL + '] fail with status [' + httpRequest.statusText + ']');
            }
          }
        };
        httpRequest.send();
        return { status: 'async-injecting' };
      } else {
        var scriptList = document.getElementsByTagName('script');
        for (var i = 0; i < scriptList.length; i++) {
          var script = scriptList[i];
          var vimeoMatch = /({[^{]*"[\s\S]*?request[\s\S]*?files[\s\S]*?progressive[\s\S]*?});/gm.exec(script.text);
          if (vimeoMatch !== null) {
            var vimeoJSON = JSON.parse(vimeoMatch[1]);
            downloadOptionsFromVimeoJSONToSidedockElemenAdd(vimeoJSON, sidedockElement);

            console.log('  successful injected in vimeo player on [' + document.URL + '] with video title - ' + vimeoJSON.video.title);
            return { status: 'successful-injected' };
          }
        }
        console.log('  can not find proper vimeo player script on [' + document.URL + ']');
        return { status: 'script-absent' };
      }
    }
  }
})();
