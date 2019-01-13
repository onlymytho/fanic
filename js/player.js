
var playLists = [
  {"player": undefined, "playListId": "PLUzSnDUUTfrsl7IvzlMDGxXvPWE93cLGG"},
  {"player": undefined, "playListId": "PL9Htg1_aHE0KF7uzMsY_VuT-odtUBuetZ"},
  {"player": undefined, "playListId": "PLdARt-4U-XHEE6F7f1SLbugwG9JbApzmn"},
  {"player": undefined, "playListId": "PLhxsOjDimOoTXRMEz8RLGX1bX08K9HZGS"},
]

var videoPlayer             = document.querySelectorAll(".videoYoutubePlayer")
var videoStarName           = document.querySelectorAll('.videoStarName');
var videoProgressBar        = document.querySelectorAll('.videoProgressBar');
var videoPlayEqualizer      = document.querySelectorAll('.videoPlayEqualizer');
var videoDisplaySwitcher    = document.querySelectorAll('.displaySwitch');

function onYouTubeIframeAPIReady() {
  playLists.forEach((player, index) => {
    player = new YT.Player(
      videoPlayer[index],
      {
        height: '282',
        width: '176',
        playerVars: {
          'loop' : 1,
          'playsinline' : 1,
          'list': player.playListId,
          'listType': 'playlist',
          'index': 0,
          'startSeconds': 0,
          'suggestedQuality': 'small'
        },
        events: {
          // call this function when player is ready to use
          'onReady': this.onPlayerReady,
          'onStateChange': this.onPlayerStateChange
        }
      }
    )
    playLists[index]["player"] = player
    })
  };

    


// play states
var global_playerStatus;
function showPlayState(targetPlayer) {
  let targetPlayerWindow = targetPlayer.a.parentElement
  let targetPlayerStarName = targetPlayerWindow.parentElement.parentElement.querySelector('.videoStarName')
  let targetPlayerEqualizer = targetPlayerWindow.querySelector('.videoPlayEqualizer')
  let targetPlayerVideoItem = targetPlayerWindow.parentElement.parentElement.parentElement
  
  targetPlayerWindow.style.filter = '';
  targetPlayerWindow.classList.add('playing');
  targetPlayerStarName.classList.add('playing');
  if (!targetPlayerVideoItem.classList.contains('fullShow')) {
    videoFullShow(true, targetPlayer);
  }
  videoDisplayOn('others', targetPlayer);
  targetPlayerEqualizer.classList.add('is_playing')
  // videoProgressBar.classList.add('play')
}
function showStopState(targetPlayer) {
  let targetPlayerWindow = targetPlayer.a.parentElement
  let targetPlayerStarName = targetPlayerWindow.parentElement.parentElement.querySelector('.videoStarName')
  let targetPlayerEqualizer = targetPlayerWindow.querySelector('.videoPlayEqualizer')
  is_playing = false;
  targetPlayerWindow.classList.remove('playing')
  targetPlayerStarName.classList.remove('playing')
  targetPlayerEqualizer.classList.remove('is_playing')
  // videoProgressBar.classList.remove('play')
}
function onPlayerStateChange(event) {
  changeBorderColor(event.target, event.data);
  global_playerStatus = event.data;
}
function changeBorderColor(targetPlayer, playerStatus) {
  let targetPlayerWindow = targetPlayer.a.parentElement
  let targetPlayerDisplaySwitcher = targetPlayerWindow.parentElement.parentElement.querySelector('.displaySwitch')
  
  if (playerStatus == -1) { // unstarted

  } else if (playerStatus == 0) { // ended
    ga('send', 'event', 'Ended', 'End music ' + targetPlayer.getPlaylistIndex());
    targetPlayer.nextVideo()
  
  } else if (playerStatus == 1) { // playing
    showPlayState(targetPlayer);
    ga('send', 'event', 'Play', 'Play music ' + targetPlayer.getPlaylistIndex());
    targetPlayerDisplaySwitcher.checked = true;
  
  } else if (playerStatus == 2) { // paused
    showStopState(targetPlayer)
    ga('send', 'event', 'Pause', 'Pause music ' + targetPlayer.getPlaylistIndex());
  
  } else if (playerStatus == 3) { // buffering
    targetPlayerWindow.style.filter = 'brightness(140%) contrast(80%)';
  
  } else if (playerStatus == 5) { // video cued
  }
}


