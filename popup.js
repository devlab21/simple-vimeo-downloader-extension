window.addEventListener("load", function () {
  chrome.tabs.insertCSS(
    {
      file: 'insert.css',
      allFrames: true
    },
    function () {
      chrome.tabs.executeScript(
        {
          file: 'execute_script.js',
          allFrames: true
        },
        function (resultArray) {
          var section = document.querySelector('body>section');
          var asyncInjectingCounter = 0;
          var successfulInjectedCounter = 0;
          var alreadyInjectedCounter = 0;
          var playerAbsentCounter = 0;
          var scriptAbsentCounter = 0;
          resultArray.forEach(function (result) {
            if (result.status === 'async-injecting') {
              asyncInjectingCounter++;
            } else if (result.status === 'successful-injected') {
              successfulInjectedCounter++;
            } else if (result.status === 'already-injected') {
              alreadyInjectedCounter++;
            } else if (result.status === 'player-absent') {
              playerAbsentCounter++;
            } else if (result.status === 'script-absent') {
              scriptAbsentCounter++;
            }
          });

          var message = '';
          if (asyncInjectingCounter > 0) {
            message = 'Async Injecting'
          } else if (successfulInjectedCounter === 0 && alreadyInjectedCounter === 0) {
            message = 'No Injection Occur';
          } else {
            if (successfulInjectedCounter > 0) {
              message += 'Successful Injected in ' + successfulInjectedCounter + ' video player(s)<br/>'
            }
            if (alreadyInjectedCounter > 0) {
              message += 'Already Injected in ' + alreadyInjectedCounter + ' video player(s)<br/>'
            }
          }
          section.innerHTML = message;
        }
      )
    }
  )
});
