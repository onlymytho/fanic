import React, { Component } from 'react';
import PropTypes from 'prop-types';
import YouTube from 'react-youtube';
// import Player from './player';

class VideoItem extends Component {
    static propTypes = {
        name: PropTypes.any,
        color: PropTypes.any,
        size: PropTypes.any,
        playList: PropTypes.any,
        playState: PropTypes.any,
    }

    constructor(propTypes) {
        super(propTypes);
        this.state = {isPlaying: false};

        this._onReady = this._onReady.bind(this);
        this._onPause = this._onPause.bind(this);
        this._onPlay = this._onPlay.bind(this);
    }

    _onReady(e) {
        e.target.pauseVideo();
        console.log('ready')
    }
    _onPause(e) {
        console.log('pause')
    }
    
    _onPlay(e) {
        // access to player in all event handlers via event.target
        console.log(e.data)
        console.log('play')
        this.setState({
            isPlaying: true
        });
        console.log(this.state.isPlaying)

        // player = event.target
        // player.pauseVideo();

        // let targetPlayerWindow = targetPlayer.a.parentElement
        // let targetPlayerStarName = targetPlayerWindow.parentElement.parentElement.querySelector('.videoStarName')
        // let targetPlayerEqualizer = targetPlayerWindow.querySelector('.videoPlayEqualizer')
        // let targetPlayerVideoItem = targetPlayerWindow.parentElement.parentElement.parentElement
        
        // targetPlayerWindow.style.filter = '';
        // targetPlayerWindow.classList.add('playing');
        // targetPlayerStarName.classList.add('playing');
        // if (!targetPlayerVideoItem.classList.contains('fullShow')) {
        //   videoFullShow(true, targetPlayer);
        // }
        // videoDisplayOn('others', targetPlayer);
        // targetPlayerEqualizer.classList.add('is_playing')


        // videoProgressBar.classList.add('play')
    }
    render() {
        const isPlaying = this.state.isPlaying
        const classNameWithPlaying = (className) => {return className + (isPlaying ? " playing" : '')};
        const videoItemClassName = "videoItem " + this.props.size + ' ' + this.props.color;
        const opts = {
            playerVars: {
                'loop' : 1,
                'playsinline' : 1,
                'list': this.props.playList,
                'listType': 'playlist',
                'index': 0,
                'startSeconds': 0,
                'suggestedQuality': 'small'
            }
        }
        return (
            <li className={videoItemClassName}>
                <div className="videoFullShowWrapper">
                    <div className={classNameWithPlaying("videoStarName")}>
                        { this.props.name }
                        <input className="displaySwitch" type="checkbox" name="button"/>
                    </div>
                    <div className="video">
                        <div className={classNameWithPlaying("videoWindow")}>
                            <YouTube
                                className='ytPlayer'                // defaults -> null
                                opts={opts}                        // defaults -> {}
                                onReady={this._onReady}
                                onPlay={this._onPlay}
                                onPause={this._onPause}
                            />
                            <div className={classNameWithPlaying("videoPlayEqualizer")}>
                                <div id="equalizer_bar1" className="equalizer_bar"></div>
                                <div id="equalizer_bar2" className="equalizer_bar"></div>
                                <div id="equalizer_bar3" className="equalizer_bar"></div>
                                <div id="equalizer_bar4" className="equalizer_bar"></div>
                            </div>
                        </div>
                        <div className="control_bar">
                        <input type="range" className="videoProgressBar"/>
                        </div>
                    </div>
                </div>
            </li>
        )
    };
}

export default VideoItem;