// Disable autoplay on mobile to save user's data
function autoplay_except_for_mobile(targetPlayer) {
  var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if (isMobile) {
    return false;
  }
  else {
    targetPlayer.playVideo();
  }
}


// Set available actions of player
function onPlayerReady(event) {
  let targetPlayer = event.target
  let targetPlayerWindow = targetPlayer.a.parentElement
  let targetPlayerDisplaySwitcher = targetPlayerWindow.parentElement.parentElement.querySelector('.displaySwitch')
  let targetPlayerVideoItem = targetPlayerWindow.parentElement.parentElement.parentElement
  
  targetPlayer.setLoop(true);
  // updateProgressBar(targetPlayer);
  // time_update_interval = setInterval(function () {
  //     updateProgressBar(targetPlayer);
  // }, 1000)
  
  targetPlayerWindow.addEventListener("click", function() {
      if (global_playerStatus == 1) {
        targetPlayer.pauseVideo()
        ga('send', 'event', 'Pause', 'Pause music ' + targetPlayer.getPlaylistIndex(), 'user_action');
      }
      else {
        targetPlayer.playVideo();
        ga('send', 'event', 'Play', 'Play music ' + targetPlayer.getPlaylistIndex(), 'user_action');
      }
    }
  );
  targetPlayerVideoItem.addEventListener("click", function(e) {videoFullShow(false, targetPlayer); e.stopPropagation();});
  targetPlayerVideoItem.addEventListener("scroll", function(e) {e.stopPropagation();});
  targetPlayerDisplaySwitcher.addEventListener("click", function(e) {videoDisplayOn('checkbox', targetPlayer); e.stopPropagation();});
  if (targetPlayer == playLists[0]['player']) {
    autoplay_except_for_mobile(targetPlayer);
  }
}





document.body.onkeyup = function(e){
  if(e.keyCode == 32){
    if (global_playerStatus == 1) {
      player.pauseVideo()
    }
    else {
      player.playVideo();
    }
  }
}


// // Set progress bar
// ['mouseup', 'touchend'].forEach(
//   function(el) {
//     videoProgressBar[playerIndex].addEventListener(el, function(event) {
//       const newTime = player.getDuration() * (event.target.value / 100);
//       player.seekTo(newTime);
//     })    
//   }
// )
// function updateProgressBar(targetPlayer){
//   console.log(targetPlayer)
//   targetPlayer.a.querySelector('.videoProgressBar').value = (targetPlayer.getCurrentTime() / targetPlayer.getDuration()) * 100;
// }



function videoDisplayOn(source, targetPlayer) {
  let targetPlayerWindow = targetPlayer.a.parentElement
  let targetPlayerDisplaySwitcher = targetPlayerWindow.parentElement.parentElement.querySelector('.displaySwitch')
  
  if (source == 'checkbox') {
    targetPlayerWindow.classList.toggle('displayOn');
    var checkbox_status = targetPlayerDisplaySwitcher.checked;
    ga('send', 'event', 'Checkbox', 'Checkbox '+ checkbox_status);
  }
  else {
    targetPlayerWindow.classList.add('displayOn');
  }
}


function videoFullShow(toggle, targetPlayer) {
  let targetPlayerWindow = targetPlayer.a.parentElement
  let targetPlayerVideoItem = targetPlayerWindow.parentElement.parentElement.parentElement
  let targetPlayerVideoItemList = targetPlayerVideoItem.parentElement
  let originOffsetLeft = targetPlayerVideoItem.getBoundingClientRect().x
  let originOffsetTop = targetPlayerVideoItemList.getBoundingClientRect().y
  if (targetPlayerVideoItem.classList.contains('big')) {
    originOffsetTop += 42;
  }

  if (toggle == true) {
    targetPlayerVideoItem.classList.add('fullShow')
    targetPlayerVideoItem.style.transform = 'translate(-' + originOffsetLeft + 'px, -' + originOffsetTop + 'px)'
  } else {
    targetPlayerVideoItem.classList.remove('fullShow')
    targetPlayerVideoItem.style.transform = 'none'
  } 
}


// // threeBarIcon_bar animation by playState
// for (i=1; i<4; i++) {document.getElementById('threeBarIcon_bar'+i).classList.add('play')}
// for (i=1; i<4; i++) {document.getElementById('threeBarIcon_bar'+i).classList.remove('play')}