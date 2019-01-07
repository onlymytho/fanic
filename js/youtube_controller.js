// Inject YouTube API script
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

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
var player;

function onYouTubeIframeAPIReady() {
  // create the global player from the specific iframe (#video)
  player = new YT.Player('video', {
    height: '1',
    width: '1',
    playerVars: {
      'loop' : 1,
      'playsinline' : 1,
      'list': 'PLUzSnDUUTfrsl7IvzlMDGxXvPWE93cLGG',
      'listType': 'playlist',
      'index': 0,
      'startSeconds': 0,
      'suggestedQuality': 'small'
    },
    events: {
      // call this function when player is ready to use
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}
var global_playerStatus;
var play_button_role = document.getElementsByClassName('window')[0]
function showPlayState() {
  play_button_role.style.filter = ''
  play_button_role.classList.add('playing')
  document.getElementsByClassName('starName')[0].classList.add('play')
  for (i=1; i<5; i++) {document.getElementById('equalizer_bar'+i).classList.add('play')}
  for (i=1; i<4; i++) {document.getElementById('threeBarIcon_bar'+i).classList.add('play')}
  document.getElementById('progress_bar').classList.add('play')
}
function showStopState() {
  is_playing = false;
  play_button_role.classList.remove('playing')
  document.getElementsByClassName('starName')[0].classList.remove('play')
  for (i=1; i<5; i++) {document.getElementById('equalizer_bar'+i).classList.remove('play')}
  for (i=1; i<4; i++) {document.getElementById('threeBarIcon_bar'+i).classList.remove('play')}
  document.getElementById('progress_bar').classList.remove('play')
}
function onPlayerStateChange(event) {
  changeBorderColor(event.data);
  global_playerStatus = event.data;
}
function changeBorderColor(playerStatus) {
  if (playerStatus == -1) { // unstarted

  } else if (playerStatus == 0) { // ended
    ga('send', 'event', 'Ended', 'End music ' + player.getPlaylistIndex());
    player.nextVideo()
  } else if (playerStatus == 1) { // playing
    showPlayState();
    video_on('others');
    ga('send', 'event', 'Play', 'Play music ' + player.getPlaylistIndex());
    document.querySelector('.content input[type=checkbox]').checked = true;
  } else if (playerStatus == 2) { // paused
    showStopState()
    ga('send', 'event', 'Pause', 'Pause music ' + player.getPlaylistIndex());
  } else if (playerStatus == 3) { // buffering
    play_button_role.style.filter = 'brightness(140%) contrast(80%)';
  } else if (playerStatus == 5) { // video cued
  }
}

// Disable autoplay on mobile to save user's data
function autoplay_except_for_mobile() {
  var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if (isMobile) {
    return false;
  }
  else {
    player.playVideo();
  }
}

// Set available actions of player
function onPlayerReady(event) {
  updateProgressBar();
  // event.target.loadPlaylist(['Mpzg3a-V9MM', 'AT_dnkxNjNk', 'KfqU7CxT2Eo', 'NG96ZzUs', 'isMzP42pxZ4', '_CXlw73qcHU', 'cff80NHja4', '24v14KUpOYE', '9Y5RCGRZg1Y']);
  autoplay_except_for_mobile();
  player.setLoop(true);
  time_update_interval = setInterval(function () {
      updateProgressBar();
  }, 1000)
  // bind events

  play_button_role.addEventListener("click", function() {
      if (global_playerStatus == 1) {
        player.pauseVideo()
        ga('send', 'event', 'Pause', 'Pause music ' + player.getPlaylistIndex(), 'user_action');
      }
      else {
        player.playVideo();
        ga('send', 'event', 'Play', 'Play music ' + player.getPlaylistIndex(), 'user_action');
      }
    }
  )
}

// Set progress bar
var progress_bar = document.getElementById('progress_bar')
progress_bar.addEventListener('mouseup', function(event) {
  var newTime = player.getDuration() * (event.target.value / 100);
  player.seekTo(newTime);
})
progress_bar.addEventListener('touchend', function(event) {
  var newTime = player.getDuration() * (event.target.value / 100);
  player.seekTo(newTime);
})

function updateProgressBar(){
  progress_bar.value = (player.getCurrentTime() / player.getDuration()) * 100;
}