class El {
  constructor(selector, parent=document) {
    document.querySelectorAll(selector);
  };
}

var videoYoutubePlayers     = new El('.videoYoutubePlayer');

// Inject YouTube API script to HTML
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);


// Player 내용 전체를 Class로 컨트롤 하는 건 어떨지? 그러면 모든 플레이어마다 같은 액션들이 가능하도록 묶을 수 있으니까.

class Player {
  constructor(selector, playListId) {
    // create the global player from the specific iframe (#video)
    this.player = new YT.Player(
      document.querySelector(selector),
      {
        height: '100',
        width: '100',
        playerVars: {
          'loop' : 1,
          'playsinline' : 1,
          'list': playListId,
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
    );
    this.playlistId = playlistId
    videoWindow             = new El('.videoWindow', parent=this);
    videoStarName           = new El('.videoStarName', parent=this);
    videoProgressBar        = new El('.videoProgressBar', parent=this);
    videoPlayEqualizer      = new El('.videoPlayEqualizer', parent=this);
    videoDisplaySwitcher    = new El('.displaySwitch', parent=this);

    
    // Set progress bar
    videoProgressBar.addEventListener('mouseup', function(event) {
      const newTime = this.getDuration() * (event.target.value / 100);
      this.seekTo(newTime);
    })
    videoProgressBar.addEventListener('touchend', function(event) {
      const newTime = this.getDuration() * (event.target.value / 100);
      this.seekTo(newTime);
    })


    videoDisplaySwitcher[0].addEventListener("click", function() {
      video_on('checkbox')
    });
  }

  autoplay_except_for_mobile() {
    var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      return false;
    }
    else {
      this.playVideo();
    }
  }

  // Set available actions of player
  onPlayerReady(event) {
    updateProgressBar();
    // event.target.loadPlaylist(['Mpzg3a-V9MM', 'AT_dnkxNjNk', 'KfqU7CxT2Eo', 'NG96ZzUs', 'isMzP42pxZ4', '_CXlw73qcHU', 'cff80NHja4', '24v14KUpOYE', '9Y5RCGRZg1Y']);
    autoplay_except_for_mobile();
    this.setLoop(true);
    time_update_interval = setInterval(function () {
        updateProgressBar();
    }, 1000)
    // bind events

    videoWindow[0].addEventListener("click", function() {
        if (global_playerStatus == 1) {
          this.pauseVideo()
          ga('send', 'event', 'Pause', 'Pause music ' + this.getPlaylistIndex(), 'user_action');
        }
        else {
          this.playVideo();
          ga('send', 'event', 'Play', 'Play music ' + this.getPlaylistIndex(), 'user_action');
        }
      }
    )
  }
  onPlayerStateChange(event) {
    let playerStatus = event.data
    changeBorderColor(event.data);
    global_playerStatus = event.data;

    if (playerStatus == -1) { // unstarted
  
    } else if (playerStatus == 0) { // ended
      ga('send', 'event', 'Ended', 'End music ' + this.getPlaylistIndex());
      this.nextVideo()
    
    } else if (playerStatus == 1) { // playing
      showPlayState();
      video_on('others');
      ga('send', 'event', 'Play', 'Play music ' + this.getPlaylistIndex());
      document.querySelector('.content input[type=checkbox]').checked = true;
    
    } else if (playerStatus == 2) { // paused
      showStopState()
      ga('send', 'event', 'Pause', 'Pause music ' + this.getPlaylistIndex());
    
    } else if (playerStatus == 3) { // buffering
      videoWindow[0].style.filter = 'brightness(140%) contrast(80%)';
    
    } else if (playerStatus == 5) { // video cued
    }
  }
  
  updateProgressBar(){
    videoProgressBar.value = (this.getCurrentTime() / this.getDuration()) * 100;
  }

  video_on(source) {
    if (source == 'checkbox') {
      videoYoutubePlayer[0].classList.toggle('on');
      videoPlayEqualizer[0].classList.toggle('is_playing');
      var checkbox_status = videoDisplaySwitcher.checked;
      ga('send', 'event', 'Checkbox', 'Checkbox '+ checkbox_status);
    }
    else {
      videoYoutubePlayer[0].classList.add('on');
      videoPlayEqualizer[0].classList.add('is_playing');
    }
  }
}






// ------------------------------------------ 이전 코드 ------------------------------------------------

// Init Youtube player
// var player;
// function onYouTubeIframeAPIReady() {
//   // create the global player from the specific iframe (#video)
//   player = new YT.Player(
//     document.querySelector('.videoYoutubePlayer'),
//     {
//       height: '1',
//       width: '1',
//       playerVars: {
//         'loop' : 1,
//         'playsinline' : 1,
//         'list': 'PLUzSnDUUTfrsl7IvzlMDGxXvPWE93cLGG',
//         'listType': 'playlist',
//         'index': 0,
//         'startSeconds': 0,
//         'suggestedQuality': 'small'
//       },
//       events: {
//         // call this function when player is ready to use
//         'onReady': onPlayerReady,
//         'onStateChange': onPlayerStateChange
//       }
//     }
//   );
// }

// // play states
// var global_playerStatus;
// function showPlayState() {
//   videoWindow[0].style.filter = ''
//   videoWindow[0].classList.add('playing')
//   videoStarName[0].classList.add('play')
//   for (i=1; i<5; i++) {document.getElementById('equalizer_bar'+i).classList.add('play')}
//   for (i=1; i<4; i++) {document.getElementById('threeBarIcon_bar'+i).classList.add('play')}
//   videoProgressBar.classList.add('play')
// }
// function showStopState() {
//   is_playing = false;
//   videoWindow[0].classList.remove('playing')
//   videoStarName[0].classList.remove('play')
//   for (i=1; i<5; i++) {document.getElementById('equalizer_bar'+i).classList.remove('play')}
//   for (i=1; i<4; i++) {document.getElementById('threeBarIcon_bar'+i).classList.remove('play')}
//   videoProgressBar.classList.remove('play')
// }
// function onPlayerStateChange(event) {
//   changeBorderColor(event.data);
//   global_playerStatus = event.data;
// }
// function changeBorderColor(playerStatus) {
//   if (playerStatus == -1) { // unstarted

//   } else if (playerStatus == 0) { // ended
//     ga('send', 'event', 'Ended', 'End music ' + player.getPlaylistIndex());
//     player.nextVideo()
  
//   } else if (playerStatus == 1) { // playing
//     showPlayState();
//     video_on('others');
//     ga('send', 'event', 'Play', 'Play music ' + player.getPlaylistIndex());
//     document.querySelector('.content input[type=checkbox]').checked = true;
  
//   } else if (playerStatus == 2) { // paused
//     showStopState()
//     ga('send', 'event', 'Pause', 'Pause music ' + player.getPlaylistIndex());
  
//   } else if (playerStatus == 3) { // buffering
//     videoWindow[0].style.filter = 'brightness(140%) contrast(80%)';
  
//   } else if (playerStatus == 5) { // video cued
//   }
// }


// // Disable autoplay on mobile to save user's data
// function autoplay_except_for_mobile() {
//   var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
//   if (isMobile) {
//     return false;
//   }
//   else {
//     player.playVideo();
//   }
// }


// // Set available actions of player
// function onPlayerReady(event) {
//   updateProgressBar();
//   // event.target.loadPlaylist(['Mpzg3a-V9MM', 'AT_dnkxNjNk', 'KfqU7CxT2Eo', 'NG96ZzUs', 'isMzP42pxZ4', '_CXlw73qcHU', 'cff80NHja4', '24v14KUpOYE', '9Y5RCGRZg1Y']);
//   autoplay_except_for_mobile();
//   player.setLoop(true);
//   time_update_interval = setInterval(function () {
//       updateProgressBar();
//   }, 1000)
//   // bind events

//   videoWindow[0].addEventListener("click", function() {
//       if (global_playerStatus == 1) {
//         player.pauseVideo()
//         ga('send', 'event', 'Pause', 'Pause music ' + player.getPlaylistIndex(), 'user_action');
//       }
//       else {
//         player.playVideo();
//         ga('send', 'event', 'Play', 'Play music ' + player.getPlaylistIndex(), 'user_action');
//       }
//     }
//   )
// }
// document.body.onkeyup = function(e){
//   if(e.keyCode == 32){
//     if (global_playerStatus == 1) {
//       player.pauseVideo()
//     }
//     else {
//       player.playVideo();
//     }
//   }
// }


// // Set progress bar
// ['mouseup', 'touchend'].forEach(
//   function(el) {
//     videoProgressBar.addEventListener(el, function(event) {
//       const newTime = player.getDuration() * (event.target.value / 100);
//       player.seekTo(newTime);
//     })    
//   }
// )
// function updateProgressBar(){
//   videoProgressBar.value = (player.getCurrentTime() / player.getDuration()) * 100;
// }



// function video_on(source) {
//   if (source == 'checkbox') {
//     videoYoutubePlayer[0].classList.toggle('on');
//     videoPlayEqualizer[0].classList.toggle('is_playing');
//     var checkbox_status = document.querySelector('.content input[type=checkbox]').checked;
//     ga('send', 'event', 'Checkbox', 'Checkbox '+ checkbox_status);
//   }
//   else {
//     videoYoutubePlayer[0].classList.add('on');
//     videoPlayEqualizer[0].classList.add('is_playing');
//   }
// }