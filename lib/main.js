// Transformers
let worker = require("page-worker").Page({
  contentURL: require("self").data.url("audio.html"),
  contentScript:
    "onMessage = function(sound) { document.getElementById(sound == 2 ? 'transform-down' : 'transform').play(); };" +
    "postMessage('Autobots, roll out!');",
  onMessage: init
});

function playSound(down) {
  worker.postMessage(1);
}

function playSoundDown() {
  worker.postMessage(2);
}

function init() {
  const wu = require("window-utils");
  new wu.WindowTracker({
    onTrack: function setupWindow(window) {
      playSound();
      /*
      window.addEventListener("load", function(e) {
        if (e.target == window)
          playSound();
      }, false);
      */
      window.addEventListener("popupshowing", playSound, false);
      window.addEventListener("popuphidden", playSoundDown, false);
    },
    onUntrack: function unsetupWindow(window) {
      playSoundDown();
      //window.removeEventListener("load", playSound, false);
      window.removeEventListener("popupshowing", playSound, false);
      window.removeEventListener("popuphidden", playSoundDown, false);
    }
  });

  let tabs = require("tabs");
  tabs.on('open', playSound);
  tabs.on('close', playSoundDown);
}
