import React from 'react';
// import logo from './logo.svg';
import VideoItem from './videoItem/index';
import './App.scss';


function App() {
  return (
    <div className="App">
      <header className="App-header">
      <nav className="starListNav">
      <a href='' className="starListNavLabel">
          <div className="threeBarIcon">
            <div className="threeBarIcon_bar" id="threeBarIcon_bar1"></div>
            <div className="threeBarIcon_bar" id="threeBarIcon_bar2"></div>
            <div className="threeBarIcon_bar" id="threeBarIcon_bar3"></div>
          </div>
          <div className="fanicLogo">
            Fanic
          </div>
      </a>
    </nav>
    <div className="content">
      <div className="videoListDiv">
        <ul className="videoList">
          <VideoItem name="Park Hyoshin" size="big" color="red" playList="PLUzSnDUUTfrsl7IvzlMDGxXvPWE93cLGG" />
          <VideoItem name="Beomjune Jang" size="regular" color="mustard" playList="PL9Htg1_aHE0KF7uzMsY_VuT-odtUBuetZ" />
          <VideoItem name="Yerin Baek" size="regular" color="blue" playList="PLdARt-4U-XHEE6F7f1SLbugwG9JbApzmn" />
          <VideoItem name="PREP" size="regular" color="jade" playList="PLhxsOjDimOoTXRMEz8RLGX1bX08K9HZGS" />
        </ul>
      </div>
    </div>

    <script type="text/javascript" src="./js/player.js"></script>
    {/* <script type="text/javascript" src="./js/youtube_controller.js"></script> */}
    <script type="text/javascript" src="./js/view_list.js"></script>
      </header>
    </div>
  );
}

export default App;
